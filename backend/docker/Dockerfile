# STAGE 1: Build
FROM node:24.11.0-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Production dependencies only
FROM node:24.11.0-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# STAGE 3: Final runtime
FROM node:24.11.0-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Fix ownership for when you add logging/uploads later
RUN chown -R node:node /app
USER node

CMD ["node", "dist/index.js"]