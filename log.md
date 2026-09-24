# SchoolERP — Project Activity Log

> Append a new entry for every significant action: structural changes, decisions, integrations, deployments.  
> Format: `[YYYY-MM-DD] [TYPE] Description`

Types: `STRUCT` · `FEAT` · `FIX` · `REFACTOR` · `DOCS` · `DEPLOY` · `CONFIG`

---

## Log Entries

---

### [2026-09-24] [STRUCT] Project restructured into MERN monorepo

- Existing React/Vite frontend moved from root into `frontend/`.
- New `backend/` scaffold created with Express + Mongoose architecture.
- `frontend/package.json` name updated to `schoolerp-frontend`.
- `backend/package.json` created with all backend dependencies listed.
- Root documentation files created: `phases.md`, `memory.md`, `rules.md`, `decision.md`, `log.md`.
- `docs/` folder created with subdirectories: `api/`, `architecture/`, `database/`, `deployment/`.
- Separate `.gitignore` files created for root, frontend, and backend.
- Separate `.env.example` files created for frontend and backend.

**Performed by:** Kiro AI  
**Phase:** Phase 0 — Scaffold

---

<!-- Add new entries above this line in descending date order -->
