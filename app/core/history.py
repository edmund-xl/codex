from __future__ import annotations

from app.models.event import EventEnvelope, RawEvent
from app.models.finding import SecurityReport
from app.utils.store import (
    EVENTS_FILE,
    INVESTIGATIONS_FILE,
    RAW_EVENTS_FILE,
    REPORTS_FILE,
    JsonFileStore,
)


class HistoryService:
    def __init__(self) -> None:
        self.store = JsonFileStore()

    def save_raw_event(self, raw_event: RawEvent) -> None:
        self.store.append(RAW_EVENTS_FILE, raw_event.model_dump(mode="json"))

    def save_normalized_event(self, envelope: EventEnvelope) -> None:
        self.store.append(EVENTS_FILE, envelope.model_dump(mode="json"))

    def save_report(self, report: SecurityReport) -> None:
        self.store.append(REPORTS_FILE, report.model_dump(mode="json"))

    def save_investigation(self, investigation: dict) -> None:
        self.store.append(INVESTIGATIONS_FILE, investigation, limit=100)

    def list_raw_events(self) -> list[dict]:
        return self.store.list_records(RAW_EVENTS_FILE)

    def list_events(self) -> list[dict]:
        return self.store.list_records(EVENTS_FILE)

    def list_reports(self) -> list[dict]:
        return self.store.list_records(REPORTS_FILE)

    def list_investigations(self) -> list[dict]:
        return self.store.list_records(INVESTIGATIONS_FILE)
