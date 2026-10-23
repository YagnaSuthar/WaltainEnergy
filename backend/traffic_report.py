"""Print daily anonymous traffic and engagement totals.

Run from the backend directory:
    python traffic_report.py
    python traffic_report.py 2026-10-23
"""

from __future__ import annotations

import argparse
import asyncio
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

from sqlalchemy import distinct, func, select

from app.core.config import get_settings
from app.db.session import dispose_engine, get_session_factory
from app.models.traffic_event import TrafficEvent


async def report_day(target_date: date) -> dict[str, int]:
    settings = get_settings()
    local_zone = ZoneInfo(settings.business_timezone)
    start_local = datetime.combine(target_date, time.min, tzinfo=local_zone)
    end_local = start_local + timedelta(days=1)
    start_utc = start_local.astimezone(timezone.utc)
    end_utc = end_local.astimezone(timezone.utc)

    factory = get_session_factory()
    async with factory() as session:
        rows = await session.execute(
            select(
                TrafficEvent.event_type,
                func.count(TrafficEvent.id),
                func.count(distinct(TrafficEvent.visitor_hash)),
            )
            .where(
                TrafficEvent.created_at >= start_utc,
                TrafficEvent.created_at < end_utc,
            )
            .group_by(TrafficEvent.event_type)
        )

    totals = {
        event_type: {"events": int(events), "visitors": int(visitors)}
        for event_type, events, visitors in rows
    }
    return {
        "unique_visitors": totals.get("page_view", {}).get("visitors", 0),
        "page_views": totals.get("page_view", {}).get("events", 0),
        "chat_opens": totals.get("chat_open", {}).get("events", 0),
        "chat_messages": totals.get("chat_message", {}).get("events", 0),
        "contact_form_submissions": totals.get("contact_form_submit", {}).get(
            "events", 0
        ),
    }


async def main() -> None:
    parser = argparse.ArgumentParser(description="Show daily Waltain Energy website traffic.")
    parser.add_argument(
        "date",
        nargs="?",
        type=date.fromisoformat,
        default=None,
        help="Local report date in YYYY-MM-DD format (defaults to today).",
    )
    args = parser.parse_args()
    settings = get_settings()
    target_date = args.date or datetime.now(ZoneInfo(settings.business_timezone)).date()

    try:
        totals = await report_day(target_date)
    finally:
        await dispose_engine()

    print(f"Website traffic for {target_date.isoformat()} ({settings.business_timezone})")
    print(f"Unique visitors:          {totals['unique_visitors']}")
    print(f"Page views:               {totals['page_views']}")
    print(f"Chatbot opens:            {totals['chat_opens']}")
    print(f"Chatbot messages sent:    {totals['chat_messages']}")
    print(f"Contact form submissions: {totals['contact_form_submissions']}")


if __name__ == "__main__":
    asyncio.run(main())
