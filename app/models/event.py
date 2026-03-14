from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class RawEvent(BaseModel):
    source_type: str
    event_hint: str | None = None
    timestamp: datetime | None = None
    asset_context: dict[str, Any] = Field(default_factory=dict)
    payload: dict[str, Any] = Field(default_factory=dict)


class NormalizedEvent(BaseModel):
    event_id: str
    event_type: str
    source_type: str
    timestamp: datetime
    asset_context: dict[str, Any] = Field(default_factory=dict)
    normalized_data: dict[str, Any] = Field(default_factory=dict)


class EventEnvelope(BaseModel):
    raw_event: RawEvent | None = None
    normalized_event: NormalizedEvent
    classification: dict[str, Any] = Field(default_factory=dict)
