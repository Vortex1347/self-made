param(
  [string]$ContainerName = 'app-db'
)

$running = docker ps -q -f "name=^$ContainerName$"
if ($running) {
  Write-Host "PostgreSQL already running ($ContainerName)."
  exit 0
}

$existing = docker ps -aq -f "name=^$ContainerName$"
if ($existing) {
  docker start $ContainerName | Out-Null
}
else {
  docker run -d `
    --name $ContainerName `
    -e POSTGRES_USER=postgres `
    -e POSTGRES_PASSWORD=postgres `
    -e POSTGRES_DB=app_db `
    -p 5433:5432 `
    -v app_db_pgdata:/var/lib/postgresql/data `
    postgres:16-alpine | Out-Null
}

Write-Host "PostgreSQL is ready on localhost:5433"
