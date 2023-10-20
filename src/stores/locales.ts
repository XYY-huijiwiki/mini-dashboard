import { defineStore, storeToRefs } from "pinia";
import { type Ref, computed, watch } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { asyncComputed } from "@vueuse/core";
import { useI18n } from "vue-i18n";

/**
 * Creates an object of language packs from the `locales` directory.
 * @returns {Object} An object containing language packs.
 */
const langPacks = Object.fromEntries(
  Object.entries(
    import.meta.glob("@/locales/*.json", {
      import: "default",
    }),
  ).map(([path, langPack]) => {
    // Extract the language code from the file path.
    const langCode = path.split("/").reverse()[0].replace(".json", "");
    return [langCode, langPack];
  }),
) as {
  [k: string]: () => Promise<typeof import("@/locales/en.json")>;
};

/**
 * An array of supported languages from the language packs.
 * @type {string[]}
 */
const supportedLangs: string[] = Object.keys(langPacks);

const userLangs = navigator.languages.map((lang) => lang.slice(0, 2));
const userLang = (() => {
  let userLang = "en";
  for (let index = 0; index < userLangs.length; index++) {
    const element = userLangs[index];
    if (supportedLangs.includes(element)) {
      userLang = element;
      break;
    }
  }
  return userLang;
})();

const useLocalesStore = defineStore("locales", () => {
  // language code
  const { settings } = storeToRefs(useSettingsStore());
  const langCode: Ref<string> = computed(() => {
    if (settings.value.language === "auto") {
      // if the language in the settings is auto and supported, use the language in the settings
      // if the language in the settings is auto and not supported, use English (en)
      return userLang;
    } else {
      // if the language in the settings is not auto, use the language in the settings
      return settings.value.language;
    }
  });

  // language pack for naive ui
  const langPackNaiveUI = asyncComputed(
    async () => {
      // get lang pack
      if (langCode.value === "de") {
        const locale = (await import("naive-ui/es/locales/common/deDE"))
          .default;
        const dateLocale = (await import("naive-ui/es/locales/date/deDE"))
          .default;
        return { locale, dateLocale };
      } else if (langCode.value === "zh") {
        const locale = (await import("naive-ui/es/locales/common/zhCN"))
          .default;
        const dateLocale = (await import("naive-ui/es/locales/date/zhCN"))
          .default;
        return { locale, dateLocale };
      } else {
        return { locale: null, dateLocale: null };
      }
    },
    // default value
    {
      locale: null,
      dateLocale: null,
    },
  );

  // when langCode changed, update vue-i18n
  const { locale, setLocaleMessage } = useI18n();
  watch(langCode, async (newVal) => {
    setLocaleMessage(newVal, await langPacks[newVal]());
    locale.value = newVal;
  });

  return { langCode, langPackNaiveUI };
});

export { useLocalesStore, supportedLangs, userLang, langPacks };
