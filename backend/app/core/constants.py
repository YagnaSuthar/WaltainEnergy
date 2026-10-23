"""Application-wide enums and constants."""

from enum import StrEnum


class Environment(StrEnum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class LeadStatus(StrEnum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    CLOSED = "closed"


class ContactSubmissionStatus(StrEnum):
    NEW = "new"
    READ = "read"
    RESPONDED = "responded"
    ARCHIVED = "archived"


class EmailStatus(StrEnum):
    PENDING = "pending"
    SENDING = "sending"
    SENT = "sent"
    FAILED = "failed"
    RETRYING = "retrying"


class EmailTemplateType(StrEnum):
    LEAD_NOTIFICATION = "lead_notification"
    CONTACT_NOTIFICATION = "contact_notification"


class LeadSource(StrEnum):
    CHATBOT = "chatbot"
    CONTACT_FORM = "contact_form"
    MANUAL = "manual"


class PricingRuleType(StrEnum):
    FIXED = "fixed"
    PER_UNIT = "per_unit"
    TIERED = "tiered"
    BASE_PLUS_OPTIONS = "base_plus_options"
    RANGE = "range"
    FORMULA = "formula"


class NotificationType(StrEnum):
    LEAD = "lead"
    CONTACT = "contact"
    ALL = "all"


class AuditEventType(StrEnum):
    LEAD_CREATED = "lead_created"
    LEAD_STATUS_CHANGED = "lead_status_changed"
    CONTACT_CREATED = "contact_created"
    EMAIL_SENT = "email_sent"
    EMAIL_FAILED = "email_failed"
    ADMIN_LOGIN = "admin_login"
    SETTINGS_UPDATED = "settings_updated"


class ChatIntent(StrEnum):
    GREETING = "greeting"
    FAQ = "faq"
    SERVICE_INQUIRY = "service_inquiry"
    PRICE_ESTIMATE = "price_estimate"
    QUOTE_REQUEST = "quote_request"
    LEAD_SUBMISSION = "lead_submission"
    GENERAL_QUESTION = "general_question"
    FOLLOW_UP = "follow_up"
    FAREWELL = "farewell"
    UNKNOWN = "unknown"


# Rate-limit key prefixes
RATE_LIMIT_CHAT = "rl:chat"
RATE_LIMIT_SESSION = "rl:session"
RATE_LIMIT_LEAD = "rl:lead"
RATE_LIMIT_CONTACT = "rl:contact"

# Session constants
SESSION_COOKIE_NAME_DEFAULT = "we_chat_session"
MAX_MESSAGE_DISPLAY = 50
