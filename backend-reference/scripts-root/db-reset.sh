#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

echo "Dropping and recreating database..."
node backend/scripts/reset-db.js

echo "Running migrations..."
cd backend && npm run migration:run

echo "Done. Database reset and migrations applied."
