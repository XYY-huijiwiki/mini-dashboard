<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Ref } from "vue";
import sleep from "await-sleep";
import fileTypeList from "@/utils/fileTypeList";
import { url } from "@/utils/mwApi/index";

// 定义类型
interface fileListItem {
  fulltext: string;
  fullurl: string;
}

let searchTextValue: Ref<null | string> = ref(null);
let searchTypeOptions = ref(
  Object.keys(fileTypeList)
    .filter((item) => fileTypeList[item].ext.length !== 0)
    .map((item) => ({
      label: fileTypeList[item].name,
      value: item,
    })),
);
let searchTypeValue: Ref<null | string> = ref(null);

var fileList: Ref<fileListItem[]> = ref([]);
var page: Ref<number | undefined> = ref(undefined);
var totalPage: Ref<number | undefined> = ref(undefined);
var fileListLoading = ref(false);

// 处理检索
function getQueryStr(): string {
  let query = "";
  // 搜索内容
  if (searchTextValue.value !== null) {
    query += `[[~*${searchTextValue.value}*]]`;
  }
  // 文件类型
  if (
    searchTypeValue.value !== null &&
    fileTypeList[searchTypeValue.value].ext.length !== 0
  ) {
    query += `[[~*${fileTypeList[searchTypeValue.value].ext.join("||~*")}]]`;
  }
  return query;
}

// 展示文件列表
async function loadFileList() {
  fileListLoading.value = true;
  totalPage.value = undefined;
  page.value = undefined;

  let response = await fetch(
    encodeURI(
      `https://xyy.huijiwiki.com/api/rest_v1/transform/wikitext/to/html?${Date()}`,
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body_only: true,
        wikitext: `{{#ask:[[分类:Base64编码的文件]]${getQueryStr()}|format=count}}`,
      }),
    },
  );

  let responseText = await response.text();
  let size = responseText.split(`id="mwAQ">`)[1].split(`</p>`)[0];
  totalPage.value = Math.ceil(Number(size) / 20);
  page.value = 1;
}

// 监听页数变化并加载
watch(page, async (page) => {
  // 如果page是undefined，说明正在刷新，无视他
  if (page === undefined) {
    return;
  }

  // 使状态变为“加载中”
  fileListLoading.value = true;

  // 强制等待0.5秒，欣赏加载动画，防止加载速度过快导致“闪屏”
  await sleep(500);

  let offset = (page - 1) * 20;
  console.log(offset);

  let params = new URLSearchParams({
    action: "ask",
    format: "json",
    query: `[[分类:Base64编码的文件]]${getQueryStr()}|limit=20|offset=${offset}`,
    api_version: "3",
    _: Date(),
  });
  let response = await fetch(url + "?" + params.toString());
  let responseJSON = await response.json();

  let a = responseJSON["query"]["results"];
  let b: fileListItem[] = [];
  a.forEach((element: { [x: string]: any }, index: string | number) => {
    b[Number(index)] = element[Object.keys(element)[0]];
  });
  console.log(b);
  fileList.value = b;
  fileListLoading.value = false;
});
</script>

<template>
  <div>
    <n-space vertical>
      <!-- 搜索按钮 -->
      <n-input-group>
        <n-input
          v-model:value="searchTextValue"
          :placeholder="`搜索文件（留空则显示全部）`"
          clearable
        ></n-input>
        <n-select
          v-model:value="searchTypeValue"
          :options="searchTypeOptions"
          :placeholder="`文件类型（留空则显示全部）`"
          clearable
          style="max-width: 16em"
        ></n-select>
        <n-button @click="loadFileList" :loading="fileListLoading">{{
          searchTextValue === null ? "查看文件" : "点击搜索"
        }}</n-button>
      </n-input-group>

      <!-- 加载中动画 -->
      <div v-if="fileListLoading">
        <loading></loading>
      </div>

      <!-- 文件列表 -->
      <n-list v-else hoverable>
        <n-list-item v-for="(item, index) in fileList" :key="index">
          <!-- 列表的主体内容 -->
          {{ item.fulltext.replace("文件:", "") }}

          <!-- 列表的前置图标 -->
          <template #prefix>
            <n-icon
              color="#70c0e8"
              v-if="
                fileTypeList['video'].ext.includes(
                  item.fulltext.split('.').reverse()[0],
                )
              "
            >
              <material-symbol> movie </material-symbol>
            </n-icon>
            <n-icon
              color="#63e2b7"
              v-else-if="
                fileTypeList['audio'].ext.includes(
                  item.fulltext.split('.').reverse()[0],
                )
              "
            >
              <material-symbol> music_note </material-symbol>
            </n-icon>
            <n-icon
              color="#f2c97d"
              v-else-if="
                fileTypeList['image'].ext.includes(
                  item.fulltext.split('.').reverse()[0],
                )
              "
            >
              <material-symbol> image </material-symbol>
            </n-icon>
            <n-icon
              color="#e88080"
              v-else-if="
                fileTypeList['model'].ext.includes(
                  item.fulltext.split('.').reverse()[0],
                )
              "
            >
              <material-symbol> view_in_ar </material-symbol>
            </n-icon>
            <n-icon color="#e88080" v-else>
              <material-symbol> draft </material-symbol>
            </n-icon>
          </template>

          <!-- 列表的右侧按钮 -->
          <template #suffix>
            <menu-btn :fulltext="item.fulltext"></menu-btn>
          </template>
        </n-list-item>
      </n-list>

      <!-- 分页 -->
      <n-pagination
        v-if="totalPage"
        v-model:page="page"
        :page-count="totalPage"
        :disabled="fileListLoading"
        simple
      />
    </n-space>
  </div>
</template>

<style>
#wiki-body li.n-list-item {
  margin-top: 0;
  margin-bottom: 0;
  line-height: inherit;
}

.mw-content-ltr ul,
.mw-content-rtl .mw-content-ltr ul {
  margin: inherit;
  padding: inherit;
}
</style>