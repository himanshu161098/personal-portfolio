@echo off
title Prachi AI Backend Server
echo ========================================================
echo   Starting Prachi AI Backend Server (Port 3001)...
echo   Health Check: http://localhost:3001/health
echo ========================================================
cd /d "%~dp0"
call npm --prefix backend run dev
pause
