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

## 2026-06-23 — Removed redundant root `docker-compose.yml`

Deleted the full-container `docker-compose.yml` (dockerized frontend+backend on
hardcoded ports 3002/3003/3004) in favor of the single dev workflow already in
active use: `docker-compose.dev.yml` for Mongo+MinIO only, frontend/backend run
via `npm run dev` directly on the host.

- Why: the two files described conflicting dev workflows. Grep confirmed nothing
  (README, CI, scripts) referenced the deleted file — it was dead config left over
  from before the host-`npm run dev` workflow was adopted. Approved by user during
  P8.

## 2026-06-23 — Dev vs prod MinIO presigned-URL architecture (documented, P8)

Recorded how presigned URLs differ between dev and prod, since this was previously
undocumented (see KNOWN_ISSUES, resolved 2026-06-23):

- Dev: `backend/src/index.ts` loads only `backend/.env` (bare `dotenv/config`, no
  path override). `MINIO_ENDPOINT=localhost` there means the single `client` in
  `minio.ts` is reused for presigned URLs, and it's already browser-reachable
  because backend and browser share `localhost`.
- Prod (as designed, not currently active): `minio.ts` swaps to a separate
  `publicClient` when `NODE_ENV=production`, using `MINIO_PUBLIC_ENDPOINT/PORT/
  USE_SSL` instead of the internal Docker endpoint, paired with a Caddy
  `minio.yourdomain.com` reverse-proxy subdomain. This design is sound but dormant
  — the env vars it needs only exist in the unused `backend/.env.development`
  template, not in whatever env file prod actually loads.
- Why: no code change was needed for dev (already worked); the prod path was
  deliberately left dormant rather than wired live, since there's no live prod
  target to verify a change against. Approved by user during P8.

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

## 2026-06-23 — P11: Dependency removals

Removed, confirmed unused via `npx depcheck` + manual cross-check against
scripts/configs (to avoid false positives on CLI-invoked tools):
- Backend devDependencies: `ts-node`, `tsconfig-paths`, `@types/express-serve-static-core`
- Frontend devDependency: `@types/react-dom`

- Why: dead weight in the dependency tree with no functional benefit; removing them
  reduces install size/audit surface for no behavior change (verified via `tsc
  --noEmit` + `npm run build` + live boot for backend, `npm run build` + `npm run
  lint` for frontend — all clean).
- `@types/react` was flagged by the user as having the same root cause (frontend has
  no TypeScript tooling at all — no `tsconfig.json`/`jsconfig.json`, no `.ts`/`.tsx`
  files, no `typescript` devDependency) but was **not** removed this round — user
  chose to keep it despite the same justification, deferred rather than declined
  permanently.

## 2026-06-23 — P11: Deleted two dead files

- `backend/test-minio-upload.js`: broken, untracked-by-any-script debug script
  (CommonJS `require()` inside an ESM package, missing `form-data`/`node-fetch`
  dependencies, referenced a nonexistent `./test-image.jpeg`). Confirmed via grep no
  script/doc/CI referenced it.
- `frontend/.eslintrc.cjs`: legacy ESLint config superseded by the active flat
  `eslint.config.js`; ESLint 9 already ignores legacy config format by default, so it
  was dead weight, not a live fallback.

- Why: found incidentally while auditing dependencies (both files referenced
  packages that don't exist in `package.json`, which is what surfaced them); user
  approved deleting both rather than just logging them, since they're unambiguously
  dead.

## 2026-06-23 — P11: Added backend-check CI job, gated `deploy` on it

`.github/workflows/main.yml` is a deploy-on-push pipeline, not a test suite. Before
this change, the GitHub-hosted runner only ever built the frontend
(`npm install && npm run build`) — the backend was exclusively built remotely on the
VM via SSH + `docker compose -f docker-compose.prod.yml up -d --build`. That means a
backend-breaking change (e.g. a bad dependency removal) would only surface during a
live deploy attempt, and currently wouldn't surface at all since the VM is down.

Added a `backend-check` job (checkout, Node 24 — matching `backend/package.json`'s
`nodeVersion` and the Dockerfile's `node:24.11.0-slim` base, rather than the
workflow's existing Node 20 used for the frontend step — `npm ci`, `npx tsc
--noEmit`, `npm run build`) and added `needs: backend-check` to the existing
`deploy` job.

- Why these specific commands: mirrors `backend/docker/Dockerfile`'s builder stage
  (`npm ci` → `npm run build`, which is esbuild) almost exactly, plus `tsc --noEmit`
  as a bonus type-safety check the Dockerfile itself doesn't run (esbuild strips
  types without checking them, so it wouldn't have caught a type-only dependency
  regression like the `@types/express-serve-static-core` removal above).
- Why `npm run lint` was deliberately excluded from this gate: backend lint
  currently fails with 287 pre-existing problems (see KNOWN_ISSUES.md), which is
  P12 scope. Including it here would make the new gate red immediately, for reasons
  unrelated to this phase.
- Why `needs: backend-check` (a real behavior change): the whole point was
  fast-failing before deploy rather than only catching backend breakage during the
  live VM build — user explicitly asked for this over just logging it as a future
  improvement.
- Why not validated by an actual CI run: the workflow triggers on push to
  `current-work`, which is the current branch — pushing to test the YAML would
  trigger a real deploy attempt against the VM. Validated instead by running the
  job's exact commands locally (all clean) and by careful review of the YAML diff.
  User confirmed the VM will be back up soon and the existing deploy flow should be
  preserved, not removed or restructured — only this fast-fail addition was made.
