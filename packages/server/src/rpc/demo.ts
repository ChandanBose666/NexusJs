import { registerServerFn } from "./registry.js";

/**
 * Hand-registered demo function — proves the RPC route end to end.
 * Auto-registration from compiler output is out of scope this week.
 */
export function registerDemoFunctions(): void {
  registerServerFn("getServerTime", async () => ({
    now: new Date().toISOString(),
    pid: process.pid,
  }));
}
