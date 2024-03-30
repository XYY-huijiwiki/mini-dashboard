import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { userLang, langPacks } from "@/stores/locales";

(async () => {
  // dev环境检测
  if (import.meta.env.PROD && window.dev === "mini-dashboard") {
    // 此处代码只在生产环境且发现`dev`值为`mini-dashboard`时执行
    // 此时停止继续加载代码即可，剩下的交给篡改猴脚本
    throw new Error("检测到dev环境，停止加载prod代码");
    // 虽然并不推荐throw new Error，但是这是最简单的方法
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
