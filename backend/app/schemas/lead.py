"""Lead-related request / response schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class LeadCreateRequest(BaseModel):
    session_id: str = Field(..., description="Chat session this lead came from")
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    mobile_number: str = Field(..., min_length=7, max_length=30)
    company_name: str | None = Field(None, max_length=255)
    service_interest: str | None = Field(None, max_length=255)
    project_description: str | None = Field(None, max_length=2000)
    preferred_location: str | None = Field(None, max_length=500)
    expected_timeline: str | None = Field(None, max_length=255)
    consent_to_contact: bool = Field(
        ..., description="User must explicitly consent"
    )


class LeadResponse(BaseModel):
    id: str
    full_name: str
    email: str
    status: str
    created_at: datetime
    message: str = "Thank you! We'll be in touch soon."
