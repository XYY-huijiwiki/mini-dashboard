<template>
  <div>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="props.position ? props.position.x : undefined"
      :y="props.position ? props.position.y : undefined"
      :options="options"
      v-model:show="show"
      @clickoutside="show = false"
      @select="(key) => emit(key)"
    >
      <slot></slot>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { ComputedRef } from 'vue'
import { NDropdown } from 'naive-ui'
import type { DropdownOption } from 'naive-ui'
import materialSymbol from './material-symbol.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  data: FileDetail[]
  position?: { x: number; y: number }
}>()

// show
let show = defineModel<boolean>('show')
// on-preview
let emit = defineEmits([
  'preview',
  'detail',
  'link-copy',
  'delete',
  'download',
  'rename',
  'details',
])

// options
const options: ComputedRef<DropdownOption[]> = computed(() => [
  {
    label: t('github-files.btn-preview'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'visibility'),
    key: 'preview',
    disabled: props.data.length > 1,
  },
  {
    label: t('github-files.btn-link-copy'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'link'),
    key: 'link-copy',
  },
  {
    type: 'divider',
  },
  {
    label: t('github-files.btn-delete'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'delete'),
    disabled: true,
    key: 'delete',
  },
  {
    label: t('github-files.btn-download'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'download'),
    disabled: props.data.length === 0,
    key: 'download',
  },
  {
    label: t('github-files.btn-rename'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'edit'),
    disabled: true,
    key: 'rename',
  },
  {
    type: 'divider',
  },
  {
    label: t('github-files.btn-details'),
    icon: () => h(materialSymbol, { size: 20 }, () => 'info'),
    key: 'details',
    disabled: props.data.length > 1,
  },
])
</script>

<style scoped></style>
