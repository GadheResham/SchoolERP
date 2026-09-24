# SchoolERP — Frontend

React 19 + Vite 8 + Tailwind CSS v4 single-page application for school administration.

---

## Table of Contents
1. [Architecture](#architecture)
2. [Folder Structure](#folder-structure)
3. [State Management](#state-management)
4. [API Service Layer](#api-service-layer)
5. [Route Structure](#route-structure)
6. [Environment Variables](#environment-variables)
7. [Development Commands](#development-commands)

---

## Architecture

The frontend is a client-side React SPA. It communicates with the backend exclusively through a service layer — no component ever calls an API directly. All routing is client-side via React Router v7. Authentication state is held in React Context and persisted to `localStorage`.

```
Browser
  └── React SPA (Vite dev server / static build)
        ├── React Router v7  ← client-side routing
        ├── Context API       ← auth + toast state
        ├── Pages             ← route-level components
        ├── Components        ← reusable UI primitives
        └── Services          ← all data access (API calls / mock)
```

---

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI: Button, Input, Modal, Select, etc.
│   │   └── layout/          # AppLayout, Header, Sidebar, ProtectedRoute
│   ├── context/
│   │   ├── AuthContext.jsx  # Auth state: user, login(), logout()
│   │   └── ToastContext.jsx # Global toast notifications
│   ├── pages/
│   │   ├── auth/            # Login page
│   │   ├── dashboard/       # Dashboard KPIs
│   │   ├── students/        # Students CRUD (list, add, edit, details)
│   │   ├── parents/         # Parent records
│   │   ├── classes/         # Academic classes
│   │   ├── attendance/      # Daily attendance + history
│   │   ├── fees/            # Fee structure, collection, pending
│   │   ├── payments/        # Payment history
│   │   ├── reports/         # Institutional reports
│   │   └── settings/        # School settings
│   ├── routes/
│   │   └── AppRoutes.jsx    # Central route manifest
│   ├── services/
│   │   ├── api.js           # Axios instance + interceptors
│   │   ├── mockData.js      # Temporary mock data (replaced in Phase 3)
│   │   ├── studentService.js
│   │   ├── parentService.js
│   │   ├── classService.js
│   │   ├── attendanceService.js
│   │   ├── feeService.js
│   │   ├── paymentService.js
│   │   ├── reportService.js
│   │   ├── settingsService.js
│   │   └── authService.js
│   ├── utils/
│   │   └── formatters.js    # Date, currency, string helpers
│   ├── App.tsx              # Root component — providers + router
│   ├── main.tsx             # ReactDOM.createRoot entry point
│   └── index.css            # Tailwind base styles
├── index.html               # HTML shell
├── vite.config.ts           # Vite + Tailwind plugin config
├── tsconfig.json            # TypeScript compiler options
├── package.json
└── .env.example
```

---

## State Management

The app uses the **React Context API** exclusively. No external state library is needed at this scale.

| Context | File | Purpose |
|---|---|---|
| `AuthContext` | `src/context/AuthContext.jsx` | Current user, login/logout, token storage |
| `ToastContext` | `src/context/ToastContext.jsx` | Show/dismiss global toast messages |

### Auth Flow
1. User submits login form → `authService.login()` is called.
2. On success the JWT and user object are stored in `localStorage`.
3. `AuthContext` reads `localStorage` on mount to rehydrate the session.
4. `ProtectedRoute` checks `AuthContext` before rendering any private page.
5. The axios instance in `api.js` reads the token from `localStorage` and attaches it as `Authorization: Bearer <token>` on every request.

---

## API Service Layer

### Rules
- **Never call `axios` directly from a component or page.** Always go through a named service function.
- Each service file owns one domain (students, fees, attendance, etc.).
- `src/services/api.js` exports the shared axios instance. All service files import from it.
- During Phase 0–2 the services return mock data from `mockData.js`. In Phase 3 they will hit the real backend.

### Adding a New Service
```js
// src/services/exampleService.js
import api from './api.js';

export const exampleService = {
  getAll:    ()     => api.get('/examples'),
  getById:   (id)   => api.get(`/examples/${id}`),
  create:    (data) => api.post('/examples', data),
  update:    (id, data) => api.put(`/examples/${id}`, data),
  remove:    (id)   => api.delete(`/examples/${id}`),
};
```

---

## Route Structure

All routes are defined in `src/routes/AppRoutes.jsx`.

| Path | Component | Access |
|---|---|---|
| `/login` | `Login` | Public |
| `/` | → redirect to `/dashboard` | Protected |
| `/dashboard` | `Dashboard` | Protected |
| `/students` | `Students` | Protected |
| `/students/new` | `AddStudent` | Protected |
| `/students/:id` | `StudentDetails` | Protected |
| `/students/edit/:id` | `EditStudent` | Protected |
| `/parents` | `Parents` | Protected |
| `/classes` | `Classes` | Protected |
| `/attendance` | `Attendance` | Protected |
| `/attendance/history` | `AttendanceHistory` | Protected |
| `/fees` | `FeeStructure` | Protected |
| `/fees/collection` | `FeeCollection` | Protected |
| `/fees/pending` | `PendingFees` | Protected |
| `/payments` | `PaymentHistory` | Protected |
| `/reports` | `Reports` | Protected |
| `/settings` | `Settings` | Protected |
| `*` | → redirect to `/dashboard` | Protected |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values.

```env
VITE_API_URL=http://localhost:5000/api/v1
```

All variables must be prefixed with `VITE_` to be exposed to the browser by Vite.

Access in code: `import.meta.env.VITE_API_URL`

---

## Development Commands

> Run these from inside the `frontend/` directory.

```bash
# Install dependencies
npm install        # or: bun install

# Start development server (http://localhost:3000)
npm run dev        # or: bun dev

# Type-check (no emit)
npm run lint

# Production build → dist/
npm run build

# Preview production build locally
npm run preview
```
