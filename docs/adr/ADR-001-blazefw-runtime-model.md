# ADR-001: BlazeFW Runtime & Deployment Model

Status: Accepted — 2026-06-10

> NOTE: This is the minimal stub version placed per PHASE1_SERVER_WEEK1.md
> Phase 0.1. The owner has the full version; replace this file with it when
> available.

Decision: The BlazeFW server half (HTTP + future CRDT sync) runs as a
long-running container (target host: Fly.io), NOT serverless.

Rationale: The Rust compiler binary is a BUILD-TIME concern (solved by
including Rust in the build image). The CRDT WebSocket server is a RUNTIME
concern requiring a persistent process — incompatible with serverless.
These are two problems with opposite fixes; this ADR fixes the runtime one.
