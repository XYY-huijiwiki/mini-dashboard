import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === "model-viewer",
          },
        },
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      monacoEditorPlugin({}),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "node:buffer": "buffer",
      },
    },
    build: {
      manifest: true,
      minify: "terser",
    },
    base:
      command === "build"
        ? "https://cdn.jsdelivr.net/gh/XYY-huijiwiki/mini-dashboard@dist/"
        : "/",
  };
});
