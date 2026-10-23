from __future__ import annotations

import time
from collections import defaultdict
from threading import Lock

# Simple in‑memory store; in production replace with Redis or DB
class MemoryStore:
    def __init__(self, ttl_seconds: int = 3600):
        self._ttl = ttl_seconds
        self._store: dict[str, list[dict]] = defaultdict(list)
        self._timestamps: dict[str, float] = {}
        self._lock = Lock()

    def _is_expired(self, session_id: str) -> bool:
        ts = self._timestamps.get(session_id)
        return ts is None or (time.time() - ts) > self._ttl

    def get_history(self, session_id: str) -> list[dict]:
        with self._lock:
            if self._is_expired(session_id):
                self._store.pop(session_id, None)
                self._timestamps.pop(session_id, None)
                return []
            return list(self._store.get(session_id, []))

    def add_message(self, session_id: str, role: str, content: str) -> None:
        with self._lock:
            if self._is_expired(session_id):
                self._store[session_id] = []
            self._store[session_id].append({"role": role, "content": content, "timestamp": time.time()})
            self._timestamps[session_id] = time.time()

    def clear(self, session_id: str) -> None:
        with self._lock:
            self._store.pop(session_id, None)
            self._timestamps.pop(session_id, None)

# Singleton instance created at app startup (lifespan)
_memory_store: MemoryStore | None = None

def get_memory_store() -> MemoryStore:
    global _memory_store
    if _memory_store is None:
        # Default TTL from settings will be injected later via lifespan
        from app.core.config import get_settings
        ttl = get_settings().chat_memory_backend and get_settings().chat_session_ttl_seconds or 3600
        _memory_store = MemoryStore(ttl_seconds=ttl)
    return _memory_store
