from __future__ import annotations

from app.models.event import NormalizedEvent
from app.models.finding import Finding


class RiskEngine:
    def calculate(self, event: NormalizedEvent, findings: list[Finding]) -> dict[str, float | int | str]:
        if not findings:
            return {"top_risk_level": 1, "top_risk_label": "info", "overall_risk_score": 0.8}
        top = max(findings, key=lambda item: (item.risk_level, item.confidence))
        avg = sum(item.risk_level + item.confidence for item in findings) / len(findings)
        score = min(5.0, round(avg, 2))
        return {"top_risk_level": top.risk_level, "top_risk_label": top.risk_label, "overall_risk_score": score}
