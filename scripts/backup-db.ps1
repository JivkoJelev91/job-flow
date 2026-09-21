<#
  Backs up the local PostgreSQL database (from DATABASE_URL in .env) to the
  backups/ folder as a timestamped pg_dump custom-format archive.

  Usage:
    powershell -NoProfile -ExecutionPolicy Bypass -File scripts/backup-db.ps1 [-Keep 14]
#>
param(
  [int]$Keep = 14
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"
if (-not (Test-Path $envFile)) {
  throw ".env not found at $envFile"
}

$url = Get-Content $envFile |
  Where-Object { $_ -match '^DATABASE_URL=' } |
  ForEach-Object { $_ -replace '^DATABASE_URL=', '' } |
  ForEach-Object { $_.Trim().Trim('"').Trim("'") } |
  Select-Object -First 1

if (-not $url) {
  throw "DATABASE_URL not set in .env"
}

$match = [regex]::Match(
  $url,
  '^postgres(?:ql)?://(?:([^:@/]+):([^@]*))?@([^:/]+)(?::(\d+))?/([^?]+)'
)
if (-not $match.Success) {
  throw "Could not parse DATABASE_URL"
}

$dbUser   = if ($match.Groups[1].Value) { $match.Groups[1].Value } else { "postgres" }
$dbPass   = [Uri]::UnescapeDataString($match.Groups[2].Value)
$dbHost   = $match.Groups[3].Value
$dbPort   = if ($match.Groups[4].Value) { $match.Groups[4].Value } else { "5432" }
$dbName   = $match.Groups[5].Value

$pgDump = Get-ChildItem "C:\Program Files\PostgreSQL\*\bin\pg_dump.exe" -ErrorAction SilentlyContinue |
  Sort-Object FullName -Descending |
  Select-Object -First 1 -ExpandProperty FullName

if (-not $pgDump) {
  $command = Get-Command pg_dump -ErrorAction SilentlyContinue
  if (-not $command) {
    throw "pg_dump.exe not found. Install PostgreSQL or add it to PATH."
  }
  $pgDump = $command.Source
}

$backupDir = Join-Path $root "backups"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$out = Join-Path $backupDir "jobflow-$stamp.dump"

$env:PGPASSWORD = $dbPass
& $pgDump -h $dbHost -p $dbPort -U $dbUser -Fc -f $out $dbName
if ($LASTEXITCODE -ne 0) {
  throw "pg_dump failed with exit code $LASTEXITCODE"
}

$cutoff = (Get-Date).AddDays(-$Keep)
$removed = Get-ChildItem $backupDir -Filter "jobflow-*.dump" |
  Where-Object { $_.LastWriteTime -lt $cutoff }
$removed | Remove-Item -Force

Write-Host "Backup created: $out"
if ($removed) {
  Write-Host "Removed $($removed.Count) backup(s) older than $Keep days."
}