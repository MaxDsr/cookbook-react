# Dockerfile for Caddy web server
# Serves the built React frontend from frontend/dist/

FROM caddy:2-alpine

# Copy Caddyfile configuration
COPY caddy/Caddyfile /etc/caddy/Caddyfile

# Copy built frontend files
COPY frontend/dist/ /srv/

# Expose port 80
EXPOSE 80

# Caddy runs automatically with the default CMD

