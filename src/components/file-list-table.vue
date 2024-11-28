<template>
  <n-data-table
    class="h-full w-full"
    ref="dataTable"
    :columns="columns"
    :data="data"
    virtual-scroll
    max-height="calc(100vh - 215.4px)"
    :loading="loading"
    :size="viewerMode === 'detailsList' ? undefined : 'small'"
    :row-key="(row: FileDetail) => row.name"
    :row-props="rowProps"
    :scroll-x="800"
    v-model:checked-row-keys="checkedRowKeys"
    @update:sorter="
      (data: DataTableSortState | null) => {
        sorterKey = data?.columnKey as SorterKey
        sorterOrder = data?.order as SorterOrder
      }
    "
    @update-filters="(data: DataTableFilterState) => (filters = data)"
  />
  <file-menu
    :data="checkedItems"
    v-model:show="showDropdown"
    @preview="emit('preview')"
    @detail="emit('detail')"
    :position="{
      x: dropdownX,
      y: dropdownY,
    }"
  />
</template>

<script setup lang="ts">
import { computed, h, ref, nextTick, watch } from 'vue'
import type { Ref } from 'vue'
import { NA, NText, NTag, NSpace, NEllipsis, NButton, NDataTable } from 'naive-ui'
import type {
  DataTableColumns,
  DataTableSortState,
  DataTableCreateRowKey,
  DataTableFilterState,
} from 'naive-ui'
import fileIcon from '@/components/file-icon.vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { dayjsLocales } from '@/stores/locales'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { filesize as filesizeNoLocale } from 'filesize'
import { useLocalesStore } from '@/stores/locales'
import { storeToRefs } from 'pinia'
import MaterialSymbol from './material-symbol.vue'

let { langCode } = storeToRefs(useLocalesStore())
let filesize = (size: number) => filesizeNoLocale(size, { locale: langCode.value })
dayjs.extend(localizedFormat)
dayjs.locale(dayjsLocales.value || 'en')
let { t } = useI18n()
let dataTable = ref()

let { data } = defineProps<{
  data: FileDetail[]
  loading: boolean
  viewerMode: 'detailsList' | 'compactDetailsList'
  checkedItems: FileDetail[]
}>()

let emit = defineEmits(['preview', 'detail'])

/*
 *
 * Data Table sorter and filters
 *
 */
let checkedRowKeys = defineModel<ReturnType<DataTableCreateRowKey>[]>('checkedRowKeys', {
  required: true,
})
let sorterKey = defineModel<SorterKey>('sorterKey', {
  required: true,
})
let sorterOrder = defineModel<SorterOrder>('sorterOrder', { required: true })
type SorterKey = 'type' | 'name' | 'updated_at' | 'uploader' | 'size'
type SorterOrder = 'ascend' | 'descend'
let filters = defineModel<DataTableFilterState>('filters', { required: true })
watch([sorterKey, sorterOrder], ([key, order]) => {
  dataTable.value?.sort(key, order)
})
watch(
  filters,
  (value) => {
    dataTable.value?.filter(value)
  },
  {
    deep: true,
  },
)

/*
 *
 * Data Table Columns
 *
 */
let columns: Ref<DataTableColumns<FileDetail>> = computed(() => [
  {
    type: 'selection',
    fixed: 'left',
  },
  {
    title: sorterKey.value === 'type' ? '' : () => h(MaterialSymbol, 'draft'),
    renderSorter: sorterKey.value === 'type' ? undefined : () => h('span'),
    key: 'type',
    width: '3em',
    sorter: 'default',
    render: (row) => {
      return h(fileIcon, { fileType: row.type })
      // equivalent to HTML
      // <file-icon :fileType="row.type"></file-icon>
    },
  },
  {
    title: t('github-files.table-header-name'),
    key: 'name',
    resizable: true,
    width: 350,
    minWidth: 200,
    maxWidth: 500,
    sorter: 'default',
    render: (row) => {
      return h(
        NEllipsis,
        h(
          NButton,
          {
            'on-click': () => emit('preview'),
            tag: 'a',
            text: true,
          },
          () => row.name,
        ),
      )
      // equivalent to HTML
      // <n-a href="..." target="_blank">{{ ... }}</n-a>
    },
    filter: (value, row) => {
      return row.name.toLowerCase().includes(value.toString().toLowerCase())
    },
  },
  {
    title: t('github-files.table-header-updated-at'),
    key: 'updated_at',
    width: '10em',
    sorter: 'default',
    render: (row) => {
      return h(NText, dayjs(row.updated_at).format('ll'))
      // equivalent to HTML
      // <n-text>{{ row.updated_at || "N/A" }}</n-text>
    },
  },
  {
    title: t('github-files.table-header-uploader'),
    key: 'uploader',
    width: '10em',
    sorter: 'default',
    render: (row) => {
      return h(
        NEllipsis,
        h(NA, { href: row.uploader_html_url }, () => row.uploader),
      )
    },
  },
  {
    title: t('github-files.table-header-size'),
    key: 'size',
    width: '8em',
    sorter: 'default',
    render: (row) => {
      return h(NText, filesize(row.size))
      // equivalent to HTML
      // <n-text>{{ filesize(..., { locale: langCode }) }}</n-text>
    },
  },
  {
    title: t('github-files.table-header-status'),
    key: 'status',
    minWidth: '10em',
    filterOptions: [
      { label: 'Not Used', value: 'not used' },
      { label: 'Wanted', value: 'wanted' },
      { label: 'No Source', value: 'no source' },
      { label: 'No License', value: 'no license' },
      { label: 'Asset Broken', value: 'asset broken' },
    ],
    filter: (value, row) => {
      return row.warnings.includes(value as WarningType)
    },
    render: (row) => {
      return h(NSpace, () => [
        row.warnings.length === 0
          ? h(NTag, { type: 'success', size: 'small' }, () => 'Normal')
          : row.warnings.map((warning) => h(NTag, { type: 'error', size: 'small' }, () => warning)),
      ])
      // equivalent to HTML
      // <n-space>
      //    <n-tag v-if="row.warnings.length === 0" type="success" size="small">Normal</n-tag>
      //    <n-tag v-else v-for="warning in row.warnings" type="error" size="small">{{ warning }}</n-tag>
      // </n-space>
    },
  },
])

/*
 *
 * Data Table Customization
 *
 */
let showDropdown = ref(false)
let dropdownX = ref(0)
let dropdownY = ref(0)
let rowProps = (row: FileDetail) => {
  return {
    onContextmenu: async (e: MouseEvent) => {
      e.preventDefault()
      // if this row is unchecked, cancel other checked rows and check this row
      if (!checkedRowKeys.value.includes(row.name)) {
        checkedRowKeys.value = [row.name]
      }
      await nextTick()
      dropdownX.value = e.clientX
      dropdownY.value = e.clientY
      showDropdown.value = true
    },
    onclick: async (e: MouseEvent) => {
      let triggerClassList = (e.target as HTMLElement).classList
      if (e.button !== 0) {
        // do nothing if click event is not triggered by left button
        return
      } else if (triggerClassList.contains('n-checkbox-box__border')) {
        // do nothing if target is div.n-checkbox-box__border
        // this is to prevent bubble from checkbox
        return
      } else if (triggerClassList.contains('n-data-table-td--selection')) {
        // if target is td.n-data-table-td--selection, toggle checkbox
        if (checkedRowKeys.value.includes(row.name)) {
          checkedRowKeys.value = checkedRowKeys.value.filter((item) => item !== row.name)
        } else {
          checkedRowKeys.value = [...checkedRowKeys.value, row.name]
        }
      } else {
        // else, single select this row
        checkedRowKeys.value = [row.name]
      }
    },
  }
}
</script>

<style scoped></style>
