from __future__ import annotations

from app.models.event import NormalizedEvent


EVENT_SKILL_MAP = {
    "github_pr": ["megaeth.cicd.pr_security_review"],
    "secret_exposure": ["megaeth.cicd.secret_detection", "megaeth.key.private_key_exposure"],
    "endpoint_process": ["megaeth.endpoint.process_anomaly"],
    "host_integrity": ["megaeth.host.integrity_monitor", "megaeth.host.systemd_service_risk", "megaeth.host.binary_tamper_review"],
    "systemd_service_change": ["megaeth.host.systemd_service_risk", "megaeth.host.integrity_monitor"],
    "cloud_config_change": ["megaeth.cloud.config_audit"],
    "external_asset": ["megaeth.easm.asset_discovery"],
    "service_exposure": ["megaeth.easm.service_scan", "megaeth.easm.tls_analysis"],
    "kms_access": ["megaeth.key.kms_risk"],
    "integration_catalog": [],
    "endpoint_inventory": [],
}


class Planner:
    def classify(self, event: NormalizedEvent) -> dict[str, object]:
        tags: list[str] = []
        if event.source_type == "github":
            tags.append("supply_chain")
        if event.source_type == "host":
            tags.append("host_posture")
        if event.source_type == "cloud":
            tags.append("cloud_posture")
        if event.source_type == "endpoint":
            tags.append("endpoint_incident")
        if event.source_type == "easm":
            tags.append("external_surface")
        if event.source_type == "bitdefender":
            tags.append("security_platform")
        return {"classification": tags or ["general"], "priority": "high" if event.asset_context.get("criticality", 1) >= 4 else "normal"}

    def plan(self, event: NormalizedEvent) -> tuple[list[str], str]:
        skills = list(EVENT_SKILL_MAP.get(event.event_type, []))
        if not skills and event.event_type != "integration_catalog":
            skills = ["megaeth.easm.asset_discovery"]
        memory_context = event.normalized_data.get("_memory_context", {})
        preferred = [item for item in memory_context.get("preferred_skills", []) if item]
        if preferred:
            skills = list(dict.fromkeys([*preferred, *skills]))
        reason = (
            f"Classified event as {', '.join(self.classify(event)['classification'])}; "
            f"selected skill set for event_type={event.event_type} and source_type={event.source_type}."
        )
        if memory_context.get("matched_rule_name"):
            reason += f" Memory matched `{memory_context['matched_rule_name']}`."
        return skills, reason
