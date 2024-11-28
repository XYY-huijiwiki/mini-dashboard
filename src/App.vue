<script lang="ts" setup>
import { darkTheme, useOsTheme } from 'naive-ui'
import { useLocalesStore } from '@/stores/locales'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useFullscreen } from '@vueuse/core'

let fullscreenHTML = ref<HTMLElement>()
const { isFullscreen, toggle } = useFullscreen(fullscreenHTML)

let dev = import.meta.env.DEV

let { t } = useI18n()

let theme = computed(() => (useOsTheme().value === 'dark' ? darkTheme : null))
let { langPackNaiveUI } = storeToRefs(useLocalesStore())
let { globalLoading } = storeToRefs(useSettingsStore())
</script>

<template>
  <n-config-provider
    :theme="theme"
    :locale="langPackNaiveUI.locale"
    :dateLocale="langPackNaiveUI.dateLocale"
  >
    <n-spin :show="globalLoading">
      <n-card ref="fullscreenHTML" content-class="shrink-0 h-0 max-h-screen">
        <!-- 卡片左上角：返回按钮和标题 -->
        <template #header>
          <n-space align="center" :wrap="false" :wrap-item="false">
            <n-button
              quaternary
              circle
              @click="$router.push({ name: 'home' })"
              v-if="$route.name !== 'home'"
            >
              <template #icon>
                <material-symbol> home </material-symbol>
              </template>
            </n-button>
            <n-tag v-if="dev">{{ t('dev-tag') }}</n-tag>
            <n-ellipsis>
              {{ $route.params.fileName || t(`${$route.name?.toString()}.title`) }}
            </n-ellipsis>
          </n-space>
        </template>

        <!-- 卡片右上角按钮：全屏、设置 -->
        <template #header-extra>
          <n-button quaternary circle @click="toggle">
            <template #icon>
              <material-symbol>
                {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
              </material-symbol>
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            @click="$router.push('/settings')"
            v-if="$route.name !== 'settings'"
          >
            <template #icon>
              <material-symbol> settings </material-symbol>
            </template>
          </n-button>
        </template>

        <!-- 卡片主体部分：路由 -->
        <template #default>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </template>
      </n-card>
    </n-spin>

    <!-- global modal -->
    <global-modal />
  </n-config-provider>
</template>
