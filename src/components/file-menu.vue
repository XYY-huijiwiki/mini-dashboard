<template>
  <div>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="props.position ? props.position.x : undefined"
      :y="props.position ? props.position.y : undefined"
      :options="options"
      v-model:show="show"
      @clickoutside="show = false"
      @select="dropdownSelect"
      row-class-name="data-table-row"
    >
      <slot></slot>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";
import type { ComputedRef } from "vue";
import { NDropdown } from "naive-ui";
import type { DropdownOption } from "naive-ui";
import materialSymbol from "./material-symbol.vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useModalStore } from "@/stores/modal";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";

const router = useRouter();
const { t } = useI18n();
const { settings } = storeToRefs(useSettingsStore());

const props = defineProps<{
  data: RetrievedDataItem[];
  show: boolean;
  position?: { x: number; y: number };
}>();

// show
const emit = defineEmits(["update:show"]);
let show = computed({
  get: () => props.show,
  set: (value) => emit("update:show", value),
});

// options
const options: ComputedRef<DropdownOption[]> = computed(() => [
  {
    label: t("file-manager.dropdown-option-preview"),
    icon: () => h(materialSymbol, { size: 20 }, () => "visibility"),
    key: "preview",
    disabled: props.data.length > 1,
  },
  {
    label: t("file-manager.dropdown-option-link-copy"),
    icon: () => h(materialSymbol, { size: 20 }, () => "link"),
    key: "link-copy",
  },
  {
    type: "divider",
  },
  {
    label: t("file-manager.dropdown-option-delete"),
    icon: () => h(materialSymbol, { size: 20 }, () => "delete"),
    key: "delete",
  },
  {
    label: t("file-manager.dropdown-option-download"),
    icon: () => h(materialSymbol, { size: 20 }, () => "download"),
    key: "download",
  },
  {
    label: t("file-manager.dropdown-option-rename"),
    icon: () => h(materialSymbol, { size: 20 }, () => "edit"),
    key: "rename",
    disabled: props.data.length > 1,
  },
  {
    type: "divider",
  },
  {
    label: t("file-manager.dropdown-option-details"),
    icon: () => h(materialSymbol, { size: 20 }, () => "info"),
    key: "details",
    disabled: props.data.length > 1,
  },
  {
    label: t("file-manager.dropdown-option-update-details"),
    icon: () => h(materialSymbol, { size: 20 }, () => "refresh"),
    key: "update-details",
    show: settings.value.showUpdateDetails,
  },
]);

// click option
async function dropdownSelect(key: string | number) {
  switch (key) {
    case "preview":
      router.push("/preview/" + props.data[0].file.name);
      break;
    case "link-copy":
      navigator.clipboard.writeText(
        props.data
          .map(
            (item) => location.origin + "/wiki/File:" + item.file.name + ".png",
          )
          .join("\n"),
      );
      $message.success(t("file-manager.message-link-copied"));
      break;
    case "rename":
      globalModalContent.value = "rename";
      globalModalData.value = props.data;
      globalModalShow.value = true;
      break;
    case "delete":
      globalModalContent.value = "delete";
      globalModalData.value = props.data;
      globalModalShow.value = true;
      break;
    case "details":
      globalModalContent.value = "details";
      globalModalData.value = props.data;
      globalModalShow.value = true;
      break;
    case "download":
      globalModalContent.value = "download";
      globalModalData.value = props.data;
      globalModalShow.value = true;
      break;
    case "update-details":
      globalModalContent.value = "update-details";
      globalModalData.value = props.data;
      globalModalShow.value = true;
      break;
    default:
      break;
  }
  show.value = false;
}

// import global modal store
const { globalModalShow, globalModalContent, globalModalData } =
  storeToRefs(useModalStore());
</script>

<style scoped></style>
