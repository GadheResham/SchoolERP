# SchoolERP — Decision Log

> Record every significant architectural or technical decision here.  
> Format: Date · Title · Context · Decision · Rationale · Alternatives Considered

---

## [2026-09-24] Monorepo with Manual Separation

**Context:**  
The project started as a single Vite/React app. As it grows into a full MERN stack, a clear separation between frontend and backend is needed.

**Decision:**  
Use a single Git repository with `frontend/` and `backend/` as separate sub-projects, each with their own `package.json`.

**Rationale:**  
- Keeps the entire project in one repository for easier cross-cutting changes and documentation.
- Separate `package.json` files keep dependency trees isolated.
- Simpler than a Turborepo/Nx monorepo for a team of this size.

**Alternatives Considered:**  
- Two separate repositories — rejected because it complicates coordination during integration.
- Turborepo — rejected as overkill for the current team size.

---

## [2026-09-24] Express with ES Modules (`"type": "module"`)

**Context:**  
Node.js supports both CommonJS and ES Modules. The frontend already uses ESM.

**Decision:**  
Use `"type": "module"` in `backend/package.json` so both frontend and backend use ESM `import/export` syntax.

**Rationale:**  
- Consistent syntax across the entire codebase.
- ES Modules are the modern standard.
- No need for Babel transpilation.

**Alternatives Considered:**  
- CommonJS (`require`) — rejected to avoid mixed syntax across the monorepo.

---

## [2026-09-24] Joi for Request Validation

**Context:**  
Input validation is required before any data reaches the service layer.

**Decision:**  
Use [Joi](https://joi.dev/) for schema-based validation in the `validators/` layer.

**Rationale:**  
- Mature, well-documented library.
- Works well with the existing Express middleware pattern.
- Easy to compose and reuse schemas.

**Alternatives Considered:**  
- Zod — considered but Joi is more familiar to the team and has no TS dependency.
- express-validator — rejected for being more verbose than schema-based approaches.

---

## [2026-09-24] Controller → Service → Repository Pattern

**Context:**  
Need a scalable architecture that separates HTTP concerns from business logic and data access.

**Decision:**  
Adopt a three-layer architecture:
- **Controller** — parses request, calls service, sends response.
- **Service** — business logic, orchestration.
- **Repository** — all Mongoose queries, data access only.

**Rationale:**  
- Controllers stay thin and testable.
- Business logic in services is framework-agnostic.
- Repositories can be swapped (e.g., different database) without touching services.

**Alternatives Considered:**  
- Fat controllers — rejected as untestable and hard to maintain.
- Active Record pattern — rejected because Mongoose models already act as DAOs.

---

## [2026-09-24] React Context API for State Management

**Context:**  
The frontend needs shared state for authentication and toast notifications.

**Decision:**  
Use React Context API with custom hooks. No Redux or Zustand.

**Rationale:**  
- The app has a small, well-defined shared-state surface (auth + toasts).
- Context API is built into React — no extra dependency.
- Easy to replace with Zustand later if complexity grows.

**Alternatives Considered:**  
- Redux Toolkit — rejected as overkill for the current state complexity.
- Zustand — noted as a future option if Context becomes a bottleneck.
