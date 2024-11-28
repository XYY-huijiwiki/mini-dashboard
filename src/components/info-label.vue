<template>
  <n-popover trigger="click">
    <template #trigger>
      <n-button text class="align-middle text-sm">
        <n-icon :component="Info16Regular" class="info-label"></n-icon>
      </n-button>
    </template>
    {{ content }}
  </n-popover>
</template>

<script setup lang="ts">
import { Info16Regular } from '@vicons/fluent'

defineProps({
  content: String,
})
</script>
