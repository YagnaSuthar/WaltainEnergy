"""Application lifespan: startup and shutdown hooks."""

from __future__ import annotations

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage startup / shutdown resources."""
    from app.agents.memory.store import get_memory_store
    from app.db.session import dispose_engine, get_session_factory

    logger.info("🚀 Starting up …")

    # Warm the DB session factory (validates the connection string)
    get_session_factory()

    # Initialise the in-memory chat store
    get_memory_store()

    logger.info("✅ Startup complete")
    yield

    logger.info("🛑 Shutting down …")
    await dispose_engine()
    logger.info("👋 Shutdown complete")
