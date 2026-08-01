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

## 2026-06-26 — Frontend deploy via rsync with explicit chmod

Frontend build artifacts are copied to the VM using `rsync -rlpt --chmod=D755,F644`
instead of a plain `scp`. The `--chmod=D755,F644` flag is mandatory: without it,
directories land without execute bits and Caddy (running as the `caddy` system user)
cannot traverse them, causing the file server to return 403 for all static assets.
The rsync target is `$WEB_APP_WEB_SERVER_FOLDER/frontend/` (a `/frontend` subdirectory,
not the web root itself) so other content in the web root is not clobbered on redeploy.
`--mkpath` ensures the `frontend/` subdirectory is created on first deploy without a
separate mkdir step.

## 2026-06-26 — Caddy managed directly on VM, not via repo Caddyfile

Caddy runs as a host systemd service on the VM (not in Docker). Its authoritative
config is `/etc/caddy/Caddyfile` on the server — that file is edited directly via SSH
when the Caddy config needs to change. The `caddy/Caddyfile` in the repo is kept only
as a reference/documentation copy and is not deployed or reloaded by CI. The pipeline's
"Reload Caddy" step runs `caddy reload --config /etc/caddy/Caddyfile` (the system path)
so it stays in sync with the systemd service and survives server restarts.

## 2026-07-30 — Seed images baked into the backend Docker image

`backend/recipe-images/` is now copied into the runtime image at `dist/recipe-images`
(`COPY --from=builder /app/recipe-images ./dist/recipe-images`, placed before the
`chown -R node:node /app` so the files are node-owned). Previously the final runtime
stage copied only `dist` + `node_modules`, so the seed images did not exist in the
container and seeding prod would have required a manual `scp`/`docker cp` on every run.

The target path is `dist/recipe-images`, not `recipe-images`, because the bundled
uploader resolves `IMAGES_DIR` as `path.join(__dirname, '../recipe-images')` and its
`__dirname` at runtime is `/app/dist/scripts`. Baking the folder in keeps the local
(`tsx` on TS sources) and prod (`node` on the bundle) seeding paths structurally
identical — same commands, same relative layout, no per-run file shuffling.

## 2026-07-30 — `seedRecipes` reads image-mappings.json at runtime, not as a static import

`seedRecipes.ts` used `import imageMappings from './image-mappings.json'`. That works
locally under `tsx` (resolved from disk each run) but **not** in prod: `build.js` runs
esbuild with `bundle: true`, which inlines relative JSON imports at build time. The
compiled `dist/scripts/seedRecipes.js` therefore carried whatever UUIDs were committed
in `scripts/image-mappings.json` and silently ignored the fresh file that
`uploadRecipeImages` writes immediately before it runs — seeding recipes whose
`image.filename` pointed at bucket objects that were never uploaded under those keys.

Replaced with an explicit `fs.readFileSync` of `path.join(__dirname, './image-mappings.json')`
— the same path the uploader writes to — restoring the upload→seed contract in both
environments. It fails loudly (clear message, exit 1, before any Mongo connection) when
the file is absent. Deliberately **no** fallback to the committed mappings: a fallback
would reintroduce exactly the silent broken-image failure this fixes. Verified by
grepping the rebuilt bundle: no inlined JSON literal, `readFileSync(MAPPINGS_FILE)` present.

## 2026-08-01 — Prod MinIO is exposed via a Cloudflare tunnel route, not via Caddy

Presigned MinIO URLs are served to browsers through a Cloudflare tunnel route on tunnel
`server-main`: `minio-cookbook.maxim-dicusari.com` → `http://localhost:3013`. This is the
third route on that tunnel, alongside `maxim-dicusari.com` → `:80` and
`cookbook.maxim-dicusari.com` → `:3010`. MinIO's API is bound to `127.0.0.1:3013` on the
VM; `3014` is the console and is deliberately **not** exposed.

This supersedes, in practice, the `minio.yourdomain.com { reverse_proxy minio:9000 }`
block in `caddy/Caddyfile` (rediscovered in P8). Caddy on the VM now listens on `:3010`
behind the tunnel (P13) and is not the public TLS terminator for MinIO — Cloudflare is.
The Caddyfile block is retained as documentation of the original mechanism but is not the
active path.

Rationale: the tunnel was already the ingress for everything else on this host after P13,
so adding a route required no VM-side change, no open inbound port, and no extra TLS
management. MinIO stays bound to loopback.

The pairing that makes it work, and the reason the env values are what they are:

- `MINIO_PUBLIC_PORT=443` + `MINIO_PUBLIC_USE_SSL=true` → minio-js emits a **portless**
  `https://minio-cookbook.maxim-dicusari.com/...` URL. Any non-443 value would emit an
  explicit `:port` that Cloudflare will not proxy, breaking every image while health
  checks still passed.
- The tunnel **preserves the original `Host` header**, so SigV4 presigned signatures
  validate at MinIO. If cloudflared were ever configured with `httpHostHeader` on this
  route, every image would fail `SignatureDoesNotMatch`. Do not set it.
- Uploads keep using the internal client (`cookbook-minio:9000`, no SSL) — only presigning
  goes through the public endpoint, per `dataSources/minio.ts`.

## 2026-08-01 — Auth0 logout uses the v2 `logoutParams` shape, with `window.location.origin`

`logout({ logoutParams: { returnTo: window.location.origin } })` in
`frontend/src/components/UserProfile.jsx`. Two sub-decisions worth not re-litigating:

- **`window.location.origin`, not a `VITE_` env var.** It mirrors what `redirect_uri` in
  `config/auth0.js` already does, needs no new CI secret, and resolves correctly in both
  environments — dev is pinned to `http://localhost:3000` by `vite.config.js`
  (`strictPort: true`) and prod is `https://cookbook.maxim-dicusari.com`; both are in the
  tenant's Allowed Logout URLs.
- **Rejected: reordering the Auth0 Allowed Logout URLs list.** Auth0 falls back to the
  *first* entry when a logout request carries no `returnTo`, so moving
  `https://cookbook.maxim-dicusari.com` to the front would have made prod appear fixed.
  It would also have sent every local-dev logout to production, and it would have left the
  actual defect — a v1 API call against the v2 SDK — in place to resurface elsewhere.

The general hazard: `@auth0/auth0-react` v2 **silently ignores** unrecognized top-level
options. `_buildLogoutUrl` reads only `options.logoutParams`, so a v1-shaped call produces
no error, no warning, and a plausible-looking wrong redirect. Anything copied from a v1-era
example should be checked against the installed typings first.

## 2026-08-01 — Verifying a frontend change on prod requires checking the loaded bundle

Prod currently serves `index.html` with no `Cache-Control`/`ETag` (KNOWN_ISSUES 2026-08-01,
PLAN.md P16), so a browser can run a stale bundle for an unbounded window after a deploy
while the server serves the new one. This produced a false negative during P15: the fix was
correct and live, the test still showed the old behavior.

Until P16 lands, any prod verification of a frontend change must confirm which bundle is
actually running before trusting the result:

```js
[...document.querySelectorAll('script[src]')].map(s => s.getAttribute('src'))
// and/or: performance.getEntriesByType('resource') → transferSize === 0 means cache
```

A cache-busting query string (`/?x=1`) forces a fresh `index.html` because the HTTP cache
key includes the query. "It still reproduces after deploy" is not evidence of a failed fix
unless the bundle hash was checked.
