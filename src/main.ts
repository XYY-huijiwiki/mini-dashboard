import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { userLang, langPacks } from "@/stores/locales";

(async () => {
  // ===== dev mode =====
  let dev = import.meta.env.DEV;
  let devServerUrl = new URL(import.meta.url);
  let currentUrl = new URL(location.href);
  // if in prod mode and dev-server-name is set, load dev server
  if (!dev && currentUrl.searchParams.has("dev-server-name")) {
    let devServerHostname = currentUrl.searchParams.get("dev-server-name");
    let devServerPort = currentUrl.searchParams.get("dev-server-port");
    import(
      /* @vite-ignore */
      `${devServerHostname}:${devServerPort}/src/main.ts`
    );
    return;
  }
  // if in dev mode and hasn't been redirected yet, redirect to target url
  if (dev && location.hostname !== "xyy.huijiwiki.com") {
    let targetUrl = "https://xyy.huijiwiki.com/wiki/Project:迷你控制中心";
    location.href = `${targetUrl}?dev-server-hostname=${devServerUrl.hostname}&dev-server-port=${devServerUrl.port}`;
  }

  // ===== styling =====
  // remover outer .mw-parser-output to prenvent style conflict
  document
    .querySelector(".mw-parser-output:has(> #mini-dashboard)")
    ?.classList.remove("mw-parser-output");

  // ===== i18n =====
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
