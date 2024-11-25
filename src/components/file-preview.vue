<template>
  <n-card closable @close="model = undefined" class="w-full h-full">
    <template #header>
      <n-ellipsis>
        <n-flex>
          <n-icon>
            <file-icon :file-type="model?.type" />
          </n-icon>
          <n-text>{{ model?.name }}</n-text>
        </n-flex>
      </n-ellipsis>
    </template>
    <template #default>
      <video
        v-if="model?.type?.startsWith('video')"
        controls
        class="w-full h-full"
        :poster="model?.thumb_url"
      >
        <source :src="model?.download_url" :type="model?.type" />
      </video>
      <picture v-else-if="model?.type?.startsWith('image')">
        <img :src="model?.download_url" class="w-full h-full" />
      </picture>
      <audio
        v-else-if="model?.type?.startsWith('audio')"
        controls
        class="w-full"
        ref="audioEle"
      >
        <source :src="model?.download_url" :type="model?.type" />
      </audio>
      <n-result
        v-else
        :title="model?.name"
        :description="t('github-files.no-preview')"
      >
        <template #icon>
          <material-symbol :size="80">unknown_document</material-symbol>
        </template>
        <template #footer>
          <n-button type="primary" tag="a" :href="model?.download_url">{{
            t("github-files.dropdown-option-download")
          }}</n-button>
        </template>
      </n-result>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import fileIcon from "./file-icon.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const model = defineModel<FileDetail>();
</script>

<style scoped></style>
