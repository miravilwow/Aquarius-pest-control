# PostgreSQL Password Reset Script
# This script will help you reset your PostgreSQL password

Write-Host "=== PostgreSQL Password Reset ===" -ForegroundColor Cyan
Write-Host ""

# PostgreSQL installation path
$pgPath = "C:\Program Files\PostgreSQL\18"
$pgDataPath = "$pgPath\data"
$pgHbaPath = "$pgDataPath\pg_hba.conf"
$psqlPath = "$pgPath\bin\psql.exe"

# Check if files exist
if (-not (Test-Path $pgHbaPath)) {
    Write-Host "Error: Could not find pg_hba.conf at $pgHbaPath" -ForegroundColor Red
    Write-Host "Please check your PostgreSQL installation path." -ForegroundColor Yellow
    exit
}

Write-Host "Step 1: Backing up pg_hba.conf..." -ForegroundColor Yellow
Copy-Item $pgHbaPath "$pgHbaPath.backup" -Force
Write-Host "Backup created: $pgHbaPath.backup" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Modifying pg_hba.conf to allow passwordless login..." -ForegroundColor Yellow

# Read the file
$content = Get-Content $pgHbaPath

# Replace scram-sha-256 with trust for localhost connections
$newContent = $content | ForEach-Object {
    if ($_ -match "host\s+all\s+all\s+127\.0\.0\.1/32\s+scram-sha-256") {
        $_ -replace "scram-sha-256", "trust"
    } elseif ($_ -match "host\s+all\s+all\s+::1/128\s+scram-sha-256") {
        $_ -replace "scram-sha-256", "trust"
    } else {
        $_
    }
}

# Write the modified content
$newContent | Set-Content $pgHbaPath
Write-Host "pg_hba.conf modified successfully" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Restarting PostgreSQL service..." -ForegroundColor Yellow
Restart-Service postgresql-x64-18 -Force
Start-Sleep -Seconds 3
Write-Host "PostgreSQL service restarted" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Ready to reset password!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your NEW PostgreSQL password:" -ForegroundColor Yellow
$newPassword = Read-Host "New Password" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

Write-Host ""
Write-Host "Resetting password..." -ForegroundColor Yellow

# Reset password using psql
$env:PGPASSWORD = ""
& $psqlPath -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD '$passwordPlain';"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Password reset successfully!" -ForegroundColor Green
} else {
    Write-Host "Error resetting password. Trying alternative method..." -ForegroundColor Red
    Write-Host "Please run this command manually:" -ForegroundColor Yellow
    Write-Host "& '$psqlPath' -U postgres -d postgres -c `"ALTER USER postgres WITH PASSWORD '$passwordPlain';`"" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Step 5: Restoring pg_hba.conf security..." -ForegroundColor Yellow

# Restore original file
$originalContent = Get-Content "$pgHbaPath.backup"
$restoredContent = $originalContent | ForEach-Object {
    if ($_ -match "host\s+all\s+all\s+127\.0\.0\.1/32\s+trust") {
        $_ -replace "trust", "scram-sha-256"
    } elseif ($_ -match "host\s+all\s+all\s+::1/128\s+trust") {
        $_ -replace "trust", "scram-sha-256"
    } else {
        $_
    }
}

$restoredContent | Set-Content $pgHbaPath
Write-Host "pg_hba.conf restored" -ForegroundColor Green

Write-Host ""
Write-Host "Step 6: Restarting PostgreSQL service again..." -ForegroundColor Yellow
Restart-Service postgresql-x64-18 -Force
Write-Host "PostgreSQL service restarted" -ForegroundColor Green

Write-Host ""
Write-Host "=== Password Reset Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Your new PostgreSQL password is: $passwordPlain" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Update your .env file with this password:" -ForegroundColor Yellow
Write-Host "DB_PASSWORD=$passwordPlain" -ForegroundColor White
Write-Host ""

