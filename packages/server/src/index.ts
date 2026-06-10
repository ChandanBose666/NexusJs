import { serve } from "@hono/node-server";
import { pathToFileURL } from "node:url";
import { createApp } from "./app.js";

export { createApp } from "./app.js";

/** Start the HTTP server. Reads PORT from env (default 3000). */
export function start(): void {
  const port = Number(process.env.PORT ?? 3000);
  const app = createApp();

  serve({ fetch: app.fetch, port }, (info) => {
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        msg: "blazefw-server listening",
        port: info.port,
      }),
    );
  });
}

// Run when executed directly (`tsx watch src/index.ts` / `node dist/index.js`),
// not when imported as a library.
const entry = process.argv[1];
if (entry !== undefined && import.meta.url === pathToFileURL(entry).href) {
  start();
}
