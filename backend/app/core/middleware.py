"""Middleware: request-ID injection, CORS, and in-memory rate limiting."""

from __future__ import annotations

import logging
import time
from collections import defaultdict
from typing import Callable

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import get_settings
from app.core.logging import generate_request_id, request_id_var

logger = logging.getLogger(__name__)


# ── Request-ID middleware ────────────────────────────────────────
class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        rid = generate_request_id()
        request_id_var.set(rid)
        request.state.request_id = rid
        response = await call_next(request)
        response.headers["X-Request-ID"] = rid
        return response


# ── Simple in-memory rate limiter ────────────────────────────────
class _TokenBucket:
    """Sliding-window token bucket per key."""

    def __init__(self) -> None:
        self._hits: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, key: str, max_hits: int, window_seconds: int) -> bool:
        now = time.time()
        cutoff = now - window_seconds
        bucket = self._hits[key]
        # Prune old entries
        self._hits[key] = [t for t in bucket if t > cutoff]
        if len(self._hits[key]) >= max_hits:
            return False
        self._hits[key].append(now)
        return True

    def cleanup(self, max_age: int = 7200) -> None:
        """Remove stale keys."""
        now = time.time()
        cutoff = now - max_age
        stale = [k for k, v in self._hits.items() if all(t < cutoff for t in v)]
        for k in stale:
            del self._hits[k]


rate_limiter = _TokenBucket()


# ── Timing middleware ────────────────────────────────────────────
class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        response.headers["X-Response-Time-Ms"] = f"{elapsed_ms:.1f}"
        logger.info(
            "%s %s %s %.1fms",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response


# ── Register all middleware ──────────────────────────────────────
def register_middleware(app: FastAPI) -> None:
    settings = get_settings()

    # Order matters: outermost first
    app.add_middleware(TimingMiddleware)
    app.add_middleware(RequestIdMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-ID", "X-Response-Time-Ms"],
    )
