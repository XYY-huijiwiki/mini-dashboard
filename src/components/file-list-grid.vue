<template>
  <n-card class="h-full" content-class="shrink-0 h-0">
    <!-- <pre>{{ checkedRowKeys }}</pre> -->
    <n-infinite-scroll :distance="270" @load="count = Math.min(count + 10, data.length)">
      <drag-select v-model="checkedRowKeys" class="h-full" @click="showDropdown = false">
        <drag-select-option v-for="item in countedData" :value="item.name" :key="item.name">
          <div class="tile" @contextmenu="(e: MouseEvent) => handleContextMenu(item, e)">
            <img
              v-if="item.thumb_url"
              class="thumb"
              :src="`https://ik.imagekit.io/gwa1ycz7gc/` + item.thumb_url"
              alt="thumb"
            />
            <div v-else class="thumb" style="background-color: var(--container)">
              <file-icon :file-type="item.type" :size="48" />
            </div>
            <div class="name line-clamp-1">
              <n-button
                text
                size="small"
                :title="item.name"
                @click="
                  (e: MouseEvent) => {
                    if (e.ctrlKey || e.metaKey) return
                    checkedRowKeys = [item.name]
                    emit('preview')
                  }
                "
              >
                {{ item.name }}
              </n-button>
            </div>
            <div class="date line-clamp-1">
              {{ dayjs(item.updated_at).format('ll') }}
            </div>
            <n-checkbox
              class="checkbox"
              :checked="checkedRowKeys.includes(item.name)"
              @click="
                (e: MouseEvent) => {
                  e.stopPropagation()
                  checkedRowKeys.includes(item.name)
                    ? (checkedRowKeys = checkedRowKeys.filter((i) => i !== item.name))
                    : (checkedRowKeys = [...checkedRowKeys, item.name])
                }
              "
            />
          </div>
        </drag-select-option>
      </drag-select>
    </n-infinite-scroll>
  </n-card>
  <file-menu
    :data="checkedItems"
    v-model:show="showDropdown"
    :position="{
      x: dropdownX,
      y: dropdownY,
    }"
    @preview="emit('preview')"
    @link-copy="emit('link-copy')"
    @download="emit('download')"
    @delete="emit('delete')"
    @rename="emit('rename')"
    @details="emit('detail')"
  />
</template>

<script setup lang="ts">
import type { DataTableFilterState, DataTableCreateRowKey } from 'naive-ui'
import { computed, nextTick, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { dayjsLocales } from '@/stores/locales'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { DragSelect, DragSelectOption } from '@coleqiu/vue-drag-select'
import { isArray, toString } from 'lodash-es'

dayjs.extend(localizedFormat)
dayjs.locale(dayjsLocales.value || 'en')
let emit = defineEmits([
  'preview',
  'detail',
  'link-copy',
  'delete',
  'download',
  'rename',
  'details',
])
let { data: rawData, checkedItems } = defineProps<{
  data: FileDetail[]
  checkedItems: FileDetail[]
}>()
let checkedRowKeys = defineModel<ReturnType<DataTableCreateRowKey>[]>('checkedRowKeys', {
  required: true,
})
let sorterKey = defineModel<SorterKey>('sorterKey', {
  required: true,
})
let sorterOrder = defineModel<SorterOrder>('sorterOrder', { required: true })
let filters = defineModel<DataTableFilterState>('filters', { required: true })

let data = computed(() => {
  let res = rawData
  // filter by search text
  if (filters.value.name) {
    let filterNameStr = toString(
      isArray(filters.value.name) ? filters.value.name[0] : filters.value.name,
    )
    res = res.filter((i) => i.name.toLowerCase().includes(filterNameStr.toLowerCase()))
  }
  // sort
  if (sorterKey.value === 'size') {
    res = res.sort((a, b) =>
      sorterOrder.value === 'ascend' ? a['size'] - b['size'] : b['size'] - a['size'],
    )
  } else {
    res = res.sort((a, b) =>
      sorterOrder.value === 'ascend'
        ? ((a[sorterKey.value] || '') as string).localeCompare((b[sorterKey.value] || '') as string)
        : ((b[sorterKey.value] || '') as string).localeCompare(
            (a[sorterKey.value] || '') as string,
          ),
    )
  }
  return res
})
let count = ref(Math.min(50, data.value.length))
let countedData = computed(() => data.value.slice(0, count.value))
watch(
  () => data.value.length,
  (newLength) => {
    count.value = Math.min(50, newLength)
  },
)

// select and context menu
let showDropdown = ref(false)
let dropdownX = ref(0)
let dropdownY = ref(0)
async function handleContextMenu(item: FileDetail, e: MouseEvent) {
  e.preventDefault()
  // if this row is unchecked, cancel other checked rows and check this row
  if (!checkedRowKeys.value.includes(item.name)) {
    checkedRowKeys.value = [item.name]
  }
  await nextTick()
  dropdownX.value = e.clientX
  dropdownY.value = e.clientY
  showDropdown.value = true
}
</script>

<style lang="less">
.drag-select {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  .tile {
    width: 138px;
    height: 135px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid transparent;
  }
  .tile:hover {
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow:
      0 0 2px rgba(0, 0, 0, 0.12),
      0 2px 4px rgba(0, 0, 0, 0.14);
  }
  .tile:has(.checkbox[aria-checked='true']) {
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid var(--primary);
  }
  .thumb {
    object-fit: contain;
    margin: 16px 16px 0 16px;
    flex: 1;
    height: 0;
    flex-shrink: 0;
  }
  div.thumb {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .name {
    font-size: 12px;
    margin-top: 12px;
    margin-left: 8px;
    margin-right: 8px;
    text-align: center;
  }
  .date {
    font-size: 12px;
    margin-bottom: 12px;
    margin-left: 8px;
    margin-right: 8px;
    text-align: center;
  }
  .checkbox {
    position: absolute;
    top: 0;
    right: 0;
    margin: 8px;
    visibility: hidden;
  }
  .checkbox[aria-checked='true'] {
    visibility: visible;
  }
  .tile:hover .checkbox {
    visibility: visible;
  }
}
.drag-select__area {
  border: 2px solid #0466b6;
  background-color: #0466b680 !important;
}
</style>
