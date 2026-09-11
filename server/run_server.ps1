Set-Location -Path $PSScriptRoot
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
& ".\venv\Scripts\Activate.ps1"
Write-Host "Starting MediKiosk Backend Server on http://localhost:8000 ..." -ForegroundColor Green
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
