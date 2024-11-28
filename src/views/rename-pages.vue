<template>
  <div>
    <n-space vertical>
      <n-grid cols="2">
        <n-grid-item>
          <n-statistic :label="t('rename-pages.label-file-name')">
            {{ dataInfo.name }}
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('rename-pages.label-episodes')">
            {{ dataInfo.length }}
          </n-statistic>
        </n-grid-item>
      </n-grid>

      <n-progress
        :percentage="Math.floor((count / dataInfo.length) * 100)"
        :show-indicator="true"
        indicator-placement="inside"
        :status="working ? 'info' : 'success'"
        :processing="working"
      />

      <n-input-group>
        <n-input v-model:value="summary" :placeholder="t('rename-pages.label-edit-summary')" />
        <n-upload
          abstract
          accept=".xlsx"
          :show-file-list="false"
          :on-update:file-list="refreshData"
          :default-upload="false"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button :disabled="working" @click="handleClick">
              {{ t('rename-pages.label-select-file') }}
            </n-button>
          </n-upload-trigger>
        </n-upload>
        <n-button :disabled="!fileList[0] || count !== 0" @click="renamePages()">
          {{ t('rename-pages.btn-import') }}
        </n-button>
      </n-input-group>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { type UploadFileInfo } from 'naive-ui'
import { utils, read } from 'xlsx'
import sleep from '@anmiles/sleep'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { renamePage } from '@/utils/mwApi'
import { computed } from 'vue'

// router guard to prevent leaving page when working
onBeforeRouteLeave(() => {
  if (working.value) {
    $dialog.error({
      title: t('general.text-leave-warning-title'),
      content: t('general.text-leave-warning-content'),
      positiveText: t('general.btn-confirm'),
      autoFocus: false,
      transformOrigin: 'center',
    })
    return false
  }
})

// init i18n
const { t } = useI18n()

// define dev env
let dev = import.meta.env.DEV

let fileList: Ref<UploadFileInfo[]> = ref([])
let working = ref(false)
let dataInfo = computed(() => {
  return {
    name: fileList.value[0]?.name || t('rename-pages.text-no-file-selected'),
    length: data.value.length,
  }
})
let data: Ref<[string, string][]> = ref([])
let summary = ref('')
let count = ref(0)

let refreshData = async (list: UploadFileInfo[]) => {
  console.log('refreshData')

  // check if fileList[0] exists
  if (!list[0]?.file) {
    if (dev) console.log('fileList changed before any file selected')
    return
  }

  // if multiple files added
  while (list.length > 1) {
    console.log(list.length)
    list.splice(0, 1)
  }

  // sync fileList
  console.log(list)
  fileList.value = list

  // reset import count
  count.value = 0

  // deal with xlsx file
  // file to ArrayBuffer
  let arrayBuffer = await list[0].file.arrayBuffer()
  // read xlsx file
  let workbook = await read(arrayBuffer, { type: 'array' })
  // transform xlsx file to json
  let rawData: any[][] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    header: 1,
  })
  // transform json to wanted data format
  data.value = rawData
    // remove same titles
    .filter((item) => String(item[0]) !== String(item[1]))
    // format
    .map((item) => [String(item[0]), String(item[1])])
  // remove duplicate
  data.value = [...new Map(data.value).entries()]
  if (dev) console.log('data', data.value)
}

async function renamePages() {
  // check if fileList[0] exists
  if (!fileList.value[0]?.file) {
    console.log('import before any file selected')
    return
  }

  // check if summary is empty
  if (summary.value === '') {
    $message.error('Summary不能为空')
    return
  }

  // activate working status
  working.value = true

  // upload data
  for await (const dataItem of data.value) {
    try {
      let res = await renamePage({
        from: dataItem[0],
        to: dataItem[1],
        noredirect: true,
        reason: summary.value,
      })
      console.log(res)
    } catch (error) {
      $message.error(`重命名${dataItem[0]}失败`)
      console.log(error)
      continue
    }
    count.value++
    await sleep(5000)
  }

  // deactivate importing status
  working.value = false
}
</script>

<style scoped></style>
