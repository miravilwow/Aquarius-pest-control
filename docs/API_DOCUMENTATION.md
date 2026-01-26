# API Documentation

## Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most admin endpoints require authentication via JWT token.

### Getting a Token
1. Login via `POST /api/auth/admin/login`
2. Store the returned token
3. Include in requests: `Authorization: Bearer <token>`

---

## Public Endpoints

### Services

#### Get All Services
```http
GET /api/services
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Ant Control",
    "description": "Effective ant elimination and prevention",
    "price": "150.00",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Service by ID
```http
GET /api/services/:id
```

**Parameters:**
- `id` (path) - Service ID

**Response:**
```json
{
  "id": 1,
  "name": "Ant Control",
  "description": "Effective ant elimination and prevention",
  "price": "150.00",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Bookings

#### Create Booking
```http
POST /api/bookings
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "address": "123 Main St, City",
  "service_id": 1,
  "preferred_date": "2024-02-15",
  "preferred_time": "10:00",
  "message": "Please call before arrival"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "09123456789",
  "address": "123 Main St, City",
  "service_id": 1,
  "preferred_date": "2024-02-15",
  "preferred_time": "10:00",
  "message": "Please call before arrival",
  "status": "pending",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

---

## Admin Endpoints (Requires Authentication)

### Authentication

#### Admin Login
```http
POST /api/auth/admin/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Bookings Management

#### Get All Bookings
```http
GET /api/admin/bookings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "address": "123 Main St",
    "service_id": 1,
    "service_name": "Ant Control",
    "preferred_date": "2024-02-15",
    "preferred_time": "10:00",
    "message": "Please call before arrival",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

#### Update Booking Status
```http
PUT /api/admin/bookings/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - Booking ID

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending`
- `confirmed`
- `completed`
- `cancelled`

**Response:**
```json
{
  "id": 1,
  "status": "confirmed",
  "message": "Booking status updated successfully"
}
```

---

### Services Management

#### Create Service
```http
POST /api/admin/services
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Termite Control",
  "description": "Professional termite treatment and prevention",
  "price": "300.00"
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Termite Control",
  "description": "Professional termite treatment and prevention",
  "price": "300.00",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

#### Update Service
```http
PUT /api/admin/services/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - Service ID

**Request Body:**
```json
{
  "name": "Termite Control Pro",
  "description": "Advanced termite treatment",
  "price": "350.00"
}
```

**Response:**
```json
{
  "id": 5,
  "name": "Termite Control Pro",
  "description": "Advanced termite treatment",
  "price": "350.00",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

#### Delete Service
```http
DELETE /api/admin/services/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id` (path) - Service ID

**Response:**
```json
{
  "message": "Service deleted successfully"
}
```

---

### Customers Management

#### Get All Customers
```http
GET /api/admin/customers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "address": "123 Main St",
    "total_bookings": 3
  }
]
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "detail": "Service name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "detail": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "detail": "Service with id 999 does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "detail": "Database connection failed"
}
```

---

## Notes

- All dates are in ISO 8601 format (YYYY-MM-DD)
- All prices are stored as DECIMAL(10,2) in the database
- JWT tokens expire after 24 hours (configurable)
- All timestamps are in UTC
