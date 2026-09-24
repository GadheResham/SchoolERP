# SchoolERP

> A full-stack, production-ready School Management System built on the MERN stack.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)](https://mongodb.com)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org)

---

## Overview

SchoolERP is a comprehensive school administration platform for managing students, parents, academic classes, daily attendance, fee collection, payments, and institutional reporting — all from a single, intuitive interface.

The project is structured as a **MERN monorepo** with fully independent `frontend/` and `backend/` sub-projects.

---

## MERN Architecture

```
┌─────────────────────────────────────────────────┐
│                    Client Browser                │
│          React 19 + Vite + Tailwind CSS          │
└──────────────────────┬──────────────────────────┘
                       │  HTTP / REST (JSON)
                       │  Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────┐
│               Express 4 REST API                 │
│   Helmet · CORS · Morgan · JWT · Joi · Mongoose  │
│                                                  │
│   Router → Controller → Service → Repository    │
└──────────────────────┬──────────────────────────┘
                       │  Mongoose ODM
┌──────────────────────▼──────────────────────────┐
│                   MongoDB Atlas                  │
│    Collections: users · students · parents       │
│    classes · attendance · fees · payments        │
└─────────────────────────────────────────────────┘
```

---

## Folder Structure

```
schoolerp/
├── frontend/                 ← React/Vite SPA (completed)
│   ├── src/
│   │   ├── components/       ← common/ and layout/ UI components
│   │   ├── context/          ← AuthContext, ToastContext
│   │   ├── pages/            ← one folder per route domain
│   │   ├── routes/           ← AppRoutes.jsx (central route manifest)
│   │   ├── services/         ← API service layer (one file per domain)
│   │   └── utils/            ← formatters and helpers
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                  ← Express REST API (scaffold ready)
│   ├── src/
│   │   ├── config/           ← DB connection, env config
│   │   ├── controllers/      ← HTTP request/response handlers
│   │   ├── middleware/       ← auth, validation, error handling
│   │   ├── models/           ← Mongoose schemas
│   │   ├── repositories/     ← database queries
│   │   ├── routes/           ← Express routers
│   │   ├── services/         ← business logic
│   │   ├── validators/       ← Joi schemas
│   │   ├── utils/            ← AppError, asyncHandler, response helpers
│   │   ├── constants/        ← roles, HTTP status codes
│   │   └── app.js            ← Express app factory
│   ├── server.js             ← entry point
│   └── package.json
│
├── docs/
│   ├── api/                  ← OpenAPI / endpoint docs
│   ├── architecture/         ← system design diagrams
│   ├── database/             ← ERD and schema docs
│   └── deployment/           ← deployment guides
│
├── phases.md                 ← development roadmap
├── memory.md                 ← project context and key facts
├── rules.md                  ← contribution rules
├── decision.md               ← architectural decision records
└── log.md                    ← activity log
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 19 |
| Build tool | Vite | 8 |
| Styling | Tailwind CSS | 4 |
| Frontend routing | React Router DOM | 7 |
| Icons | Lucide React | latest |
| Animations | Motion | latest |
| HTTP client | Axios | 1 |
| Backend framework | Express | 4 |
| Database | MongoDB | 8 |
| ODM | Mongoose | 8 |
| Authentication | JSON Web Token | 9 |
| Validation | Joi | 17 |
| Security | Helmet | 7 |
| Language (frontend) | TypeScript | 7 |
| Language (backend) | JavaScript ESM | Node 18+ |

---

## Installation

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org))
- MongoDB Atlas account or local MongoDB instance
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/your-org/schoolerp.git
cd schoolerp
```

### 2. Set up the frontend
```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_URL
npm install        # or: bun install
```

### 3. Set up the backend
```bash
cd ../backend
cp .env.example .env
# Edit .env — set MONGODB_URI, JWT_SECRET, etc.
npm install
```

---

## Running the Application

### Frontend (development)
```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### Backend (development)
```bash
cd backend
npm run dev
# → http://localhost:5000
# → Health check: http://localhost:5000/health
```

Run both simultaneously in separate terminal tabs.

---

## Deployment Overview

| Layer | Recommended Platform |
|---|---|
| Frontend | Vercel / Netlify (static build) |
| Backend | Render / Railway / AWS EC2 |
| Database | MongoDB Atlas |

### Frontend build
```bash
cd frontend
npm run build
# Outputs to frontend/dist/ — deploy this folder
```

### Backend production start
```bash
cd backend
NODE_ENV=production npm start
```

Set all required environment variables in your hosting provider's dashboard. Never commit `.env` files.

---

## Development Phases

| Phase | Description | Status |
|---|---|---|
| 0 | Project scaffold + monorepo structure | ✅ Complete |
| 1 | Backend foundation (auth, DB connection) | ⬜ Pending |
| 2 | Core domain REST APIs | ⬜ Pending |
| 3 | Frontend ↔ backend integration | ⬜ Pending |
| 4 | Testing + CI | ⬜ Pending |
| 5 | Deployment | ⬜ Pending |

See `phases.md` for full details.

---

## Documentation

| File | Purpose |
|---|---|
| `phases.md` | Development roadmap |
| `memory.md` | Project context and key facts |
| `rules.md` | Contribution and coding rules |
| `decision.md` | Architectural Decision Records (ADRs) |
| `log.md` | Activity log |
| `frontend/README.md` | Frontend architecture guide |
| `backend/README.md` | Backend architecture guide |
| `docs/` | API docs, ERD, diagrams |

---

## Contributors

| Name | Role |
|---|---|
| — | Lead Developer |

---

## License

MIT
"# SchoolERP" 
