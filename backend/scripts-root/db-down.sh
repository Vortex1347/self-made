#!/usr/bin/env bash
set -e
CONTAINER=app-db
if docker ps -q -f name=^${CONTAINER}$ | grep -q .; then
  docker stop "$CONTAINER"
fi
if docker ps -aq -f name=^${CONTAINER}$ | grep -q .; then
  docker rm "$CONTAINER"
fi
echo "PostgreSQL container removed: $CONTAINER"
