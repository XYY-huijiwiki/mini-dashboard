<template>
  <n-card>
    <n-infinite-scroll
      style="height: calc(100vh - 215.4px)"
      :distance="270"
      @load="count = Math.min(count + 10, data.length)"
    >
      <n-flex>
        <div
          class="tile"
          v-for="i in count"
          :key="i - 1"
          @click="(e: MouseEvent) => handleTileClick(data[i - 1], e)"
          @contextmenu="(e: MouseEvent) => handleContextMenu(data[i - 1], e)"
        >
          <img
            v-if="data[i - 1].thumb_url"
            class="thumb"
            :src="`https://ik.imagekit.io/gwa1ycz7gc/` + data[i - 1].thumb_url"
            alt="thumb"
          />
          <div v-else class="thumb" style="background-color: var(--container)">
            <file-icon :file-type="data[i - 1].type" :size="48" />
          </div>
          <div class="name line-clamp-1">
            <n-button
              text
              size="small"
              :title="data[i - 1].name"
              @click="((checkedRowKeys = [data[i - 1].name]), emit('preview'))"
            >
              {{ data[i - 1].name }}
            </n-button>
          </div>
          <div class="date line-clamp-1">
            {{ dayjs(data[i - 1].updated_at).format("ll") }}
          </div>
          <n-checkbox
            class="checkbox"
            :checked="checkedRowKeys.includes(data[i - 1].name)"
          />
        </div>
      </n-flex>
    </n-infinite-scroll>
  </n-card>
  <file-menu-new
    :data="checkedItems"
    v-model:show="showDropdown"
    @preview="emit('preview')"
    @detail="emit('detail')"
    :position="{
      x: dropdownX,
      y: dropdownY,
    }"
  />
</template>

<script setup lang="ts">
import type { DataTableFilterState, DataTableCreateRowKey } from "naive-ui";
import { computed, nextTick, ref, watch } from "vue";
import dayjs from "dayjs";
import { dayjsLocales } from "@/stores/locales";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);
dayjs.locale(dayjsLocales.value || "en");
let emit = defineEmits(["preview", "detail"]);
let { data: rawData, checkedItems } = defineProps<{
  data: FileDetail[];
  checkedItems: FileDetail[];
}>();
let checkedRowKeys = defineModel<ReturnType<DataTableCreateRowKey>[]>(
  "checkedRowKeys",
  { required: true }
);
let sorterKey = defineModel<SorterKey>("sorterKey", {
  required: true,
});
let sorterOrder = defineModel<SorterOrder>("sorterOrder", { required: true });
type SorterKey = "type" | "name" | "updated_at" | "uploader" | "size";
type SorterOrder = "ascend" | "descend";
let filters = defineModel<DataTableFilterState>("filters", { required: true });

let data = computed(() => {
  let res = rawData;
  console.log(filters.value.name);
  if (filters.value.name) {
    res = res.filter((i) =>
      // @ts-ignore
      i.name.toLowerCase().includes(filters.value.name.toLowerCase())
    );
  }
  if (sorterKey.value === "size") {
    return res.sort((a, b) =>
      sorterOrder.value === "ascend"
        ? a["size"] - b["size"]
        : b["size"] - a["size"]
    );
  } else {
    return res.sort((a, b) =>
      sorterOrder.value === "ascend"
        ? ((a[sorterKey.value] || "") as string).localeCompare(
            (b[sorterKey.value] || "") as string
          )
        : ((b[sorterKey.value] || "") as string).localeCompare(
            (a[sorterKey.value] || "") as string
          )
    );
  }
});
let count = ref(Math.min(30, data.value.length));
watch(data, () => {
  count.value = Math.min(30, data.value.length);
});

// select and context menu
let showDropdown = ref(false);
let dropdownX = ref(0);
let dropdownY = ref(0);
async function handleTileClick(item: FileDetail, e: MouseEvent) {
  let triggerClassList = (e.target as HTMLElement).classList;
  if (e.button !== 0) {
    // do nothing if click event is not triggered by left button
    return;
  } else if (triggerClassList.contains("n-checkbox-box__border")) {
    // if target is .n-checkbox-box__border, toggle checkbox
    if (checkedRowKeys.value.includes(item.name)) {
      checkedRowKeys.value = checkedRowKeys.value.filter(
        (i) => i !== item.name
      );
    } else {
      checkedRowKeys.value = [...checkedRowKeys.value, item.name];
    }
  } else {
    // else, single select this row
    checkedRowKeys.value = [item.name];
  }
}
async function handleContextMenu(item: FileDetail, e: MouseEvent) {
  e.preventDefault();
  // if this row is unchecked, cancel other checked rows and check this row
  if (!checkedRowKeys.value.includes(item.name)) {
    checkedRowKeys.value = [item.name];
  }
  await nextTick();
  dropdownX.value = e.clientX;
  dropdownY.value = e.clientY;
  showDropdown.value = true;
}
</script>

<style scoped>
.tile {
  width: 138px;
  height: 135px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 2px solid transparent;
}
.tile:hover {
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow:
    0 0 2px rgba(0, 0, 0, 0.12),
    0 2px 4px rgba(0, 0, 0, 0.14);
}
.tile:has(.checkbox[aria-checked="true"]) {
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid var(--primary);
}
.thumb {
  object-fit: contain;
  margin: 16px 16px 0 16px;
  flex: 1;
  height: 0;
  flex-shrink: 0;
}
div.thumb {
  display: flex;
  justify-content: center;
  align-items: center;
}
.name {
  font-size: 12px;
  margin-top: 12px;
  margin-left: 8px;
  margin-right: 8px;
  text-align: center;
}
.date {
  font-size: 12px;
  margin-bottom: 12px;
  margin-left: 8px;
  margin-right: 8px;
  text-align: center;
}
.checkbox {
  position: absolute;
  top: 0;
  right: 0;
  margin: 8px;
  visibility: hidden;
}
.checkbox[aria-checked="true"] {
  visibility: visible;
}
.tile:hover .checkbox {
  visibility: visible;
}
</style>
