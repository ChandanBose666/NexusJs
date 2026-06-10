import type { MiddlewareHandler } from "hono";
import type { RequestIdEnv } from "./request-id.js";

/**
 * One JSON line per request to stdout:
 * `{ts, requestId, method, path, status, durationMs}`.
 * Hono's composer routes thrown errors through `app.onError` before this
 * middleware's `next()` resolves, so error responses are logged too.
 */
export const requestLogger = (): MiddlewareHandler<RequestIdEnv> => {
  return async (c, next) => {
    const startedAt = performance.now();
    await next();
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        requestId: c.get("requestId"),
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
        durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
      }),
    );
  };
};
