# SchoolERP — Backend

Express 4 REST API with MongoDB (Mongoose) and JWT authentication.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Folder Responsibilities](#folder-responsibilities)
3. [Request Lifecycle](#request-lifecycle)
4. [Middleware Flow](#middleware-flow)
5. [JWT Authentication Flow](#jwt-authentication-flow)
6. [Error Handling Strategy](#error-handling-strategy)
7. [Environment Variables](#environment-variables)
8. [API Conventions](#api-conventions)
9. [Development Commands](#development-commands)

---

## Architecture

The backend follows a strict three-layer architecture separated by responsibility:

```
HTTP Request
  └── Express Router
        └── Middleware (helmet, cors, morgan, auth, validate)
              └── Controller   ← parses req, calls service, sends res
                    └── Service      ← business logic, orchestration
                          └── Repository   ← Mongoose queries only
                                └── MongoDB (via Mongoose)
```

This layering ensures:
- Controllers stay thin and easy to test.
- Business logic in services is framework-agnostic.
- Database access is isolated in repositories and can be swapped without touching services.

---

## Folder Responsibilities

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          # Mongoose connection setup
│   │   └── env.js         # Centralised env variable access
│   ├── controllers/       # One file per domain, handles HTTP req/res
│   ├── middleware/
│   │   ├── auth.js        # JWT authenticate() + authorize() factories
│   │   ├── errorHandler.js# Global 4-arg error middleware
│   │   ├── notFound.js    # 404 catch-all
│   │   └── validate.js    # Joi schema validation factory
│   ├── models/            # Mongoose schema + model definitions
│   ├── repositories/      # All database queries (Mongoose calls only)
│   ├── routes/
│   │   └── index.js       # Mounts all domain routers under /api/v1
│   ├── services/          # Business logic, calls repositories
│   ├── validators/        # Joi schemas per domain
│   ├── utils/
│   │   ├── AppError.js    # Custom operational error class
│   │   ├── asyncHandler.js# Wraps async route handlers for error forwarding
│   │   └── response.js    # Standardised JSON response helpers
│   ├── constants/
│   │   ├── roles.js       # ROLES enum (admin, teacher, staff)
│   │   └── httpStatus.js  # HTTP status code constants
│   ├── docs/              # OpenAPI / API documentation
│   └── app.js             # Express app factory (no listen call)
├── server.js              # Entry point: connects DB, starts server
├── package.json
├── .env.example
└── .gitignore
```

---

## Request Lifecycle

1. **`server.js`** starts the process, connects to MongoDB, then calls `app.listen()`.
2. **Global middleware** runs on every request: `helmet` → `cors` → `json parser` → `morgan`.
3. **Router** (`src/routes/index.js`) matches the URL prefix and delegates to a domain router.
4. **Domain middleware** (if any): `authenticate`, `authorize`, `validate`.
5. **Controller** function receives `(req, res, next)`, reads inputs, calls a service method.
6. **Service** executes business logic, calls one or more repository methods.
7. **Repository** runs the Mongoose query and returns plain data.
8. **Controller** receives the result and calls `sendSuccess()` or `sendCreated()`.
9. On any thrown error, `asyncHandler` forwards it to **`errorHandler`** middleware, which sends a JSON error response.

---

## Middleware Flow

```
Request
  → helmet()          (security headers)
  → cors()            (cross-origin policy)
  → express.json()    (body parsing)
  → morgan()          (request logging, dev only)
  → /health           (health check, unauthenticated)
  → /api/v1/*
      → authenticate()    (verify JWT, attach req.user)
      → authorize(role)   (check req.user.role)
      → validate(schema)  (Joi body validation)
      → controller handler
  → notFound()        (catch unmatched routes → 404)
  → errorHandler()    (catch all errors → JSON response)
```

---

## JWT Authentication Flow

```
POST /api/v1/auth/login
  → validate credentials (email + password)
  → look up User by email (UserRepository)
  → compare password with bcrypt.compare()
  → on success: jwt.sign({ id, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  → return { token, user }

Subsequent protected requests:
  → client sends: Authorization: Bearer <token>
  → authenticate() middleware calls jwt.verify(token, JWT_SECRET)
  → decoded payload ({ id, role }) attached to req.user
  → controller proceeds
```

Token expiry defaults to `7d`. Refresh token strategy is a Phase 4 enhancement.

---

## Error Handling Strategy

All errors flow through `src/middleware/errorHandler.js`.

### Throwing Operational Errors
Use `AppError` anywhere in the codebase:
```js
import { AppError } from '../utils/AppError.js';
throw new AppError('Student not found', 404);
```

### Async Route Handlers
Wrap every async controller with `asyncHandler` to avoid unhandled promise rejections:
```js
import { asyncHandler } from '../utils/asyncHandler.js';
router.get('/:id', asyncHandler(StudentController.getById));
```

### Error Response Shape
```json
{
  "success": false,
  "message": "Student not found",
  "stack": "..."   // only in development
}
```

### HTTP Status Conventions
| Scenario | Status |
|---|---|
| Success | 200 |
| Created | 201 |
| No content (delete) | 204 |
| Validation failed | 422 |
| Unauthorised (no/invalid token) | 401 |
| Forbidden (wrong role) | 403 |
| Resource not found | 404 |
| Server error | 500 |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/schoolerp
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Access via `src/config/env.js` — never read `process.env` directly in application code.

---

## API Conventions

- Base path: `/api/v1`
- All responses are JSON with the shape:
  ```json
  { "success": true, "message": "...", "data": { ... } }
  ```
- Resource identifiers use MongoDB `_id` (string).
- Dates are ISO 8601 strings.
- Pagination uses `?page=1&limit=20` query parameters.
- Filtering uses query params matching field names: `?classId=xxx&status=active`.

### Naming
| Element | Convention |
|---|---|
| Route files | `src/routes/<domain>.js` (plural noun) |
| Controller files | `src/controllers/<Domain>Controller.js` |
| Service files | `src/services/<Domain>Service.js` |
| Repository files | `src/repositories/<Domain>Repository.js` |
| Model files | `src/models/<Domain>.js` (singular) |
| Validator files | `src/validators/<domain>.validator.js` |

---

## Development Commands

> Run these from inside the `backend/` directory.

```bash
# Install dependencies
npm install

# Start development server with hot-reload (http://localhost:5000)
npm run dev

# Start production server
npm start

# Lint source files
npm run lint
```
