@echo off
echo ========================================
echo PostgreSQL Password Reset Tool
echo ========================================
echo.
echo This will connect to PostgreSQL and let you reset the password.
echo.
echo IMPORTANT: Make sure you have already:
echo   1. Modified pg_hba.conf (changed scram-sha-256 to trust)
echo   2. Restarted PostgreSQL service
echo.
pause
echo.
echo Connecting to PostgreSQL...
echo.
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres
echo.
echo ========================================
echo If you see an error, make sure:
echo   1. PostgreSQL service is running
echo   2. pg_hba.conf has been modified (trust instead of scram-sha-256)
echo   3. PostgreSQL service has been restarted
echo ========================================
pause

