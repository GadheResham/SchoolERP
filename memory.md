# SchoolERP — Project Memory

> This file serves as the persistent memory of the project.  
> Update it whenever an important architectural decision, discovery, or context shift occurs.

---

## Project Identity
| Key | Value |
|---|---|
| Project Name | SchoolERP |
| Type | School Management System |
| Stack | MongoDB · Express · React · Node.js (MERN) |
| Frontend Framework | React 19 + Vite 8 + Tailwind CSS v4 |
| Backend Framework | Express 4 |
| Language | TypeScript (frontend) · JavaScript ESM (backend) |
| Package Manager | Bun (frontend) · npm (backend) |
| Current Phase | Phase 0 — Scaffold Complete |

---

## Monorepo Structure
```
schoolerp(1)/          ← root (git repo)
├── frontend/          ← React/Vite app (completed)
├── backend/           ← Express API (scaffold only)
└── docs/              ← Architecture & deployment docs
```

---

## Frontend — Key Facts
- Built with React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite` plugin).
- All routing is client-side via `react-router-dom` v7.
- State management: React Context API (`AuthContext`, `ToastContext`).
- All API calls currently use **mock data** in `src/services/mockData.js`.
- Service layer is separated per domain (e.g., `studentService.js`, `feeService.js`).
- `@/*` path alias resolves to `frontend/` root via `vite.config.ts`.
- Entry point: `frontend/index.html` → `frontend/src/main.tsx`.

---

## Backend — Key Facts
- Express 4 with ES Modules (`"type": "module"`).
- MongoDB via Mongoose 8.
- JWT authentication with `jsonwebtoken`.
- Validation with Joi.
- Follows a **Controller → Service → Repository** layered architecture.
- All error handling flows through `src/middleware/errorHandler.js`.
- API prefix: `/api/v1`.

---

## Domain Model (from frontend mock data)
| Entity | Key Fields |
|---|---|
| Student | name, admissionNo, class, section, parentId, status |
| Parent | name, email, phone, studentIds |
| Class | name, section, teacherId, capacity |
| Attendance | studentId, classId, date, status |
| FeeStructure | name, amount, classId, dueDate, type |
| FeeCollection | studentId, feeStructureId, paidAmount, date |
| Payment | studentId, amount, method, receiptNo, date |
| User | name, email, passwordHash, role |

---

## Environment Variables
See `frontend/.env.example` and `backend/.env.example`.

---

## Important Decisions
See `decision.md` for all architectural decisions and their rationale.
