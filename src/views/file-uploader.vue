<script lang="ts" setup>
import { ref, onMounted, type Ref } from "vue";
import {
  type UploadFileInfo,
  type DropdownOption,
  type DropdownGroupOption,
} from "naive-ui";
import { getPage, editPage, uploadFile } from "@/utils/mwApi/index";
import fileTypeList from "@/utils/fileTypeList";
import getVideoMetadata from "@/utils/getVideoMetadata";
import { base64ToFile, fileToBase64 } from "file64";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

console.log(t("file-uploader.label-file-source"));

// 定义一些变量
let fileSource = ref("");
let loading = ref(false);
let fileList: Ref<UploadFileInfo[]> = ref([]);
let fileExtList = ref(
  Object.values(fileTypeList)
    .map((item) => item.ext)
    .flat()
    .sort(),
);

// 获取羊羊百科授权协议列表
let fileLicense = ref(null);
let fileLicenseLaoding = ref(true);
let fileLicenseOptions: Ref<DropdownOption[] | DropdownGroupOption[]> = ref([]);
async function getLicenseList() {
  // 授权列表str转obj。代码由 New Bing 改写。
  function licenseStr2Obj(text: string): DropdownGroupOption[] {
    // 将字符串分割成行
    let lines = text.split("\n");

    // 初始化结果数组
    let result: DropdownGroupOption[] = [];

    // 遍历每一行
    for (let line of lines) {
      // 匹配以两个星号开头的行，表示子项
      if (line.startsWith("**")) {
        // 使用正则表达式提取子项内容和标签
        let match = line.match(/\*\*(.*)\|(.*)/);
        if (match) {
          // 向最后一个组中添加子项对象
          result[result.length - 1].children.push({
            label: match[2].trim(),
            value: match[1].trim(),
          });
        }
      } else if (line.startsWith("*")) {
        // 匹配以一个星号开头的行，表示组项
        // 使用正则表达式提取组项内容和标签
        let match = line.match(/\*(.*)（(.*)/);
        if (match) {
          // 向结果数组中添加组项对象，并初始化 children 数组用于存储子项对象
          result.push({
            label: match[1],
            key: match[1],
            type: "group",
            children: [],
          });
        }
      }
    }

    console.log(result);
    return result;
  }

  try {
    let rawText = (await getPage("MediaWiki:Licenses"))?.content;
    if (rawText === undefined) {
      throw new Error("获取授权协议列表失败（未知错误）");
    }
    fileLicenseOptions.value = licenseStr2Obj(await rawText);
  } catch (err) {
    $message.error(`获取授权协议列表失败（${err}）`);
  } finally {
    fileLicenseLaoding.value = false;
  }
}
onMounted(() => {
  getLicenseList();
});

// 点击上传按钮时：
async function uploader() {
  loading.value = true;

  // 第一层循环：遍历文件列表
  for (let index in fileList.value) {
    let file = fileList.value[index];

    // 如果文件状态不是“pending”，说明之前已经尝试上传过，跳过
    if (file.status !== "pending") {
      continue;
    }

    // 如果因为未知原因file.file不存在
    if (file.file === null || file.file === undefined) {
      $message.error(`file.file不存在，未知错误`);
      continue;
    }

    // 如果文件大小超过20MB
    if (file.file.size > 1024 * 1024 * 20) {
      $message.error(`文件 ${file.file.name} 超过20MB`);
      continue;
    }

    // 将file.file转换为base64编码
    let fileBase64 = await fileToBase64(file.file);

    // 将base64编码的字符串分割为2MB一份
    let fileBase64List = [];
    for (let i = 0; i < fileBase64?.length; i += 1024 * 1024 * 2) {
      fileBase64List.push(fileBase64?.slice(i, i + 1024 * 1024 * 2));
    }

    // 初始化进度条，默认进度为0
    file.status = "uploading";

    // 第二层循环：遍历分割后的base64编码字符串
    for (let index = 0; index < fileBase64List.length; index++) {
      const element = fileBase64List[index];

      // 上传base64编码的文件
      (await editPage({
        title: `Data:${file.name}/${index}`,
        text: element,
        summary: "Base64编码文件内容",
        tags: "Base64文件变更",
        createonly: true,
      }))
        ? (file.percentage = Math.ceil(
            ((index + 1) / fileBase64List.length) * 100,
          )) // 处理进度条
        : (file.status = "error");
    }

    // 如果是视频文件，上传封面及其data页面
    if (file.file.type.startsWith("video/")) {
      let Metadata = await getVideoMetadata(file.file);
      let poster = await base64ToFile(Metadata.poster, `${file.name}.png`);

      // 上传封面
      (await uploadFile(poster)) ? null : (file.status = "error");
      // 上传data页面
      let dataObj = {
        metadata: {
          duration: Metadata.duration,
          width: Metadata.width,
          height: Metadata.height,
          size: Metadata.size,
          mime: Metadata.mime,
        },
        fileSource: fileSource.value,
        fileLicense: fileLicense.value,
        base64Info: {
          size: fileBase64?.length,
          count: fileBase64List.length,
        },
        dataType: "base64",
      };
      (await editPage({
        title: `Data:${file.name}.json`,
        text: JSON.stringify(dataObj),
        summary: "Base64编码文件data页面",
        tags: "Base64文件变更",
        createonly: true,
      }))
        ? null
        : (file.status = "error");
    }

    // 更新文件页面
    (await editPage({
      title: `文件:${file.name}`,
      text: `#重定向 [[文件:${file.name}.png]]\n{{Base64}}`,
      summary: "Base64编码文件页面",
      tags: "Base64文件变更",
      createonly: true,
    }))
      ? ((file.url = `https://xyy.huijiwiki.com/wiki/文件:` + file.name),
        (file.status = "finished"))
      : (file.status = "error");
  }

  // 结束加载状态
  loading.value = false;
}
</script>

<template>
  <div>
    <!-- 上传区域 -->
    <n-space vertical>
      <n-upload
        :accept="`.${fileExtList.join(', .')}`"
        :default-upload="false"
        :multiple="true"
        v-model:file-list="fileList"
        :show-retry-button="false"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <material-symbol :size="64" style="opacity: 0.52"
              >cloud_upload</material-symbol
            >
          </div>
          <n-text :style="{ 'font-size': '16px' }">
            {{ t("file-uploader.label-drop-files-here") }}
          </n-text>
          <n-p>{{
            t("file-uploader.label-supported-file-types", [
              fileExtList.join(", "),
            ])
          }}</n-p>
        </n-upload-dragger>
      </n-upload>
      <!-- 上传按钮 -->
      <n-input-group>
        <n-input
          :placeholder="t(`file-uploader.label-file-source`)"
          v-model:value="fileSource"
        />
        <n-select
          :loading="fileLicenseLaoding"
          :placeholder="t(`file-uploader.label-file-license`)"
          v-model:value="fileLicense"
          :options="fileLicenseOptions"
        >
          <template #empty>
            <n-empty :description="t('general.loading')">
              <template #icon>
                <n-icon>
                  <material-symbol :size="32">hourglass_empty</material-symbol>
                </n-icon>
              </template>
            </n-empty>
          </template>
        </n-select>
        <n-button @click="uploader()" :loading="loading">
          {{ t("file-uploader.btn-upload") }}
        </n-button>
      </n-input-group>
    </n-space>
  </div>
</template>
