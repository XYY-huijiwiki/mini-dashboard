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
const MonacoEditor = () => import("@/views/monaco-editor.vue");
const RegexEditor = () => import("@/views/regex-editor.vue");
const HelpDocs = () => import("@/views/help-docs.vue");
const SearchAndDestroy = () => import("@/views/search-and-destroy.vue");

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
  {
    path: "/editor/:title",
    name: "editor",
    component: MonacoEditor,
  },
  {
    path: "/regex-editor",
    name: "regex-editor",
    component: RegexEditor,
  },
  {
    path: "/help-docs/:title",
    name: "help-docs",
    component: HelpDocs,
  },
  {
    path: "/search-and-destroy",
    name: "search-and-destroy",
    component: SearchAndDestroy,
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
