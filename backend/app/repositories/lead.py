"""Lead repository — create, update, de-dup check."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lead import Lead


class LeadRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def create(self, lead: Lead) -> Lead:
        self._db.add(lead)
        await self._db.flush()
        return lead

    async def get_by_id(self, lead_id: str) -> Lead | None:
        stmt = select(Lead).where(Lead.id == lead_id)
        result = await self._db.execute(stmt)
        return result.scalar_one_or_none()

    async def update_status(self, lead_id: str, status: str) -> None:
        lead = await self.get_by_id(lead_id)
        if lead:
            lead.status = status

    async def check_duplicate(
        self, email: str, business_id: str, window_hours: int = 24
    ) -> bool:
        """Return True if a lead with same email exists within the window."""
        cutoff = datetime.now(timezone.utc) - timedelta(hours=window_hours)
        stmt = (
            select(func.count())
            .select_from(Lead)
            .where(
                Lead.business_id == business_id,
                Lead.email == email,
                Lead.created_at >= cutoff,
            )
        )
        result = await self._db.execute(stmt)
        count = result.scalar_one()
        return count > 0
