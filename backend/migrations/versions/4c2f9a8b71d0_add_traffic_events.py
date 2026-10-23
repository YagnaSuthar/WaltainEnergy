"""add anonymous traffic events

Revision ID: 4c2f9a8b71d0
Revises: 0e6107c9f253
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4c2f9a8b71d0"
down_revision: Union[str, None] = "0e6107c9f253"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "traffic_events",
        sa.Column("event_type", sa.String(length=32), nullable=False),
        sa.Column("visitor_hash", sa.String(length=64), nullable=False),
        sa.Column("page_path", sa.String(length=512), nullable=False),
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_traffic_events_event_type"),
        "traffic_events",
        ["event_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_traffic_events_visitor_hash"),
        "traffic_events",
        ["visitor_hash"],
        unique=False,
    )
    op.create_index(
        op.f("ix_traffic_events_created_at"),
        "traffic_events",
        ["created_at"],
        unique=False,
    )
    op.create_index(
        "ix_traffic_events_created_event",
        "traffic_events",
        ["created_at", "event_type"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_traffic_events_created_event", table_name="traffic_events")
    op.drop_index(op.f("ix_traffic_events_created_at"), table_name="traffic_events")
    op.drop_index(op.f("ix_traffic_events_visitor_hash"), table_name="traffic_events")
    op.drop_index(op.f("ix_traffic_events_event_type"), table_name="traffic_events")
    op.drop_table("traffic_events")
