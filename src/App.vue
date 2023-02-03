<script setup>
import { ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import sleep from 'await-sleep';

var fileExtList = ref(['.mp3', '.mid']);
var fileSource = ref('');
var loading = ref(false);
let fileList;
async function uploader() {
  loading.value = true;
  for (let index in fileList) {
    let file = fileList[index];
    let reader = new FileReader();
    reader.readAsDataURL(file['file']);
    reader.onload = async (ev) => {
      let fileName = file['name'];
      let fileContent = ev.target?.result;

      // 如果编码后超过2MB
      if (fileContent?.length > 1024 * 1024 * 2) {
        $message.error(`文件 ${fileName} 超过1.5MB`);
        console.log(`文件 ${fileName} 超过1.5MB`);
        return;
      }

      // 如果是mid文件
      if ((fileName.split('.').reverse())[0] === 'mid') {
        fileContent = fileContent.replace(
          'data:application/octet-stream;base64,',
          'data:audio/midi;base64,'
        );
      }

      let fileSourceStr = fileSource.value ? `\n{{文件来源|${fileSource.value}}}` : '';

      // 测试用
      // console.log(`file`);
      // console.log(file);
      // console.log(`fileName`);
      // console.log(fileName);
      // console.log(`fileContent`);
      // console.log(fileContent);
      // console.log(`fileSourceStr`);
      // console.log(fileSourceStr);
      // return;

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
            '{{Base64}}\n{{合理使用}}' + fileSourceStr,
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

    // for循环最后暂停1秒钟
    await sleep(1000);

  }

  loading.value = false;

}
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-card title="上传特殊文件">
      <!-- 上传区域 -->
      <n-space vertical>
        <n-upload accept="{{ fileExtList.join(',') }}" :default-upload="false" :multiple="true"
          v-model:file-list="fileList">
          <n-upload-dragger>
            <div style="margin-bottom: 12px">
              <n-icon size="48" :depth="3">
                <archive-icon />
              </n-icon>
            </div>
            <n-text style="font-size: 16px">
              点击或者拖动文件到该区域来上传
            </n-text>
            <n-p>目前支持上传的文件类型有：{{ fileExtList.join(' ') }}</n-p>
          </n-upload-dragger>
        </n-upload>
        <!-- 上传按钮 -->
        <n-input-group>
          <n-input placeholder="文件来源" v-model:value="fileSource" />
          <n-button @click="uploader()" :loading="loading">上传文件</n-button>
        </n-input-group>
      </n-space>

      <!-- 说明区域 -->
      <n-h2>使用说明</n-h2>
      <n-ul>
        <n-li>单个文件的大小不能超过1.5MB（实际存在一点误差）。</n-li>
        <n-li>上传完成一次后需要刷新页面才能再次上传。</n-li>
        <n-li>最好填写文件来源。文件来源不尽相同的时候需要一个一个上传、一个一个填写。</n-li>
        <n-li>如果要上传的文件格式是 png，jpg，jpeg，gif，svg，webm，ogg，ttf 中的一种，请<n-a href="https://xyy.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6" target="blank">点击这里</n-a>上传。</n-li>
      </n-ul>

      <all-file></all-file>

      <template #action>
        <n-space justify="end">
          <n-a href="https://github.com/XYY-huijiwiki/Base64-file-uploader" target="blank">Github</n-a>
        </n-space>
      </template>

    </n-card>
  </n-config-provider>
</template>
