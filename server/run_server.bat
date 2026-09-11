@echo off
cd /d "%~dp0"
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Starting MediKiosk Backend Server on http://localhost:8000 ...
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
