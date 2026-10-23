from __future__ import annotations

from fastapi import APIRouter

from app.api.dependencies import DbSession, SettingsDep, SessionIdDep
from app.schemas.lead import LeadCreateRequest, LeadResponse
from app.services.lead import LeadService

router = APIRouter(prefix="/leads", tags=["leads"])

@router.post("", response_model=LeadResponse)
async def submit_lead(
    payload: LeadCreateRequest,
    settings: SettingsDep,
    db: DbSession,
    session_id: SessionIdDep,
) -> LeadResponse:
    """Capture a lead from the chatbot.

    The ``session_id`` is taken from the cookie to link the lead to a chat
    session. If the cookie is missing we still allow the request but treat the
    session as ``anonymous``.
    """
    service = LeadService(db=db, settings=settings)
    lead = await service.create_lead(session_id=session_id, data=payload)
    return LeadResponse(
        id=lead.id,
        full_name=lead.full_name,
        email=lead.email,
        status=lead.status,
        created_at=lead.created_at,
        message="Thank you! We'll be in touch soon.",
    )
