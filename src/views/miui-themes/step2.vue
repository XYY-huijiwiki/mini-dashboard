<template>
  <n-flex vertical>
    <n-form label-placement="left">
      <n-form-item label="主题链接" show-require-mark>
        <n-input v-model:value="themeInput.link" :disabled="loading" />
        <n-button @click="getDownloadLink" :disabled="loading || !themeInput.link"
          >获取下载链接</n-button
        >
      </n-form-item>
      <n-form-item label="下载链接" show-require-mark>
        <n-input v-model:value="themeInput.downloadLink" :disabled="loading" />
      </n-form-item>
      <n-form-item label="发布日期" show-require-mark>
        <n-date-picker v-model:value="themeInput.date" type="date" :disabled="loading" />
      </n-form-item>
      <n-form-item label="日期截图" show-require-mark>
        <n-flex :align="`center`">
          <n-button @click="openFile" :disabled="loading">选择文件</n-button>
          <div>
            {{ themeInput.dateImg ? `已选择文件：${themeInput.dateImg.name}` : `未选择文件` }}
          </div>
        </n-flex>
      </n-form-item>
      <n-form-item label="你知道咩">
        <n-input v-model:value="themeInput.trivia" :disabled="loading" />
      </n-form-item>
    </n-form>
    <n-flex justify="end">
      <n-button @click="$emit('prev')">上一步</n-button>
      <n-button
        type="primary"
        @click="clickNext"
        :loading="loading"
        :disabled="!themeInput.link || !themeInput.date || !themeInput.dateImg"
      >
        下一步
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
// Third-party library imports
import dayjs from 'dayjs'
import jszip from 'jszip'
import { xml2json } from 'xml-js'
import { useFileDialog } from '@vueuse/core'
import { ref } from 'vue'
import type { Ref } from 'vue'

// Local imports
import { getMTZFile, cleanURL } from './index'
import type { Result } from './index'

let emits = defineEmits<{
  next: []
  prev: []
  'update-result': [Result]
}>()
let loading = ref(false)
type ThemeInput = {
  downloadLink: string | undefined
  link: string | undefined
  date: number | undefined
  dateImg: File | undefined
  trivia: string | undefined
}
let themeInput: Ref<ThemeInput> = ref({
  downloadLink: undefined,
  link: undefined,
  date: undefined,
  dateImg: undefined,
  trivia: undefined,
})
let { open: openFile, onChange: onChangeFile } = useFileDialog({
  accept: 'image/*',
})
onChangeFile((files) => {
  if (files?.length !== 1) return
  themeInput.value.dateImg = files[0]
})
function getDownloadLink() {
  let packId = new URL(cleanURL(themeInput.value.link || '')).searchParams.get('packId')
  window.open(`https://thm.market.xiaomi.com/thm/download/v2/${packId}?miuiUIVersion=100`)
}

async function clickNext() {
  try {
    loading.value = true

    /* ==================
    process input text
   ================== */
    async function getTitleAndSquareImgLink(link: string): Promise<{
      title: string
      squareImgLink: string
    }> {
      let packID = new URL(link).searchParams.get('packId')
      if (!packID) {
        throw new Error('主题链接格式错误')
      }
      let res = (await (
        await fetch(`${corsProxy}https://zhuti.xiaomi.com/thm/share/picture/${packID}`)
      ).json()) as {
        downloadUrl: string
        name: string
      }
      return {
        title: res.name,
        squareImgLink: res.downloadUrl,
      }
    }
    let corsProxy = 'https://jolly-shape-d597.karsten-zhou.workers.dev/'
    let link = cleanURL(themeInput.value.link || '')
    let url = new URL(link)
  } catch (error) {
    loading.value = false
    $notification.error({
      title: 'Error',
      content: `${error}`,
    })
  }
}
</script>

<style scoped></style>
