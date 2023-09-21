<template>
  <div>
    <n-drawer
      v-model:show="show"
      resizable
      :default-width="480"
      :auto-focus="false"
    >
      <n-drawer-content closable :native-scrollbar="false">
        <template #header>
          <n-ellipsis>
            {{ `${fileName}.${fileExt}` }}
          </n-ellipsis>
        </template>
        {{ filePrefix + ":" + fileName + "." + fileExt }}
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { getWikiPage } from "@/utils/mwApi";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  filePrefix: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileExt: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:show"]);
const show = computed({
  get() {
    return props.show;
  },
  set(value) {
    emit("update:show", value);
  },
});
onMounted(async () => {
  let content = (await getWikiPage("Data:" + props.fileName + ".json"))
    ?.content;
  console.log(content);
});
</script>

<style scoped></style>
@/utils/mwApi
