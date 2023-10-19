<template>
  <div>
    <n-thing content-indented>
      <template #avatar>
        <n-avatar>
          <MaterialSymbol> {{ $props.icon }} </MaterialSymbol>
        </n-avatar>
      </template>
      <template #header> {{ t(`${$props.name}.title`) }} </template>
      <template #description> {{ $props.description }} </template>
      <template #action>
        <router-link :to="{ name: $props.name }">
          <n-button size="small">
            {{ t("home.btn-enter") }}
          </n-button>
        </router-link>
      </template>
    </n-thing>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});
</script>

<style scoped></style>
