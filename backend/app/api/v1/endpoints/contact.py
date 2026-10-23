from __future__ import annotations

from fastapi import APIRouter

from app.api.dependencies import DbSession, SettingsDep, SessionIdDep
from app.core.config import format_business_public_emails
from app.schemas.contact import ContactSubmissionRequest, ContactResponse
from app.services.contact import ContactService

router = APIRouter(prefix="/contact", tags=["contact"])

@router.post("", response_model=ContactResponse)
async def submit_contact(
    payload: ContactSubmissionRequest,
    settings: SettingsDep,
    db: DbSession,
    session_id: SessionIdDep,
) -> ContactResponse:
    """Capture a contact form submission.

    The ``session_id`` is optional – if missing we still process the request.
    """
    service = ContactService(db=db, settings=settings)
    contact, notification_sent = await service.create_contact(session_id=session_id, data=payload)
    return ContactResponse(
        id=contact.id,
        status=contact.status,
        created_at=contact.created_at,
        notification_sent=notification_sent,
        message=(
            "Your inquiry was received and sent to our team. We'll respond shortly."
            if notification_sent
            else "Your inquiry was saved, but email delivery is temporarily unavailable. "
            f"Please contact {format_business_public_emails(settings)} if your request is urgent."
        ),
    )
