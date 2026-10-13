@echo off
setlocal
title JobFlow
cd /d "%~dp0"

echo Starting JobFlow (database + app)...
docker compose up -d --build
if errorlevel 1 (
  echo.
  echo Failed to start JobFlow. See the output above.
  pause
  exit /b 1
)

echo Waiting for JobFlow to be ready...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='http://localhost:3000'; $ok=$false; for($i=0;$i -lt 120;$i++){ try{ if((Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 3).StatusCode -eq 200){ $ok=$true; break } }catch{}; Start-Sleep -Seconds 1 }; if($ok){ exit 0 } else { exit 1 }"
if errorlevel 1 (
  echo.
  echo JobFlow did not respond in time. Check with: docker compose logs app
  pause
  exit /b 1
)

echo Opening JobFlow. Close the browser window to stop everything.
powershell -NoProfile -ExecutionPolicy Bypass -Command "$p=Join-Path $env:LOCALAPPDATA 'JobFlow\browser-profile'; New-Item -ItemType Directory -Force -Path $p | Out-Null; $b=@('C:\Program Files\Google\Chrome\Application\chrome.exe','C:\Program Files (x86)\Google\Chrome\Application\chrome.exe','C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe','C:\Program Files\Microsoft\Edge\Application\msedge.exe') | Where-Object { Test-Path $_ } | Select-Object -First 1; if(-not $b){ exit 2 }; Start-Process -FilePath $b -ArgumentList @('--app=http://localhost:3000',('--user-data-dir='+$p),'--no-first-run','--no-default-browser-check','--disable-background-mode','--window-size=1280,860'); $n=[IO.Path]::GetFileName($b); $found=$false; for($i=0;$i -lt 30;$i++){ $c=@(Get-CimInstance Win32_Process | Where-Object { $_.Name -eq $n -and $_.CommandLine -like ('*'+$p+'*') }); if($c.Count -gt 0){ $found=$true; break }; Start-Sleep -Seconds 1 }; if($found){ while($true){ $c=@(Get-CimInstance Win32_Process | Where-Object { $_.Name -eq $n -and $_.CommandLine -like ('*'+$p+'*') }); if($c.Count -eq 0){ break }; Start-Sleep -Seconds 2 } }; exit 0"

if errorlevel 2 (
  echo.
  echo Could not find Chrome or Edge. JobFlow is still running at http://localhost:3000
  pause
  exit /b 1
)

echo Closing down JobFlow...
docker compose down
echo.
echo JobFlow stopped. Your database data was kept.
endlocal
