# Stage 1: Build the application
FROM oven/bun:1.3.5 AS builder
WORKDIR /app

# Copy the monorepo source code
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Build the project using turbo
RUN bun run build

# Stage 2: Run the application
FROM oven/bun:1.3.5-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

# Copy necessary standalone files and public folders
# We use the Next.js standalone output to keep the image size small.
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

# Optional: if you have an apps/site as well, you'd add those copies here.

EXPOSE 3000

# Run the standalone server
CMD ["bun", "apps/web/server.js"]
