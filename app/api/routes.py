from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

from app.core.pipeline import SecurityPipeline
from app.models.event import EventEnvelope, NormalizedEvent, RawEvent
from app.models.integration import BitdefenderConnectionRequest
from app.models.memory import ClassificationLearningRequest
from app.integrations.bitdefender import (
    BitdefenderClient,
    inventory_endpoints_to_raw_event,
    latest_report_bundle_to_raw_event,
    network_inventory_to_raw_event,
    parse_report_zip_bundle,
    reports_catalog_to_raw_event,
)
from app.utils.file_ingest import parse_file_to_raw_event


router = APIRouter()
pipeline = SecurityPipeline()
STATIC_DIR = Path(__file__).resolve().parents[1] / "static"


def _bitdefender_import_response(raw_event: RawEvent, extra: dict | None = None) -> dict:
    raw_event, memory = pipeline.memory.apply_raw_event_memory(raw_event)
    normalized = pipeline.normalizer.normalize(raw_event)
    normalized = pipeline.memory.enrich_normalized_event(normalized, memory)
    classification = pipeline.planner.classify(normalized)
    skills, reason = pipeline.planner.plan(normalized)
    envelope = EventEnvelope(raw_event=raw_event, normalized_event=normalized, classification=classification)
    pipeline.history.save_raw_event(raw_event)
    pipeline.memory.learn_from_analysis(raw_event, normalized, skills)
    report = pipeline.run(normalized, envelope)
    payload = {
        "raw_event": raw_event.model_dump(mode="json"),
        "normalized_event": normalized.model_dump(mode="json"),
        "planner_preview": {
            "skills_to_execute": skills,
            "analysis_reason": reason,
            "classification": classification,
        },
        "report": report.model_dump(mode="json"),
    }
    if extra:
        payload.update(extra)
    return payload


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/skills")
def skills():
    return pipeline.list_skills()


@router.get("/skills/matrix")
def skills_matrix():
    return pipeline.skill_matrix()


@router.get("/pipeline/overview")
def pipeline_overview():
    return pipeline.overview()


@router.get("/reports/recent")
def recent_reports():
    return pipeline.recent()


@router.get("/events/recent")
def recent_events():
    return pipeline.history.list_events()


@router.get("/events/raw")
def raw_events():
    return pipeline.history.list_raw_events()


@router.get("/investigations/recent")
def investigations():
    return pipeline.history.list_investigations()


@router.get("/history")
def history():
    return {
        "events": pipeline.history.list_events(),
        "raw_events": pipeline.history.list_raw_events(),
        "reports": pipeline.history.list_reports(),
        "investigations": pipeline.history.list_investigations(),
    }


@router.get("/memory/rules")
def memory_rules():
    return pipeline.memory.list_rules()


@router.get("/memory/feedback")
def memory_feedback():
    return pipeline.memory.list_feedback()


@router.post("/integrations/bitdefender/test")
def bitdefender_test(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    return client.test_connection()


@router.post("/integrations/bitdefender/network")
def bitdefender_network(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    inventory = client.get_network_inventory(page=1, per_page=30)
    endpoints = client.get_endpoints(page=1, per_page=100)
    company_id = client.discover_company_id()
    inventory_endpoints = client.discover_inventory_endpoints(company_id=company_id) if company_id else {"total": 0, "managed_total": 0, "unmanaged_total": 0, "items": [], "groups_traversed": 0}
    managed_details_preview = []
    for item in inventory_endpoints.get("items", [])[:20]:
        details = item.get("details", {})
        if details.get("isManaged"):
            try:
                managed_details_preview.append(client.get_managed_endpoint_details(str(item.get("id"))))
            except ValueError:
                pass
        if len(managed_details_preview) >= 5:
            break
    return {
        "company_id": company_id,
        "inventory": inventory,
        "endpoints": endpoints,
        "inventory_endpoints": inventory_endpoints,
        "managed_endpoint_details_preview": managed_details_preview,
    }


@router.post("/integrations/bitdefender/incidents")
def bitdefender_incidents(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    parent_id = payload.parent_id or client.discover_company_id()
    if not parent_id:
        return {"company_id": None, "incidents": {"total": 0, "items": []}, "error": "Unable to discover companyId from network inventory."}
    try:
        incidents = client.get_incidents(parent_id=parent_id, page=1, per_page=500)
        return {"company_id": parent_id, "incidents": incidents, "error": None}
    except ValueError as exc:
        return {"company_id": parent_id, "incidents": {"total": 0, "items": []}, "error": str(exc)}


@router.post("/integrations/bitdefender/reports")
def bitdefender_reports(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    try:
        reports = client.get_reports(page=1, per_page=30)
        return {"reports": reports, "error": None}
    except ValueError as exc:
        return {"reports": {"total": 0, "items": []}, "error": str(exc)}


@router.post("/integrations/bitdefender/reports/download-links")
def bitdefender_report_download_links(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    try:
        reports = client.get_reports(page=1, per_page=30)
        items = reports.get("items", [])
        if not items:
            return {"report": None, "download_links": None, "error": "No available reports in the current catalog."}
        latest = items[0]
        report_id = latest.get("id")
        if not report_id:
            return {"report": latest, "download_links": None, "error": "The latest report does not expose a report id."}
        links = client.get_report_download_links(str(report_id))
        download_url = links.get("lastInstanceUrl") or links.get("lastInstanceDownloadLink")
        summary = None
        if download_url:
            parsed = parse_report_zip_bundle(client.download_report_zip(str(download_url)))
            summary = {
                "row_count": parsed.get("row_count", 0),
                "unique_host_count": parsed.get("unique_host_count", 0),
                "malware_count": parsed.get("malware_count", 0),
                "attack_count": parsed.get("attack_count", 0),
                "blocked_count": parsed.get("blocked_count", 0),
            }
        return {"report": latest, "download_links": links, "latest_report_summary": summary, "error": None}
    except ValueError as exc:
        return {"report": None, "download_links": None, "error": str(exc)}


@router.post("/integrations/bitdefender/network/import")
def bitdefender_network_import(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    company_id = client.discover_company_id()
    inventory_endpoints = client.discover_inventory_endpoints(company_id=company_id) if company_id else {"total": 0, "managed_total": 0, "unmanaged_total": 0, "items": [], "groups_traversed": 0}
    raw_event = inventory_endpoints_to_raw_event(inventory_endpoints, company_id=company_id)
    return _bitdefender_import_response(raw_event, {"company_id": company_id})


@router.post("/integrations/bitdefender/reports/import")
def bitdefender_reports_import(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    reports = client.get_reports(page=1, per_page=30)
    raw_event = reports_catalog_to_raw_event(reports)
    return _bitdefender_import_response(raw_event)


@router.post("/integrations/bitdefender/reports/latest/import")
def bitdefender_latest_report_import(payload: BitdefenderConnectionRequest):
    client = BitdefenderClient(api_key=payload.api_key, base_url=payload.base_url)
    reports = client.get_reports(page=1, per_page=30)
    items = reports.get("items", [])
    if not items:
        return {"report_meta": None, "raw_event": None, "report": None, "error": "No available reports in the current catalog."}
    latest = items[0]
    report_id = latest.get("id")
    if not report_id:
        return {"report_meta": latest, "raw_event": None, "report": None, "error": "The latest report does not expose a report id."}
    links = client.get_report_download_links(str(report_id))
    download_url = links.get("lastInstanceUrl") or links.get("lastInstanceDownloadLink")
    if not download_url:
        return {"report_meta": latest, "raw_event": None, "report": None, "error": "No downloadable latest report instance is available."}
    bundle = client.download_report_zip(str(download_url))
    parsed = parse_report_zip_bundle(bundle)
    raw_event = latest_report_bundle_to_raw_event(latest, parsed)
    return _bitdefender_import_response(
        raw_event,
        {
        "report_meta": latest,
        "download_links": links,
        "bundle_summary": {
            "csv_name": parsed.get("csv_name"),
            "pdf_name": parsed.get("pdf_name"),
            "row_count": parsed.get("row_count"),
            "headers": parsed.get("headers"),
        },
        "error": None,
        },
    )


@router.post("/memory/learn/classification")
def learn_classification(payload: ClassificationLearningRequest):
    raw_event = RawEvent(**payload.raw_event.model_dump())
    return pipeline.memory.learn_classification(
        raw_event=raw_event,
        expected_source_type=payload.expected_source_type,
        expected_event_type=payload.expected_event_type,
        preferred_skills=payload.preferred_skills,
        notes=payload.notes,
        name=payload.name,
    )


@router.post("/normalize/preview")
def normalize_preview(raw_event: RawEvent):
    raw_event, memory = pipeline.memory.apply_raw_event_memory(raw_event)
    normalized = pipeline.normalizer.normalize(raw_event)
    normalized = pipeline.memory.enrich_normalized_event(normalized, memory)
    return normalized


@router.post("/planner/preview")
def planner_preview(event: NormalizedEvent):
    skills, reason = pipeline.planner.plan(event)
    return {"skills_to_execute": skills, "analysis_reason": reason, "classification": pipeline.planner.classify(event)}


@router.post("/event")
def process_event(event: NormalizedEvent):
    return pipeline.run(event)


@router.post("/ingest/raw")
def ingest_raw(raw_event: RawEvent):
    return pipeline.ingest_raw(raw_event)


@router.post("/ingest/files")
async def ingest_files(files: list[UploadFile] = File(...)):
    results = []
    errors = []
    for upload in files:
        data = await upload.read()
        try:
            raw_event = parse_file_to_raw_event(upload.filename or "uploaded-file", data)
            raw_event, memory = pipeline.memory.apply_raw_event_memory(raw_event)
            normalized = pipeline.normalizer.normalize(raw_event)
            normalized = pipeline.memory.enrich_normalized_event(normalized, memory)
            classification = pipeline.planner.classify(normalized)
            skills, reason = pipeline.planner.plan(normalized)
            envelope = EventEnvelope(raw_event=raw_event, normalized_event=normalized, classification=classification)
            pipeline.history.save_raw_event(raw_event)
            pipeline.memory.learn_from_analysis(raw_event, normalized, skills)
            report = pipeline.run(normalized, envelope)
            results.append(
                {
                    "filename": upload.filename,
                    "raw_event": raw_event.model_dump(mode="json"),
                    "normalized_event": normalized.model_dump(mode="json"),
                    "planner_preview": {"skills_to_execute": skills, "analysis_reason": reason, "classification": classification},
                    "report": report.model_dump(mode="json"),
                }
            )
        except ValueError as exc:
            errors.append({"filename": upload.filename, "error": str(exc)})
    investigation = pipeline.save_investigation_session("Uploaded file batch", results) if results else None
    return {"count": len(results), "error_count": len(errors), "errors": errors, "investigation": investigation, "results": results}


@router.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")
