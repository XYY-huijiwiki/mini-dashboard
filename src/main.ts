import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { userLang, langPacks } from "@/stores/locales";

(async () => {
  // i18n
  const language = JSON.parse(
    localStorage.getItem("miniDashboardSettings") || `{"language":"auto"}`,
  ).language;
  const locale = language === "auto" ? userLang : language;
  const i18n = createI18n({
    legacy: false,
    locale,
    messages: {
      [locale]: await langPacks[locale](),
    },
  });

  // pinia
  const pinia = createPinia();

  // vue
  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.use(pinia);
  app.mount("#mini-dashboard");
})();