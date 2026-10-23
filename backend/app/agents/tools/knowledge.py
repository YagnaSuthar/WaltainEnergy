from __future__ import annotations

from typing import List, Dict, Any

from app.repositories.faq import FAQRepository
from app.repositories.service import ServiceRepository

async def search_knowledge(query: str, db) -> Dict[str, Any]:
    """Search FAQs and services for the given query.

    Returns a dict with ``faqs`` and ``services`` keys containing lists of
    matching records. This is a simple wrapper used by the LangGraph tools.
    """
    faq_repo = FAQRepository(db)
    service_repo = ServiceRepository(db)
    faqs = await faq_repo.search(query=query, business_id="", limit=5)  # business_id can be filtered later
    services = await service_repo.search(query=query, business_id="", limit=5)
    return {"faqs": faqs, "services": services}
