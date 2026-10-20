@echo off
:: reset-github.bat — thin wrapper that calls reset-github.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0reset-github.ps1"
pause
