<template>
  <div>
    <n-dialog
      :showIcon="false"
      style="width: 440px; max-width: 100%"
      @close="() => emit('close-dialog')"
    >
      <!-- header -->
      <template #header>
        {{ t("file-manager.dropdown-option-delete") }}
      </template>

      <!-- body (default) -->
      <template #default>
        <div style="margin: 32px 0">
          <n-space vertical>
            <i18n-t keypath="file-manager.message-delete-confirm">
              <n-text type="error">
                {{ props.data.map((item) => item.file.name).join(", ") }}
              </n-text>
            </i18n-t>
            <n-input v-model:value="reason" />
          </n-space>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :disabled="loading" @click="$emit('close-dialog')">
          {{ t("general.btn-cancel") }}
        </n-button>
        <n-button :loading="loading" type="error" @click="confirmDelete()">
          {{ t("general.btn-confirm") }}
        </n-button>
      </template>
    </n-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { deletePage } from "@/utils/mwApi";

const { t } = useI18n();

const props = defineProps<{
  data: RetrievedDataItem[];
}>();

const loading = ref(false);
const reason: Ref<string | undefined> = ref();

const emit = defineEmits(["close-dialog", "done"]);

async function confirmDelete() {
  // start loading
  loading.value = true;

  for (let index = 0; index < props.data.length; index++) {
    const element = props.data[index];

    let name = element.file.name;

    // check if the reason of deletion is provided
    if (!reason.value) {
      $message.error("请填写删除原因");
      loading.value = false;
      return;
    }

    // delete data page
    await deletePage({ title: `Data:${name}.json`, reason: reason.value });

    // delete file page
    await deletePage({ title: `文件:${name}`, reason: reason.value });

    // delete file container
    await deletePage({ title: `文件:${name}.png`, reason: reason.value });

    // delete file poster (for video)
    if (element.file.type.startsWith("video/")) {
      await deletePage({
        title: `文件:${name}.poster.png`,
        reason: reason.value,
      });
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
