"""Root API router — mounts health and v1 sub-router."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.router import v1_router
from app.core.config import get_settings

root_router = APIRouter()

# Health lives at the top level (no prefix)
root_router.include_router(health_router, tags=["health"])

# Everything else lives under /api/v1
settings = get_settings()
root_router.include_router(v1_router, prefix=settings.api_prefix)
