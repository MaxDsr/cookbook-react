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

## P11: Dependency audit [DONE 2026-06-23]

Identified and removed unused packages in `frontend/` and `backend/`. Also added a
backend CI check job so dependency breakage fails fast on the runner instead of only
surfacing during the live (currently down, expected back soon) VM deploy.

Findings (via `npx depcheck` + manual grep cross-check against scripts/configs):
- Backend devDependencies removed: `ts-node`, `tsconfig-paths` (no usage anywhere —
  nodemon/scripts use `tsx`, and `tsconfig.json` defines no `paths`),
  `@types/express-serve-static-core` (unused; `@types/express` pulls it transitively)
- Frontend devDependency removed: `@types/react-dom` (confirmed unused by depcheck;
  `@types/react` left in place per user decision — same root cause but not the
  confirmed item, deferred rather than removed)
- Correctly NOT flagged as unused despite no `import`: `migrate-mongo` (CLI-invoked
  via npm scripts + `migrate-mongo-config.cjs` + `migrations/` dir), `tsx` (used in
  `nodemon.json`/scripts), eslint/prettier plugins (used via config files)

Adjacent dead-code cleanup (approved by user, same session):
- Deleted `backend/test-minio-upload.js` — broken debug script (CommonJS `require()`
  in an ESM package, referenced uninstalled `form-data`/`node-fetch`, looked for a
  nonexistent `./test-image.jpeg`). Never run by any npm script or CI.
- Deleted `frontend/.eslintrc.cjs` — legacy ESLint config superseded by the active
  flat `eslint.config.js`; ESLint 9 already ignored it. Referenced
  `eslint-plugin-react`, which isn't even installed.

CI scoping decision (see DECISIONS.md): `.github/workflows/main.yml` is a
deploy-on-push pipeline, not a test suite — only the frontend build step
(`npm install && npm run build`) ran on the GitHub runner; the backend was only ever
built remotely on the VM via SSH/`docker compose up --build`. Added a new
`backend-check` job (checkout, Node 24, `npm ci`, `npx tsc --noEmit`, `npm run build`)
that the existing `deploy` job now `needs:`, so backend breakage fails fast on the
runner. Deliberately excluded `npm run lint` from this gate — backend lint currently
has 287 pre-existing problems (P12 scope), and including it would turn CI red for
reasons unrelated to this phase.

Out of scope (deferred): fixing backend lint (P12), removing `@types/react` (user
declined this round), reactivating the dormant prod MinIO env wiring (P8).

Acceptance:
- [x] Backend: `npm ci`, `npx tsc --noEmit` (clean), `npm run build` (esbuild, clean),
      live boot via `npm run dev` against dev containers (MinIO connected, no crash,
      unauthenticated `GET /api/recipes` → 401 as expected) — all green
- [x] Frontend: `npm ci`, `npm run build` (clean, mirrors the actual CI runner step),
      `npm run lint` (clean, no regression from removing `.eslintrc.cjs`)
- [x] New `backend-check` CI job added; validated by local command-equivalence only
      — **not** validated by an actual push/run, since pushing to `current-work`
      triggers a real deploy attempt against the VM (currently down)

---

## P12: Testing & lint cleanup [TBD — confirm with user]

- Add test coverage (currently zero in both frontend and backend)
- Fix backend lint errors (305 total: mostly Prettier formatting, plus 1 unused
  import in `models/recipe.ts` and 1 `no-sequences` violation in `routes/recipes.ts`)

Acceptance:
- `npm run lint` clean in backend and frontend
- Some baseline test coverage exists for both apps

---

## P13: Reconnect CI/CD via Tailscale [DONE 2026-06-26]

Restore working automated deploys after server was placed behind Tailscale. The existing
`VM_HOST` secret already holds the Tailscale IP — no host secret changes needed.

Requirements:
- Add Tailscale auth step to deploy job using `TAILSCALE_AUTHKEY` secret
- Update Caddyfile to listen on `:3010` instead of `:80`
- Add Caddy reload step after deploy (`caddy reload --config`, no sudo required)

Out of scope:
- Any changes to `VM_HOST`, `VM_USERNAME`, `VM_SSH_KEY`, `VM_PORT` secrets

Acceptance:
- [x] Push to `current-work` triggers pipeline successfully
- [x] All SSH/SCP steps connect without timeout
- [x] App accessible after deploy — verified at `https://cookbook.maxim-dicusari.com`
      (Cloudflare→:3010; raw IP is not a valid check — Auth0 requires HTTPS)
- [x] `typecheck` passes in `backend-check` job

Done note (2026-06-26): post-pipeline 404 was caused by the VM Caddyfile having
`root * /var/www/html/frontend` (wrong) instead of `/web-server/cookbook-react/frontend`
(where rsync actually deposits the build). Fixed directly on the VM; repo `caddy/Caddyfile`
documentation copy corrected to match.

---

## P14: Prod data seeding [DONE 2026-08-01]

Prod is live and login works, but the `cookbook` database has 1 user and 0 recipes —
the recipe seeding verified locally in P7 was never run against prod. Run the same
`upload-recipe-images` → `seed-recipes` pipeline against prod's MinIO bucket and
MongoDB so the deployed app shows real demo data.

Requirements:
- Bake `backend/recipe-images/` into the backend Docker image at `dist/recipe-images`
  (the path the bundled scripts resolve), so no manual `scp`/`docker cp` is needed on
  this or any future deploy
- Fix the upload→seed handoff in the built scripts: `seedRecipes` must read
  `image-mappings.json` at runtime, not have it inlined by esbuild at build time
- Redeploy via the P13 CI/CD pipeline, then run both scripts inside `cookbook-backend`
- Seed scoped to the existing prod user id `689b1b8c4756997569c05972`, passed
  explicitly via `--userId`

Out of scope:
- `migrate-mongo` tooling (hardcoded dev-only URL, stale migration userId) — logged in
  KNOWN_ISSUES.md as an open question, not acted on
- Cleaning up orphaned MinIO objects from earlier local upload runs
- Any change to Auth0, Caddy, or the pipeline itself

Acceptance:
- [x] `docker exec cookbook-backend ls /app/dist/recipe-images` shows all 4 photos
      plus `default/recipe-default.jpg` after deploy
- [x] `uploadRecipeImages.js` uploads 4 UUID-named objects + `recipe-default.jpg`
      (bucket `recipe-images` now holds exactly 5 objects, no orphans)
- [x] `seedRecipes.js` inserts 4 recipes for user `689b1b8c4756997569c05972`
- [x] Seeded `image.filename` values match the objects just uploaded (not stale
      build-time UUIDs) — verified per recipe against the uploader's output
- [x] Logged-in browser session renders all 4 recipes with images (2026-08-01,
      after the user added the Cloudflare tunnel route). `GET /api/recipes` → 200
      (was 500), all four presigned MinIO image GETs → 200, no console errors.
      Was blocked until 2026-08-01 by `MINIO_PUBLIC_ENDPOINT` being NXDOMAIN —
      infra-side and pre-existing, not caused by this phase's code changes.
- [x] `npx tsc --noEmit` and `npm run build` clean; `backend-check` CI job green
      (run 30536457556, both jobs success)

Blocker resolved 2026-08-01: the user added the tunnel route
`minio-cookbook.maxim-dicusari.com` → `http://localhost:3013` on tunnel `server-main`.
The prediction held exactly — the data seeded on 2026-07-30 rendered with **no further
code or data changes**, and the container picked up the new DNS record without a restart.

Verification (all read-only): DNS resolves to Cloudflare from both the dev machine and
inside `cookbook-backend`; `/minio/health/live` → 200 with real MinIO headers; prod env
confirmed as `NODE_ENV=production` + `MINIO_PUBLIC_PORT=443` + `MINIO_PUBLIC_USE_SSL=true`;
a URL presigned inside the container fetched from outside the VM returned 200 /
`image/jpeg` / 1.6 MB — which proves the tunnel preserves the `Host` header so SigV4
signatures validate through it. See KNOWN_ISSUES 2026-07-30 (RESOLVED) for why that
Host-header detail is the load-bearing fact.

---

## P15: Auth0 logout `returnTo` fix [DONE 2026-08-01]

On prod, clicking logout signs the user out but lands them on `http://localhost:3000`
instead of `https://cookbook.maxim-dicusari.com` (KNOWN_ISSUES 2026-06-26).

Deliberately narrow and **separate from P10** — P10 is the *login* redirect-callback
weakness (`onRedirectCallback` / copy-paste-link-mid-auth). This phase touches the
logout path only.

Root cause (diagnosed 2026-08-01, before any code change): `UserProfile.jsx:11` called
`logout({ returnTo })` — the auth0-react **v1** signature — against the installed v2.8.0
SDK, whose `_buildLogoutUrl` reads only `options.logoutParams`. The top-level `returnTo`
was silently dropped, so `/v2/logout` was called with no `returnTo` and Auth0 fell back to
the **first** entry in Allowed Logout URLs, which is `http://localhost:3000`.

Requirements:
- Change the single call site to `logout({ logoutParams: { returnTo: window.location.origin } })`
- Deploy via the P13 CI/CD pipeline and verify on prod with the test account

Out of scope:
- Any Auth0 console change — the tenant config is already correct and complete
  (verified 2026-08-01: prod URL present in Allowed Logout URLs / Callback URLs /
  Web Origins; App Type = SPA). Reordering the list is explicitly **rejected** as a
  fix: putting prod first would send local-dev logouts to production.
- P10 login-side redirect work; `getUserId` hardening; MinIO `region` hardening

Acceptance:
- [x] Logout on `https://cookbook.maxim-dicusari.com` returns to that origin, signed out
      — **confirmed by the user on their machine, 2026-08-01**, after manually clearing
      the browser cache. The first attempt still landed on `localhost:3000`, but the fix
      was not at fault: the browser was proven to be running the *previous* bundle from
      cache (`transferSize: 0`, `scriptsInHtml: index-DrGx-d2n.js`). See P16 / KNOWN_ISSUES
      2026-08-01.
- [x] Deployed bundle contains `logoutParams` (i.e. the deploy actually shipped) —
      `/assets/index-BhW0tjnh.js`, confirmed both by `curl` and by fetching it from within
      a cache-busted page load (`hasNewLogoutShape: true`, `hasOldLogoutShape: false`)
- [x] Local dev logout still returns to `http://localhost:3000` (vite pins port 3000,
      `strictPort: true`, and that origin is allowlisted — no regression possible)
- [x] Frontend `npm run lint` and `npm run build` clean; `backend-check` CI job green
      (run 30716935301, both jobs success)

Done note (2026-08-01): the phase's real cost was not the one-line fix — it was that the
verification failed for an unrelated reason and could easily have been misread as "the fix
didn't work". That second problem is now split out as P16.

---

## P16: Prod cache headers — stale JS after every deploy [TODO]

Discovered while verifying P15. Not a P15 regression; pre-existing and affecting **every**
deploy, including all past ones.

Prod serves `index.html` with **no `Cache-Control` and no `ETag`** (only `Last-Modified`),
so browsers apply heuristic freshness and re-use a cached `index.html` — and therefore a
stale content-hashed bundle — without revalidating. Compounding it, the frontend deploy
step `rsync -rlpt --chmod=D755,F644 --mkpath frontend/dist/ …` has **no `--delete`**, so
every previous bundle remains on the VM and keeps returning 200. That is what makes the
staleness silent: a cached `index.html` keeps working instead of failing loudly with a 404.

Net effect: after any deploy, returning users keep running the old JS until the heuristic
window expires, with no error anywhere. P15's fix was live and correct on the server for
several minutes while the browser still ran the old code.

Requirements:
- Add cache headers to the static `handle` block in **`/etc/caddy/Caddyfile` on the VM**
  (not `caddy/Caddyfile` in this repo — see below):
  ```
  header /index.html Cache-Control "no-cache"
  header /assets/*   Cache-Control "public, max-age=31536000, immutable"
  ```
  Safe because Vite content-hashes every asset filename; only `index.html` must revalidate.
- Add `--delete` to the frontend rsync in `.github/workflows/main.yml` so old bundles are
  removed and staleness fails loudly rather than silently
- Mirror the change into the repo's `caddy/Caddyfile` documentation copy
- Verify with `curl -I` and a returning-visitor test (no manual cache clear)

Note on where the live config lives: the workflow scp's `caddy/` to
`~/cookbook-react/caddy/`, but the reload step runs
`caddy reload --config /etc/caddy/Caddyfile`. Confirmed 2026-08-01 that
`docker-compose.prod.yml` defines **no Caddy service**, so Caddy is host-installed and
`/etc/caddy/Caddyfile` is authoritative. The repo copy is documentation only. This is the
same repo-vs-VM split that caused the P13 404.

Out of scope:
- Any further Auth0 work (P10), README (P9), tests/lint (P12)

Acceptance:
- `curl -I https://cookbook.maxim-dicusari.com/` shows `Cache-Control: no-cache`
- `curl -I` on an `/assets/*` file shows the long `immutable` value
- After a deploy, a browser that visited before picks up the new bundle **without** a
  manual cache clear
- Old bundles no longer accumulate on the VM (previous hash returns 404)
