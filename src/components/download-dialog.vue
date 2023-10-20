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
        <div style="margin: 32px 0">
          <n-space vertical>
            <i18n-t keypath="file-manager.message-download-confirm">
              <n-text type="primary">
                {{
                  props.data
                    .map((item) => {
                      return item.file.name;
                    })
                    .toString()
                }}
              </n-text>
              {{
                filesize(
                  props.data
                    .map((item) => item.file.size)
                    .reduce((a, b) => a + b),
                  { locale: langCode },
                )
              }}
            </i18n-t>
          </n-space>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :disabled="loading" @click="$emit('close-dialog')">
          {{ t("general.btn-cancel") }}
        </n-button>
        <n-button :loading="loading" type="primary" @click="downloadFile()">
          {{ t("general.btn-confirm") }}
        </n-button>
      </template>
    </n-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { getObjectURL } from "@/utils/getObjectURL";
import { filesize } from "filesize";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";

const { langCode } = storeToRefs(useLocalesStore());

const { t } = useI18n();

const props = defineProps<{
  data: RetrievedDataItem[];
}>();

const loading = ref(false);

const emit = defineEmits(["close-dialog", "done"]);

async function downloadFile() {
  // start loading
  loading.value = true;

  // download file(s)
  let url = await getObjectURL(props.data.map((item) => item.file.name));
  let a = document.createElement("a");
  a.href = url;
  a.download =
    props.data.length > 1
      ? `${props.data.length} files.zip`
      : props.data[0].file.name;
  a.click();
  URL.revokeObjectURL(url);

  // stop loading
  loading.value = false;
  $message.success(t("file-manager.message-download-success"));

  // close dialog
  emit("done");
  emit("close-dialog");
}
</script>

<style scoped></style>
