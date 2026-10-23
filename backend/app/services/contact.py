from __future__ import annotations

import logging

from app.api.dependencies import SettingsDep
from app.models.contact_submission import ContactSubmission
from app.repositories.business import BusinessRepository
from app.repositories.contact import ContactRepository
from app.services.email import send_contact_notification
from app.utils import utc_now

logger = logging.getLogger(__name__)

class ContactService:
    def __init__(self, db, settings: SettingsDep):
        self._db = db
        self._settings = settings
        self._repo = ContactRepository(db)

    async def create_contact(self, session_id: str | None, data) -> tuple[ContactSubmission, bool]:
        """Persist the inquiry, then attempt delivery to the configured inbox."""
        await BusinessRepository(self._db).ensure_configured_business(
            self._settings.business_id, self._settings.business_name
        )
        contact = ContactSubmission(
            business_id=self._settings.business_id,
            full_name=data.full_name,
            email=data.email,
            mobile_number=data.mobile_number,
            subject=data.subject,
            message=data.message,
            consent_to_contact=data.consent_to_contact,
            consent_timestamp=utc_now() if data.consent_to_contact else None,
        )
        await self._repo.create(contact)
        await self._db.commit()
        try:
            await send_contact_notification(self._settings, data)
        except Exception as exc:
            logger.warning("Contact saved but notification delivery failed (%s)", type(exc).__name__)
            return contact, False
        return contact, True
