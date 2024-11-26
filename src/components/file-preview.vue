<template>
  <n-card closable @close="fileDetail = undefined" class="w-full h-full">
    <template #header>
      <n-ellipsis>
        <n-flex>
          <n-icon>
            <file-icon :file-type="fileDetail?.type" />
          </n-icon>
          <n-text>{{ fileDetail?.name }}</n-text>
        </n-flex>
      </n-ellipsis>
    </template>
    <template #default>
      <!-- video -->
      <video
        v-if="fileDetail?.type?.startsWith('video')"
        controls
        class="w-full h-full"
        :poster="'https://ik.imagekit.io/gwa1ycz7gc/' + fileDetail?.thumb_url"
      >
        <source :src="fileDetail?.download_url" :type="fileDetail?.type" />
      </video>
      <!-- image -->
      <picture v-else-if="fileDetail?.type?.startsWith('image')">
        <img :src="fileDetail?.download_url" class="w-full h-full" />
      </picture>
      <!-- audio -->
      <audio
        v-else-if="fileDetail?.type?.startsWith('audio')"
        controls
        class="w-full"
        ref="audioEle"
      >
        <source :src="fileDetail?.download_url" :type="fileDetail?.type" />
      </audio>
      <!-- no preview -->
      <n-result
        v-else
        :title="fileDetail?.name"
        :description="t('github-files.no-preview')"
      >
        <template #icon>
          <material-symbol :size="80">unknown_document</material-symbol>
        </template>
        <template #footer>
          <n-button tag="a" :href="fileDetail?.download_url">{{
            t("github-files.btn-download")
          }}</n-button>
        </template>
      </n-result>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import fileIcon from "./file-icon.vue";
import { useI18n } from "vue-i18n";
let { t } = useI18n();
let fileDetail = defineModel<FileDetail>();
</script>

<style scoped></style>
