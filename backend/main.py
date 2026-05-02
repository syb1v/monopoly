# backend/main.py
from contextlib import asynccontextmanager
import json
import uuid
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import init_db, get_db
from models import GameRoom, GameState
from game_logic import Game


# ── In-memory registry: room_id -> Game instance ──────────────────────────────
games: dict[str, Game] = {}
# room_id -> list[WebSocket]
connections: dict[str, list[WebSocket]] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _save_game(room_id: str, db: Session):
    """Persist the current in-memory game state to the DB."""
    if room_id not in games:
        return
    gs = db.query(GameState).filter_by(room_id=room_id).first()
    if gs:
        gs.set_state(games[room_id].to_dict())
    else:
        gs = GameState(room_id=room_id)
        gs.set_state(games[room_id].to_dict())
        db.add(gs)
    db.commit()


def _load_game(room_id: str, db: Session) -> Game:
    """Load game from DB into memory, or return existing in-memory instance."""
    if room_id in games:
        return games[room_id]
    gs = db.query(GameState).filter_by(room_id=room_id).first()
    if gs and gs.state_json and gs.state_json != "{}":
        game = Game.from_dict(gs.get_state())
    else:
        game = Game()
    games[room_id] = game
    return game


async def broadcast_state(room_id: str):
    if room_id not in games or room_id not in connections:
        return
    state_message = {"type": "STATE_UPDATE", "state": games[room_id].get_state()}
    dead = []
    for ws in connections[room_id]:
        try:
            await ws.send_json(state_message)
        except Exception:
            dead.append(ws)
    for ws in dead:
        connections[room_id].remove(ws)


# ── REST: Rooms ────────────────────────────────────────────────────────────────

@app.get("/rooms")
def list_rooms(db: Session = Depends(get_db)):
    rooms = db.query(GameRoom).filter_by(status="active").all()
    return [
        {"id": r.id, "name": r.name, "created_at": r.created_at.isoformat()}
        for r in rooms
    ]


@app.post("/rooms")
def create_room(db: Session = Depends(get_db)):
    room_id = uuid.uuid4().hex[:8]
    room = GameRoom(id=room_id, name=f"Игра #{room_id}")
    db.add(room)
    db.commit()
    db.refresh(room)
    # Pre-create empty game state row
    gs = GameState(room_id=room_id)
    gs.set_state({})
    db.add(gs)
    db.commit()
    games[room_id] = Game()
    connections[room_id] = []
    return {"id": room_id, "name": room.name}


@app.delete("/rooms/{room_id}")
def end_room(room_id: str, db: Session = Depends(get_db)):
    room = db.query(GameRoom).filter_by(id=room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room.status = "finished"
    db.commit()
    # Clean up memory
    games.pop(room_id, None)
    connections.pop(room_id, None)
    return {"ok": True}


# ── WebSocket ──────────────────────────────────────────────────────────────────

@app.websocket("/ws/{room_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, client_id: str, player_name: str = None):
    # Verify room exists and is active
    db = next(get_db())
    room = db.query(GameRoom).filter_by(id=room_id, status="active").first()
    if not room:
        await websocket.close(code=4004)
        return

    await websocket.accept()

    # Ensure room connections list exists
    if room_id not in connections:
        connections[room_id] = []
    connections[room_id].append(websocket)

    # Load (or resume) game
    game = _load_game(room_id, db)
    game.add_player(client_id, player_name)
    _save_game(room_id, db)
    await broadcast_state(room_id)

    try:
        while True:
            data = await websocket.receive_text()
            action = json.loads(data)

            if action.get("type") == "ROLL_DICE":
                game.roll_dice(client_id)

            elif action.get("type") == "END_TURN":
                game.end_turn(client_id)

            elif action.get("type") == "LOG_EVENT":
                msg = action.get("message")
                if msg:
                    player_name = game.players.get(client_id, {}).get("name", "Игрок")
                    game.log_event(f"{player_name}: {msg}")

            elif action.get("type") == "BUY_PROPERTY":
                property_id = action.get("propertyId")
                price = action.get("price")
                if property_id and price is not None:
                    game.buy_property(client_id, property_id, price)

            elif action.get("type") == "DECLINE_BUY":
                game.decline_buy(client_id)

            elif action.get("type") == "MORTGAGE_PROPERTY":
                property_id = action.get("propertyId")
                if property_id:
                    game.mortgage_property(client_id, property_id)

            elif action.get("type") == "UNMORTGAGE_PROPERTY":
                property_id = action.get("propertyId")
                if property_id:
                    game.unmortgage_property(client_id, property_id)

            elif action.get("type") == "BUILD_HOUSE":
                property_id = action.get("propertyId")
                if property_id:
                    game.build_house(client_id, property_id)

            elif action.get("type") == "PAY_JAIL_FINE":
                game.pay_jail_fine(client_id)

            elif action.get("type") == "USE_JAIL_CARD":
                game.use_jail_card(client_id)

            elif action.get("type") == "PLACE_BID":
                amount = action.get("amount")
                if amount is not None:
                    game.place_bid(client_id, amount)

            elif action.get("type") == "PASS_BID":
                game.pass_bid(client_id)

            _save_game(room_id, db)
            await broadcast_state(room_id)

    except (WebSocketDisconnect, RuntimeError):
        pass
    finally:
        if room_id in connections and websocket in connections[room_id]:
            connections[room_id].remove(websocket)
        # We don't remove the player here to allow re-joining on page reload
        _save_game(room_id, db)
        await broadcast_state(room_id)
        db.close()