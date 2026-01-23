@echo off
echo ========================================
echo   Starting Frontend Server
echo ========================================
echo.
cd /d "C:\xampp\htdocs\Aquarius-pest-control"
echo Current directory: %CD%
echo.
echo Starting Vite dev server...
echo Keep this window open!
echo.
npm run dev
pause
