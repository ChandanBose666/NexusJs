import { Hono } from "hono";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// Resolves to packages/server/package.json from both src/ (tsx) and dist/ (built).
const pkg = require("../../package.json") as { version: string };

export const health = new Hono();

health.get("/health", (c) =>
  c.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    version: pkg.version,
  }),
);
