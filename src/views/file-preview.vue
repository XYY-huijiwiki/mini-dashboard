<template>
  <div>
    <loading-view v-if="status === 'loading'" />
    <template v-else-if="status === 'ready'">
      <n-spin :show="showSpin">
        <!-- audio/midi preview -->
        <n-result v-if="data.file.type === 'audio/midi'" title="No Preview" />
        <!-- audio preview (except midi) -->
        <template v-else-if="data.audio">
          <audio
            :src="src"
            controls
            style="display: block; width: 100%; color-scheme: dark"
            controlsList="nodownload"
          ></audio>
        </template>
        <!-- video preview -->
        <video
          v-if="data.video"
          :src="src"
          style="border-radius: 4px; object-fit: cover; width: 100%"
          :controls="showControls"
          controlsList="nodownload"
        ></video>
        <!-- model preview -->
        <n-space vertical v-if="data.file.type.startsWith('model/')">
          <div class="embed-responsive">
            <model-viewer
              autoplay
              :animation-name="animation"
              :src="src"
              camera-controls
              shadow-intensity="1"
              touch-action="pan-y"
              style="
                border-radius: 4px;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 100%;
              "
            ></model-viewer>
          </div>
          <n-space v-if="data.model?.animations">
            <n-radio-group v-model:value="animation">
              <n-radio
                v-for="anim in data.model.animations"
                :value="anim"
                :key="anim"
              >
                {{ anim }}
              </n-radio>
            </n-radio-group>
          </n-space>
        </n-space>
      </n-spin>
      <n-divider />
      <n-space vertical>
        <n-alert type="info">
          <template #header>
            {{ t("preview.label-file-source") }}
          </template>
          <template #default>
            {{ data.wiki.fileSource }}
          </template>
        </n-alert>
        <n-alert type="info">
          <template #header>
            {{ t("preview.label-file-license") }}
          </template>
          <template #default>
            {{ data.wiki.fileLicense }}
          </template>
        </n-alert>
      </n-space>
      <n-divider />
      <!-- file info display -->
      <n-grid x-gap="8" y-gap="16" cols="1 400:2 600:3">
        <template v-for="key in Object.keys(fileInfo)">
          <n-gi v-if="fileInfo[key] !== undefined" :key="key">
            <n-statistic :label="t('preview.label-' + key)">
              <template #default>
                {{ fileInfo[key] }}
              </template>
            </n-statistic>
          </n-gi>
        </template>
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
import sleep from "@anmiles/sleep";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useI18n } from "vue-i18n";
import { getObjectURL } from "@/utils/getObjectURL";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";

const { langCode } = storeToRefs(useLocalesStore());

const { t } = useI18n();

// configure dayjs
dayjs.extend(duration);

// use route
const route = useRoute();
let status: Ref<"loading" | "ready" | "error"> = ref("loading");
let src: Ref<string> = ref("");
let showControls: Ref<boolean> = ref(false);
let showSpin: Ref<boolean> = ref(true);

let data: Ref<RetrievedDataItem>;
let animation: Ref<string>;

let fileInfo: Ref<Record<string, string | number | undefined>> = ref({});

onMounted(async () => {
  let json = await getPage(`Data:${route.params.fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
    status.value = "ready";
  } else {
    status.value = "error";
    return;
  }

  // load model viewer (for model only)
  if (data.value.file.type.startsWith("model/")) {
    await import("@google/model-viewer");
    if (data.value.model?.animations) {
      animation = ref(data.value.model.animations[0]);
    }
  }

  // load file
  let fileSrc = await getObjectURL([route.params.fileName.toString()]);
  if (!fileSrc) {
    status.value = "error";
    return;
  }
  src.value = fileSrc;

  // file info display
  fileInfo.value = {
    "file-type": data.value.file.type,
    "video-frame-width": data.value.video?.frameWidth,
    "video-frame-height": data.value.video?.frameHeight,
    "video-length": data.value.video?.length
      ? dayjs.duration(data.value.video.length, "second").format("HH:mm:ss")
      : undefined,
    "audio-length": data.value.audio?.format.duration
      ? dayjs
          .duration(data.value.audio.format.duration, "second")
          .format("HH:mm:ss")
      : undefined,
    "video-total-bitrate": data.value.video?.length
      ? floor(((data.value.file.size / data.value.video.length) * 8) / 1000, 2)
      : undefined,
    "audio-bitrate": data.value.audio?.format.bitrate
      ? floor(data.value.audio.format.bitrate / 1000, 2)
      : undefined,
    "file-size": filesize(data.value.file.size, { locale: langCode.value }),
  };

  // wait for one second, otherwise the video control bar will show its own loading animation
  await sleep(1000);
  showControls.value = true;
  showSpin.value = false;
});
</script>
