<script setup>
import { ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
// import { encode, decode } from 'js-base64';
// import sleep from 'await-sleep'

var loading = ref(false);
let file;
async function uploader() {
  loading.value = true;
  console.log(file);
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async (ev) => {
    console.log(file.name);
    let res = ev.target?.result;
    if (res?.length > 1024 * 1024 * 2) {
      loading.value = false;
      $message.error('文件超过1.5MB');
      return;
    }
    console.log(res);
    await new mw.Api()
      .create(
        `文件:${file.name}/0`,
        { summary: '以Base64编码上传新文件（1/2）' },
        res,
      )
      .done(function () {
        $message.success('上传成功');
      })
      .fail(function () {
        $message.error('上传失败，未知错误');
      });

    await new mw.Api()
      .create(
        `文件:${file.name}`,
        { summary: '以Base64编码上传新文件（2/2）' },
        '{{Base64}}\n{{合理使用}}',
      )
      .done(function () {
        $message.success('文件页面更新成功');
      })
      .fail(function () {
        $message.error('文件页面更新失败，未知错误');
      });

    loading.value = false;
  };
}
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-card title="上传特殊文件">

      <!-- 上传区域 -->
      <n-upload :max="1" accept=".mp3" :default-upload="false"
        :on-change="(UploadFileInfo) => { file = UploadFileInfo.file.file }">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <n-icon size="48" :depth="3">
              <archive-icon />
            </n-icon>
          </div>
          <n-text style="font-size: 16px">
            点击或者拖动文件到该区域来上传
          </n-text>
          <n-p>目前只支持mp3文件</n-p>
        </n-upload-dragger>
      </n-upload>

      <!-- 按钮区域 -->
      <n-button @click="uploader()" :loading="loading">上传文件</n-button>

      <!-- 说明区域 -->
      <n-h2>使用说明</n-h2>
      <n-p>待更新……</n-p>

      <template #action>
        <n-space justify="end">
          <n-a href="https://github.com/XYY-huiji-wiki/Base64-file-uploader">Github</n-a>
        </n-space>
      </template>

    </n-card>
  </n-config-provider>
</template>
