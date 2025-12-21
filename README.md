# Pest Control Management System

A full-stack web application for managing pest control services with a client-facing website and admin dashboard.

## Features

### Client View
- Home page with service overview
- Services listing
- Online booking system
- Contact page

### Admin Dashboard
- Admin authentication
- Dashboard with statistics
- Booking management
- Service management (CRUD)
- Customer management

## Tech Stack

- **Frontend**: React 18, React Router, Vite
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT

## Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

1. Open PostgreSQL (pgAdmin or psql)
2. Create a new database named `pest_control`:

```sql
CREATE DATABASE pest_control;
```

#### Configure Database Connection

1. Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```

2. Update `.env` with your PostgreSQL credentials:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pest_control
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key-change-this
PORT=5000
```

#### Initialize Database

Run the database initialization script:

```bash
node server/database/init.js
```

This will:
- Create all necessary tables
- Insert default admin user (username: `admin`, password: `admin123`)
- Insert default services

### 3. Start the Application

#### Start Backend Server

```bash
npm run server
```

The backend will run on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal and run:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

### Accessing the Application

1. **Client View**: Open `http://localhost:5173` in your browser
2. **Admin Dashboard**: Navigate to `http://localhost:5173/admin/login`
   - Username: `admin`
   - Password: `admin123`

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default admin password after first login!

## Project Structure

```
├── server/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── database/
│   │   ├── schema.sql         # Database schema
│   │   └── init.js            # Database initialization script
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── services.js        # Service routes
│   │   ├── bookings.js        # Booking routes
│   │   └── admin.js           # Admin routes
│   └── index.js               # Server entry point
├── src/
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── layouts/
│   │   ├── ClientLayout.jsx    # Client layout
│   │   └── AdminLayout.jsx     # Admin layout
│   ├── pages/
│   │   ├── client/            # Client-facing pages
│   │   └── admin/             # Admin pages
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── .env.example               # Environment variables template
└── package.json               # Dependencies

```

## API Endpoints

### Public Endpoints
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/bookings` - Create booking

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/admin/login` - Admin login
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/customers` - Get all customers
- `POST /api/admin/services` - Create service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

## Database Schema

### Tables
- **admins** - Admin users
- **services** - Pest control services
- **bookings** - Customer bookings

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env`
- Check if database `pest_control` exists

### Port Already in Use
- Change `PORT` in `.env` for backend
- Change port in `vite.config.js` for frontend

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and reinstall

## Development

### Running in Development Mode
- Frontend: `npm run dev` (with hot reload)
- Backend: `npm run server` (with nodemon if configured)

### Building for Production
```bash
npm run build
```

## Security Notes

- Change default admin password immediately
- Use strong JWT secret in production
- Never commit `.env` file
- Use environment variables for sensitive data

## License

MIT
