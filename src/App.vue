<script lang="ts" setup>
import {
  darkTheme,
  zhCN,
  dateZhCN,
  deDE,
  dateDeDE,
  type NDateLocale,
  type NLocale,
} from "naive-ui";
import { ref, type Ref } from "vue";
import { langCode } from "@/locales";
import { useI18n } from "vue-i18n";

let dev = ref(import.meta.env.DEV);

const { t } = useI18n();

// dynamic import language packs from naive-ui
let langPack: Ref<[NLocale | null, NDateLocale | null]> = ref([null, null]);
switch (langCode) {
  case "de":
    langPack.value = [deDE, dateDeDE];
    break;
  case "zh":
    langPack.value = [zhCN, dateZhCN];
    break;
  default:
    langPack.value = [null, null];
    break;
}
</script>

<template>
  <n-config-provider
    :theme="darkTheme"
    :locale="langPack[0]"
    :dateLocale="langPack[1]"
  >
    <n-card>
      <!-- 卡片左上角：返回按钮和标题 -->
      <template #header>
        <n-space align="center" :wrap="false" :wrap-item="false">
          <n-button quaternary circle @click="$router.back()">
            <template #icon>
              <material-symbol> arrow_back </material-symbol>
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
      <template #header-extra>
        <n-button quaternary circle @click="$router.push('/settings')">
          <template #icon>
            <material-symbol> settings </material-symbol>
          </template>
        </n-button>
      </template>

      <!-- 卡片主体部分：路由 -->
      <template #default>
        <router-view></router-view>
      </template>
    </n-card>
  </n-config-provider>
</template>
