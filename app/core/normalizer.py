from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.models.event import NormalizedEvent, RawEvent


EVENT_TYPE_HINTS = {
    "github": {"pull_request": "github_pr", "secret": "secret_exposure"},
    "endpoint": {"incident": "endpoint_process", "shellspawned": "endpoint_process"},
    "host": {"发现名称": "host_integrity", "auditd": "host_integrity", "ssh": "systemd_service_change"},
    "cloud": {"config": "cloud_config_change", "bucket": "cloud_config_change"},
    "easm": {"port": "service_exposure", "tls": "tls_change"},
    "kms": {"sign": "kms_access"},
    "bitdefender": {"catalog": "integration_catalog", "report": "integration_catalog", "inventory": "endpoint_inventory"},
}


class EventNormalizer:
    def infer_event_type(self, raw_event: RawEvent) -> str:
        if raw_event.event_hint:
            return raw_event.event_hint
        blob = " ".join(str(v).lower() for v in raw_event.payload.values())
        for marker, event_type in EVENT_TYPE_HINTS.get(raw_event.source_type, {}).items():
            if marker in blob:
                return event_type
        return {
            "github": "github_pr",
            "endpoint": "endpoint_process",
            "host": "host_integrity",
            "cloud": "cloud_config_change",
            "easm": "external_asset",
            "kms": "kms_access",
            "identity": "anomalous_access",
            "bitdefender": "integration_catalog",
        }.get(raw_event.source_type, "external_asset")

    def normalize(self, raw_event: RawEvent) -> NormalizedEvent:
        timestamp = raw_event.timestamp or datetime.now(timezone.utc)
        normalized = dict(raw_event.payload)
        normalized.setdefault("target", raw_event.asset_context.get("asset_name", "."))
        return NormalizedEvent(
            event_id=f"evt-{uuid4().hex[:12]}",
            event_type=self.infer_event_type(raw_event),
            source_type=raw_event.source_type,
            timestamp=timestamp,
            asset_context=raw_event.asset_context,
            normalized_data=normalized,
        )
