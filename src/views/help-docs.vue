<template>
  <n-spin :show="loading">
    <error-view v-if="error" />
    <n-scrollbar v-html="docHTML" v-else></n-scrollbar>
  </n-spin>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import errorView from "./error-view.vue";
import { useLocalesStore } from "@/stores/locales";
import { storeToRefs } from "pinia";

const { langCode } = storeToRefs(useLocalesStore());
const route = useRoute();
let loading = ref(true);
let error = ref(false);
let docHTML = ref("");
let docs = import.meta.glob(`@/locales/*/docs/*.md`, {
  import: "default",
  as: "raw",
});
if (import.meta.env.DEV) console.log(docs);

onMounted(async () => {
  try {
    let docStr =
      await docs[
        `/src/locales/${langCode.value}/docs/${route.params.title}.md`
      ]();
    docHTML.value = new MarkdownIt({
      html: true,
    }).render(docStr);
  } catch (e) {
    console.log(e);
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped></style>
