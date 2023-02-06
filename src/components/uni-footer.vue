<template>
    <n-space justify="space-between">
        <!-- 本地测试（开始） -->
        <n-p>当前为本地测试</n-p>
        <!-- 本地测试（结束） -->
        <n-p>最后编译时间：Feb 7, 2023 12:53 AM</n-p>
        <n-space justify="end">
            <n-a v-if="pathname.includes(encodeURI('测试版'))"
                :href="`//xyy.huijiwiki.com${pathname.replace(encodeURI('（测试版）', ''))}`">返回稳定版</n-a>
            <n-a v-else :href="`//xyy.huijiwiki.com${pathname}（测试版）`">进入测试版</n-a>
            <n-a href="//github.com/XYY-huijiwiki" target="_blank">Github</n-a>
        </n-space>
    </n-space>
</template>

<script setup>
import { ref } from 'vue';
let pathname = ref(location.pathname);
</script>