import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const filePreview = () => import("@/views/file-preview.vue");
const homeView = () => import("@/views/home-view.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: homeView,
  },
  {
    path: "/preview/:fileName",
    name: "filePreview",
    component: filePreview,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;