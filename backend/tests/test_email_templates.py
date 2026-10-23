from __future__ import annotations

from types import SimpleNamespace

import pytest

from app.schemas.contact import ContactSubmissionRequest
from app.services.email import _format_chat_markdown, send_contact_notification


def test_chat_markdown_is_formatted_for_html_and_plain_text() -> None:
    html, text = _format_chat_markdown(
        "## Solar options\n"
        "A **solar + storage** setup provides ***backup***.\n"
        "- Reliable power\n"
        "- Lower bills\n"
        "See [our website](https://waltainenergy.com)."
    )

    assert "<h3" in html
    assert "<strong>solar + storage</strong>" in html
    assert "<strong><em>backup</em></strong>" in html
    assert "<ul" in html
    assert "<a href=\"https://waltainenergy.com\"" in html
    assert "##" not in text
    assert "**" not in text
    assert "***" not in text
    assert "our website (https://waltainenergy.com)" in text


@pytest.mark.asyncio
async def test_contact_notification_has_branded_layout_and_logo(monkeypatch) -> None:
    sent_messages = []

    async def fake_send(message, **kwargs):
        sent_messages.append(message)

    monkeypatch.setattr("aiosmtplib.send", fake_send)
    settings = SimpleNamespace(
        smtp_host="smtp.example.test",
        smtp_port=587,
        smtp_username="sender@example.com",
        smtp_password="test-password",
        smtp_use_tls=True,
        smtp_use_ssl=False,
        email_timeout_seconds=10,
        email_from_name="Waltain Energy",
        email_from_address="sender@example.com",
        email_reply_to_enabled=True,
        business_notification_email="yagna.suthar@gmail.com",
        business_public_email=(
            "jalpan@waltainenergy.com,mailus@waltainenergy.com,"
            "connect.waltainenergy@gmail.com"
        ),
        business_public_phone="+919998233956",
    )
    payload = ContactSubmissionRequest(
        full_name="Example Visitor",
        email="visitor@example.com",
        mobile_number="+911234567890",
        subject="Solar inquiry",
        message="Please contact me about solar.",
        consent_to_contact=True,
    )

    await send_contact_notification(settings, payload)

    message = sent_messages[0]
    assert message["To"] == "yagna.suthar@gmail.com"
    assert message["Reply-To"] == "visitor@example.com"
    html = message.get_body(preferencelist=("html",)).get_content()
    assert "New website inquiry" in html
    assert "cid:waltain-logo" in html
    assert "<strong>jalpan@waltainenergy.com</strong>" in html
    assert "<strong>mailus@waltainenergy.com</strong>" in html
    assert "connect.waltainenergy@gmail.com" in html
    assert any(part.get_content_maintype() == "image" for part in message.walk())
