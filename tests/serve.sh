#!/usr/bin/env bash
set -euo pipefail
PORT="${1:-8765}"
cd "$(dirname "$0")/.."
echo "Chi ha ragione? su http://localhost:${PORT}/index.html"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
