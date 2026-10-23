"""Lead model."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class Lead(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "leads"

    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    mobile_number: Mapped[str] = mapped_column(String(30), nullable=False)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    service_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("services.id", ondelete="SET NULL"), nullable=True
    )
    service_name_snapshot: Mapped[str | None] = mapped_column(String(255), nullable=True)
    inquiry_subject: Mapped[str | None] = mapped_column(String(500), nullable=True)
    project_description: Mapped[str | None] = mapped_column(Text, nullable=True)

    requirements_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    budget_min: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    budget_max: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="INR")

    preferred_location: Mapped[str | None] = mapped_column(String(500), nullable=True)
    expected_timeline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    quantity: Mapped[str | None] = mapped_column(String(100), nullable=True)

    estimate_min: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    estimate_max: Mapped[float | None] = mapped_column(Numeric(14, 2), nullable=True)
    estimate_assumptions_json: Mapped[str | None] = mapped_column(Text, nullable=True)

    inquiry_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    transcript_text: Mapped[str | None] = mapped_column(Text, nullable=True)

    source: Mapped[str] = mapped_column(String(50), default="chatbot")
    consent_to_contact: Mapped[bool] = mapped_column(Boolean, default=False)
    consent_timestamp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    consent_version: Mapped[str | None] = mapped_column(String(20), nullable=True)

    status: Mapped[str] = mapped_column(String(50), default="new", index=True)
