<script lang="ts" setup>
import { darkTheme } from "naive-ui";
import { ref } from "vue";
import { useLocalesStore } from "@/stores/locales";
import { useSettingsStore } from "@/stores/settings";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

let dev = ref(import.meta.env.DEV);

let { t } = useI18n();

let { langPackNaiveUI } = storeToRefs(useLocalesStore());
let { globalLoading } = storeToRefs(useSettingsStore());
</script>

<template>
  <n-config-provider
    :theme="darkTheme"
    :locale="langPackNaiveUI.locale"
    :dateLocale="langPackNaiveUI.dateLocale"
  >
    <n-spin :show="globalLoading">
      <n-card>
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
            <n-tag v-if="dev">{{ t("dev-tag") }}</n-tag>
            <n-ellipsis>
              {{
                $route.params.fileName || t(`${$route.name?.toString()}.title`)
              }}
            </n-ellipsis>
          </n-space>
        </template>

        <!-- 卡片右上角按钮：设置 -->
        <template #header-extra v-if="$route.name !== 'settings'">
          <n-button quaternary circle @click="$router.push('/settings')">
            <template #icon>
              <material-symbol> settings </material-symbol>
            </template>
          </n-button>
        </template>

        <!-- 卡片主体部分：路由 -->
        <template #default>
          <router-view v-slot="{ Component }">
            <keep-alive include="file-manager">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </template>
      </n-card>
    </n-spin>

    <!-- global modal -->
    <global-modal />
  </n-config-provider>
</template>

<style>
header#firstHeading {
  display: none;
}
</style>
