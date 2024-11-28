<template>
  <div>
    <n-divider title-placement="left">select-pages</n-divider>
    <n-space :wrap="false">
      <n-button-group vertical>
        <n-upload
          abstract
          :show-file-list="false"
          accept=".txt"
          :max="1"
          v-model:file-list="txtFiles"
          @update:file-list="processTxt()"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button @click="handleClick">add-pages-from-txt</n-button>
          </n-upload-trigger>
        </n-upload>
        <n-button disabled>add-pages-from-xlsx</n-button>
        <n-button @click="clearPages()">clear-all</n-button>
      </n-button-group>
      <n-divider vertical style="height: 100%" />
      <n-dynamic-tags v-model:value="pages" />
    </n-space>
    <n-divider title-placement="left">edition-regex</n-divider>
    <n-dynamic-input
      v-model:value="regexList"
      show-sort-button
      @create="
        () => {
          return {
            isCheck: true,
            search: '',
            replace: '',
          }
        }
      "
    >
      <template #default="{ value, index }">
        <n-space align="center">
          <n-text># {{ index + 1 }}</n-text>
          <n-checkbox v-model:checked="value.isCheck" />
          <n-input v-model:value="value.search" placeholder="search-regex" />
          <n-input v-model:value="value.replace" placeholder="replace-regex" />
        </n-space>
      </template>
    </n-dynamic-input>
    <n-divider title-placement="left">check-and-preview</n-divider>
    <n-space vertical>
      <n-input-group>
        <n-button :disabled="pages.length === 0 || currentPageNum === 0" @click="currentPageNum--">
          <template #icon>
            <material-symbol :size="20"> arrow_back_ios_new </material-symbol>
          </template>
        </n-button>
        <n-input-group-label style="flex-grow: 1; text-align: center">
          {{ pages[currentPageNum] || 'no-page' }}
        </n-input-group-label>
        <n-button
          :disabled="pages.length === 0 || currentPageNum === pages.length - 1"
          @click="currentPageNum++"
        >
          <template #icon>
            <material-symbol :size="20"> arrow_forward_ios </material-symbol>
          </template>
        </n-button>
        <n-button @click="debounce(checkDiff, 200)()" :disabled="!pages[currentPageNum]">
          check-diff
        </n-button>
        <n-button @click="debounce(getPreview, 200)()" :disabled="!pages[currentPageNum]">
          preview
        </n-button>
      </n-input-group>
      <n-input-group>
        <n-input v-model:value="summary" placeholder="summary" />
        <n-button
          :disabled="!pages[currentPageNum] || checkTab === undefined"
          @click="debounce(savePage, 200)()"
        >
          save
        </n-button>
      </n-input-group>
      <n-card>
        <div v-html="html" v-show="checkTab === 'preview'"></div>
        <div
          id="diff-container"
          style="width: 100%; height: 80vh"
          v-show="checkTab === 'diff'"
        ></div>
        <div v-show="checkTab === undefined">no-diff/preview</div>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { type UploadFileInfo } from 'naive-ui'
import { getPage, editPage } from '@/utils/mwApi'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/base/browser/ui/codicons/codiconStyles.js'
import { asyncComputed } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { debounce } from 'lodash-es'

const { t } = useI18n()
let { globalLoading } = storeToRefs(useSettingsStore())
let dev = import.meta.env.DEV

// select pages
let pages: Ref<string[]> = ref([])
function clearPages() {
  $dialog.warning({
    title: 'clear-all',
    content: 'clear-all-pages',
    positiveText: t('general.btn-confirm'),
    negativeText: t('general.btn-cancel'),
    autoFocus: false,
    onPositiveClick: () => {
      pages.value = []
    },
  })
}
let txtFiles: Ref<UploadFileInfo[]> = ref([])
function processTxt() {
  if (txtFiles.value.length === 0) return
  const file = txtFiles.value[0].file
  if (dev) console.log(file)
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result
    if (typeof content !== 'string') return
    // split by line and concat old list
    let list = pages.value.concat(content.split('\n'))
    // trim
    list = list.map((item) => item.trim())
    // remove empty
    list = list.filter((item) => item !== '')
    // remove duplicate
    list = [...new Set(list)]
    pages.value = list
    txtFiles.value = []
  }
  reader.readAsText(file)
}

// edition regex
let regexList: Ref<
  {
    isCheck: boolean
    search: string
    replace: string
  }[]
> = ref([])

// check and preview
let checkTab: Ref<'diff' | 'preview' | undefined> = ref()
let html: Ref<string> = ref('')
let currentPageNum: Ref<number> = ref(0)
let currentPageTitle: Ref<string> = computed(() => {
  if (pages.value.length === 0) return ''
  return pages.value[currentPageNum.value]
})
let lastPageTitle: string = ''
let orgCode: Ref<string> = asyncComputed(async () => {
  if (!currentPageTitle.value) return ''
  if (currentPageTitle.value === lastPageTitle) return orgCode.value
  globalLoading.value = true
  try {
    let result = (await getPage(currentPageTitle.value))?.content || ''
    return result
  } catch (e) {
    console.log(e)
    $dialog.error({
      title: 'get-page-error',
      content: String(e),
      positiveText: t('general.btn-confirm'),
      autoFocus: false,
    })
    return ''
  } finally {
    // change last page title
    lastPageTitle = currentPageTitle.value
    // stop loading
    globalLoading.value = false
  }
}, '')
watch(orgCode, () => {
  // get new diff or preview
  if (checkTab.value === 'diff') {
    checkDiff()
  } else if (checkTab.value === 'preview') {
    getPreview()
  }
})
function getNewCode(orgCode: string): string {
  console.log('object')
  let newCode = orgCode
  for (let index = 0; index < regexList.value.length; index++) {
    const element = regexList.value[index]
    console.log(element)
    if (!element.isCheck || !element.search) continue
    // check regex valid and replace
    try {
      console.log(element.search, element.replace)
      console.log(new RegExp(element.search, 'g').test(newCode))
      newCode = newCode.replace(
        new RegExp(element.search, 'g'),
        // JSON.parse to process special characters like \n
        JSON.parse('"' + element.replace.replace(/"/g, '\\"') + '"'),
      )
    } catch (error) {
      console.log(error)
      $dialog.error({
        title: 'regex-error',
        content: String(error),
        positiveText: t('general.btn-confirm'),
        negativeText: t('general.btn-cancel'),
        autoFocus: false,
      })
    }
  }
  return newCode
}
let diffEditor: monaco.editor.IStandaloneDiffEditor
async function checkDiff() {
  checkTab.value = 'diff'
  // unregeister existing monaco editor
  if (diffEditor) diffEditor.dispose()
  let newCode = getNewCode(orgCode.value)
  // diff
  const originalModel = monaco.editor.createModel(orgCode.value, 'wikitext')
  const modifiedModel = monaco.editor.createModel(newCode, 'wikitext')
  diffEditor = monaco.editor.createDiffEditor(
    document.getElementById('diff-container') as HTMLDivElement,
    {
      automaticLayout: true,
      theme: 'vs-dark',
      wordWrap: 'on',
      unicodeHighlight: {
        ambiguousCharacters: false, // avoid highlight Chinese punctuation
      },
      hideUnchangedRegions: {
        enabled: true,
      },
    },
  )
  diffEditor.setModel({
    original: originalModel,
    modified: modifiedModel,
  })
}
async function getPreview() {
  checkTab.value = 'preview'
  let newCode = diffEditor.getModifiedEditor().getValue()
  let formData = new FormData()
  formData.append('wikitext', newCode)
  formData.append('body_only', 'true')
  let response = await fetch('https://xyy.huijiwiki.com/api/rest_v1/transform/wikitext/to/html', {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) {
    $message.error('preview failed')
    console.log(response)
    return
  }
  let res = await response.text()
  html.value = res
}
let summary: Ref<string | undefined> = ref()
async function savePage() {
  if (!summary.value) {
    $dialog.error({
      title: 'summary-empty',
      content: 'summary-empty',
      positiveText: t('general.btn-confirm'),
      autoFocus: false,
    })
    return
  }
  globalLoading.value = true
  try {
    let newCode = diffEditor.getModifiedEditor().getValue()
    let response = await editPage({
      title: pages.value[currentPageNum.value],
      text: newCode,
      summary: summary.value,
    })
    if (dev) console.log(response)
  } catch (e) {
    console.log(e)
    $dialog.error({
      title: 'save-error',
      content: String(e),
      positiveText: t('general.btn-confirm'),
      autoFocus: false,
    })
  } finally {
    // remove page from list
    pages.value.splice(currentPageNum.value, 1)
    // adjust current page num
    if (currentPageNum.value > pages.value.length - 1) {
      currentPageNum.value = pages.value.length - 1
    }
    // stop loading
    globalLoading.value = false
  }
}
</script>

<style scoped></style>
