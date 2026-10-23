from __future__ import annotations

from typing import TypedDict, List, Dict, Any

class AgentState(TypedDict, total=False):
    """State dictionary passed between LangGraph nodes.

    Fields:
    - session_id: chat session identifier
    - messages: list of message dicts {role, content, timestamp}
    - intent: classified user intent (ChatIntent enum name)
    - context: any additional context (e.g., FAQ results)
    - lead_data: optional dict with lead capture info
    - response: final response dict returned to API
    """
    session_id: str
    messages: List[Dict[str, Any]]
    intent: str
    context: Dict[str, Any]
    lead_data: Dict[str, Any]
    response: Dict[str, Any]
