<template>
  <n-flex vertical>
    <n-form>
      <n-form-item :label="t('miui-themes.step2-label-theme-link')" show-require-mark>
        <n-input-group>
          <n-input v-model:value="themeInput.link" :disabled="loading" />
          <n-button @click="getDownloadLink" :disabled="loading || !themeInput.link">
            {{ t('miui-themes.step2-btn-get-download-link') }}
          </n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item :label="t('miui-themes.step2-label-download-link')" show-require-mark>
        <n-input v-model:value="themeInput.downloadLink" :disabled="loading" />
      </n-form-item>
      <n-form-item :label="t('miui-themes.step2-label-release-date')">
        <n-date-picker v-model:value="themeInput.date" type="date" :disabled="loading" />
      </n-form-item>
      <n-form-item :label="t('miui-themes.step2-label-date-screenshot')">
        <n-flex :align="`center`">
          <n-button @click="openFile" :disabled="loading">
            {{ t('miui-themes.step2-btn-upload-date-screenshot') }}
          </n-button>
          <div>
            {{
              themeInput.dateImg
                ? t('miui-themes.step2-selected-file', [themeInput.dateImg.name])
                : t('miui-themes.step2-no-file-selected')
            }}
          </div>
        </n-flex>
      </n-form-item>
      <n-form-item :label="t('miui-themes.step2-label-trivia')">
        <n-input v-model:value="themeInput.trivia" :disabled="loading" />
      </n-form-item>
    </n-form>
    <n-flex justify="end">
      <n-button
        type="primary"
        @click="clickNext"
        :loading="loading"
        :disabled="!themeInput.link || !themeInput.downloadLink"
      >
        {{ t('miui-themes.btn-next-step') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
// Third-party library imports
import dayjs from 'dayjs'
import dayjsUTC from 'dayjs/plugin/utc'
import jszip from 'jszip'
import { xml2json } from 'xml-js'
import { useFileDialog } from '@vueuse/core'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Local imports
import { getMTZFile, cleanURL } from './index'
import type { Result } from './index'

const { t } = useI18n()

dayjs.extend(dayjsUTC)

let emits = defineEmits<{
  next: []
  prev: []
  'update-result': [Result]
}>()
let loading = ref(false)
type ThemeInput = {
  downloadLink: string | undefined
  link: string | undefined
  date: number | undefined
  dateImg: File | undefined
  trivia: string | undefined
}
let themeInput: Ref<ThemeInput> = ref({
  downloadLink: undefined,
  link: undefined,
  date: undefined,
  dateImg: undefined,
  trivia: undefined,
})
let { open: openFile, onChange: onChangeFile } = useFileDialog({
  accept: 'image/*',
})
onChangeFile((files) => {
  if (files?.length !== 1) return
  themeInput.value.dateImg = files[0]
})
function getDownloadLink() {
  let packId = new URL(cleanURL(themeInput.value.link || '')).searchParams.get('packId')
  window.open(`https://thm.market.xiaomi.com/thm/download/v2/${packId}?miuiUIVersion=100`)
}

async function clickNext() {
  try {
    loading.value = true

    /* ==================
    process input text
   ================== */
    async function getTitleAndSquareImgLink(link: string): Promise<{
      title: string
      squareImgLink: string
    }> {
      let packID = new URL(link).searchParams.get('packId')
      if (!packID) {
        throw new Error('主题链接格式错误')
      }
      let res = (await (
        await fetch(`${corsProxy}https://zhuti.xiaomi.com/thm/share/picture/${packID}`)
      ).json()) as {
        downloadUrl: string
        name: string
      }
      return {
        title: res.name,
        squareImgLink: res.downloadUrl,
      }
    }
    let corsProxy = 'https://cors-proxy.24218079.xyz/'
    let link = cleanURL(themeInput.value.link || '')
    let url = new URL(link)
    url.searchParams.delete('miref')
    let 主题链接 = url.href
    let { title, squareImgLink } = await getTitleAndSquareImgLink(link)
    let 主题名称 = title
    let squareImg = new File(
      [await (await fetch(corsProxy + squareImgLink)).blob()],
      `小米主题 ${title}.png`,
    )
    let 你知道咩 = themeInput.value.trivia || ''

    /* ==================
    process .mtz file
   ================== */
    let downloadLink = cleanURL(themeInput.value.downloadLink || '')
    let mtz = await getMTZFile(downloadLink, title)
    // read zip file
    let zipObj = await jszip.loadAsync(mtz)
    // get info
    let xmlFile = zipObj.file('description.xml')
    if (!xmlFile) throw new Error('description.xml不存在')
    let 发布日期 = themeInput.value.date
      ? dayjs(themeInput.value.date).format('YYYY-MM-DD')
      : dayjs(xmlFile.date).utc().format('YYYY-MM-DD')
    let description_xml = await xmlFile.async('string')
    let description_json = JSON.parse(xml2json(description_xml, { compact: true }))
    let 主题作者 = description_json.theme.designer._cdata.trim()
    let 主题介绍 = description_json.theme.description._cdata.trim().replace(/[\r\n]{1,2}/g, '<br/>')
    // get imgs
    let allFiles = Object.keys(zipObj.files)
    let imgs_list = allFiles.filter((file) => file.startsWith('preview/'))
    imgs_list.forEach((element, index) => {
      imgs_list[index] = element.slice(8)
    })
    imgs_list = imgs_list.filter((img) => img !== '')
    let 主题预览 = imgs_list.sort()
    let previews = await Promise.all(
      imgs_list.map(async (img) => {
        let blob = await zipObj.file(`preview/${img}`)?.async('blob')
        return blob ? new File([blob], `小米主题 ${主题名称} ${img}`) : undefined
      }),
    ).then((files) => files.filter((file) => file !== undefined))

    /* ==================
    process date image
   ================== */
    let dateImg: File | undefined
    if (themeInput.value.date) {
      if (!themeInput.value.dateImg) {
        throw new Error('手动输入日期时，需要提供日期截图')
      }
      dateImg = new File([themeInput.value.dateImg], `小米主题 ${主题名称} 发布日期截图.jpg`)
    }

    /* ==================
    result
   ================== */
    emits('update-result', {
      themeJson: {
        _hjschema: '小米主题',
        主题名称,
        发布日期,
        主题作者,
        主题链接,
        主题介绍,
        主题预览,
        你知道咩,
      },
      files: {
        mtz,
        dateImg,
        squareImg,
        previews,
      },
    })

    loading.value = false
    emits('next')
  } catch (error) {
    loading.value = false
    $notification.error({
      title: t('general.error'),
      content: `${error}`,
    })
  }
}
</script>

<style scoped></style>
