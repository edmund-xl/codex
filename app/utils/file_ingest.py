from __future__ import annotations

import csv
import io
import json
from pathlib import Path
from typing import Any

from pypdf import PdfReader

from app.models.event import RawEvent


def _safe_decode(data: bytes) -> str:
    for encoding in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def extract_pdf_text(data: bytes) -> str:
    reader = PdfReader(io.BytesIO(data))
    pages = [(page.extract_text() or "").strip() for page in reader.pages]
    text = "\n\n".join(part for part in pages if part)
    if not text:
        raise ValueError("PDF 已上传，但没有提取到可分析文本。")
    return text


def infer_source_type(filename: str, content: str) -> str:
    lower_name = filename.lower()
    lower_content = content.lower()
    if any(token in lower_name for token in ("incident", "edr", "endpoint")) or any(token in lower_content for token in ("attack.localfileinclusion", "endpoint", "shellspawned", "credentialtheft")):
        return "endpoint"
    if any(token in lower_name for token in ("riskanalytics", "baseline", "hardening", "audit")) or any(token in lower_content for token in ("发现名称", "风险评分", "auditd", "aide", "ssh 访问未受限制")):
        return "host"
    if any(token in lower_name for token in ("cloud", "iam", "bucket")) or any(token in lower_content for token in ("cloudtrail", "security group", "public bucket")):
        return "cloud"
    if any(token in lower_name for token in ("github", "pr", "commit")) or "pull_request" in lower_content:
        return "github"
    if any(token in lower_name for token in ("nmap", "asset", "tls")) or any(token in lower_content for token in ("port", "certificate", "subdomain")):
        return "easm"
    if "kms" in lower_name or "sign" in lower_content:
        return "kms"
    return "github"


def parse_file_to_raw_event(filename: str, data: bytes) -> RawEvent:
    suffix = Path(filename).suffix.lower()
    if suffix == ".pdf" or data.startswith(b"%PDF-"):
        content = extract_pdf_text(data)
        payload = {"content": content, "parser_profile": "pdf-text", "filename": filename}
        source_type = infer_source_type(filename, content)
    elif suffix == ".json":
        content = _safe_decode(data)
        try:
            payload = json.loads(content)
            if not isinstance(payload, dict):
                payload = {"content": content}
        except json.JSONDecodeError:
            payload = {"content": content}
        payload["parser_profile"] = "json"
        payload["filename"] = filename
        source_type = infer_source_type(filename, content)
    elif suffix == ".csv":
        content = _safe_decode(data)
        reader = csv.DictReader(io.StringIO(content))
        rows = [dict(row) for row in reader]
        payload = {
            "headers": list(reader.fieldnames or []),
            "rows": rows[:50],
            "row_count": len(rows),
            "parser_profile": "csv-tabular",
            "filename": filename,
        }
        source_type = infer_source_type(filename, content)
    else:
        content = _safe_decode(data)
        payload = {"content": content, "parser_profile": "text", "filename": filename}
        source_type = infer_source_type(filename, content)
    stem = Path(filename).stem
    return RawEvent(
        source_type=source_type,
        asset_context={
            "asset_id": stem,
            "asset_name": stem,
            "environment": "unknown",
            "criticality": 3,
            "source_file": filename,
            "source_type": source_type,
        },
        payload=payload,
    )
