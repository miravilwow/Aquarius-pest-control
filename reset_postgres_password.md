# How to Reset PostgreSQL Password

## Method 1: Reset Password via pg_hba.conf (Recommended if you forgot password)

### Step 1: Find pg_hba.conf file
The file is usually located at:
- `C:\Program Files\PostgreSQL\[version]\data\pg_hba.conf`
- Or search for "pg_hba.conf" in your PostgreSQL installation folder

### Step 2: Edit pg_hba.conf
1. Open the file as Administrator (Right-click → Run as Administrator)
2. Find the line that looks like:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
3. Change it to:
   ```
   host    all             all             127.0.0.1/32            trust
   ```
4. Save the file

### Step 3: Restart PostgreSQL Service
1. Open Services (Win + R, type `services.msc`)
2. Find "postgresql-x64-[version]" service
3. Right-click → Restart

### Step 4: Reset Password
Open Command Prompt or PowerShell and run:
```bash
psql -U postgres
```

You should now be able to connect without a password. Then run:
```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
```

Replace `your_new_password` with your desired password.

### Step 5: Restore pg_hba.conf
1. Change the line back to:
   ```
   host    all             all             127.0.0.1/32            scram-sha-256
   ```
2. Restart PostgreSQL service again

## Method 2: Using pgAdmin (If you have access)

1. Open pgAdmin
2. Connect to your server
3. Right-click on "Login/Group Roles" → "Create" → "Login/Group Role"
4. Or find existing "postgres" user → Right-click → "Properties"
5. Go to "Definition" tab
6. Enter new password
7. Click "Save"

## Method 3: Using Windows Authentication

If PostgreSQL was installed with Windows authentication:
```bash
psql -U postgres -d postgres
```

Then:
```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
```

