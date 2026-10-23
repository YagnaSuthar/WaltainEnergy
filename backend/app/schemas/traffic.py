"""Request schemas for anonymous traffic events."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class TrafficEventRequest(BaseModel):
    event_type: Literal[
        "page_view",
        "chat_open",
        "chat_message",
        "contact_form_submit",
    ]
    page_path: str = Field(default="/", max_length=512)

    @field_validator("page_path")
    @classmethod
    def validate_page_path(cls, value: str) -> str:
        if not value.startswith("/") or "?" in value or "#" in value:
            raise ValueError("Page path must be a local path without query parameters")
        return value
