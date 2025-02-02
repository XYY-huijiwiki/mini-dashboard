<template>
  <n-flex vertical>
    <n-flex>
      <n-card>
        <n-scrollbar x-scrollable>
          <n-code
            :code="JSON.stringify(result.themeJson, null, 2)"
            language="json"
            :hljs="hljs"
          ></n-code>
        </n-scrollbar>
      </n-card>
      <n-flex
        vertical
        v-for="img in [
          result.files.dateImg,
          result.files.squareImg,
          ...(result?.files.previews || []),
        ].filter(Boolean)"
      >
        <n-image
          class="w-32 h-32 rounded bg-gray-200"
          object-fit="contain"
          :src="img && createObjectURL(img)"
        ></n-image>
        <n-text class="w-32">{{ img && img.name }}</n-text>
      </n-flex>
    </n-flex>
    <n-flex justify="end">
      <n-button @click="emits('prev')">
        {{ t('miui-themes.btn-prev-step') }}
      </n-button>
      <n-button type="primary" @click="emits('next')">
        {{ t('miui-themes.btn-next-step') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import type { Result } from './index'
import { useI18n } from 'vue-i18n'

let { t } = useI18n()

hljs.registerLanguage('json', json)
let createObjectURL = window.URL.createObjectURL
let { result } = defineProps<{ result: Result }>()
let emits = defineEmits(['next', 'prev'])
</script>

<style>
code.n-code {
  background-color: inherit;
}
pre.__code__ {
  margin-bottom: inherit;
  display: inherit;
  padding: inherit;
  word-break: inherit;
  word-wrap: inherit;
  color: inherit;
  background-color: inherit;
  border: inherit;
  border-radius: inherit;
}
</style>
