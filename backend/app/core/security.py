"""Security helpers — session tokens, hashing, HMAC."""

from __future__ import annotations

import hashlib
import hmac
import secrets
from datetime import datetime, timezone


def generate_session_token() -> str:
    """Cryptographically secure 64-char hex token."""
    return secrets.token_hex(32)


def hash_token(token: str, secret: str) -> str:
    """HMAC-SHA256 hash for safe storage / comparison."""
    return hmac.new(secret.encode(), token.encode(), hashlib.sha256).hexdigest()


def constant_time_compare(a: str, b: str) -> bool:
    return hmac.compare_digest(a.encode(), b.encode())


def utcnow() -> datetime:
    return datetime.now(timezone.utc)
