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

## P7: Seed script verification [DONE 2026-06-23]

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
- [x] Fresh `docker-compose.dev` Mongo + MinIO seeded successfully via the scripts
      (2026-06-23: 5 MinIO objects, 4 Mongo recipes)
- [x] Recipes correctly associated — all 4 carry the real Auth0 user's id, and
      image filenames match actual MinIO objects (verified directly in Mongo/MinIO)
- [x] Recipes visible per-user in the running **app** after Auth0 login
      (2026-06-23: logged in via Playwright as the seeded user; all 4 recipes
      rendered with images loaded from MinIO presigned URLs — no console errors)
- [x] Findings documented in SESSION_LOG.md / KNOWN_ISSUES.md

Done note (2026-06-23): verified end to end — Mongo/MinIO data, per-user
association, and live app display. Seed user id was parameterized (CLI arg /
`SEED_USER_ID` env, default = owner's id; see DECISIONS.md). Two unrelated bugs
were found and logged for later phases: `/api/test` crashes the backend, and the
JWT error handler lets unauthenticated requests fall through to controllers
(see KNOWN_ISSUES.md).

---

## P7.5: Backend hardening — DoS test route + DELETE auth bypass + TODO [DONE 2026-06-23]

Dedicated fix for three issues found during P7 but deliberately left unfixed then.
Grouped into one chat by the delivery manager (security/dead-code hardening unit).

Requirements:
- Remove the unauthenticated `GET /api/test` route that crashed the backend (unawaited
  `recipe.save()` with no `userId` → unhandled rejection → process down; trivial DoS)
- Close the `DELETE /recipes/delete/:id` auth bypass (route had no `checkJwtAuth`, so a
  forged/unsigned JWT decoded by `getUserId` passed the ownership check)
- Make `handleJwtAuthError` fail closed (it fell through to controllers on non-401
  errors, so unauthenticated requests hit the controller guard instead of 401)
- Resolve the inline TODO at `backend/src/index.ts:26`

Scope decisions (approved):
- Test route: deleted entirely (dead scaffolding, no caller anywhere in repo)
- Auth: targeted fix (add `checkJwtAuth` to DELETE + fail-closed handler). NOT the
  deeper `getUserId` refactor — after these changes every route reading `req.userId`
  runs `auth()` first, so the unverified decode is fully shadowed.
- TODO: kept the working body-parser behavior, replaced the stale comment only.

Acceptance:
- [x] `GET /api/test` → 404 and backend stays up (was: single hit crashed it)
- [x] Forged unsigned JWT (victim `sub`) DELETE → 401, target recipe survives
      (was: 200 + deletion). Verified via curl against live backend.
- [x] No-token and forged-token `GET /api/recipes` → 401 (was: 404 fall-through)
- [x] Legit authenticated flows still work — verified via Playwright as the real
      Auth0 user: 4 recipes render with MinIO images (GET 200), create a recipe
      (POST 200), delete it (DELETE 200); Mongo restored to original 4
- [x] `tsc --noEmit` clean

---

## P8: Local dev parity for MinIO presigned URLs [DONE 2026-06-23]

Both original bullets assumed dev was broken in the way prod was. Investigation
showed the premise was stale:

- `docker-compose.dev.yml` already ran only Mongo+MinIO, with frontend/backend on
  the host via `npm run dev` — already the case, and already verified working in
  P7 (Playwright session, real presigned MinIO URLs, images rendered, no console
  errors).
- There was nothing to "recreate" in dev: `backend/src/index.ts` does a bare
  `import 'dotenv/config'`, which only ever loads `backend/.env` (no path override
  anywhere). With `MINIO_ENDPOINT=localhost` / `MINIO_PORT=3003` in that file,
  backend and browser share `localhost`, so the presigned URL is directly
  browser-reachable — the Docker-internal-hostname-unreachable-by-browser problem
  that prod had structurally can't occur here.
- The prod mechanism was rediscovered instead: `minio.ts`'s `publicClient`
  (active when `NODE_ENV=production`, pointed at `MINIO_PUBLIC_*`) paired with the
  Caddy `minio.yourdomain.com` subdomain block. It's dormant — prod's `env_file`
  (`backend/.env`) doesn't set `NODE_ENV`/`MINIO_PUBLIC_*`, those only exist in the
  unused `backend/.env.development` template — documented in KNOWN_ISSUES, not
  reactivated (no live prod target to verify against; deferred).

Additionally removed the redundant root `docker-compose.yml` (full-container dev
setup, hardcoded ports) — confirmed unreferenced by README/CI/scripts, leftover
from before the `docker-compose.dev.yml` + host-`npm run dev` workflow was adopted.

Out of scope (deferred, not done): reactivating the dormant prod env wiring;
removing the unused `backend/.env.development` template.

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
