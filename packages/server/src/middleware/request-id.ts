import type { MiddlewareHandler } from "hono";

/** Hono env carrying the per-request ID set by `requestId()`. */
export type RequestIdEnv = { Variables: { requestId: string } };

/**
 * Assign a request ID to every request: honor an incoming `x-request-id`
 * header (so IDs survive proxies), otherwise generate one. The ID is set
 * on the context for downstream middleware and echoed as a response header.
 */
export const requestId = (): MiddlewareHandler<RequestIdEnv> => {
  return async (c, next) => {
    const id = c.req.header("x-request-id") ?? crypto.randomUUID();
    c.set("requestId", id);
    c.header("x-request-id", id);
    await next();
  };
};
