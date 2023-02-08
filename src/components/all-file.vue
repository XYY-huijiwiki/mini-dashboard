<template>
    <n-h2>全部特殊文件</n-h2>
    <n-space vertical>
        <n-list hoverable>
            <n-list-item v-for="item in fileList">

                <!-- 列表的主体内容 -->
                {{ item.title.replace('文件:', '') }}

                <!-- 列表的前置图标 -->
                <template #prefix>
                    <n-icon color="#70c0e8" v-if="extList['video'].includes((item.title.split('.').reverse())[0])">
                        <material-symbol> video_file </material-symbol>
                    </n-icon>
                    <n-icon color="#63e2b7" v-else-if="extList['audio'].includes((item.title.split('.').reverse())[0])">
                        <material-symbol> audio_file </material-symbol>
                    </n-icon>
                    <n-icon color="#f2c97d" v-else-if="extList['image'].includes((item.title.split('.').reverse())[0])">
                        <material-symbol> plagiarism </material-symbol>
                    </n-icon>
                    <n-icon color="#e88080" v-else>
                        <material-symbol> draft </material-symbol>
                    </n-icon>
                </template>

                <!-- 列表的右侧按钮 -->
                <template #suffix>
                    <menu-btn :input="item.title"></menu-btn>
                </template>

            </n-list-item>
        </n-list>

        <n-input-group>
            <n-button @click="showAllFile()" :loading="loading" v-if="showBtn">
                {{ fileList.length ? '加载更多' : '点击查看' }}
            </n-button>
            <n-slider v-model:value="sliderValue" :format-tooltip="sliderFormatTooltip" :min="10"
                :disabled="sliderDisabled" :style="{ 'padding-left': '15px', 'padding-top': '15px' }" v-if="showBtn" />
        </n-input-group>

    </n-space>
</template>

<script setup>
import { ref } from 'vue';
import sleep from 'await-sleep';

// 如果网页链接不是羊羊百科，自动进入测试模式
let isTesting = location.host === 'xyy.huijiwiki.com' ? false : true;

var showBtn = ref(true);
var loading = ref(false);
var fileList = ref([]);
var cmcontinue = ref('');
var sliderDisabled = ref(false);
var sliderValue = ref('10');
var sliderFormatTooltip = (num) => { return `每次加载 ${num} 个文件。`; };
var extList = ref({
    audio: ['mp3', 'mid', 'wav'],
    video: ['mp4'],
    image: ['webp']
});

// 获取文件列表，展示文件
async function showAllFile() {

    loading.value = true;
    sliderDisabled = true;

    // 本地测试（开始）
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
            "title": "文件:国潮有喜 button.webp"
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
    // 本地测试（结束）

    let response = await axios.get(encodeURI(`https://xyy.huijiwiki.com/api.php?action=query&list=categorymembers&cmtitle=分类:Base64编码的文件&format=json&cmlimit=${sliderValue.value}&cmcontinue=${cmcontinue.value}`));
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

.mw-content-ltr ul,
.mw-content-rtl .mw-content-ltr ul {
    margin: 0;
}
</style>