<template>
  <div>
    <n-space vertical>
      <n-input-group>
        <n-select
          :placeholder="t(`search-and-${DR}.text-select-pages-by`)"
          v-model:value="selectPagesValue"
          :options="selectPagesOptions"
        />
        <n-button
          :disabled="loading"
          type="info"
          @click="debounce(search[selectPagesValue || 'unselected'], 200)()"
        >
          {{ t(`search-and-${DR}.btn-search`) }}
        </n-button>
      </n-input-group>
      <n-data-table :columns="columns" :data="data" :max-height="240" />
      <n-input-group>
        <n-input
          :placeholder="t(`search-and-${DR}.text-reason`)"
          v-model:value="summary"
          :disabled="loading"
        />
        <n-button
          @click="DR === `destroy` ? debounce(destroy, 200)() : debounce(rescue, 200)()"
          :type="DR === `destroy` ? `error` : `primary`"
          :loading="loading"
        >
          {{ t(`search-and-${DR}.btn-${DR}`) }}
        </n-button>
      </n-input-group>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, h, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deletePage, undeletePage } from '@/utils/mwApi'
import { onBeforeRouteLeave } from 'vue-router'
import type { DataTableColumn, SelectOption } from 'naive-ui'
import { NA, NTag } from 'naive-ui'
import { debounce } from 'lodash-es'
import { useRoute } from 'vue-router'
import sleep from '@anmiles/sleep'

// router guard to prevent leaving page when deleting
onBeforeRouteLeave(() => {
  if (loading.value) {
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

/**
 * DR: short for Destroy or Rescue
 * @type {"destroy" | "rescue"}
 */
let DR = useRoute().name === 'search-and-rescue' ? 'rescue' : 'destroy'

const { t } = useI18n()
let summary: Ref<string | undefined> = ref()
let loading = ref(false)

async function destroy(): Promise<void> {
  loading.value = true
  if (!summary.value) {
    $message.error(t('search-and-destroy.error-no-destroy-reason'))
    loading.value = false
    return
  }
  for (let index = 0; index < data.value.length; index++) {
    const element = data.value[index]
    if (element.status !== 'to-do') continue
    element.status = 'doing'
    let deletionOK = await deletePage({
      title: element.title,
      reason: summary.value,
    })
    if (deletionOK) {
      element.status = 'done'
    } else {
      element.status = 'error'
    }
    await sleep(500)
  }
  loading.value = false
}

async function rescue(): Promise<void> {
  loading.value = true
  if (!summary.value) {
    $message.error(t('search-and-rescue.error-no-rescue-reason'))
    loading.value = false
    return
  }
  for (let index = 0; index < data.value.length; index++) {
    const element = data.value[index]
    if (element.status !== 'to-do') continue
    element.status = 'doing'
    let undeletion = await undeletePage({
      title: element.title,
      reason: summary.value,
    })
    if (undeletion.ok) {
      $message.success(t('search-and-rescue.success-rescue-page'))
      element.status = 'done'
    } else {
      $message.error(t('search-and-rescue.error-rescue-page'))
      element.status = 'error'
    }
    await sleep(500)
  }
  loading.value = false
}

// data table
let columns: DataTableColumn[] = [
  {
    key: 'title',
    title: t(`search-and-${DR}.label-table-title`),
    render: (rowData) => {
      return h(
        NA,
        { href: location.origin + '/wiki/' + rowData.title, target: '_blank' },
        () => rowData.title,
      )
    },
  },
  {
    key: 'status',
    title: t(`search-and-${DR}.label-table-status`),
    render: (rowData) => {
      return h(
        NTag,
        {
          type:
            rowData.status === 'to-do'
              ? 'info'
              : rowData.status === 'doing'
                ? 'warning'
                : rowData.status === 'done'
                  ? 'success'
                  : 'error',
          bordered: false,
        },
        () => t(`search-and-${DR}.label-status-${rowData.status}`),
      )
    },
  },
]
let data: Ref<
  {
    title: string
    status: 'to-do' | 'doing' | 'done' | 'error'
  }[]
> = ref([])

// select pages
let selectPagesValue: Ref<undefined | 'txt'> = ref()
let selectPagesOptions: Ref<SelectOption[]> = ref([
  {
    label: t('search-and-destroy.label-select-pages-by-txt'),
    value: 'txt',
  },
  {
    label: t('search-and-destroy.label-select-pages-by-xlsx'),
    value: 'xlsx',
    disabled: true,
  },
  {
    label: t('search-and-destroy.label-select-pages-by-category'),
    value: 'category',
    disabled: true,
  },
])
let search = {
  txt: () => {
    let input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt'
    input.onchange = async () => {
      if (!input.files) return
      let txtString = await input.files[0].text()
      if (!txtString) return
      // split by line break
      let list = txtString.split('\n')
      // trim
      list = list.map((item) => item.trim())
      // remove empty
      list = list.filter((item) => item !== '')
      // remove duplicate
      list = [...new Set(list)]
      data.value = list.map((item) => {
        return {
          title: item,
          status: 'to-do',
        }
      })
    }
    input.click()
  },
  unselected: () => {
    $message.error(t('search-and-destroy.error-no-select-pages-by'))
  },
}
</script>

<style scoped></style>
