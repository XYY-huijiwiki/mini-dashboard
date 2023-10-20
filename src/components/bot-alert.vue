<template>
  <div>
    <n-alert :title="t('data-importer.bot-alert-title')" :type="type">
      <template #default>
        <!-- Sign in with a bot account so that you can use this function. -->
        {{ t("data-importer.bot-alert-text") }}
        <br />
        {{ message }}
      </template>
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

let { t } = useI18n();

let { isBot } = storeToRefs(useSettingsStore());

let type = computed(() => {
  if (isBot.value === null) return "info";
  return isBot.value ? "success" : "error";
});
let message = computed(() => {
  if (isBot.value === null) return t("data-importer.bot-alert-checking");
  return isBot.value
    ? t("data-importer.bot-alert-is-bot")
    : t("data-importer.bot-alert-not-bot");
});
</script>

<style scoped></style>
