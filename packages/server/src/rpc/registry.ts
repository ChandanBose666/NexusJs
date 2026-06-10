/** A server-classified function callable over the RPC route. */
export type ServerFn = (args: Record<string, unknown>) => Promise<unknown>;

const registry = new Map<string, ServerFn>();

export function registerServerFn(name: string, fn: ServerFn): void {
  registry.set(name, fn);
}

export function getServerFn(name: string): ServerFn | undefined {
  return registry.get(name);
}

// TODO(phase1.5): generate registry from compiler manifest
