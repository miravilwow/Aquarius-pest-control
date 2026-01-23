@echo off
echo ========================================
echo   Starting Backend Server
echo ========================================
echo.
cd /d "C:\xampp\htdocs\Aquarius-pest-control"
echo Current directory: %CD%
echo.
echo Starting server on http://localhost:5000
echo Keep this window open!
echo.
npm run server
pause
