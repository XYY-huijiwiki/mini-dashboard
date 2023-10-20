<template>
  <div>
    <n-space vertical>
      <bot-alert />

      <n-grid cols="2">
        <n-grid-item>
          <n-statistic :label="t('data-importer.label-file-name')">
            {{ dataInfo.name }}
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('data-importer.label-episodes')">
            {{ dataInfo.length }}
          </n-statistic>
        </n-grid-item>
      </n-grid>

      <n-progress
        :percentage="Math.floor((count / dataInfo.length) * 100)"
        :show-indicator="true"
        indicator-placement="inside"
        :status="importing ? 'info' : 'success'"
        :processing="importing"
      />

      <n-input-group>
        <n-input
          v-model:value="summary"
          :placeholder="t('data-importer.label-edit-summary')"
        />
        <n-upload
          abstract
          :accept="`.` + settings.dataType"
          :show-file-list="false"
          :on-update:file-list="refreshData"
          :default-upload="false"
        >
          <n-upload-trigger #="{ handleClick }" abstract>
            <n-button :disabled="!isBot || importing" @click="handleClick">
              {{ t("data-importer.label-select-file") }}
            </n-button>
          </n-upload-trigger>
        </n-upload>
        <n-button
          :disabled="!isBot || !fileList[0] || count !== 0"
          @click="importData()"
        >
          {{ t("data-importer.btn-import") }}
        </n-button>
      </n-input-group>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useSettingStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { ref, type Ref } from "vue";
import { type UploadFileInfo } from "naive-ui";
import { utils, read } from "xlsx";
import sleep from "await-sleep";
import { isArray } from "lodash-es";
import { type CartoonData } from "@/utils/dataDownloader";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// define dev env
let dev = import.meta.env.DEV;

let { settings, isBot } = storeToRefs(useSettingStore());
let fileList: Ref<UploadFileInfo[]> = ref([]);
let importing = ref(false);
let dataInfo = ref({
  name: t("data-importer.text-no-file-selected"),
  length: 0,
});
let cartoonData: Ref<CartoonData[]> = ref([]);
let summary = ref("");
let count = ref(0);

let refreshData = async (list: UploadFileInfo[]) => {
  console.log("refreshData");

  // check if fileList[0] exists
  if (!list[0]?.file) {
    console.log("fileList changed before any file selected");
    return;
  }

  // if multiple files added
  while (list.length > 1) {
    console.log(list.length);
    list.splice(0, 1);
  }

  // sync fileList
  console.log(list);
  fileList.value = list;

  // reset import count
  count.value = 0;

  // define cartoonData to be uploaded
  let data: CartoonData[];

  // deal with xlsx file
  if (settings.value.dataType === "xlsx") {
    // file to ArrayBuffer
    let arrayBuffer = await list[0].file.arrayBuffer();
    // read xlsx file
    let workbook = await read(arrayBuffer, { type: "array" });
    // transform xlsx file to cartoonData
    data = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  } else if (settings.value.dataType === "json") {
    // read json file
    let json = await list[0].file.text();
    // transform json file to cartoonData
    data = JSON.parse(json);
  } else {
    $message.error("不支持的文件类型");
    return;
  }

  dataInfo.value = {
    name: list[0].name,
    length: data.length,
  };
  console.log(dataInfo.value);

  cartoonData.value = data;
};

async function importData() {
  // check if fileList[0] exists
  if (!fileList.value[0]?.file) {
    console.log("import before any file selected");
    return;
  }

  // check if summary is empty
  if (summary.value === "") {
    $message.error("Summary不能为空");
    return;
  }

  // activate importing status
  importing.value = true;

  // upload data
  for await (const dataItem of cartoonData.value) {
    let { _id, ...newDataItem } = dataItem;
    // parse array string to array
    Object.keys(newDataItem).forEach((key) => {
      const value = newDataItem[key];
      try {
        isArray(JSON.parse(value))
          ? (newDataItem[key] = JSON.parse(value))
          : null;
      } catch (error) {
        null;
      }
    });
    let text = JSON.stringify(newDataItem);
    if (dev) {
      console.log(_id);
      console.log(newDataItem);
    } else {
      try {
        let res = await new mw.Api().postWithToken("csrf", {
          action: "edit",
          title: _id,
          text,
          summary: "【批量更新剧集信息】" + summary.value,
        });
        console.log(res);
      } catch (error) {
        $message.error(`导入 ${_id} 失败`);
        console.log(error);
        continue;
      }
    }
    count.value++;
    await sleep(500);
  }

  // deactivate importing status
  importing.value = false;
}
</script>

<style scoped></style>
