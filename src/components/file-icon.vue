<template>
  <material-symbol>
    {{ getIconName(fileType) }}
  </material-symbol>
</template>

<script setup lang="ts">
import materialSymbol from "./material-symbol.vue";

defineProps<{
  fileType: string | null | undefined;
}>();

const type2iconMapping = {
  image: "",
  audio: "audio_file",
  video: "video_file",
  text: "docs",
  application: "apk_document",
  pdf: "",
  zip: "",
  code: "",
};

function getIconName(type: string | undefined | null): String {
  type = type?.toString().split("/")[0];
  const supportedFileTypes = Object.keys(type2iconMapping);
  return supportedFileTypes.includes(type || "")
    ? type2iconMapping[type as keyof typeof type2iconMapping]
    : "unknown_document";
}
</script>

<style scoped></style>
