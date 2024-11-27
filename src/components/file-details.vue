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
          <n-divider>{{ t("github-files.label-basic-info") }}</n-divider>
          <n-statistic :label="t('github-files.label-file-type')">
            {{ fileDetails[0].type }}
          </n-statistic>
          <n-statistic :label="t('github-files.label-file-size')">
            {{ filesize(fileDetails[0].size) }}
          </n-statistic>
        </n-flex>
        <n-divider>{{ t("github-files.label-file-desc") }}</n-divider>
        <div
          class="markdown-body"
          v-html="md.render(fileDetails[0].desc)"
        ></div>
        <n-divider>{{ t("github-files.label-file-usage") }}</n-divider>
        <n-spin :show="loading">
          <n-empty
            :description="t(`github-files.msg-file-no-usage`)"
            v-if="fileUsage.length === 0"
          >
            <template #extra>
              <n-button
                tag="a"
                :href="`https://xyy.huijiwiki.com/index.php?title=特殊:链入页面&target=文件:GitHub:${fileDetails[0].name}`"
                target="_blank"
              >
                {{ t("github-files.btn-file-usage-page") }}
              </n-button>
            </template>
          </n-empty>
          <div v-else class="markdown-body">
            <n-ul>
              <n-li v-for="item in fileUsage">
                <n-a :href="item.url" target="_blank">{{ item.title }}</n-a>
              </n-li>
            </n-ul>
          </div>
        </n-spin>
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
import { ref } from "vue";
import type { Ref } from "vue";
import { useI18n } from "vue-i18n";
import MarkdownIt from "markdown-it";
import { filesize as filesizeNoLocale } from "filesize";
import { useLocalesStore } from "@/stores/locales";
import { storeToRefs } from "pinia";
import { asyncComputed } from "@vueuse/core";
let { langCode } = storeToRefs(useLocalesStore());
let filesize = (size: number) =>
  filesizeNoLocale(size, { locale: langCode.value });
let md = new MarkdownIt({
  linkify: true,
  html: true,
});
let loading = ref(true);
let { t } = useI18n();
let { fileDetails } = defineProps<{
  fileDetails: FileDetail[];
}>();
let emit = defineEmits(["close"]);

let fileUsage: Ref<{ url: string; title: string }[]> =
  asyncComputed(async () => {
    // if don't have to display the info, return
    if (fileDetails.length !== 1) {
      loading.value = false;
      return [];
    }
    // if `not used` in `warnings`, return empty
    if (fileDetails[0].warnings.includes("not used")) {
      loading.value = false;
      return [];
    }

    loading.value = true;
    let response = (await (
      await fetch(
        `https://xyy.huijiwiki.com/api.php?format=json&action=query&list=backlinks&bltitle=File:GitHub:${fileDetails[0].name}`
      )
    ).json()) as {
      query: { backlinks: { title: string }[]; continue: any };
    };
    let res = response.query.backlinks.map((item: { title: string }) => ({
      url: `https://xyy.huijiwiki.com/wiki/${item.title}`,
      title: item.title,
    }));
    if (response.query.continue)
      res.push({
        url: `https://xyy.huijiwiki.com/index.php?title=特殊:链入页面&target=文件:GitHub:${fileDetails[0].name}`,
        title: t("github-files.btn-file-usage-more"),
      });
    loading.value = false;
    return res;
  }, []);
</script>

<style>
.markdown-body ul {
  list-style-type: disc;
}
</style>
