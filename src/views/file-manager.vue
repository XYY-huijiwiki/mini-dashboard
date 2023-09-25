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

let loading = ref(true);
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);
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
let showModel = ref(false);
let comp: Ref<Component | undefined> = ref();

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
    disabled: checkedKeys.value.length > 1,
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
      showModel.value = true;
      break;
    case "delete":
      comp.value = DeleteDialog;
      showModel.value = true;
      break;
    case "details":
      comp.value = DetailsDialog;
      showModel.value = true;
      break;
    case "download":
      comp.value = downloadDialog;
      showModel.value = true;
      break;
    default:
      break;
  }
  showDropdown.value = false;
}

let sorter: Ref<DataTableSortState | undefined> = ref(undefined);
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
  pageSizes: [10, 20, 50],
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
        (a: DataTableSortState) => (
          (pagination.page = 1), (sorter = a), query()
        )
      "
      @update:page="(page: number) => ((pagination.page = page), query())"
      @update:page-size="
        (pageSize: number) => (
          (pagination.pageSize = pageSize), (pagination.page = 1), query()
        )
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
      v-model:show="showModel"
      @after-leave="comp = undefined"
      :autoFocus="false"
    >
      <div>
        <component
          :is="comp"
          :data="checkedItems"
          @close-dialog="showModel = false"
          @done="query()"
        />
      </div>
    </n-modal>
  </div>
</template>
