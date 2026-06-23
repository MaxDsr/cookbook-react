# Decisions

Append-only log. Never delete entries; supersede with new dated entries if needed.

Entries below are reverse-engineered from git history during the 2026-06-18 retrofit.
Dates are approximate (from commit dates). Entries marked ASSUMED could not be
confirmed from code/history alone.

---

## 2023-06-20 — Split frontend/backend, containerize

Separated the original single React app into `frontend/` and `backend/`, introduced
Docker Compose, and scaffolded an Express + TypeScript backend backed by MongoDB.

- Why (OBSERVED): move off the in-memory pseudo-API toward real persistence.

## 2024-02-21 — Auth0 for authentication

Adopted Auth0 (JWT bearer, `express-oauth2-jwt-bearer`) instead of building custom
auth/session handling.

- Why (ASSUMED): offload auth/session security to a managed provider rather than
  rolling password storage, reset flows, etc.

## 2025-09-01 — MinIO for image storage

Adopted MinIO (S3-compatible object storage) for recipe images instead of in-memory
or local-disk storage.

## 2025-11 — Caddy as the production reverse proxy

Introduced Caddy in front of frontend/backend/MinIO in production, with subdomain
routing for MinIO. Reportedly included a fix for MinIO presigned URLs being blocked
when accessed cross-origin from the frontend's domain — exact mechanism not recorded
anywhere and needs rediscovery (see PLAN.md P8).

## ~2024-2025 (ASSUMED) — Frontend dropped MUI, Formik/Yup, and Lodash

`frontend/package.json` no longer lists Material UI, Formik, Yup, or Lodash, despite
the (now-stale) root README documenting them. Components now pair plain `.css` files
with `.jsx`. No single commit/rationale was found for this migration — confirm with
user if details matter later.

## 2026-06-18 — Adopted the CLAUDE.md phased delivery system

Added `CLAUDE.md` defining a 6-file (README/CLAUDE/PLAN/DECISIONS/KNOWN_ISSUES/
SESSION_LOG) phased project-memory system. This retrofit session created the
remaining files to match.

## 2026-06-18 — Project purpose confirmed: portfolio piece

Confirmed with user: this is a learning/portfolio project for recruiters and
hiring teams, not a production product for end users. A recipe manager where each
user creates/edits/deletes their own recipes with images, scoped per-user via Auth0.

## 2026-06-23 — Seed script user id is parameterized

`backend/scripts/seedRecipes.ts` now resolves the target user id from (in order):
a CLI arg (`npm run seed-recipes -- <id>` or `-- --userId <id>`), the
`SEED_USER_ID` env var, then a default constant (the owner's known Auth0 id).
The id is validated as a 24-char hex string; an invalid id exits non-zero before
any DB connection.

- Why: the id was previously a bare hardcoded literal. Keeping a default preserves
  the convenient `npm run seed-recipes` flow for the owner, while the arg/env
  override removes the rigidity so recipes can be seeded for any account. Approved
  by user during P7.

## 2026-06-18 — Anti-decisions (explicitly OUT of scope for now)

- Rotating env credentials in `backend/.env` / `prod.env` — confirmed dummy/dev-only
  values, not live secrets, so not a current priority.
- Reviving the dead production VM — investigation of the MinIO/Caddy presigned-URL
  fix should happen from code/config, not by restoring the old VM.

## 2026-06-23 — Backend auth hardening (P7.5), targeted over root-cause

Closed the DELETE auth bypass and the JWT-handler fall-through (see KNOWN_ISSUES):
- Every mutating/reading recipe route now runs `checkJwtAuth` (added it to
  `DELETE /recipes/delete/:id`, which previously had none).
- `handleJwtAuthError` now fails closed — always responds, never `next()`s into the
  controller — and normalizes auth failures to 401 (403 preserved for insufficient
  scope).
- Deleted the leftover `/api/test` debug route (also removed an embedded expired
  sample JWT from a comment in `checkJwtAuth.ts`).

- Why targeted, not root-cause: `getUserId` still derives `req.userId` from an
  unverified `jwt-decode`, but after this change every route that reads `req.userId`
  runs `auth()` first, so the unverified decode is fully shadowed by signature
  verification — the vulnerability is closed. The deeper fix (derive `req.userId`
  from the verified `req.auth.payload.sub`) is defense-in-depth against a future
  un-gated route and was deferred to P10 to keep this change minimal. Approved by
  user during P7.5.
