import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://cdn.jsdelivr.net/gh/XYY-huijiwiki/Base64-file-uploader@main/dist/',
  build: {
    manifest: true,
  },
  plugins: [vue(), Components({
    resolvers: [
      NaiveUiResolver(),
    ],
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
