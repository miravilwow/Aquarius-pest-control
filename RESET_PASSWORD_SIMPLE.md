# Simple PostgreSQL Password Reset Guide

## Quick Method (Step by Step)

### Step 1: Open pg_hba.conf file
1. Navigate to: `C:\Program Files\PostgreSQL\18\data\`
2. Find file: `pg_hba.conf`
3. Right-click → Open with Notepad (as Administrator)

### Step 2: Modify authentication
Find these lines (around line 90-95):
```
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

Change `scram-sha-256` to `trust`:
```
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
```

Save the file.

### Step 3: Restart PostgreSQL
1. Press `Win + R`, type `services.msc`, press Enter
2. Find "postgresql-x64-18"
3. Right-click → Restart

### Step 4: Reset Password
Open PowerShell or Command Prompt and run:
```powershell
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d postgres
```

Then type this SQL command (replace `your_new_password` with your desired password):
```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
```

Press Enter, then type `\q` to exit.

### Step 5: Restore Security
1. Open `pg_hba.conf` again
2. Change `trust` back to `scram-sha-256`
3. Save the file
4. Restart PostgreSQL service again

### Step 6: Update .env file
Open your `.env` file and update:
```
DB_PASSWORD=your_new_password
```

## Alternative: Use the PowerShell Script

Run this in PowerShell (as Administrator):
```powershell
.\reset_postgres_password.ps1
```

The script will guide you through the process automatically.

