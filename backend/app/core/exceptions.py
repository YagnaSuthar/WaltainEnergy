"""Custom exception classes and FastAPI exception handlers."""

from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


# ── Base ─────────────────────────────────────────────────────────
class AppError(Exception):
    """Base application error."""

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
        detail: Any = None,
    ):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.detail = detail
        super().__init__(message)


# ── Specific errors ──────────────────────────────────────────────
class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__("NOT_FOUND", message, 404)


class ValidationError(AppError):
    def __init__(self, message: str = "Validation failed", detail: Any = None):
        super().__init__("VALIDATION_ERROR", message, 422, detail)


class RateLimitError(AppError):
    def __init__(self, message: str = "Please wait before sending another request."):
        super().__init__("RATE_LIMIT_EXCEEDED", message, 429)


class SessionExpiredError(AppError):
    def __init__(self):
        super().__init__(
            "SESSION_EXPIRED",
            "Your session has expired. Please start a new conversation.",
            401,
        )


class SessionNotFoundError(AppError):
    def __init__(self):
        super().__init__(
            "SESSION_NOT_FOUND",
            "Session not found. Please start a new conversation.",
            404,
        )


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required"):
        super().__init__("UNAUTHORIZED", message, 401)


class ForbiddenError(AppError):
    def __init__(self, message: str = "Access denied"):
        super().__init__("FORBIDDEN", message, 403)


class LLMError(AppError):
    def __init__(self, message: str = "AI service temporarily unavailable"):
        super().__init__("LLM_ERROR", message, 503)


class EmailError(AppError):
    def __init__(self, message: str = "Email delivery issue"):
        super().__init__("EMAIL_ERROR", message, 500)


# ── Handlers ─────────────────────────────────────────────────────
def _error_body(code: str, message: str, request_id: str) -> dict:
    return {"error": {"code": code, "message": message, "request_id": request_id}}


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    rid = getattr(request.state, "request_id", "")
    logger.warning("AppError %s: %s [%s]", exc.code, exc.message, rid)
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_body(exc.code, exc.message, rid),
    )


async def generic_error_handler(request: Request, exc: Exception) -> JSONResponse:
    rid = getattr(request.state, "request_id", "")
    logger.exception("Unhandled error [%s]", rid)
    return JSONResponse(
        status_code=500,
        content=_error_body(
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later.",
            rid,
        ),
    )


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppError, app_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, generic_error_handler)
