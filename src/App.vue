<template>
  <n-config-provider :theme="darkTheme">
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
        <n-tab-pane name="manager" display-directive="show:lazy" tab="文件管理">
          <all-file></all-file>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </n-config-provider>
</template>

<script lang="ts" setup>
import { darkTheme, type DropdownOption } from "naive-ui";
import { ref, h, defineAsyncComponent } from "vue";
import type { Ref, Component } from "vue";
import materialSymbol from "./components/material-symbol.vue";
import loadingComponent from "./components/loading.vue";

function createAsyncComponent(componentName: string) {
  return defineAsyncComponent({
    loader: () => import(`./components/${componentName}.vue`),
    loadingComponent,
  });
}

const Uploader = createAsyncComponent("uploader");
const AllFile = createAsyncComponent("all-file");
const Setting = createAsyncComponent("setting");
const About = createAsyncComponent("about");

const activeTab = ref("uploader");

// 创建变量
const showModal = ref(false);
const modalTitle = ref("");
const modalComponent: Ref<Component> = ref({});

// 生成菜单图标
function iconRender(name: string) {
  return () => {
    return h(materialSymbol, { style: { fontSize: "1.5em" } }, name);
  };
}

// 菜单
const mainMenu = ref([
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
async function handleSelect(key: string | number, option: DropdownOption) {
  switch (key) {
    case "setting":
      // 动态导入vue组件
      modalComponent.value = Setting;
      // 设置模态框标题
      modalTitle.value = <string>option.label;
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
      modalTitle.value = <string>option.label;
      // 显示模态框
      showModal.value = true;
      break;
    default:
      break;
  }
}
</script>
