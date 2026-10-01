@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo   Himanshu Kumar Portfolio - One-Click Git Auto-Push
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking changed files...
git status --short

set /p MSG="Commit message (Press Enter for auto timestamp): "
if "%MSG%"=="" (
    set MSG=feat(portfolio): update portfolio %date% %time%
)

echo.
echo [2/3] Adding and committing files...
git add -A
git commit -m "%MSG%"

echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS: Portfolio pushed to GitHub!
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   WARNING: Push failed. Check your internet/credentials.
    echo ========================================================
)

echo.
timeout /t 5
