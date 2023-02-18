<template>
    <n-space justify="space-between">
        <!-- 本地测试（开始） -->
        <n-p>当前为本地测试</n-p>
        <!-- 本地测试（结束） -->
        <n-p>最后编译时间：2023年2月18日 20:47</n-p>
        <n-space justify="end">
            <n-a href="//github.com/XYY-huijiwiki" target="_blank">Github</n-a>
        </n-space>
    </n-space>
</template>

<script setup>
import { ref } from 'vue';
let pathname = ref(location.pathname);
</script>