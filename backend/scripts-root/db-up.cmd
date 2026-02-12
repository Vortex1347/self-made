@echo off
set CONTAINER=app-db
for /f %%i in ('docker ps -q -f name=^%CONTAINER%^$') do set RUNNING=%%i
if not "%RUNNING%"=="" (
  echo PostgreSQL already running (%CONTAINER%).
  exit /b 0
)
for /f %%i in ('docker ps -aq -f name=^%CONTAINER%^$') do set EXISTING=%%i
if not "%EXISTING%"=="" (
  docker start %CONTAINER% >nul
) else (
  docker run -d --name %CONTAINER% -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=app_db -p 5433:5432 -v app_db_pgdata:/var/lib/postgresql/data postgres:16-alpine >nul
)
echo PostgreSQL is ready on localhost:5433
