<template>
  <div>
    <loading-view v-if="status === 'loading'" />
    <template v-else-if="status === 'ready'">
      <div class="embedembed-responsive" v-if="data.file.type === 'video/mp4'">
        <n-spin :show="showSpin">
          <video
            :poster="posterSrc"
            :src="videoSrc"
            style="border-radius: 4px; object-fit: cover; width: 100%"
            :controls="showControls"
          ></video>
        </n-spin>
      </div>
      <n-grid x-gap="8" y-gap="16" cols="1 400:2 600:3">
        <!-- Dateityp -->
        <n-gi>
          <n-statistic :label="t('preview.label-file-type')">
            <template #default>
              {{ data.file.type }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- Bildbreite -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-frame-width')">
            <template #default>
              {{ data.video.frameWidth }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- Bildhöhe -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-frame-height')">
            <template #default>
              {{ data.video.frameHeight }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- Länge -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-length')">
            <template #default>
              {{
                dayjs.duration(data.video.length, "second").format("HH:mm:ss")
              }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- Gesamtbitrate -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-total-bitrate')">
            <template #default>
              {{ floor(((data.file.size / data.video.length) * 8) / 1000, 2) }}
            </template>
            <template #suffix> kBit/s </template>
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic :label="t('preview.label-file-size')">
            <template #default>
              {{ filesize(data.file.size, { locale: langCode }) }}
            </template>
          </n-statistic>
        </n-gi>
      </n-grid>
    </template>
    <error-view v-else />
  </div>
</template>

<script setup lang="ts">
import { getPage } from "@/utils/mwApi/index";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { ref, type Ref } from "vue";
import loadingView from "@/views/loading-view.vue";
import errorView from "@/views/error-view.vue";
import { floor } from "lodash-es";
import { filesize } from "filesize";
import sleep from "await-sleep";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { langCode } from "@/locales";
import { useI18n } from "vue-i18n";
import extract from "png-chunks-extract";

const { t } = useI18n();

// configure dayjs
dayjs.extend(duration);

// use route
const route = useRoute();
let status: Ref<"loading" | "ready" | "error"> = ref("loading");
let posterSrc: Ref<string> = ref("");
let videoSrc: Ref<string> = ref("");
let showControls: Ref<boolean> = ref(false);
let showSpin: Ref<boolean> = ref(true);

let data: RetrievedDataItem;

onMounted(async () => {
  let json = await getPage(`Data:${route.params.fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
    status.value = "ready";
  } else {
    status.value = "error";
    return;
  }
  posterSrc.value = mw.huijiApi.getImageUrl(
    route.params.fileName.toString().replace(/ /g, "_") + ".poster.png",
    "xyy"
  );

  let containerURL = mw.huijiApi.getImageUrl(
    route.params.fileName.toString().replace(/ /g, "_") + ".png",
    "xyy"
  );

  let containerStream = await fetch(containerURL);
  let containerBuffer = await containerStream.arrayBuffer();
  let containerArray = new Uint8Array(containerBuffer);
  let containerChunks = extract(containerArray);
  let fileUnit8Array = containerChunks.find((chunk) => {
    return chunk.name === "IXYY";
  })?.data;

  if (!fileUnit8Array) {
    status.value = "error";
    return;
  }

  let fileSrc = URL.createObjectURL(
    new Blob([fileUnit8Array], { type: "video/mp4" })
  );
  
  videoSrc.value =  fileSrc;
    // wait for one second, otherwise the video control bar will show its own loading animation
    await sleep(1000);
  showControls.value = true;
  showSpin.value = false;
});
</script>

<style scoped></style>
