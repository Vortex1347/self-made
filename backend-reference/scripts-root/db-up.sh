#!/usr/bin/env bash
set -e
CONTAINER=elite-schmuck-db
IMAGE=postgres:16-alpine

if docker ps -q -f name=^${CONTAINER}$ | grep -q .; then
  echo "PostgreSQL already running (container: $CONTAINER)."
  exit 0
fi

if docker ps -aq -f name=^${CONTAINER}$ | grep -q .; then
  echo "Starting existing container..."
  docker start "$CONTAINER"
else
  echo "Creating and starting PostgreSQL..."
  docker run -d \
    --name "$CONTAINER" \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=elite_schmuck \
    -p 5433:5432 \
    -v elite_schmuck_pgdata:/var/lib/postgresql/data \
    "$IMAGE"
fi

echo "Waiting for Postgres..."
for i in {1..30}; do
  if docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
docker exec "$CONTAINER" pg_isready -U postgres >/dev/null 2>&1 || { echo "Timeout waiting for PostgreSQL." >&2; exit 1; }

# Создать БД если нет (нужно если контейнер создавали без POSTGRES_DB)
docker exec "$CONTAINER" psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='elite_schmuck'" | grep -q 1 || \
  docker exec "$CONTAINER" psql -U postgres -c "CREATE DATABASE elite_schmuck;"

echo "PostgreSQL is ready (localhost:5433, db: elite_schmuck)."
