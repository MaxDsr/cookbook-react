# Caddy Local Testing Setup

This directory contains the configuration for running Caddy in Docker to serve your built React frontend locally.

## Prerequisites

- Docker installed and running
- Built frontend files in `frontend/dist/`
- `.env` file in project root with `BACKEND_PORT` defined
- Backend running on host machine

## Quick Start

### 1. Build the Frontend

First, ensure your frontend is built and the build is in the `frontend/dist`

```bash
cd frontend
npm run build
cd ..
```

### 2. Build the Caddy Docker Image

From the root of the project:
```bash
docker build -f caddy/Dockerfile -t cookbook-caddy .
```

### 3. Run the Caddy Container

Run with environment variables from `.env` file:

```bash
docker run -p 127.0.0.1:3005:80 --env-file .env --name caddy-cookbook cookbook-caddy
```

**Note**: The `--env-file .env` flag passes the `BACKEND_PORT` to Caddy for API proxy configuration.

### 4. Access Your Application

Open your browser and navigate to:
```
http://localhost:3005
```

## Docker Commands

### Stop the Container
```bash
docker stop caddy-cookbook
```

### Start the Container Again
```bash
docker start caddy-cookbook
```

### Remove the Container
```bash
docker rm caddy-cookbook
```

### View Logs
```bash
docker logs -f caddy-cookbook
```

### Rebuild After Frontend Changes

If you make changes to your frontend:

1. Rebuild the frontend:
   ```bash
   cd frontend && npm run build && cd ..
   ```

2. Remove old container and image:
   ```bash
   docker stop caddy-cookbook
   docker rm caddy-cookbook
   docker rmi cookbook-caddy
   ```

3. Rebuild and run (from project root):
   ```bash
   docker build -f caddy/Dockerfile -t cookbook-caddy .
   docker run -p 127.0.0.1:3005:80 --env-file .env --name caddy-cookbook cookbook-caddy
   ```

## Configuration

- **Caddyfile**: Contains the Caddy web server configuration
  - Serves files from `/srv` inside the container
  - HTTP only (no SSL/TLS)
  - Reverse proxy for `/api/*` requests to `host.docker.internal:{$BACKEND_PORT}`
  - Includes SPA fallback for React Router
  - Gzip compression enabled

- **Dockerfile**: Defines the Docker image
  - Based on `caddy:2-alpine`
  - Copies built files from `frontend/dist/`
  - Exposes port 80 internally

- **Port Mapping**: `127.0.0.1:3005:80`
  - Host: `localhost:3005`
  - Container: port `80`
  - Bound to localhost only for security

- **Environment Variables**: Read from `.env` file
  - `BACKEND_PORT`: Port where backend is running on host machine (default: 3001)
  - Passed to container via `--env-file .env` flag

## Troubleshooting

### Container won't start
- Check if port 3005 is already in use: `lsof -i :3005`
- Check Docker logs: `docker logs caddy-cookbook`
- Ensure `.env` file exists in project root with `BACKEND_PORT` defined

### API requests failing (502 Bad Gateway)
- Ensure backend is running on the host machine on the specified port
- Check that `BACKEND_PORT` in `.env` matches your backend's actual port
- Verify backend is accessible at `localhost:$BACKEND_PORT`
- Docker Desktop on macOS should support `host.docker.internal` by default

### Files not updating
- Make sure to rebuild the frontend before rebuilding the Docker image
- Remove the old image completely before rebuilding

### 404 errors on routes
- The Caddyfile includes `try_files` directive for SPA routing
- If issues persist, check that `index.html` exists in `frontend/dist/`

