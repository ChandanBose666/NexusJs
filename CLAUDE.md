# Nexus.js — Project Context for Claude

## What This Project Is
A high-performance JavaScript framework with a Rust compiler core. It aims to:
- Automatically split components into server/client bundles ("Fluid Execution")
- Provide a semantic UI primitive system (`<Stack>`, `<Text>`, `<Action>`, `<Input>`)
- Sync state via CRDT/WebAssembly with no manual fetch calls ("Zero-Fetch Sync")
- Offload 3rd-party scripts to a Web Worker sidecar (Partytown-style)

## Monorepo Structure
```
NexusJs/
├── apps/
│   └── web/                  # Vite dev app (future: demo/docs site)
├── packages/
│   ├── compiler/             # Rust crate — SWC-based AST analysis + WASM output
│   ├── core/                 # (upcoming) TS runtime core
│   ├── primitives/           # TS types: Stack/Text/Action/Input + NexusRenderer<TNode>
│   ├── web/                  # Web renderer: maps primitives → HTML + inline styles
│   └── native/               # Native renderer: maps primitives → React Native View/Text/Pressable/TextInput
├── docs/
│   └── action-plan.md        # Master task list (5 phases)
├── package.json              # Root — turbo dev/build/test scripts
├── pnpm-workspace.yaml       # Workspaces: packages/* and apps/*
└── turbo.json                # Pipeline: build depends on ^build; dev is persistent
```

## Tech Stack Decisions
| Layer | Choice | Reason |
|---|---|---|
| Package manager | pnpm | Workspace support, fast installs |
| Monorepo orchestration | Turborepo | Task caching, parallel execution, `dependsOn` ordering |
| Compiler | Rust + SWC | AST-level analysis, WASM output for browser use |
| Dev app | Vite | Fast HMR, plugin API for future nexus-compiler integration |
| WASM bridge | wasm-bindgen | Standard Rust→JS interop |

## Rust Crate: packages/compiler
### Working versions (as of Task 2.1)
```toml
swc_core = { version = "59.0.1", features = ["ecma_parser", "ecma_ast", "ecma_visit", "__common"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
wasm-bindgen = "0.2"
```

### Key lessons from version resolution
- `swc_core` versioning jumped from `0.x` to `59.x` — always run `cargo search swc_core` to find current version
- `swc_core 0.90` used `serde::__private` (removed in serde 1.0.172+) — incompatible with modern serde
- The `__common` feature must be explicitly enabled to access `swc_core::common::{FileName, SourceMap}`
- Do NOT add `swc_ecma_parser` or `swc_ecma_visit` as separate dependencies — they conflict with swc_core's internal versions
- `new_source_file()` requires owned data: pass `src.to_string()`, not `src` or `src.into()`

### Module structure
```
src/
├── lib.rs              — declares all modules
├── triggers.rs         — Trigger enum + CLIENT/SERVER_TRIGGERS constants
├── scanner.rs          — CapabilityScanner: detects browser globals
├── secret_scanner.rs   — SecretScanner: detects process.env + DB imports
└── slicer/
    ├── mod.rs          — re-exports Classifier, Transformer, SliceResult
    ├── classifier.rs   — two-pass AST classifier (5 DeclKinds)
    └── transformer.rs  — produces server/client JS via swc_ecma_codegen
```

### Vite plugin design decisions
- Nexus files use `.nexus.tsx` / `.nexus.ts` extension to opt into slicing
- The plugin calls the Rust binary as a subprocess via `spawnSync` (stdin → stdout JSON)
- Binary resolution order: `NEXUS_COMPILER_BIN` env var → release build → debug build
- Results cached per file ID — cleared on HMR hot update
- SSR detection via `options?.ssr` (Vite 5 transform hook second arg)
- Source maps not yet emitted — pending swc codegen source map support (future task)
- `packages/vite-plugin` is a separate workspace package (`@nexus/vite-plugin`)

### Slicer design decisions
- `DeclKind` has 5 variants: ServerOnly, ClientOnly, Shared, BoundaryCrossing, Mixed
- Classifier runs two passes: (1) direct trigger scan per declaration, (2) cross-boundary call graph analysis
- BoundaryCrossing = server fn called from client context → gets RPC stub in client bundle
- Mixed = same fn uses both browser APIs and server secrets → flagged as error
- `Str.value` in swc v59 is `Wtf8Atom` — use `.into()` for `String → Wtf8Atom` conversion (works via From impl)
- `Ident::new(sym, span, ctxt)` constructor takes 3 args in swc v59
- `BlockStmt` has a `ctxt: SyntaxContext` field in swc v59 — use `Default::default()`
- Transformer uses `module.body.retain()` for filtering, `VisitMut` for RPC stub injection

## Completed Tasks
- [x] Task 1.1 — Monorepo initialized (pnpm + Turborepo)
- [x] Task 1.2 — Rust compiler crate created (packages/compiler)
- [x] Task 1.3 — Cargo.toml configured with swc_core, serde, wasm-bindgen
- [x] Task 1.4 — Dev pipeline configured (turbo dev with dependsOn + Vite config)
- [x] Task 2.1 — CapabilityScanner: detects window, document, localStorage
- [x] Task 2.2 — SecretScanner: detects process.env + DB imports (ESM + require + node: protocol)
- [x] Task 2.3 — Slicer: Classifier (5 DeclKinds + BoundaryCrossing detection) + Transformer (server/client JS output + RPC stubs)

- [x] Task 2.4 — Vite Plugin + Rust CLI binary (`nexus-compiler`) with stdin/stdout JSON bridge

- [x] Task 3.1 — Core Interface: TypeScript types for `<Stack>`, `<Text>`, `<Action>`, `<Input>` + `NexusRenderer<TNode>` contract
- [x] Task 3.2 — Web Renderer: `@nexus/web` package — maps all four primitives to React/HTML using inline styles + CSS variables

## Web Renderer design decisions (Task 3.2)
- Package: `packages/web` (`@nexus/web`), peer depends on React ^18 || ^19
- Styling strategy: inline styles for everything (colors, spacing, layout) so the renderer is self-contained — no Tailwind config required
- Colors: all `ColorToken` values resolve to `--nexus-*` CSS custom properties; theme is injected at app root
- Spacing: `SpaceScale` integers map to Tailwind's 4px-unit convention (1→4px, 2→8px, etc.); `"Npx"` and `"N%"` strings pass through unchanged
- `NexusRenderer<ReactElement>` is satisfied in `renderer.ts`; children cast is safe because React always passes ReactNode at runtime
- `Spinner` in Action is defined at module level (not inline) to avoid re-mount on each render
- Static style maps hoisted outside components to avoid object recreation per render
- Input bridges `onChange(value: string)` and `onSubmit(value: string)` to the native React event API
- Action renders `<a>` when `href` is set, `<button type="button">` otherwise; `link` variant skips size padding

- [x] Task 3.3 — Native Renderer: `@nexus/native` — maps all four primitives to React Native components

## Native Renderer design decisions (Task 3.3)
- Package: `packages/native` (`@nexus/native`), peer depends on React ^18||^19 + react-native >=0.72
- `@types/react-native` is deprecated — modern RN ships its own types; use `@types/react@^19`
- SpaceValue → dp numbers (unitless, 4dp-per-unit convention matching web renderer)
- ColorToken → resolved against DEFAULT_THEME (hex strings); exported so apps can read the palette
- No CSS custom properties in RN — DEFAULT_THEME is a plain Record<ColorToken, string>
- `as` prop (HTML element override) is web-only — silently ignored in native renderer
- `external` prop is web-only (target="_blank") — ignored in native; all URLs open via Linking
- Action uses `ActivityIndicator` for loading state (native spinner, no animation CSS needed)
- Input uses `aria-required` / `aria-invalid` (new-arch RN accessibility API, not deprecated `accessibilityRequired`)
- Icon slots render the raw icon string — intended to be swapped for an icon library in user code

## In Progress
- [ ] Task 3.4 — Email Renderer

## Turborepo Pipeline Logic
- `build` depends on `^build` — upstream packages build first
- `dev` depends on `^build` + persistent/uncached — compiler builds before Vite starts
- `outputs: ["dist/**", "pkg/**"]` — caches both TS and WASM build artifacts
- `apps/web` declares `@nexus/compiler: workspace:*` — this is what tells Turbo the dependency edge

## Environment Notes
- User is on Windows 11, uses Git Bash (MINGW64) inside VS Code
- `cargo` is NOT on Git Bash PATH by default — must run Rust commands in Windows CMD or fix with: `echo 'export PATH="/c/Users/Asus/.cargo/bin:$PATH"' >> ~/.bashrc`
- `pnpm` installed globally via `npm install -g pnpm`
- Rust installed via rustup-init.exe (not via VS Code rust-analyzer extension)

## Collaboration Preferences
- Test all Rust code with `cargo test` before declaring a task complete
- When version errors occur: use `cargo search <crate>` to find current version rather than guessing
- Explain the "why" behind architectural decisions, not just the "what"
- Complete any mentioned follow-up suggestions before moving to the next task
