# backend/models.py
import json
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class GameRoom(Base):
    __tablename__ = "game_rooms"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), default="Игра")
    status: Mapped[str] = mapped_column(String(16), default="active")  # active | finished
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    state: Mapped["GameState"] = relationship(
        "GameState", back_populates="room", uselist=False, cascade="all, delete-orphan"
    )


class GameState(Base):
    __tablename__ = "game_states"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    room_id: Mapped[str] = mapped_column(String(32), ForeignKey("game_rooms.id"), unique=True)
    state_json: Mapped[str] = mapped_column(Text, default="{}")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    room: Mapped["GameRoom"] = relationship("GameRoom", back_populates="state")

    def get_state(self) -> dict:
        return json.loads(self.state_json)

    def set_state(self, data: dict):
        self.state_json = json.dumps(data, ensure_ascii=False)
        self.updated_at = datetime.now(timezone.utc)
