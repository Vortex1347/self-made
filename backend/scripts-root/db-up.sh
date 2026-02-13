#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CONTAINER="${DB_CONTAINER_NAME:-app-db}"
IMAGE="${DB_IMAGE:-postgres:16-alpine}"
HOST_PORT="${DB_HOST_PORT:-5435}"

occupied_by="$(docker ps -q -f "publish=${HOST_PORT}")"
if [[ -n "$occupied_by" ]]; then
  own_running="$(docker ps -q -f "name=^${CONTAINER}$" -f "publish=${HOST_PORT}")"
  if [[ -z "$own_running" ]]; then
    echo "Port ${HOST_PORT} is already used by another running container."
    echo "Free this port or run with another one, e.g.: DB_HOST_PORT=5436 npm run db:docker:up:mac"
    exit 1
  fi
fi

if docker ps -q -f "name=^${CONTAINER}$" | grep -q .; then
  on_wanted_port="$(docker ps -q -f "name=^${CONTAINER}$" -f "publish=${HOST_PORT}")"
  if [[ -z "$on_wanted_port" ]]; then
    echo "Container $CONTAINER is running but on a different port (expected ${HOST_PORT})."
    echo "Recreate it with: docker stop $CONTAINER && docker rm $CONTAINER && npm run db:docker:up:mac"
    exit 1
  fi
  echo "PostgreSQL container already running: $CONTAINER"
else
  if docker ps -aq -f "name=^${CONTAINER}$" | grep -q .; then
    if ! docker start "$CONTAINER" >/dev/null; then
      echo "Failed to start container $CONTAINER (port ${HOST_PORT} might be busy)."
      exit 1
    fi
  else
    if ! docker run -d \
      --name "$CONTAINER" \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=postgres \
      -p "${HOST_PORT}:5432" \
      -v app_db_pgdata:/var/lib/postgresql/data \
      "$IMAGE" >/dev/null; then
      echo "Failed to run container $CONTAINER on port ${HOST_PORT}."
      exit 1
    fi
  fi
fi

echo "Waiting for PostgreSQL to become ready..."
for _ in {1..40}; do
  if docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then
  echo "PostgreSQL did not become ready in time."
  exit 1
fi

(cd "$BACKEND_DIR" && API_DB_PORT="$HOST_PORT" npm run db:create)
echo "Database reset flow complete (drop -> create -> grant)."
