import { Hono } from "hono";
import type { RequestIdEnv } from "../middleware/request-id.js";
import { getServerFn } from "../rpc/registry.js";

/**
 * The RPC route the compiler's client stubs call:
 * `POST /<prefix>/:fnName` with a JSON object of named args in the body,
 * responding with the function's raw JSON return value (no envelope).
 * Contract recorded in ../../README.md (Phase 0.2 survey).
 */
export const rpc = new Hono<RequestIdEnv>();

rpc.post("/:fnName", async (c) => {
  const fnName = c.req.param("fnName");
  const requestId = c.get("requestId");

  const fn = getServerFn(fnName);
  if (!fn) {
    return c.json(
      { error: { message: "Unknown server function", fn: fnName, requestId } },
      404,
    );
  }

  let args: unknown;
  try {
    args = await c.req.json();
  } catch {
    return c.json({ error: { message: "Malformed JSON body", requestId } }, 400);
  }
  if (typeof args !== "object" || args === null || Array.isArray(args)) {
    return c.json(
      { error: { message: "Request body must be a JSON object of named args", requestId } },
      400,
    );
  }

  // A throwing function is handled by the app-level error handler (structured 500).
  const result = await fn(args as Record<string, unknown>);
  return c.json(result ?? null);
});
