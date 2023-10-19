<template>
  <div>
    <home-thing
      name="file-uploader"
      :description="t('file-uploader.description', [fileExtList.join(', ')])"
      icon="upload"
    />
    <n-divider></n-divider>
    <home-thing
      name="file-manager"
      :description="t('file-manager.description')"
      icon="home_storage"
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
