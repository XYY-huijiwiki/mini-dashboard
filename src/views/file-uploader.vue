<script lang="ts" setup>
import { ref, onMounted, type Ref } from "vue";
import {
  type UploadFileInfo,
  type DropdownOption,
  type DropdownGroupOption,
} from "naive-ui";
import { getPage, editPage, uploadFile } from "@/utils/mwApi/index";
import fileTypeList from "@/utils/fileTypeList";
import { useI18n } from "vue-i18n";
import encodePNG from "png-chunks-encode";
import { Buffer } from "buffer";
import { fileTypeFromBuffer } from "file-type";

window.Buffer = Buffer;

const { t } = useI18n();

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
  // 如果没有写明文件来源
  if (fileSource.value === "") {
    $message.error(`请填写文件来源`);
    return;
  }

  // 开始加载状态
  loading.value = true;

  // 遍历文件列表
  for (let index in fileList.value) {
    let file = fileList.value[index];

    // 如果文件状态不是“pending”，说明之前已经尝试上传过，跳过
    if (file.status !== "pending") {
      continue;
    }

    // 如果因为未知原因file.file不存在
    if (file.file === null || file.file === undefined) {
      $message.error(`file.file不存在，未知错误`);
      file.status = "error";
      continue;
    }

    // 如果文件大小超过10MB（考虑png容器占用44字节）
    if (file.file.size > 1024 * 1024 * 10 - 44) {
      $message.error(`文件 ${file.file.name} 超过10MB`);
      file.status = "error";
      continue;
    }

    // init progress bar
    file.status = "uploading";

    // check is duplicated file name
    if (await getPage(`File:${file.name}.png`)) {
      $message.error(`文件 ${file.file.name} 名称重复`);
      file.status = "error";
      continue;
    }

    // check file type
    let fileBuffer = await file.file.arrayBuffer();
    let fileUint8Array = new Uint8Array(fileBuffer);
    let fileExt = file.file.name.split(".").pop();
    let fileType = await fileTypeFromBuffer(
      Buffer.from(fileUint8Array.slice(0, 128)),
    );
    console.log(fileType);
    if (!fileType || !fileExt) {
      $message.error(`文件 ${file.file.name} 类型未知`);
      file.status = "error";
      continue;
    } else if (fileType.ext !== fileExt) {
      $message.error(`文件 ${file.file.name} 后缀名与文件类型不匹配`);
      file.status = "error";
      continue;
    } else if (!fileExtList.value.includes(fileExt)) {
      $message.error(`文件 ${file.file.name} 类型已被禁止上传`);
      file.status = "error";
      continue;
    }
    file.percentage = 33; // progress bar 33%

    // repack file
    let pngBuffer = encodePNG([
      { name: "IHDR", data: new Uint8Array([0]) },
      { name: "IXYY", data: fileUint8Array },
      { name: "IEND", data: new Uint8Array([0]) },
    ]);
    let pngFile = new File([pngBuffer], `${file.name}.png`, {
      type: "image/png",
    });

    // get file metadata (for all file types)
    let fileMetadata: FileMetadata = {
      wiki: {
        fileSource: fileSource.value,
        fileLicense: fileLicense.value || "合理使用",
        uploader: mw.config.get("wgUserName"),
        uploadTime: new Date(),
      },
      file: {
        name: file.name,
        size: file.file.size,
        type: fileType.mime,
        lastModified: new Date(file.file.lastModified),
      },
    };

    // get file metadata (for audio only, except `audio/midi`)
    if (fileType.mime.startsWith("audio/") && fileType.mime !== "audio/midi") {
      let { parseBuffer } = await import("music-metadata-browser");
      let metadata = await parseBuffer(Buffer.from(fileBuffer), fileType.mime);
      fileMetadata.audio = metadata;
    }

    // get file metadata and poster (for video only)
    let videoPoster: string = "";
    if (fileType.mime.startsWith("video/")) {
      let { getVideoMetadata } = await import("@/utils/getVideoMetadata");
      let { poster, ...metadata } = await getVideoMetadata(file.file);
      videoPoster = poster;
      fileMetadata.video = metadata;
    }

    // init data page
    if (
      await editPage({
        title: `Data:${file.name}.json`,
        text: JSON.stringify(fileMetadata),
      })
    ) {
      file.percentage = 66; // progress bar 66%
    } else {
      file.status = "error";
      continue;
    }

    // upload poster (for video only)
    if (fileType.mime.startsWith("video/")) {
      let { base64ToFile } = await import("file64");
      let posterFile = await base64ToFile(
        videoPoster,
        `${file.name}.poster.png`,
      );
      if (await uploadFile(posterFile)) {
        file.percentage = 90; // progress bar 90%
      } else {
        file.status = "error";
        continue;
      }
    }

    // upload file
    if (
      await uploadFile(
        pngFile,
        `${
          fileType.mime.startsWith("video/")
            ? `[[文件:${file.name}.poster.png]]\n`
            : ""
        }{{特殊文件}}`,
      )
    ) {
      file.percentage = 100; // progress bar 100%
      file.status = "finished";
      file.url = `https://xyy.huijiwiki.com/wiki/Project:迷你控制中心#/preview/${file.name}`;
    } else {
      file.status = "error";
      continue;
    }
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
        :disabled="loading"
      >
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <material-symbol :size="64" style="opacity: 0.52">
              cloud_upload
            </material-symbol>
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
