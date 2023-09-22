<template>
  <div>
    <n-tabs v-model:value="activeTab" default-value="uploader" animated>
      <n-tab-pane name="uploader" display-directive="show:lazy" tab="文件上传">
        <file-uploader></file-uploader>
      </n-tab-pane>
      <n-tab-pane name="manager" display-directive="show:lazy" tab="文件管理">
        <file-manager></file-manager>
      </n-tab-pane>
      <n-tab-pane name="manager-old" display-directive="show:lazy" tab="文件管理（旧）">
        <file-manager-old></file-manager-old>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import loadingComponent from "@/views/loading-view.vue";

// define async views
function createAsyncComponent(name: string) {
  return defineAsyncComponent({
    loader: () => import(`../views/${name}.vue`),
    loadingComponent,
  });
}
const fileUploader = createAsyncComponent("file-uploader");
const fileManager = createAsyncComponent("file-manager");
const fileManagerOld = createAsyncComponent("file-manager-old");

const activeTab = ref("uploader");
</script>

<style scoped></style>
