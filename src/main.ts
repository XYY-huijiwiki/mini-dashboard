import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { userLang, langPacks } from "@/stores/locales";

(async () => {
  // dev mode (true for dev and false for prod)
  const userDevModeOption: Boolean = JSON.parse(
    localStorage.getItem("miniDashboardSettings") || `{"devMode":false}`
  ).devMode;
  const currentCodeDevMode: Boolean = import.meta.env.DEV;
  if (userDevModeOption !== currentCodeDevMode) {
    // if user dev mode is on but current code dev mode is off, show warning
    if (userDevModeOption) {
      const turnOffDevMode = function () {
        localStorage.setItem(
          "miniDashboardSettings",
          JSON.stringify(
            JSON.parse(localStorage.getItem("miniDashboardSettings") || "{}")
          )
        );
        location.reload();
      };
      const devModeWarningHTML = `Waiting dev server... <a onclick="(${turnOffDevMode.toString()})()">Click Here</a> to turn off dev mode.`;
      document.querySelector("#mini-dashboard")!.innerHTML = devModeWarningHTML;
    } else {
      console.warn(
        "[Mini Dashboard]User dev mode is off. Turn on dev mode on settings to load dev server."
      );
    }
    return;
  }

  // i18n
  const language = JSON.parse(
    localStorage.getItem("miniDashboardSettings") || `{"language":"auto"}`
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
