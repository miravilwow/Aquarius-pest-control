# How to Start Backend Server

## Quick Start

### Option 1: Using Batch File (Easiest)
```powershell
.\start_backend.bat
```

### Option 2: Using npm
```powershell
npm run server
```

### Option 3: Direct Node Command
```powershell
cd server
node index.js
```

## Prerequisites

### 1. PostgreSQL Database Must Be Running
- Make sure PostgreSQL service is running
- Check in Services (services.msc) or Task Manager

### 2. Database Setup
- Database name: `pest_control`
- Create database if it doesn't exist:
  ```sql
  CREATE DATABASE pest_control;
  ```

### 3. Environment Variables (.env file)
Create a `.env` file in the root directory with:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pest_control
DB_USER=postgres
DB_PASSWORD=your_password_here

# Server Configuration
PORT=5000

# JWT Secret (for authentication)
JWT_SECRET=your-secret-key-change-this-in-production
```

## Troubleshooting

### Error: "Cannot connect to database"
1. Check if PostgreSQL is running
2. Verify database credentials in `.env`
3. Make sure database `pest_control` exists

### Error: "Port 5000 already in use"
1. Find process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Kill the process or change PORT in `.env`

### Error: "Route.post() requires a callback function"
- This should be fixed now. If you still see it, restart the server.

## Success Indicators

When server starts successfully, you should see:
```
🚀 Server is running on http://localhost:5000
✅ Connected to PostgreSQL database
   Database: pest_control
   Server time: [current time]
```

## Testing

After starting, test the server:
1. Open browser: http://localhost:5000/api/health
2. Should see: `{"status":"OK","message":"Server is running"}`

## Notes

- Keep the terminal window open while server is running
- Press `Ctrl+C` to stop the server
- Frontend will work with fallback services if backend is not running
- Backend is required for:
  - Admin login
  - Saving bookings to database
  - Managing services/customers





