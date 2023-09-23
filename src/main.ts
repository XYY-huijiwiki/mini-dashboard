import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { langPacks, langCode } from "@/locales";

(async () => {
  const messages = { [langCode]: await langPacks[langCode]() };
  const i18n = createI18n({
    legacy: false,
    locale: langCode,
    fallbackLocale: langCode,
    messages,
  });

  const app = createApp(App);

  app.use(router);
  app.use(i18n);
  app.mount("#base64-file-manager");
})();
