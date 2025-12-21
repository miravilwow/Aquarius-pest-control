@echo off
echo Testing PostgreSQL password...
echo.
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres -c "SELECT 'Password is correct!' as status;"
echo.
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Password works!
) else (
    echo ERROR: Password authentication failed
    echo.
    echo You may need to:
    echo 1. Reset the password again, OR
    echo 2. Check if pg_hba.conf was restored properly
)
pause

