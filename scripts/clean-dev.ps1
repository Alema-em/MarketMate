# Stops stale Next.js dev servers and clears .next (fixes EPERM / port-in-use).
$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $PSScriptRoot
$linkPath = Join-Path $projectRoot ".next"
$externalCache = Join-Path $env:LOCALAPPDATA "MarketMate\.next"

foreach ($port in 3000, 3001) {
  Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object {
      Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 1

if (Test-Path $linkPath) {
  $item = Get-Item -LiteralPath $linkPath -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    cmd /c rmdir "$linkPath"
  } else {
    Remove-Item -LiteralPath $linkPath -Recurse -Force
  }
}

if (Test-Path $externalCache) {
  Remove-Item -LiteralPath $externalCache -Recurse -Force
}

Write-Host "Ready. Run a single dev server with: npm run dev"
