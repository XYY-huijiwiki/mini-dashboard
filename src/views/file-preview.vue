<template>
  <div>
    <loading-view v-if="status === 'loading'" />
    <template v-else-if="status === 'ready'">
      <n-spin :show="showSpin">
        <!-- audio preview (except midi) -->
        <audio
          v-if="
            data.file.type.startsWith('audio/') &&
            data.file.type !== 'audio/midi'
          "
          :src="src"
          controls
          style="display: block; width: 100%; color-scheme: dark"
          controlsList="nodownload"
        ></audio>
        <!-- flash preview -->
        <div
          v-else-if="data.file.type === 'application/x-shockwave-flash'"
          id="flash-container"
          class="embed-responsive img-rounded"
        ></div>
        <!-- video preview -->
        <video
          v-else-if="data.file.type.startsWith('video/')"
          :src="src"
          style="
            border-radius: 4px;
            max-width: 100%;
            max-height: 100vh;
            margin-left: auto;
            margin-right: auto;
            display: block;
          "
          :controls="showControls"
          controlsList="nodownload"
        ></video>
        <!-- model preview -->
        <n-space vertical v-else-if="data.file.type.startsWith('model/')">
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
        </n-space>
        <!-- others preview -->
        <n-result
          v-else
          :title="fileName"
          :description="t('file-preview.no-preview')"
        >
          <template #icon>
            <material-symbol :size="80">draft</material-symbol>
          </template>
          <template #footer>
            <n-button
              type="primary"
              @click="
                (globalModalContent = `download`),
                  (globalModalData = [retrievedDataItem]),
                  (globalModalShow = true)
              "
              >{{ t("file-manager.dropdown-option-download") }}</n-button
            >
          </template>
        </n-result>
      </n-spin>
      <n-divider />
      <n-space vertical>
        <n-alert type="info">
          <template #header>
            {{ t("file-preview.label-file-source") }}
          </template>
          <template #default>
            {{ data.wiki.fileSource }}
          </template>
        </n-alert>
        <n-alert type="info">
          <template #header>
            {{ t("file-preview.label-file-license") }}
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
            <n-statistic :label="t('file-preview.label-' + key)">
              <template #default>
                {{ fileInfo[key] }}
              </template>
            </n-statistic>
          </n-gi>
        </template>
      </n-grid>
      <n-divider />
      <!-- others -->
      <n-space>
        <file-menu :data="[data]" v-model:show="showFileMenu">
          <n-button @click="showFileMenu = true">
            <template #icon>
              <material-symbol :size="20">more_horiz</material-symbol>
            </template>
          </n-button>
        </file-menu>
      </n-space>
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
import { filesize } from "filesize";
import sleep from "@anmiles/sleep";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useI18n } from "vue-i18n";
import { getObjectURL } from "@/utils/getObjectURL";
import { storeToRefs } from "pinia";
import { useLocalesStore } from "@/stores/locales";
import { NButton } from "naive-ui";
import { useModalStore } from "@/stores/modal";

// config dev env
let dev = import.meta.env.DEV;

const { langCode } = storeToRefs(useLocalesStore());

const { t } = useI18n();
let retrievedDataItem: Ref<RetrievedDataItem>;

// configure dayjs
dayjs.extend(duration);

// use route
const route = useRoute();
const fileName = route.params.fileName;
let status: Ref<"loading" | "ready" | "error"> = ref("loading");
let src: Ref<string> = ref("");
let showControls: Ref<boolean> = ref(false);
let showSpin: Ref<boolean> = ref(true);

let data: Ref<RetrievedDataItem>;
let animation: Ref<string>;

let fileInfo: Ref<Record<string, string | number | undefined>> = ref({});

onMounted(async () => {
  let json = await getPage(`Data:${fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
    retrievedDataItem = ref(data.value);
    dev && console.log(retrievedDataItem.value);
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
  let fileSrc = await getObjectURL([fileName.toString()]);
  if (!fileSrc) {
    status.value = "error";
    return;
  }
  src.value = fileSrc;

  // load flash player (for flash only)
  if (data.value.file.type === "application/x-shockwave-flash") {
    window.RufflePlayer = window.RufflePlayer || {};
    await new Promise((resolve) => {
      let script = document.createElement("script");
      script.src = "https://unpkg.com/@ruffle-rs/ruffle";
      script.onload = resolve;
      document.head.appendChild(script);
    });
    let ruffle = await window.RufflePlayer.newest();
    let player = await ruffle.createPlayer();
    player.className = "embed-responsive-item"; // implicitly responsive
    let container = document.getElementById("flash-container");
    if (container) {
      container.appendChild(player);
      player.load(src.value);
    }
  }

  // file info display
  let mediaLength = data.value.mediaInfo?.track.filter(
    (i) => i["@type"] === "General",
  )[0].Duration;
  let mediaBitrate = data.value.mediaInfo?.track.filter(
    (i) => i["@type"] === "General",
  )[0].OverallBitRate;
  fileInfo.value = {
    "file-type": data.value.file.type,
    "video-frame-width": data.value.mediaInfo?.track.filter(
      (i) => i["@type"] === "Video",
    )[0]?.Width,
    "video-frame-height": data.value.mediaInfo?.track.filter(
      (i) => i["@type"] === "Video",
    )[0]?.Height,
    "media-length": mediaLength
      ? dayjs.duration(mediaLength, "second").format("HH:mm:ss")
      : undefined,
    "video-total-bitrate":
      data.value.file.type.startsWith("video/") && mediaBitrate
        ? filesize(mediaBitrate, { locale: langCode.value }) + "/s"
        : undefined,
    "audio-bitrate":
      data.value.file.type.startsWith("audio/") && mediaBitrate
        ? filesize(mediaBitrate, { locale: langCode.value }) + "/s"
        : undefined,
    "file-size": filesize(data.value.file.size, { locale: langCode.value }),
  };

  // wait for one second, otherwise the video control bar will show its own loading animation
  await sleep(1000);
  showControls.value = true;
  showSpin.value = false;
});

// other operations
let showFileMenu: Ref<boolean> = ref(false);

// import global modal store
const { globalModalShow, globalModalContent, globalModalData } =
  storeToRefs(useModalStore());
</script>
