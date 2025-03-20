<template>
  <n-flex vertical>
    <n-empty :description="t(`miui-themes.step1-login-desc`)">
      <template #icon>
        <n-spin :show="loading"><github /></n-spin>
      </template>
      <template #extra>
        <n-button :disabled="loading" @click="login">{{
          t('miui-themes.step1-btn-login')
        }}</n-button>
      </template>
    </n-empty>
  </n-flex>
</template>

<script setup lang="ts">
import { Github } from '@vicons/fa'
import { onMounted, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

let emits = defineEmits(['next'])
let serverlessURL = 'https://r-drive.24218079.xyz/'
let { settings } = storeToRefs(useSettingsStore())
let loading = ref(true)

async function login() {
  let url = new URL(serverlessURL + 'login')
  url.searchParams.set('redirect_uri', location.href)
  url.searchParams.set('scope', 'public_repo')
  location.href = url.href
}

onMounted(async () => {
  try {
    // check if `access_token` is returned from GitHub
    let accessToken = new URLSearchParams(location.search).get('access_token')
    if (accessToken) {
      settings.value.ghToken = accessToken
      location.href = (() => {
        const url = new URL(location.href)
        url.searchParams.delete('access_token')
        return url.href
      })()
    }

    // check if user is already logged in
    if (settings.value.ghToken) {
      let res = await (
        await fetch('https://api.github.com/repos/XYY-huijiwiki/MIUI-theme', {
          headers: {
            Authorization: `bearer ${settings.value.ghToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        })
      ).json()
      console.log(res)
      if (res.status === '401') {
        // bad credentials
        settings.value.ghToken = ''
      } else if (res.permissions?.admin) {
        loading.value = false
        emits('next')
        return
      } else {
        $dialog.warning({
          autoFocus: false,
          title: t('miui-themes.step1-permission-denied-title'),
          content: t('miui-themes.step1-permission-denied-content'),
        })
      }

      loading.value = false
      return
    }

    // not logged in
    loading.value = false
  } catch (error) {
    $notification.error({
      title: t('general.error'),
      content: `${error}`,
      meta: new Date().toLocaleString(),
    })
  }
})
</script>

<style scoped></style>
