@echo off
title HK Portfolio - Real-Time GitHub Auto-Push Watcher
cd /d "%~dp0"

echo ========================================================
echo   Himanshu Kumar Portfolio - Real-Time GitHub Watcher
echo ========================================================
echo.
echo Starting PowerShell Watcher script...
echo (Changes you make will automatically sync and push to GitHub)
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\watch-and-push.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Watcher stopped with code %ERRORLEVEL%.
    pause
)
