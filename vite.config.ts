import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // Polling keeps HMR reliable on synced/virtual filesystems where
  // native watchers can miss edits.
  server: {
    watch: { usePolling: true, interval: 150 },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    // TanStack Start plugin must run before React's plugin.
    //
    // SSR build: `vite build` emits the server bundle plus dist/client
    // (hashed static assets). Nitro detects the hosting preset at build
    // time (Vercel on Vercel, no extra config) and produces the correct
    // functions + static output. Without `nitro()`, Vercel treats this
    // as a plain Vite SPA, serves the wrong output directory, and every
    // route returns the platform 404 (NOT_FOUND).
    //
    // Rendering happens on the server per request, so site code must be
    // SSR-safe: never touch browser-only globals (window, document,
    // localStorage, navigator) during render or at module top level — only
    // inside effects/handlers, or guarded with `typeof window !== "undefined"`.
    tanstackStart({
      server: { entry: "server" },
    }),
    nitro(),
    react(),
    tailwindcss(),
  ],
});
