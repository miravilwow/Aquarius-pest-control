# Developer Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Styling](#styling)
7. [API Integration](#api-integration)
8. [Environment Variables](#environment-variables)
9. [Database Setup](#database-setup)
10. [Deployment](#deployment)

---

## Project Structure

```
Aquarius-pest-control/
├── server/                    # Backend code
│   ├── config/               # Configuration files
│   ├── controllers/         # Request handlers
│   ├── database/            # Database scripts
│   ├── middleware/          # Express middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── index.js             # Server entry point
│
├── src/                      # Frontend code
│   ├── components/          # Reusable components
│   ├── context/             # React context
│   ├── layouts/             # Page layouts
│   ├── pages/               # Page components
│   ├── styles/              # Global styles
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
│
├── docs/                     # Documentation
└── package.json              # Dependencies
```

---

## Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL v12+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp server/.env.template server/.env
# Edit server/.env with your database credentials
```

3. **Set up database**
```bash
node server/database/setup-tables.js
```

4. **Start development servers**
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run dev
```

---

## Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **UI Library**: Shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Password Hashing**: bcryptjs

---

## Component Architecture

### Component Types

1. **Pages** - Top-level route components
2. **Layouts** - Wrapper components
3. **UI Components** - Reusable Shadcn components
4. **Context Providers** - Global state

### Performance Patterns

- Use `React.memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for event handlers
- Lazy load routes with `React.lazy()`

---

## State Management

- **Local State**: `useState` for component state
- **Context API**: `AuthContext` for authentication
- **Derived State**: `useMemo` for computed values

---

## Styling

- **Tailwind CSS**: Utility classes
- **CSS Modules**: Component-specific styles
- **CSS Variables**: Theme colors
- **Dark Mode**: Toggle via `ThemeToggle`

---

## API Integration

Use Axios for API calls:
```jsx
const response = await axios.get('/api/services')
```

With authentication:
```jsx
const token = localStorage.getItem('adminToken')
axios.get('/api/admin/bookings', {
  headers: { Authorization: `Bearer ${token}` }
})
```

---

## Environment Variables

### Backend (server/.env)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pest_control
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

---

## Database Setup

See `server/database/schema.sql` for schema.

**Setup Script:**
```bash
node server/database/setup-tables.js
```

---

## Deployment

### Frontend
```bash
npm run build
# Deploy dist/ folder
```

### Backend
```bash
# Set NODE_ENV=production
npm run server
# Or use PM2
pm2 start server/index.js
```

---

## Code Style

- Use functional components
- Use hooks (useState, useEffect, useMemo, useCallback)
- Use const/let (no var)
- Use template literals
- PascalCase for components
- camelCase for utilities

---

## Performance Best Practices

1. Lazy load routes
2. Memoize expensive components
3. Debounce search inputs
4. Code splitting

---

## Resources

- [React Documentation](https://react.dev)
- [Shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
