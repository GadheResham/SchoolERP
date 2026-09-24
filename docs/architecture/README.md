# Architecture Documentation

This folder contains system design diagrams and architecture notes for SchoolERP.

## Contents

| File | Description |
|---|---|
| `system-overview.md` | High-level MERN architecture diagram |
| `frontend-architecture.md` | React component hierarchy and data flow |
| `backend-architecture.md` | Express layer diagram and request lifecycle |

## Key Architectural Decisions

See the root `decision.md` for all Architectural Decision Records (ADRs).

## Architecture Summary

```
Browser (React SPA)
      │
      │  HTTPS + JWT
      ▼
Express REST API  (/api/v1/*)
      │
      │  Mongoose ODM
      ▼
MongoDB Atlas
```

- Frontend and backend are **completely decoupled**.
- The only coupling point is the REST API contract.
- The frontend can be deployed to any static host independently of the backend.
