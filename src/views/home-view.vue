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
</script>

<style scoped></style>
