# Session Log

Date-stamped log of work sessions.

---

## 2026-06-18 — Retrofit: project memory bootstrap

- Detected Mode B: code exists, `CLAUDE.md` exists, but `PLAN.md`, `DECISIONS.md`,
  `SESSION_LOG.md` were missing and the existing `known-bugs.md` wasn't in the
  canonical `KNOWN_ISSUES.md` form.
- Investigated: full git history (~140 commits back to 2021), folder structure,
  frontend/backend `package.json`, source trees, `docker-compose.dev/prod.yml`,
  env files, `.gitignore`. Ran backend typecheck (clean) and lint (305 errors,
  mostly Prettier formatting). Ran frontend lint (clean).
- Asked the user for clarification on: risk of credentials in tracked env files
  (confirmed dummy/dev-only), the project's actual purpose (portfolio piece for
  recruiters/hiring teams — per-user recipe manager with image upload), whether to
  track missing tests/lint issues as known issues (yes), and near-term priorities.
- Generated `PLAN.md` (12 phases; P1-P6 reconstructed as DONE from git history),
  `DECISIONS.md`, `KNOWN_ISSUES.md`, and a corrected `README.md`.
- Set **P7 — seed script verification** as `[IN PROGRESS]`, since DB/MinIO are
  freshly reset and the user wants the seeders verified before other local work.
- `known-bugs.md` still exists at repo root (its content is now folded into
  `KNOWN_ISSUES.md`) — flagged for removal, pending user confirmation since the
  6-file system allows no extra files.

Next: review `backend/scripts/seedRecipes.ts` and
`backend/scripts/uploadRecipeImages.ts`, confirm per-user (Auth0 user id) wiring
works against the fresh DB/MinIO, fix if broken.

## 2026-06-23 — P7: Seed scripts verified (data layer)

Traced the full user-id flow and ran both seed scripts against the live
dev containers (`cookbook-mongo`, `cookbook-minio`, both already up).

Key finding — how the user id works end to end:
- Auth0 `sub` is `auth0|<24-hex>`. Frontend (`App.jsx`) and backend
  (`getUserId` middleware) both take the part after `|` as the user id.
- That 24-hex suffix is used as a Mongo `ObjectId`: `recordUser` stores the
  `User` with `_id = ObjectId(auth0Id)`; recipes store `userId = ObjectId(...)`;
  `recipeController.getAll` queries `Recipe.find({ userId: ObjectId(req.userId) })`.
- `seedRecipes.ts` hardcodes `userId = ObjectId('689b1b8c4756997569c05972')`.

Verified against ground truth (no Auth0 login needed): queried the running
Mongo — the only `users` doc has `_id: ObjectId('689b1b8c4756997569c05972')`
(email max101ww+1cbeu@gmail.com). The hardcoded seed id **matches the real,
current Auth0 account**, so seeding is correct as-is. The id survived the DB
reset because Auth0 is external; the login after the reset recreated the user doc.

Ran the scripts (order matters — upload first, it regenerates the mappings
the seeder reads):
1. `npm run upload-recipe-images` → 5 objects in MinIO bucket `recipe-images`
   (4 recipes + `recipe-default.jpg`), `image-mappings.json` regenerated.
2. `npm run seed-recipes` → 4 recipes inserted.

Post-run verification:
- All 4 recipes carry `userId = ObjectId('689b1b8c4756997569c05972')`. ✓
- Each recipe `image.filename` matches an object physically present in MinIO. ✓
  (so `getAll`'s presigned-URL-by-filename will resolve)

Still pending (the one acceptance criterion that needs a real JWT): confirm the
recipes render in the running app after Auth0 login. Backend + frontend were not
started this session; only the data layer was exercised. P7 stays [IN PROGRESS].

Note: `backend/scripts/image-mappings.json` shows as modified in git — that's the
expected, regenerated output of the upload script, not a hand edit.

Next: user runs the app (backend `npm run dev` + frontend `npm run dev`) and
logs in to confirm the 4 seeded recipes appear with images. Decide whether to
parameterize the seed script's user id (see KNOWN_ISSUES) — needs user sign-off
before any rewrite.

## 2026-06-23 — P7: app-level verification + seed parameterization (DONE)

Closed out P7 end to end. User supplied test creds via root `.env`
(`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`) and asked me to run the check via
Playwright.

App-level verification (the criterion that needed a real JWT):
- Started backend (`npm run dev`, :3001) and frontend (`npm run dev`, :3000).
- Drove the Auth0 login via Playwright as max101ww+1cbeu@gmail.com.
- All 4 seeded recipes rendered (names, ingredients, servings, times match the
  seed data). Confirmed via DOM that each `<img>` actually loaded from MinIO
  (`localhost:3003`, real `X-Amz-Signature` presigned URLs, naturalWidth 768–3485,
  none fell back to the placeholder). No console errors. Screenshot captured.

Seed id parameterized (user approved): `seedRecipes.ts` now resolves the user id
from CLI arg / `SEED_USER_ID` env / default constant, with 24-hex validation.
Verified all four paths (default, CLI positional, env, invalid→exit 1) and that
Mongo still holds exactly 4 correctly-associated recipes. typecheck clean.

Two unrelated bugs found and logged (NOT fixed — outside P7 scope):
- `GET /api/test` crashes the whole backend (unawaited `Recipe.save()` with no
  userId → unhandled rejection). Unauthenticated, so a trivial DoS.
- `handleJwtAuthError` falls through to controllers on non-401 errors, so
  unauthenticated `/api/recipes` returns 404 (controller guard) rather than 401.

Dev servers (backend nodemon + frontend vite) were left running at end of
session. Stray screenshot `p7-seeded-recipes-verified.png` written to repo root
by Playwright — remove if not wanted.

Next: confirm P7 sign-off, then pick the next phase. Strong candidates given the
findings: P12 (testing + the `/api/test` crash) or P10 (Auth0 / the JWT
fall-through). Each is a fresh chat per topic discipline.

## 2026-06-23 — P7.5: Backend hardening (DoS test route + DELETE auth bypass + TODO) (DONE)

Fixed three issues found-but-deferred during P7, grouped into one chat by the user.

Code changes (backend):
- Deleted `/api/test`: removed `controllers/testController.ts`, `routes/test.ts`, and
  its import/registration in `routes/index.ts`. Repo-wide grep first confirmed nothing
  else (frontend, compose, CI, Caddy) referenced it.
- `routes/recipes.ts`: added `checkJwtAuth` to `DELETE /recipes/delete/:id` (the only
  recipe route that lacked signature verification).
- `middlewares/checkJwtAuth.ts`: rewrote `handleJwtAuthError` to fail closed — always
  responds, never `next()`s into the controller; normalizes to 401 (403 for scope).
  Also removed a stale embedded expired JWT from a comment.
- `index.ts`: replaced the `// TODO. chek if this is needed` comment with an
  explanatory one; body-parser behavior unchanged (chose not to simplify, to avoid
  touching the P7-verified upload path).

Verification (live, dev containers up):
- `tsc --noEmit` clean.
- curl: `GET /api/test` → 404, backend stays up; forged unsigned JWT with victim
  `sub` DELETE → 401 and "Baker soup" survived (Mongo count unchanged); no-token and
  forged-token `GET /api/recipes` → 401.
- Playwright as the real Auth0 user (max101ww+1cbeu@gmail.com): 4 seeded recipes
  render with MinIO images (GET 200); created a throwaway recipe (POST 200); deleted
  it via the UI (DELETE 200). Mongo restored to the original 4. Backend never crashed
  (nodemon restarted once on the edit; MinIO reconnected both times). Screenshot
  `verify-after-fixes.png` captured then removed.

Decision: targeted auth fix, not the deeper `getUserId` rederive-from-verified-payload
refactor — the vuln is fully closed because every route reading `req.userId` now runs
`auth()` first. The deeper hardening is logged as defense-in-depth for P10.

Next: P7.5 complete. Remaining phases unchanged (P8 dev parity, P9 README, P10 Auth0
incl. the optional getUserId hardening, P11 deps, P12 tests/lint). Each a fresh chat.

## 2026-06-23 — P8: Local dev MinIO parity — closed, premise was stale (DONE)

Investigated P8's two bullets before doing any implementation work, per CLAUDE.md
("ask before guessing" / decisions not in DECISIONS.md). Found the premise didn't
hold:

- Bullet 1 ("compose should run only Mongo+MinIO, frontend/backend via `npm run
  dev`") was already the current state, and already verified working during P7.
- Bullet 2 ("recreate the prod cross-origin fix in dev") targets a bug that
  structurally can't occur in this setup: traced `backend/src/index.ts`'s
  `import 'dotenv/config'` (no path override) to confirm it only ever loads
  `backend/.env`, which sets `MINIO_ENDPOINT=localhost` — browser-reachable
  because backend and browser share `localhost` in dev.
- Rediscovered the actual prod mechanism instead (`publicClient` +
  `MINIO_PUBLIC_*` in `minio.ts`, paired with the Caddy `minio.yourdomain.com`
  subdomain block) — this resolves the long-standing "undocumented fix" entry in
  KNOWN_ISSUES. Confirmed it's dormant (prod's env file doesn't set the vars it
  needs) and left it that way — no live prod target to verify a change against.

Asked the user to confirm scope given these findings (AskUserQuestion: document &
close vs. also clean up the redundant compose file vs. also fix prod env wiring).
User approved: document & close + remove the redundant root `docker-compose.yml`.
Reactivating the dormant prod env wiring was explicitly not selected — deferred.

Changes made:
- Deleted root `docker-compose.yml` (full-container dev setup, hardcoded ports;
  confirmed unreferenced by README, CI, or any script via grep).
- `PLAN.md`: P8 marked `[DONE 2026-06-23]` with the corrected findings.
- `KNOWN_ISSUES.md`: resolved the MinIO cross-origin entry with the rediscovered
  mechanism and its dormant status.
- `DECISIONS.md`: appended two entries (compose file removal; dev-vs-prod
  presigned-URL architecture).

No code/runtime changes were made (doc-only + one file deletion), so no
typecheck/lint/test run applies this session.

Next: pick the next phase. Strong candidates per earlier findings: P10 (Auth0,
includes the deferred `getUserId` hardening) or P12 (testing + lint). Each is a
fresh chat per topic discipline. User has not yet confirmed P8 sign-off or
committed/pushed these changes.
