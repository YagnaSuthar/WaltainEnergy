from __future__ import annotations

import logging
import re
from email.message import EmailMessage
from email.utils import formataddr
from html import escape
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from app.models.email_outbox import EmailOutbox
from app.repositories.email_outbox import EmailOutboxRepository
from app.core.config import get_business_public_emails
from app.utils import utc_now

logger = logging.getLogger(__name__)


def _brand_logo() -> bytes | None:
    logo_path = Path(__file__).resolve().parents[1] / "assets" / "waltain-logo.png"
    return logo_path.read_bytes() if logo_path.is_file() else None


def _attach_brand_logo(message: EmailMessage, logo: bytes | None) -> None:
    if logo is None:
        return
    html_part = message.get_body(preferencelist=("html",))
    if html_part is not None:
        html_part.add_related(
            logo,
            maintype="image",
            subtype="png",
            cid="<waltain-logo>",
        )


def _brand_logo_markup(logo: bytes | None) -> str:
    if logo is None:
        return (
            "<strong style=\"font-size:18px;letter-spacing:1px;color:#ffffff\">"
            "WALTAIN ENERGY</strong>"
        )
    return (
        "<img src=\"cid:waltain-logo\" alt=\"Waltain Energy logo\" "
        "width=\"58\" height=\"52\" "
        "style=\"display:block;width:58px;height:auto;border:0;background:#ffdf55\">"
    )


def _email_layout(title: str, content: str, logo: bytes | None) -> str:
    return (
        "<!doctype html><html><body style=\"margin:0;padding:24px 12px;"
        "background-color:#f2f5f9;font-family:Arial,Helvetica,sans-serif;"
        "color:#26344d;line-height:1.6\">"
        "<div style=\"display:none;max-height:0;overflow:hidden;opacity:0\">"
        f"{escape(title)}</div>"
        "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
        "width=\"100%\" style=\"max-width:620px;margin:0 auto;background:#ffffff;"
        "border:1px solid #e4e9f0;border-radius:12px;overflow:hidden\">"
        "<tr><td style=\"padding:18px 24px;background:#14264d\">"
        "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">"
        "<tr><td style=\"vertical-align:middle;padding-right:14px\">"
        f"{_brand_logo_markup(logo)}</td>"
        "<td style=\"vertical-align:middle;color:#ffffff\">"
        "<strong style=\"font-size:17px;letter-spacing:.3px\">Waltain Energy</strong>"
        "<br><span style=\"font-size:12px;color:#d9e4f6\">Powering a sustainable future</span>"
        "</td></tr></table></td></tr>"
        "<tr><td style=\"padding:28px 28px 24px\">"
        f"<h1 style=\"margin:0 0 18px;color:#14264d;font-size:23px;line-height:1.3\">"
        f"{escape(title)}</h1>{content}</td></tr>"
        "<tr><td style=\"padding:16px 28px;background:#f7f9fc;border-top:1px solid #e8edf3;"
        "color:#66748b;font-size:12px\">"
        "Waltain Energy Private Limited · "
        "<a href=\"https://waltainenergy.com\" style=\"color:#286b9b;text-decoration:none\">"
        "waltainenergy.com</a><br>"
        "This message was sent in response to an inquiry on our website.</td></tr>"
        "</table></body></html>"
    )


def _public_email_markup(settings: Any) -> str:
    emails = get_business_public_emails(settings)
    links = []
    for index, address in enumerate(emails):
        link = (
            f"<a href=\"mailto:{escape(address, quote=True)}\" "
            "style=\"color:#286b9b;text-decoration:none\">"
            f"{'<strong>' if index < 2 else ''}{escape(address)}"
            f"{'</strong>' if index < 2 else ''}</a>"
        )
        links.append(link)
    return " · ".join(links)


def _format_chat_markdown(content: str) -> tuple[str, str]:
    """Render common chat Markdown safely for HTML and plain-text email clients."""
    html_blocks: list[str] = []
    text_blocks: list[str] = []
    current_list: list[str] = []
    list_is_ordered = False

    def flush_list() -> None:
        nonlocal current_list
        if current_list:
            tag = "ol" if list_is_ordered else "ul"
            items = "".join(f"<li>{item}</li>" for item in current_list)
            html_blocks.append(
                f"<{tag} style=\"margin:8px 0;padding-left:24px\">{items}</{tag}>"
            )
            current_list = []

    def inline(raw: str) -> tuple[str, str]:
        link_values: list[str] = []

        def preserve_link(match: re.Match[str]) -> str:
            label, url = match.groups()
            parsed_url = urlsplit(url)
            if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
                return match.group(0)
            link_values.append(
                f"<a href=\"{escape(url, quote=True)}\" style=\"color:#286b9b\">"
                f"{escape(label)}</a>"
            )
            return f"\x00LINK{len(link_values) - 1}\x00"

        safe_text = re.sub(r"\[([^\]]+)\]\((https?://[^\s)]+)\)", preserve_link, raw)
        html_text = escape(safe_text)
        for pattern, replacement in (
            (r"\*\*\*(.+?)\*\*\*", r"<strong><em>\1</em></strong>"),
            (r"(\*\*|__)(.+?)\1", r"<strong>\2</strong>"),
            (r"~~(.+?)~~", r"<del>\1</del>"),
            (r"`([^`]+)`", r"<code>\1</code>"),
            (r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>"),
            (r"(?<!_)_([^_]+)_(?!_)", r"<em>\1</em>"),
        ):
            html_text = re.sub(pattern, replacement, html_text)
        for index, link in enumerate(link_values):
            html_text = html_text.replace(f"\x00LINK{index}\x00", link)

        plain_text = re.sub(
            r"\[([^\]]+)\]\((https?://[^\s)]+)\)",
            lambda match: f"{match.group(1)} ({match.group(2)})",
            raw,
        )
        plain_text = re.sub(r"(\*\*\*|___)(.+?)\1", r"\2", plain_text)
        plain_text = re.sub(r"(\*\*|__|~~|`)(.+?)\1", r"\2", plain_text)
        plain_text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"\1", plain_text)
        plain_text = re.sub(r"(?<!_)_([^_]+)_(?!_)", r"\1", plain_text)
        return html_text, plain_text

    for raw_line in content.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        line = raw_line.strip()
        if not line:
            flush_list()
            continue

        heading = re.match(r"^(#{1,6})\s+(.+)$", line)
        bullet = re.match(r"^[-*+]\s+(.+)$", line)
        numbered = re.match(r"^\d+[.)]\s+(.+)$", line)
        if bullet or numbered:
            ordered = numbered is not None
            if current_list and ordered != list_is_ordered:
                flush_list()
            list_is_ordered = ordered
            html_item, text_item = inline((bullet or numbered).group(1))
            current_list.append(html_item)
            text_blocks.append(f"{len(current_list)}. {text_item}" if ordered else f"- {text_item}")
            continue

        flush_list()
        if heading:
            level = min(len(heading.group(1)) + 1, 6)
            html_heading, text_heading = inline(heading.group(2))
            html_blocks.append(
                f"<h{level} style=\"margin:16px 0 8px;color:#14264d\">{html_heading}</h{level}>"
            )
            text_blocks.append(text_heading)
        else:
            html_line, text_line = inline(line)
            html_blocks.append(f"<p style=\"margin:0 0 10px\">{html_line}</p>")
            text_blocks.append(text_line)

    flush_list()
    return "".join(html_blocks), "\n".join(text_blocks)


async def send_contact_notification(settings: Any, data: Any) -> None:
    """Send a contact notification to the server-configured business inbox."""
    if not settings.smtp_host or not settings.email_from_address:
        raise RuntimeError("SMTP host and verified sender address must be configured")
    if settings.smtp_use_tls and settings.smtp_use_ssl:
        raise RuntimeError("Configure either SMTP STARTTLS or implicit SSL, not both")

    message = EmailMessage()
    subject = " ".join(data.subject.splitlines()).strip()
    message["Subject"] = f"Website inquiry: {subject[:400]}"
    message["From"] = formataddr((settings.email_from_name, settings.email_from_address))
    message["To"] = settings.business_notification_email
    if settings.email_reply_to_enabled:
        message["Reply-To"] = data.email

    text_body = (
        "NEW WEBSITE INQUIRY — WALTAIN ENERGY\n\n"
        f"Name: {data.full_name}\n"
        f"Email: {data.email}\n"
        f"Mobile: {data.mobile_number or 'Not provided'}\n"
        f"Subject: {subject}\n\n"
        f"Message:\n{data.message}\n\n"
        f"Consent to contact: {'Yes' if data.consent_to_contact else 'No'}\n"
    )
    logo = _brand_logo()
    public_phone = getattr(settings, "business_public_phone", "")
    public_email = get_business_public_emails(settings)
    html_body = (
        "<p style=\"margin:0 0 20px;color:#52627a\">A new visitor has contacted "
        "your team. Reply directly to this email to respond to them.</p>"
        "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
        "width=\"100%\" style=\"border-collapse:collapse;font-size:14px\">"
        f"<tr><td style=\"padding:10px;border-bottom:1px solid #e8edf3;color:#66748b\">Name</td>"
        f"<td style=\"padding:10px;border-bottom:1px solid #e8edf3\"><strong>{escape(data.full_name)}</strong></td></tr>"
        f"<tr><td style=\"padding:10px;border-bottom:1px solid #e8edf3;color:#66748b\">Email</td>"
        f"<td style=\"padding:10px;border-bottom:1px solid #e8edf3\"><a href=\"mailto:{escape(data.email, quote=True)}\" "
        f"style=\"color:#286b9b\">{escape(data.email)}</a></td></tr>"
        f"<tr><td style=\"padding:10px;border-bottom:1px solid #e8edf3;color:#66748b\">Mobile</td>"
        f"<td style=\"padding:10px;border-bottom:1px solid #e8edf3\">{escape(data.mobile_number or 'Not provided')}</td></tr>"
        f"<tr><td style=\"padding:10px;color:#66748b\">Subject</td>"
        f"<td style=\"padding:10px\">{escape(subject)}</td></tr></table>"
        "<h2 style=\"margin:24px 0 8px;color:#14264d;font-size:17px\">Message</h2>"
        f"<div style=\"padding:16px;background:#f7f9fc;border-left:3px solid #f1cc3b;"
        f"white-space:pre-wrap\">{escape(data.message)}</div>"
        f"<p style=\"margin:18px 0 0;color:#66748b;font-size:13px\"><strong>Consent to contact:</strong> "
        f"{'Yes' if data.consent_to_contact else 'No'}</p>"
        + (
            "<p style=\"margin:16px 0 0;color:#66748b;font-size:12px\">"
            f"Public contact: {_public_email_markup(settings)} · {escape(public_phone)}</p>"
            if public_email or public_phone
            else ""
        )
    )
    message.set_content(text_body)
    message.add_alternative(_email_layout("New website inquiry", html_body, logo), subtype="html")
    _attach_brand_logo(message, logo)

    import aiosmtplib

    await aiosmtplib.send(
        message,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_username or None,
        password=settings.smtp_password or None,
        start_tls=settings.smtp_use_tls,
        use_tls=settings.smtp_use_ssl,
        timeout=settings.email_timeout_seconds,
    )


async def _send_chat_lead_to_business(
    settings: Any, data: Any, transcript: list[dict[str, Any]]
) -> None:
    """Send a visitor-approved chat follow-up request to the configured inbox."""
    if not settings.smtp_host or not settings.email_from_address:
        raise RuntimeError("SMTP host and verified sender address must be configured")
    if settings.smtp_use_tls and settings.smtp_use_ssl:
        raise RuntimeError("Configure either SMTP STARTTLS or implicit SSL, not both")

    subject = f"Website chat follow-up: {data.full_name}"
    transcript_text_parts = []
    transcript_html_parts = []
    for item in transcript:
        role = str(item.get("role", "visitor")).title()
        response_html, response_text = _format_chat_markdown(
            str(item.get("content", ""))
        )
        transcript_text_parts.append(f"{role}:\n{response_text}")
        transcript_html_parts.append(
            "<tr><td style=\"padding:12px;border-bottom:1px solid #e8edf3;"
            "vertical-align:top;width:100px;color:#66748b;font-weight:bold\">"
            f"{escape(role)}</td>"
            "<td style=\"padding:12px;border-bottom:1px solid #e8edf3\">"
            f"{response_html}</td></tr>"
        )
    transcript_text = "\n\n".join(transcript_text_parts)
    transcript_html = "".join(transcript_html_parts)
    logo = _brand_logo()
    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = formataddr((settings.email_from_name, settings.email_from_address))
    message["To"] = settings.business_notification_email
    if settings.email_reply_to_enabled:
        message["Reply-To"] = data.email
    message.set_content(
        "CHAT FOLLOW-UP REQUEST — WALTAIN ENERGY\n"
        "A visitor requested follow-up from Waltain Energy.\n\n"
        f"Name: {data.full_name}\nBusiness: {data.company_name}\n"
        f"Email: {data.email}\nPhone: {data.mobile_number}\n"
        f"Chat session: {data.session_id}\n\nConversation:\n{transcript_text}"
    )
    message.add_alternative(
        _email_layout(
            "Chat follow-up requested",
            "<p style=\"margin:0 0 20px;color:#52627a\">A visitor asked your team to get in touch. "
            "Reply directly to this email to continue the conversation.</p>"
            "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
            "width=\"100%\" style=\"border-collapse:collapse;font-size:14px\">"
            f"<tr><td style=\"padding:10px;color:#66748b\">Name</td><td style=\"padding:10px\"><strong>{escape(data.full_name)}</strong></td></tr>"
            f"<tr><td style=\"padding:10px;color:#66748b\">Business</td><td style=\"padding:10px\">{escape(data.company_name)}</td></tr>"
            f"<tr><td style=\"padding:10px;color:#66748b\">Email</td><td style=\"padding:10px\"><a href=\"mailto:{escape(data.email, quote=True)}\" style=\"color:#286b9b\">{escape(data.email)}</a></td></tr>"
            f"<tr><td style=\"padding:10px;color:#66748b\">Phone</td><td style=\"padding:10px\">{escape(data.mobile_number)}</td></tr>"
            f"<tr><td style=\"padding:10px;color:#66748b\">Chat reference</td><td style=\"padding:10px\">{escape(data.session_id)}</td></tr>"
            "</table>"
            "<h2 style=\"margin:24px 0 10px;color:#14264d;font-size:17px\">Conversation</h2>"
            "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
            "width=\"100%\" style=\"border-collapse:collapse;background:#f7f9fc\">"
            f"{transcript_html}</table>",
            logo,
        ),
        subtype="html",
    )
    _attach_brand_logo(message, logo)
    import aiosmtplib

    await aiosmtplib.send(
        message,
        hostname=settings.smtp_host,
        port=settings.smtp_port,
        username=settings.smtp_username or None,
        password=settings.smtp_password or None,
        start_tls=settings.smtp_use_tls,
        use_tls=settings.smtp_use_ssl,
        timeout=settings.email_timeout_seconds,
    )

async def send_chat_lead_notification(
    settings: Any, data: Any, transcript: list[dict[str, Any]]
) -> tuple[bool, bool]:
    """Send a business lead notification and visitor confirmation independently."""
    try:
        await _send_chat_lead_to_business(settings, data, transcript)
    except Exception as exc:
        logger.warning(
            "Chat lead business notification failed host=%s type=%s",
            settings.smtp_host,
            type(exc).__name__,
        )
        business_sent = False
    else:
        business_sent = True

    try:
        if not settings.smtp_host or not settings.email_from_address:
            raise RuntimeError("SMTP host and verified sender address must be configured")
        if settings.smtp_use_tls and settings.smtp_use_ssl:
            raise RuntimeError("Configure either SMTP STARTTLS or implicit SSL, not both")

        from html import escape

        import aiosmtplib

        greeting = f"Dear {data.full_name},"
        logo = _brand_logo()
        website = getattr(settings, "business_website_url", "https://waltainenergy.com")
        confirmation = EmailMessage()
        confirmation["Subject"] = "Your Waltain Energy inquiry"
        confirmation["From"] = formataddr(
            (settings.email_from_name, settings.email_from_address)
        )
        confirmation["To"] = data.email
        confirmation.set_content(
            "WALTAIN ENERGY — INQUIRY RECEIVED\n\n"
            f"{greeting}\n\n"
            "Thank you for reaching out to Waltain Energy. We have received your request "
            "and our team will review it and get in touch with you soon.\n\n"
            f"YOUR REQUEST\nBusiness: {data.company_name}\n"
            f"Email: {data.email}\nMobile: {data.mobile_number}\n\n"
            "HOW WE CAN HELP\n"
            "- Open-access solar and third-party PPAs\n"
            "- Solar EPC and rooftop solar\n"
            "- Battery energy storage systems (BESS)\n"
            "- Energy audits, transition advisory and ESG/carbon reporting\n\n"
            "If you need to reach us in the meantime, please contact us at "
            f"{settings.business_public_phone} or "
            f"{', '.join(get_business_public_emails(settings))}. "
            f"Website: {website}\n\n"
            "We look forward to speaking with you.\n\n"
            "Warm regards,\nWaltain Energy Team"
        )
        confirmation.add_alternative(
            _email_layout(
                "Thank you for your inquiry",
                f"<p style=\"margin:0 0 16px\">{escape(greeting)}</p>"
                "<p style=\"margin:0 0 20px;color:#52627a\">Thank you for reaching out to Waltain Energy. "
                "We have received your request and our team will review it and get in touch with you soon.</p>"
                "<div style=\"margin:0 0 22px;padding:16px 18px;background:#f4f8fb;"
                "border-left:4px solid #f1cc3b\">"
                "<strong style=\"color:#14264d\">What happens next?</strong>"
                "<p style=\"margin:6px 0 0;color:#52627a\">A member of our team will review your inquiry "
                "and contact you using the details below.</p></div>"
                "<h2 style=\"margin:0 0 8px;color:#14264d;font-size:17px\">Your request details</h2>"
                "<table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" "
                "width=\"100%\" style=\"border-collapse:collapse;font-size:14px\">"
                f"<tr><td style=\"padding:9px;color:#66748b\">Business</td><td style=\"padding:9px\"><strong>{escape(data.company_name)}</strong></td></tr>"
                f"<tr><td style=\"padding:9px;color:#66748b\">Email</td><td style=\"padding:9px\">{escape(data.email)}</td></tr>"
                f"<tr><td style=\"padding:9px;color:#66748b\">Mobile</td><td style=\"padding:9px\">{escape(data.mobile_number)}</td></tr>"
                "</table>"
                "<h2 style=\"margin:22px 0 8px;color:#14264d;font-size:17px\">How we can help</h2>"
                "<p style=\"margin:0;color:#52627a\">Open-access solar and PPAs · Solar EPC and rooftop solar · "
                "Battery energy storage · Energy audits and ESG advisory</p>"
                "<p style=\"margin:22px 0 18px\">"
                f"<a href=\"{escape(website, quote=True)}\" style=\"display:inline-block;padding:12px 20px;"
                "background:#d8212b;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:5px\">"
                "Explore Waltain Energy</a></p>"
                "<p style=\"margin:0;color:#66748b;font-size:13px\">Need to add something to your inquiry? "
                f"Call <a href=\"tel:{escape(settings.business_public_phone, quote=True)}\" style=\"color:#286b9b\">"
                f"{escape(settings.business_public_phone)}</a> or email "
                f"{_public_email_markup(settings)}</p>"
                "<p style=\"margin:22px 0 0\">Warm regards,<br><strong>Waltain Energy Team</strong></p>",
                logo,
            ),
            subtype="html",
        )
        _attach_brand_logo(confirmation, logo)
        await aiosmtplib.send(
            confirmation,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username or None,
            password=settings.smtp_password or None,
            start_tls=settings.smtp_use_tls,
            use_tls=settings.smtp_use_ssl,
            timeout=settings.email_timeout_seconds,
        )
    except Exception as exc:
        logger.warning(
            "Chat lead visitor confirmation failed host=%s type=%s",
            settings.smtp_host,
            type(exc).__name__,
        )
        confirmation_sent = False
    else:
        confirmation_sent = True

    return business_sent, confirmation_sent


async def queue_email_notification(
    db,
    template_type: str,
    recipient: str,
    payload: dict,
) -> EmailOutbox:
    """Create an EmailOutbox entry and persist it.

    ``payload`` is a dict that will be JSON‑encoded by the template renderer.
    """
    entry = EmailOutbox(
        business_id=db.get_bind().url.database if hasattr(db.get_bind(), "url") else "",
        recipient_email=recipient,
        subject=f"Notification: {template_type}",
        template_type=template_type,
        payload_json=str(payload),  # In a real app use json.dumps
        status="pending",
        attempts=0,
        next_attempt_at=utc_now(),
    )
    repo = EmailOutboxRepository(db)
    await repo.queue(entry)
    return entry
