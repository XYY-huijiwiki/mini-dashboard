<template>
  <n-space verticle>
    <n-timeline :icon-size="24">
      <n-timeline-item v-for="(revision, index) in arvData" :key="index">
        <template #icon>
          <material-symbol :size="16">difference</material-symbol>
        </template>
        <template #header>
          <n-a @click="openDiff(revision.revid)"> #{{ revision.revid }} </n-a>
          |
          <n-a :href="`/p/${revision.pageid}`" target="_blank">
            {{ revision.title }}
          </n-a>
        </template>
        <template #default>
          <n-space>
            <n-tag v-for="tag in revision.tags" :key="tag" size="small">
              {{ tag }}
            </n-tag>
          </n-space>
          {{ revision.comment }}
        </template>
        <template #footer>
          {{ dayjs(revision.timestamp).format('YYYY-MM-DD HH:mm:ss') }} by
          {{ revision.user }}
        </template>
      </n-timeline-item>
    </n-timeline>
    <n-button @click="loadRevisions()">Load Revisions</n-button>
  </n-space>
</template>

<script setup lang="ts">
/*
 * In this file, "arv-" stands for "all revisions"
 */
import { ref, onBeforeMount, type Ref } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

// configure i18n
const { t } = useI18n()

type ArvResponse = {
  batchcomplete: string
  continue: {
    arvcontinue: string
    continue: string
  }
  query: {
    allrevisions: {
      ns: number
      pageid: number
      title: string
      revisions: {
        revid: number
        parentid: number
        user: string
        timestamp: string
        comment: string
        tags?: string[]
      }[]
    }[]
  }
}
type ArvData = {
  ns: number
  pageid: number
  title: string
  revid: number
  parentid: number
  user: string
  timestamp: string
  comment: string
  tags?: string[]
}[]

let arvData: Ref<undefined | ArvData> = ref()
let arvContinue: Ref<string> = ref('')
async function loadRevisions() {
  // fetch the data
  let fetchParams = {
    action: 'query',
    list: 'allrevisions',
    arvlimit: '500',
    format: 'json',
    arvprop: 'ids|timestamp|flags|comment|user|tags',
    arvcontinue: '',
  }
  arvContinue.value && (fetchParams = { ...fetchParams, arvcontinue: arvContinue.value })
  let response = await fetch(`/api.php?${new URLSearchParams(fetchParams).toString()}`)
  let data: ArvResponse = await response.json()
  console.log(data)
  // process the data
  let processedData = []
  for (let page of data.query.allrevisions) {
    for (let rev of page.revisions) {
      processedData.push({
        ns: page.ns,
        pageid: page.pageid,
        title: page.title,
        revid: rev.revid,
        parentid: rev.parentid,
        user: rev.user,
        timestamp: rev.timestamp,
        comment: rev.comment,
        tags: rev.tags,
      })
    }
  }
  arvData.value && (processedData = arvData.value.concat(processedData))
  processedData.sort((a, b) => (a.revid > b.revid ? -1 : 1))
  // update the refs
  arvData.value = processedData
  arvContinue.value = data.continue?.arvcontinue
  // log (dev only)
  import.meta.env.DEV && console.log('arvData', arvData.value)
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
