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

const { t } = useI18n();

const props = defineProps<{
  data: FileDetail[];
  position?: { x: number; y: number };
}>();

// show
let show = defineModel<boolean>("show");
// on-preview
let emit = defineEmits(["preview", "detail"]);

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
    disabled: true,
    key: "delete",
  },
  {
    label: t("file-manager.dropdown-option-download"),
    icon: () => h(materialSymbol, { size: 20 }, () => "download"),
    disabled: true,
    key: "download",
  },
  {
    label: t("file-manager.dropdown-option-rename"),
    icon: () => h(materialSymbol, { size: 20 }, () => "edit"),
    disabled: true,
    key: "rename",
    // disabled: props.data.length > 1,
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
]);

// click option
async function dropdownSelect(key: string | number) {
  switch (key) {
    case "preview":
      emit("preview", props.data[0]);
      break;
    case "link-copy":
      navigator.clipboard.writeText(
        props.data.map((item) => item.html_url).join("\n"),
      );
      $message.success(t("file-manager.message-link-copied"));
      break;
    // case "rename":
    //   globalModalContent.value = "rename";
    //   globalModalData.value = props.data;
    //   globalModalShow.value = true;
    //   break;
    // case "delete":
    //   globalModalContent.value = "delete";
    //   globalModalData.value = props.data;
    //   globalModalShow.value = true;
    //   break;
    case "details":
      emit("detail", props.data[0]);
      break;
    // case "download":
    //   globalModalContent.value = "download";
    //   globalModalData.value = props.data;
    //   globalModalShow.value = true;
    //   break;
    default:
      break;
  }
  show.value = false;
}
</script>

<style scoped></style>
