# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:
- Download from: https://www.postgresql.org/download/
- Install and remember your postgres user password

### 2. Create Database

Open PostgreSQL (pgAdmin or command line) and run:

```sql
CREATE DATABASE pest_control;
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Configure Environment

1. Create `.env` file in the root directory:

```bash
copy .env.example .env
```

2. Edit `.env` and update with your PostgreSQL credentials:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pest_control
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=my-secret-key-12345
PORT=5000
```

### 5. Initialize Database

```bash
node server/database/init.js
```

This creates tables and inserts default data.

### 6. Start Backend Server

```bash
npm run server
```

You should see: "Server is running on http://localhost:5000"

### 7. Start Frontend (New Terminal)

```bash
npm run dev
```

You should see: "Local: http://localhost:5173"

### 8. Access the Application

- **Client Website**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
  - Username: `admin`
  - Password: `admin123`

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database `pest_control` exists

### "Port 5000 already in use"
- Change `PORT=5000` to another port in `.env`
- Update API URLs in frontend if needed

### "Module not found"
- Run `npm install` again
- Check Node.js version (should be v20+)

## Next Steps

1. Change admin password after first login
2. Add your services through admin dashboard
3. Test booking flow from client view

