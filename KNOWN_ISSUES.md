# Known Issues

Active bugs, gotchas, workarounds. Append with date.

---

## 2026-06-18 — Zero test coverage

No `.test.`/`.spec.` files exist anywhere in `frontend/` or `backend/`. Flagged by
user as a priority for the coming weeks (PLAN.md P12).

## 2026-06-18 — Backend lint not clean

`npm run lint` in `backend/` reports 305 problems:
- Vast majority are Prettier formatting (quote style, spacing) — auto-fixable via
  `npm run lint:write`
- 1 real issue: unused import `Types` in `backend/src/models/recipe.ts`
- 1 real issue: `no-sequences` violation in `backend/src/routes/recipes.ts`

Frontend lint (`npm run lint` in `frontend/`) is clean.

## 2026-06-18 — Root README.md is stale

Describes an in-memory-only demo with no real backend and lists MUI/React Hook
Form/Lodash, none of which are still dependencies. The app now has a full
Express + TypeScript + MongoDB + MinIO + Auth0 backend. Tracked for rewrite in
PLAN.md P9 (a corrected baseline README was written during this retrofit).

## 2026-06-18 — backend/README.md is unrelated boilerplate

It's the unmodified README from an external template
(`express-mongodb-rest-api-typescript-boilerplate`) and documents packages
(Redis, email-templates, bcrypt, i18next) that aren't in this project's actual
`package.json`. Misleading if read at face value — should eventually be replaced
or removed.

## 2026-06-18 — Auth0 redirect callback not ideal

User-flagged: the Auth0 redirect-callback handling has a known weakness (e.g. the
copy-paste-link-mid-auth bug below may be related). Needs investigation — see
PLAN.md P10.

## 2026-06-18 — Copy-pasting a link mid-auth breaks return-to-app flow

Carried over from the project's former `known-bugs.md`: copy-pasting a link while
in the middle of the Auth0 flow means you don't get redirected back into the app
correctly afterward.

## 2026-06-18 — MinIO presigned URLs: cross-origin issue in prod (undocumented fix) [RESOLVED 2026-06-23]

In production, the frontend couldn't load MinIO presigned URLs because they
pointed at a different origin/domain than the frontend. This was reportedly
resolved via the Caddy config, but the exact mechanism was never written down and
the production VM is no longer live to inspect directly. Needs rediscovery from
code/config — see PLAN.md P8.

RESOLVED 2026-06-23 (P8): rediscovered the mechanism from code. `minio.ts`
constructs a separate `publicClient` when `NODE_ENV === 'production'`, pointed at
`MINIO_PUBLIC_ENDPOINT`/`MINIO_PUBLIC_PORT`/`MINIO_PUBLIC_USE_SSL` instead of the
internal Docker endpoint used for uploads. `caddy/Caddyfile` has a matching
`minio.yourdomain.com { reverse_proxy minio:9000 }` block, so a browser hitting the
public subdomain reaches MinIO via Caddy instead of the unreachable internal
`minio:9000` hostname. That pairing is the fix.

It is currently **dormant**, not active: `docker-compose.prod.yml` loads
`env_file: ./backend/.env`, but `NODE_ENV=production` and the `MINIO_PUBLIC_*`
values only exist in the unused `backend/.env.development` template — so even if
the prod VM were redeployed today, the internal (Docker-only) endpoint would still
be baked into presigned URLs. Reactivating this (setting the real vars in
whichever env file prod actually loads) was deferred — no live prod target exists
to verify against — and is a candidate for a future phase if prod is redeployed.

Confirmed dev never hits this problem in the first place: `backend/src/index.ts`
loads `backend/.env` (bare `dotenv/config`, no path override), which sets
`MINIO_ENDPOINT=localhost`. Backend and browser share `localhost` in dev, so the
presigned URL is directly browser-reachable regardless of the `publicClient` logic.

## 2026-06-18 — Env files with credentials are tracked in git

`backend/.env`, `backend/.env.development`, `prod.env`, `mapping-envs-be.txt`,
`mapping-envs-root.txt`, and root `.env.example` are committed, including a
commented-out block in `backend/.env` with generated-looking Mongo/MinIO
credentials. User confirmed these are dummy/dev-only values, not live secrets —
no rotation needed, but worth keeping real env files out of version control going
forward.

## 2026-06-23 — `/api/test` route crashes the entire backend (unauthenticated) [RESOLVED 2026-06-23]

`backend/src/controllers/testController.ts` builds `new Recipe({...})` with **no
`userId`** and calls `recipe.save()` **without `await` and without `.catch()`**.
The handler returns 200 immediately; the save then rejects with
`recipes validation failed: userId required` as an *unhandled promise rejection*,
which crashes the Node process (nodemon then waits for a file change).

Severity: high. The route (`GET /api/test`) has **no auth**, so any unauthenticated
request takes the whole backend down (trivial DoS). Discovered by cur/ing it during
P7 verification — a single hit killed the server.

It's leftover debug scaffolding (creates a junk "Super soup" recipe). Fix is small
(await + try/catch, or just delete the test route/controller), but it's outside P7
scope — flagged here for a dedicated fix. The frontend never calls `/api/test`, so
normal app flows are unaffected.

RESOLVED 2026-06-23 (P7.5): deleted the route entirely — removed
`controllers/testController.ts`, `routes/test.ts`, and the `test` import/registration
in `routes/index.ts` (repo-wide grep confirmed no other caller). `GET /api/test` now
returns 404 and the backend stays up under repeated hits.

## 2026-06-18 — Inline TODO [RESOLVED 2026-06-23]

`backend/src/index.ts:26` — `// TODO. chek if this is needed`.

RESOLVED 2026-06-23 (P7.5): the TODO sat on the manual `express.json`/`urlencoded`
body-parser block (the surrounding middleware skips parsing for `multipart/form-data`
so multer owns that stream). `express.json`/`urlencoded` already no-op on multipart,
so the explicit skip is redundant but harmless, and uploads were verified working in
P7. Kept the behavior unchanged; replaced the stale comment with one explaining why
the block exists.

## 2026-06-18 — DB and MinIO are currently empty [RESOLVED 2026-06-23]

User reset both for local dev. Seed scripts (`backend/scripts/seedRecipes.ts`,
`backend/scripts/uploadRecipeImages.ts`) need verification before other local
work can be tested against real data — see PLAN.md P7 (current phase).

RESOLVED 2026-06-23: both scripts run successfully against the dev containers.
MinIO holds 5 objects; Mongo holds 4 recipes correctly associated with the real
Auth0 user. Data layer verified; app-level display pending a real login.

## 2026-06-23 — Seed script user id [PARAMETERIZED 2026-06-23]

`backend/scripts/seedRecipes.ts` previously hardcoded
`userId = new Types.ObjectId('689b1b8c4756997569c05972')`. Verified it matches the
owner's Auth0 account, so it worked — but was brittle for any other account.

RESOLVED 2026-06-23: parameterized via CLI arg / `SEED_USER_ID` env, default =
owner's id, with 24-hex validation (see DECISIONS.md). Residual design constraint
worth keeping in mind: `getAll` does `new Types.ObjectId(req.userId)`, so a
non-24-hex Auth0 `sub` (e.g. social `google-oauth2|<numeric>`) would **throw**
(500) rather than return an empty list. Only Auth0 database-connection users
(24-hex sub) are supported by the current app design — a separate concern from
the seeder, relevant to P10 (Auth0 work).

## 2026-06-23 — Auth bypass on DELETE + JWT error handler falls through (HIGH) [RESOLVED 2026-06-23]

Two related auth weaknesses, both relevant to P10:

1. **`DELETE /recipes/delete/:id` is forgeable (real auth bypass).** That route
   has **no `checkJwtAuth`** (no `auth()` signature verification). The only thing
   identifying the caller is the `getUserId` middleware, which uses
   `jwt-decode` — that **does not verify the token signature**, it just base64-
   decodes the payload. So an attacker can hand-craft an unsigned JWT with
   `sub: "auth0|<victimId>"`; `getUserId` sets `req.userId = <victimId>`, the
   controller's ownership check (`recipeDoc.userId === req.userId`) passes, and
   the victim's recipe is deleted. No valid credentials needed.

2. **`handleJwtAuthError` falls through on non-401 errors.** `checkJwtAuth` =
   `[auth(...), handleJwtAuthError]`; the handler only returns 401 when
   `err.status === 401`, otherwise it calls `next()` into the controller.
   Observed: `GET /api/recipes` with **no token** returns `404 "User not found"`
   (controller guard), not `401`. So on the GET/POST/PUT routes the controllers'
   `if (!req.userId)` checks — not the JWT middleware — are the real gate. The GET
   doesn't leak other users' data (404, not someone else's recipes), but auth is
   weaker/more implicit than it looks.

Root cause for both: identity is derived by decoding the token without verifying
it, and not every route runs `auth()`. Fix belongs in P10 (Auth0 work), in a
fresh chat — not touched during P7.

RESOLVED 2026-06-23 (P7.5), targeted fix:
1. Added `checkJwtAuth` to `DELETE /recipes/delete/:id`, so `auth()` now verifies the
   token signature before the controller runs. Forged unsigned JWT → 401, target
   recipe survives (verified via curl); a legit user can still delete their own
   recipe → 200 (verified via Playwright).
2. Rewrote `handleJwtAuthError` to fail closed: it always responds and never calls
   `next()` into the controller. Normalizes auth failures to 401 (preserving 403 for
   insufficient scope); the old `err.status === 401`-only check missed the library's
   400 `invalid_request` for a missing token, which is why no-token `GET /api/recipes`
   used to fall through to a 404. Now → 401.

Residual (defense-in-depth, NOT done — see DECISIONS 2026-06-23): `getUserId` still
derives `req.userId` from an unverified `jwt-decode`. It is now harmless because every
remaining route that reads `req.userId` runs `checkJwtAuth`/`auth()` first, so the
decode is shadowed by signature verification. A future route added without
`checkJwtAuth` could reintroduce the class of bug; deriving `req.userId` from the
verified `req.auth.payload.sub` would remove that footgun (candidate for P10).

## 2026-06-23 — Seed scripts: order dependency and orphaned MinIO objects

- Order matters: `upload-recipe-images` must run **before** `seed-recipes`,
  because the seeder reads `scripts/image-mappings.json`, which the uploader
  regenerates with fresh bucket filenames. Running them out of order seeds
  recipes whose `image.filename` points at objects that don't exist.
  **Correction (2026-07-30):** "the seeder reads the file" was only true of the
  local `tsx` path. In the built bundle the JSON was inlined by esbuild at build
  time, so the correct order was not sufficient in prod — the seeder ignored the
  uploader's output entirely. Fixed in P14 (runtime `readFileSync`); see
  DECISIONS 2026-07-30. The ordering requirement itself still stands, and the
  seeder now exits 1 with a clear message if the mappings file is missing.
- Each upload run generates new UUID filenames and does not delete prior objects,
  so repeated runs accumulate orphaned images in the bucket. Harmless on a fresh
  bucket; worth a cleanup step if the scripts are re-run often.
- The stored `image.etag` is not used on read — `getAll` builds the presigned URL
  from `image.filename` only. A stale etag is harmless; a stale filename breaks
  the image. (Also: `recipeController.create` hardcodes the default image's etag
  `409f33f747a2671563173c30a042f778` as a fallback magic constant.)

## 2026-06-23 — `backend/dist/` is not gitignored

Noticed while running `npm run build` locally during P11 CI verification: unlike
`frontend/` (which has its own `.gitignore` covering `dist`), `backend/` has no
`.gitignore` of its own, and the root `.gitignore` only covers `/frontend/build`
(not `backend/dist`). Running the backend build locally leaves `backend/dist/`
untracked but not ignored — low risk (a careful `git add` won't pick it up
unintentionally, but a careless `git add -A` could). Not fixed — one-line
`.gitignore` change, out of scope for P11 (dependency audit), worth a quick fix in
a future session.


## 2026-06-26 — on the prod (cookbook.maxim-dicusari.com) the logout button redirects to localhost:3000

## 2026-07-30 — `migrate-mongo` tooling is dev-only and its one migration is dangerous

Noticed while seeding prod (P14). Not acted on — flagged as an open question.

- `backend/migrate-mongo-config.cjs` hardcodes `url: "mongodb://cookbook-mongo/cookbook"`
  with no credentials and no env-var support. Prod Mongo requires auth
  (`MONGODB_URI` with root user + `authSource=admin`), so `npm run migrate-mongo-*`
  cannot work against prod as written.
- The single migration `migrations/20240520084348-add-user-id-to-recipes.js` runs
  `db.collection('recipes').updateMany({}, { $set: { userId } })` with a hardcoded
  `665205865268b4bb72389b9c` — **unscoped**, and a different, older id than the current
  seed target `689b1b8c4756997569c05972`. Running `up` today would reassign *every*
  recipe (including the P14 seed data) to a user that does not exist in prod, making
  them invisible in the app. `down` would strip `userId` from all recipes.
- Unknown whether this migration was ever applied to prod (would show in the
  `changelog` collection — not checked; direct credentialed Mongo reads were blocked
  in the P14 session).
- Open question for a future session: is `migrate-mongo` still wanted at all? It has
  one historical migration whose purpose (backfilling `userId`) is now handled by the
  models and seed scripts. Candidate for deletion, or for being made env-aware and the
  stale migration retired. Decide before anyone runs a migrate command.