<template>

  <!-- 添加 Material Symbol 系列图标，仅在本地测试时需要 -->
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0" />

  <n-config-provider :theme="darkTheme">
    <n-card title="上传特殊文件">
      <!-- 上传区域 -->
      <n-space vertical>
        <n-upload :accept="fileExtList.join(',')" :default-upload="false" :multiple="true" v-model:file-list="fileList">
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
          <n-select :loading="fileLicenseLaoding" placeholder="授权协议" v-model:value="fileLicense"
            :options="fileLicenseOptions" />
          <n-button @click="uploader()" :loading="loading">上传文件</n-button>
        </n-input-group>
      </n-space>

      <!-- 说明区域 -->
      <n-h2>使用说明</n-h2>
      <n-ul>
        <n-li>单个文件的大小不能超过1.5MB（实际存在一点误差）。</n-li>
        <n-li>上传完成一次后需要刷新页面才能再次上传。</n-li>
        <n-li>最好填写文件来源。文件来源不尽相同的时候需要一个一个上传、一个一个填写。</n-li>
        <n-li>如果要上传的文件格式是 png，jpg，jpeg，gif，svg，webm，ogg，ttf 中的一种，请<n-a
            href="https://xyy.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6"
            target="_blank">点击这里</n-a>上传。</n-li>
      </n-ul>

      <!-- 展示全部文件 -->
      <all-file></all-file>

      <template #action>
        <n-space justify="end">
          <n-a v-if="location.pathname === encodeURI('/wiki/Project:上传特殊文件')"
            href="//xyy.huijiwiki.com/wiki/Project:上传特殊文件（测试版）">进入测试版</n-a>
          <n-a v-if="location.pathname === encodeURI('/wiki/Project:上传特殊文件（测试版）')"
            href="//xyy.huijiwiki.com/wiki/Project:上传特殊文件">返回稳定版</n-a>
          <n-a v-if="location.pathname === encodeURI('/wiki/Project:上传特殊文件（测试版）')"
            href="//purge.jsdelivr.net/gh/XYY-huijiwiki/Base64-file-uploader@文件管理部分更新/xyy/index.js">刷新CDN缓存</n-a>
          <n-a href="//github.com/XYY-huijiwiki/Base64-file-uploader" target="_blank">Github</n-a>
        </n-space>
      </template>

    </n-card>
  </n-config-provider>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { darkTheme } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import sleep from 'await-sleep';

// 如果网页链接不是羊羊百科，自动进入测试模式
let isTesting = location.host === 'xyy.huijiwiki.com' ? false : true;

// 定义一些变量
let fileExtList = ref(['.mp3', '.mid', '.mp4']);
let fileSource = ref('');
let loading = ref(false);
let fileList;
let fileLicense = ref(null);
let fileLicenseLaoding = ref(true);
let fileLicenseOptions = ref([]);

// 获取羊羊百科授权协议列表
onMounted(async () => {

  // 测试
  if (isTesting) {
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
    return;
  }

  // 设置一个小循环,防止运行这些代码时mw还没准备好
  (function () {
    if (typeof mw === 'undefined') {
      setTimeout(arguments.callee, 3000);
    } else {
      new mw.Api().postWithToken('csrf', {
        action: 'query',
        prop: 'revisions',
        titles: 'MediaWiki:Licenses',
        rvprop: 'content'
      }).fail((err) => {
        $message.error('文件移动失败，未知错误');
        console.log(err);
      }).done((msg) => {
        $message.success('文件移动成功');
        $message.info('刷新页面后文件列表才会更新');
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
  })();
});

// 上传按钮的功能
async function uploader() {
  loading.value = true;
  for (let index in fileList) {

    let file = fileList[index];

    // 如果编码前超过1.5MB
    if (file.file.size > 1024 * 1024 * 1.5) {
      if (isTesting) {
        console.log(`文件 ${fileName} 超过1.5MB`);
      } else {
        $message.error(`文件 ${fileName} 超过1.5MB`);
      }
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(file['file']);
    reader.onload = async (ev) => {
      let fileName = file['name'];
      let fileContent = ev.target?.result;

      // 如果编码后超过2MB
      if (fileContent?.length > 1024 * 1024 * 2) {
        if (isTesting) {
          console.log(`文件 ${fileName} 超过1.5MB`);
        } else {
          $message.error(`文件 ${fileName} 超过1.5MB`);
        }
        return;
      }

      // 如果是mid文件
      if ((fileName.split('.').reverse())[0] === 'mid') {
        fileContent = fileContent.replace(
          'data:application/octet-stream;base64,',
          'data:audio/midi;base64,'
        );
      }

      let fileSourceStr = fileSource.value ? `\n{{文件来源|内容=${fileSource.value}}}` : '';

      // 测试
      if (isTesting) {
        console.log(`==file==`);
        console.log(file);
        console.log(`==文件页面最后内容==`);
        console.log(`{{Base64}}\n{{${fileLicense.value || '合理使用'}}}` + fileSourceStr);
        console.log(`==fileContent==`);
        console.log(fileContent);
        return;
      }

      await new mw.Api().postWithToken('csrf', {
        action: 'edit',
        createonly: true,
        tags: 'Base64文件变更',
        title: `文件:${fileName}/0`,
        text: fileContent,
        summary: 'Base64编码文件内容',
      }).fail((err) => {
        $message.error(`${fileName} 上传失败，未知错误`);
        console.log(err);
      }).done((msg) => {
        $message.success(`${fileName} 上传成功`);
        $message.loading('正在更新文件页面……');
        console.log(msg);

        new mw.Api().postWithToken('csrf', {
          action: 'edit',
          createonly: true,
          tags: 'Base64文件变更',
          title: `文件:${fileName}`,
          text: `{{Base64}}\n{{${fileLicense.value || '合理使用'}}}` + fileSourceStr,
          summary: 'Base64编码文件页面',
        }).fail((err) => {
          $message.error(`${fileName} 页面更新失败，未知错误`);
          console.log(err);
        }).done((msg) => {
          $message.success(`${fileName} 页面更新成功`);
          $message.info('刷新页面后文件列表才会更新');
          console.log(msg);
        });

      });

    };

    // for循环最后暂停1秒钟
    await sleep(1000);

  }

  loading.value = false;

}
</script>