"""Anonymous analytics event collection; reporting stays backend-only."""

from __future__ import annotations

from fastapi import APIRouter, Request, Response

from app.api.dependencies import DbSession, SettingsDep
from app.schemas.traffic import TrafficEventRequest
from app.services.traffic import record_traffic_event

router = APIRouter(prefix="/traffic", tags=["traffic"])


@router.post("/events", status_code=204)
async def collect_traffic_event(
    payload: TrafficEventRequest,
    request: Request,
    response: Response,
    settings: SettingsDep,
    db: DbSession,
) -> Response:
    await record_traffic_event(
        db,
        request,
        response,
        settings,
        payload.event_type,
        payload.page_path,
    )
    return response
