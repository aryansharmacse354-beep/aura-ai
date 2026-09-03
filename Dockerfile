# ==========================================
# Multi-Stage Production Dockerfile for AuraPredict AI
# ==========================================

# 1. Builder Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies including devDependencies for build
RUN npm ci

# Copy full application source
COPY . .

# Build client SPA and compile backend server to dist/server.cjs
ENV NODE_ENV=production
RUN npm run build

# 2. Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built production assets and compiled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data 2>/dev/null || true

# Run as non-root user for enterprise container security
USER node

# Expose standard container port
EXPOSE 3000

# Health check definition
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start production server
CMD ["node", "dist/server.cjs"]
