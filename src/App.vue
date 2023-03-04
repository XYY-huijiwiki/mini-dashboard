<template>
  <div>

    <!-- 添加 Material Symbol 系列图标 -->
    <!-- 本地测试（开始） -->
    <link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0" />
    <!-- 本地测试（结束） -->

    <n-config-provider :theme="darkTheme">
      <n-card title="上传特殊文件">

        <!-- 上传区域 -->
        <uploader></uploader>

        <!-- 说明区域 -->
        <n-h2>使用说明</n-h2>
        <n-ul>
          <n-li>单个文件的大小不能超过10MB。</n-li>
          <n-li>最好填写文件来源。文件来源不尽相同的时候需要一个一个上传、一个一个填写。</n-li>
          <n-li>此处上传的文件无法通过wikitext直接使用，仅作为归档和备份。</n-li>
          <n-li>如果要上传的文件格式是 png，jpg，jpeg，gif，svg，webm，ogg，ttf 中的一种，请<n-a
              href="https://xyy.huijiwiki.com/wiki/%E7%89%B9%E6%AE%8A:%E4%B8%8A%E4%BC%A0%E6%96%87%E4%BB%B6"
              target="_blank">点击这里</n-a>上传。</n-li>
        </n-ul>

        <!-- 展示全部文件 -->
        <all-file></all-file>

        <!-- 底部footer -->
        <template #action>
          <n-space justify="space-between">
            <n-p>最后编译时间：2023年3月4日 19:08</n-p>
            <n-a href="//github.com/XYY-huijiwiki" target="_blank">Github</n-a>
          </n-space>
        </template>

      </n-card>
    </n-config-provider>

  </div>
</template>

<script lang="ts" setup>
import { darkTheme } from 'naive-ui';
</script>