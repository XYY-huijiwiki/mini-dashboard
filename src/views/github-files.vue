<template>
  <n-flex vertical class="h-full">
    <file-search-bar v-model:filters="filters" />
    <file-operations-bar
      v-model:checked-row-keys="checkedRowKeys"
      v-model:showDetailsPane="showDetailsPane"
      v-model:viewMode="viewMode"
      v-model:sorterKey="sorterKey"
      v-model:sorterOrder="sorterOrder"
      @file-preview="preview = checkedItems[0]"
      @link-copy="linkCopy"
      @file-download="fileDownload"
      @file-delete=""
      @file-rename=""
      @file-share="fileShare"
    />
    <n-split
      direction="horizontal"
      v-model:size="detailsDrawerSize"
      :min="0.6"
      :max="0.8"
      :pane1-class="showDetailsPane ? 'pr-1' : ''"
      pane2-class="pl-1"
      :resize-trigger-size="showDetailsPane ? 3 : 0"
      class="flex-1 shrink-0 h-0"
    >
      <template #1>
        <file-preview v-model="preview" v-if="preview" />
        <template v-else>
          <file-list-table
            v-if="viewMode === 'details' || viewMode === 'list'"
            v-model:checked-row-keys="checkedRowKeys"
            :checked-items="checkedItems"
            v-model:sorterKey="sorterKey"
            v-model:sorterOrder="sorterOrder"
            v-model:filters="filters"
            :data="data"
            :loading="loading"
            :viewMode="viewMode"
            @preview="preview = checkedItems[0]"
            @detail="showDetailsPane = true"
            @link-copy="linkCopy"
            @download="fileDownload"
            @delete=""
            @rename=""
          />
          <file-list-grid
            v-else
            :data="data"
            v-model:checked-row-keys="checkedRowKeys"
            :checked-items="checkedItems"
            v-model:sorterKey="sorterKey"
            v-model:sorterOrder="sorterOrder"
            v-model:filters="filters"
            @preview="preview = checkedItems[0]"
            @detail="showDetailsPane = true"
            @link-copy="linkCopy"
            @download="fileDownload"
            @delete=""
            @rename=""
          />
        </template>
      </template>
      <template #2 v-if="showDetailsPane">
        <file-details :fileDetails="checkedItems" @close="showDetailsPane = false" />
      </template>
    </n-split>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { NFlex } from 'naive-ui'
import type { DataTableRowKey, DataTableFilterState } from 'naive-ui'
import mime from 'mime/lite'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { dayjsLocales } from '@/stores/locales'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import fileListTable from '@/components/file-list-table.vue'
import FileOperationsBar from '@/components/file-operations-bar.vue'

const { t } = useI18n()
dayjs.extend(localizedFormat)
dayjs.locale(dayjsLocales.value || 'en')

let fileDownload = () => {
  checkedItems.value.forEach(({ name, download_url }) => {
    download_url
      ? window.open(download_url)
      : $notification.error({
          title: t('github-files.msg-download-failed'),
          content: t('github-files.msg-download-failed-desc', [name]),
        })
  })
}

let linkCopy = () => {
  navigator.clipboard.writeText(checkedItems.value.map((item) => item.html_url).join('\n'))
  $message.success(t('github-files.msg-link-copied'))
}
let fileShare = () => {
  if (checkedItems.value.length === 1) {
    navigator.share({
      title: checkedItems.value[0].name,
      text: checkedItems.value[0].desc,
      url: checkedItems.value[0].html_url,
    })
  } else {
    navigator.share({
      text: checkedItems.value.map((item) => item.html_url).join('\n'),
    })
  }
}

// preview
let preview: Ref<FileDetail | undefined> = ref(undefined)

let sorterKey: Ref<SorterKey> = ref('name')
let sorterOrder: Ref<SorterOrder> = ref('ascend')

let filters = ref<DataTableFilterState>({})

let loading: Ref<boolean> = ref(true)
let data: Ref<FileDetail[]> = ref([])
let checkedRowKeys = ref<DataTableRowKey[]>([])

let viewMode: Ref<ViewMode> = ref('list')

/*
 *
 * Details Pane
 *
 */
let checkedItems: Ref<FileDetail[]> = computed(() => {
  if (checkedRowKeys.value.length === 0) {
    return []
  } else {
    return data.value.filter((item) => checkedRowKeys.value.includes(item.name))
  }
})
let showDetailsPane = ref(false)
let detailsDrawerSizeTemp = ref(0.7)
let detailsDrawerSize = ref(1)
watch(showDetailsPane, (value) => {
  if (value) {
    detailsDrawerSize.value = detailsDrawerSizeTemp.value
  } else {
    detailsDrawerSizeTemp.value = detailsDrawerSize.value
    detailsDrawerSize.value = 1
  }
})

onMounted(async () => {
  // get data from github
  let fileListFromGitHub: FileDetailFromGithub[] = await (
    await fetch('https://xyy-huijiwiki.github.io/files/releases.json')
  ).json()

  // get data from XYY-huijiwiki
  let filesInUse: string[] = []
  let ifContinue = true
  do {
    let params = {
      action: 'query',
      list: 'querypage',
      qppage: 'Wantedfiles',
      format: 'json',
      qplimit: 'max',
      qpoffset: filesInUse.length.toString(),
    }
    let res: {
      batchcomplete: string
      continue:
        | {
            qpoffset: number
            continue: string
          }
        | undefined
      query: {
        querypage: {
          name: string
          results: {
            value: string
            ns: number
            title: string
          }[]
        }
      }
    } = await (
      await fetch('https://xyy.huijiwiki.com/api.php?' + new URLSearchParams(params))
    ).json()
    filesInUse.push(
      ...res.query.querypage.results.map((item) =>
        decodeURIComponent(item.title).replace(/ /g, '_').replace('文件:', ''),
      ),
    )
    ifContinue = res.continue !== undefined
  } while (ifContinue)
  // filter filesInUse
  filesInUse = filesInUse.filter((item) => item.startsWith('GitHub:'))
  // remove "GitHub:" from filesInUse
  filesInUse = filesInUse.map((item) => item.replace('GitHub:', ''))

  // process data
  // process data from github
  for (let index = 0; index < fileListFromGitHub.length; index++) {
    const element = fileListFromGitHub[index]
    const file = element.assets.find((item) => item.name.startsWith('default'))
    const thumbFile = element.assets.find((item) => item.name.startsWith('thumb'))
    data.value.push({
      name: element.tag_name,
      size: file?.size || 0,
      type: mime.getType(element.tag_name.split('.').pop() || ''),
      html_url: element.html_url,
      thumb_url: thumbFile?.browser_download_url || '',
      download_url: file?.browser_download_url || '',
      desc: element.body,
      updated_at: file ? file.updated_at : '',
      uploader: file?.uploader.login || '',
      uploader_html_url: file?.uploader.html_url || '',
      warnings: (() => {
        let warnings: WarningType[] = []
        if (element.assets_broken) {
          warnings.push('asset broken')
        }
        if (filesInUse.includes(element.tag_name)) {
          // remove it from filesInUse
          filesInUse.splice(filesInUse.indexOf(element.tag_name), 1)
        } else {
          warnings.push('unused')
        }
        if (element.body.match(/^- 文件来源：.+$/m) === null) {
          warnings.push('no source')
        }
        if (element.body.match(/^- (?:文件许可|授权协议)：.+$/m) === null) {
          warnings.push('no license')
        }
        return warnings
      })(),
    })
  }
  // process data from XYY-huijiwiki
  for (let index = 0; index < filesInUse.length; index++) {
    const element = filesInUse[index]
    data.value.push({
      name: element,
      size: 0,
      type: mime.getType(element.split('.').pop() || ''),
      html_url: '',
      thumb_url: '',
      download_url: '',
      desc: '',
      updated_at: '',
      uploader: '',
      uploader_html_url: '',
      warnings: ['wanted'],
    })
  }

  loading.value = false
})
</script>
