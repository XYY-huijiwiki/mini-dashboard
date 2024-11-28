import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { userLang, langPacks } from '@/stores/locales'
;(async () => {
  // ===== dev mode =====
  let dev = import.meta.env.DEV
  let devServer = new URL(location.href).searchParams.get('dev-server')
  // if in prod mode and `?dev-server` is set, load dev server
  if (!dev && devServer) {
    import(
      /* @vite-ignore */
      devServer
    )
    return
  }
  // if in dev mode and hasn't been redirected yet, redirect to target url with `?dev-server`
  if (dev && location.hostname !== 'xyy.huijiwiki.com') {
    let targetUrl = 'https://xyy.huijiwiki.com/wiki/Project:迷你控制中心'
    location.href = `${targetUrl}?dev-server=${import.meta.url}`
    return
  }

  // ===== styling =====
  // remover outer .mw-parser-output to prenvent style conflict
  document
    .querySelector('.mw-parser-output:has(> #mini-dashboard)')
    ?.classList.remove('mw-parser-output')

  // ===== i18n =====
  const language = JSON.parse(
    localStorage.getItem('miniDashboardSettings') || `{"language":"auto"}`,
  ).language
  const locale = language === 'auto' ? userLang : language
  const i18n = createI18n({
    legacy: false,
    locale,
    messages: {
      [locale]: await langPacks[locale](),
    },
  })

  // ===== init vue app =====
  // pinia
  const pinia = createPinia()
  // vue
  const app = createApp(App)
  app.use(router)
  app.use(i18n)
  app.use(pinia)
  app.mount('#mini-dashboard')
})()
