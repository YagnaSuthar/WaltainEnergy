from types import SimpleNamespace

from app.agents.business_knowledge import (
    WEBSITE_KNOWLEDGE,
    build_business_context,
    find_grounded_faq_answer,
)
from app.agents.prompts import get_system_prompt


def test_business_context_covers_public_site_topics() -> None:
    settings = SimpleNamespace(
        business_name="Waltain Energy Private Limited",
        business_website_url="https://waltainenergy.com",
        business_public_email=(
            "jalpan@waltainenergy.com,mailus@waltainenergy.com,"
            "connect.waltainenergy@gmail.com"
        ),
        business_public_phone="+91 99982 33956",
    )

    context = build_business_context(settings)

    for topic in ("Open access", "BESS", "Policy", "Team", "Partnerships", "FAQ"):
        assert topic in context
    assert "jalpan@waltainenergy.com" in context
    assert "mailus@waltainenergy.com" in context
    assert "connect.waltainenergy@gmail.com" in context
    assert "backend has no configured authoritative" in context
    assert get_system_prompt(settings).endswith(context)


def test_system_prompt_rejects_off_topic_questions_and_image_markup() -> None:
    settings = SimpleNamespace(
        business_name="Waltain Energy Private Limited",
        business_website_url="https://waltainenergy.com",
        business_public_email="connect.waltainenergy@gmail.com",
        business_public_phone="+91 99982 33956",
    )

    prompt = get_system_prompt(settings)

    assert "do not answer unrelated general-knowledge, math, trivia" in prompt
    assert "do not solve it or provide the requested result" in prompt
    assert "Address every in-scope part" in prompt
    assert "No approved per-area or per-module figure is available" in prompt
    assert "Do not include Markdown image syntax" in prompt
    assert "Interpret short or contextual messages using the recent conversation history" in prompt
    assert "concisely summarize the previous answer" in prompt
    assert "do not treat the phrase as a new unrelated question" in prompt
    assert "Answer the visitor's latest message in the context of the conversation" in prompt
    assert "Do not recap the entire conversation" in prompt
    assert "direct them to complete the in-chat inquiry form" in prompt
    assert "https://waltainenergy.com/contact as a clickable alternative" in prompt
    assert "the team will reach out after the visitor submits the form" in prompt
    assert "Do not provide only contact details or the external link" in prompt


def test_known_faq_gets_grounded_answer_without_llm_credentials() -> None:
    answer = find_grounded_faq_answer("What is the minimum load required?")

    assert answer is not None
    assert "100 kW" in answer
    assert "varies by state" in answer


def test_mixed_faq_topics_are_not_answered_with_a_single_canned_faq() -> None:
    answer = find_grounded_faq_answer(
        "price saved by per solar squre area unit module and what is contract Duration is about"
    )

    assert answer is None


def test_contract_duration_is_answered_when_it_is_the_only_faq_topic() -> None:
    answer = find_grounded_faq_answer("What is the contract duration?")

    assert answer is not None
    assert "12 years" in answer


def test_unknown_question_does_not_get_invented_answer() -> None:
    assert find_grounded_faq_answer("Can you guarantee a project completion date?") is None


def test_website_context_marks_examples_nonbinding() -> None:
    assert "not a binding offer" in WEBSITE_KNOWLEDGE
    assert "not guaranteed" in WEBSITE_KNOWLEDGE
    assert "per-area or per-module price/savings figure" in WEBSITE_KNOWLEDGE
