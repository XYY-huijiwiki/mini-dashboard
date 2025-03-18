<template>
  <n-scrollbar>
    <n-alert type="warning" v-if="loading" show-icon>
      {{ t('github-file.msg-internet-connection-warning') }}
    </n-alert>

    <n-divider v-if="loading" />

    <n-spin :show="loading">
      <!-- video -->
      <video
        v-if="fileInfo?.content_type?.startsWith('video')"
        controls
        class="w-full aspect-video object-contain bg-black"
        :poster="genThumbUrl(fileInfo)"
        preload="metadata"
      >
        <source :src="genRawFileUrl(fileInfo)" :type="fileInfo?.content_type" />
      </video>
      <!-- image -->
      <img
        v-else-if="fileInfo?.content_type?.startsWith('image')"
        :src="genRawFileUrl(fileInfo)"
        class="w-full aspect-video object-contain bg-black"
      />
      <!-- audio -->
      <audio
        v-else-if="fileInfo?.content_type?.startsWith('audio')"
        ref="audioEle"
        controls
        class="w-full"
        preload="metadata"
      >
        <source :src="genRawFileUrl(fileInfo)" :type="fileInfo?.content_type" />
      </audio>
      <!-- model -->
      <div v-else-if="fileInfo?.content_type?.startsWith('model')" class="w-full aspect-video">
        <model-viewer
          autoplay
          auto-rotate
          :src="genRawFileUrl(fileInfo)"
          camera-controls
          touch-action="pan-y"
          class="w-full h-full"
          :poster="genThumbUrl(fileInfo)"
        ></model-viewer>
      </div>
      <!-- no preview -->
      <n-result v-else :title="fileInfo?.file_name" :description="t('github-file.msg-no-preview')">
        <template #icon>
          <material-symbol :size="80">unknown_document</material-symbol>
        </template>
        <template #footer>
          <n-button tag="a" :href="fileInfo && genRawFileUrl(fileInfo)">
            {{ t('github-file.btn-download') }}
          </n-button>
        </template>
      </n-result>

      <n-divider v-if="fileInfo" />

      <n-table v-if="fileInfo">
        <tbody>
          <tr v-for="[key, value] in Object.entries(fileInfo)" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </n-table>
    </n-spin>
  </n-scrollbar>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { genThumbUrl, genRawFileUrl } from '@/utils/genUrl'

const { t } = useI18n()
const route = useRoute()
const fileInfo: Ref<null | FileInfo> = ref(null)
const loading = ref(true)

onMounted(async () => {
  const fileName = (route.params.fileName as string).replace(/ /g, '_').replace(/'/g, "''")
  const queryStr = `select * from \`files\` where \`is_deleted\` is null and \`file_name\` = '${fileName}'`
  const queryUrl = new URL('https://xyy-huijiwiki-gh-files-db.karsten-zhou-773.workers.dev/')
  queryUrl.searchParams.set('query', queryStr)
  fileInfo.value = (await fetch(queryUrl.toString()).then((res) => res.json()))[0]
    .results[0] as FileInfo
  loading.value = false
})

// load model-viewer dynamically
const unWatch = watch(fileInfo, async (fileInfo) => {
  if (fileInfo?.content_type?.startsWith('model')) {
    loading.value = true
    await import('@google/model-viewer')
    loading.value = false
    unWatch()
  }
})
</script>

<style scoped></style>
