#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT="${PORT:-8010}"

if command -v python3.13 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3.13)"
elif command -v python3.12 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3.12)"
else
  PYTHON_BIN="$(command -v python3)"
fi

if [ ! -d "${ROOT_DIR}/.venv" ]; then
  "$PYTHON_BIN" -m venv "${ROOT_DIR}/.venv"
fi

"${ROOT_DIR}/.venv/bin/pip" install -r "${ROOT_DIR}/requirements.txt"
exec "${ROOT_DIR}/.venv/bin/python" -m uvicorn app.main:app --host 127.0.0.1 --port "$PORT"
