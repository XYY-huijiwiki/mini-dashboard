import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const FilePreview = () => import("@/views/file-preview.vue");
const HomeView = () => import("@/views/home-view.vue");
const SettingsView = () => import("@/views/settings-view.vue");
const FileUploader = () => import("@/views/file-uploader.vue");
const FileManager = () => import("@/views/file-manager.vue");
const DataImporter = () => import("@/views/data-importer.vue");
const DataExporter = () => import("@/views/data-exporter.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/preview/:fileName",
    name: "filePreview",
    component: FilePreview,
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
  },
  {
    path: "/file-uploader",
    name: "file-uploader",
    component: FileUploader,
  },
  {
    path: "/file-manager",
    name: "file-manager",
    component: FileManager,
  },
  {
    path: "/data-importer",
    name: "data-importer",
    component: DataImporter,
  },
  {
    path: "/data-exporter",
    name: "data-exporter",
    component: DataExporter,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return {
      el: "#mini-dashboard",
      top: 100,
      behavior: "smooth",
    };
  },
});

export default router;
