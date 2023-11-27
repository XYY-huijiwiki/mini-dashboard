<script lang="ts" setup>
import {
  ref,
  h,
  onMounted,
  nextTick,
  computed,
  type Ref,
  type VNodeChild,
  type ComputedRef,
} from "vue";
import {
  NText,
  NA,
  type DataTableColumns,
  type DataTableSortState,
  type DataTableFilterState,
} from "naive-ui";
import { RouterLink } from "vue-router";
import { filesize } from "filesize";
import { useI18n } from "vue-i18n";
import materialSymbol from "@/components/material-symbol.vue";
import { isArray, debounce } from "lodash-es";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";
import { useModalStore } from "@/stores/modal";

const { langCode } = storeToRefs(useLocalesStore());

const { t } = useI18n();

/*
 *
 * Search Bar
 *
 */
let searchText = ref("");
const searchBar = ref();
function cancelSearch() {
  if (searchText.value) {
    searchText.value = ``;
    pagination.value.page = 1;
    query();
  }
  // cancel focus on search bar
  searchBar.value.blur();
}

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
      // if this row is unchecked, cancel other checked rows and check this row
      if (!checkedKeys.value.includes(rowData.file.name)) {
        checkedKeys.value = [rowData.file.name];
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
        if (checkedKeys.value.includes(rowData.file.name)) {
          checkedKeys.value = checkedKeys.value.filter(
            (item) => item !== rowData.file.name,
          );
        } else {
          checkedKeys.value = [...checkedKeys.value, rowData.file.name];
        }
      } else {
        // else, single select this row
        checkedKeys.value = [rowData.file.name];
      }
    },
  };
};
let filter: Ref<DataTableFilterState> = ref({ type: undefined });
let sorter: Ref<DataTableSortState | undefined> = ref();
let query = debounce(async (): Promise<void> => {
  // reset checkedKeys
  checkedKeys.value = [];
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
          : sorter.value.columnKey === "uploadTime"
            ? (newKey = "wiki.uploadTime")
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
  let filterBy = {
    "file.name": (() => {
      if (searchText.value) {
        return { $regex: searchText.value };
      } else {
        return { $exists: true };
      }
    })(),
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
  if (import.meta.env.DEV) console.log(json);
  pagination.value.itemCount = json._size;
  pagination.value.pageCount = json._total_pages;
  data.value = json["_embedded"];
  loading.value = false;
  // scroll to #mini-dashboard
  document
    .getElementById("mini-dashboard")
    ?.scrollIntoView({ behavior: "smooth" });
}, 200);
let data: Ref<RetrievedDataItem[]> = ref([]);
let columns: Ref<DataTableColumns<RetrievedDataItem>> = ref([
  {
    type: "selection",
    key: "selection",
    render: (rowData: RetrievedDataItem) => {
      return h(NText, () => rowData.file.name);
      // equivalent to HTML
      //    <n-text>{{ rowData.file.name }}</n-text>
    },
  },
  {
    title: t("file-manager.label-file-name"),
    key: "name",
    sorter: true,
    render: (rowData: RetrievedDataItem): VNodeChild => {
      return h(
        RouterLink,
        {
          to: "/preview/" + rowData.file.name,
          onclick: (e: MouseEvent) => e.stopPropagation(),
        },
        () => h(NA, () => rowData.file.name),
      );
      // equivalent to HTML
      //  <n-ellipsis>
      //    <router-link :to="`/preview/${rowData.file.name}`">
      //      <n-a>{{ rowData.file.name }}</n-a>
      //    </router-link>
      //  </n-ellipsis>
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
      return h(NText, () => rowData.file.type);
      // equivalent to HTML
      //    <n-text>{{ rowData.file.type }}</n-text>
    },
    className: "hidden-xs",
  },
  {
    title: t("file-manager.label-file-size"),
    key: "size",
    sorter: true,
    render: (rowData: RetrievedDataItem) => {
      return h(NText, () =>
        filesize(rowData.file.size, { locale: langCode.value }),
      );
      // equivalent to HTML
      //    <n-text>{{ filesize(rowData.file.size, { locale: langCode }) }}</n-text>
    },
  },
  {
    title: t("file-manager.label-file-upload-time"),
    key: "uploadTime",
    sorter: true,
    render: (rowData: RetrievedDataItem) => {
      return h(NText, () => new Date(rowData.wiki.uploadTime).toLocaleString());
      // equivalent to HTML
      //    <n-text>{{ new Date(rowData.wiki.uploadTime).toLocaleString() }}</n-text>
    },
  },
]);
onMounted(async () => {
  await query();
});

/*
 *
 * Pagination
 *
 */
let pagination = ref({
  itemCount: undefined,
  pageCount: undefined,
  page: 1,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  pageSize: 10,
  pageSlot: window.innerWidth < 768 ? 5 : 9,
});

/*
 *
 * Drop Down
 *
 */
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);

/*
 *
 * Modal
 *
 */
// if 'done' action is triggered, refresh the table
useModalStore().$onAction(({ after }) => {
  after((result) => {
    result === "done" ? query() : null;
  });
});
</script>

<template>
  <div>
    <n-space vertical>
      <n-input-group>
        <n-input round v-model:value="searchText" clearable ref="searchBar">
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
        <n-button
          @click="
            () => {
              pagination.page = 1;
              query();
            }
          "
          round
          secondary
        >
          {{ t("file-manager.btn-search") }}
        </n-button>
      </n-input-group>
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
            query();
          }
        "
        @update:page="
          (page: number) => {
            pagination.page = page;
            query();
          }
        "
        @update:page-size="
          (pageSize: number) => {
            pagination.pageSize = pageSize;
            pagination.page = 1;
            query();
          }
        "
        @update:filters="
          (a: DataTableFilterState) => {
            filter = a;
            query();
          }
        "
        :row-props="rowProps"
        :row-key="(rowData: RetrievedDataItem) => rowData.file.name"
        v-model:checked-row-keys="checkedKeys"
      />
    </n-space>
    <file-menu
      :data="checkedItems"
      v-model:show="showDropdown"
      :position="{
        x: dropdownX,
        y: dropdownY,
      }"
    />
  </div>
</template>
