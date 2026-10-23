"""Service repository."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.service import Service


class ServiceRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def get_all(self, business_id: str) -> list[Service]:
        stmt = (
            select(Service)
            .where(Service.business_id == business_id, Service.is_active.is_(True))
            .order_by(Service.name)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, service_id: str) -> Service | None:
        stmt = select(Service).where(Service.id == service_id)
        result = await self._db.execute(stmt)
        return result.scalar_one_or_none()

    async def search_by_name(self, query: str, business_id: str) -> list[Service]:
        stmt = (
            select(Service)
            .where(
                Service.business_id == business_id,
                Service.is_active.is_(True),
                Service.name.ilike(f"%{query}%"),
            )
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())
