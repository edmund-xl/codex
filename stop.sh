#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8010}"
lsof -ti tcp:"$PORT" | xargs -r kill -9
