import { defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  const globalModalShow: Ref<boolean> = ref(false);
  const globalModalContent: Ref<string | null> = ref(null);
  const globalModalData: Ref<RetrievedDataItem[]> = ref([]);
  const globalModalFunc = (a: string) => {
    return a;
  };
  return {
    globalModalShow,
    globalModalContent,
    globalModalData,
    globalModalFunc,
  };
});
