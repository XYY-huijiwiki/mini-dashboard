import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const views = import.meta.glob('@/views/**/*.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: views['/src/views/home-view.vue'],
  },
  {
    path: '/settings',
    name: 'settings',
    component: views['/src/views/settings-view.vue'],
  },
  {
    path: '/data-importer',
    name: 'data-importer',
    component: views['/src/views/data-importer.vue'],
  },
  {
    path: '/data-exporter',
    name: 'data-exporter',
    component: views['/src/views/data-exporter.vue'],
  },
  {
    path: '/regex-editor',
    name: 'regex-editor',
    component: views['/src/views/regex-editor.vue'],
  },
  {
    path: '/help-docs/:title',
    name: 'help-docs',
    component: views['/src/views/help-docs.vue'],
  },
  {
    path: '/search-and-destroy',
    name: 'search-and-destroy',
    component: views['/src/views/destroy-and-rescue.vue'],
  },
  {
    path: '/search-and-rescue',
    name: 'search-and-rescue',
    component: views['/src/views/destroy-and-rescue.vue'],
  },
  {
    path: '/rename-pages',
    name: 'rename-pages',
    component: views['/src/views/rename-pages.vue'],
  },
  {
    path: '/check-revisions',
    name: 'check-revisions',
    component: views['/src/views/check-revisions.vue'],
  },
  {
    path: '/miui-themes',
    name: 'miui-themes',
    component: views['/src/views/miui-themes/index.vue'],
  },
  {
    path: '/github-file/:fileName',
    name: 'github-file',
    component: views['/src/views/github-file.vue'],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      el: '#mini-dashboard',
      top: 100,
      behavior: 'smooth',
    }
  },
})

export default router
