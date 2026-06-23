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

## 2026-06-18 — MinIO presigned URLs: cross-origin issue in prod (undocumented fix)

In production, the frontend couldn't load MinIO presigned URLs because they
pointed at a different origin/domain than the frontend. This was reportedly
resolved via the Caddy config, but the exact mechanism was never written down and
the production VM is no longer live to inspect directly. Needs rediscovery from
code/config — see PLAN.md P8.

## 2026-06-18 — Env files with credentials are tracked in git

`backend/.env`, `backend/.env.development`, `prod.env`, `mapping-envs-be.txt`,
`mapping-envs-root.txt`, and root `.env.example` are committed, including a
commented-out block in `backend/.env` with generated-looking Mongo/MinIO
credentials. User confirmed these are dummy/dev-only values, not live secrets —
no rotation needed, but worth keeping real env files out of version control going
forward.

## 2026-06-18 — Inline TODO

`backend/src/index.ts:26` — `// TODO. chek if this is needed`.

## 2026-06-18 — DB and MinIO are currently empty [RESOLVED 2026-06-23]

User reset both for local dev. Seed scripts (`backend/scripts/seedRecipes.ts`,
`backend/scripts/uploadRecipeImages.ts`) need verification before other local
work can be tested against real data — see PLAN.md P7 (current phase).

RESOLVED 2026-06-23: both scripts run successfully against the dev containers.
MinIO holds 5 objects; Mongo holds 4 recipes correctly associated with the real
Auth0 user. Data layer verified; app-level display pending a real login.

## 2026-06-23 — Seed script user id is hardcoded (correct but fragile)

`backend/scripts/seedRecipes.ts` hardcodes
`userId = new Types.ObjectId('689b1b8c4756997569c05972')`. Verified this matches
the user's current Auth0 account, so it works today. But it's brittle:
- If the user logs in with a different Auth0 account (or recreates the account),
  the suffix changes and seeded recipes won't appear for them.
- Social connections (e.g. `google-oauth2|<numeric>`) produce a non-24-hex `sub`
  suffix; `getAll` does `new Types.ObjectId(req.userId)`, which would **throw**
  (500) for such a value rather than returning an empty list. Only Auth0
  database-connection users (24-hex sub) work with this design.

Possible improvement (needs user sign-off — do not rewrite working code unasked):
make the seed script take the user id via CLI arg / env var instead of hardcoding.

## 2026-06-23 — Seed scripts: order dependency and orphaned MinIO objects

- Order matters: `upload-recipe-images` must run **before** `seed-recipes`,
  because the seeder reads `scripts/image-mappings.json`, which the uploader
  regenerates with fresh bucket filenames. Running them out of order seeds
  recipes whose `image.filename` points at objects that don't exist.
- Each upload run generates new UUID filenames and does not delete prior objects,
  so repeated runs accumulate orphaned images in the bucket. Harmless on a fresh
  bucket; worth a cleanup step if the scripts are re-run often.
- The stored `image.etag` is not used on read — `getAll` builds the presigned URL
  from `image.filename` only. A stale etag is harmless; a stale filename breaks
  the image. (Also: `recipeController.create` hardcodes the default image's etag
  `409f33f747a2671563173c30a042f778` as a fallback magic constant.)
