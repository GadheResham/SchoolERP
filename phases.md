# SchoolERP — Development Phases

## Overview
This document tracks the planned development phases for the SchoolERP MERN stack project.

---

## Phase 0 — Project Scaffold ✅
**Goal:** Set up the monorepo structure with a working React frontend and an empty Express backend.

| Task | Status |
|---|---|
| Create `frontend/` with existing React/Vite app | ✅ Done |
| Create `backend/` folder structure | ✅ Done |
| Write root documentation files | ✅ Done |
| Configure separate `package.json` files | ✅ Done |

---

## Phase 1 — Backend Foundation
**Goal:** Establish a working Express server connected to MongoDB with JWT authentication.

| Task | Status |
|---|---|
| Install backend dependencies (`npm install`) | ⬜ Pending |
| Configure MongoDB connection (`config/db.js`) | ⬜ Pending |
| Build `User` model with bcrypt password hashing | ⬜ Pending |
| Implement auth routes: `POST /api/v1/auth/login`, `/register` | ⬜ Pending |
| JWT sign/verify flow with `authenticate` middleware | ⬜ Pending |
| Standardised error handling and response helpers | ⬜ Pending |

---

## Phase 2 — Core Domain APIs
**Goal:** Build REST APIs for every domain the frontend already uses via mock services.

| Domain | Route Prefix | Status |
|---|---|---|
| Students | `/api/v1/students` | ⬜ Pending |
| Parents | `/api/v1/parents` | ⬜ Pending |
| Classes | `/api/v1/classes` | ⬜ Pending |
| Attendance | `/api/v1/attendance` | ⬜ Pending |
| Fee Structures | `/api/v1/fees/structures` | ⬜ Pending |
| Fee Collection | `/api/v1/fees/collection` | ⬜ Pending |
| Payments | `/api/v1/payments` | ⬜ Pending |
| Reports | `/api/v1/reports` | ⬜ Pending |
| Settings | `/api/v1/settings` | ⬜ Pending |

---

## Phase 3 — Frontend ↔ Backend Integration
**Goal:** Replace all mock service data in the frontend with real API calls.

| Task | Status |
|---|---|
| Set `VITE_API_URL` in `frontend/.env` | ⬜ Pending |
| Update `frontend/src/services/api.js` with axios base config | ⬜ Pending |
| Replace each `mockData` call with the real service function | ⬜ Pending |
| Wire auth flow: login → JWT → localStorage → axios interceptor | ⬜ Pending |
| Handle loading and error states in all pages | ⬜ Pending |

---

## Phase 4 — Testing
**Goal:** Add automated test coverage for the backend.

| Task | Status |
|---|---|
| Unit tests for services and repositories | ⬜ Pending |
| Integration tests for all API routes | ⬜ Pending |
| Set up CI pipeline (GitHub Actions) | ⬜ Pending |

---

## Phase 5 — Deployment
**Goal:** Deploy the application to a production environment.

| Task | Status |
|---|---|
| Containerise backend with Docker | ⬜ Pending |
| Deploy frontend to Vercel / Netlify | ⬜ Pending |
| Deploy backend to Render / Railway / EC2 | ⬜ Pending |
| Set up MongoDB Atlas production cluster | ⬜ Pending |
| Configure environment variables in production | ⬜ Pending |
| Set up domain and HTTPS | ⬜ Pending |
