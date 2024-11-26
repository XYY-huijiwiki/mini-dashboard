<template>
  <n-card class="h-full" closable @close="emit('close')" content-class="h-0  ">
    <template #header v-if="fileDetails.length !== 1">
      <n-ellipsis>
        <material-symbol>draft</material-symbol>
        {{ t("github-files.msg-number-files-selected", [fileDetails.length]) }}
      </n-ellipsis>
    </template>
    <template #header v-if="fileDetails.length === 1">
      <n-ellipsis>
        <file-icon :file-type="fileDetails[0].type" />
        {{ fileDetails[0].name }}
      </n-ellipsis>
    </template>
    <template #cover v-if="fileDetails.length === 1">
      <div class="bg-black">
        <img
          class="object-contain aspect-video"
          :src="'https://ik.imagekit.io/gwa1ycz7gc/' + fileDetails[0].thumb_url"
        />
      </div>
    </template>
    <template #default v-if="fileDetails.length === 1">
      <n-scrollbar>
        <n-flex vertical>
          <n-statistic :label="t('github-files.label-file-type')">
            {{ fileDetails[0].type }}
          </n-statistic>
          <n-statistic :label="t('github-files.label-file-size')">
            {{ filesize(fileDetails[0].size) }}
          </n-statistic>
        </n-flex>
        <n-divider></n-divider>
        <div
          class="markdown-body"
          v-html="md.render(fileDetails[0].desc)"
        ></div>
      </n-scrollbar>
    </template>
    <template #action v-if="fileDetails.length === 1">
      <n-button tag="a" :href="fileDetails[0].html_url" target="_blank">
        {{ t("github-files.btn-view-in-github") }}
      </n-button>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import MarkdownIt from "markdown-it";
import { filesize as filesizeNoLocale } from "filesize";
import { useLocalesStore } from "@/stores/locales";
import { storeToRefs } from "pinia";
let { langCode } = storeToRefs(useLocalesStore());
let filesize = (size: number) =>
  filesizeNoLocale(size, { locale: langCode.value });
let md = new MarkdownIt({
  linkify: true,
  html: true,
});
let { t } = useI18n();
let { fileDetails } = defineProps<{
  fileDetails: FileDetail[];
}>();
let emit = defineEmits(["close"]);
</script>

<style>
.markdown-body ul {
  list-style-type: disc;
}
</style>
