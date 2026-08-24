param(
  [Parameter(Position = 0)]
  [ValidateSet('start', 'stop', 'status')]
  [string]$Action = 'status'
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$pgCtl = Join-Path $projectRoot '.local\postgres\pgsql\bin\pg_ctl.exe'
$pgIsReady = Join-Path $projectRoot '.local\postgres\pgsql\bin\pg_isready.exe'
$dataDirectory = Join-Path $projectRoot '.local\pgdata'
$logFile = Join-Path $projectRoot '.local\postgres.log'

if (-not (Test-Path -LiteralPath $pgCtl) -or -not (Test-Path -LiteralPath $dataDirectory)) {
  Write-Error 'The project-local PostgreSQL installation is missing.'
  exit 1
}

switch ($Action) {
  'start' {
    & $pgIsReady -h '127.0.0.1' -p '5432' -d 'aurastore' -U 'aurastore' *> $null
    if ($LASTEXITCODE -eq 0) { Write-Output 'AuraStore PostgreSQL is already running.'; exit 0 }
    & $pgCtl -D $dataDirectory -l $logFile -o '-p 5432 -h 127.0.0.1' -w start
  }
  'stop' { & $pgCtl -D $dataDirectory -m fast -w stop }
  'status' { & $pgIsReady -h '127.0.0.1' -p '5432' -d 'aurastore' -U 'aurastore' }
}

exit $LASTEXITCODE
