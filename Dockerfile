# @blazefw/server — production image (PHASE1_SERVER_WEEK1 Phase 5).
# Rust is intentionally NOT installed: the Rust compiler binary is a
# build-time concern of the *web app* build; the server's tsc build has no
# workspace dependencies and never invokes the compiler.
# node:22 (not node:20 as the plan sketched) — Node 20 reached EOL 2026-04;
# 22 is the active LTS and matches the package's @types/node@^22.

# ---- build stage ----
FROM node:22-slim AS build
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /repo
# Full workspace context (trimmed by .dockerignore) so pnpm's lockfile
# importers all resolve; only the server's deps are actually installed.
COPY . .
RUN pnpm install --filter @blazefw/server --frozen-lockfile
RUN pnpm --filter @blazefw/server build
# Pruned standalone bundle: package files + production node_modules only.
RUN pnpm --filter @blazefw/server --prod deploy /prod/server

# ---- runtime stage ----
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/server .
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/index.js"]
