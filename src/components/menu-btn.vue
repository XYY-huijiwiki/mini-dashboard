<script lang="ts" setup>
import { ref, computed, h, type Ref } from "vue";
import { type MenuOption } from "naive-ui";
import materialSymbol from "@/components/material-symbol.vue";
import { getPage } from "@/utils/mwApi/index";
import { useRouter } from "vue-router";
import { renamePage } from "@/utils/mwApi/index";

// use router
const router = useRouter();

// import props
const props = defineProps({
  fulltext: {
    type: String,
    required: true,
  },
});

// rename function
let showRenameDialog = ref(false);
// props.fulltext is designed to be immutable, so we disable eslint here
// eslint-disable-next-line vue/no-setup-props-destructure
let fulltext = ref(props.fulltext);
let filePrefix = ref(fulltext.value.split(":")[0]);
let fileName = ref(
  fulltext.value
    .replace(filePrefix.value + ":", "")
    .split(".")
    .slice(0, -1)
    .join(".")
);
let fileExt = ref(fulltext.value.split(".").slice(-1)[0]);
let newName = computed(
  () => `${filePrefix.value}:${fileName.value}.${fileExt.value}`
);
let renameLoading = ref(false);
async function rename() {
  renameLoading.value = true;
  await renamePage(props.fulltext, newName.value);
  renameLoading.value = false;
  showRenameDialog.value = false;
}

// info function
let showInfoDrawer = ref(false);

// 定义菜单的内容
let options: Ref<MenuOption[]> = ref([
  {
    label: "预览",
    icon: () => h(materialSymbol, { size: 20 }, "visibility"),
    key: "preview",
  },
  {
    label: "复制链接",
    icon: () => h(materialSymbol, { size: 20 }, "link"),
    key: "copyLink",
  },
  {
    label: "重命名",
    icon: () => h(materialSymbol, { size: 20 }, "edit"),
    key: "rename",
    disabled: true,
  },
  {
    label: "删除",
    key: "delete",
    icon: () => h(materialSymbol, { size: 20 }, "delete"),
    disabled: true,
  },
  {
    label: "详细信息",
    key: "info",
    icon: () => h(materialSymbol, { size: 20 }, "info"),
    disabled: true,
  },
]);

// 处理菜单选项
async function handleSelect(key: string) {
  switch (key) {
    case "preview":
      router.push(`/preview/${fileName.value}.${fileExt.value}`);
      break;
    case "delete":
      $dialog.error({
        autoFocus: false,
        title: "删除文件",
        content: "确定要永久删除这个文件吗？",
        positiveText: "删除",
        negativeText: "取消",
        onPositiveClick: deleteFile,
      });
      break;
    case "copyLink":
      navigator.clipboard.writeText(
        encodeURI(
          `https://xyy.huijiwiki.com/p/
          ${(await getPage(props.fulltext))?.id}`
        )
      );
      $message.success("已复制到剪贴板");
      break;
    case "rename":
      showRenameDialog.value = true;
      break;
    case "info":
      showInfoDrawer.value = true;
      break;
    default:
      $message.error(`未知错误（handleSelect(${key}）`);
  }
}

// 删除功能
async function deleteFile() {
  $message.loading("正在删除……");
  let ok = true;

  for (let index = -1; ; index++) {
    try {
      await new mw.Api().postWithToken("csrf", {
        action: "delete",
        title: index === -1 ? props.fulltext : props.fulltext + "/" + index,
        tags: "Base64文件变更",
        deletetalk: true,
      });
    } catch (error) {
      if (error === "missingtitle") {
        $message.error("文件不存在");
      } else {
        $message.error(`未知错误（${error}）`);
      }
      ok = false;
      break;
    }
  }

  if (!ok) return;
  $message.success("删除完成");
}
</script>

<template>
  <div>
    <!-- 按钮组 -->
    <n-button-group>
      <n-button
        tertiary
        tag="a"
        :href="`https://xyy.huijiwiki.com/wiki/${fulltext}`"
        target="_blank"
        >查看</n-button
      >
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button tertiary>
          <MaterialSymbol>more_vert</MaterialSymbol>
        </n-button>
      </n-dropdown>
    </n-button-group>

    <!-- modal to rename file -->
    <n-modal
      v-model:show="showRenameDialog"
      preset="dialog"
      :showIcon="false"
      :autoFocus="false"
      style="width: 440px; max-width: 100%"
    >
      <!-- header -->
      <template #header>
        <div>重命名</div>
      </template>

      <!-- body (default) -->
      <template #default>
        <div
          style="display: flex; margin: 32px 0; align-items: center; gap: 4px"
        >
          <n-input v-model:value="fileName" :disabled="renameLoading" />
          <div style="text-wrap: nowrap">{{ `.${fileExt}` }}</div>
        </div>
      </template>

      <!-- footer (action) -->
      <template #action>
        <n-button :loading="renameLoading" type="primary" @click="rename()">
          确定
        </n-button>
        <n-button :disabled="renameLoading" @click="showRenameDialog = false">
          取消
        </n-button>
      </template>
    </n-modal>
  </div>
</template>
