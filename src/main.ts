import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { langPacks, langCode } from "@/locales";
import { createPinia } from "pinia";

(async () => {
  // i18n
  const messages = { [langCode]: await langPacks[langCode]() };
  const i18n = createI18n({
    legacy: false,
    locale: langCode,
    fallbackLocale: langCode,
    messages,
  });

  // pinia
  const pinia = createPinia();

  // vue
  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.use(pinia);
  app.mount("#base64-file-manager");
})();

// if not in dev mode, try to load dev
if (import.meta.env.PROD) {
  const src = `http://localhost:5173/src/main.ts`;
  const script = document.createElement("script");
  script.src = src;
  script.type = "module";
  script.crossOrigin = "anonymous";
  document.body.appendChild(script);
}
