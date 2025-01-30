<template>
  <n-scrollbar>
    <n-radio-group v-model:value="rcDir" name="radiogroup">
      <n-flex>
        <n-radio v-for="item in rcDirOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </n-radio>
      </n-flex>
    </n-radio-group>
    <n-flex verticle>
      <n-divider />
      <n-timeline :icon-size="24">
        <n-timeline-item v-for="(revision, index) in rcData" :key="index">
          <template #icon>
            <material-symbol :size="16">
              {{
                revision.type === 'new'
                  ? 'add_circle'
                  : revision.type === 'log' && revision.logtype === 'upload'
                    ? 'upload_file'
                    : 'difference'
              }}
            </material-symbol>
          </template>
          <template #header>
            <n-a @click="openDiff(revision.revid)"> #{{ revision.revid }} </n-a>
            |
            <n-a :href="`/p/${revision.pageid}`" target="_blank">
              {{ revision.title }}
            </n-a>
          </template>
          <template #default>
            <n-flex vertical>
              <n-flex>
                <n-tag v-for="tag in revision.tags" :key="tag" size="small">
                  {{ tag }}
                </n-tag>
              </n-flex>
              <div v-html="revision.parsedcomment"></div>
            </n-flex>
          </template>
          <template #footer>
            {{ dayjs(revision.timestamp).format('YYYY-MM-DD HH:mm:ss') }} by
            {{ revision.user }}
          </template>
        </n-timeline-item>
      </n-timeline>
      <n-button @click="loadRevisions()" :loading="loading">Load More</n-button>
    </n-flex>
  </n-scrollbar>
</template>

<script setup lang="ts">
/*
 * In this file, "arv-" stands for "all revisions"
 */
import { ref, onBeforeMount, type Ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

let loading = ref(false)

// configure i18n
const { t } = useI18n()

// configure the radio group
let rcDirOptions: Ref<{ label: string; value: string }[]> = ref([
  { label: t('arv-oldest'), value: 'older' },
  { label: t('arv-newest'), value: 'newer' },
])
let rcDir: Ref<string> = ref('older')
watch(rcDir, () => {
  rcData.value = []
  rcContinue.value = ''
  loadRevisions()
})

// define the data types
type RcResponse = {
  batchcomplete: string
  continue: {
    rccontinue: string
    continue: string
  }
  query: {
    recentchanges: RcData
  }
}
type RcData = {
  type: 'categorize' | 'edit' | 'external' | 'log' | 'new'
  logtype: undefined | string
  ns: number
  title: string
  pageid: number
  revid: number
  old_revid: number
  rcid: number
  user: string
  userid: number
  minor: string
  oldlen: number
  newlen: number
  timestamp: string
  comment: string
  parsedcomment: string
  patrolled: string
  autopatrolled: string
  tags: string[]
  sha1: string
  useravatartime: number
}[]

let rcData: Ref<RcData> = ref([])
let rcContinue: Ref<string> = ref('')
async function loadRevisions() {
  loading.value = true

  // fetch the data
  let url = new URL('/api.php', location.origin)
  url.searchParams.set('action', 'query')
  url.searchParams.set('list', 'recentchanges')
  url.searchParams.set('rclimit', '500')
  url.searchParams.set('format', 'json')
  url.searchParams.set('rcdir', rcDir.value)
  url.searchParams.set(
    'rcprop',
    'user|userid|comment|parsedcomment|flags|timestamp|title|ids|sizes|redirect|patrolled|loginfo|tags|sha1',
  )
  rcContinue.value && url.searchParams.set('rccontinue', rcContinue.value)
  let response = await fetch(url)
  let data: RcResponse = await response.json()
  console.log(data)
  // update the refs
  rcData.value.push(...data.query.recentchanges)
  rcContinue.value = data.continue?.rccontinue

  loading.value = false
}
onBeforeMount(async () => {
  await loadRevisions()
})

function openDiff(revid: number) {
  // if InPageEdit is enabled, open the diff in InPageEdit
  if (typeof InPageEdit !== 'undefined') {
    InPageEdit.diff({
      fromrev: revid,
      torelative: 'prev',
    })
  } else {
    // otherwise, open the diff in a new tab
    window.open(`/index.php?diff=${revid}`)
  }
}
</script>

<style scoped></style>
