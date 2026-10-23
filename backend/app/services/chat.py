from __future__ import annotations

import uuid
from datetime import datetime

from app.api.dependencies import SettingsDep
from app.models.base import TimestampMixin
from app.agents.orchestrator import orchestrate_chat
from app.utils import utc_now

# Simple dataclasses for session info (could be a model in DB if needed)
class ChatSession(TimestampMixin):
    def __init__(self, session_id: str, welcome_message: str):
        self.session_id = session_id
        self.welcome_message = welcome_message
        self.created_at = utc_now()

class ChatService:
    def __init__(self, db, settings: SettingsDep):
        self._db = db
        self._settings = settings

    async def create_session(self) -> ChatSession:
        """Generate a new session ID and welcome message.

        In a production system this would persist a session record; for now we
        keep it in‑memory via the memory store (initialized in ``lifespan``).
        """
        session_id = str(uuid.uuid4())
        welcome = "Hello! I'm your Waltain Energy assistant. How can I help you today?"
        return ChatSession(session_id=session_id, welcome_message=welcome)

    async def process_message(self, session_id: str, user_message: str):
        """Orchestrate the LLM flow for a user message.

        Delegates to ``orchestrate_chat`` which runs the LangGraph state graph.
        The result is a ``ChatMessageResponse`` compatible dict.
        """
        # Run the agent orchestrator – it returns a dict matching the schema
        response = await orchestrate_chat(
            session_id=session_id,
            user_message=user_message,
            db=self._db,
            settings=self._settings,
        )
        return response

    async def get_session_info(self, session_id: str):
        """Return basic metadata about a chat session.

        For now we read from the in‑memory store (registered in ``lifespan``).
        """
        from app.agents.memory.store import get_memory_store

        store = get_memory_store()
        history = store.get_history(session_id)
        return {
            "session_id": session_id,
            "message_count": len(history),
            "created_at": history[0]["timestamp"] if history else utc_now(),
            "is_active": True,
        }
