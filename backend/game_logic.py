# backend/game_logic.py
import random
from datetime import datetime

BOARD_CELLS = [
    {"id": "cell_0",   "type": "corner go",      "name": "ВПЕРЕД"},
    {"id": "prop_1",   "type": "street",          "name": "Житная ул.",          "color": "#8b4513", "price": 60,  "rent": [2,10,30,90,160,250], "houseCost": 50, "mortgageValue": 30},
    {"id": "cell_2",   "type": "chest",           "name": "Общественная казна"},
    {"id": "prop_3",   "type": "street",          "name": "Нагатинская ул.",     "color": "#8b4513", "price": 60,  "rent": [4,20,60,180,320,450], "houseCost": 50, "mortgageValue": 30},
    {"id": "cell_4",   "type": "tax",             "name": "Подоходный налог",    "price": 200},
    {"id": "prop_5",   "type": "railroad",        "name": "Рижская ж/д",         "price": 200, "rent": [25,50,100,200], "mortgageValue": 100},
    {"id": "prop_6",   "type": "street",          "name": "Варшавское шоссе",    "color": "#87ceeb", "price": 100, "rent": [6,30,90,270,400,550], "houseCost": 50, "mortgageValue": 50},
    {"id": "cell_7",   "type": "chance",          "name": "Шанс"},
    {"id": "prop_8",   "type": "street",          "name": "ул. Огарева",         "color": "#87ceeb", "price": 100, "rent": [6,30,90,270,400,550], "houseCost": 50, "mortgageValue": 50},
    {"id": "prop_9",   "type": "street",          "name": "Первая парковая",     "color": "#87ceeb", "price": 120, "rent": [8,40,100,300,450,600], "houseCost": 50, "mortgageValue": 60},
    {"id": "cell_10",  "type": "corner jail",     "name": "Тюрьма"},
    {"id": "prop_11",  "type": "street",          "name": "ул. Полянка",         "color": "#ff69b4", "price": 140, "rent": [10,50,150,450,625,750], "houseCost": 100, "mortgageValue": 70},
    {"id": "prop_12",  "type": "utility",         "name": "Электро-компания",    "price": 150, "rent": [4, 10], "mortgageValue": 75},
    {"id": "prop_13",  "type": "street",          "name": "ул. Сретенка",        "color": "#ff69b4", "price": 140, "rent": [10,50,150,450,625,750], "houseCost": 100, "mortgageValue": 70},
    {"id": "prop_14",  "type": "street",          "name": "Ростовская наб.",     "color": "#ff69b4", "price": 160, "rent": [12,60,180,500,700,900], "houseCost": 100, "mortgageValue": 80},
    {"id": "prop_15",  "type": "railroad",        "name": "Курская ж/д",         "price": 200, "rent": [25,50,100,200], "mortgageValue": 100},
    {"id": "prop_16",  "type": "street",          "name": "Рязанский проспект",  "color": "#ffa500", "price": 180, "rent": [14,70,200,550,750,950], "houseCost": 100, "mortgageValue": 90},
    {"id": "cell_17",  "type": "chest",           "name": "Общественная казна"},
    {"id": "prop_18",  "type": "street",          "name": "ул. Вавилова",        "color": "#ffa500", "price": 180, "rent": [14,70,200,550,750,950], "houseCost": 100, "mortgageValue": 90},
    {"id": "prop_19",  "type": "street",          "name": "Рублевское шоссе",    "color": "#ffa500", "price": 200, "rent": [16,80,220,600,800,1000], "houseCost": 100, "mortgageValue": 100},
    {"id": "cell_20",  "type": "corner parking",  "name": "Бесплатная стоянка"},
    {"id": "prop_21",  "type": "street",          "name": "ул. Тверская",        "color": "#ff0000", "price": 220, "rent": [18,90,250,700,875,1050], "houseCost": 150, "mortgageValue": 110},
    {"id": "cell_22",  "type": "chance",          "name": "Шанс"},
    {"id": "prop_23",  "type": "street",          "name": "Пушкинская ул.",      "color": "#ff0000", "price": 220, "rent": [18,90,250,700,875,1050], "houseCost": 150, "mortgageValue": 110},
    {"id": "prop_24",  "type": "street",          "name": "Пл. Маяковского",     "color": "#ff0000", "price": 240, "rent": [20,100,300,750,925,1100], "houseCost": 150, "mortgageValue": 120},
    {"id": "prop_25",  "type": "railroad",        "name": "Казанская ж/д",       "price": 200, "rent": [25,50,100,200], "mortgageValue": 100},
    {"id": "prop_26",  "type": "street",          "name": "ул. Грузинский Вал",  "color": "#ffff00", "price": 260, "rent": [22,110,330,800,975,1150], "houseCost": 150, "mortgageValue": 130},
    {"id": "prop_27",  "type": "street",          "name": "Новинский бульвар",   "color": "#ffff00", "price": 260, "rent": [22,110,330,800,975,1150], "houseCost": 150, "mortgageValue": 130},
    {"id": "prop_28",  "type": "utility",         "name": "Водопровод",          "price": 150, "rent": [4, 10], "mortgageValue": 75},
    {"id": "prop_29",  "type": "street",          "name": "Смоленская площадь",  "color": "#ffff00", "price": 280, "rent": [24,120,360,850,1025,1200], "houseCost": 150, "mortgageValue": 140},
    {"id": "cell_30",  "type": "corner police",   "name": "Отправляйтесь в тюрьму"},
    {"id": "prop_31",  "type": "street",          "name": "ул. Щусева",          "color": "#008000", "price": 300, "rent": [26,130,390,900,1100,1275], "houseCost": 200, "mortgageValue": 150},
    {"id": "prop_32",  "type": "street",          "name": "Гоголевский бульвар", "color": "#008000", "price": 300, "rent": [26,130,390,900,1100,1275], "houseCost": 200, "mortgageValue": 150},
    {"id": "cell_33",  "type": "chest",           "name": "Общественная казна"},
    {"id": "prop_34",  "type": "street",          "name": "Кутузовский проспект","color": "#008000", "price": 320, "rent": [28,150,450,1000,1200,1400], "houseCost": 200, "mortgageValue": 160},
    {"id": "prop_35",  "type": "railroad",        "name": "Ленинградская ж/д",   "price": 200, "rent": [25,50,100,200], "mortgageValue": 100},
    {"id": "cell_36",  "type": "chance",          "name": "Шанс"},
    {"id": "prop_37",  "type": "street",          "name": "ул. Малая Бронная",   "color": "#0000ff", "price": 350, "rent": [35,175,500,1100,1300,1500], "houseCost": 200, "mortgageValue": 175},
    {"id": "cell_38",  "type": "tax",             "name": "Сверхналог",          "price": 100},
    {"id": "prop_39",  "type": "street",          "name": "ул. Арбат",           "color": "#0000ff", "price": 400, "rent": [50,200,600,1400,1700,2000], "houseCost": 200, "mortgageValue": 200},
]

BUYABLE_TYPES = {"street", "railroad", "utility"}

CHANCE_CARDS = [
    {"id": "chance_1", "text": "Отправляйтесь на поле ВПЕРЕД (Получите $200)", "action": "move_to", "target": 0},
    {"id": "chance_2", "text": "Отправляйтесь в тюрьму! Не проходите поле ВПЕРЕД, не получайте $200", "action": "go_jail"},
    {"id": "chance_3", "text": "Штраф за превышение скорости: заплатите $15", "action": "pay", "amount": 15},
    {"id": "chance_4", "text": "Вы выиграли в кроссворде! Получите $100", "action": "earn", "amount": 100},
    {"id": "chance_5", "text": "Банк выплачивает вам дивиденды: $50", "action": "earn", "amount": 50},
    {"id": "chance_6", "text": "Оплатите налог на недвижимость: $25 за каждый дом, $100 за отель", "action": "pay_houses", "house": 25, "hotel": 100},
    {"id": "chance_7", "text": "Отправляйтесь на ул. Арбат. Если проходите поле ВПЕРЕД, получите $200", "action": "move_to", "target": 39},
    {"id": "chance_8", "text": "Вернитесь на три поля назад", "action": "move_rel", "amount": -3},
    {"id": "chance_9", "text": "Ссуда на строительство: получите $150", "action": "earn", "amount": 150},
    {"id": "chance_10", "text": "Ваша страховка созрела: получите $100", "action": "earn", "amount": 100},
    {"id": "chance_11", "text": "Бесплатно освободитесь из тюрьмы", "action": "get_jail_card"},
]

CHEST_CARDS = [
    {"id": "chest_1", "text": "Ошибка банка в вашу пользу! Получите $200", "action": "earn", "amount": 200},
    {"id": "chest_2", "text": "Оплатите услуги доктора: $50", "action": "pay", "amount": 50},
    {"id": "chest_3", "text": "Вы получили наследство: $100", "action": "earn", "amount": 100},
    {"id": "chest_4", "text": "Вы продали акции: получите $50", "action": "earn", "amount": 50},
    {"id": "chest_5", "text": "Фонд отпуска: получите $100", "action": "earn", "amount": 100},
    {"id": "chest_6", "text": "Возврат налога: получите $20", "action": "earn", "amount": 20},
    {"id": "chest_7", "text": "Оплатите страховку: $50", "action": "pay", "amount": 50},
    {"id": "chest_8", "text": "Взнос на больницу: заплатите $100", "action": "pay", "amount": 100},
    {"id": "chest_9", "text": "С днем рождения! Получите по $10 от каждого игрока", "action": "collect_all", "amount": 10},
    {"id": "chest_10", "text": "Получите за услуги: $25", "action": "earn", "amount": 25},
]


class Game:
    def __init__(self):
        self.players = {}
        self.turn_order = []
        self.current_turn_player_id = None
        self.turn_phase = "ROLL"  # "ROLL" or "ACTION"
        self.doubles_count = 0
        self.logs = []
        self.roll_counter = 0
        self.last_roll = None
        self.properties = {}  # property_id -> owner client_id
        # Pending landing event sent to the active player's client
        self.landing_event = None  # {"type": "buy"|"rent"|None, ...}
        self.auction_state = None  # None or { property_id, cell_name, bids, highest_bid, highest_bidder, active_players, turn_idx }

    def log_event(self, message: str):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.logs.append(f"[{timestamp}] {message}")
        if len(self.logs) > 50:
            self.logs.pop(0)

    def add_player(self, client_id: str):
        if client_id not in self.players:
            player_name = f"Игрок {len(self.turn_order) + 1}"
            self.players[client_id] = {
                "position": 0,
                "balance": 1500,
                "name": player_name,
                "jail_turns": 0,
                "jail_cards": 0
            }
            self.turn_order.append(client_id)
            if self.current_turn_player_id is None:
                self.current_turn_player_id = client_id
                self.turn_phase = "ROLL"
            self.log_event(f"{player_name} присоединился к игре.")

    def remove_player(self, client_id: str):
        if client_id in self.players:
            player_name = self.players[client_id]["name"]
            if client_id in self.turn_order:
                idx = self.turn_order.index(client_id)
                self.turn_order.remove(client_id)
                if self.current_turn_player_id == client_id:
                    if len(self.turn_order) > 0:
                        next_idx = idx % len(self.turn_order)
                        self.current_turn_player_id = self.turn_order[next_idx]
                        self.turn_phase = "ROLL"
                        self.doubles_count = 0
                    else:
                        self.current_turn_player_id = None
            del self.players[client_id]
            # Release properties owned by this player
            props_to_release = [pid for pid, pdata in self.properties.items() 
                               if (isinstance(pdata, dict) and pdata.get("owner_id") == client_id) 
                               or pdata == client_id]
            for pid in props_to_release:
                del self.properties[pid]
            self.log_event(f"{player_name} покинул игру. Его собственность возвращена в банк.")

    def end_turn(self, client_id: str):
        if self.current_turn_player_id == client_id and self.turn_phase == "ACTION":
            player_name = self.players[client_id]["name"]
            self.log_event(f"{player_name} завершил ход.")
            idx = self.turn_order.index(client_id)
            next_idx = (idx + 1) % len(self.turn_order)
            self.current_turn_player_id = self.turn_order[next_idx]
            self.turn_phase = "ROLL"
            self.doubles_count = 0
            self.landing_event = None
            next_name = self.players[self.current_turn_player_id]["name"]
            self.log_event(f"Ход переходит к {next_name}.")

    def _resolve_landing(self, client_id: str, cell_idx: int, dice_total: int):
        """Compute what happens when a player lands on a cell."""
        cell = BOARD_CELLS[cell_idx]
        player = self.players[client_id]
        player_name = player["name"]

        if cell["type"] == "tax":
            amount = cell["price"]
            player["balance"] -= amount
            self.log_event(f"{player_name} попал на «{cell['name']}» и заплатил ${amount}.")
            self.landing_event = None
            return

        if cell["type"] == "corner police":
            player["position"] = 10
            player["jail_turns"] = 3
            self.log_event(f"{player_name} отправляется в тюрьму!")
            self.landing_event = None
            self.turn_phase = "ACTION" # Force turn end
            return

        if cell["type"] in ["chance", "chest"]:
            self.landing_event = None
            deck = CHANCE_CARDS if cell["type"] == "chance" else CHEST_CARDS
            card = random.choice(deck)
            
            # Send card to frontend for display
            self.landing_event = {
                "action": "draw_card",
                "type": cell["type"],
                "card": card
            }
            
            self.log_event(f"{player_name} тянет карту «{cell['name']}»: {card['text']}")
            
            # Apply effect
            action = card["action"]
            if action == "move_to":
                target = card["target"]
                if target < player["position"]:
                    player["balance"] += 200 # Passed GO
                player["position"] = target
                # Recursively resolve new landing
                self._resolve_landing(client_id, target, dice_total)
            elif action == "go_jail":
                player["position"] = 10
                player["jail_turns"] = 3
                self.turn_phase = "ACTION"
            elif action == "pay":
                player["balance"] -= card["amount"]
            elif action == "earn":
                player["balance"] += card["amount"]
            elif action == "pay_houses":
                # calculate houses
                total_houses = sum(p.get("houses", 0) for p in self.properties.values() if p.get("owner_id") == client_id and p.get("houses", 0) < 5)
                total_hotels = sum(1 for p in self.properties.values() if p.get("owner_id") == client_id and p.get("houses", 0) == 5)
                cost = total_houses * card["house"] + total_hotels * card["hotel"]
                player["balance"] -= cost
                if cost > 0:
                    self.log_event(f"{player_name} платит ${cost} за ремонт недвижимости.")
            elif action == "move_rel":
                new_pos = (player["position"] + card["amount"]) % 40
                player["position"] = new_pos
                self._resolve_landing(client_id, new_pos, dice_total)
            elif action == "collect_all":
                total_collected = 0
                for pid, pdata in self.players.items():
                    if pid != client_id:
                        pdata["balance"] -= card["amount"]
                        total_collected += card["amount"]
                player["balance"] += total_collected
            elif action == "get_jail_card":
                player["jail_cards"] = player.get("jail_cards", 0) + 1
            return

        if cell["type"] not in BUYABLE_TYPES:
            self.landing_event = None
            return

        prop_state = self.properties.get(cell["id"])
        if isinstance(prop_state, dict):
            owner_id = prop_state.get("owner_id")
        else:
            owner_id = prop_state # Legacy format or None

        if owner_id is None:
            # Property is free — offer to buy
            self.landing_event = {
                "action": "buy",
                "cell_id": cell["id"],
                "cell_name": cell["name"],
                "price": cell["price"],
                "for_player": client_id,
            }
        elif owner_id not in self.players:
            # Owner left the game
            self.properties.pop(cell["id"], None)
            self.log_event(f"Владелец «{cell['name']}» покинул игру. Собственность снова свободна.")
            self.landing_event = {
                "action": "buy",
                "cell_id": cell["id"],
                "cell_name": cell["name"],
                "price": cell["price"],
                "for_player": client_id,
            }
        elif owner_id == client_id:
            self.log_event(f"{player_name} стоит на своей собственности «{cell['name']}».")
            self.landing_event = None
        else:
            if isinstance(prop_state, dict) and prop_state.get("mortgaged"):
                self.log_event(f"{player_name} попал на заложенную собственность «{cell['name']}». Аренда не взимается.")
                self.landing_event = None
                return

            # Pay rent to owner
            rent = self._calc_rent(cell, dice_total)
            owner = self.players[owner_id]
            owner_name = owner["name"]
            player["balance"] -= rent
            owner["balance"] += rent
            self.log_event(
                f"{player_name} попал на «{cell['name']}» ({owner_name}) и заплатил аренду ${rent}."
            )
            self.landing_event = None

    def _calc_rent(self, cell: dict, dice_total: int) -> int:
        """Calculate rent for a cell."""
        cell_id = cell["id"]
        prop_state = self.properties.get(cell_id, {})
        owner_id = prop_state.get("owner_id")

        if cell["type"] == "railroad":
            owned_rr = sum(
                1 for c in BOARD_CELLS
                if c["type"] == "railroad" and self.properties.get(c["id"], {}).get("owner_id") == owner_id
            )
            return cell["rent"][min(owned_rr - 1, 3)]

        if cell["type"] == "utility":
            owned_util = sum(
                1 for c in BOARD_CELLS
                if c["type"] == "utility" and self.properties.get(c["id"], {}).get("owner_id") == owner_id
            )
            multiplier = cell["rent"][min(owned_util - 1, 1)]
            return multiplier * dice_total

        # Street: use houses count (0 = base rent)
        houses = prop_state.get("houses", 0)
        base_rent = cell["rent"][min(houses, len(cell["rent"]) - 1)]

        if houses == 0:
            # Check monopoly (if owner owns all streets of this color)
            color = cell.get("color")
            color_group = [c for c in BOARD_CELLS if c.get("color") == color]
            owns_all = all(self.properties.get(c["id"], {}).get("owner_id") == owner_id for c in color_group)
            if owns_all:
                return base_rent * 2

        return base_rent

    def roll_dice(self, client_id: str):
        if client_id not in self.players:
            return
        if self.current_turn_player_id != client_id or self.turn_phase != "ROLL":
            return

        player = self.players[client_id]
        player_name = player["name"]

        dice1 = random.randint(1, 6)
        dice2 = random.randint(1, 6)
        total = dice1 + dice2
        is_double = (dice1 == dice2)

        self.roll_counter += 1
        self.last_roll = {
            "dice1": dice1,
            "dice2": dice2,
            "total": total,
            "player": client_id,
            "id": str(self.roll_counter)
        }

        # Jail logic
        if player.get("jail_turns", 0) > 0:
            if is_double:
                self.log_event(f"{player_name} выбросил дубль ({total}) и выходит из тюрьмы!")
                player["jail_turns"] = 0
                # Continue normal move
            else:
                player["jail_turns"] -= 1
                if player["jail_turns"] == 0:
                    # Forced to pay 50
                    if player["balance"] >= 50:
                        player["balance"] -= 50
                        self.log_event(f"{player_name} выбросил {total}. Третья попытка: платит $50 штрафа и выходит.")
                        # Continue normal move
                    else:
                        self.log_event(f"{player_name} должен заплатить $50 за выход, но нет денег!")
                        self.turn_phase = "BANKRUPTCY_RESOLVE"
                        # To keep things simple without full bankruptcy implementation yet, just don't move
                        return
                else:
                    self.log_event(f"{player_name} выбросил {total}. Дубля нет, остается в тюрьме.")
                    self.turn_phase = "ACTION"
                    return

        if is_double and player.get("jail_turns", 0) == 0:
            self.doubles_count += 1
            self.log_event(f"{player_name} выбросил дубль: {dice1} и {dice2}!")
            if self.doubles_count == 3:
                self.log_event(f"{player_name} отправляется в тюрьму за 3 дубля подряд!")
                player["position"] = 10
                player["jail_turns"] = 3
                self.doubles_count = 0
                self.turn_phase = "ACTION"
                self.landing_event = None
                return
        elif player.get("jail_turns", 0) == 0:
            self.log_event(f"{player_name} выбросил {dice1} и {dice2} (всего {total}).")
            self.doubles_count = 0

        current_pos = player["position"]
        new_pos = (current_pos + total) % 40
        player["position"] = new_pos

        if new_pos < current_pos and player.get("jail_turns", 0) == 0:
            player["balance"] += 200
            self.log_event(f"{player_name} прошел ВПЕРЕД и получил $200.")

        self._resolve_landing(client_id, new_pos, total)

        if is_double and player.get("jail_turns", 0) == 0:
            self.turn_phase = "ROLL"
        else:
            self.turn_phase = "ACTION"

    def pay_jail_fine(self, client_id: str):
        if client_id not in self.players or self.current_turn_player_id != client_id or self.turn_phase != "ROLL":
            return
        player = self.players[client_id]
        if player.get("jail_turns", 0) > 0 and player["balance"] >= 50:
            player["balance"] -= 50
            player["jail_turns"] = 0
            self.log_event(f"{player['name']} заплатил залог $50 и может ходить.")

    def use_jail_card(self, client_id: str):
        if client_id not in self.players or self.current_turn_player_id != client_id or self.turn_phase != "ROLL":
            return
        player = self.players[client_id]
        if player.get("jail_turns", 0) > 0 and player.get("jail_cards", 0) > 0:
            player["jail_cards"] -= 1
            player["jail_turns"] = 0
            self.log_event(f"{player['name']} использовал карточку освобождения из тюрьмы.")

    def buy_property(self, client_id: str, property_id: str, price: int):
        """Player confirms purchase of property they landed on."""
        if client_id not in self.players:
            return
        if self.current_turn_player_id != client_id:
            return
        # Verify player is actually standing on this property
        player = self.players[client_id]
        cell = BOARD_CELLS[player["position"]]
        if cell["id"] != property_id:
            return
        if property_id in self.properties:
            return
        if player["balance"] < price:
            return

        player["balance"] -= price
        self.properties[property_id] = {
            "owner_id": client_id,
            "houses": 0,
            "mortgaged": False
        }
        self.landing_event = None
        self.log_event(f"{player['name']} купил «{cell['name']}» за ${price}.")

    def decline_buy(self, client_id: str):
        """Player declines to buy the property they landed on. Triggers an auction."""
        if self.landing_event and self.landing_event.get("action") == "buy" and self.current_turn_player_id == client_id:
            property_id = self.landing_event["cell_id"]
            cell_name = self.landing_event["cell_name"]
            self.landing_event = None
            self.log_event(f"{self.players[client_id]['name']} отказался от покупки. Начинается аукцион за «{cell_name}»!")
            self._start_auction(property_id, cell_name)

    def _start_auction(self, property_id: str, cell_name: str):
        active_players = [pid for pid in self.turn_order if self.players.get(pid)]
        if len(active_players) == 0:
            return
            
        self.auction_state = {
            "property_id": property_id,
            "cell_name": cell_name,
            "highest_bid": 10,
            "highest_bidder": None,
            "active_players": active_players.copy(),
            "turn_idx": 0
        }

    def place_bid(self, client_id: str, amount: int):
        if not self.auction_state:
            return
        active = self.auction_state["active_players"]
        if client_id not in active:
            return
        turn_idx = self.auction_state["turn_idx"]
        if active[turn_idx] != client_id:
            return
            
        player = self.players[client_id]
        if player["balance"] < amount:
            return
        if amount <= self.auction_state["highest_bid"]:
            return

        self.auction_state["highest_bid"] = amount
        self.auction_state["highest_bidder"] = client_id
        self.log_event(f"{player['name']} делает ставку ${amount} за «{self.auction_state['cell_name']}».")
        
        # Next player's turn
        self._next_auction_turn()

    def pass_bid(self, client_id: str):
        if not self.auction_state:
            return
        active = self.auction_state["active_players"]
        if client_id not in active:
            return
        turn_idx = self.auction_state["turn_idx"]
        if active[turn_idx] != client_id:
            return
            
        self.log_event(f"{self.players[client_id]['name']} пасует в аукционе.")
        active.pop(turn_idx)
        
        if len(active) == 1 and self.auction_state["highest_bidder"] is not None:
            # Auction won
            winner = active[0]
            self._resolve_auction()
        elif len(active) == 0:
            # Everyone passed without a bid, or the last person passed
            self.log_event(f"Аукцион за «{self.auction_state['cell_name']}» завершен без победителя.")
            self.auction_state = None
        else:
            # Adjust turn index since we popped an element
            if turn_idx >= len(active):
                self.auction_state["turn_idx"] = 0
            # Next player already set because array shifted

    def _next_auction_turn(self):
        active = self.auction_state["active_players"]
        turn_idx = self.auction_state["turn_idx"]
        turn_idx = (turn_idx + 1) % len(active)
        
        if len(active) == 1 and self.auction_state["highest_bidder"] == active[turn_idx]:
            # Everyone else passed, this player wins
            self._resolve_auction()
        else:
            self.auction_state["turn_idx"] = turn_idx

    def _resolve_auction(self):
        winner_id = self.auction_state["highest_bidder"]
        price = self.auction_state["highest_bid"]
        property_id = self.auction_state["property_id"]
        cell_name = self.auction_state["cell_name"]
        
        if winner_id and winner_id in self.players:
            player = self.players[winner_id]
            player["balance"] -= price
            self.properties[property_id] = {
                "owner_id": winner_id,
                "houses": 0,
                "mortgaged": False
            }
            self.log_event(f"{player['name']} выигрывает аукцион и покупает «{cell_name}» за ${price}!")
        
        self.auction_state = None

    def mortgage_property(self, client_id: str, property_id: str):
        if client_id not in self.players or self.current_turn_player_id != client_id:
            return
        prop_state = self.properties.get(property_id)
        if not prop_state or prop_state.get("owner_id") != client_id:
            return
        if prop_state.get("houses", 0) > 0:
            return  # Must sell houses first
        if prop_state.get("mortgaged"):
            return
        
        cell = next((c for c in BOARD_CELLS if c["id"] == property_id), None)
        if not cell or "mortgageValue" not in cell:
            return

        prop_state["mortgaged"] = True
        self.players[client_id]["balance"] += cell["mortgageValue"]
        self.log_event(f"{self.players[client_id]['name']} заложил «{cell['name']}» за ${cell['mortgageValue']}.")

    def unmortgage_property(self, client_id: str, property_id: str):
        if client_id not in self.players or self.current_turn_player_id != client_id:
            return
        prop_state = self.properties.get(property_id)
        if not prop_state or prop_state.get("owner_id") != client_id:
            return
        if not prop_state.get("mortgaged"):
            return

        cell = next((c for c in BOARD_CELLS if c["id"] == property_id), None)
        if not cell or "mortgageValue" not in cell:
            return

        cost = int(cell["mortgageValue"] * 1.1)  # 10% interest
        if self.players[client_id]["balance"] < cost:
            return

        self.players[client_id]["balance"] -= cost
        prop_state["mortgaged"] = False
        self.log_event(f"{self.players[client_id]['name']} выкупил «{cell['name']}» за ${cost}.")

    def build_house(self, client_id: str, property_id: str):
        if client_id not in self.players or self.current_turn_player_id != client_id:
            return
        prop_state = self.properties.get(property_id)
        if not prop_state or prop_state.get("owner_id") != client_id:
            return
        if prop_state.get("mortgaged"):
            return
        if prop_state.get("houses", 0) >= 5:
            return

        cell = next((c for c in BOARD_CELLS if c["id"] == property_id), None)
        if not cell or cell["type"] != "street" or "houseCost" not in cell:
            return

        # Check monopoly
        color = cell.get("color")
        color_group = [c for c in BOARD_CELLS if c.get("color") == color]
        owns_all = all(
            self.properties.get(c["id"], {}).get("owner_id") == client_id 
            for c in color_group
        )
        if not owns_all:
            return

        # Ensure properties of this color are not mortgaged
        any_mortgaged = any(
            self.properties.get(c["id"], {}).get("mortgaged") 
            for c in color_group
        )
        if any_mortgaged:
            return

        # Build evenly rule
        current_houses = prop_state.get("houses", 0)
        min_houses_in_group = min(
            self.properties.get(c["id"], {}).get("houses", 0) 
            for c in color_group
        )
        if current_houses > min_houses_in_group:
            return

        cost = cell["houseCost"]
        if self.players[client_id]["balance"] < cost:
            return

        self.players[client_id]["balance"] -= cost
        prop_state["houses"] = prop_state.get("houses", 0) + 1
        
        building_name = "отель" if prop_state["houses"] == 5 else "дом"
        self.log_event(f"{self.players[client_id]['name']} построил {building_name} на «{cell['name']}» за ${cost}.")

    def get_state(self):
        return {
            "players": self.players,
            "last_roll": self.last_roll,
            "properties": self.properties,
            "turn_order": self.turn_order,
            "current_turn_player_id": self.current_turn_player_id,
            "turn_phase": self.turn_phase,
            "logs": self.logs,
            "landing_event": self.landing_event,
        }

    def to_dict(self) -> dict:
        """Serialize full game state for persistence."""
        return {
            "players": self.players,
            "last_roll": self.last_roll,
            "properties": self.properties,
            "turn_order": self.turn_order,
            "current_turn_player_id": self.current_turn_player_id,
            "turn_phase": self.turn_phase,
            "doubles_count": self.doubles_count,
            "roll_counter": self.roll_counter,
            "logs": self.logs,
            "landing_event": self.landing_event,
            "auction_state": self.auction_state
        }
        
    @classmethod
    def from_dict(cls, data: dict) -> "Game":
        """Restore a Game instance from persisted data."""
        game = cls()
        game.players = data.get("players", {})
        game.last_roll = data.get("last_roll")
        # Normalize properties: handle legacy format where value was just owner_id string
        raw_props = data.get("properties", {})
        game.properties = {
            pid: ({"owner_id": pval, "houses": 0, "mortgaged": False} if isinstance(pval, str) else pval)
            for pid, pval in raw_props.items()
        }
        game.auction_state = data.get("auction_state", None)
        game.turn_order = data.get("turn_order", [])
        game.current_turn_player_id = data.get("current_turn_player_id")
        game.turn_phase = data.get("turn_phase", "ROLL")
        game.doubles_count = data.get("doubles_count", 0)
        game.roll_counter = data.get("roll_counter", 0)
        game.logs = data.get("logs", [])
        game.landing_event = data.get("landing_event")
        return game