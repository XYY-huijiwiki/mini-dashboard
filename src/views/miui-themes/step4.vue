<template>
  <n-flex vertical>
    <n-progress
      type="circle"
      :percentage="Math.min(Math.ceil(submitPercentage), 100)"
      :status="submitStatus"
      class="mx-auto"
    />
  </n-flex>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Octokit } from 'octokit'
import sleep from '@anmiles/sleep'
import { storeToRefs } from 'pinia'
import { fileToBase64 } from 'file64'
import jsSHA from 'jssha'
import { useSettingsStore } from '@/stores/settings'
import type { Result } from './index'
import { uploadFile, editPage } from '@/utils/mwApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let { settings } = storeToRefs(useSettingsStore())
let { result } = defineProps<{ result: Result }>()
let loading = ref(true)
let emits = defineEmits(['prev'])
onMounted(() => {
  submitInfo()
})

/* ==================
    submit info
   ================== */
let submitPercentage = ref(0)
let submitStatus = ref('default')
async function submitInfo() {
  try {
    function err() {
      submitStatus.value = 'error'
      loading.value = false
      throw new Error('提交失败')
    }
    function success() {
      submitPercentage.value += progressChunk
    }

    let themeJson = result.themeJson
    let files = [result.files.dateImg, result.files.squareImg, ...result.files.previews].filter(
      Boolean,
    )
    let progressChunk = 100 / (files.length + 4)
    for (let index = 0; index < files.length; index++) {
      const element = files[index]
      console.log(element)
      ;(await uploadFile(element as File, `{{合理使用}}`)) ? success() : err()
    }
    ;(await editPage({
      title: `Data:${themeJson.主题名称}.json`,
      text: JSON.stringify(themeJson),
    }))
      ? success()
      : err()
    ;(await editPage({
      title: `${themeJson.主题名称}`,
      text: `{{小米主题}}`,
    }))
      ? success()
      : err()

    let token = settings.value.ghToken
    let owner = 'XYY-huijiwiki'
    let repo = 'MIUI-theme'
    let path = `mtz/${themeJson.发布日期} ${themeJson.主题名称}.mtz`
    let message = `upload ${themeJson.发布日期} ${themeJson.主题名称}.mtz`
    let content = (await fileToBase64(result.files.mtz)).split(',')[1]
    let shaObj = new jsSHA('SHA-1', 'B64')
    shaObj.update(content)
    let sha = shaObj.getHash('HEX')
    success()

    let octokit = new Octokit({ auth: token })
    let octokitRes = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      path,
      sha,
      message,
      content,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })
    octokitRes.status === 201 ? success() : err()

    await sleep(500)
    submitStatus.value = 'success'
  } catch (error) {
    $notification.error({
      title: t('general.error'),
      content: `${error}`,
    })
    console.error(error)
    submitStatus.value = 'error'
    loading.value = false
  }
}
</script>

<style></style>
