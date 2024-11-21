<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :loading="loading"
    pagination-behavior-on-filter="first"
    @update:page="scrollToTop"
    size="small"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref } from "vue";
import type { Ref } from "vue";
import { NA, NText, NTag, NSpace } from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { filesize } from "filesize";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";
import MarkdownIt from "markdown-it";

type WarningType =
  | "not used"
  | "wanted"
  | "no source"
  | "no license"
  | "asset broken";
interface FileDetail {
  name: string;
  size: number;
  html_url: string;
  download_url: string;
  desc: string;
  warnings: WarningType[];
}
interface FileDetailFromGithub {
  id: number;
  tag_name: string;
  html_url: string;
  body: string;
  assets_broken: boolean;
  assets: {
    id: number;
    name: string;
    size: number;
    browser_download_url: string;
  }[];
}

let md = new MarkdownIt({
  html: true,
  linkify: true,
});
let { langCode } = storeToRefs(useLocalesStore());
let loading: Ref<boolean> = ref(true);
let data: Ref<FileDetail[]> = ref([]);
let columns: Ref<DataTableColumns<FileDetail>> = ref([
  {
    title: "Name",
    key: "name",
    sorter: (row1, row2) => row1.name.localeCompare(row2.name),
    render: (row) => {
      return h(
        NA,
        {
          href: row.html_url,
          target: "_blank",
        },
        () => row.name
      );
      // equivalent to HTML
      // <n-a href="..." target="_blank">{{ ... }}</n-a>
    },
  },
  {
    title: "Size",
    key: "size",
    sorter: (row1, row2) => row1.size - row2.size,
    render: (row) => {
      return h(NText, filesize(row.size, { locale: langCode.value }));
      // equivalent to HTML
      // <n-text>{{ filesize(..., { locale: langCode }) }}</n-text>
    },
  },
  {
    title: "Description",
    key: "desc",
    render: (row) => {
      return h("div", {
        innerHTML: md.render(row.desc),
        class: "markdown-body",
      });
    },
  },
  {
    title: "Status",
    key: "status",
    filterOptions: [
      { label: "Not Used", value: "not used" },
      { label: "Wanted", value: "wanted" },
      { label: "No Source", value: "no source" },
      { label: "No License", value: "no license" },
      { label: "Asset Broken", value: "asset broken" },
    ],
    filter: (value, row) => {
      return row.warnings.includes(value as WarningType);
    },
    render: (row) => {
      return h(NSpace, () => [
        row.warnings.length === 0
          ? h(NTag, { type: "success", size: "small" }, () => "Normal")
          : row.warnings.map((warning) =>
              h(NTag, { type: "error", size: "small" }, () => warning)
            ),
      ]);
      // equivalent to HTML
      // <n-space>
      //    <n-tag v-if="row.warnings.length === 0" type="success" size="small">Normal</n-tag>
      //    <n-tag v-else v-for="warning in row.warnings" type="error" size="small">{{ warning }}</n-tag>
      // </n-space>
    },
  },
]);
let pagination = ref({
  itemCount: undefined,
  pageCount: undefined,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  defaultPageSize: 10,
  pageSlot: window.innerWidth < 768 ? 5 : 9,
});
function scrollToTop() {
  document
    .getElementById(`mini-dashboard`)
    ?.scrollIntoView({ behavior: `smooth` });
}

onMounted(async () => {
  // get data from github
  let fileListFromGitHub: FileDetailFromGithub[] = await (
    await fetch("https://xyy-huijiwiki.github.io/files/releases.json")
  ).json();

  // get data from XYY-huijiwiki
  let filesInUse: string[] = [];
  let ifContinue = true;
  do {
    let params = {
      action: "query",
      list: "querypage",
      qppage: "Wantedfiles",
      format: "json",
      qplimit: "max",
      qpoffset: filesInUse.length.toString(),
    };
    let res: {
      batchcomplete: string;
      continue:
        | {
            qpoffset: number;
            continue: string;
          }
        | undefined;
      query: {
        querypage: {
          name: string;
          results: {
            value: string;
            ns: number;
            title: string;
          }[];
        };
      };
    } = await (
      await fetch(
        "https://xyy.huijiwiki.com/api.php?" + new URLSearchParams(params)
      )
    ).json();
    filesInUse.push(
      ...res.query.querypage.results.map((item) =>
        decodeURIComponent(item.title).replace(/ /g, "_").replace("文件:", "")
      )
    );
    ifContinue = res.continue !== undefined;
  } while (ifContinue);
  // filter filesInUse
  filesInUse = filesInUse.filter((item) => item.startsWith("GitHub:"));
  // remove "GitHub:" from filesInUse
  filesInUse = filesInUse.map((item) => item.replace("GitHub:", ""));

  // process data
  // process data from github
  for (let index = 0; index < fileListFromGitHub.length; index++) {
    const element = fileListFromGitHub[index];
    // if assets.length is not 1, warn in console
    data.value.push({
      name: element.tag_name,
      size: element.assets[0]?.size || 0,
      html_url: element.html_url,
      download_url: element.assets[0]?.browser_download_url || "",
      desc: element.body,
      warnings: (() => {
        let warnings: WarningType[] = [];
        if (element.assets_broken) {
          warnings.push("asset broken");
        }
        if (filesInUse.includes(element.tag_name)) {
          // remove it from filesInUse
          filesInUse.splice(filesInUse.indexOf(element.tag_name), 1);
        } else {
          warnings.push("not used");
        }
        if (element.body.match(/^- 文件来源：.+$/m) === null) {
          warnings.push("no source");
        }
        if (element.body.match(/^- (?:文件许可|授权协议)：.+$/m) === null) {
          warnings.push("no license");
        }
        return warnings;
      })(),
    });
  }
  // process data from XYY-huijiwiki
  for (let index = 0; index < filesInUse.length; index++) {
    const element = filesInUse[index];
    data.value.push({
      name: element,
      size: 0,
      html_url: "",
      download_url: "",
      desc: "",
      warnings: ["wanted"],
    });
  }
  loading.value = false;
});
</script>

<style>
.markdown-body > *:last-child {
  margin-bottom: 0;
}
</style>
