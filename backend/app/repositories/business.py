"""Business repository — fetch business + settings."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.business import Business
from app.models.business_settings import BusinessSettings


class BusinessRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def get_by_id(self, business_id: str) -> Business | None:
        stmt = select(Business).where(Business.id == business_id)
        result = await self._db.execute(stmt)
        return result.scalar_one_or_none()

    async def ensure_configured_business(
        self, business_id: str, business_name: str
    ) -> Business:
        """Create the configured tenant record if this database has not seeded it."""
        business = await self.get_by_id(business_id)
        if business is not None:
            return business

        business = Business(
            id=business_id,
            name=business_name,
            slug=business_id.casefold().replace("_", "-"),
            is_active=True,
        )
        self._db.add(business)
        await self._db.flush()
        return business

    async def get_settings(self, business_id: str) -> BusinessSettings | None:
        stmt = select(BusinessSettings).where(
            BusinessSettings.business_id == business_id
        )
        result = await self._db.execute(stmt)
        return result.scalar_one_or_none()
