import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defaultServerConditions, defineConfig } from "vite";

export default defineConfig(({ command }) => {
  return {
    // Polling keeps HMR reliable on synced/virtual filesystems where
    // native watchers can miss edits.
    server: {
      watch: { usePolling: true, interval: 150 },
    },
    resolve: {
      tsconfigPaths: true,
    },
    // The server bundle runs as a Cloudflare Worker — there is no node_modules
    // at runtime. Vite's default SSR build leaves npm deps as bare external
    // imports, which resolve on a Node server but throw "No such module" in a
    // Worker. Bundle them all in. (node: builtins stay external —
    // nodejs_compat provides them.)
    // BUILD ONLY: `vite dev` SSR runs in Node where externalized deps are
    // correct — noExternal there makes the dev module runner evaluate CJS
    // deps (react) as ESM and crash with "module is not defined".
    ssr: {
      // BUILD ONLY: the SSR bundle targets a worker runtime, so resolve
      // bundled deps through the edge export conditions (workerd/worker/
      // browser) instead of the Node variant.
      // `vite dev` SSR runs in Node, where default node resolution is correct.
      ...(command === "build"
        ? {
            target: "webworker" as const,
            resolve: {
              conditions: [
                "workerd",
                "worker",
                "browser",
                ...defaultServerConditions.filter((c) => c !== "node"),
              ],
            },
          }
        : {}),
      noExternal: command === "build" ? true : undefined,
      // `cloudflare:workers` is a workerd runtime built-in. Like node:
      // builtins it must NOT be bundled; the runtime provides it.
      // (`ssr.external` is typed string[].)
      external: ["cloudflare:workers"],
    },
    build: {
      // Keep `cloudflare:*` external in the SSR rollup pass too — `noExternal`
      // above would otherwise try to resolve+bundle it and fail.
      rollupOptions: { external: [/^cloudflare:/] },
    },
    plugins: [
      // TanStack Start plugin must run before React's plugin.
      //
      // SSR build: `vite build` emits a Workers-shaped server bundle
      // (dist/server/server.js — `export default { fetch }`) plus dist/client
      // (hashed static assets).
      //
      // Rendering happens on the server per request, so site code must be
      // SSR-safe: never touch browser-only globals (window, document,
      // localStorage, navigator) during render or at module top level — only
      // inside effects/handlers, or guarded with `typeof window !== "undefined"`.
      tanstackStart({
        server: { entry: "server" },
      }),
      react(),
      tailwindcss(),
    ],
  };
});
