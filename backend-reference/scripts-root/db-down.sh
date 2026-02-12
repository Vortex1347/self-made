#!/usr/bin/env bash
set -e
CONTAINER=elite-schmuck-db
docker stop "$CONTAINER" 2>/dev/null || true
echo "PostgreSQL stopped."
