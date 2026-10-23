from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.agents.memory import store as memory_store_module
from app.agents.memory.store import MemoryStore
from app.agents.orchestrator import orchestrate_chat
from app.api.v1.endpoints import chat as chat_endpoint
from app.schemas.chat import ChatLeadSubmissionRequest


@pytest.mark.asyncio
async def test_lead_reminder_is_offered_after_third_visitor_message(monkeypatch) -> None:
    memory = MemoryStore()
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)
    settings = SimpleNamespace(
        llm_api_key="",
        lead_capture_enabled=True,
        business_public_email="connect.waltainenergy@gmail.com",
        business_public_phone="+91 99982 33956",
        chat_max_history_messages=20,
    )

    first = await orchestrate_chat("session-id-12345678", "Tell me about open access", None, settings)
    second = await orchestrate_chat("session-id-12345678", "What services are available?", None, settings)
    third = await orchestrate_chat("session-id-12345678", "How do I get a project assessment?", None, settings)

    assert first["show_lead_form"] is False
    assert second["show_lead_form"] is False
    assert third["show_lead_form"] is True
    assert "optional" in third["reply"].lower()
    assert "continue chatting" in third["reply"].lower()


@pytest.mark.asyncio
async def test_llm_failure_offers_lead_form_immediately(monkeypatch) -> None:
    from app.agents import orchestrator as orchestrator_module

    memory = MemoryStore()
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)

    async def failed_response(messages, settings):
        raise RuntimeError("provider unavailable")

    monkeypatch.setattr(
        orchestrator_module, "generate_llm_response", failed_response
    )
    settings = SimpleNamespace(
        llm_api_key="configured",
        lead_capture_enabled=True,
        business_name="Waltain Energy",
        business_website_url="https://waltainenergy.com",
        business_public_email="connect.waltainenergy@gmail.com",
        business_public_phone="+91 99982 33956",
        chat_max_history_messages=20,
    )

    result = await orchestrator_module.orchestrate_chat(
        "session-id-12345678", "Can you help with solar?", None, settings
    )

    assert result["assistant_failed"] is True
    assert result["show_lead_form"] is True
    assert "trouble reaching the assistant" in result["reply"]
    assert "share your name" in result["reply"]


@pytest.mark.asyncio
async def test_mixed_area_savings_and_contract_question_uses_website_context(
    monkeypatch,
) -> None:
    from app.agents import orchestrator as orchestrator_module

    memory = MemoryStore()
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)
    question = (
        "price saved by per solar squre area unit module and what is contract "
        "Duration is about"
    )
    captured = {}

    async def fake_response(messages, settings):
        captured["messages"] = messages
        return "Solar pricing is published per kWh, not per area or module."

    monkeypatch.setattr(
        orchestrator_module, "generate_llm_response", fake_response
    )
    settings = SimpleNamespace(
        llm_api_key="configured",
        lead_capture_enabled=True,
        business_name="Waltain Energy",
        business_website_url="https://waltainenergy.com",
        business_public_email="connect.waltainenergy@gmail.com",
        business_public_phone="+91 99982 33956",
        chat_max_history_messages=20,
    )

    result = await orchestrator_module.orchestrate_chat(
        "session-id-12345678", question, None, settings
    )

    assert result["reply"].startswith("Solar pricing is published")
    assert captured["messages"][-1] == {"role": "user", "content": question}
    assert "per-area or per-module price/savings figure" in captured["messages"][0]["content"]
    assert "indicative 12-year PPAs" in captured["messages"][0]["content"]


def test_chat_lead_requires_explicit_consent() -> None:
    with pytest.raises(ValueError):
        ChatLeadSubmissionRequest(
            session_id="session-id-12345678",
            full_name="Test Visitor",
            company_name="Example Business",
            email="visitor@example.com",
            mobile_number="+911234567890",
            consent_to_contact=False,
        )


@pytest.mark.asyncio
async def test_chat_lead_sends_to_configured_business_email(monkeypatch) -> None:
    memory = MemoryStore()
    memory.add_message("session-id-12345678", "user", "We are reviewing open access solar.")
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)
    captured = {}

    async def fake_send(settings, data, transcript):
        captured["recipient"] = settings.business_notification_email
        captured["name"] = data.full_name
        captured["transcript"] = transcript
        return True, True

    class FakeLeadService:
        def __init__(self, db, settings):
            captured["db"] = db

        async def create_chat_followup(self, data, transcript):
            captured["saved_name"] = data.full_name
            captured["saved_transcript"] = transcript

    monkeypatch.setattr(chat_endpoint, "send_chat_lead_notification", fake_send)
    monkeypatch.setattr(chat_endpoint, "LeadService", FakeLeadService)
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
    )
    settings = SimpleNamespace(
        lead_capture_enabled=True,
        business_notification_email="sales@example.com",
        business_public_email="connect@example.com",
        business_public_phone="+910000000000",
    )

    db = object()
    result = await chat_endpoint.submit_chat_lead(
        payload, settings, db, "session-id-12345678"
    )

    assert result.notification_sent is True
    assert result.confirmation_sent is True
    assert captured["recipient"] == "sales@example.com"
    assert captured["name"] == "Test Visitor"
    assert len(captured["transcript"]) == 1
    assert captured["db"] is db
    assert captured["saved_name"] == "Test Visitor"
    assert captured["saved_transcript"] == captured["transcript"]


@pytest.mark.asyncio
async def test_chat_lead_is_saved_when_email_delivery_fails(monkeypatch) -> None:
    memory = MemoryStore()
    memory.add_message("session-id-12345678", "user", "We are reviewing solar.")
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)
    saved = {}

    class FakeLeadService:
        def __init__(self, db, settings):
            pass

        async def create_chat_followup(self, data, transcript):
            saved["name"] = data.full_name
            saved["transcript"] = transcript

    async def failed_send(settings, data, transcript):
        return False, True

    monkeypatch.setattr(chat_endpoint, "LeadService", FakeLeadService)
    monkeypatch.setattr(chat_endpoint, "send_chat_lead_notification", failed_send)
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
    )
    settings = SimpleNamespace(
        lead_capture_enabled=True,
        business_notification_email="sales@example.com",
        business_public_email="connect@example.com",
        business_public_phone="+910000000000",
    )

    result = await chat_endpoint.submit_chat_lead(
        payload, settings, object(), "session-id-12345678"
    )

    assert result.notification_sent is False
    assert result.confirmation_sent is True
    assert "saved" in result.message.lower()
    assert saved["name"] == "Test Visitor"


@pytest.mark.asyncio
async def test_lead_submission_uses_complete_client_transcript(
    monkeypatch,
) -> None:
    memory = MemoryStore()
    memory.add_message(
        "session-id-12345678", "user", "Message already stored on the server."
    )
    monkeypatch.setattr(memory_store_module, "_memory_store", memory)
    captured = {}

    class FakeLeadService:
        def __init__(self, db, settings):
            pass

        async def create_chat_followup(self, data, transcript):
            captured["transcript"] = transcript

    async def fake_send(settings, data, transcript):
        return True, True

    monkeypatch.setattr(chat_endpoint, "LeadService", FakeLeadService)
    monkeypatch.setattr(chat_endpoint, "send_chat_lead_notification", fake_send)
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
        transcript=[
            {"role": "user", "content": "Please tell me about solar EPC."},
            {"role": "assistant", "content": "I couldn't get a response just now."},
        ],
    )
    settings = SimpleNamespace(
        lead_capture_enabled=True,
        business_public_email="connect@example.com",
        business_public_phone="+910000000000",
    )

    await chat_endpoint.submit_chat_lead(
        payload, settings, object(), "session-id-12345678"
    )

    assert [item["content"] for item in captured["transcript"]] == [
        "Please tell me about solar EPC.",
        "I couldn't get a response just now.",
    ]


@pytest.mark.asyncio
async def test_chat_lead_emails_business_inbox_and_visitor_confirmation(monkeypatch) -> None:
    from app.services import email as email_service

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
        business_notification_email="team@example.com",
        business_public_email="connect@example.com",
        business_public_phone="+919998233956",
    )
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
    )

    results = await email_service.send_chat_lead_notification(
        settings,
        payload,
        [
            {"role": "user", "content": "Please call me."},
            {
                "role": "assistant",
                "content": (
                    "## Solar options\n"
                    "A **solar + storage** setup provides ***backup***.\n"
                    "- Reliable power\n"
                    "- Lower bills"
                ),
            },
        ],
    )

    assert results == (True, True)
    assert len(sent_messages) == 2
    assert sent_messages[0]["To"] == "team@example.com"
    assert sent_messages[1]["To"] == "visitor@example.com"
    confirmation_body = sent_messages[1].get_body(preferencelist=("plain",)).get_content()
    assert "Dear Test Visitor" in confirmation_body
    assert "our team will review it and get in touch" in confirmation_body
    assert "+919998233956" in confirmation_body
    assert "connect@example.com" in confirmation_body
    assert "Open-access solar and third-party PPAs" in confirmation_body
    assert "Energy audits, transition advisory and ESG/carbon reporting" in confirmation_body
    assert "https://waltainenergy.com" in confirmation_body
    assert any(
        part.get_content_maintype() == "image"
        for part in sent_messages[1].walk()
    )
    business_text = sent_messages[0].get_body(preferencelist=("plain",)).get_content()
    assert "##" not in business_text
    assert "**" not in business_text
    assert "***" not in business_text
    business_html = sent_messages[0].get_body(preferencelist=("html",)).get_content()
    assert "<h3" in business_html
    assert "<strong>solar + storage</strong>" in business_html
    assert "<strong><em>backup</em></strong>" in business_html
    assert "<ul" in business_html


@pytest.mark.asyncio
async def test_chat_followup_is_committed_as_a_lead(monkeypatch) -> None:
    from app.services import lead as lead_service_module

    captured = {}

    class FakeLeadRepository:
        def __init__(self, db):
            pass

        async def create(self, lead):
            captured["lead"] = lead
            return lead

    class FakeBusinessRepository:
        def __init__(self, db):
            pass

        async def ensure_configured_business(self, business_id, business_name):
            captured["business"] = (business_id, business_name)

    class FakeDatabase:
        async def commit(self):
            captured["committed"] = True

    monkeypatch.setattr(lead_service_module, "LeadRepository", FakeLeadRepository)
    monkeypatch.setattr(
        lead_service_module, "BusinessRepository", FakeBusinessRepository
    )
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
    )
    service = lead_service_module.LeadService(
        FakeDatabase(),
        SimpleNamespace(
            business_id="waltain-energy",
            business_name="Waltain Energy",
            lead_consent_version="1",
        ),
    )

    lead = await service.create_chat_followup(
        payload, [{"role": "user", "content": "Please call me."}]
    )

    assert captured["committed"] is True
    assert captured["business"] == ("waltain-energy", "Waltain Energy")
    assert lead is captured["lead"]
    assert lead.email == "visitor@example.com"
    assert lead.mobile_number == "+911234567890"
    assert lead.consent_to_contact is True
    assert "Please call me." in lead.transcript_text


@pytest.mark.asyncio
async def test_chat_lead_rejects_a_different_session_cookie() -> None:
    payload = ChatLeadSubmissionRequest(
        session_id="session-id-12345678",
        full_name="Test Visitor",
        company_name="Example Business",
        email="visitor@example.com",
        mobile_number="+911234567890",
        consent_to_contact=True,
    )
    settings = SimpleNamespace(lead_capture_enabled=True)

    with pytest.raises(HTTPException) as error:
        await chat_endpoint.submit_chat_lead(
            payload, settings, object(), "other-session-123456"
        )

    assert error.value.status_code == 403