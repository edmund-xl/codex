from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ClassificationMemoryRule(BaseModel):
    rule_id: str
    name: str
    expected_source_type: str
    expected_event_type: str
    preferred_skills: list[str] = Field(default_factory=list)
    filename_tokens: list[str] = Field(default_factory=list)
    header_tokens: list[str] = Field(default_factory=list)
    content_tokens: list[str] = Field(default_factory=list)
    parser_profiles: list[str] = Field(default_factory=list)
    notes: str = ""
    created_at: datetime
    updated_at: datetime
    last_matched_at: datetime | None = None
    usage_count: int = 0


class ClassificationLearningRequest(BaseModel):
    raw_event: RawEventLike
    expected_source_type: str
    expected_event_type: str
    preferred_skills: list[str] = Field(default_factory=list)
    notes: str = ""
    name: str | None = None


class ClassificationFeedback(BaseModel):
    feedback_id: str
    name: str
    filename: str
    expected_source_type: str
    expected_event_type: str
    preferred_skills: list[str] = Field(default_factory=list)
    notes: str = ""
    created_at: datetime


class RawEventLike(BaseModel):
    source_type: str
    event_hint: str | None = None
    timestamp: datetime | None = None
    asset_context: dict = Field(default_factory=dict)
    payload: dict = Field(default_factory=dict)
