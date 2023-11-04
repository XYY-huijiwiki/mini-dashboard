<template>
  <div>
    <home-thing
      name="file-uploader"
      :description="t('file-uploader.description', [fileExtList.join(', ')])"
      icon="upload_file"
    />
    <n-divider></n-divider>
    <home-thing
      name="file-manager"
      :description="t('file-manager.description')"
      icon="home_storage"
    />
    <n-divider></n-divider>
    <home-thing
      name="data-exporter"
      :description="t('data-exporter.description')"
      icon="logout"
    />
    <n-divider></n-divider>
    <home-thing
      name="data-importer"
      :description="t('data-importer.description')"
      icon="login"
    />
    <template v-if="dev">
      <n-divider>Under Development</n-divider>
      <n-space>
        <router-link to="/editor/月圆之夜（羊村守护者）">
          <n-button>Monaco - Wikitext</n-button>
        </router-link>
        <router-link to="/editor/Data:月圆之夜（羊村守护者）.json">
          <n-button>Monaco - Json</n-button>
        </router-link>
        <router-link to="/regex-editor">
          <n-button>regex editor</n-button>
        </router-link>
      </n-space>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import fileTypeList from "@/utils/fileTypeList";
let fileExtList = Object.values(fileTypeList)
  .map((item) => item.ext)
  .flat()
  .sort();
const { t } = useI18n();
let dev = import.meta.env.DEV;
</script>

<style scoped></style>
