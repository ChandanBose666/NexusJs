import { defineConfig } from "vite";
import { blazefw } from "@blazefw/vite-plugin";

export default defineConfig({
  plugins: [
    blazefw({
      sync: false,      // no persistent WebSocket server on Vercel
      sidecar: true,    // Web Worker sidecar works in static deployments
      inspector: false, // DevTools overlay not needed in production
      a11y: true,       // WCAG scanner always on
    }),
  ],
  server: {
    proxy: {
      // RPC calls go to @blazefw/server in dev — keeps the server URL out
      // of client code. __ultimate is the legacy alias of __blazefw.
      "/api/__blazefw": "http://localhost:3000",
      "/api/__ultimate": "http://localhost:3000",
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
  },
});
