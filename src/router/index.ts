import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const filePreview = () => import("@/views/file-preview.vue");
const homeView = () => import("@/views/home-view.vue");
const sttingsView = () => import("@/views/settings-view.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: homeView,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/preview/:fileName",
    name: "filePreview",
    component: filePreview,
  },
  {
    path: "/settings",
    name: "settings",
    component: sttingsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
