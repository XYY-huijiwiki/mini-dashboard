<template>
  <n-card class="h-full" closable @close="emit('close')" content-class="h-0  ">
    <!-- for non single selected situtation -->
    <template #header v-if="fileDetails.length !== 1">
      <n-ellipsis>
        <file-icon />
        {{ t('github-files.msg-number-files-selected', [fileDetails.length]) }}
      </n-ellipsis>
    </template>
    <!-- header: file name -->
    <template #header v-if="fileDetails.length === 1">
      <n-ellipsis>
        <file-icon :file-type="fileDetails[0].type" />
        {{ fileDetails[0].name }}
      </n-ellipsis>
    </template>
    <!-- file thumb -->
    <template #cover v-if="fileDetails.length === 1 && fileDetails[0].thumb_url">
      <div class="bg-black">
        <img
          class="object-contain aspect-video"
          :src="'https://ik.imagekit.io/gwa1ycz7gc/' + fileDetails[0].thumb_url"
        />
      </div>
    </template>
    <!-- file details -->
    <template #default v-if="fileDetails.length === 1">
      <n-scrollbar>
        <!-- file details / basic info -->
        <n-divider>{{ t('github-files.label-basic-info') }}</n-divider>
        <n-flex vertical>
          <n-statistic :label="t('github-files.label-file-type')">
            {{ fileDetails[0].type }}
          </n-statistic>
          <n-statistic :label="t('github-files.label-file-size')">
            {{ filesize(fileDetails[0].size) }}
          </n-statistic>
        </n-flex>
        <!-- file details / desc -->
        <n-divider>{{ t('github-files.label-file-desc') }}</n-divider>
        <div class="markdown-body" v-html="md.render(fileDetails[0].desc)"></div>
        <!-- file details / file usage -->
        <n-divider>{{ t('github-files.label-file-usage') }}</n-divider>
        <template v-if="fileUsageLoading || fileUsageData === null">
          <n-skeleton text :repeat="2" /> <n-skeleton text style="width: 60%" />
        </template>
        <n-empty
          :description="t(`github-files.msg-file-no-usage`)"
          v-else-if="fileUsageData.length === 0"
        />
        <div v-else class="markdown-body">
          <n-ul>
            <n-li v-for="item in fileUsageData">
              <n-a :href="item.url" target="_blank">{{ item.title }}</n-a>
            </n-li>
          </n-ul>
        </div>
        <!-- code snippet -->
        <n-divider>{{ t('github-files.label-code-snippet') }}</n-divider>
        <p>{{ t('github-files.code-snippet-image') }}</p>
        <n-card size="small" content-class="font-mono flex text-nowrap overflow-auto !pb-1">
          <n-scrollbar x-scrollable class="pb-2">
            [[File:GitHub:{{ fileDetails[0].name }}]]
          </n-scrollbar>
        </n-card>
        <p>{{ t('github-files.code-snippet-link') }}</p>
        <n-card size="small" content-class="font-mono flex text-nowrap overflow-auto !pb-1">
          <n-scrollbar x-scrollable class="pb-2">
            [[:File:GitHub:{{ fileDetails[0].name }}]]
          </n-scrollbar>
        </n-card>
        <p>{{ t('github-files.code-snippet-gallery') }}</p>
        <n-card size="small" content-class="font-mono flex text-nowrap overflow-auto !pb-1">
          <n-scrollbar x-scrollable class="pb-2">
            {{ `<gallery>`}}<br />{{ `GitHub:${fileDetails[0].name}` }}<br />{{`</gallery>` }}
          </n-scrollbar>
        </n-card>
      </n-scrollbar>
    </template>
    <!-- action btns -->
    <template #action v-if="fileDetails.length === 1">
      <n-button tag="a" :href="fileDetails[0].html_url" target="_blank">
        {{ t('github-files.btn-view-in-github') }}
      </n-button>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import { filesize as filesizeNoLocale } from 'filesize'
import { useLocalesStore } from '@/stores/locales'
import { storeToRefs } from 'pinia'
import { useFetch } from '@vueuse/core'
import sleep from '@anmiles/sleep'
let { langCode } = storeToRefs(useLocalesStore())
let filesize = (size: number) => filesizeNoLocale(size, { locale: langCode.value })
let md = new MarkdownIt({
  linkify: true,
  html: true,
})
let { t } = useI18n()
let { fileDetails } = defineProps<{
  fileDetails: FileDetail[]
}>()
let emit = defineEmits(['close'])

let fileUsageUrl = computed(() =>
  fileDetails.length === 1
    ? `https://xyy.huijiwiki.com/api.php?format=json&action=query&list=backlinks&bltitle=File:GitHub:${fileDetails[0].name}`
    : '',
)
let { isFetching: fileUsageLoading, data: fileUsageData } = useFetch(fileUsageUrl, {
  refetch: true,
  beforeFetch: async ({ url, options, cancel }) => {
    if (url === '') cancel()
    await sleep(1000)
  },
  afterFetch: (ctx) => {
    let res = ctx.data.query.backlinks.map((item: { title: string }) => ({
      url: `https://xyy.huijiwiki.com/wiki/${item.title}`,
      title: item.title,
    }))
    if (ctx.data.query.continue)
      res.push({
        url: `https://xyy.huijiwiki.com/index.php?title=特殊:链入页面&target=文件:GitHub:${fileDetails[0].name}`,
        title: t('github-files.btn-file-usage-more'),
      })
    ctx.data = res
    return ctx
  },
}).json()
</script>

<style>
.markdown-body ul {
  list-style-type: disc;
}
</style>
