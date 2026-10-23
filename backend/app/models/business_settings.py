"""Business settings model."""

from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDMixin


class BusinessSettings(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "business_settings"

    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    public_name: Mapped[str] = mapped_column(String(255), nullable=False)
    website_url: Mapped[str] = mapped_column(String(500), default="")
    welcome_message: Mapped[str] = mapped_column(
        Text, default="Hello! How can I help you today?"
    )
    system_instructions: Mapped[str] = mapped_column(Text, default="")
    public_contact_email: Mapped[str] = mapped_column(String(255), default="")
    public_phone: Mapped[str] = mapped_column(String(50), default="")
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Kolkata")
    qualification_threshold: Mapped[int] = mapped_column(Integer, default=3)
    minimum_meaningful_exchanges: Mapped[int] = mapped_column(Integer, default=2)
    lead_capture_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    notification_email: Mapped[str] = mapped_column(String(255), default="")

    business = relationship("Business", back_populates="settings")


class BusinessEmailRecipient(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "business_email_recipients"

    business_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    notification_type: Mapped[str] = mapped_column(String(50), default="all")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
