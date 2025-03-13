# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install additional dependencies for builds
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json ./

# Install dependencies with strict production mode
RUN npm install --omit=dev

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install additional dependencies for builds
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json ./

# Install ALL dependencies (including dev) for build
RUN npm install

# Copy source files and config files
COPY . .

# Set environment to production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Stage 3: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install only production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]