<template>
  <div>
    <loading-view v-if="status === 'loading'" />
    <template v-else-if="status === 'ready'">
      <div
        class="embedembed-responsive"
        v-if="data.metadata.mime === 'video/mp4'"
      >
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
              {{ data.metadata.mime }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- Bildbreite -->
        <n-gi>
          <n-statistic :label="t('preview.label-video-frame-width')">
            <template #default>
              {{ data.metadata.width }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- Bildhöhe -->
        <n-gi>
          <n-statistic :label="t('preview.label-video-frame-height')">
            <template #default>
              {{ data.metadata.height }}
            </template>
            <template #suffix> px </template>
          </n-statistic>
        </n-gi>
        <!-- Länge -->
        <n-gi>
          <n-statistic :label="t('preview.label-video-length')">
            <template #default>
              {{
                dayjs
                  .duration(data.metadata.duration, "second")
                  .format("HH:mm:ss")
              }}
            </template>
          </n-statistic>
        </n-gi>
        <!-- Gesamtbitrate -->
        <n-gi>
          <n-statistic :label="t('preview.label-video-total-bitrate')">
            <template #default>
              {{
                floor(
                  ((data.metadata.size / data.metadata.duration) * 8) / 1000,
                  2,
                )
              }}
            </template>
            <template #suffix> kBit/s </template>
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic :label="t('preview.label-file-size')">
            <template #default>
              {{ filesize(data.metadata.size, { locale: langCode }) }}
            </template>
          </n-statistic>
        </n-gi>
        <n-gi>
          <n-statistic :label="t('preview.label-file-size-on-disk')">
            <template #default>
              {{ filesize(data.base64Info.size, { locale: langCode }) }}
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

let data: Ref<{
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
}>;

onMounted(async () => {
  let json = await getPage(`Data:${route.params.fileName}.json`);
  if (json) {
    data = ref(JSON.parse(json.content));
    status.value = "ready";
  } else {
    status.value = "error";
  }
  posterSrc.value = mw.huijiApi.getImageUrl(
    route.params.fileName.toString().replace(/ /g, "_") + ".png",
    "xyy",
  );

  // 定义base64字符串
  let base64Str = "";

  // 获取base64字符串
  for (let index = 0; index < data.value.base64Info.count; index++) {
    let response = await fetch(
      `https://xyy.huijiwiki.com/wiki/Data:${route.params.fileName}/${index}?action=raw`,
    );
    if (response.ok) {
      base64Str = base64Str + (await response.text());
    } else {
      console.log(
        "通过循环遍历获取base64字符串，直到找不到下一份字符串为止。所以出现一次404请求是正常的。",
      );
      break;
    }
  }

  videoSrc.value = base64Str;
  // wait for one second, otherwise the video control bar will show its own loading animation
  await sleep(1000);
  showControls.value = true;
  showSpin.value = false;
});
</script>

<style scoped></style>
