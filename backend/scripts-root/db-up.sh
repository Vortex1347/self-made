#!/usr/bin/env bash
set -e
CONTAINER=app-db
IMAGE=postgres:16-alpine

if docker ps -q -f name=^${CONTAINER}$ | grep -q .; then
  echo "PostgreSQL already running (container: $CONTAINER)."
  exit 0
fi

if docker ps -aq -f name=^${CONTAINER}$ | grep -q .; then
  docker start "$CONTAINER"
else
  docker run -d \
    --name "$CONTAINER" \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=app_db \
    -p 5433:5432 \
    -v app_db_pgdata:/var/lib/postgresql/data \
    "$IMAGE"
fi

echo "PostgreSQL is ready on localhost:5433"
