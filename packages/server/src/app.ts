import { Hono } from "hono";
import { health } from "./routes/health.js";

/**
 * Assemble the BlazeFW server app. Pure — no listening socket, no env
 * reads — so tests can call `app.request()` directly.
 */
export function createApp(): Hono {
  const app = new Hono();

  app.route("/", health);

  return app;
}
