"""Persistence helpers for anonymous, non-content analytics."""

from __future__ import annotations

import hashlib
import secrets

from fastapi import Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.models.traffic_event import TrafficEvent

VISITOR_COOKIE_NAME = "waltain_visitor"
VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365


def _visitor_hash(visitor_token: str) -> str:
    return hashlib.sha256(visitor_token.encode("utf-8")).hexdigest()


async def record_traffic_event(
    db: AsyncSession,
    request: Request,
    response: Response,
    settings: Settings,
    event_type: str,
    page_path: str,
) -> None:
    visitor_token = request.cookies.get(VISITOR_COOKIE_NAME)
    if not visitor_token or len(visitor_token) > 128:
        visitor_token = secrets.token_urlsafe(32)
        response.set_cookie(
            key=VISITOR_COOKIE_NAME,
            value=visitor_token,
            max_age=VISITOR_COOKIE_MAX_AGE,
            httponly=True,
            secure=settings.session_cookie_secure,
            samesite=settings.session_cookie_samesite,
            path="/",
            domain=settings.session_cookie_domain or None,
        )

    db.add(
        TrafficEvent(
            event_type=event_type,
            visitor_hash=_visitor_hash(visitor_token),
            page_path=page_path,
        )
    )
    await db.flush()
