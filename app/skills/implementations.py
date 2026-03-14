from __future__ import annotations

from typing import Any
from uuid import uuid4

from app.models.event import NormalizedEvent
from app.models.finding import Finding


def _risk_label(level: int) -> str:
    return {1: "info", 2: "low", 3: "medium", 4: "high", 5: "critical"}.get(level, "info")


class Skill:
    def __init__(self, skill_id: str, skill_name: str, category: str, description: str) -> None:
        self.skill_id = skill_id
        self.skill_name = skill_name
        self.category = category
        self.description = description

    def execute(self, event: NormalizedEvent) -> list[Finding]:
        data = event.normalized_data
        blob = " ".join(str(v).lower() for v in data.values())
        findings: list[Finding] = []
        if self.skill_id == "megaeth.cicd.pr_security_review" and any(token in blob for token in ("subprocess", "curl", "bash")):
            findings.append(self._finding(event, 4, "dangerous_code", "Potential dangerous execution flow found in supplied code or PR content."))
        elif self.skill_id == "megaeth.cicd.secret_detection" and any(token in blob for token in ("akia", "private key", "api_key", "secret")):
            findings.append(self._finding(event, 5, "secret_exposure", "Potential secret material detected in supplied content."))
        elif self.skill_id == "megaeth.endpoint.process_anomaly":
            rows = data.get("rows", [])
            if isinstance(rows, list) and rows:
                malware_rows = []
                network_attack_rows = []
                blocked_site_rows = []
                affected_hosts: set[str] = set()
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    event_type = str(row.get("事件类型") or row.get("event_type") or "").lower()
                    module = str(row.get("模块") or row.get("module") or "").lower()
                    details = str(row.get("详情") or row.get("details") or "")
                    host = str(row.get("端点名称") or row.get("endpoint_name") or row.get("端点 FQDN") or "").strip()
                    if host:
                        affected_hosts.add(host)
                    if "恶意软件检测" in event_type or "恶意软件" in module:
                        malware_rows.append({"host": host, "details": details[:220]})
                    if "网络攻击" in event_type or "attack." in details.lower() or "network attack" in event_type:
                        network_attack_rows.append({"host": host, "details": details[:220]})
                    if "阻止的网站" in event_type or "反钓鱼" in module:
                        blocked_site_rows.append({"host": host, "details": details[:220]})
                if malware_rows:
                    findings.append(
                        self._finding(
                            event,
                            5,
                            "malware_detection",
                            f"Bitdefender report contains {len(malware_rows)} malware detection record(s) across managed endpoints.",
                            evidence=[
                                {"malware_samples": malware_rows[:5]},
                                {"affected_hosts": sorted(affected_hosts)[:8]},
                                {"top_malware_hosts": [item["host"] for item in malware_rows[:5] if item.get("host")]},
                            ],
                            recommendations=[
                                "Validate whether the detected files were fully removed or quarantined on each affected endpoint.",
                                "Review the impacted endpoints for persistence, credential access, and follow-on activity around the detection time.",
                            ],
                        )
                    )
                if network_attack_rows:
                    findings.append(
                        self._finding(
                            event,
                            4,
                            "network_attack_detection",
                            f"Bitdefender report contains {len(network_attack_rows)} network attack detection record(s), including exploit-style signatures.",
                            evidence=[
                                {"network_attack_samples": network_attack_rows[:5]},
                                {"top_attack_hosts": [item["host"] for item in network_attack_rows[:5] if item.get("host")]},
                            ],
                            recommendations=[
                                "Correlate the detected attack signatures with web access logs and endpoint telemetry to confirm whether exploitation succeeded.",
                                "Prioritize repeated exploit-style detections on the same host for deeper incident review.",
                            ],
                        )
                    )
                if blocked_site_rows:
                    findings.append(
                        self._finding(
                            event,
                            3,
                            "phishing_or_malicious_web",
                            f"Bitdefender report shows {len(blocked_site_rows)} blocked website event(s), suggesting phishing or malicious web exposure.",
                            evidence=[
                                {"blocked_sites": blocked_site_rows[:5]},
                                {"top_blocked_site_hosts": [item["host"] for item in blocked_site_rows[:5] if item.get("host")]},
                            ],
                            recommendations=[
                                "Review the blocked domains and identify whether any user repeatedly attempted to access the same suspicious destination.",
                                "Correlate blocked-site activity with endpoint malware detections on the same host or user profile.",
                            ],
                        )
                    )
                if findings:
                    return findings
            if any(token in blob for token in ("attack.localfileinclusion", "/.env", "shellspawned", "credentialtheft")):
                findings.append(self._finding(event, 4, "endpoint_process", "Endpoint incident material contains suspicious process or exploit indicators."))
        elif self.skill_id == "megaeth.host.integrity_monitor":
            rows = data.get("rows", [])
            if isinstance(rows, list) and rows:
                severe = []
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    title = str(row.get("发现名称") or row.get("\ufeff发现名称") or "")
                    score = str(row.get("风险评分") or "0")
                    try:
                        if int(float(score)) >= 95:
                            severe.append(title)
                    except ValueError:
                        pass
                if severe:
                    findings.append(
                        self._finding(
                            event,
                            4,
                            "integrity_change",
                            f"Host hardening report contains {len(severe)} critical or near-critical control gaps across operating system baselines.",
                            evidence=[{"top_findings": severe[:5]}],
                            recommendations=[
                                "Prioritize filesystem, logging, and audit control gaps with risk scores above 95.",
                                "Deploy missing host integrity controls such as auditd and AIDE on affected Unix assets.",
                            ],
                        )
                    )
        elif self.skill_id == "megaeth.host.systemd_service_risk":
            rows = data.get("rows", [])
            service_findings = []
            if isinstance(rows, list):
                for row in rows:
                    if not isinstance(row, dict):
                        continue
                    title = str(row.get("发现名称") or row.get("\ufeff发现名称") or "")
                    if any(token in title.lower() for token in ("ssh", "telnet", "rsync", "icmp", "openssh", "rds", "printer")):
                        service_findings.append(title)
            if service_findings:
                findings.append(
                    self._finding(
                        event,
                        4,
                        "service_risk",
                        f"Network-facing service posture includes {len(service_findings)} risky exposure or remote-access control findings.",
                        evidence=[{"service_findings": service_findings[:6]}],
                        recommendations=[
                            "Tighten SSH exposure, legacy remote services, and insecure network control settings.",
                            "Validate that remote administration paths are restricted to approved management boundaries.",
                        ],
                    )
                )
        elif self.skill_id == "megaeth.cloud.config_audit" and any(token in blob for token in ("public bucket", "security group", "cloudtrail", "bucket")):
            findings.append(self._finding(event, 3, "cloud_misconfiguration", "Cloud posture issues suggest misconfiguration or missing controls."))
        elif self.skill_id == "megaeth.easm.service_scan" and any(token in blob for token in ("port", "service", "ssh", "http")):
            findings.append(self._finding(event, 3, "service_exposure", "Service exposure data indicates externally reachable services requiring review."))
        elif self.skill_id == "megaeth.key.kms_risk" and any(token in blob for token in ("sign", "kms", "caller")):
            findings.append(self._finding(event, 5, "kms_access", "KMS signing activity deviates from expected operational baseline."))
        return findings

    def _finding(
        self,
        event: NormalizedEvent,
        level: int,
        risk_type: str,
        summary: str,
        evidence: list[dict[str, Any]] | None = None,
        recommendations: list[str] | None = None,
    ) -> Finding:
        return Finding(
            finding_id=f"{event.event_id}-{self.skill_id}-{uuid4().hex[:8]}",
            skill_id=self.skill_id,
            risk_level=level,
            risk_label=_risk_label(level),
            risk_type=risk_type,
            confidence=0.84 if level >= 4 else 0.74,
            summary=summary,
            affected_assets=[str(event.asset_context.get("asset_name", "unknown"))],
            evidence=evidence or [],
            recommendations=recommendations or [],
        )


SKILLS = {
    "megaeth.cicd.pr_security_review": Skill("megaeth.cicd.pr_security_review", "PR Security Review", "cicd", "Reviews supplied code and change content."),
    "megaeth.cicd.secret_detection": Skill("megaeth.cicd.secret_detection", "Secret Detection", "cicd", "Detects exposed keys and secrets."),
    "megaeth.endpoint.process_anomaly": Skill("megaeth.endpoint.process_anomaly", "Endpoint Process Anomaly", "endpoint", "Analyzes endpoint incident material."),
    "megaeth.host.integrity_monitor": Skill("megaeth.host.integrity_monitor", "Host Integrity Monitor", "host", "Evaluates host baseline and integrity drift."),
    "megaeth.host.systemd_service_risk": Skill("megaeth.host.systemd_service_risk", "Service Risk Review", "host", "Reviews remote-access and service posture issues."),
    "megaeth.host.binary_tamper_review": Skill("megaeth.host.binary_tamper_review", "Binary Tamper Review", "host", "Reserved for binary integrity review."),
    "megaeth.cloud.config_audit": Skill("megaeth.cloud.config_audit", "Cloud Config Audit", "cloud", "Reviews cloud configuration drift."),
    "megaeth.easm.asset_discovery": Skill("megaeth.easm.asset_discovery", "Asset Discovery", "easm", "Processes asset inventory material."),
    "megaeth.easm.service_scan": Skill("megaeth.easm.service_scan", "Service Exposure", "easm", "Processes service exposure outputs."),
    "megaeth.easm.tls_analysis": Skill("megaeth.easm.tls_analysis", "TLS Analysis", "easm", "Reserved for TLS posture review."),
    "megaeth.key.kms_risk": Skill("megaeth.key.kms_risk", "KMS Risk", "key", "Reviews abnormal key usage."),
    "megaeth.key.private_key_exposure": Skill("megaeth.key.private_key_exposure", "Private Key Exposure", "key", "Detects exposed key material."),
    "megaeth.identity.policy_risk_analysis": Skill("megaeth.identity.policy_risk_analysis", "Policy Risk Analysis", "identity", "Analyzes policy sprawl and privilege risk."),
    "megaeth.identity.anomalous_access_review": Skill("megaeth.identity.anomalous_access_review", "Anomalous Access Review", "identity", "Reviews identity-driven access anomalies."),
    "megaeth.cloud.identity_surface": Skill("megaeth.cloud.identity_surface", "Cloud Identity Surface", "cloud", "Reviews cloud privilege surface."),
    "megaeth.easm.vulnerability_scan": Skill("megaeth.easm.vulnerability_scan", "Exposure Verification", "easm", "Processes vulnerability and exposure verification results."),
    "megaeth.easm.external_intelligence": Skill("megaeth.easm.external_intelligence", "External Intelligence", "easm", "Processes internet intelligence and exposure context."),
}
