import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type Ref, ref } from "vue";
import { cloneDeep } from "lodash-es";

interface Settings {
  language: "auto" | string;
  dataType: "xlsx" | "json";
  exportBackup: boolean;
  showUpdateDetails: boolean;
}

export const useSettingsStore = defineStore("settings", () => {
  // define default settings
  const defaultSettings: Settings = {
    language: "auto",
    dataType: "xlsx",
    exportBackup: false,
    showUpdateDetails: false,
  };
  // init settings from localStorage or use default settings
  const settings: Ref<Settings> = useLocalStorage(
    "miniDashboardSettings",
    defaultSettings,
  );
  // if any subitem of settings is undefined, use default settings
  for (const key in defaultSettings) {
    // @ts-ignore
    if (settings.value[key] === undefined) {
      // @ts-ignore
      settings.value[key] = defaultSettings[key];
    }
  }
  // function of reset settings
  function resetSettings() {
    settings.value = cloneDeep(defaultSettings);
  }

  // global state
  const globalLoading = ref(false);

  return { settings, resetSettings, globalLoading };
});
