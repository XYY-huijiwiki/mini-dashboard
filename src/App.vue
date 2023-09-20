<script lang="ts" setup>
import { darkTheme, type DropdownOption } from "naive-ui";
import { ref, h, defineAsyncComponent } from "vue";
import type { Ref, Component } from "vue";
import materialSymbol from "./components/material-symbol.vue";
import loadingComponent from "./views/loading-view.vue";
import huijiApiWrap from "./components/huiji-api-wrap.vue";
import {} from "naive-ui";

// define dev mode
let debug = ref(import.meta.env.DEV);

function createAsyncComponent(componentName: string) {
  return defineAsyncComponent({
    loader: () => import(`./views/${componentName}.vue`),
    loadingComponent,
  });
}

const Uploader = createAsyncComponent("file-uploader");
const AllFile = createAsyncComponent("file-manager");
const Setting = createAsyncComponent("setting-view");
const About = createAsyncComponent("about-view");

const activeTab = ref("uploader");

// 创建变量
const showModal = ref(false);
const modalTitle: Ref<string> = ref("");
const modalComponent: Ref<Component> = ref({});

// 生成菜单图标
function iconRender(name: string) {
  return () => {
    return h(materialSymbol, { style: { fontSize: "1.5em" } }, name);
  };
}

// 菜单
const mainMenu: Ref<DropdownOption[]> = ref([
  {
    label: "设置",
    key: "setting",
    icon: iconRender("settings"),
    disabled: true,
  },
  {
    label: "关于",
    key: "about",
    icon: iconRender("info"),
    disabled: true,
  },
  {
    label: "刷新",
    key: "refresh",
    icon: iconRender("refresh"),
  },
]);

// 处理菜单点击事件
function handleSelect(key: string | number): void {
  switch (key) {
    case "setting":
      // 动态导入vue组件
      modalComponent.value = Setting;
      // 设置模态框标题
      modalTitle.value = "设置";
      // 显示模态框
      showModal.value = true;
      break;
    case "refresh":
      location.reload();
      break;
    case "about":
      // 动态导入vue组件about
      modalComponent.value = About;
      // 设置模态框标题
      modalTitle.value = "关于";
      // 显示模态框
      showModal.value = true;
      break;
  }
}
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <component :is="debug ? huijiApiWrap : 'div'">
      <n-card title="特殊文件">
        <!-- 菜单按钮 -->
        <template #header-extra>
          <n-dropdown :options="mainMenu" @select="handleSelect">
            <n-button circle quaternary>
              <template #icon>
                <materialSymbol>more_horiz</materialSymbol>
              </template>
            </n-button>
          </n-dropdown>
        </template>

        <!-- 内容根据dropdown动态加载组件的模态框 -->
        <n-modal
          v-model:show="showModal"
          :title="modalTitle"
          style="max-width: 720px"
          preset="card"
          :auto-focus="false"
        >
          <component :is="modalComponent" />
        </n-modal>

        <n-tabs v-model:value="activeTab" default-value="uploader" animated>
          <n-tab-pane
            name="uploader"
            display-directive="show:lazy"
            tab="文件上传"
          >
            <uploader></uploader>
          </n-tab-pane>
          <n-tab-pane
            name="manager"
            display-directive="show:lazy"
            tab="文件管理"
          >
            <all-file></all-file>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </component>
  </n-config-provider>
</template>
