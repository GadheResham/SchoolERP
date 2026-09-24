# SchoolERP — Project Rules

> These rules govern how the project is developed, reviewed, and maintained.  
> All contributors must follow them. Update via a pull request with a brief justification.

---

## 1. Repository Rules

- `main` branch is **production-protected** — no direct pushes.
- All work goes on a feature branch: `feature/<domain>/<description>`.
- Pull requests require at least one review before merging.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

---

## 2. Frontend Rules

- Do **not** modify UI components without a design decision logged in `decision.md`.
- All new pages must be added to `src/routes/AppRoutes.jsx` and the sidebar.
- Never import directly from `mockData.js` in new code — use the service layer.
- Keep components under 200 lines; extract sub-components when they grow.
- Tailwind classes only — no inline styles, no CSS modules.
- All forms must use controlled components with proper validation.

---

## 3. Backend Rules

- All route handlers must use `asyncHandler()` — no bare `async` functions on routes.
- Never access `process.env` directly — use `config` from `src/config/env.js`.
- Every new domain needs: model → repository → service → controller → route → validator.
- Controllers must not contain business logic — delegate to services.
- Services must not contain database queries — delegate to repositories.
- All responses must use the helpers in `src/utils/response.js`.
- Passwords must never be returned in API responses — exclude `passwordHash` in all queries.

---

## 4. Database Rules

- Every Mongoose model must include `timestamps: true`.
- Index fields that are frequently queried (e.g., `admissionNo`, `email`).
- Never use `.findOne()` without a specific field — always be explicit.
- Soft-delete preferred over hard-delete for student and parent records.

---

## 5. Security Rules

- JWT secrets must be at least 32 characters in production.
- All authenticated routes must use the `authenticate` middleware.
- Never log JWT tokens or passwords anywhere.
- `helmet()` and `cors()` must remain active in production.
- All user input must be validated with Joi before reaching the service layer.

---

## 6. Documentation Rules

- Update `memory.md` whenever the architecture changes.
- Log every architectural decision in `decision.md` with a date and rationale.
- Log every significant action in `log.md`.
- API changes must be reflected in `backend/src/docs/`.
