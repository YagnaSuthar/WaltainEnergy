import pytest
from pydantic import ValidationError

from app.schemas.contact import ContactSubmissionRequest


def test_contact_request_requires_mobile_number() -> None:
    with pytest.raises(ValidationError):
        ContactSubmissionRequest(
            full_name="Example Visitor",
            email="visitor@example.com",
            subject="Solar inquiry",
            message="Please contact me about solar.",
            consent_to_contact=True,
        )


def test_contact_request_trims_text_and_mobile_number() -> None:
    payload = ContactSubmissionRequest(
        full_name="  Example Visitor  ",
        email=" visitor@example.com ",
        mobile_number=" +91 12345 67890 ",
        subject="  Solar inquiry  ",
        message="  Please contact me about solar.  ",
        consent_to_contact=True,
    )

    assert payload.full_name == "Example Visitor"
    assert payload.email == "visitor@example.com"
    assert payload.mobile_number == "+91 12345 67890"
    assert payload.subject == "Solar inquiry"
    assert payload.message == "Please contact me about solar."


@pytest.mark.parametrize(
    ("field", "value"),
    [
        ("full_name", " "),
        ("email", "not-an-email"),
        ("mobile_number", "   "),
        ("subject", "  "),
        ("message", "  "),
        ("consent_to_contact", False),
    ],
)
def test_contact_request_rejects_invalid_required_values(field: str, value) -> None:
    payload = {
        "full_name": "Example Visitor",
        "email": "visitor@example.com",
        "mobile_number": "+911234567890",
        "subject": "Solar inquiry",
        "message": "Please contact me about solar.",
        "consent_to_contact": True,
    }
    payload[field] = value

    with pytest.raises(ValidationError):
        ContactSubmissionRequest(**payload)
