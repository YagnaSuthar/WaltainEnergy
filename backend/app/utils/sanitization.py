"""HTML sanitization and input cleanup."""

from __future__ import annotations

import html
import re


def sanitize_html(text: str) -> str:
    """Escape HTML entities to prevent XSS."""
    return html.escape(text, quote=True)


def strip_control_chars(text: str) -> str:
    """Remove control characters except newlines and tabs."""
    return re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)


def clean_user_input(text: str, max_length: int = 4000) -> str:
    """Strip, truncate, and clean user-supplied text."""
    text = text.strip()
    text = strip_control_chars(text)
    return text[:max_length]


def clean_assistant_response(text: str) -> str:
    """Remove Markdown structure that should not appear as raw chat text."""
    cleaned_lines = []
    for line in strip_control_chars(text).splitlines():
        line = re.sub(r"^\s{0,3}#{1,6}\s+", "", line)
        line = re.sub(r"^\s*>\s?", "", line)
        line = re.sub(r"^(\s*)[-*+]\s+", r"\1• ", line)
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines).strip()


def normalise_email(email: str) -> str:
    return email.strip().lower()


def normalise_phone(phone: str) -> str:
    """Keep only digits and leading +"""
    phone = phone.strip()
    if phone.startswith("+"):
        return "+" + re.sub(r"[^\d]", "", phone[1:])
    return re.sub(r"[^\d]", "", phone)
