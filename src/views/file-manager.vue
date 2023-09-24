<script lang="ts" setup>
import {
  ref,
  h,
  onMounted,
  nextTick,
  defineAsyncComponent,
  type Ref,
  type VNodeChild,
  type Component,
} from "vue";
import {
  NText,
  NA,
  type DataTableColumns,
  type DataTableSortState,
  type DropdownOption,
} from "naive-ui";
import { RouterLink } from "vue-router";
import { filesize } from "filesize";
import { useI18n } from "vue-i18n";
import materialSymbol from "@/components/material-symbol.vue";
import router from "@/router";
import loadingComponent from "@/views/loading-view.vue";
import errorComponent from "@/views/error-view.vue";

const { t } = useI18n();

const RenameDialog = defineAsyncComponent({
  loader: () => import("@/components/rename-dialog.vue"),
  loadingComponent,
  errorComponent,
});
const DeleteDialog = defineAsyncComponent({
  loader: () => import("@/components/delete-dialog.vue"),
  loadingComponent,
  errorComponent,
});

let loading = ref(true);
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);
let selectedData: RetrievedDataItem;
let showModel = ref(false);
let comp: Ref<Component | undefined> = ref();

let rowProps = (rowData: RetrievedDataItem) => {
  return {
    onContextmenu: async (e: MouseEvent) => {
      e.preventDefault();
      showDropdown.value = false;
      selectedData = rowData;
      await nextTick();
      dropdownX.value = e.clientX;
      dropdownY.value = e.clientY;
      showDropdown.value = true;
    },
  };
};

const options: DropdownOption[] = [
  {
    label: t("file-manager.dropdown-option-preview"),
    icon: () => h(materialSymbol, { size: 20 }, "visibility"),
    key: "preview",
  },
  {
    label: t("file-manager.dropdown-option-link-copy"),
    icon: () => h(materialSymbol, { size: 20 }, "link"),
    key: "link-copy",
  },
  {
    label: t("file-manager.dropdown-option-rename"),
    icon: () => h(materialSymbol, { size: 20 }, "edit"),
    key: "rename",
  },
  {
    label: t("file-manager.dropdown-option-delete"),
    icon: () => h(materialSymbol, { size: 20 }, "delete"),
    key: "delete",
  },
  {
    label: t("file-manager.dropdown-option-details"),
    icon: () => h(materialSymbol, { size: 20 }, "info"),
    key: "details",
    disabled: true,
  },
];

async function dropdownSelect(key: string | number) {
  switch (key) {
    case "preview":
      router.push("/preview/" + selectedData.file.name);
      break;
    case "link-copy":
      navigator.clipboard.writeText(
        location.href + "preview/" + selectedData.file.name
      );
      break;
    case "rename":
      comp.value = RenameDialog;
      showModel.value = true;
      break;
    case "delete":
      comp.value = DeleteDialog;
      showModel.value = true;
      break;
    case "details":
      $dialog.info({
        title: selectedData.file.name,
        content: JSON.stringify(selectedData),
        autoFocus: false,
      });
      break;
    default:
      break;
  }
  showDropdown.value = false;
}

async function query(sorter?: DataTableSortState): Promise<void> {
  // start loading animation
  loading.value = true;
  // deal with sorter
  let sortBy = { "file.name": 1 };
  if (sorter) {
    // rename columnKey for query
    let newKey: string = "";
    sorter.columnKey === "size"
      ? (newKey = "file.size")
      : sorter.columnKey === "type"
      ? (newKey = "file.type")
      : sorter.columnKey === "name"
      ? (newKey = "file.name")
      : null;
    // new sortBy
    if (newKey && newKey === "file.name") {
      sortBy = {
        [newKey]: sorter.order === "ascend" ? -1 : 1,
      };
    } else if (newKey) {
      sortBy = {
        [newKey]: sorter.order === "ascend" ? -1 : 1,
        "file.name": 1,
      };
    }
  }
  let params = new URLSearchParams({
    filter: JSON.stringify({
      "file.name": { $exists: true },
    }),
    pagesize: pagination.value.pageSize.toString(),
    count: "true",
    sort_by: JSON.stringify(sortBy),
    page: pagination.value.page.toString(),
    _: new Date().toISOString(),
  });
  let response = await fetch(
    `https://xyy.huijiwiki.com/api/rest_v1/namespace/data?${params.toString()}`
  );
  let json = await response.json();
  pagination.value.itemCount = json._size;
  pagination.value.pageCount = json._total_pages;
  data.value = json["_embedded"];
  loading.value = false;
}

let data: Ref<RetrievedDataItem[]> = ref([]);

let columns: Ref<DataTableColumns<RetrievedDataItem>> = ref([
  {
    type: "selection",
    key: "selection",
    disabled: (/*rowData: RowData*/) => {
      return true;
    },
  },
  {
    title: t("file-manager.label-file-name"),
    key: "name",
    sorter: true,
    render: (rowData: RetrievedDataItem): VNodeChild => {
      return h(
        RouterLink,
        { to: "/preview/" + rowData.file.name },
        h(NA, rowData.file.name)
      );
    },
  },
  {
    title: t("file-manager.label-file-type"),
    key: "type",
    sorter: true,
    render: (rowData: RetrievedDataItem) => {
      return h(NText, rowData.file.type);
    },
  },
  {
    title: t("file-manager.label-file-size"),
    key: "size",
    sorter: true,
    render: (rowData: RetrievedDataItem) => {
      return h(NText, filesize(rowData.file.size, { locale: "de-de" }));
    },
  },
]);

let pagination = ref({
  itemCount: undefined,
  pageCount: undefined,
  page: 1,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  pageSize: 10,
});

onMounted(async () => {
  await query();
});
</script>

<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="data"
      :loading="loading"
      size="small"
      remote
      :pagination="pagination"
      @update:sorter="
        (sorter: DataTableSortState) => ((pagination.page = 1), query(sorter))
      "
      @update:page="(page: number) => ((pagination.page = page), query())"
      @update:page-size="
        (pageSize: number) => (
          (pagination.pageSize = pageSize), (pagination.page = 1), query()
        )
      "
      :row-props="rowProps"
    />
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownX"
      :y="dropdownY"
      :options="options"
      :show="showDropdown"
      @clickoutside="showDropdown = false"
      @select="dropdownSelect"
    />
    <n-modal
      v-model:show="showModel"
      @after-leave="comp = undefined"
      :autoFocus="false"
    >
      <div>
        <component
          :is="comp"
          :data="selectedData"
          @close-dialog="showModel = false"
          @done="query()"
        />
      </div>
    </n-modal>
  </div>
</template>
