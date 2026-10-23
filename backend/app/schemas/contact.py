"""Contact form request / response schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactSubmissionRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    mobile_number: str = Field(..., min_length=7, max_length=30)
    subject: str = Field(..., min_length=3, max_length=500)
    message: str = Field(..., min_length=10, max_length=5000)
    consent_to_contact: bool = Field(
        ..., description="User must explicitly consent"
    )

    @field_validator("full_name", "email", "subject", "message", mode="before")
    @classmethod
    def strip_text_fields(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("mobile_number", mode="before")
    @classmethod
    def normalize_mobile_number(cls, value: str) -> str:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("consent_to_contact")
    @classmethod
    def require_contact_consent(cls, value: bool) -> bool:
        if not value:
            raise ValueError("Consent is required before submitting this inquiry")
        return value


class ContactResponse(BaseModel):
    id: str
    status: str
    created_at: datetime
    notification_sent: bool = False
    message: str = "Thank you for reaching out. We'll respond shortly."
