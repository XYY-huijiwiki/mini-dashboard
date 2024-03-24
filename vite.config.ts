import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

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
      basicSsl(),
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
    server: {
      host: true,
    },
    base:
      command === "build"
        ? "https://polite-tree-0c356a700.4.azurestaticapps.net/"
        : "/",
  };
});
