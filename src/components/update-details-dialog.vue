<template>
  <div>
    <n-dialog
      :showIcon="false"
      style="width: 440px; max-width: 100%"
      @close="() => emit('close-dialog')"
    >
      <!-- header -->
      <template #header>
        {{ t("file-manager.dropdown-option-update-details") }}
      </template>

      <!-- body (default) -->
      <template #default>
        <div style="margin: 32px 0">
          <n-space vertical>
            <i18n-t keypath="file-manager.message-update-details-confirm">
              <n-text type="primary">
                {{ props.data.map((item) => item.file.name).join(", ") }}
              </n-text>
            </i18n-t>
          </n-space>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :disabled="loading" @click="$emit('close-dialog')">
          {{ t("general.btn-cancel") }}
        </n-button>
        <n-button
          :loading="loading"
          type="primary"
          @click="confirmUpdateDetails()"
        >
          {{ t("general.btn-confirm") }}
        </n-button>
      </template>
    </n-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { editPage } from "@/utils/mwApi";
import generateFileData from "@/utils/generateFileData";
import extract from "png-chunks-extract";

const { t } = useI18n();

const props = defineProps<{
  data: RetrievedDataItem[];
}>();

const loading = ref(false);

const emit = defineEmits(["close-dialog", "done"]);

async function confirmUpdateDetails() {
  // start loading
  loading.value = true;

  for (let index = 0; index < props.data.length; index++) {
    const element = props.data[index];

    let name = element.file.name;
    let file: File;

    // get new data
    const containerURL = mw.huijiApi.getImageUrl(
      name.replace(/ /g, "_") + ".png",
      "xyy",
    );
    const containerStream = await fetch(containerURL);
    const containerBuffer = await containerStream.arrayBuffer();
    const containerArray = new Uint8Array(containerBuffer);
    const containerChunks = extract(containerArray);
    const fileUnit8Array = containerChunks.find((chunk) => {
      return chunk.name === "IXYY";
    })?.data;
    if (!fileUnit8Array) {
      $message.error("获取文件失败");
      throw new Error("获取文件失败");
    } else {
      file = new File([fileUnit8Array], name);
    }
    let newData = await generateFileData(file, element.wiki);

    // update data
    let editPageResult = await editPage({
      title: `Data:${name}.json`,
      text: JSON.stringify(newData),
      summary: "更新文件信息",
    });
    if (editPageResult) {
      $message.success("更新成功");
    } else {
      $message.error("更新失败");
      throw new Error("更新失败");
    }
  }

  // stop loading
  loading.value = false;

  // close dialog
  emit("done");
  emit("close-dialog");
}
</script>

<style scoped></style>
