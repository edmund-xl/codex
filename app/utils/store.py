from __future__ import annotations

import json
from pathlib import Path
from typing import Any


DATA_DIR = Path(__file__).resolve().parents[2] / "data"
EVENTS_FILE = DATA_DIR / "events.json"
RAW_EVENTS_FILE = DATA_DIR / "raw_events.json"
REPORTS_FILE = DATA_DIR / "reports.json"
INVESTIGATIONS_FILE = DATA_DIR / "investigations.json"
MEMORY_RULES_FILE = DATA_DIR / "memory_rules.json"
MEMORY_FEEDBACK_FILE = DATA_DIR / "memory_feedback.json"


def ensure_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def read_json(path: Path) -> list[dict[str, Any]]:
    ensure_dir()
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []


def write_json(path: Path, payload: list[dict[str, Any]]) -> None:
    ensure_dir()
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


class JsonFileStore:
    def append(self, path: Path, record: dict[str, Any], limit: int = 200) -> None:
        data = read_json(path)
        data.insert(0, record)
        write_json(path, data[:limit])

    def list_records(self, path: Path, limit: int = 50) -> list[dict[str, Any]]:
        return read_json(path)[:limit]
