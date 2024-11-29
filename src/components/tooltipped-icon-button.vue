<template>
  <n-tooltip :show="disabled ? false : undefined">
    <template #default>
      {{ text }}
    </template>
    <template #trigger>
      <n-button quaternary :disabled="disabled" @click="emit('click')">
        <template #icon>
          <material-symbol>{{ icon }}</material-symbol>
        </template>
      </n-button>
    </template>
  </n-tooltip>
</template>

<script setup lang="ts">
import { NTooltip, NButton } from 'naive-ui'
import MaterialSymbol from './material-symbol.vue'
defineProps<{
  text: string
  icon: string
  disabled?: boolean
}>()
let emit = defineEmits(['click'])
</script>

<style scoped></style>
