# Cookbook app

A personal portfolio project: a recipe manager where each user creates, edits,
and deletes their own recipes (with images), visible only to them. Built to
demonstrate full-stack skills for technical recruiters and hiring teams.

## Stack

- **Frontend**: React 19, Redux Toolkit, React Router, Auth0 (`@auth0/auth0-react`), plain CSS per component
- **Backend**: Express + TypeScript, Mongoose/MongoDB, MinIO (S3-compatible object storage), Auth0 JWT verification, Multer for uploads
- **Dev infra**: Docker Compose, Caddy (production reverse proxy)
- **CI**: GitHub Actions (`.github/`)

## Documentation

- `PLAN.md` — phased roadmap
- `DECISIONS.md` — architectural choices
- `KNOWN_ISSUES.md` — active bugs
- `SESSION_LOG.md` — work log

## Status

Backend, Auth0 login, and MinIO-backed image storage are implemented (not yet
re-verified end-to-end against the current fresh database/storage — see
`PLAN.md` P7). The local dev workflow and this README are being modernized;
the previous production deployment is currently offline.
