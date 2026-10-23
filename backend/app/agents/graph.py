from __future__ import annotations

from typing import Dict, Any, List

from langgraph.graph import StateGraph, END

from app.agents.state import AgentState
from app.agents.prompts import get_system_prompt
from app.agents.llm_provider import generate_llm_response
from app.agents.memory.store import get_memory_store

# ---------------------------------------------------------------------------
# Node implementations
# ---------------------------------------------------------------------------

def classify_intent(state: AgentState) -> AgentState:
    """Very simple intent classifier based on keywords.

    In a real implementation this would call an LLM or use a trained model.
    Here we just look for a few keywords to set ``intent``.
    """
    last_user_msg = next(
        (msg["content"] for msg in reversed(state.get("messages", [])) if msg["role"] == "user"),
        "",
    ).lower()
    if "price" in last_user_msg or "cost" in last_user_msg:
        intent = "pricing_inquiry"
    elif "contact" in last_user_msg or "email" in last_user_msg:
        intent = "contact_request"
    elif "lead" in last_user_msg or "quote" in last_user_msg:
        intent = "lead_capture"
    else:
        intent = "general_question"
    state["intent"] = intent
    return state


def build_context(state: AgentState) -> AgentState:
    """Populate ``context`` based on intent.

    Placeholder: for ``pricing_inquiry`` we could fetch pricing rules, for
    ``general_question`` we could search FAQs, etc. Here we just set an empty
    dict.
    """
    state["context"] = {}
    return state


def generate_response(state: AgentState) -> AgentState:
    """Call the configured LLM provider to generate a response.

    The message list is built from the stored memory plus the system prompt.
    """
    memory = get_memory_store()
    session_id = state.get("session_id")
    history = memory.get_history(session_id) if session_id else []
    # Build messages list for LLM
    messages: List[Dict[str, str]] = [{"role": "system", "content": get_system_prompt()}]
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    # Add a placeholder user message if not already in history (safety)
    if not any(m["role"] == "user" for m in messages):
        messages.append({"role": "user", "content": ""})
    # Async call – we are in a sync node, so we use ``await`` in the orchestrator.
    # Here we just store the coroutine for later execution.
    state["_llm_coro"] = generate_llm_response(messages)  # type: ignore
    return state


def check_lead_qualification(state: AgentState) -> AgentState:
    """Determine whether to show lead capture form.

    Simple rule: if intent is ``lead_capture`` or ``pricing_inquiry`` we prompt.
    """
    intent = state.get("intent")
    state["show_lead_form"] = intent in {"lead_capture", "pricing_inquiry"}
    return state


def finalize(state: AgentState) -> AgentState:
    """Prepare the final response dict for the API layer.

    The orchestrator will await the stored LLM coroutine and fill ``reply``.
    """
    # Resolve the LLM coroutine if present
    llm_coro = state.pop("_llm_coro", None)
    if llm_coro is not None:
        # The orchestrator will ``await`` this; we just store placeholder.
        state["_llm_future"] = llm_coro
    # Build response structure expected by the endpoint
    state["response"] = {
        "session_id": state.get("session_id"),
        "reply": "[LLM response will be filled by orchestrator]",
        "intent": state.get("intent"),
        "show_lead_form": state.get("show_lead_form"),
        "lead_form_context": None,
    }
    return state

# ---------------------------------------------------------------------------
# Graph construction
# ---------------------------------------------------------------------------

def build_chat_graph() -> StateGraph:
    """Create and return a LangGraph ``StateGraph`` for the chatbot.

    The graph consists of the following linear flow:
    START → classify_intent → build_context → generate_response →
    check_lead_qualification → finalize → END
    """
    graph = StateGraph(AgentState)
    graph.add_node("classify_intent", classify_intent)
    graph.add_node("build_context", build_context)
    graph.add_node("generate_response", generate_response)
    graph.add_node("check_lead_qualification", check_lead_qualification)
    graph.add_node("finalize", finalize)

    graph.add_edge(START, "classify_intent")
    graph.add_edge("classify_intent", "build_context")
    graph.add_edge("build_context", "generate_response")
    graph.add_edge("generate_response", "check_lead_qualification")
    graph.add_edge("check_lead_qualification", "finalize")
    graph.add_edge("finalize", END)

    return graph

# Export a compiled graph for easy import
chat_state_graph = build_chat_graph().compile()
