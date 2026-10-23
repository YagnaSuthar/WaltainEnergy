from __future__ import annotations

from typing import Dict

from app.agents.memory.store import get_memory_store
from app.agents.business_knowledge import find_grounded_faq_answer
from app.agents.llm_provider import generate_llm_response
from app.agents.prompts import get_system_prompt
from app.core.config import format_business_public_emails
from app.utils.sanitization import clean_assistant_response

import logging

logger = logging.getLogger(__name__)


def _llm_failure_reply(exc: Exception, settings) -> str:
    provider_code = getattr(exc, "code", None)
    if provider_code == 429:
        message = (
            "Our AI assistant has reached its current request limit. Please wait a few minutes "
            "and try again, or contact Waltain Energy directly."
        )
    elif provider_code == 503:
        message = (
            "Our AI assistant is temporarily unavailable. Please try again shortly, "
            "or contact Waltain Energy directly."
        )
    else:
        message = "I'm having trouble reaching the assistant right now. Please try again shortly."
    return (
        f"{message} You can also reach us at "
        f"{format_business_public_emails(settings)} or {settings.business_public_phone}."
    )


async def orchestrate_chat(
    session_id: str,
    user_message: str,
    db,
    settings,
) -> Dict:
    """Run the configured assistant with recent session and website context."""
    store = get_memory_store()
    history = store.get_history(session_id)
    visitor_turns = sum(item.get("role") == "user" for item in history) + 1
    store.add_message(session_id, role="user", content=user_message)
    assistant_failed = False

    intent = "pricing_inquiry" if any(
        word in user_message.casefold()
        for word in ("price", "pricing", "cost", "quote", "quotation", "tariff", "saving")
    ) else "general_question"
    if settings.llm_api_key:
        messages = [{"role": "system", "content": get_system_prompt(settings)}]
        messages.extend(
            {"role": item["role"], "content": item["content"]}
            for item in history[-settings.chat_max_history_messages :]
        )
        messages.append({"role": "user", "content": user_message})
        try:
            reply = await generate_llm_response(messages, settings)
        except Exception as exc:
            assistant_failed = True
            logger.error(
                "Configured LLM request failed type=%s provider_http_code=%s",
                type(exc).__name__,
                getattr(exc, "code", None),
            )
            reply = _llm_failure_reply(exc, settings)
    else:
        reply = find_grounded_faq_answer(user_message) or (
            "I can help with Waltain Energy's open-access solar, solar EPC, rooftop solar, "
            "BESS, and energy/ESG advisory services. I don't have enough approved information "
            "to answer that specifically. Could you clarify the service or share your location "
            "and energy requirement? For a direct assessment, contact "
            f"{format_business_public_emails(settings)} or {settings.business_public_phone}."
        )

    reply = clean_assistant_response(reply)
    show_lead_form = bool(
        settings.lead_capture_enabled and (visitor_turns == 3 or assistant_failed)
    )
    if show_lead_form:
        reply += (
            "\n\nIf you would like Waltain Energy to follow up, you can share your "
            "name, business name, email and phone below. This is optional; you can "
            "skip it and continue chatting."
        )

    store.add_message(session_id, role="assistant", content=reply)
    return {
        "session_id": session_id,
        "reply": reply,
        "intent": intent,
        "show_lead_form": show_lead_form,
        "assistant_failed": assistant_failed,
        "lead_form_context": None,
    }
