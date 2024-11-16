import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { userLang, langPacks } from "@/stores/locales";

(async () => {
  // get settings object
  const settings = JSON.parse(
    localStorage.getItem("miniDashboardSettings") || "{}"
  );

  // dev mode (true for dev and false for prod)
  const userDevModeOption: Boolean = settings.devMode || false;
  const currentCodeDevMode: Boolean = import.meta.env.DEV;
  if (userDevModeOption !== currentCodeDevMode) {
    if (userDevModeOption) {
      // if user dev mode is on but current code dev mode is off, show warning and a button to turn off dev mode
      // @ts-ignore
      import("http://localhost:5173/src/main.ts");
      const settings = JSON.parse(
        localStorage.getItem("miniDashboardSettings") || "{}"
      );
      const turnOffDevMode = function () {
        settings.devMode = false;
        localStorage.setItem("miniDashboardSettings", JSON.stringify(settings));
        location.reload();
      };
      const devModeWarningHTML = `Waiting dev server... <a href='#' onclick='(${turnOffDevMode.toString()})()'>Click Here</a> to turn off dev mode.`;
      document.querySelector("#mini-dashboard")!.innerHTML = devModeWarningHTML;
    } else {
      // if user dev mode is off but current code dev mode is on, show warning in console
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
