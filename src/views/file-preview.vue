<template>
  <div>
    <loading-view v-if="loading" />
    <template v-else>
      {{ route.params.fileName }}
      <n-statistic label="Größe">
        <template #default>
          {{ data.metadata.size / (1024 * 1024) }}
        </template>
        <template #suffix> Kib </template>
      </n-statistic>
      <n-statistic label="Größe auf Datenträger">
        <template #default>
          {{ data.base64Info.size / (1024 * 1024) }}
        </template>
        <template #suffix> Kib </template>
      </n-statistic>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getWikiPage } from "@/utils/mwApi";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { ref } from "vue";

// use route
const route = useRoute();

let data: {
  metadata: {
    duration: number;
    width: number;
    height: number;
    size: number;
    mime: string | null;
  };
  fileSource: string;
  base64Info: {
    size: number;
    count: number;
  };
  dataType: string;
};
let loading = ref(true);
let error = ref(false);

onMounted(async () => {
  let json = await getWikiPage(`Data:${route.params.fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
  } else {
    error.value = true;
  }
});
</script>

<style scoped></style>
