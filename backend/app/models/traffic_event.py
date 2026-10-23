"""Anonymous website analytics event model."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import DateTime, Index, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class TrafficEvent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "traffic_events"
    __table_args__ = (
        Index("ix_traffic_events_created_event", "created_at", "event_type"),
    )

    event_type: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    visitor_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    page_path: Mapped[str] = mapped_column(String(512), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
