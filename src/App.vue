<script setup>
import { ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
// import { encode, decode } from 'js-base64';
import sleep from 'await-sleep';

var loading = ref(false);
let fileList;
async function uploader() {
  loading.value = true;
  for (let file in fileList) {
    await sleep(1000);
    let reader = new FileReader();
    reader.readAsDataURL(fileList[file]['file']);
    reader.onload = async (ev) => {
      let fileName = fileList[file]['name'];
      let fileContent = ev.target?.result;
      if (fileContent?.length > 1024 * 1024 * 2) {
        loading.value = false;
        $message.error(`文件 ${fileName} 超过1.5MB`);
        console.log(`文件 ${fileName} 超过1.5MB`);
        return;
      }
      // console.log(fileName);
      // console.log(fileContent);

      try {
        await new mw.Api()
          .create(
            `文件:${fileName}/0`,
            { summary: 'Base64编码文件内容' },
            fileContent,
          )
          .done(function () {
            $message.success(`${fileName} 已上传50%`);
          });

        await new mw.Api()
          .create(
            `文件:${fileName}`,
            { summary: 'Base64编码文件页面' },
            '{{Base64}}\n{{合理使用}}',
          )
          .done(function () {
            $message.success(`${fileName} 上传成功`);
          });
      } catch (err) {
        $message.error(`未知错误`);
        console.log(`未知错误`);
        console.error(`err`);
      }

    };

  }

  loading.value = false;

}
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-card title="上传特殊文件">

      <!-- 上传区域 -->
      <n-upload accept=".mp3" :default-upload="false" :multiple="true" v-model:file-list="fileList">
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
