"""Chat-related request / response schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Requests ─────────────────────────────────────────


class ChatSessionCreateRequest(BaseModel):
    """Body is optional — the server generates the session."""
    pass


class ChatMessageRequest(BaseModel):
    session_id: str = Field(..., description="Session token")
    message: str = Field(
        ..., min_length=1, max_length=4000, description="User message"
    )


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)
    timestamp: datetime | None = None


class ChatLeadSubmissionRequest(BaseModel):
    session_id: str = Field(..., min_length=16, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=255)
    company_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    mobile_number: str = Field(..., min_length=7, max_length=30)
    consent_to_contact: bool
    transcript: list[ChatMessage] = Field(default_factory=list, max_length=40)

    @field_validator("consent_to_contact")
    @classmethod
    def require_contact_consent(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required before sending contact details")
        return value


class ChatLeadSubmissionResponse(BaseModel):
    message: str
    notification_sent: bool
    confirmation_sent: bool = False


# ── Responses ────────────────────────────────────────


class ChatSessionResponse(BaseModel):
    session_id: str
    welcome_message: str
    created_at: datetime


class ChatMessageResponse(BaseModel):
    session_id: str
    reply: str
    intent: str | None = None
    show_lead_form: bool = False
    assistant_failed: bool = False
    lead_form_context: dict[str, Any] | None = None


class SessionInfoResponse(BaseModel):
    session_id: str
    message_count: int
    created_at: datetime
    is_active: bool
