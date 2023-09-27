<script lang="ts" setup>
import {
  ref,
  h,
  onMounted,
  nextTick,
  computed,
  defineAsyncComponent,
  type Ref,
  type VNodeChild,
  type Component,
  type ComputedRef,
} from "vue";
import {
  NText,
  NA,
  type DataTableColumns,
  type DataTableSortState,
  type DropdownOption,
  type DataTableFilterState,
} from "naive-ui";
import { RouterLink } from "vue-router";
import { filesize } from "filesize";
import { useI18n } from "vue-i18n";
import materialSymbol from "@/components/material-symbol.vue";
import router from "@/router";
import loadingComponent from "@/views/loading-view.vue";
import errorComponent from "@/views/error-view.vue";
import { isArray } from "lodash-es";

const { t } = useI18n();

/*
 *
 * Data Table
 *
 */
let loading = ref(true);
let checkedKeys: Ref<string[]> = ref([]);
let checkedItems: ComputedRef<RetrievedDataItem[]> = computed(() => {
  if (checkedKeys.value.length === 0) {
    return [];
  } else {
    return data.value.filter((item) =>
      checkedKeys.value.includes(item.file.name),
    );
  }
});
let rowProps = (rowData: RetrievedDataItem) => {
  return {
    onContextmenu: async (e: MouseEvent) => {
      e.preventDefault();
      showDropdown.value = false;
      // if this row is unchecked, cancel other checked rows and check this row
      if (!checkedKeys.value.includes(rowData.file.name)) {
        checkedKeys.value = [rowData.file.name];
      }
      await nextTick();
      dropdownX.value = e.clientX;
      dropdownY.value = e.clientY;
      showDropdown.value = true;
    },
  };
};
let filter: Ref<DataTableFilterState> = ref({ type: undefined });
let sorter: Ref<DataTableSortState | undefined> = ref();
async function query(): Promise<void> {
  // start loading animation
  loading.value = true;
  // deal with sorter
  let sortBy = { "file.name": 1 };
  if (sorter.value) {
    // rename columnKey for query
    let newKey: string = "";
    sorter.value.columnKey === "size"
      ? (newKey = "file.size")
      : sorter.value.columnKey === "type"
      ? (newKey = "file.type")
      : sorter.value.columnKey === "name"
      ? (newKey = "file.name")
      : null;
    // new sortBy
    if (newKey && newKey === "file.name") {
      sortBy = {
        [newKey]: sorter.value.order === "ascend" ? -1 : 1,
      };
    } else if (newKey) {
      sortBy = {
        [newKey]: sorter.value.order === "ascend" ? -1 : 1,
        "file.name": 1,
      };
    }
  }
  // deal with filter
  console.log(filter.value.type);
  let filterBy = {
    "file.name": { $exists: true },
    "file.type": (() => {
      if (isArray(filter.value.type) && filter.value.type.length > 0) {
        // if filter.value.type is an array, join it with "|"
        return { $regex: `^${filter.value.type.join("|")}/` };
      } else {
        // else return undefined
        return undefined;
      }
    })(),
  };
  let params = new URLSearchParams({
    filter: JSON.stringify(filterBy),
    pagesize: pagination.value.pageSize.toString(),
    count: "true",
    sort_by: JSON.stringify(sortBy),
    page: pagination.value.page.toString(),
    _: new Date().toISOString(),
  });
  let response = await fetch(
    `https://xyy.huijiwiki.com/api/rest_v1/namespace/data?${params.toString()}`,
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
  },
  {
    title: t("file-manager.label-file-name"),
    key: "name",
    sorter: true,
    render: (rowData: RetrievedDataItem): VNodeChild => {
      return h("div", [
        h(
          RouterLink,
          { to: "/preview/" + rowData.file.name },
          h(NA, rowData.file.name),
        ),
      ]);
    },
  },
  {
    title: t("file-manager.label-file-type"),
    key: "type",
    filter: true,
    filterOptions: [
      { label: t("file-manager.label-file-type-audio"), value: "audio" },
      { label: t("file-manager.label-file-type-model"), value: "model" },
      { label: t("file-manager.label-file-type-video"), value: "video" },
    ],
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
  pageSizes: [10, 20, 50],
  pageSize: 10,
});
onMounted(async () => {
  await query();
});

/*
 *
 * Drop Down
 *
 */
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);
const options: ComputedRef<DropdownOption[]> = computed(() => [
  {
    label: t("file-manager.dropdown-option-preview"),
    icon: () => h(materialSymbol, { size: 20 }, "visibility"),
    key: "preview",
    disabled: checkedKeys.value.length > 1,
  },
  {
    label: t("file-manager.dropdown-option-link-copy"),
    icon: () => h(materialSymbol, { size: 20 }, "link"),
    key: "link-copy",
    disabled: checkedKeys.value.length > 1,
  },
  {
    type: "divider",
  },
  {
    label: t("file-manager.dropdown-option-delete"),
    icon: () => h(materialSymbol, { size: 20 }, "delete"),
    key: "delete",
  },
  {
    label: t("file-manager.dropdown-option-download"),
    icon: () => h(materialSymbol, { size: 20 }, "download"),
    key: "download",
  },
  {
    label: t("file-manager.dropdown-option-rename"),
    icon: () => h(materialSymbol, { size: 20 }, "edit"),
    key: "rename",
    disabled: checkedKeys.value.length > 1,
  },
  {
    type: "divider",
  },
  {
    label: t("file-manager.dropdown-option-details"),
    icon: () => h(materialSymbol, { size: 20 }, "info"),
    key: "details",
    disabled: checkedKeys.value.length > 1,
  },
]);
async function dropdownSelect(key: string | number) {
  switch (key) {
    case "preview":
      router.push("/preview/" + checkedKeys.value[0]);
      break;
    case "link-copy":
      navigator.clipboard.writeText(
        location.href + "preview/" + checkedKeys.value[0],
      );
      $message.success(t("file-manager.message-link-copied"));
      break;
    case "rename":
      comp.value = RenameDialog;
      showModal.value = true;
      break;
    case "delete":
      comp.value = DeleteDialog;
      showModal.value = true;
      break;
    case "details":
      comp.value = DetailsDialog;
      showModal.value = true;
      break;
    case "download":
      comp.value = downloadDialog;
      showModal.value = true;
      break;
    default:
      break;
  }
  showDropdown.value = false;
}

/*
 *
 * Modal
 *
 */
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
const DetailsDialog = defineAsyncComponent({
  loader: () => import("@/components/details-dialog.vue"),
  loadingComponent,
  errorComponent,
});
const downloadDialog = defineAsyncComponent({
  loader: () => import("@/components/download-dialog.vue"),
  loadingComponent,
  errorComponent,
});
let showModal = ref(false);
let comp: Ref<Component | undefined> = ref();
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
      pagination-behavior-on-filter="first"
      @update:sorter="
        (a: DataTableSortState) => {
          pagination.page = 1;
          sorter = a;
          checkedKeys = [];
          query();
        }
      "
      @update:page="
        (page: number) => {
          pagination.page = page;
          checkedKeys = [];
          query();
        }
      "
      @update:page-size="
        (pageSize: number) => {
          pagination.pageSize = pageSize;
          pagination.page = 1;
          checkedKeys = [];
          query();
        }
      "
      @update:filters="
        (a: DataTableFilterState) => {
          filter = a;
          checkedKeys = [];
          query();
        }
      "
      :row-props="rowProps"
      :row-key="(rowData: RetrievedDataItem) => rowData.file.name"
      v-model:checked-row-keys="checkedKeys"
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
      row-class-name="data-table-row"
    />
    <n-modal
      v-model:show="showModal"
      @after-leave="comp = undefined"
      :autoFocus="false"
    >
      <div>
        <component
          :is="comp"
          :data="checkedItems"
          @close-dialog="showModal = false"
          @done="query()"
        />
      </div>
    </n-modal>
  </div>
</template>
