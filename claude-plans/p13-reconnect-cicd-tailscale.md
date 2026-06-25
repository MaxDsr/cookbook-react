# Plan: P13 — Reconnect CI/CD via Tailscale

## Context

The production server was moved behind a Tailscale network. GitHub Actions runners cannot reach it directly, so the deploy job fails at every SSH/SCP step. The pipeline needs to authenticate with Tailscale before attempting any remote connection. The existing `VM_HOST` secret already holds the Tailscale IP (`100.109.195.92`), so no host secret changes are needed.

Additionally, the Caddyfile needs to listen on port `3010` instead of `80`, and the pipeline should reload Caddy after copying the updated config — using `caddy reload --config <path>` which hits Caddy's built-in admin API on `localhost:2019` (no sudo required).

---

## New GitHub Secret Required

| Secret | Value |
|---|---|
| `TAILSCALE_AUTHKEY` | Tailscale ephemeral auth key from admin.tailscale.com |

All other secrets (`VM_HOST`, `VM_USERNAME`, `VM_SSH_KEY`, `VM_PORT`) are unchanged.

---

## Files to Modify

### 1. `caddy/Caddyfile`
- Change `:80` → `:3010`

### 2. `.github/workflows/main.yml`

**a) Tailscale auth step** — add as first step in `deploy` job, before any SSH/SCP:
```yaml
- name: Authenticate with Tailscale
  uses: tailscale/github-action@v2
  with:
    authkey: ${{ secrets.TAILSCALE_AUTHKEY }}
```

**b) All SSH/SCP `host:` fields** — keep using `${{ secrets.VM_HOST }}` (no change)

**c) Caddy reload step** — add after "Start services on VM":
```yaml
- name: Reload Caddy on VM
  uses: appleboy/ssh-action@v0.1.5
  with:
    host: ${{ secrets.VM_HOST }}
    username: ${{ secrets.VM_USERNAME }}
    key: ${{ secrets.VM_SSH_KEY }}
    port: ${{ secrets.VM_PORT }}
    script: caddy reload --config ~/cookbook-react/caddy/Caddyfile
```

> `caddy reload` talks to Caddy's admin API on `localhost:2019` — no sudo, no systemctl.

---

## Verification

1. Add `TAILSCALE_AUTHKEY` secret in GitHub repo → Settings → Secrets and variables → Actions
2. Push a trivial change to `current-work`
3. Watch GitHub Actions run — all steps green
4. SSH into server and confirm: `curl http://localhost:3010` returns frontend HTML
