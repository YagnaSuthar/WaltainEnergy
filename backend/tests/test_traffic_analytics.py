from __future__ import annotations

import hashlib
from types import SimpleNamespace

import pytest
from pydantic import ValidationError
from starlette.requests import Request
from starlette.responses import Response

from app.schemas.traffic import TrafficEventRequest
from app.services.traffic import VISITOR_COOKIE_NAME, record_traffic_event


def _request(cookie_header: str = "") -> Request:
    headers = []
    if cookie_header:
        headers.append((b"cookie", cookie_header.encode()))
    return Request(
        {
            "type": "http",
            "asgi": {"version": "3.0"},
            "http_version": "1.1",
            "method": "POST",
            "scheme": "https",
            "path": "/api/v1/traffic/events",
            "raw_path": b"/api/v1/traffic/events",
            "query_string": b"",
            "headers": headers,
            "server": ("example.test", 443),
            "client": ("127.0.0.1", 12345),
        }
    )


class FakeDatabase:
    def __init__(self) -> None:
        self.events = []

    def add(self, event) -> None:
        self.events.append(event)

    async def flush(self) -> None:
        return None


def test_traffic_event_schema_accepts_supported_events_only() -> None:
    payload = TrafficEventRequest(event_type="chat_open", page_path="/contact")

    assert payload.event_type == "chat_open"
    assert payload.page_path == "/contact"
    with pytest.raises(ValidationError):
        TrafficEventRequest(event_type="report_view", page_path="/")
    with pytest.raises(ValidationError):
        TrafficEventRequest(event_type="page_view", page_path="/contact?email=private")


@pytest.mark.asyncio
async def test_traffic_event_sets_anonymous_cookie_and_stores_only_hash() -> None:
    db = FakeDatabase()
    response = Response()
    settings = SimpleNamespace(
        session_cookie_secure=True,
        session_cookie_samesite="lax",
        session_cookie_domain="",
    )

    await record_traffic_event(
        db, _request(), response, settings, "page_view", "/contact"
    )

    cookie = response.headers["set-cookie"]
    token = next(
        value.split("=", 1)[1].split(";", 1)[0]
        for value in cookie.split("; ")
        if value.startswith(f"{VISITOR_COOKIE_NAME}=")
    )
    assert f"{VISITOR_COOKIE_NAME}=" in cookie
    assert "HttpOnly" in cookie
    assert "Secure" in cookie
    assert db.events[0].visitor_hash == hashlib.sha256(token.encode()).hexdigest()
    assert token not in db.events[0].visitor_hash
    assert db.events[0].event_type == "page_view"
    assert db.events[0].page_path == "/contact"


@pytest.mark.asyncio
async def test_traffic_event_reuses_existing_visitor_cookie() -> None:
    visitor_token = "existing-anonymous-visitor-token"
    db = FakeDatabase()
    response = Response()

    await record_traffic_event(
        db,
        _request(f"{VISITOR_COOKIE_NAME}={visitor_token}"),
        response,
        SimpleNamespace(session_cookie_secure=False, session_cookie_samesite="lax"),
        "chat_open",
        "/",
    )

    assert "set-cookie" not in response.headers
    assert db.events[0].visitor_hash == hashlib.sha256(
        visitor_token.encode()
    ).hexdigest()
    assert db.events[0].event_type == "chat_open"
