# @blazefw/server

BlazeFW's HTTP server half — the process that answers the RPC calls the
compiler generates for `BoundaryCrossing` functions. Hono on
`@hono/node-server`, long-running container model per
[ADR-001](../../docs/adr/ADR-001-blazefw-runtime-model.md).

---

## RPC wire contract — Phase 0.2 survey findings (2026-06-10)

Surveyed read-only: `packages/compiler/src/` (slicer/transformer.rs),
`packages/vite-plugin/src/` (index.ts, bridge.ts), `apps/web/`,
`turbo.json`, `pnpm-workspace.yaml`.

### 1. What do the generated stubs actually call?

**Nothing yet.** The transformer (`packages/compiler/src/slicer/transformer.rs`,
`build_rpc_stub_body`) replaces a `BoundaryCrossing` function body with:

```js
{
  throw new Error("__blazefw_rpc: '<fnName>' is a server function. Initialize the BlazeFW runtime.");
}
```

No `fetch`, no URL, no method, no body encoding is emitted by the compiler
today. The throwing stub is a placeholder for a runtime that intercepts it.

### 2. What is the *documented/intended* contract?

Both `packages/compiler/README.md` ("RPC stub shape") and
`packages/vite-plugin/README.md` document the intended generated form:

```js
export async function getUser(id) {
  return __blazefw_rpc('/api/__blazefw/getUser', { id });
}
```

- URL pattern: **`/api/__blazefw/<fnName>`** — note `__blazefw`, not
  `__ultimate`. The `/api/__ultimate` prefix from earlier planning docs
  predates the repo-wide "ultimate" → "blazefw" rename; no `__ultimate`
  constant exists anywhere in the codebase.
- Method: not stated in generated code; **`POST`** assumed (args in body).
- Body: **JSON object of named args** (`{ id }`).
- Response: the stub `return`s the call result directly → **raw JSON return
  value of the server function, no envelope** on success. Errors use a
  structured envelope `{"error":{...}}` (defined by this server, Phase 2/3).

### 3. Route decision for this server

- Primary route: `POST /api/__blazefw/:fnName` — matches the repo's
  documented contract.
- Legacy alias: `POST /api/__ultimate/:fnName` — same handler; kept so the
  master-plan wording and older docs keep working. Remove once the compiler
  emits real fetch stubs. `// TODO(phase1.5)`

### Compiler integration gaps

- The compiler does not yet emit a fetch-based RPC stub (only the throwing
  placeholder), so nothing client-side calls this server automatically.
  `// TODO(phase1.5): emit real fetch stubs + generate registry from compiler manifest`
- The vite-plugin defines no constant for the API prefix; when stub emission
  lands, the prefix must be shared between compiler output and this server.
- **Phase 4 fallback taken (2026-06-10):** because the generated client stub
  throws instead of fetching, the demo round trip in `apps/web/src/main.ts`
  calls the route manually via a hand-written `__blazefw_rpc(path, args)`
  helper with the exact documented wire shape (`POST` + JSON args object,
  raw JSON return). When the compiler emits real stubs, the demo helper
  should be deleted and the generated code used instead. The demo app is
  also vanilla TS (no React), so the "component" is a plain button — no
  `.blazefw.tsx` file is routed through the slicer for this round trip.

## Running in dev

- Server only: `pnpm --filter @blazefw/server dev` (tsx watch, port 3000).
- Server + web app together via Turborepo:
  `pnpm turbo run dev --filter=@blazefw/server --filter=@blazefw/demo`
  (root `pnpm dev` also works — it starts every package's watcher).
- The web app's Vite dev server proxies `/api/__blazefw` and
  `/api/__ultimate` to `localhost:3000` (see `apps/web/vite.config.ts`).
