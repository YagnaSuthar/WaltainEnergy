"""FastAPI application factory."""

from __future__ import annotations

from fastapi import FastAPI

from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.middleware import register_middleware
from app.lifespan import lifespan


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        lifespan=lifespan,
    )

    # Exception handlers
    register_exception_handlers(app)

    # Middleware (CORS, request-ID, timing)
    register_middleware(app)

    # Routers
    from app.api.router import root_router

    app.include_router(root_router)

    return app


app = create_app()
