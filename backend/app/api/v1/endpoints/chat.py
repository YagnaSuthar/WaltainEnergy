from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import JSONResponse

from app.api.dependencies import DbSession, SettingsDep, SessionIdDep
from app.core.config import format_business_public_emails
from app.schemas.chat import (
    ChatSessionCreateRequest,
    ChatMessageRequest,
    ChatLeadSubmissionRequest,
    ChatLeadSubmissionResponse,
    ChatSessionResponse,
    ChatMessageResponse,
    SessionInfoResponse,
)
from app.services.chat import ChatService
from app.services.email import send_chat_lead_notification
from app.services.lead import LeadService
from app.agents.memory.store import get_memory_store

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/sessions", response_model=ChatSessionResponse)
async def create_chat_session(
    settings: SettingsDep,
    db: DbSession,
    response: Response,
    _: ChatSessionCreateRequest | None = None,
) -> ChatSessionResponse:
    """Create a new chat session and set a secure cookie.

    The client does not need to send any body – the server generates a UUID
    and returns a welcome message. The session token is also set as a cookie
    using the name defined in ``settings.session_cookie_name``.
    """
    service = ChatService(db=db, settings=settings)
    session = await service.create_session()
    # Set cookie – HttpOnly, SameSite, optional Secure based on settings
    cookie_params = {
        "key": settings.session_cookie_name,
        "value": session.session_id,
        "httponly": settings.session_cookie_httponly,
        "samesite": settings.session_cookie_samesite,
        "secure": settings.session_cookie_secure,
        "max_age": settings.session_token_ttl_seconds,
        "path": "/",
    }
    response.set_cookie(**cookie_params)
    return ChatSessionResponse(
        session_id=session.session_id,
        welcome_message=session.welcome_message,
        created_at=session.created_at,
    )

@router.post("/messages", response_model=ChatMessageResponse)
async def send_message(
    payload: ChatMessageRequest,
    settings: SettingsDep,
    db: DbSession,
    session_id: SessionIdDep,
) -> ChatMessageResponse:
    """Receive a user message, run the LLM orchestration, and return the AI reply.

    The ``session_id`` is extracted from the cookie. If missing, we raise a 400.
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="Chat session cookie missing")
    service = ChatService(db=db, settings=settings)
    response = await service.process_message(session_id=session_id, user_message=payload.message)
    return response


@router.post("/lead-submissions", response_model=ChatLeadSubmissionResponse)
async def submit_chat_lead(
    payload: ChatLeadSubmissionRequest,
    settings: SettingsDep,
    db: DbSession,
    session_cookie: SessionIdDep,
) -> ChatLeadSubmissionResponse:
    """Send visitor-approved follow-up details to the configured business inbox."""
    if not settings.lead_capture_enabled:
        raise HTTPException(status_code=403, detail="Chat follow-up is currently unavailable")
    if not session_cookie or session_cookie != payload.session_id:
        raise HTTPException(status_code=403, detail="Chat session could not be verified")

    transcript = [
        item.model_dump(exclude_none=True) for item in payload.transcript
    ] or get_memory_store().get_history(payload.session_id)
    if not transcript:
        raise HTTPException(status_code=400, detail="This chat session has expired. Start a new chat to continue.")

    await LeadService(db=db, settings=settings).create_chat_followup(payload, transcript)

    notification_sent, confirmation_sent = await send_chat_lead_notification(
        settings, payload, transcript
    )

    return ChatLeadSubmissionResponse(
        message=(
            "Your details were sent to Waltain Energy, and a confirmation was emailed to you."
            if notification_sent and confirmation_sent
            else "Your details are saved. "
            + (
                "A confirmation was emailed to you. "
                if confirmation_sent
                else "We could not email a confirmation. "
            )
            + (
                "Our team notification could not be delivered. "
                if not notification_sent
                else ""
            )
            + f"You can also reach us at {format_business_public_emails(settings)} "
            + f"or {settings.business_public_phone}."
        ),
        notification_sent=notification_sent,
        confirmation_sent=confirmation_sent,
    )

@router.get("/sessions/{session_id}", response_model=SessionInfoResponse)
async def get_session_info(
    session_id: str,
    settings: SettingsDep,
    db: DbSession,
) -> SessionInfoResponse:
    """Return basic metadata about a chat session.

    Used by the frontend to display the number of exchanged messages and the
    session creation timestamp.
    """
    service = ChatService(db=db, settings=settings)
    info = await service.get_session_info(session_id)
    return info
