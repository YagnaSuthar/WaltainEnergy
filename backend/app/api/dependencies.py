"""FastAPI dependency injection helpers."""

from __future__ import annotations

from typing import Annotated

from fastapi import Cookie, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.db.session import get_db


# ── Settings ──
SettingsDep = Annotated[Settings, Depends(get_settings)]

# ── Database session ──
DbSession = Annotated[AsyncSession, Depends(get_db)]


# ── Chat session ID from cookie ──
async def get_session_id_from_cookie(
    request: Request,
    we_chat_session: str | None = Cookie(default=None),
) -> str | None:
    """Extract the chat session token from the cookie, if present."""
    return we_chat_session


SessionIdDep = Annotated[str | None, Depends(get_session_id_from_cookie)]
