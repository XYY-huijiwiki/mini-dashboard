<template>
  <n-flex vertical>
    <n-card
      :style="{
        backgroundColor: checkedRowKeys.length ? undefined : 'transparent',
        borderColor: checkedRowKeys.length ? undefined : 'transparent',
      }"
      :class="checkedRowKeys.length && 'shadow-lg'"
      size="small"
    >
      <n-flex justify="space-between">
        <n-flex v-if="checkedRowKeys.length">
          <!-- preview -->
          <n-button
            @click="preview = checkedItems[0]"
            quaternary
            :disabled="checkedRowKeys.length !== 1"
          >
            <template #icon>
              <material-symbol>visibility</material-symbol>
            </template>
            {{ t("github-files.btn-preview") }}
          </n-button>
          <!-- link copy -->
          <n-button @click="linkCopy" quaternary>
            <template #icon>
              <material-symbol>link</material-symbol>
            </template>
            {{ t("github-files.btn-link-copy") }}
          </n-button>
          <!-- delete -->
          <n-button disabled quaternary>
            <template #icon>
              <material-symbol>delete</material-symbol>
            </template>
            {{ t("github-files.btn-delete") }}
          </n-button>
          <!-- download -->
          <n-button disabled quaternary>
            <template #icon>
              <material-symbol>download</material-symbol>
            </template>
            {{ t("github-files.btn-download") }}
          </n-button>
          <!-- rename -->
          <n-button disabled quaternary>
            <template #icon>
              <material-symbol>edit</material-symbol>
            </template>
            {{ t("github-files.btn-rename") }}
          </n-button>
        </n-flex>
        <n-input-group class="flex-1" v-else>
          <n-input
            round
            v-model:value="searchText"
            clearable
            ref="searchBar"
            @keyup.enter="searchClick(searchText)"
          >
            <template #prefix>
              <n-button circle quaternary size="tiny" @click="cancelSearch">
                <template #icon>
                  <materialSymbol :size="24">
                    {{ searchText ? " arrow_back " : "search" }}
                  </materialSymbol>
                </template>
              </n-button>
            </template>
          </n-input>
          <n-button @click="searchClick(searchText)" round secondary>
            {{ t("file-manager.btn-search") }}
          </n-button>
        </n-input-group>
        <n-flex>
          <n-dropdown
            trigger="click"
            :options="sortOptions"
            @select="sortHandler"
          >
            <n-button quaternary>
              {{ t("github-files.btn-sort") }}
              <template #icon>
                <MaterialSymbol>sort</MaterialSymbol>
              </template>
            </n-button>
          </n-dropdown>
          <n-dropdown
            trigger="click"
            :options="viewerOptions"
            @select="viewrHandler"
          >
            <n-button quaternary>
              <template #icon>
                <MaterialSymbol>
                  {{
                    viewerMode === "detailsList"
                      ? "menu"
                      : viewerMode === "compactDetailsList"
                        ? "reorder"
                        : "grid_view"
                  }}
                </MaterialSymbol>
              </template>
            </n-button>
          </n-dropdown>
          <n-button quaternary @click="detailsDrawerShow = !detailsDrawerShow">
            {{ t("github-files.btn-details") }}
            <template #icon>
              <MaterialSymbol>
                {{ detailsDrawerShow ? "arrow_menu_open" : "arrow_menu_close" }}
              </MaterialSymbol>
            </template>
          </n-button>
        </n-flex>
      </n-flex>
    </n-card>
    <n-split
      direction="horizontal"
      v-model:size="detailsDrawerSize"
      :min="0.6"
      :max="0.8"
      :pane1-class="detailsDrawerShow ? 'pr-1' : ''"
      pane2-class="pl-1"
      :resize-trigger-size="detailsDrawerShow ? 3 : 0"
    >
      <template #1>
        <file-preview v-model="preview" v-if="preview" />
        <n-data-table
          v-else
          ref="dataTable"
          :columns="columns"
          :data="data"
          virtual-scroll
          max-height="calc(100vh - 256px)"
          :loading="loading"
          pagination-behavior-on-filter="first"
          :size="viewerMode === 'detailsList' ? undefined : 'small'"
          :row-key="rowKey"
          :row-props="rowProps"
          :scroll-x="800"
          v-model:checked-row-keys="checkedRowKeys"
          @update:sorter="
            (data: DataTableSortState | null) => {
              sorterKey = data?.columnKey as SorterKey;
              sorterOrder = data?.order as SorterOrder;
            }
          "
        />
      </template>
      <template #2 v-if="detailsDrawerShow">
        <n-card
          class="h-full"
          closable
          @close="detailsDrawerShow = false"
          v-if="checkedRowKeys.length === 1"
        >
          <template #header>
            <n-ellipsis>
              <file-icon :file-type="renderDetails.icon" />
              {{ renderDetails.header }}
            </n-ellipsis>
          </template>
          <!-- <template #header-extra> {{ renderDetails.headerExtra }} </template> -->
          <template #cover>
            <img
              :src="'https://ik.imagekit.io/gwa1ycz7gc/' + renderDetails.thumb"
            />
          </template>
          <n-flex vertical>
            <n-statistic :label="t('github-files.label-file-type')">
              {{ renderDetails.fileInfo["file-type"] }}
            </n-statistic>
            <n-statistic :label="t('github-files.label-file-size')">
              {{ renderDetails.fileInfo["file-size"] }}
            </n-statistic>
          </n-flex>
          <n-divider></n-divider>
          <div
            class="markdown-body"
            v-html="md.render(renderDetails.default)"
          ></div>
          <template #action>
            <n-flex>
              <n-button @click="preview = checkedItems[0]">{{
                t("github-files.btn-preview")
              }}</n-button>
            </n-flex>
          </template>
        </n-card>
        <n-card
          class="h-full"
          closable
          @close="detailsDrawerShow = false"
          v-else
        >
          <template #header>
            <n-ellipsis>
              <material-symbol>draft</material-symbol>
              {{ renderDetails.header }}
            </n-ellipsis>
          </template>
        </n-card>
      </template>
    </n-split>
    <file-menu-new
      :data="checkedItems"
      v-model:show="showDropdown"
      @preview="(data: FileDetail) => (preview = data)"
      @detail="
        (data: FileDetail) => (
          (checkedRowKeys = [data.name]), (detailsDrawerShow = true)
        )
      "
      :position="{
        x: dropdownX,
        y: dropdownY,
      }"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { computed, h, nextTick, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import { NA, NText, NTag, NSpace, NFlex, NEllipsis } from "naive-ui";
import type {
  DataTableColumns,
  DataTableRowKey,
  DataTableFilterState,
  DataTableSortState,
} from "naive-ui";
import { filesize } from "filesize";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";
import MarkdownIt from "markdown-it";
import mime from "mime/lite";
import MaterialSymbol from "@/components/material-symbol.vue";
import fileIcon from "@/components/file-icon.vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { dayjsLocales } from "@/stores/locales";
import localizedFormat from "dayjs/plugin/localizedFormat";

const { t } = useI18n();
dayjs.extend(localizedFormat);
dayjs.locale(dayjsLocales.value || "en");
const searchBar = ref();
const dataTable = ref();

let linkCopy = () => {
  navigator.clipboard.writeText(
    checkedItems.value.map((item) => item.html_url).join("\n"),
  );
  $message.success(t("github-files.msg-link-copied"));
};

// preview
let preview: Ref<FileDetail | undefined> = ref(undefined);

/*
 *
 * Sorter
 *
 */
let sortOptions = computed(() => [
  {
    label: t("github-files.btn-sort-type"),
    key: "type",
    icon: sorterKey.value === "type" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: t("github-files.btn-sort-name"),
    key: "name",
    icon: sorterKey.value === "name" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: t("github-files.btn-sort-updated-at"),
    key: "updated_at",
    icon:
      sorterKey.value === "updated_at" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: t("github-files.btn-sort-uploader"),
    key: "uploader",
    icon: sorterKey.value === "uploader" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: t("github-files.btn-sort-size"),
    key: "size",
    icon: sorterKey.value === "size" && (() => h(MaterialSymbol, "check")),
  },
  {
    type: "divider",
    key: "divider",
  },
  {
    label: t("github-files.btn-sort-asc"),
    key: "ascend",
    icon: sorterOrder.value === "ascend" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: t("github-files.btn-sort-desc"),
    key: "descend",
    icon: sorterOrder.value === "descend" && (() => h(MaterialSymbol, "check")),
  },
]);
type SorterKey = "type" | "name" | "updated_at" | "uploader" | "size";
type SorterOrder = "ascend" | "descend";
let sorterKey: Ref<SorterKey> = ref("name");
let sorterOrder: Ref<SorterOrder> = ref("ascend");
let sortHandler = (key: SorterKey | SorterOrder) => {
  ["ascend", "descend"].includes(key)
    ? (sorterOrder.value = key as SorterOrder)
    : (sorterKey.value = key as SorterKey);
  dataTable.value.sort(sorterKey.value, sorterOrder.value);
};

/*
 *
 * Search Bar
 *
 */
let searchText = ref("");
function searchClick(input: string) {
  if (input) {
    dataTable.value.filters({
      name: input,
    } as DataTableFilterState);
  }
}
function cancelSearch() {
  if (searchText.value) {
    searchText.value = ``;
    dataTable.value.clearFilters();
  }
  // cancel focus on search bar
  searchBar.value.blur();
}

let md = new MarkdownIt({
  html: true,
  linkify: true,
});
let { langCode } = storeToRefs(useLocalesStore());
let loading: Ref<boolean> = ref(true);
let data: Ref<FileDetail[]> = ref([]);
let rowKey: (row: FileDetail) => DataTableRowKey = (row) => row.name;
let checkedRowKeys = ref<DataTableRowKey[]>([]);
let columns: Ref<DataTableColumns<FileDetail>> = computed(() => [
  {
    type: "selection",
    fixed: "left",
  },
  {
    title: sorterKey.value === "type" ? "" : () => h(MaterialSymbol, "draft"),
    renderSorter: sorterKey.value === "type" ? undefined : () => h("span"),
    key: "type",
    width: "3em",
    sorter: (row1, row2) => {
      let type1 = row1.type || "";
      let type2 = row2.type || "";
      return type1.localeCompare(type2);
    },
    render: (row) => {
      return h(fileIcon, { fileType: row.type });
      // equivalent to HTML
      // <file-icon :fileType="row.type"></file-icon>
    },
  },
  {
    title: t("github-files.table-header-name"),
    key: "name",
    resizable: true,
    width: 350,
    minWidth: 200,
    maxWidth: 500,
    sorter: (row1, row2) => row1.name.localeCompare(row2.name),
    render: (row) => {
      return h(
        NEllipsis,
        h(
          NA,
          {
            href: row.html_url,
            target: "_blank",
          },
          () => row.name,
        ),
      );
      // equivalent to HTML
      // <n-a href="..." target="_blank">{{ ... }}</n-a>
    },
    filter: (value, row) => {
      return row.name.toLowerCase().includes(value.toString().toLowerCase());
    },
  },
  {
    title: t("github-files.table-header-updated-at"),
    key: "updated_at",
    width: "10em",
    sorter: (row1, row2) => {
      return (
        new Date(row1.updated_at).getTime() -
        new Date(row2.updated_at).getTime()
      );
    },
    render: (row) => {
      return h(NText, dayjs(row.updated_at).format("ll"));
      // equivalent to HTML
      // <n-text>{{ row.updated_at || "N/A" }}</n-text>
    },
  },
  {
    title: t("github-files.table-header-uploader"),
    key: "uploader",
    width: "10em",
    sorter: (row1, row2) => row1.uploader.localeCompare(row2.uploader),
    render: (row) => {
      return h(
        NEllipsis,
        h(NA, { href: row.uploader_html_url }, () => row.uploader),
      );
    },
  },
  {
    title: t("github-files.table-header-size"),
    key: "size",
    width: "8em",
    sorter: (row1, row2) => row1.size - row2.size,
    render: (row) => {
      return h(NText, filesize(row.size, { locale: langCode.value }));
      // equivalent to HTML
      // <n-text>{{ filesize(..., { locale: langCode }) }}</n-text>
    },
  },
  // {
  //   title: t("github-files.table-header-desc"),
  //   key: "desc",
  //   render: (row) => {
  //     return h("div", {
  //       innerHTML: md.render(row.desc),
  //       class: "markdown-body",
  //     });
  //     // equivalent to HTML
  //     // <div v-html="md.render(...)" class="markdown-body"></div>
  //   },
  // },
  {
    title: t("github-files.table-header-status"),
    key: "status",
    minWidth: "10em",
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
              h(NTag, { type: "error", size: "small" }, () => warning),
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

/*
 *
 * Viewer
 *
 */
let viewerMode: Ref<"detailsList" | "compactDetailsList" | "tilesList"> =
  ref("detailsList");
let viewerOptions = computed(() => [
  {
    label: () => [
      h(
        MaterialSymbol,
        { verticalAlign: "middle", size: 20, class: "mr-1" },
        "menu",
      ),
      h("span", undefined, "detailsList"),
    ],
    key: "detailsList",
    icon:
      viewerMode.value === "detailsList" && (() => h(MaterialSymbol, "check")),
  },
  {
    label: () => [
      h(
        MaterialSymbol,
        { verticalAlign: "middle", size: 20, class: "mr-1" },
        "reorder",
      ),
      h("span", undefined, "compactDetailsList"),
    ],
    key: "compactDetailsList",
    icon:
      viewerMode.value === "compactDetailsList" &&
      (() => h(MaterialSymbol, "check")),
  },
  {
    label: () => [
      h(
        MaterialSymbol,
        { verticalAlign: "middle", size: 20, class: "mr-1" },
        "grid_view",
      ),
      h("span", undefined, "tilesList"),
    ],
    key: "tilesList",
    icon:
      viewerMode.value === "tilesList" && (() => h(MaterialSymbol, "check")),
    disabled: true,
  },
]);
let viewrHandler = (
  key: "detailsList" | "compactDetailsList" | "tilesList",
) => {
  viewerMode.value = key;
};

/*
 *
 * Data Table Customization
 *
 */
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);
let rowProps = (row: FileDetail) => {
  return {
    onContextmenu: async (e: MouseEvent) => {
      e.preventDefault();
      // if this row is unchecked, cancel other checked rows and check this row
      if (!checkedRowKeys.value.includes(row.name)) {
        checkedRowKeys.value = [row.name];
      }
      await nextTick();
      dropdownX.value = e.clientX;
      dropdownY.value = e.clientY;
      showDropdown.value = true;
    },
    onclick: async (e: MouseEvent) => {
      let triggerClassList = (e.target as HTMLElement).classList;
      if (e.button !== 0) {
        // do nothing if click event is not triggered by left button
        return;
      } else if (triggerClassList.contains("n-checkbox-box__border")) {
        // do nothing if target is div.n-checkbox-box__border
        // this is to prevent bubble from checkbox
        return;
      } else if (triggerClassList.contains("n-data-table-td--selection")) {
        // if target is td.n-data-table-td--selection, toggle checkbox
        if (checkedRowKeys.value.includes(row.name)) {
          checkedRowKeys.value = checkedRowKeys.value.filter(
            (item) => item !== row.name,
          );
        } else {
          checkedRowKeys.value = [...checkedRowKeys.value, row.name];
        }
      } else {
        // else, single select this row
        checkedRowKeys.value = [row.name];
      }
    },
  };
};

/*
 *
 * Details Drawer
 *
 */
let checkedItems: Ref<FileDetail[]> = computed(() => {
  if (checkedRowKeys.value.length === 0) {
    return [];
  } else {
    return data.value.filter((item) =>
      checkedRowKeys.value.includes(item.name),
    );
  }
});
let detailsDrawerShow = ref(false);
let detailsDrawerSizeTemp = ref(0.7);
let detailsDrawerSize = ref(1);
watch(detailsDrawerShow, (value) => {
  if (value) {
    detailsDrawerSize.value = detailsDrawerSizeTemp.value;
  } else {
    detailsDrawerSizeTemp.value = detailsDrawerSize.value;
    detailsDrawerSize.value = 1;
  }
});
let renderDetails = computed(() => {
  let checkedRowDetails: FileDetail[] = [];
  checkedRowKeys.value.forEach((element) => {
    checkedRowDetails.push(
      data.value.find((item) => item.name === element) as FileDetail,
    );
  });
  if (checkedRowKeys.value.length === 1) {
    return {
      icon: checkedRowDetails[0].type,
      header: checkedRowDetails[0].name,
      thumb: checkedRowDetails[0].thumb_url,
      default: checkedRowDetails[0].desc,
      fileInfo: {
        "file-type": checkedRowDetails[0].type || "unknown",
        "file-size": filesize(checkedRowDetails[0].size, {
          locale: langCode.value,
        }),
      },
    };
  } else {
    return {
      icon: "draft",
      header: t("github-files.msg-number-files-selected", [
        checkedRowKeys.value.length,
      ]),
      thumb: "",
      default: "",
      fileInfo: {
        "file-type": "",
        "file-size": "",
      },
    };
  }
});

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
        "https://xyy.huijiwiki.com/api.php?" + new URLSearchParams(params),
      )
    ).json();
    filesInUse.push(
      ...res.query.querypage.results.map((item) =>
        decodeURIComponent(item.title).replace(/ /g, "_").replace("文件:", ""),
      ),
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
    const file = element.assets.find((item) => item.name.startsWith("default"));
    const thumbFile = element.assets.find((item) =>
      item.name.startsWith("thumb"),
    );
    data.value.push({
      name: element.tag_name,
      size: file?.size || 0,
      type: mime.getType(element.tag_name.split(".").pop() || ""),
      html_url: element.html_url,
      thumb_url: thumbFile?.browser_download_url || "",
      download_url: file?.browser_download_url || "",
      desc: element.body,
      updated_at: file ? file.updated_at : "",
      uploader: file?.uploader.login || "",
      uploader_html_url: file?.uploader.html_url || "",
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
      type: mime.getType(element.split(".").pop() || ""),
      html_url: "",
      thumb_url: "",
      download_url: "",
      desc: "",
      updated_at: "",
      uploader: "",
      uploader_html_url: "",
      warnings: ["wanted"],
    });
  }

  loading.value = false;
});
</script>

<style>
/* .markdown-body > *:last-child {
  margin-bottom: 0;
} */
.markdown-body ul {
  list-style-type: disc;
}
</style>
