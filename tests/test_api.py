from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app
from app.core.pipeline import SecurityPipeline


client = TestClient(app)


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_risk_analytics_csv_maps_to_host_pipeline() -> None:
    files = [
        (
            "files",
            (
                "megalabs_2026-03-13_riskanalytics.csv",
                (
                    "发现名称,风险评分,平台,合规标准\n"
                    "未安装 auditd,99,Unix,PCI DSS v4.0.1\n"
                    "SSH 访问未受限制,100,Unix,CIS v8.0\n"
                ).encode("utf-8"),
                "text/csv",
            ),
        ),
    ]
    body = client.post("/ingest/files", files=files).json()
    item = body["results"][0]
    assert item["normalized_event"]["source_type"] == "host"
    assert "megaeth.host.integrity_monitor" in item["report"]["skills_selected"]
    assert item["report"]["findings"]


def test_memory_learning_reclassifies_upload() -> None:
    payload = {
        "raw_event": {
            "source_type": "github",
            "asset_context": {
                "asset_id": "baseline",
                "asset_name": "baseline",
                "source_file": "riskanalytics-memory.csv",
            },
            "payload": {
                "headers": ["发现名称", "风险评分", "平台", "合规标准"],
                "rows": [{"发现名称": "未安装 auditd", "风险评分": "99", "平台": "Unix"}],
                "parser_profile": "csv-tabular",
            },
        },
        "expected_source_type": "host",
        "expected_event_type": "host_integrity",
        "preferred_skills": ["megaeth.host.integrity_monitor", "megaeth.host.systemd_service_risk"],
        "name": "Risk analytics memory",
    }
    assert client.post("/memory/learn/classification", json=payload).status_code == 200

    files = [
        (
            "files",
            (
                "riskanalytics-memory.csv",
                (
                    "发现名称,风险评分,平台,合规标准\n"
                    "SSH 访问未受限制,100,Unix,CIS v8.0\n"
                    "未安装 auditd,99,Unix,PCI DSS v4.0.1\n"
                ).encode("utf-8"),
                "text/csv",
            ),
        ),
    ]
    body = client.post("/ingest/files", files=files).json()
    item = body["results"][0]
    assert item["normalized_event"]["normalized_data"]["_memory_context"]["matched_rule_name"] == "Risk analytics memory"


def test_memory_rules_deduplicate_similar_manual_entries() -> None:
    payload = {
        "raw_event": {
            "source_type": "github",
            "asset_context": {
                "asset_id": "baseline",
                "asset_name": "baseline",
                "source_file": "dedupe-risk.csv",
            },
            "payload": {
                "headers": ["发现名称", "风险评分", "平台", "合规标准"],
                "rows": [{"发现名称": "未安装 auditd", "风险评分": "99", "平台": "Unix"}],
                "parser_profile": "csv-tabular",
            },
        },
        "expected_source_type": "host",
        "expected_event_type": "host_integrity",
        "preferred_skills": ["megaeth.host.integrity_monitor"],
    }
    assert client.post("/memory/learn/classification", json=payload).status_code == 200
    assert client.post("/memory/learn/classification", json=payload).status_code == 200
    rules = [item for item in client.get("/memory/rules").json() if item["expected_event_type"] == "host_integrity"]
    dedupe_rules = [item for item in rules if "dedupe-risk.csv" in item.get("filename_tokens", [])]
    assert len(dedupe_rules) == 1


def test_pdf_endpoint_material_maps_to_endpoint() -> None:
    files = [("files", ("incident.pdf", b"%PDF-1.7", "application/pdf"))]
    with patch("app.utils.file_ingest.extract_pdf_text", return_value="Attack.LocalFileInclusion.132 /.env endpoint shellspawned"):
        body = client.post("/ingest/files", files=files).json()
    assert body["results"][0]["normalized_event"]["source_type"] == "endpoint"


def test_pipeline_restores_overview_metrics_and_recent_reports_from_history() -> None:
    fake_report = {
        "event_id": "evt-1",
        "event_type": "host_integrity",
        "source_type": "host",
        "planner_reason": "restored",
        "skills_selected": ["megaeth.host.integrity_monitor"],
        "findings": [
            {
                "finding_id": "f-1",
                "skill_id": "megaeth.host.integrity_monitor",
                "risk_level": 4,
                "risk_label": "high",
                "risk_type": "integrity_change",
                "confidence": 0.84,
                "summary": "restored finding",
                "affected_assets": ["host-1"],
                "evidence": [],
                "recommendations": [],
            }
        ],
        "summary": "restored summary",
        "assessment": "restored assessment",
        "likely_issue": True,
        "verdict": "confirmed_posture_risk",
        "evidence_highlights": [],
        "recommended_actions": [],
        "analyst_notes": [],
        "key_facts": [],
        "probable_causes": [],
        "why_flagged": "",
        "report_gaps": [],
        "quick_checks": [],
        "escalation_conditions": [],
        "professional_judgment": "",
        "top_risk_level": 4,
        "top_risk_label": "high",
        "overall_risk_score": 4.2,
        "generated_at": "2026-03-14T10:00:00Z",
        "observability": {},
    }
    with patch("app.core.pipeline.HistoryService.list_reports", return_value=[fake_report]), patch(
        "app.core.pipeline.HistoryService.list_events", return_value=[]
    ):
        pipeline = SecurityPipeline()
    overview = pipeline.overview()
    assert overview["metrics"]["events_processed"] == 1
    assert overview["metrics"]["findings_generated"] == 1
    assert overview["metrics"]["last_event_at"] == "2026-03-14T10:00:00Z"
    assert pipeline.recent()[0]["event_id"] == "evt-1"


def test_bitdefender_test_endpoint() -> None:
    fake_result = {
        "base_url": "https://cloud.gravityzone.bitdefender.com/api/v1.0/jsonrpc",
        "company_id": "company-1",
        "inventory_total": 2,
        "endpoint_total": 0,
        "incident_total": 0,
        "incident_error": None,
        "report_total": 1,
        "report_error": None,
        "inventory_items": [{"id": "a"}],
        "endpoint_items": [],
        "incident_items": [],
        "report_items": [{"id": "r"}],
    }
    with patch("app.api.routes.BitdefenderClient.test_connection", return_value=fake_result):
        body = client.post("/integrations/bitdefender/test", json={"api_key": "demo"}).json()
    assert body["company_id"] == "company-1"


def test_bitdefender_network_endpoint_includes_recursive_inventory_devices() -> None:
    fake_inventory = {"total": 2, "items": [{"id": "g-1", "name": "Custom Groups", "type": 4}]}
    fake_endpoints = {"total": 0, "items": []}
    fake_recursive = {"total": 22, "managed_total": 1, "unmanaged_total": 21, "groups_traversed": 5, "items": [{"id": "e-1", "name": "host-1", "details": {"isManaged": True}}]}
    fake_detail = {"id": "e-1", "name": "host-1", "operatingSystem": "macOS", "riskScore": {"value": "9%"}}
    with patch("app.api.routes.BitdefenderClient.get_network_inventory", return_value=fake_inventory), patch(
        "app.api.routes.BitdefenderClient.get_endpoints", return_value=fake_endpoints
    ), patch("app.api.routes.BitdefenderClient.discover_company_id", return_value="company-1"), patch(
        "app.api.routes.BitdefenderClient.discover_inventory_endpoints", return_value=fake_recursive
    ), patch("app.api.routes.BitdefenderClient.get_managed_endpoint_details", return_value=fake_detail):
        body = client.post("/integrations/bitdefender/network", json={}).json()
    assert body["inventory_endpoints"]["total"] == 22
    assert body["managed_endpoint_details_preview"][0]["id"] == "e-1"


def test_bitdefender_network_endpoint_without_managed_details_still_returns_inventory() -> None:
    fake_inventory = {"total": 2, "items": [{"id": "g-1", "name": "Custom Groups", "type": 4}]}
    fake_endpoints = {"total": 0, "items": []}
    fake_recursive = {"total": 22, "managed_total": 0, "unmanaged_total": 22, "groups_traversed": 5, "items": [{"id": "e-1", "name": "host-1"}]}
    with patch("app.api.routes.BitdefenderClient.get_network_inventory", return_value=fake_inventory), patch(
        "app.api.routes.BitdefenderClient.get_endpoints", return_value=fake_endpoints
    ), patch("app.api.routes.BitdefenderClient.discover_company_id", return_value="company-1"), patch(
        "app.api.routes.BitdefenderClient.discover_inventory_endpoints", return_value=fake_recursive
    ):
        body = client.post("/integrations/bitdefender/network", json={}).json()
    assert body["inventory_endpoints"]["total"] == 22


def test_bitdefender_collects_all_inventory_pages_for_group_children() -> None:
    from app.integrations.bitdefender import BitdefenderClient

    client_obj = BitdefenderClient(api_key="demo")
    page1 = {"total": 3, "pagesCount": 2, "items": [{"id": "a"}, {"id": "b"}]}
    page2 = {"total": 3, "pagesCount": 2, "items": [{"id": "c"}]}
    with patch.object(BitdefenderClient, "get_network_inventory_children", side_effect=[page1, page2]):
        body = client_obj.get_all_network_inventory_children("group-1", per_page=100)
    assert len(body["items"]) == 3


def test_bitdefender_network_import_uses_recursive_inventory_devices() -> None:
    fake_recursive = {
        "total": 22,
        "managed_total": 18,
        "unmanaged_total": 4,
        "groups_traversed": 5,
        "items": [{"id": "e-1", "name": "host-1", "details": {"fqdn": "host-1.local", "isManaged": True}}],
    }
    with patch("app.api.routes.BitdefenderClient.discover_company_id", return_value="company-1"), patch(
        "app.api.routes.BitdefenderClient.discover_inventory_endpoints", return_value=fake_recursive
    ):
        body = client.post("/integrations/bitdefender/network/import", json={}).json()
    assert body["raw_event"]["event_hint"] == "endpoint_inventory"
    assert body["normalized_event"]["event_type"] == "endpoint_inventory"
    assert body["raw_event"]["payload"]["row_count"] == 1


def test_bitdefender_reports_import_runs_pipeline() -> None:
    fake_reports = {
        "total": 1,
        "items": [{"id": "r-1", "name": "安全审计报表", "type": 17, "occurrence": 4}],
    }
    with patch("app.api.routes.BitdefenderClient.get_reports", return_value=fake_reports):
        body = client.post("/integrations/bitdefender/reports/import", json={"api_key": "demo"}).json()
    assert body["raw_event"]["source_type"] == "bitdefender"
    assert body["report"]["event_type"] == "integration_catalog"
    assert body["report"]["verdict"] == "informational_platform_observation"


def test_bitdefender_report_download_links_endpoint() -> None:
    fake_reports = {
        "total": 1,
        "items": [{"id": "r-1", "name": "安全审计报表", "type": 17, "occurrence": 4}],
    }
    fake_links = {
        "lastInstanceDownloadLink": "https://example.com/latest.zip",
        "allInstancesDownloadLink": "https://example.com/all.zip",
    }
    fake_bundle_summary = {
        "row_count": 128,
        "unique_host_count": 28,
        "malware_count": 2,
        "attack_count": 5,
        "blocked_count": 2,
    }
    with patch("app.api.routes.BitdefenderClient.get_reports", return_value=fake_reports), patch(
        "app.api.routes.BitdefenderClient.get_report_download_links", return_value=fake_links
    ), patch("app.api.routes.BitdefenderClient.download_report_zip", return_value=b"demo"), patch(
        "app.api.routes.parse_report_zip_bundle", return_value=fake_bundle_summary
    ):
        body = client.post("/integrations/bitdefender/reports/download-links", json={}).json()
    assert body["report"]["id"] == "r-1"
    assert body["download_links"]["lastInstanceDownloadLink"] == "https://example.com/latest.zip"
    assert body["latest_report_summary"]["unique_host_count"] == 28


def test_bitdefender_latest_report_import_runs_pipeline() -> None:
    fake_reports = {
        "total": 1,
        "items": [{"id": "r-1", "name": "安全审计报表", "type": 17, "occurrence": 4}],
    }
    fake_links = {"lastInstanceUrl": "https://example.com/latest.zip"}
    fake_bundle = b"PK-demo"
    fake_parsed = {
        "csv_name": "audit.csv",
        "pdf_name": "audit.pdf",
        "row_count": 2,
        "headers": ["端点名称", "事件类型"],
        "rows": [{"端点名称": "host-1", "事件类型": "恶意软件检测"}],
        "content": "恶意软件检测 host-1",
    }
    with patch("app.api.routes.BitdefenderClient.get_reports", return_value=fake_reports), patch(
        "app.api.routes.BitdefenderClient.get_report_download_links", return_value=fake_links
    ), patch("app.api.routes.BitdefenderClient.download_report_zip", return_value=fake_bundle), patch(
        "app.api.routes.parse_report_zip_bundle", return_value=fake_parsed
    ):
        body = client.post("/integrations/bitdefender/reports/latest/import", json={}).json()
    assert body["raw_event"]["source_type"] == "endpoint"
    assert body["normalized_event"]["event_type"] == "endpoint_process"
    assert body["planner_preview"]["skills_to_execute"] == ["megaeth.endpoint.process_anomaly"]
    assert body["report"]["event_type"] == "endpoint_process"
    assert "megaeth.endpoint.process_anomaly" in body["report"]["skills_selected"]


def test_endpoint_skill_extracts_multiple_bitdefender_patterns() -> None:
    payload = {
        "event_id": "evt-test",
        "event_type": "endpoint_process",
        "source_type": "endpoint",
        "timestamp": "2026-03-14T10:00:00Z",
        "asset_context": {"asset_name": "安全审计报表", "criticality": 4},
        "normalized_data": {
            "rows": [
                {"端点名称": "host-1", "模块": "反恶意软件", "事件类型": "恶意软件检测", "详情": "恶意软件名称:Generic.SH.Amos"},
                {"端点名称": "host-2", "模块": "网络攻击防护", "事件类型": "网络攻击", "详情": "Attack.LocalFileInclusion.132"},
                {"端点名称": "host-3", "模块": "反钓鱼", "事件类型": "阻止的网站", "详情": "网站：https://example.bad"},
            ]
        },
    }
    body = client.post("/event", json=payload).json()
    assert len(body["findings"]) >= 3
