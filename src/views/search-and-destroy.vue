<template>
  <div>
    <n-space vertical>
      <n-input-group>
        <n-upload
          abstract
          :show-file-list="false"
          accept=".txt"
          :max="1"
          v-model:file-list="txtFiles"
          @update:file-list="processTxt()"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick" :disabled="loading"
              >select-pages-from-txt</n-button
            >
          </n-upload-trigger>
        </n-upload>
        <n-button @click="clearPages()" :disabled="loading">clear-all</n-button>
        <n-input
          placeholder="destroy-reason"
          v-model:value="summary"
          :disabled="loading"
        />
        <n-button @click="destroy(pages)" type="error" :loading="loading"
          >destroy</n-button
        >
      </n-input-group>
      <n-dynamic-tags v-model:value="pages" :disabled="loading" />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { type UploadFileInfo } from "naive-ui";
import { useI18n } from "vue-i18n";
import { deletePage } from "@/utils/mwApi";
const { t } = useI18n();
let txtFiles: Ref<UploadFileInfo[]> = ref([]);
let pages: Ref<string[]> = ref([]);
let summary: Ref<string | undefined> = ref();
let dev = import.meta.env.DEV;
let loading = ref(false);
function clearPages() {
  $dialog.warning({
    title: "clear-all",
    content: "clear-all-pages",
    positiveText: t("general.btn-confirm"),
    negativeText: t("general.btn-cancel"),
    autoFocus: false,
    onPositiveClick: () => {
      pages.value = [];
    },
  });
}
function processTxt() {
  if (txtFiles.value.length === 0) return;
  const file = txtFiles.value[0].file;
  if (dev) console.log(file);
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result;
    if (typeof content !== "string") return;
    // split by line and concat old list
    let list = pages.value.concat(content.split("\n"));
    // trim
    list = list.map((item) => item.trim());
    // remove empty
    list = list.filter((item) => item !== "");
    // remove duplicate
    list = [...new Set(list)];
    pages.value = list;
    txtFiles.value = [];
  };
  reader.readAsText(file);
}
async function destroy(items: string[]): Promise<void> {
  loading.value = true;
  if (!summary.value) {
    $message.error("请填写删除原因");
    return;
  }
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    await deletePage({ title: element, reason: summary.value });
    // remove page from list
    pages.value = pages.value.filter((item) => item !== element);
  }
  loading.value = false;
}
</script>

<style scoped></style>
