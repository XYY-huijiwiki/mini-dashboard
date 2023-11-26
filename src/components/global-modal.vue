<template>
  <div>
    <n-modal
      v-model:show="globalModalShow"
      @after-leave="globalModalContent = null"
      :autoFocus="false"
    >
      <div>
        <component
          :is="globalModalContent ? dialogCompList[globalModalContent] : null"
          :data="globalModalData"
          @close-dialog="globalModalShow = false"
          @done="globalModalFunc('done')"
        />
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useModalStore } from "@/stores/modal";
import { defineAsyncComponent, type Component } from "vue";
import loadingComponent from "@/views/loading-view.vue";
import errorComponent from "@/views/error-view.vue";

const dev = import.meta.env.DEV;

const { globalModalShow, globalModalContent, globalModalData } =
  storeToRefs(useModalStore());
const { globalModalFunc } = useModalStore();

// register async component
let dialogGlobList: Record<string, () => Promise<Component>> = import.meta.glob(
  "@/components/*-dialog.vue",
  { import: "default" },
);
let dialogCompList = Object.keys(dialogGlobList).reduce(
  (obj: Record<string, Component>, path) => {
    let dialogName = path.match(/\/([\w|-]+)-dialog\.vue$/)?.[1];
    if (dialogName) {
      obj[dialogName] = defineAsyncComponent({
        loader: dialogGlobList[path],
        loadingComponent,
        errorComponent,
      });
    }
    return obj;
  },
  {},
);
if (dev) console.log(dialogCompList);
</script>

<style scoped></style>
