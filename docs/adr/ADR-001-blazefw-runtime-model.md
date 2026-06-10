# ADR-001: BlazeFW Runtime & Deployment Model

Status: Accepted — 2026-06-10

## Context

BlazeFW's client half (compiler, renderers, static demo) deploys today as a
static Vite build on Vercel. The server half — the HTTP runtime that answers
compiler-generated RPC calls now, and the CRDT WebSocket sync server later —
did not exist until Phase 1 of the server roadmap, and we had to decide what
kind of process it would be before writing it.

Two superficially similar problems pushed in opposite directions and were
repeatedly conflated in earlier planning:

1. **The Rust compiler binary.** `@blazefw/vite-plugin` shells out to
   `blazefw-compiler` (or falls back to WASM). Serverless platforms without
   a Rust toolchain made this look like a "we need our own server" problem.
2. **The CRDT sync server.** `@blazefw/sync-server` holds WebSocket
   connections and in-memory Automerge documents per room. Connections are
   long-lived and documents are stateful between requests.

These are different problems: (1) is a **build-time** concern — it only
matters on the machine that runs `vite build` — while (2) is a **runtime**
concern that exists for the whole life of the application.

## Decision

The BlazeFW server half (HTTP RPC runtime now; CRDT WebSocket sync in
Phase 3) runs as a **single long-running container**, targeted at **Fly.io**.
It is explicitly **not** serverless.

- The HTTP runtime is `@blazefw/server` (Hono on `@hono/node-server`),
  built into a multi-stage Docker image (repo-root `Dockerfile`,
  `node:22-slim`, non-root, `HEALTHCHECK` on `/health`).
- Rust is **excluded** from the server image. The compiler binary is solved
  separately, at build time, by whichever image builds the *web app* —
  never by the runtime container.
- The web half stays on Vercel as a static deployment; in dev, Vite proxies
  `/api/__blazefw` (and the legacy `/api/__ultimate` alias) to the container.

## Alternatives considered

1. **Serverless functions (Vercel Functions / Lambda).**
   Rejected. The Phase 3 sync server needs persistent WebSocket connections
   and per-room in-memory CRDT state; function instances are recycled and
   cannot guarantee either. Splitting HTTP onto serverless while sync runs
   elsewhere would mean two runtimes, two deploy paths, and two failure
   modes for one logical server.
2. **Edge runtimes (Workers + Durable Objects).**
   Durable Objects could host per-room CRDT state, and remain a future
   roadmap candidate (noted in the README). Rejected for now: it would
   force the Automerge WASM + binary-frame protocol into a non-Node runtime
   before the protocol has even been operated once. Operate it on plain
   Node first; port from evidence later.
3. **VPS / bare VM.** Workable, but Fly.io gives the same long-running
   container with health checks, volumes (Phase 3 persistence), regional
   placement, and a built-in WebSocket-friendly proxy, with less to operate.
4. **Bundling the sync server into the Vite dev process permanently.**
   Fine for local dev, not a deployment story; rejected as the production
   model.

## Consequences

- The server is one Docker image, deployable anywhere a container runs;
  Fly.io specifics stay in config, not code.
- `@blazefw/server` must assume a single persistent process (in-memory
  registry and, later, in-memory documents + GC). Horizontal scaling of the
  sync server is deliberately out of scope until Phase 3 measures real load.
- The runtime image stays Rust-free, so server image builds are fast and
  the compiler toolchain cannot leak into runtime dependencies.
- Deployment (Fly.io app, secrets, volumes, operating under a small real
  workload) is the Phase 2 checkpoint of the server roadmap — this ADR
  fixes the model so that work is mechanical.
