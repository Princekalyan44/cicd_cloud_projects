# Multi-stage Dockerfile for Next.js application
# This creates an optimized production image

# ============================================
# Stage 1: Dependencies
# Install all dependencies needed for build
# ============================================
FROM node:20-alpine AS deps

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
# Docker caches layers, so if package.json doesn't change, this layer is reused
COPY package.json package-lock.json ./

# Install dependencies
# --ci uses package-lock.json for reproducible builds
RUN npm ci --only=production

# ============================================
# Stage 2: Builder
# Build the Next.js application
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
# This creates optimized static files in .next directory
RUN npm run build

# ============================================
# Stage 3: Runner
# Create minimal production image
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
# Running as root is a security risk
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
