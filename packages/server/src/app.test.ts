import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "./app.js";

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

describe("GET /health", () => {
  it("returns status, uptime and version", async () => {
    const res = await createApp().request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.uptime).toBe("number");
    expect(body.version).toMatch(/^\d+\.\d+\.\d+/);
  });
});

describe("request id", () => {
  it("generates an x-request-id response header", async () => {
    const res = await createApp().request("/health");
    expect(res.headers.get("x-request-id")).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("honors an incoming x-request-id", async () => {
    const res = await createApp().request("/health", {
      headers: { "x-request-id": "incoming-id-123" },
    });
    expect(res.headers.get("x-request-id")).toBe("incoming-id-123");
  });

  it("logs one JSON line per request with the same requestId", async () => {
    const res = await createApp().request("/health", {
      headers: { "x-request-id": "log-test-id" },
    });
    expect(res.status).toBe(200);
    const line = JSON.parse(logSpy.mock.calls.at(-1)![0] as string);
    expect(line).toMatchObject({
      requestId: "log-test-id",
      method: "GET",
      path: "/health",
      status: 200,
    });
    expect(typeof line.durationMs).toBe("number");
    expect(typeof line.ts).toBe("string");
  });
});

describe("error handling (/__boom)", () => {
  it("returns a structured 500 without leaking the stack", async () => {
    const res = await createApp().request("/__boom");
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error.message).toBe("Internal server error");
    expect(typeof body.error.requestId).toBe("string");
    expect(JSON.stringify(body)).not.toContain("deliberate test error");
    expect(JSON.stringify(body)).not.toContain("at "); // no stack frames
  });

  it("error response carries the request id in body and header", async () => {
    const res = await createApp().request("/__boom", {
      headers: { "x-request-id": "boom-id" },
    });
    const body = await res.json();
    expect(body.error.requestId).toBe("boom-id");
    expect(res.headers.get("x-request-id")).toBe("boom-id");
  });

  it("logs the error with the same requestId and stack", async () => {
    await createApp().request("/__boom", {
      headers: { "x-request-id": "boom-log-id" },
    });
    const line = JSON.parse(errorSpy.mock.calls.at(-1)![0] as string);
    expect(line.requestId).toBe("boom-log-id");
    expect(line.msg).toContain("deliberate test error");
    expect(line.stack).toBeDefined();
  });

  it("request log line records status 500 for errored requests", async () => {
    await createApp().request("/__boom", {
      headers: { "x-request-id": "boom-status-id" },
    });
    const line = JSON.parse(logSpy.mock.calls.at(-1)![0] as string);
    expect(line).toMatchObject({ requestId: "boom-status-id", status: 500 });
  });
});
