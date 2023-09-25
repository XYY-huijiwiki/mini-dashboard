<template>
  <div>
    <n-dialog
      :showIcon="false"
      style="width: 440px; max-width: 100%"
      @close="() => emit('close-dialog')"
    >
      <!-- header -->
      <template #header>
        {{ t("file-manager.dropdown-option-download") }}
      </template>

      <!-- body (default) -->
      <template #default>
        <div
          style="display: flex; margin: 32px 0; align-items: center; gap: 4px"
        >
          <n-input
            v-model:value="fileName"
            :disabled="loading"
            :default-value="removeFileExtension(props.data[0].file.name)"
          />
          <div style="text-wrap: nowrap">
            {{ `.${getFileExtension(props.data[0].file.name)}` }}
          </div>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :disabled="loading" @click="$emit('close-dialog')">
          {{ t("general.btn-cancel") }}
        </n-button>
        <n-button :loading="loading" type="primary" @click="rename()">
          {{ t("general.btn-confirm") }}
        </n-button>
      </template>
    </n-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { renamePage, editPage } from "@/utils/mwApi";
import { cloneDeep } from "lodash-es";

const { t } = useI18n();

const props = defineProps<{
  data: RetrievedDataItem[];
}>();

const loading = ref(false);
const fileName: Ref<string | undefined> = ref();

const emit = defineEmits(["close-dialog", "done"]);

async function rename() {
  // start loading
  loading.value = true;

  // set original and new file name
  // and file extension
  let from = removeFileExtension(props.data[0].file.name);
  let to = fileName.value;
  let ext = getFileExtension(props.data[0].file.name);

  // check if file name is valid
  if (to === undefined || from === to) {
    $message.error("文件名不能与原文件名相同");
    loading.value = false;
    return;
  } else if (to.length === 0) {
    $message.error("文件名不能为空");
    loading.value = false;
    return;
  }

  // rename data page
  await renamePage(`Data:${from}.${ext}.json`, `Data:${to}.${ext}.json`);

  // rename file page
  await renamePage(`文件:${from}.${ext}`, `文件:${to}.${ext}`);

  // rename file container
  await renamePage(`文件:${from}.${ext}.png`, `文件:${to}.${ext}.png`);

  // rename file poster (for video)
  if (props.data[0].file.type.startsWith("video/")) {
    await renamePage(
      `文件:${from}.${ext}.poster.png`,
      `文件:${to}.${ext}.poster.png`,
    );
  }

  // renew file data
  let newData = cloneDeep(props.data[0]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let { _id, ...metadata } = newData;
  metadata.file.name = `${to}.${ext}`;
  await editPage({
    title: `Data:${to}.${ext}.json`,
    text: JSON.stringify(metadata),
  });

  // renew redirect link (for video)
  if (props.data[0].file.type.startsWith("video/")) {
    await editPage({
      title: `文件:${to}.${ext}`,
      text: `#重定向 [[文件:${to}.${ext}.poster.png]]\n[[文件:${to}.${ext}.png]]\n[[分类:特殊文件]]`,
    });
  }

  // stop loading
  loading.value = false;

  // close dialog
  emit("done");
  emit("close-dialog");
}

function removeFileExtension(fileName: string) {
  return fileName.split(".").slice(0, -1).join(".");
}

function getFileExtension(fileName: string) {
  return fileName.split(".").pop();
}
</script>

<style scoped></style>
