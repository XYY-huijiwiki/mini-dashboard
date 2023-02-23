<template>
  <div>
    <!-- 上传区域 -->
    <n-space vertical>
      <n-upload :accept="fileExtList.join(',')" :default-upload="false" :multiple="true" v-model:file-list="fileList"
        :show-retry-button="false">
        <n-upload-dragger>
          <div style="margin-bottom: 12px">
            <material-symbol :size="64" style="opacity: 0.52;">cloud_upload</material-symbol>
          </div>
          <n-text :style="{ 'font-size': '16px' }">
            点击或者拖动文件到该区域来上传
          </n-text>
          <n-p>目前支持上传的文件类型有：{{ fileExtList.join(' ') }}</n-p>
        </n-upload-dragger>
      </n-upload>
      <!-- 上传按钮 -->
      <n-input-group>
        <n-input placeholder="文件来源" v-model:value="fileSource" />
        <n-select :loading="fileLicenseLaoding" placeholder="授权协议" v-model:value="fileLicense"
          :options="fileLicenseOptions" @focus="fileLicenseFocus">
          <template #empty>
            <n-empty description="正在加载">
              <template #icon>
                <n-icon>
                  <material-symbol :size="32">hourglass_empty</material-symbol>
                </n-icon>
              </template>
            </n-empty>
          </template>
        </n-select>
        <n-button @click="uploader()" :loading="loading">上传文件</n-button>
      </n-input-group>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue'
import sleep from 'await-sleep';
import type { UploadFileInfo } from 'naive-ui'

// 如果网页链接不是羊羊百科，自动进入测试模式
let isTesting = location.host === 'xyy.huijiwiki.com' ? false : true;

// 定义一些变量
let fileSource = ref('');
let loading = ref(false);
let fileList: Ref<Array<UploadFileInfo>> = ref([]);
let fileLicense = ref(null);
let fileLicenseLaoding = ref(false);
let fileLicenseOptions = ref([]);
let fileExtList = ref(['.mp3', '.mid', '.wav', '.mp4', '.webp']);

// 获取羊羊百科授权协议列表
async function fileLicenseFocus() {

  // 如果已经加载过一次了就不再加载
  if (fileLicenseOptions.value.length !== 0) { return; }

  // 打开加载动画，强制欣赏加载动画一秒钟，防止加载速度太快出现“闪屏”
  fileLicenseLaoding.value = true;
  await sleep(1000);

  // 本地测试（开始）
  await sleep(3000);
  let text = `*合理使用（这个文件受到著作权保护，但在羊羊百科属于合理使用）
** 动画截图|《喜羊羊与灰太狼》系列动画的截图
** 合理使用|其他合理使用的情况
*已获授权（这个文件受到著作权保护，著作权方已授权羊羊百科使用）
** Permission|著作权方已授权羊羊百科使用
*公有领域（这个文件属于公有领域）
** PD-textlogo|仅包含简单的几何图形与文字`;
  text = text + '\n';
  text = text.replace(/\*\*(.*)\|(.*)\n/g, `{"label":"$2","value":"$1"},`);
  console.log(text);
  text = text.replace(/\*(.*)（(.*)\n/g, `]}{"label":"$1","key":"$1","type":"group","children":[`);
  console.log(text);
  text = text.slice(2, -1).concat(']}').replace(/},]}{/g, '}]},{');
  console.log(text);
  text = '[' + text + ']';
  text = text.replace(/ /g, '');
  console.log(text);
  text = text.replace(`","value":"合理使用"`, `（默认）","value":"合理使用"`);
  console.log(text);
  fileLicenseOptions.value = JSON.parse(text);
  console.log(text);
  fileLicenseLaoding.value = false;
  // return;
  // 本地测试（结束）

  new mw.Api().postWithToken('csrf', {
    action: 'query',
    prop: 'revisions',
    titles: 'MediaWiki:Licenses',
    rvprop: 'content'
  }).fail((err: any) => {
    console.log(err);
  }).done((msg: any) => {
    let text = msg.query.pages[188].revisions[0]['*'];
    text = text + '\n';
    text = text.replace(/\*\*(.*)\|(.*)\n/g, `{"label":"$2","value":"$1"},`);
    text = text.replace(/\*(.*)（(.*)\n/g, `]}{"label":"$1","key":"$1","type":"group","children":[`);
    text = text.slice(2, -1).concat(']}').replace(/},]}{/g, '}]},{');
    text = '[' + text + ']';
    text = text.replace(/ /g, '');
    text = text.replace(`","value":"合理使用"`, `（默认）","value":"合理使用"`);
    fileLicenseOptions.value = JSON.parse(text);
    fileLicenseLaoding.value = false;
  });

}

// 点击上传按钮时：
async function uploader() {
  loading.value = true;

  for (let index in fileList.value) {

    let file = fileList.value[index];

    // 如果文件状态不是“pending”，说明之前已经尝试上传过，跳过
    if (file.status !== 'pending') { continue; }

    // 如果因为未知原因file.file不存在
    if (file.file === null || file.file === undefined) {
      isTesting ? console.log(`file.file不存在，未知错误`) : $message.error(`file.file不存在，未知错误`);
      continue;
    }

    // 如果文件大小超过10MB
    if (file.file.size > 1024 * 1024 * 10) {
      isTesting ? console.log(`文件 ${file.file.name} 超过10MB`) : $message.error(`文件 ${file.file.name} 超过10MB`);
      continue;
    }

    await new Promise<void>((resolve, reject) => {
      if (file.file === null || file.file === undefined) {
        isTesting ? console.log(`file.file不存在，未知错误`) : $message.error(`file.file不存在，未知错误`);
        reject()
      } else {
        let reader = new FileReader();
        reader.readAsDataURL(file.file);
        reader.onload = async (ev) => {
          let fileName = file['name'];
          let fileContent: String = <String>ev.target?.result;

          // 如果是mid文件
          if ((fileName.split('.').reverse())[0] === 'mid') {
            fileContent = fileContent?.replace(
              'data:application/octet-stream;base64,',
              'data:audio/midi;base64,'
            );
          }

          let fileContentList = [];
          for (let i = 0; i < fileContent?.length; i += 1024 * 1024 * 2) {
            fileContentList.push(fileContent?.slice(i, i + 1024 * 1024 * 2));
          }

          let fileSourceStr = fileSource.value ? `\n{{文件来源|内容=${fileSource.value}}}` : '';

          // 本地测试（开始）
          console.log('fileList');
          console.log(fileList);
          console.log('file');
          console.log(file);
          console.log('fileContent');
          console.log(fileContent);
          console.log('fileName');
          console.log(fileName);
          file.status = 'uploading';
          file.percentage = 0;
          await sleep(500);
          file.percentage = 30;
          await sleep(500);
          file.percentage = 100;
          await sleep(500);
          file.url = `https://xyy.huijiwiki.com/wiki/文件:` + fileName;
          file.status = 'finished';
          resolve();
          return;
          // 本地测试（结束）

          // 初始化进度条，默认进度为0
          file.status = 'uploading';

          for (let index = 0; index < fileContentList.length; index++) {
            const element = fileContentList[index];

            try {
              let res = await new mw.Api().postWithToken('csrf', {
                action: 'edit',
                createonly: true,
                tags: 'Base64文件变更',
                title: `文件:${fileName}/${index}`,
                text: element,
                summary: 'Base64编码文件内容',
              });
              file.percentage = Math.ceil(index / fileContentList.length * 100); // 更新进度条
              console.log(res);
            } catch (error) {
              $message.error(`${fileName} 上传失败（${error}）`);
              console.log(error);
              file.status = 'error';
            }

          }

          try {
            let res = await new mw.Api().postWithToken('csrf', {
              action: 'edit',
              createonly: true,
              tags: 'Base64文件变更',
              title: `文件:${fileName}`,
              text: `{{Base64}}\n{{${fileLicense.value || '合理使用'}}}` + fileSourceStr,
              summary: 'Base64编码文件页面',
            });

            // 更新进度条状态=>上传成功
            file.url = `https://xyy.huijiwiki.com/wiki/文件:` + fileName;
            file.status = 'finished';

            $message.success(`${fileName} 上传成功`);
            console.log(res);
          } catch (error) {
            file.status = 'error';
            $message.error(`${fileName} 页面更新失败（${error}）`);
            console.log(error);
          }

          resolve();
        };
      }
    });

  }

  // 结束加载状态
  loading.value = false;

}
</script>