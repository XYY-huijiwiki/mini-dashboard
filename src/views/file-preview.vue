<template>
  <div>
    <loading-view v-if="status === 'loading'" />
    <template v-else-if="status === 'ready'">
      <n-spin :show="showSpin">
        <audio
          v-if="data.audio"
          :src="src"
          controls
          style="display: block; width: 100%; color-scheme: dark"
        ></audio>
        <div class="embedembed-responsive" v-if="data.video">
          <video
            :poster="posterSrc"
            :src="src"
            style="border-radius: 4px; object-fit: cover; width: 100%"
            :controls="showControls"
          ></video>
        </div>
      </n-spin>
      <n-divider />
      <n-grid x-gap="8" y-gap="16" cols="1 400:2 600:3">
        <!-- file type -->
        <n-gi>
          <n-statistic :label="t('preview.label-file-type')">
            <template #default>
              {{ data.file.type }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- frame width (video only) -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-frame-width')">
            <template #default>
              {{ data.video.frameWidth }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- frame height (video only) -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-frame-height')">
            <template #default>
              {{ data.video.frameHeight }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- length (video only) -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-length')">
            <template #default>
              {{
                dayjs.duration(data.video.length, "second").format("HH:mm:ss")
              }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- length (audio only) -->
        <n-gi v-if="data.audio">
          <n-statistic :label="t('preview.label-audio-length')">
            <template #default>
              {{
                dayjs
                  .duration(data.audio.format.duration, "second")
                  .format("HH:mm:ss")
              }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- total bitrate (video only) -->
        <n-gi v-if="data.video">
          <n-statistic :label="t('preview.label-video-total-bitrate')">
            <template #default>
              {{ floor(((data.file.size / data.video.length) * 8) / 1000, 2) }}
            </template>
            <template #suffix> kBit/s </template>
          </n-statistic>
        </n-gi>
        <!-- bitrate (audio only) -->
        <n-gi v-if="data.audio">
          <n-statistic :label="t('preview.label-audio-bitrate')">
            <template #default>
              {{ floor(data.audio.format.bitrate / 1000, 2) }}
            </template>
            <template #suffix> kBit/s </template>
          </n-statistic>
        </n-gi>
        <!-- file size -->
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
import { getObjectURL } from "@/utils/getObjectURL";

const { t } = useI18n();

// configure dayjs
dayjs.extend(duration);

// use route
const route = useRoute();
let status: Ref<"loading" | "ready" | "error"> = ref("loading");
let posterSrc: Ref<string> = ref("");
let src: Ref<string> = ref("");
let showControls: Ref<boolean> = ref(false);
let showSpin: Ref<boolean> = ref(true);

let data: Ref<RetrievedDataItem>;

onMounted(async () => {
  let json = await getPage(`Data:${route.params.fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
    status.value = "ready";
  } else {
    status.value = "error";
    return;
  }

  // load poster (for video only)
  if (data.value.video) {
    posterSrc.value = mw.huijiApi.getImageUrl(
      route.params.fileName.toString().replace(/ /g, "_") + ".poster.png",
      "xyy",
    );
  }

  // load file
  let fileSrc = await getObjectURL([route.params.fileName.toString()]);
  if (!fileSrc) {
    status.value = "error";
    return;
  }
  src.value = fileSrc;

  // wait for one second, otherwise the video control bar will show its own loading animation
  await sleep(1000);
  showControls.value = true;
  showSpin.value = false;
});
</script>
