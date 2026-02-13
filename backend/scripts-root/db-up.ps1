param(
  [string]$ContainerName = 'app-db',
  [string]$Image = 'postgres:16-alpine',
  [int]$HostPort = 5435
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Resolve-Path (Join-Path $ScriptDir '..')

$occupiedBy = docker ps -q -f "publish=$HostPort"
if ($occupiedBy) {
  $ownRunning = docker ps -q -f "name=^$ContainerName$" -f "publish=$HostPort"
  if (-not $ownRunning) {
    throw "Port $HostPort is already used by another running container. Use another port, e.g. npm run db:docker:up:win -- -HostPort 5436"
  }
}

$running = docker ps -q -f "name=^$ContainerName$"
if ($running) {
  Write-Host "PostgreSQL container already running: $ContainerName"
}
else {
  $existing = docker ps -aq -f "name=^$ContainerName$"
  if ($existing) {
    docker start $ContainerName | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to start container $ContainerName (port $HostPort might be busy)."
    }
  }
  else {
    docker run -d `
      --name $ContainerName `
      -e POSTGRES_USER=postgres `
      -e POSTGRES_PASSWORD=postgres `
      -e POSTGRES_DB=postgres `
      -p "${HostPort}:5432" `
      -v app_db_pgdata:/var/lib/postgresql/data `
      $Image | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to run container $ContainerName on port $HostPort."
    }
  }
}

Write-Host 'Waiting for PostgreSQL to become ready...'
$ready = $false
for ($i = 0; $i -lt 40; $i++) {
  docker exec $ContainerName pg_isready -U postgres *> $null
  if ($LASTEXITCODE -eq 0) {
    $ready = $true
    break
  }
  Start-Sleep -Seconds 1
}

if (-not $ready) {
  throw 'PostgreSQL did not become ready in time.'
}

Push-Location $BackendDir
try {
  $env:API_DB_PORT = "$HostPort"
  npm run db:create
}
finally {
  Pop-Location
  Remove-Item Env:API_DB_PORT -ErrorAction SilentlyContinue
}

Write-Host 'Database reset flow complete (drop -> create -> grant).'
