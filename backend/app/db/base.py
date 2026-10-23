"""Import all models so Alembic can discover them."""

from app.models.base import Base  # noqa: F401
from app.models.business import Business  # noqa: F401
from app.models.business_settings import BusinessSettings  # noqa: F401
from app.models.faq import FAQ  # noqa: F401
from app.models.service import Service  # noqa: F401
from app.models.pricing_rule import PricingRule  # noqa: F401
from app.models.lead import Lead  # noqa: F401
from app.models.contact_submission import ContactSubmission  # noqa: F401
from app.models.email_outbox import EmailOutbox  # noqa: F401
from app.models.audit_event import AuditEvent  # noqa: F401
from app.models.traffic_event import TrafficEvent  # noqa: F401
