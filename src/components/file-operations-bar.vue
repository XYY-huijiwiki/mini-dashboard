<template>
  <n-card size="small" content-style="padding-bottom: 4px">
    <n-flex justify="space-between" :wrap="false" :size="120">
      <n-scrollbar x-scrollable class="flex-1 w-0 shrink-0 pb-2">
        <n-flex :wrap="false">
          <!-- new -->
          <n-button
            quaternary
            tag="a"
            href="https://github.com/XYY-huijiwiki/files/releases/new"
            target="_blank"
            style="color: var(--n-text-color)"
          >
            <template #icon>
              <material-symbol>add_circle</material-symbol>
            </template>
            {{ t('github-files.btn-new') }}
          </n-button>
          <n-divider class="relative top-2" vertical />
          <!-- cut -->
          <tooltipped-icon-button
            :text="t('github-files.btn-cut')"
            icon="content_cut"
            :disabled="true"
            @click=""
          />
          <!-- copy -->
          <tooltipped-icon-button
            :text="t('github-files.btn-copy')"
            icon="content_copy"
            :disabled="true"
            @click=""
          />
          <!-- paste -->
          <tooltipped-icon-button
            :text="t('github-files.btn-paste')"
            icon="content_paste"
            :disabled="true"
            @click=""
          />
          <!-- rename -->
          <tooltipped-icon-button
            :text="t('github-files.btn-rename')"
            icon="edit"
            :disabled="true"
            @click="emit('file-rename')"
          />
          <!-- share -->
          <tooltipped-icon-button
            v-if="isShareSupported"
            :text="t('github-files.btn-share')"
            icon="share"
            :disabled="checkedRowKeys.length === 0"
            @click="emit('file-share')"
          />
          <!-- delete -->
          <tooltipped-icon-button
            :text="t('github-files.btn-delete')"
            icon="delete"
            :disabled="true"
            @click="emit('file-delete')"
          />
          <n-divider class="relative top-2" vertical />
          <!-- link copy -->
          <tooltipped-icon-button
            :text="t('github-files.btn-link-copy')"
            icon="link"
            @click="emit('link-copy')"
            :disabled="checkedRowKeys.length === 0"
          />
          <!-- download -->
          <tooltipped-icon-button
            :text="t('github-files.btn-download')"
            icon="download"
            @click="emit('file-download')"
            :disabled="checkedRowKeys.length === 0"
          />
          <n-divider class="relative top-2" vertical />
          <!-- sort -->
          <n-dropdown trigger="click" :options="sortOptions" @select="sortHandler">
            <n-button quaternary>
              {{ t('github-files.sort.btn-sort') }}
              <template #icon>
                <MaterialSymbol>sort</MaterialSymbol>
              </template>
            </n-button>
          </n-dropdown>
          <!-- filter -->
          <n-dropdown
            trigger="click"
            :options="viewOptions"
            @select="(key: ViewMode) => (viewMode = key)"
          >
            <n-button quaternary>
              <template #icon>
                <MaterialSymbol>
                  {{
                    viewMode === 'details' ? 'menu' : viewMode === 'list' ? 'reorder' : 'grid_view'
                  }}
                </MaterialSymbol>
              </template>
              {{ t('github-files.view.btn-view') }}
            </n-button>
          </n-dropdown>
        </n-flex>
      </n-scrollbar>

      <n-flex :wrap="false" class="pb-2">
        <!-- preview -->
        <n-button quaternary :disabled="checkedRowKeys.length !== 1" @click="emit('file-preview')">
          {{ t('github-files.btn-preview') }}
          <template #icon>
            <MaterialSymbol>visibility </MaterialSymbol>
          </template>
        </n-button>
        <!-- details -->
        <n-button quaternary @click="showDetailsPane = !showDetailsPane">
          {{ t('github-files.btn-details') }}
          <template #icon>
            <MaterialSymbol>
              {{ showDetailsPane ? 'arrow_menu_open' : 'arrow_menu_close' }}
            </MaterialSymbol>
          </template>
        </n-button>
      </n-flex>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MaterialSymbol from './material-symbol.vue'
import { ref, h } from 'vue'
import { useShare } from '@vueuse/core'

let { isSupported: isShareSupported } = useShare()

const { t } = useI18n()
let checkedRowKeys = defineModel<(string | number)[]>('checkedRowKeys', {
  required: true,
})
let showDetailsPane = defineModel<boolean>('showDetailsPane', {
  required: true,
})
let viewMode = defineModel<ViewMode>('viewMode', {
  required: true,
})
let sorterKey = defineModel<SorterKey>('sorterKey', {
  required: true,
})
let sorterOrder = defineModel<SorterOrder>('sorterOrder', {
  required: true,
})

let emit = defineEmits([
  'file-preview',
  'link-copy',
  'file-download',
  'file-delete',
  'file-rename',
  'file-details',
  'file-share',
])

/*
 *
 * Sorter
 *
 */
let sortOptions = ref([
  {
    label: t('github-files.sort.btn-type'),
    key: 'type',
    icon: () => h(MaterialSymbol, () => sorterKey.value === 'type' && 'check'),
  },
  {
    label: t('github-files.sort.btn-name'),
    key: 'name',
    icon: () => h(MaterialSymbol, () => sorterKey.value === 'name' && 'check'),
  },
  {
    label: t('github-files.sort.btn-date-modified'),
    key: 'updated_at',
    icon: () => h(MaterialSymbol, () => sorterKey.value === 'updated_at' && 'check'),
  },
  // {
  //   label: t('github-files.sort.btn-uploader'),
  //   key: 'uploader',
  //   icon: () => h(MaterialSymbol, () => sorterKey.value === 'uploader' && 'check'),
  // },
  {
    label: t('github-files.sort.btn-size'),
    key: 'size',
    icon: () => h(MaterialSymbol, () => sorterKey.value === 'size' && 'check'),
  },
  {
    type: 'divider',
    key: 'divider',
  },
  {
    label: t('github-files.sort.btn-asc'),
    key: 'ascend',
    icon: () => h(MaterialSymbol, () => sorterOrder.value === 'ascend' && 'check'),
  },
  {
    label: t('github-files.sort.btn-desc'),
    key: 'descend',
    icon: () => h(MaterialSymbol, () => sorterOrder.value === 'descend' && 'check'),
  },
])
let sortHandler = (key: SorterKey | SorterOrder) => {
  ;['ascend', 'descend'].includes(key)
    ? (sorterOrder.value = key as SorterOrder)
    : (sorterKey.value = key as SorterKey)
}

/*
 *
 * View
 *
 */

let viewOptions =
  // computed(() => [
  ref([
    {
      label: () => [
        h(MaterialSymbol, { verticalAlign: 'middle', size: 20, class: 'mr-1' }, () => 'menu'),
        h('span', undefined, t('github-files.view.btn-details')),
      ],
      key: 'details',
      icon: () => h(MaterialSymbol, () => viewMode.value === 'details' && 'check'),
    },
    {
      label: () => [
        h(MaterialSymbol, { verticalAlign: 'middle', size: 20, class: 'mr-1' }, () => 'reorder'),
        h('span', undefined, t('github-files.view.btn-list')),
      ],
      key: 'list',
      icon: () => h(MaterialSymbol, () => viewMode.value === 'list' && 'check'),
    },
    {
      label: () => [
        h(MaterialSymbol, { verticalAlign: 'middle', size: 20, class: 'mr-1' }, () => 'grid_view'),
        h('span', undefined, t('github-files.view.btn-tiles')),
      ],
      key: 'tiles',
      icon: () => h(MaterialSymbol, () => viewMode.value === 'tiles' && 'check'),
    },
  ])
</script>

<style scoped></style>
