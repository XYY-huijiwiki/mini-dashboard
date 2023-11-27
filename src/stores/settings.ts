import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type Ref, ref } from "vue";
import { cloneDeep } from "lodash-es";

export const useSettingsStore = defineStore("settings", () => {
  type Settings = {
    language: "auto" | string;
    dataType: "xlsx" | "json";
    exportBackup: boolean;
    showUpdateDetails: boolean;
  };

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
    if (settings.value[key] === undefined) {
      settings.value[key] = defaultSettings[key];
    }
  }
  // function of reset settings
  function resetSettings() {
    settings.value = cloneDeep(defaultSettings);
  }
  const isBot: Ref<boolean | null> = ref(null);
  CHP.then(() => {
    // wait huiji wiki api loaded
    mw.user.getGroups((groupList: string[]) => {
      isBot.value = groupList.includes("bot");
    });
  });

  // global state
  const globalLoading = ref(false);

  return { settings, isBot, resetSettings, globalLoading };
});
