import { Hono } from "hono";
import { requestId, type RequestIdEnv } from "./middleware/request-id.js";
import { requestLogger } from "./middleware/logging.js";
import { health } from "./routes/health.js";

/**
 * Assemble the BlazeFW server app. Pure — no listening socket, no env
 * reads beyond NODE_ENV gating — so tests can call `app.request()` directly.
 */
export function createApp(): Hono<RequestIdEnv> {
  const app = new Hono<RequestIdEnv>();

  app.use(requestId());
  app.use(requestLogger());

  app.onError((err, c) => {
    const id = c.get("requestId");
    console.error(
      JSON.stringify({
        ts: new Date().toISOString(),
        requestId: id,
        msg: err.message,
        stack: err.stack,
      }),
    );
    // Never leak the stack (or message) to the client.
    return c.json({ error: { message: "Internal server error", requestId: id } }, 500);
  });

  app.route("/", health);

  // Dev-only route to exercise the error handler end to end.
  if (process.env.NODE_ENV !== "production") {
    app.get("/__boom", () => {
      throw new Error("deliberate test error from /__boom");
    });
  }

  return app;
}
