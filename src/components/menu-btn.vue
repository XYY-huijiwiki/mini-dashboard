<script lang="ts" setup>
import { ref } from "vue";
import type { Ref } from "vue";
import type { MenuOption } from "naive-ui";
import message from "@/ts/message";

// 导入props
const props = defineProps({
  input: {
    type: String,
    required: true,
  },
});

// 定义一些变量
let showModal = ref(false);
let moveTo = ref(props.input);

// 定义菜单的内容
let options: Ref<Array<MenuOption>> = ref([
  {
    label: "移动（重命名）",
    key: "move",
  },
  {
    label: "删除",
    key: "delete?",
    children: [
      {
        label: "确认删除",
        key: "delete",
        props: { style: { color: "#e88080" } },
      },
    ],
  },
]);

// 处理菜单选项
function handleSelect(key: String) {
  key === "delete"
    ? deleteFile()
    : key === "move"
    ? (showModal.value = true)
    : message.error(`未知错误（handleSelect(${key}）`);
}

// 删除功能
async function deleteFile() {
  message.loading("正在删除……");
  let ok = true;

  for (let index = -1; ; index++) {
    try {
      await new mw.Api().postWithToken("csrf", {
        action: "delete",
        title: index === -1 ? props.input : props.input + "/" + index,
        tags: "Base64文件变更",
        deletetalk: true,
      });
    } catch (error) {
      if (error === "missingtitle") {
        message.error("文件不存在");
      } else {
        message.error(`未知错误（${error}）`);
      }
      ok = false;
      break;
    }
  }

  if (!ok) return;
  message.success("删除完成");
}

// 移动功能
async function moveFile() {
  // 检查文件移动前后是否同名
  if (props.input === moveTo.value) {
    message.error("文件名不能和原来的相同");
    return;
  }

  // 检查文件后缀名是否发生改变
  let orgFileExt = props.input.split(".").reverse()[0];
  let newFileExt = moveTo.value.split(".").reverse()[0];
  if (orgFileExt !== newFileExt) {
    message.error(`文件后缀名（${orgFileExt}）不得发生改变`);
    return;
  }

  message.loading("正在移动……");

  try {
    let msg = await new mw.Api().postWithToken("csrf", {
      action: "move",
      from: props.input,
      to: moveTo.value,
      tags: "Base64文件变更",
      movetalk: true,
      movesubpages: true,
      noredirect: true,
    });
    message.success("文件移动成功");
    message.info("刷新页面后文件列表才会更新");
    console.log(msg);
  } catch (error) {
    message.error("文件移动失败，未知错误");
    console.log(error);
  }

  showModal.value = false;
}
</script>

<template>
  <div>
    <!-- 按钮组 -->
    <n-button-group>
      <n-button
        tertiary
        tag="a"
        :href="`https://xyy.huijiwiki.com/wiki/${input}`"
        target="_blank"
        >查看</n-button
      >
      <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button tertiary>
          <MaterialSymbol>more_vert</MaterialSymbol>
        </n-button>
      </n-dropdown>
    </n-button-group>

    <!-- 移动页面的模态框 -->
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :showIcon="false"
      :autoFocus="false"
    >
      <template #header>
        <div>移动至？（重命名为？）</div>
      </template>
      <n-input-group>
        <n-input v-model:value="moveTo"></n-input>
        <n-button @click="moveFile()">确定</n-button>
      </n-input-group>
    </n-modal>
  </div>
</template>
