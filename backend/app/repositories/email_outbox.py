"""Email outbox repository — queue, fetch pending, update status."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import EmailStatus
from app.models.email_outbox import EmailOutbox


class EmailOutboxRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def queue(self, entry: EmailOutbox) -> EmailOutbox:
        self._db.add(entry)
        await self._db.flush()
        return entry

    async def fetch_pending(self, batch_size: int = 10) -> list[EmailOutbox]:
        now = datetime.now(timezone.utc)
        stmt = (
            select(EmailOutbox)
            .where(
                EmailOutbox.status.in_(
                    [EmailStatus.PENDING, EmailStatus.RETRYING]
                ),
                EmailOutbox.next_attempt_at <= now,
            )
            .order_by(EmailOutbox.next_attempt_at)
            .limit(batch_size)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())

    async def mark_sent(self, entry_id: str) -> None:
        stmt = (
            update(EmailOutbox)
            .where(EmailOutbox.id == entry_id)
            .values(
                status=EmailStatus.SENT,
                sent_at=datetime.now(timezone.utc),
            )
        )
        await self._db.execute(stmt)

    async def mark_failed(
        self, entry_id: str, attempts: int, next_attempt_at: datetime
    ) -> None:
        status = (
            EmailStatus.FAILED if attempts >= 5 else EmailStatus.RETRYING
        )
        stmt = (
            update(EmailOutbox)
            .where(EmailOutbox.id == entry_id)
            .values(
                status=status,
                attempts=attempts,
                next_attempt_at=next_attempt_at,
                last_error_at=datetime.now(timezone.utc),
            )
        )
        await self._db.execute(stmt)
