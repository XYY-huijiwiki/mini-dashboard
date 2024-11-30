import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { type Ref, ref } from 'vue'
import { cloneDeep } from 'lodash-es'

interface Settings {
  language: 'auto' | string
  dataType: 'xlsx' | 'json'
  exportBackup: boolean
}

export const useSettingsStore = defineStore('settings', () => {
  // define default settings
  const defaultSettings: Settings = {
    language: 'auto',
    dataType: 'xlsx',
    exportBackup: false,
  }
  // init settings from localStorage or use default settings
  const settings: Ref<Settings> = useLocalStorage('miniDashboardSettings', defaultSettings, {
    mergeDefaults: true,
  })

  // function of reset settings
  function resetSettings() {
    settings.value = cloneDeep(defaultSettings)
  }

  // global state
  const globalLoading = ref(false)

  return { settings, resetSettings, globalLoading }
})
