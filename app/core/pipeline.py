from __future__ import annotations

import time
from collections import deque
from datetime import datetime, timezone
from uuid import uuid4

from app.core.history import HistoryService
from app.core.memory_service import MemoryService
from app.core.normalizer import EventNormalizer
from app.core.planner import Planner
from app.core.report_engine import ReportEngine
from app.core.risk_engine import RiskEngine
from app.models.event import EventEnvelope, NormalizedEvent, RawEvent
from app.models.finding import SecurityReport
from app.skills.implementations import SKILLS


class SecurityPipeline:
    def __init__(self) -> None:
        self.normalizer = EventNormalizer()
        self.memory = MemoryService()
        self.planner = Planner()
        self.history = HistoryService()
        self.risk_engine = RiskEngine()
        self.report_engine = ReportEngine()
        self.recent_reports: deque[SecurityReport] = deque(maxlen=30)
        self.metrics = {"events_processed": 0, "findings_generated": 0, "last_event_at": None}
        self._restore_runtime_state()

    def _restore_runtime_state(self) -> None:
        reports = self.history.list_reports()
        if reports:
            ordered = sorted(reports, key=lambda item: item.get("generated_at", ""), reverse=True)
            self.metrics = {
                "events_processed": len(reports),
                "findings_generated": sum(len(item.get("findings", [])) for item in reports),
                "last_event_at": ordered[0].get("generated_at"),
            }
            for item in ordered[:30]:
                self.recent_reports.append(SecurityReport(**item))
            return
        events = self.history.list_events()
        self.metrics = {
            "events_processed": len(events),
            "findings_generated": 0,
            "last_event_at": events[0]["normalized_event"]["timestamp"] if events else None,
        }

    def list_skills(self) -> list[dict]:
        return [
            {
                "skill_id": skill.skill_id,
                "skill_name": skill.skill_name,
                "version": "0.1.0",
                "category": skill.category,
                "description": skill.description,
                "stage": "tool-backed",
                "adapter": skill.skill_id.split(".")[-1],
            }
            for skill in SKILLS.values()
        ]

    def skill_matrix(self) -> dict[str, list[dict]]:
        grouped: dict[str, list[dict]] = {}
        for item in self.list_skills():
            grouped.setdefault(item["category"], []).append(item)
        return grouped

    def overview(self) -> dict:
        matrix = self.skill_matrix()
        return {
            "pipeline": {
                "execution_modes": ["real-time", "batch"],
                "components": ["intake", "memory", "normalizer", "planner", "skills", "risk", "report"],
            },
            "metrics": self.metrics,
            "skill_library": {
                "total_skills": len(SKILLS),
                "categories": {key: len(value) for key, value in matrix.items()},
                "tool_backed": len(SKILLS),
                "skeleton_only": 0,
            },
        }

    def run(self, event: NormalizedEvent, envelope: EventEnvelope | None = None) -> SecurityReport:
        started = time.perf_counter()
        classification = self.planner.classify(event)
        skills, reason = self.planner.plan(event)
        findings = []
        skill_times = {}
        for skill_id in skills:
            if skill_id not in SKILLS:
                continue
            skill_start = time.perf_counter()
            findings.extend(SKILLS[skill_id].execute(event))
            skill_times[skill_id] = int((time.perf_counter() - skill_start) * 1000)
        risk = self.risk_engine.calculate(event, findings)
        report = self.report_engine.build(
            event=event,
            planner_reason=reason,
            skills_selected=skills,
            findings=findings,
            risk=risk,
            observability={
                "pipeline_latency_ms": int((time.perf_counter() - started) * 1000),
                "skill_execution_time_ms": skill_times,
                "classification": classification,
            },
        )
        self.metrics["events_processed"] += 1
        self.metrics["findings_generated"] += len(findings)
        self.metrics["last_event_at"] = datetime.now(timezone.utc).isoformat()
        self.recent_reports.appendleft(report)
        self.history.save_normalized_event(envelope or EventEnvelope(normalized_event=event, classification=classification))
        self.history.save_report(report)
        return report

    def ingest_raw(self, raw_event: RawEvent) -> SecurityReport:
        raw_event, memory = self.memory.apply_raw_event_memory(raw_event)
        normalized = self.normalizer.normalize(raw_event)
        normalized = self.memory.enrich_normalized_event(normalized, memory)
        classification = self.planner.classify(normalized)
        envelope = EventEnvelope(raw_event=raw_event, normalized_event=normalized, classification=classification)
        self.history.save_raw_event(raw_event)
        planned_skills, _ = self.planner.plan(normalized)
        self.memory.learn_from_analysis(raw_event, normalized, planned_skills)
        return self.run(normalized, envelope)

    def recent(self) -> list[dict]:
        if self.recent_reports:
            return [report.model_dump(mode="json") for report in self.recent_reports]
        reports = self.history.list_reports()
        ordered = sorted(reports, key=lambda item: item.get("generated_at", ""), reverse=True)
        return ordered[:30]

    def save_investigation_session(self, name: str, items: list[dict]) -> dict:
        session = {
            "investigation_id": f"inv-{uuid4().hex[:10]}",
            "name": name,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "file_count": len(items),
            "top_risk_score": max((item["report"]["overall_risk_score"] for item in items), default=0.0),
            "top_risk_label": max((item["report"]["top_risk_label"] for item in items), default="info", key=lambda x: {"info":1,"low":2,"medium":3,"high":4,"critical":5}.get(x,1)),
            "skills_seen": sorted({skill for item in items for skill in item["planner_preview"]["skills_to_execute"]}),
            "files": [
                {
                    "filename": item["filename"],
                    "event_type": item["normalized_event"]["event_type"],
                    "source_type": item["normalized_event"]["source_type"],
                    "parser_profile": item["raw_event"]["payload"].get("parser_profile", "generic"),
                }
                for item in items
            ],
        }
        self.history.save_investigation(session)
        return session
