<template>
  <n-flex vertical>
    <n-card
      :style="{
        backgroundColor: checkedRowKeys.length ? undefined : 'transparent',
        borderColor: checkedRowKeys.length ? undefined : 'transparent',
      }"
      size="small"
    >
      <n-flex justify="space-between" :wrap="false" :size="48">
        <n-scrollbar x-scrollable v-if="checkedRowKeys.length">
          <n-flex class="flex-1 w-0 shrink-0" :wrap="false">
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
            <n-button
              quaternary
              :disabled="checkedRowKeys.length !== 1"
              @click="downloadFile"
            >
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
        </n-scrollbar>
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
        <n-flex :wrap="false">
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
          <n-button quaternary @click="showDetailsDrawer = !showDetailsDrawer">
            {{ t("github-files.btn-details") }}
            <template #icon>
              <MaterialSymbol>
                {{ showDetailsDrawer ? "arrow_menu_open" : "arrow_menu_close" }}
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
      :pane1-class="showDetailsDrawer ? 'pr-1' : ''"
      pane2-class="pl-1"
      :resize-trigger-size="showDetailsDrawer ? 3 : 0"
      class="flex-1 shrink-0 h-0"
    >
      <template #1>
        <file-preview v-model="preview" v-if="preview" />
        <template v-else>
          <file-list-table
            v-if="
              viewerMode === 'detailsList' ||
              viewerMode === 'compactDetailsList'
            "
            v-model:checked-row-keys="checkedRowKeys"
            :checked-items="checkedItems"
            v-model:sorterKey="sorterKey"
            v-model:sorterOrder="sorterOrder"
            v-model:filters="filters"
            :data="data"
            :loading="loading"
            :viewerMode="viewerMode"
            @preview="preview = checkedItems[0]"
            @detail="showDetailsDrawer = true"
          />
          <file-list-grid
            v-else
            :data="data"
            v-model:checked-row-keys="checkedRowKeys"
            :checked-items="checkedItems"
            v-model:sorterKey="sorterKey"
            v-model:sorterOrder="sorterOrder"
            v-model:filters="filters"
            @preview="preview = checkedItems[0]"
            @detail="showDetailsDrawer = true"
          />
        </template>
      </template>
      <template #2 v-if="showDetailsDrawer">
        <file-details
          :fileDetails="checkedItems"
          @close="showDetailsDrawer = false"
        />
      </template>
    </n-split>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import { NFlex, NButton } from "naive-ui";
import type { DataTableRowKey, DataTableFilterState } from "naive-ui";
import mime from "mime/lite";
import MaterialSymbol from "@/components/material-symbol.vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import { dayjsLocales } from "@/stores/locales";
import localizedFormat from "dayjs/plugin/localizedFormat";
import fileListTable from "@/components/file-list-table.vue";

const { t } = useI18n();
dayjs.extend(localizedFormat);
dayjs.locale(dayjsLocales.value || "en");
const searchBar = ref();
let downloadFile = () => {
  window.open(checkedItems.value[0].download_url);
};

let linkCopy = () => {
  navigator.clipboard.writeText(
    checkedItems.value.map((item) => item.html_url).join("\n")
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
};

/*
 *
 * Search Bar
 *
 */
let filters = ref<DataTableFilterState>({});
let searchText = ref("");
function searchClick(input: string) {
  if (input) filters.value.name = input;
}
function cancelSearch() {
  searchText.value = ``;
  filters.value.name = undefined;
  // cancel focus on search bar
  searchBar.value.blur();
}

let loading: Ref<boolean> = ref(true);
let data: Ref<FileDetail[]> = ref([]);
let checkedRowKeys = ref<DataTableRowKey[]>([]);

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
        "menu"
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
        "reorder"
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
        "grid_view"
      ),
      h("span", undefined, "tilesList"),
    ],
    key: "tilesList",
    icon:
      viewerMode.value === "tilesList" && (() => h(MaterialSymbol, "check")),
  },
]);
let viewrHandler = (
  key: "detailsList" | "compactDetailsList" | "tilesList"
) => {
  viewerMode.value = key;
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
      checkedRowKeys.value.includes(item.name)
    );
  }
});
let showDetailsDrawer = ref(false);
let detailsDrawerSizeTemp = ref(0.7);
let detailsDrawerSize = ref(1);
watch(showDetailsDrawer, (value) => {
  if (value) {
    detailsDrawerSize.value = detailsDrawerSizeTemp.value;
  } else {
    detailsDrawerSizeTemp.value = detailsDrawerSize.value;
    detailsDrawerSize.value = 1;
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
    const file = element.assets.find((item) => item.name.startsWith("default"));
    const thumbFile = element.assets.find((item) =>
      item.name.startsWith("thumb")
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
