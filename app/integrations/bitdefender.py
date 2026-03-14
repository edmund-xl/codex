from __future__ import annotations

import base64
import collections
import csv
import io
import zipfile
from datetime import datetime, timezone
from typing import Any

import httpx

from app.models.event import RawEvent


class BitdefenderClient:
    def __init__(self, api_key: str, base_url: str = "https://cloud.gravityzone.bitdefender.com/api/v1.0/jsonrpc") -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def _headers(self) -> dict[str, str]:
        token = base64.b64encode(f"{self.api_key}:".encode("utf-8")).decode("utf-8")
        return {
            "Authorization": f"Basic {token}",
            "Content-Type": "application/json",
        }

    def _post(self, service: str, method: str, params: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.base_url}/{service}"
        payload = {
            "jsonrpc": "2.0",
            "method": method,
            "params": params,
            "id": "1",
        }
        with httpx.Client(timeout=20.0) as client:
            response = client.post(url, headers=self._headers(), json=payload)
            response.raise_for_status()
            data = response.json()
        if "error" in data:
            error = data["error"]
            raise ValueError(error.get("data", {}).get("details") or error.get("message") or "Bitdefender API error")
        return data.get("result", {})

    def get_network_inventory(self, page: int = 1, per_page: int = 30) -> dict[str, Any]:
        return self._post("network", "getNetworkInventoryItems", {"page": page, "perPage": per_page})

    def get_network_inventory_children(self, parent_id: str, page: int = 1, per_page: int = 100) -> dict[str, Any]:
        return self._post("network", "getNetworkInventoryItems", {"page": page, "perPage": per_page, "parentId": parent_id})

    def get_all_network_inventory_children(self, parent_id: str, per_page: int = 100) -> dict[str, Any]:
        first = self.get_network_inventory_children(parent_id, page=1, per_page=per_page)
        pages = int(first.get("pagesCount", 1) or 1)
        items = list(first.get("items", []))
        total = int(first.get("total", len(items)) or len(items))
        for page in range(2, pages + 1):
            batch = self.get_network_inventory_children(parent_id, page=page, per_page=per_page)
            items.extend(batch.get("items", []))
        return {
            "total": total,
            "page": 1,
            "perPage": per_page,
            "pagesCount": pages,
            "items": items,
        }

    def get_endpoints(self, page: int = 1, per_page: int = 100) -> dict[str, Any]:
        return self._post("network", "getEndpointsList", {"page": page, "perPage": per_page})

    def get_managed_endpoint_details(self, endpoint_id: str) -> dict[str, Any]:
        return self._post("network", "getManagedEndpointDetails", {"endpointId": endpoint_id})

    def get_incidents(self, parent_id: str, page: int = 1, per_page: int = 500) -> dict[str, Any]:
        return self._post("incidents", "getIncidentsList", {"parentId": parent_id, "page": page, "perPage": per_page})

    def get_reports(self, page: int = 1, per_page: int = 30) -> dict[str, Any]:
        return self._post("reports", "getReportsList", {"page": page, "perPage": per_page})

    def get_report_download_links(self, report_id: str) -> dict[str, Any]:
        return self._post("reports", "getDownloadLinks", {"reportId": report_id})

    def download_report_zip(self, download_url: str) -> bytes:
        with httpx.Client(timeout=30.0, follow_redirects=True) as client:
            response = client.get(download_url, headers={"Authorization": self._headers()["Authorization"]})
            response.raise_for_status()
            return response.content

    def discover_company_id(self) -> str | None:
        inventory = self.get_network_inventory(page=1, per_page=30)
        items = inventory.get("items", [])
        for item in items:
            company_id = item.get("companyId")
            if company_id:
                return str(company_id)
        return None

    def discover_inventory_endpoints(self, company_id: str | None = None) -> dict[str, Any]:
        company = company_id or self.discover_company_id()
        if not company:
            return {"total": 0, "managed_total": 0, "unmanaged_total": 0, "items": [], "groups_traversed": 0}
        top = self.get_all_network_inventory_children(company, per_page=100)
        queue: collections.deque[str] = collections.deque()
        seen_groups: set[str] = set()
        endpoints: list[dict[str, Any]] = []
        for item in top.get("items", []):
            if item.get("type") == 4:
                group_id = str(item.get("id"))
                queue.append(group_id)
                seen_groups.add(group_id)
            elif item.get("type") == 5:
                endpoints.append(item)
        while queue:
            group_id = queue.popleft()
            result = self.get_all_network_inventory_children(group_id, per_page=100)
            for item in result.get("items", []):
                item_type = item.get("type")
                if item_type == 4:
                    child_group_id = str(item.get("id"))
                    if child_group_id not in seen_groups:
                        seen_groups.add(child_group_id)
                        queue.append(child_group_id)
                elif item_type == 5:
                    endpoints.append(item)
        unique: dict[str, dict[str, Any]] = {}
        managed_total = 0
        unmanaged_total = 0
        for item in endpoints:
            endpoint_id = str(item.get("id"))
            unique[endpoint_id] = item
        deduped = list(unique.values())
        for item in deduped:
            managed = bool(item.get("details", {}).get("isManaged"))
            if managed:
                managed_total += 1
            else:
                unmanaged_total += 1
        return {
            "total": len(deduped),
            "managed_total": managed_total,
            "unmanaged_total": unmanaged_total,
            "items": deduped,
            "groups_traversed": len(seen_groups),
        }

    def test_connection(self) -> dict[str, Any]:
        inventory = self.get_network_inventory(page=1, per_page=30)
        company_id = self.discover_company_id()
        endpoints = self.get_endpoints(page=1, per_page=100)
        inventory_endpoints = self.discover_inventory_endpoints(company_id=company_id) if company_id else {"total": 0, "managed_total": 0, "unmanaged_total": 0, "items": [], "groups_traversed": 0}
        managed_details_preview = []
        for item in inventory_endpoints.get("items", [])[:20]:
            details = item.get("details", {})
            if details.get("isManaged"):
                try:
                    managed_details_preview.append(self.get_managed_endpoint_details(str(item.get("id"))))
                except ValueError:
                    pass
            if len(managed_details_preview) >= 5:
                break
        reports = None
        reports_error = None
        report_download_links = None
        latest_report_summary = None
        try:
            reports = self.get_reports(page=1, per_page=30)
            report_items = reports.get("items", [])
            if report_items:
                report_id = report_items[0].get("id")
                if report_id:
                    try:
                        report_download_links = self.get_report_download_links(str(report_id))
                        download_url = report_download_links.get("lastInstanceUrl") or report_download_links.get("lastInstanceDownloadLink")
                        if download_url:
                            latest_report_summary = parse_report_zip_bundle(self.download_report_zip(str(download_url)))
                    except ValueError:
                        report_download_links = None
        except ValueError as exc:
            reports_error = str(exc)
        incidents = None
        incident_error = None
        if company_id:
            try:
                incidents = self.get_incidents(parent_id=company_id, page=1, per_page=500)
            except ValueError as exc:
                incident_error = str(exc)
        return {
            "base_url": self.base_url,
            "company_id": company_id,
            "inventory_total": inventory.get("total", 0),
            "endpoint_total": endpoints.get("total", 0),
            "inventory_endpoint_total": inventory_endpoints.get("total", 0),
            "inventory_managed_endpoint_total": inventory_endpoints.get("managed_total", 0),
            "inventory_unmanaged_endpoint_total": inventory_endpoints.get("unmanaged_total", 0),
            "inventory_groups_traversed": inventory_endpoints.get("groups_traversed", 0),
            "incident_total": None if incidents is None else incidents.get("total", 0),
            "incident_error": incident_error,
            "report_total": None if reports is None else reports.get("total", 0),
            "report_error": reports_error,
            "report_download_links": report_download_links,
            "latest_report_summary": None
            if latest_report_summary is None
            else {
                "row_count": latest_report_summary.get("row_count", 0),
                "unique_host_count": latest_report_summary.get("unique_host_count", 0),
                "malware_count": latest_report_summary.get("malware_count", 0),
                "attack_count": latest_report_summary.get("attack_count", 0),
                "blocked_count": latest_report_summary.get("blocked_count", 0),
            },
            "inventory_items": items_preview(inventory.get("items", [])),
            "endpoint_items": items_preview(endpoints.get("items", [])),
            "inventory_endpoint_items": items_preview(inventory_endpoints.get("items", [])),
            "managed_endpoint_details_preview": managed_endpoint_preview(managed_details_preview),
            "incident_items": items_preview([] if incidents is None else incidents.get("items", [])),
            "report_items": items_preview([] if reports is None else reports.get("items", [])),
        }


def items_preview(items: list[dict[str, Any]], limit: int = 5) -> list[dict[str, Any]]:
    preview: list[dict[str, Any]] = []
    for item in items[:limit]:
        preview.append(
            {
                "id": item.get("id"),
                "name": item.get("name") or item.get("displayName") or item.get("machineName"),
                "type": item.get("type"),
                "companyId": item.get("companyId"),
                "severity": item.get("severity"),
                "status": item.get("status"),
                "createdAt": item.get("createdAt") or item.get("created"),
            }
        )
    return preview


def managed_endpoint_preview(items: list[dict[str, Any]], limit: int = 5) -> list[dict[str, Any]]:
    preview: list[dict[str, Any]] = []
    for item in items[:limit]:
        preview.append(
            {
                "id": item.get("id"),
                "name": item.get("name"),
                "operatingSystem": item.get("operatingSystem"),
                "ip": item.get("ip"),
                "lastSeen": item.get("lastSeen"),
                "policy": (item.get("policy") or {}).get("name"),
                "managedWithBest": item.get("managedWithBest"),
                "riskScore": (item.get("riskScore") or {}).get("value"),
            }
        )
    return preview


def network_inventory_to_raw_event(inventory: dict[str, Any], company_id: str | None = None) -> RawEvent:
    return RawEvent(
        source_type="easm",
        event_hint="external_asset",
        timestamp=datetime.now(timezone.utc),
        asset_context={
            "asset_id": company_id or "bitdefender-network",
            "asset_name": "Bitdefender Network Inventory",
            "environment": "production",
            "criticality": 3,
            "source_file": "bitdefender-network-inventory",
            "integration": "bitdefender",
        },
        payload={
            "parser_profile": "bitdefender-network",
            "target": "bitdefender-network-inventory",
            "row_count": len(inventory.get("items", [])),
            "headers": ["id", "name", "type", "parentId", "companyId"],
            "rows": inventory.get("items", []),
        },
    )


def inventory_endpoints_to_raw_event(inventory_endpoints: dict[str, Any], company_id: str | None = None) -> RawEvent:
    return RawEvent(
        source_type="bitdefender",
        event_hint="endpoint_inventory",
        timestamp=datetime.now(timezone.utc),
        asset_context={
            "asset_id": company_id or "bitdefender-endpoint-inventory",
            "asset_name": "Bitdefender Endpoint Inventory",
            "environment": "production",
            "criticality": 3,
            "source_file": "bitdefender-endpoint-inventory",
            "integration": "bitdefender",
        },
        payload={
            "parser_profile": "bitdefender-endpoint-inventory",
            "target": "bitdefender-endpoint-inventory",
            "row_count": len(inventory_endpoints.get("items", [])),
            "managed_total": inventory_endpoints.get("managed_total", 0),
            "unmanaged_total": inventory_endpoints.get("unmanaged_total", 0),
            "groups_traversed": inventory_endpoints.get("groups_traversed", 0),
            "headers": ["name", "fqdn", "ip", "operatingSystemVersion", "isManaged", "policy"],
            "rows": inventory_endpoints.get("items", []),
        },
    )


def reports_catalog_to_raw_event(reports: dict[str, Any]) -> RawEvent:
    return RawEvent(
        source_type="bitdefender",
        event_hint="integration_catalog",
        timestamp=datetime.now(timezone.utc),
        asset_context={
            "asset_id": "bitdefender-reports",
            "asset_name": "Bitdefender Report Catalog",
            "environment": "production",
            "criticality": 3,
            "source_file": "bitdefender-report-catalog",
            "integration": "bitdefender",
        },
        payload={
            "parser_profile": "bitdefender-reports",
            "target": "bitdefender-report-catalog",
            "row_count": len(reports.get("items", [])),
            "headers": ["id", "name", "type", "occurrence"],
            "rows": reports.get("items", []),
            "content": " ".join(str(item.get("name", "")) for item in reports.get("items", [])),
        },
    )


def parse_report_zip_bundle(bundle: bytes) -> dict[str, Any]:
    with zipfile.ZipFile(io.BytesIO(bundle)) as archive:
        names = archive.namelist()
        csv_name = next((name for name in names if name.lower().endswith(".csv")), None)
        pdf_name = next((name for name in names if name.lower().endswith(".pdf")), None)
        if not csv_name:
            raise ValueError("The downloaded Bitdefender report bundle does not contain a CSV file.")
        text = archive.read(csv_name).decode("utf-8-sig", errors="replace")
        reader = csv.DictReader(io.StringIO(text))
        rows = list(reader)
    headers = reader.fieldnames or []
    content_fragments: list[str] = []
    host_names: set[str] = set()
    malware_count = 0
    blocked_count = 0
    attack_count = 0
    for row in rows[:20]:
        content_fragments.append(" ".join(str(value) for value in row.values() if value))
    for row in rows:
        if not isinstance(row, dict):
            continue
        host = str(row.get("端点名称") or row.get("endpoint_name") or row.get("端点 FQDN") or "").strip()
        if host:
            host_names.add(host)
        event_type = str(row.get("事件类型") or row.get("event_type") or "")
        module = str(row.get("模块") or row.get("module") or "")
        if "恶意软件检测" in event_type or "反恶意软件" in module:
            malware_count += 1
        if "阻止的网站" in event_type or "反钓鱼" in module:
            blocked_count += 1
        if "网络攻击" in event_type or "网络攻击防护" in module:
            attack_count += 1
    return {
        "zip_entries": names,
        "csv_name": csv_name,
        "pdf_name": pdf_name,
        "headers": headers,
        "rows": rows,
        "row_count": len(rows),
        "unique_host_count": len(host_names),
        "unique_hosts": sorted(host_names),
        "malware_count": malware_count,
        "blocked_count": blocked_count,
        "attack_count": attack_count,
        "content": "\n".join(content_fragments),
    }


def latest_report_bundle_to_raw_event(report_meta: dict[str, Any], parsed_bundle: dict[str, Any]) -> RawEvent:
    report_name = str(report_meta.get("name") or "Bitdefender Latest Security Report")
    return RawEvent(
        source_type="endpoint",
        event_hint="endpoint_process",
        timestamp=datetime.now(timezone.utc),
        asset_context={
            "asset_id": str(report_meta.get("id") or "bitdefender-latest-report"),
            "asset_name": report_name,
            "environment": "production",
            "criticality": 4,
            "source_file": parsed_bundle.get("csv_name") or "bitdefender-latest-report.csv",
            "integration": "bitdefender",
        },
        payload={
            "parser_profile": "bitdefender-report-csv",
            "target": report_name,
            "report_name": report_name,
            "report_type": report_meta.get("type"),
            "occurrence": report_meta.get("occurrence"),
            "row_count": parsed_bundle.get("row_count", 0),
            "headers": parsed_bundle.get("headers", []),
            "rows": parsed_bundle.get("rows", []),
            "zip_entries": parsed_bundle.get("zip_entries", []),
            "content": parsed_bundle.get("content", ""),
        },
    )
