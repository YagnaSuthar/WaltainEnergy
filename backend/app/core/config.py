"""Centralised application configuration loaded from environment variables."""

from __future__ import annotations

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """All configuration is loaded and validated once at startup."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # ── Application ──────────────────────────────────────────────
    app_name: str = "Waltain Energy AI Chatbot"
    app_env: str = "development"
    app_version: str = "1.0.0"
    debug: bool = False
    log_level: str = "INFO"
    api_prefix: str = "/api/v1"
    public_backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    # ── Business ─────────────────────────────────────────────────
    business_id: str = "waltain-energy-default"
    business_name: str = "Waltain Energy Private Limited"
    business_website_url: str = "https://waltainenergy.com"
    business_timezone: str = "Asia/Kolkata"
    business_currency: str = "INR"
    business_notification_email: str = "connect.waltainenergy@gmail.com"
    # Comma- or semicolon-separated addresses; first two are featured publicly.
    business_public_email: str = (
        "jalpan@waltainenergy.com,mailus@waltainenergy.com,"
        "connect.waltainenergy@gmail.com"
    )
    business_public_phone: str = "+91 99982 33956"

    # ── Database ─────────────────────────────────────────────────
    database_url: str = "sqlite+aiosqlite:///./dev.db"
    db_pool_size: int = 5
    db_max_overflow: int = 5
    db_pool_timeout_seconds: int = 30
    db_connect_timeout_seconds: int = 10

    # ── LLM ──────────────────────────────────────────────────────
    llm_provider: str = "gemini"
    llm_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"
    llm_timeout_seconds: int = 30
    llm_max_output_tokens: int = 1200
    llm_max_retries: int = 2
    llm_temperature: float = 0.2
    llm_max_requests_per_session: int = 30

    # ── Memory ───────────────────────────────────────────────────
    chat_memory_backend: str = "memory"
    chat_session_ttl_seconds: int = 3600
    chat_max_history_messages: int = 20
    chat_max_message_length: int = 4000
    chat_max_context_tokens: int = 8000
    chat_summary_enabled: bool = True
    redis_url: str = ""

    # ── Session / Cookies ────────────────────────────────────────
    session_token_secret: str = "CHANGE-ME-in-production-use-a-random-64-char-string"
    session_cookie_name: str = "we_chat_session"
    session_cookie_secure: bool = False
    session_cookie_httponly: bool = True
    session_cookie_samesite: str = "lax"
    session_cookie_domain: str = ""
    session_token_ttl_seconds: int = 3600

    # ── Lead Qualification ───────────────────────────────────────
    lead_capture_enabled: bool = True
    lead_qualification_threshold: int = 3
    lead_min_meaningful_exchanges: int = 2
    lead_deduplication_window_hours: int = 24
    lead_require_consent: bool = True
    lead_consent_version: str = "1"

    # ── Rate Limiting ────────────────────────────────────────────
    rate_limit_backend: str = "memory"
    chat_rate_limit_per_minute: int = 100
    chat_rate_limit_per_hour: int = 100
    lead_rate_limit_per_hour: int = 5
    contact_rate_limit_per_hour: int = 5
    session_create_rate_limit_per_hour: int = 10

    # ── Email ────────────────────────────────────────────────────
    email_provider: str = "smtp"
    email_from_address: str = "notifications@example.com"
    email_from_name: str = "Waltain Energy Notifications"
    email_reply_to_enabled: bool = True
    email_timeout_seconds: int = 20
    email_max_retries: int = 5
    email_retry_base_seconds: int = 30
    email_retry_max_seconds: int = 3600

    # ── SMTP ─────────────────────────────────────────────────────
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    smtp_use_ssl: bool = False

    # ── Admin ────────────────────────────────────────────────────
    admin_auth_enabled: bool = True
    admin_session_secret: str = "CHANGE-ME-admin-secret"
    admin_bootstrap_email: str = "admin@example.com"
    admin_bootstrap_password_hash: str = ""

    # ── Privacy ──────────────────────────────────────────────────
    privacy_policy_url: str = ""
    chat_log_content: bool = False
    pii_redaction_enabled: bool = True

    # ── Workers ──────────────────────────────────────────────────
    email_worker_enabled: bool = True
    email_worker_poll_interval_seconds: int = 5
    email_worker_batch_size: int = 10
    email_worker_concurrency: int = 2
    port: int = 8000

    # ── Derived helpers ──────────────────────────────────────────
    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def business_public_emails(self) -> list[str]:
        return [
            email.strip()
            for email in self.business_public_email.replace(";", ",").split(",")
            if email.strip()
        ]

    @field_validator("log_level")
    @classmethod
    def _upper_log_level(cls, v: str) -> str:
        return v.upper()


def get_business_public_emails(settings: object) -> list[str]:
    """Return configured public addresses, supporting older settings test doubles."""
    emails = getattr(settings, "business_public_emails", None)
    if emails is not None:
        return emails
    configured = getattr(settings, "business_public_email", "")
    return [
        email.strip()
        for email in configured.replace(";", ",").split(",")
        if email.strip()
    ]


def format_business_public_emails(settings: object) -> str:
    emails = get_business_public_emails(settings)
    if len(emails) < 2:
        return emails[0] if emails else ""
    return f"{', '.join(emails[:-1])} or {emails[-1]}"


# Singleton
_settings: Settings | None = None


def get_settings() -> Settings:
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
