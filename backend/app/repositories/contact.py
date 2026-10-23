"""Contact submission repository."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.contact_submission import ContactSubmission


class ContactRepository:
    def __init__(self, db: AsyncSession):
        self._db = db

    async def create(self, submission: ContactSubmission) -> ContactSubmission:
        self._db.add(submission)
        await self._db.flush()
        return submission
