@echo off
setlocal
cd /d "%~dp0"
set PORT=8000
start "" "http://localhost:%PORT%/"
where py >nul 2>nul
if %errorlevel%==0 (
  py serve.py %PORT%
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python serve.py %PORT%
  goto :eof
)
echo Python is required to start the local HTTP server.
echo Install Python or run another static server in this folder.
pause
