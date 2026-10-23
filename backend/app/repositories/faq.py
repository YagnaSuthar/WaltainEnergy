"""FAQ repository — keyword search over FAQs for the knowledge tool."""

from __future__ import annotations

import logging

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.faq import FAQ

logger = logging.getLogger(__name__)


class FAQRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def search(
        self, query: str, business_id: str, limit: int = 5
    ) -> list[FAQ]:
        """Search FAQs by matching keywords in question/answer/keywords."""
        q = query.lower().strip()
        words = q.split()

        stmt = (
            select(FAQ)
            .where(FAQ.business_id == business_id, FAQ.is_active.is_(True))
            .where(
                or_(
                    *[
                        func.lower(FAQ.question).contains(w)
                        for w in words
                    ],
                    *[
                        func.lower(FAQ.answer).contains(w)
                        for w in words
                    ],
                    *[
                        func.lower(FAQ.keywords).contains(w)
                        for w in words
                    ],
                )
            )
            .limit(limit)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())

    async def get_all(self, business_id: str) -> list[FAQ]:
        stmt = (
            select(FAQ)
            .where(FAQ.business_id == business_id, FAQ.is_active.is_(True))
            .order_by(FAQ.sort_order)
        )
        result = await self._db.execute(stmt)
        return list(result.scalars().all())
