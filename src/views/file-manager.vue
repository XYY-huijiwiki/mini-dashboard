<script lang="ts" setup>
import { ref, h, onMounted, type Ref, type VNodeChild } from "vue";
import {
  NText,
  NA,
  type DataTableColumns,
  type DataTableSortState,
} from "naive-ui";
import { RouterLink } from "vue-router";
import { filesize } from "filesize";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type RowData = {
  _id: string;
  metadata: {
    duration: number;
    width: number;
    height: number;
    size: number;
    mime: string;
  };
  fileSource: string;
  base64Info: {
    size: number;
    count: number;
  };
  dataType: string;
};

let loading = ref(true);

async function query(page: number, sorter?: DataTableSortState): Promise<void> {
  // start loading animation
  loading.value = true;
  // deal with sorter
  let sortBy = { _id: 1 };
  if (sorter) {
    // rename columnKey for query
    let newKey: string = "";
    sorter.columnKey === "size"
      ? (newKey = "metadata.size")
      : sorter.columnKey === "type"
      ? (newKey = "metadata.mime")
      : sorter.columnKey === "name"
      ? (newKey = "_id")
      : null;
    console.log(sorter);
    console.log(newKey);
    // new sortBy
    if (newKey && newKey === "_id") {
      sortBy = {
        [newKey]: sorter.order === "ascend" ? -1 : 1,
      };
    } else if (newKey) {
      sortBy = {
        [newKey]: sorter.order === "ascend" ? -1 : 1,
        _id: 1,
      };
    }
  }
  console.log(sortBy);
  console.log(JSON.stringify(sortBy));
  let params = new URLSearchParams({
    filter: JSON.stringify({
      dataType: "base64",
    }),
    pagesize: pagination.value.pageSize.toString(),
    count: "true",
    sort_by: JSON.stringify(sortBy),
    page: page.toString(),
    _: new Date().toISOString(),
  });
  let response = await fetch(
    `https://xyy.huijiwiki.com/api/rest_v1/namespace/data?${params.toString()}`,
  );
  let json = await response.json();
  console.log(json);
  pagination.value.itemCount = json._size;
  pagination.value.pageCount = json._total_pages;
  pagination.value.page = page;
  data.value = json["_embedded"];
  loading.value = false;
}

let data: Ref<RowData[]> = ref([]);

let columns: Ref<DataTableColumns<RowData>> = ref([
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
    render: (rowData: RowData): VNodeChild => {
      return h(
        RouterLink,
        { to: "/preview/" + rowData._id.slice(5, -5) },
        h(NA, rowData._id.slice(5, -5)),
      );
    },
  },
  {
    title: t("file-manager.label-file-type"),
    key: "type",
    sorter: true,
    render: (rowData: RowData) => {
      return h(NText, rowData.metadata.mime);
    },
  },
  {
    title: t("file-manager.label-file-size"),
    key: "size",
    sorter: true,
    render: (rowData: RowData) => {
      return h(NText, filesize(rowData.metadata.size, { locale: "de-de" }));
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
  await query(1);
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
      @update:page="(page: number) => query(page)"
      @update:pageSize="
        (pageSize: number) => ((pagination.pageSize = pageSize), query(1))
      "
      @update:sorter="(sorter: DataTableSortState) => query(1, sorter)"
    />
  </div>
</template>
