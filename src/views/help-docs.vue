<template>
  <div>
    <n-spin :show="loading">
      <error-view v-if="error" />
      <p v-html="docHTML" v-else class="doc-content"></p>
    </n-spin>
  </div>
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
console.log(docs);

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

<style>
/* fluent UI title 1 */
.doc-content h1 {
  font-weight: 600 !important;
  font-size: 32px !important;
  line-height: 40px !important;
  display: inline-block !important;
  margin-top: 0.5em !important;
  margin-bottom: 0.25em !important;
  padding: 0 !important;
}
/* fluent UI title 2 */
.doc-content h2 {
  font-weight: 600 !important;
  font-size: 28px !important;
  line-height: 36px !important;
  display: inline-block !important;
  margin-top: 0.5em !important;
  margin-bottom: 0.25em !important;
  padding: 0 !important;
}
/* fluent UI title 3 */
.doc-content h3 {
  font-weight: 600 !important;
  font-size: 24px !important;
  line-height: 32px !important;
  display: inline-block !important;
  margin-top: 0.5em !important;
  margin-bottom: 0.25em !important;
  padding: 0 !important;
}
/* fluent UI body 1 */
.doc-content p {
  font-weight: 400 !important;
  font-size: 14px !important;
  line-height: 20px !important;
}
</style>
