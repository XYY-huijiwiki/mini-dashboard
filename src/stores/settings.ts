import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type Ref, ref } from "vue";
import { cloneDeep } from "lodash-es";

export const useSettingsStore = defineStore("settings", () => {
  // define default settings
  const defaultSettings = {
    language: "auto",
    dataType: "xlsx",
    exportBackup: false,
  };
  // init settings from localStorage or use default settings
  const settings = useLocalStorage("miniDashboardSettings", defaultSettings);
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
