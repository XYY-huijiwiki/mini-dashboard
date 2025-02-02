<template>
  <n-scrollbar>
    <n-button @click="getAllRevisons()">Get All Revisions</n-button>
    <n-button @click="updateArv()">Update Arv</n-button>
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
import { ref, onBeforeMount, type Ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import sleep from '@anmiles/sleep'
import knex from 'knex'
import { querySQL } from '@/utils/cfApi'
import type { ProcessedArvData, ArvResponse } from '@/utils/mwApi'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/stores/settings'

// config i18n
let { t } = useI18n()

// config stores
let { settings } = storeToRefs(useSettingsStore())

let loading = ref(false)

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

let arvContinue: Ref<string> = ref('')
let content: Ref<ProcessedArvData[]> = ref([])
async function getAllRevisons() {
  async function query() {
    let url = new URL('/api.php', location.origin)
    url.searchParams.set('action', 'query')
    url.searchParams.set('list', 'allrevisions')
    url.searchParams.set('arvlimit', '500')
    url.searchParams.set('format', 'json')
    url.searchParams.set('arvdir', 'newer')
    url.searchParams.set('arvstart', new Date('2025-01-30T18:52:13Z').toISOString())
    url.searchParams.set(
      'arvprop',
      'ids|timestamp|flags|comment|user|contentmodel|parsedcomment|roles|sha1|size|slotsha1|slotsize|tags|userid',
    )
    arvContinue.value && url.searchParams.set('arvcontinue', arvContinue.value)
    let response = await fetch(url)
    let data = (await response.json()) as ArvResponse
    console.log(data)
    return data
  }

  let stopLoop = false
  while (stopLoop === false) {
    let data = await query()
    let allRevisions = data.query.allrevisions
    allRevisions.forEach((arv) => {
      arv.revisions.forEach((rv) => {
        content.value.push({
          pageid: arv.pageid,
          ns: arv.ns,
          title: arv.title,
          ...rv,
        })
      })
    })
    // if (data.continue) {
    //   arvContinue.value = data.continue.arvcontinue
    // } else {
    //   stopLoop = true
    // }
    stopLoop = true
    await sleep(100)
    console.log(content.value.length)
  }
}

async function updateArv() {
  // func
  function genURL(arvContinue: string): URL {
    let url = new URL('/api.php', location.origin)
    url.searchParams.set('action', 'query')
    url.searchParams.set('list', 'allrevisions')
    url.searchParams.set('arvlimit', '500')
    url.searchParams.set('format', 'json')
    url.searchParams.set('arvdir', 'newer')
    url.searchParams.set('arvstart', startFrom)
    url.searchParams.set(
      'arvprop',
      'ids|timestamp|flags|comment|user|contentmodel|parsedcomment|roles|sha1|size|slotsha1|slotsize|tags|userid',
    )
    arvContinue && url.searchParams.set('arvcontinue', arvContinue)
    return url
  }
  async function getData(url: URL): Promise<ArvResponse> {
    let response = await fetch(url)
    let data = (await response.json()) as ArvResponse
    console.log(data)
    return data
  }
  function processData(data: ArvResponse): ProcessedArvData[] {
    let result: ProcessedArvData[] = []
    let allRevisions = data.query.allrevisions
    allRevisions.forEach((arv) => {
      arv.revisions.forEach((rv) => {
        result.push({
          pageid: arv.pageid,
          ns: arv.ns,
          title: arv.title,
          ...rv,
        })
      })
    })
    return result
  }

  // fetch data
  let startFrom = (await querySQL('SELECT * FROM Arv ORDER BY `timestamp` DESC LIMIT 1;'))[0]
    .timestamp
  let res: ProcessedArvData[] = []
  let arvContinue = ''
  while (true) {
    let url = genURL(arvContinue)
    console.log('url', url)
    let data = await getData(url)
    console.log('data', data)
    let processedData = processData(data)
    res.push(...processedData)
    if (data.continue) {
      arvContinue = data.continue.arvcontinue
    } else {
      break
    }
  }
  res = res.sort((a, b) => {
    return a.revid - b.revid
  })
  res.shift() // remove res[0] for it's duplicated
  console.log('res', res)

  // upload data
  let db = knex({
    client: 'mssql',
    useNullAsDefault: true,
  })
  let batchSize = 32
  for (let i = 0; i < res.length; i += batchSize) {
    let batch = res.slice(i, i + batchSize)
    let batchWithoutObj: Record<string, string | number>[] = []
    // convert objects to stringified json
    for (let j = 0; j < batch.length; j++) {
      let keys: (keyof ProcessedArvData)[] = Object.keys(batch[j]) as (keyof ProcessedArvData)[]
      batchWithoutObj[j] = {}
      for (let key of keys) {
        if (typeof batch[j][key] === 'object') {
          batchWithoutObj[j][key] = JSON.stringify(batch[j][key])
        } else {
          // @ts-ignore
          batchWithoutObj[j][key] = batch[j][key]
        }
      }
    }
    console.log('batch', batch)
    console.log('batchWithoutObj', batchWithoutObj)
    let query = db('Arv').insert(batchWithoutObj).toString()
    console.log('sql', query)
    let a = await querySQL(query, settings.value.cfToken)
    console.log(a)
  }
}
</script>

<style scoped></style>
