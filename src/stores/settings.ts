import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { type Ref, ref } from "vue";
import { cloneDeep } from "lodash-es";

export const useSettingStore = defineStore("settings", () => {
  // define default settings
  const defaultSettings = {
    language: "zh-hans",
    dataType: "xlsx",
    exportBackup: false,
  };
  // init settings from localStorage or use default settings
  const settings = useLocalStorage("miniDaschboardSettings", defaultSettings);
  // function of reset settings
  function resetSettings() {
    settings.value = cloneDeep(defaultSettings);
  }
  let isBot: Ref<boolean> = ref(false);
  if (import.meta.env.DEV) {
    isBot = ref(true);
  } else {
    mw.user.getGroups((groupList: string[]) => {
      isBot = ref(groupList.includes("bot"));
    });
  }
  return { settings, isBot, resetSettings };
});
