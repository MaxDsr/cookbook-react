# Plan

Phased roadmap. Status: [TODO] / [IN PROGRESS] / [DONE date] / [BLOCKED reason].

Only ONE phase is [IN PROGRESS] at a time.

Phases P1-P6 are reconstructed from git history (OBSERVED). Phases P7-P12 reflect
the user's stated near-term priorities (ASSUMED ordering — confirm before committing).

---

## P1: Skeleton [DONE ~2021-11]

In-memory React app: hardcoded recipes, pseudo-API with promises, no real backend.
MUI + Formik/Yup for the create/edit recipe dialog.

---

## P2: Backend split & containerization [DONE ~2023-06]

- Split single React app into `frontend/` and `backend/`
- Scaffolded Express + TypeScript backend, connected to MongoDB via Mongoose
- Containerized both apps with Docker Compose

---

## P3: Auth0 integration [DONE ~2024-02]

- Added Auth0 to frontend (login/logout, user context)
- Backend routes protected with JWT bearer middleware (`express-oauth2-jwt-bearer`)

---

## P4: Per-user recipes [DONE ~2024-05]

- Added `User` model, recorded users on first login
- Recipes scoped to the logged-in Auth0 user id (`getUserId` middleware)

---

## P5: MinIO image storage [DONE ~2025-09]

- Replaced in-memory/local image handling with MinIO (S3-compatible) storage
- Added upload middleware (Multer) and `minioUrl` helper

---

## P6: Production deployment attempt [DONE ~2025-11-13]

- Added Caddy as a reverse proxy in front of frontend/backend/MinIO
- Added prod docker-compose, env var mapping files (root/back-end), MinIO subdomain
- Reportedly fixed a MinIO presigned-URL cross-origin issue via the Caddy config

Out of scope / current state: the production VM described here is **no longer live**.
Exact details of the presigned-URL fix were not documented and need rediscovery (see P8).

---

## P7: Seed script verification [IN PROGRESS]

DB and MinIO are freshly reset. Need to verify the existing seed tooling still works
end-to-end and assigns recipes to a real user correctly.

Requirements:
- Read and explain `backend/scripts/seedRecipes.ts` and `backend/scripts/uploadRecipeImages.ts`
- Confirm how/whether a user id is wired into seeded recipes, and whether it's correct
  against a fresh DB (no pre-existing user records)
- Fix wiring if broken; otherwise document the correct seeding order
- Use Playwright (browser) only if needed to obtain a real Auth0 user id / verify via UI

Out of scope:
- Any other phase below

Acceptance:
- Fresh `docker-compose.dev` Mongo + MinIO seeded successfully via the scripts
- Recipes visible per-user via the running app (or API), correctly associated
- Findings documented in SESSION_LOG.md / KNOWN_ISSUES.md as relevant

---

## P8: Local dev parity for MinIO presigned URLs [TBD — confirm with user]

- `docker-compose.dev` should run only MongoDB + MinIO; frontend and backend run
  directly in the terminal (`npm run dev`) for easier debugging
- Recreate, in dev, whatever fix made MinIO presigned URLs work cross-origin in prod
  (suspected Caddy-based; prod VM no longer available to inspect — rediscover from
  code/config, not from the dead VM)

---

## P9: README overhaul [TBD — confirm with user]

Rewrite root `README.md` to document the real stack/purpose (portfolio project) and
the local dev workflow established in P8. (A baseline accurate README was written
during this retrofit; P9 is the full pass once local dev parity is settled.)

---

## P10: Auth0 redirect callback fix [TBD — confirm with user]

Investigate and fix the redirect-callback handling flagged as "not the best" by the user.

---

## P11: Dependency audit [TBD — confirm with user]

Identify and remove unused packages in `frontend/` and `backend/`. Must keep the
GitHub Actions CI pipeline green (`.github/`).

---

## P12: Testing & lint cleanup [TBD — confirm with user]

- Add test coverage (currently zero in both frontend and backend)
- Fix backend lint errors (305 total: mostly Prettier formatting, plus 1 unused
  import in `models/recipe.ts` and 1 `no-sequences` violation in `routes/recipes.ts`)

Acceptance:
- `npm run lint` clean in backend and frontend
- Some baseline test coverage exists for both apps
