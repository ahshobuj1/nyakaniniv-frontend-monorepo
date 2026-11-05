# Stage 1: Prune the monorepo for apps/web
FROM oven/bun:1.3.5 AS pruner
WORKDIR /app
COPY . .
RUN bunx turbo prune web --docker

# Stage 2: Install dependencies & build
FROM oven/bun:1.3.5 AS builder
WORKDIR /app

# First copy only dependency manifests to leverage Docker layer caching
COPY --from=pruner /app/out/json/ .
RUN bun install --frozen-lockfile

# Copy full source code for the pruned packages
COPY --from=pruner /app/out/full/ .

# Set environment variables for the build
ARG NEXT_PUBLIC_API_URL=https://api.upbeat.africa
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the project using turbo
RUN bun run build

# Stage 3: Run the application
FROM oven/bun:1.3.5-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=https://api.upbeat.africa
ENV PORT=3000

# Copy necessary standalone files and public folders
# We use the Next.js standalone output to keep the image size small.
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000

# Run the standalone server
CMD ["bun", "apps/web/server.js"]
