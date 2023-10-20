<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { supportedLangs, langCode } from "@/locales";
import { useSettingStore } from "@/stores/settings";
import { storeToRefs } from "pinia";

let { settings } = storeToRefs(useSettingStore());
let { resetSettings } = useSettingStore();
let dataTypeOptions = [
  { label: "XLSX", value: "xlsx" },
  { label: "JSON", value: "json" },
];

const { t } = useI18n();

function clearData() {
  $dialog.warning({
    title: t("general.warning"),
    content: t("settings.text-confirm-restore"),
    positiveText: t("general.btn-confirm"),
    negativeText: t("general.btn-cancel"),
    autoFocus: false,
    onPositiveClick: resetSettings,
  });
}
</script>

<template>
  <n-form>
    <!-- language -->
    <n-form-item :label="t('settings.label-language')">
      <n-radio-group :value="langCode" name="radiogroup">
        <n-space>
          <n-radio
            v-for="lang in supportedLangs"
            :key="lang"
            :value="lang"
            disabled
          >
            {{ new Intl.DisplayNames([lang], { type: "language" }).of(lang) }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <!-- data type -->
    <n-form-item :label="t('settings.label-data-type')">
      <n-radio-group v-model:value="settings.dataType">
        <n-space>
          <n-radio
            v-for="option in dataTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <!-- export-backup -->
    <n-form-item :label="t('settings.label-export-backup')">
      <n-checkbox v-model:checked="settings.exportBackup">
        {{ t("settings.text-export-backup") }}
      </n-checkbox>
    </n-form-item>
    <!-- restore defaults -->
    <n-form-item :label="t('settings.label-restore-defaults')">
      <n-button @click="clearData()">
        {{ t("settings.btn-restore") }}
      </n-button>
    </n-form-item>
  </n-form>
  <n-divider />
  <n-ul>
    <n-li>
      项目源代码可在<n-a href="//github.com/XYY-huijiwiki" target="_blank"
        >GitHub</n-a
      >上查看。
    </n-li>
    <n-li> 单个文件的大小不能超过10MB（实际上要求比10MB小44个字节）。 </n-li>
    <n-li>
      最好填写文件来源。文件来源不尽相同的时候需要一个一个上传、一个一个填写。
    </n-li>
    <n-li> 此处上传的文件无法通过wikitext直接使用，仅作为归档和备份。 </n-li>
    <n-li>
      如果要上传的文件格式是 png，jpg，jpeg，gif，webp，ogg 中的一种，请<n-a
        :href="encodeURI(`//xyy.huijiwiki.com/wiki/特殊:上传文件`)"
        target="_blank"
        >点击这里</n-a
      >上传。</n-li
    >
  </n-ul>
</template>
