from __future__ import annotations

from datetime import datetime

from app.api.dependencies import SettingsDep
from app.models.lead import Lead
from app.repositories.business import BusinessRepository
from app.repositories.lead import LeadRepository
from app.services.email import queue_email_notification
from app.utils import utc_now


class LeadService:
    def __init__(self, db, settings: SettingsDep):
        self._db = db
        self._settings = settings
        self._repo = LeadRepository(db)

    async def create_lead(self, session_id: str | None, data) -> Lead:
        """Validate, de‑duplicate and persist a lead.

        * Checks for recent duplicate leads from the same session.
        * Persists the lead via ``LeadRepository``.
        * Queues a notification email.
        """
        # Simple de‑duplication: same email within dedup window
        recent = await self._repo.get_recent_by_email(
            email=data.email, window_hours=self._settings.lead_deduplication_window_hours
        )
        if recent:
            # Return existing lead (could also raise an error)
            return recent

        await BusinessRepository(self._db).ensure_configured_business(
            self._settings.business_id, self._settings.business_name
        )
        lead = Lead(
            business_id=self._settings.business_id,
            full_name=data.full_name,
            email=data.email,
            mobile_number=data.mobile_number,
            company_name=data.company_name,
            service_interest=data.service_interest,
            project_description=data.project_description,
            preferred_location=data.preferred_location,
            expected_timeline=data.expected_timeline,
            consent_to_contact=data.consent_to_contact,
            consent_version=self._settings.lead_consent_version if data.consent_to_contact else None,
            consent_timestamp=utc_now() if data.consent_to_contact else None,
            source="chatbot",
        )
        await self._repo.create(lead)
        # Queue email notification
        await queue_email_notification(
            db=self._db,
            template_type="lead_notification",
            recipient=self._settings.business_notification_email,
            payload={
                "lead_id": lead.id,
                "full_name": lead.full_name,
                "email": lead.email,
                "session_id": session_id,
            },
        )
        return lead

    async def create_chat_followup(self, data, transcript: list[dict]) -> Lead:
        """Persist a consented chat follow-up before attempting email delivery."""
        await BusinessRepository(self._db).ensure_configured_business(
            self._settings.business_id, self._settings.business_name
        )
        transcript_text = "\n\n".join(
            f"{item.get('role', 'visitor').title()}: {item.get('content', '')}"
            for item in transcript
        )
        lead = Lead(
            business_id=self._settings.business_id,
            full_name=data.full_name,
            email=data.email,
            mobile_number=data.mobile_number,
            company_name=data.company_name,
            inquiry_summary="Website chat follow-up request",
            transcript_text=transcript_text,
            source="chatbot",
            consent_to_contact=True,
            consent_version=self._settings.lead_consent_version,
            consent_timestamp=utc_now(),
        )
        await self._repo.create(lead)
        await self._db.commit()
        return lead
