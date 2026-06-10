import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../app.js";
import { registerServerFn } from "../rpc/registry.js";

let logSpy: ReturnType<typeof vi.spyOn>;
let errorSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  errorSpy.mockRestore();
});

function callRpc(path: string, body: string) {
  return createApp().request(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("POST /api/__blazefw/:fnName", () => {
  it("round-trips the registered demo function", async () => {
    const res = await callRpc("/api/__blazefw/getServerTime", "{}");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.now).toBe("string");
    expect(Number.isNaN(Date.parse(body.now))).toBe(false);
    expect(body.pid).toBe(process.pid);
  });

  it("serves the same functions on the legacy /api/__ultimate alias", async () => {
    const res = await callRpc("/api/__ultimate/getServerTime", "{}");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.pid).toBe(process.pid);
  });

  it("passes named args through to the function", async () => {
    registerServerFn("echo", async (args) => ({ got: args }));
    const res = await callRpc("/api/__blazefw/echo", JSON.stringify({ a: 1, b: "x" }));
    expect(await res.json()).toEqual({ got: { a: 1, b: "x" } });
  });

  it("returns 404 with a structured error for unknown functions", async () => {
    const res = await callRpc("/api/__blazefw/noSuchFn", "{}");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.message).toBe("Unknown server function");
    expect(body.error.fn).toBe("noSuchFn");
    expect(typeof body.error.requestId).toBe("string");
  });

  it("returns 400 with a structured error for malformed JSON", async () => {
    const res = await callRpc("/api/__blazefw/getServerTime", "{not json");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.message).toBe("Malformed JSON body");
    expect(typeof body.error.requestId).toBe("string");
  });

  it("returns 400 when the body is not a JSON object", async () => {
    const res = await callRpc("/api/__blazefw/getServerTime", "[1,2]");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.message).toMatch(/JSON object/);
  });

  it("routes a throwing function through the structured 500 handler", async () => {
    registerServerFn("alwaysThrows", async () => {
      throw new Error("secret internal detail");
    });
    const res = await callRpc("/api/__blazefw/alwaysThrows", "{}");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.message).toBe("Internal server error");
    expect(typeof body.error.requestId).toBe("string");
    expect(JSON.stringify(body)).not.toContain("secret internal detail");
  });
});
