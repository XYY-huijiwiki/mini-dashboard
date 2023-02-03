<template>
    <n-h2>全部特殊文件</n-h2>
    <n-space vertical>
        <n-list hoverable>
            <n-list-item v-for="item in fileList">
                <template #prefix>
                    <n-icon :size="24">
                        <music-icon v-if="musikExtList.includes((item.title.split('.').reverse())[0])" />
                        <video-icon v-else-if="videoExtList.includes((item.title.split('.').reverse())[0])" />
                        <file-icon v-else />
                    </n-icon>
                </template>
                {{ item.title.replace('文件:', '') }}
                <template #suffix>
                    <n-space :wrap="false">
                        <n-button tertiary tag="a" :href="`https://xyy.huijiwiki.com/p/${item.pageid}`"
                            target="blank">文件页面</n-button>
                        <n-button tertiary type="error" disabled>
                            <template #icon><n-icon><trash-icon /></n-icon></template>
                        </n-button>
                    </n-space>
                </template>
            </n-list-item>
        </n-list>
        <n-button @click="showAllFile()" :loading="loading" v-if="showBtn">{{
            fileList.length ? '加载更多' : '点击查看'
        }}</n-button>
    </n-space>
</template>

<script setup>
import { ref } from 'vue';
import sleep from 'await-sleep';
import {
    Music as musicIcon,
    Video as videoIcon,
    File as fileIcon,
    TrashX as trashIcon,
} from '@vicons/tabler';

var showBtn = ref(true);
var fileList = ref([]);
var loading = ref(false);
var cmcontinue = ref('');
var musikExtList = ['mp3', 'mid'];
var videoExtList = ['mp4'];

async function showAllFile() {

    loading.value = true;

    // 测试
    await sleep(1000);
    fileList.value = [
        {
            "pageid": 47828,
            "ns": 6,
            "title": "文件:01-Level-01.mp3"
        },
        {
            "pageid": 47830,
            "ns": 6,
            "title": "文件:02-Level-02.mid"
        },
        {
            "pageid": 47832,
            "ns": 6,
            "title": "文件:04-Level-04"
        },
        {
            "pageid": 47834,
            "ns": 6,
            "title": "文件:Bonus levelsong-01.mp4"
        },
        {
            "pageid": 47805,
            "ns": 6,
            "title": "文件:国潮有喜 button.mp3"
        },
        {
            "pageid": 47811,
            "ns": 6,
            "title": "文件:国潮有喜 foot.mp3"
        },
        {
            "pageid": 47809,
            "ns": 6,
            "title": "文件:国潮有喜 game.mp3"
        },
        {
            "pageid": 47801,
            "ns": 6,
            "title": "文件:国潮有喜 gs.mp3"
        },
        {
            "pageid": 47807,
            "ns": 6,
            "title": "文件:国潮有喜 select.mp3"
        },
        {
            "pageid": 47803,
            "ns": 6,
            "title": "文件:国潮有喜 success.mp3"
        }
    ];
    return;

    let response = await axios.get(encodeURI(`https://xyy.huijiwiki.com/api.php?action=query&list=categorymembers&cmtitle=分类:Base64编码的文件&format=json&cmcontinue=${cmcontinue.value}`));
    fileList.value = fileList.value.concat(response['data']['query']['categorymembers']);
    // 如果没有下一页了就直接结束
    if (typeof response['data']['continue'] === `undefined`) {
        showBtn.value = false;
        return;
    }
    cmcontinue.value = response['data']['continue']['cmcontinue'];

    loading.value = false;

}

</script>

<style>
#wiki-body li.n-list-item {
    margin-top: 0;
    margin-bottom: 0;
    line-height: inherit;
}
</style>