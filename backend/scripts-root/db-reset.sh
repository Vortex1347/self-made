#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

(cd "$BACKEND_DIR" && bash scripts-root/db-up.sh)
(cd "$BACKEND_DIR" && npm run migration:run)

echo "DB reset complete: docker up + drop/create/grant + migrations."
