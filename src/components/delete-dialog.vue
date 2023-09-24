<template>
  <div>
    <n-dialog
      :showIcon="false"
      style="width: 440px; max-width: 100%"
      @close="() => emit('close-dialog')"
    >
      <!-- header -->
      <template #header>
        <div>删除</div>
      </template>

      <!-- body (default) -->
      <template #default>
        <div style="margin: 32px 0">
          <n-space vertical>
            <n-p>
              你确定要删除
              <n-text type="error">{{ props.data.file.name }}</n-text>
              吗？请填写删除原因：
            </n-p>
            <n-input v-model:value="reason" />
          </n-space>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :disabled="loading" @click="$emit('close-dialog')">
          {{ t("general.btn-no") }}
        </n-button>
        <n-button :loading="loading" type="error" @click="confirmDelete()">
          {{ t("general.btn-yes") }}
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
  data: RetrievedDataItem;
}>();

const loading = ref(false);
const reason: Ref<string | undefined> = ref();

const emit = defineEmits(["close-dialog", "done"]);

async function confirmDelete() {
  // start loading
  loading.value = true;
  let name = props.data.file.name;

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
  if (props.data.file.type.startsWith("video/")) {
    await deletePage({
      title: `文件:${name}.poster.png`,
      reason: reason.value,
    });
  }

  // stop loading
  loading.value = false;

  // close dialog
  emit("done");
  emit("close-dialog");
}
</script>

<style scoped></style>
