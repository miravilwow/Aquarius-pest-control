# Project Architecture

## Frontend CSS Organization

### CSS Structure
```
src/styles/
├── variables.css    # CSS variables (colors, spacing, breakpoints)
├── base.css         # Reset styles and base typography
├── components.css   # Reusable components (buttons, forms, cards, tables)
└── utilities.css    # Utility classes (spacing, text, display)
```

### How to Use
All CSS files are imported in `src/index.css`. Individual page CSS files can still be used for page-specific styles, but common styles should use the organized CSS files.

## Backend OOP Architecture

### Project Structure
```
server/
├── config/
│   └── db.js              # Database connection pool
├── models/                 # Data Access Layer (DAL)
│   ├── BaseModel.js        # Base model with common CRUD operations
│   ├── ServiceModel.js     # Service database operations
│   ├── BookingModel.js     # Booking database operations
│   ├── AdminModel.js       # Admin database operations
│   └── CustomerModel.js    # Customer database operations
├── services/               # Business Logic Layer
│   ├── ServiceService.js   # Service business logic
│   ├── BookingService.js   # Booking business logic
│   ├── AuthService.js      # Authentication logic
│   └── CustomerService.js  # Customer business logic
├── controllers/            # HTTP Request/Response Layer
│   ├── ServiceController.js
│   ├── BookingController.js
│   ├── AuthController.js
│   └── CustomerController.js
├── routes/                 # Route Definitions
│   ├── services.js
│   ├── bookings.js
│   ├── auth.js
│   └── admin.js
├── middleware/
│   └── auth.js             # Authentication middleware
└── index.js                # Application entry point
```

### Architecture Layers

#### 1. Models (Data Access Layer)
- **Purpose**: Handle all database operations
- **Inheritance**: All models extend `BaseModel`
- **Responsibilities**:
  - Database queries
  - Data validation
  - SQL operations

**Example:**
```javascript
const serviceModel = new ServiceModel(pool)
const services = await serviceModel.getAll()
```

#### 2. Services (Business Logic Layer)
- **Purpose**: Contains business logic and rules
- **Responsibilities**:
  - Business rules validation
  - Data transformation
  - Orchestrating model calls
  - Error handling

**Example:**
```javascript
const serviceService = new ServiceService(pool)
const service = await serviceService.createService(serviceData)
```

#### 3. Controllers (HTTP Layer)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Parse request data
  - Call appropriate services
  - Format responses
  - Handle HTTP status codes

**Example:**
```javascript
const serviceController = new ServiceController(pool)
router.get('/', serviceController.getAll)
```

#### 4. Routes
- **Purpose**: Define API endpoints
- **Responsibilities**:
  - Map URLs to controllers
  - Apply middleware
  - Define HTTP methods

### Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Reusability**: Models and services can be reused
3. **Testability**: Easy to test each layer independently
4. **Maintainability**: Changes in one layer don't affect others
5. **Scalability**: Easy to add new features

### Adding a New Feature

1. **Create Model** (if needed):
   ```javascript
   // server/models/NewModel.js
   export class NewModel extends BaseModel {
     constructor(pool) {
       super(pool, 'table_name')
     }
   }
   ```

2. **Create Service**:
   ```javascript
   // server/services/NewService.js
   export class NewService {
     constructor(pool) {
       this.newModel = new NewModel(pool)
     }
     
     async doSomething() {
       return await this.newModel.findAll()
     }
   }
   ```

3. **Create Controller**:
   ```javascript
   // server/controllers/NewController.js
   export class NewController {
     constructor(pool) {
       this.newService = new NewService(pool)
     }
     
     getAll = async (req, res) => {
       try {
         const data = await this.newService.doSomething()
         res.json(data)
       } catch (error) {
         res.status(500).json({ message: error.message })
       }
     }
   }
   ```

4. **Add Route**:
   ```javascript
   // server/routes/new.js
   import { NewController } from '../controllers/NewController.js'
   const controller = new NewController(pool)
   router.get('/', controller.getAll)
   ```

### Data Flow

```
HTTP Request
    ↓
Route (routes/)
    ↓
Middleware (if needed)
    ↓
Controller (controllers/)
    ↓
Service (services/)
    ↓
Model (models/)
    ↓
Database
```

### Example: Creating a Service

**Request Flow:**
1. Client sends POST to `/api/admin/services`
2. Route (`routes/admin.js`) receives request
3. Middleware (`authenticateToken`) verifies token
4. Controller (`ServiceController.create`) handles request
5. Service (`ServiceService.createService`) validates and processes
6. Model (`ServiceModel.createService`) executes database query
7. Response flows back through layers

This architecture ensures clean, maintainable, and scalable code!

