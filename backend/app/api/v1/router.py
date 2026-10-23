"""v1 API sub-router — aggregates all v1 endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints.chat import router as chat_router
from app.api.v1.endpoints.leads import router as leads_router
from app.api.v1.endpoints.contact import router as contact_router
from app.api.v1.endpoints.traffic import router as traffic_router

v1_router = APIRouter()

# Include sub-routers
v1_router.include_router(chat_router)
v1_router.include_router(leads_router)
v1_router.include_router(contact_router)
v1_router.include_router(traffic_router)
