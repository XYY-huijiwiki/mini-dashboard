<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

let dev = import.meta.env.DEV;

const defaultSettings = {
  dev: {
    port: 5173,
    host: "localhost",
  },
};

const settings = useLocalStorage("settings", defaultSettings);

function clearData() {
  $dialog.warning({
    title: t("general.warning"),
    content: t("settings.text-confirm-restore"),
    positiveText: t("general.btn-confirm"),
    negativeText: t("general.btn-no"),
    autoFocus: false,
    onPositiveClick: () => {
      settings.value = defaultSettings;
    },
  });
}
function startDev() {
  let moduleUrl = `http://${settings.value.dev.host}:${settings.value.dev.port}/src/main.ts`;
  var newScriptTag = document.createElement("script");
  newScriptTag.type = "module";
  newScriptTag.crossOrigin = "anonymous";
  newScriptTag.src = moduleUrl;
  document.body.appendChild(newScriptTag);
}
</script>

<template>
  <n-form>
    <n-form-item :label="t('settings.label-connect-to-dev-server')">
      <n-input-group>
        <n-input-group-label>http://</n-input-group-label>
        <n-input v-model:value="settings.dev.host" />
        <n-input-group-label>:</n-input-group-label>
        <n-input v-model:value="settings.dev.port" />
        <n-button @click="startDev()" :disabled="dev">
          {{ dev ? t("settings.btn-connected") : t("settings.btn-connect") }}
        </n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item :label="t('settings.label-language')">
      <n-radio :checked="true">
        {{ t("language") }}
      </n-radio>
    </n-form-item>
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
