$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"
$backendPython = Join-Path $backend "venv\Scripts\python.exe"
$backendActivate = Join-Path $backend "venv\Scripts\Activate.ps1"

if (!(Test-Path (Join-Path $frontend ".env"))) {
    Copy-Item (Join-Path $frontend ".env.example") (Join-Path $frontend ".env")
}

if (!(Test-Path (Join-Path $backend ".env"))) {
    Copy-Item (Join-Path $backend ".env.example") (Join-Path $backend ".env")
}

if (!(Test-Path $backendPython)) {
    py -m venv (Join-Path $backend "venv")
}

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "cd '$backend'; . '$backendActivate'; pip install -r requirements.txt; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
)

Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-Command",
    "cd '$frontend'; npm install; npm run dev"
)

Write-Host "Started backend and frontend in separate terminals."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend docs: http://localhost:8000/docs"
