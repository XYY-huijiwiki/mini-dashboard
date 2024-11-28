<template>
  <div>
    <n-input-group>
      <n-select v-model:value="value" :options="cartoonList" filterable>
        <template #empty>
          <n-empty :description="t('general.loading')">
            <template #icon>
              <material-symbol :size="32">hourglass_empty</material-symbol>
            </template>
          </n-empty>
        </template>
      </n-select>
      <n-button @click="getDataFile(value)" :loading="btnLoading">
        {{ t('data-exporter.btn-export') }}
      </n-button>
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cartoonList from '@/json/cartoon-list.json'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { downloadJson, downloadXlsx } from '@/utils/dataDownloader'
import { useI18n } from 'vue-i18n'

let { t } = useI18n()
let { settings } = storeToRefs(useSettingsStore())

// 定义一些变量
let btnLoading = ref(false)
let value = ref(null)

// 导出数据文件
async function getDataFile(title: string | null) {
  // 打开加载动画
  btnLoading.value = true

  // 如果输入为null
  if (title === null) {
    $message.error('请选择需要导出的内容')
    btnLoading.value = false
    return
  }

  // 请求数据
  let params = new URLSearchParams({
    filter: JSON.stringify({ 系列1: title }),
    sort_by: '集数',
    pagesize: '530',
    date: Date(),
  })
  let url = `https://xyy.huijiwiki.com/api/rest_v1/namespace/data?${params.toString()}`
  let response = await fetch(url)

  // 如果请求失败
  if (!response.ok) {
    $message.error('获取数据失败')
    btnLoading.value = false
    return
  }

  // 处理数据
  let data: ResponseData = await response.json()
  let cartoonData = data._embedded

  // export data, data type depends on settings
  if (settings.value.dataType === 'json') {
    downloadJson(cartoonData, title)
    if (settings.value.exportBackup) {
      downloadJson(cartoonData, title + ' ' + new Date())
    }
  } else if (settings.value.dataType === 'xlsx') {
    downloadXlsx(cartoonData, title)
    if (settings.value.exportBackup) {
      downloadXlsx(cartoonData, title + ' ' + new Date())
    }
  } else {
    $message.error('未知的数据类型')
    btnLoading.value = false
    return
  }

  // 导出成功提示
  $message.success('导出成功')
  btnLoading.value = false
}
</script>

<style scoped></style>
