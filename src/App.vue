<script lang="ts" setup>
import { darkTheme, deDE, dateDeDE } from "naive-ui";
</script>

<template>
  <n-config-provider :theme="darkTheme" :locale="deDE" :date-Locale="dateDeDE">
    <n-card>
      <!-- 卡片左上角：返回按钮和标题 -->
      <template #header>
        <n-space style="align-items: center">
          <n-button quaternary circle @click="$router.back()">
            <template #icon>
              <material-symbol> arrow_back </material-symbol>
            </template>
          </n-button>
          <n-ellipsis> {{ $route.params.fileName || $route.name }} </n-ellipsis>
        </n-space>
      </template>

      <!-- 卡片右上角按钮：设置 -->
      <template #header-extra>
        <n-button quaternary circle @click="$router.push('settings')">
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
