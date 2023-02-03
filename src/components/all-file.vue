<template>
    <n-h2>全部特殊文件</n-h2>
    <n-space vertical>
        <n-list hoverable>
            <n-list-item v-for="item in fileList">
                {{ item.title }}
                <template #suffix>
                    <n-space :wrap="false">
                        <n-button tertiary tag="a" :href="`https://xyy.huijiwiki.com/p/${item.pageid}`"
                            target="blank">文件页面</n-button>
                        <n-button tertiary type="error" disabled> <template #icon> <n-icon> <delete-icon /> </n-icon>
                            </template>
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
// import sleep from 'await-sleep';
import { TrashOutline as deleteIcon } from '@vicons/ionicons5';

var showBtn = ref(true);
var fileList = ref([]);
var loading = ref(false);
var cmcontinue = ref('');

async function showAllFile() {

    loading.value = true;

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