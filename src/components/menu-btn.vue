<template>

    <!-- 按钮组 -->
    <n-button-group>
        <n-button tertiary tag="a" :href="`https://xyy.huijiwiki.com/wiki/${input}`" target="_blank">查看</n-button>
        <n-dropdown trigger="click" :options="options" @select="handleSelect">
            <n-button tertiary>
                <MaterialSymbol>more_vert</MaterialSymbol>
            </n-button>
        </n-dropdown>
    </n-button-group>

    <!-- 移动页面的模态框 -->
    <n-modal v-model:show="showModal" preset="dialog" :showIcon="false" :autoFocus="false">
        <template #header>
            <div>移动至？（重命名为？）</div>
        </template>
        <n-input-group>
            <n-input v-model:value="moveTo"></n-input>
            <n-button @click="moveFile()">确定</n-button>
        </n-input-group>
    </n-modal>

</template>

<script setup>
import sleep from 'await-sleep';
import { ref } from 'vue';

// 如果网页链接不是羊羊百科，自动进入测试模式
let isTesting = location.host === 'xyy.huijiwiki.com' ? false : true;

// 定义一些变量
let showModal = ref(false);
let moveTo = ref(props.input);

// 定义菜单的内容
let options = ref([
    {
        label: '移动（重命名）',
        key: 'move',
    },
    {
        label: '删除',
        key: 'delete?',
        children: [{
            label: '确认删除',
            key: 'delete',
            props: { style: { color: '#e88080' } },
            disabled: true
        }]
    },
]);

// 处理菜单选项
function handleSelect(key) {
    (key === 'delete') ? deleteFile()
        : (key === 'move') ? showModal.value = true
            : console.log('无法处理菜单事件');
}

// 删除功能
async function deleteFile() {

    // 本地测试（开始）
    console.log('正在删除……');
    await sleep(1000);
    console.log('已删除' + props.input);
    return;
    // 本地测试（结束）

    $message.loading('正在删除……');
    console.log('正在删除……');

    await new mw.Api().postWithToken('csrf', {
        action: 'delete',
        title: props.input + '/0',
        tags: 'Base64文件变更',
        deletetalk: true,
    }).fail((err) => {
        $message.error('文件内容删除失败，未知错误');
        console.log(err);
    }).done((msg) => {
        $message.success('文件内容删除成功');
        console.log(msg);
        new mw.Api().postWithToken('csrf', {
            action: 'delete',
            title: props.input,
            tags: 'Base64文件变更',
            deletetalk: true,
        }).fail((err) => {
            $message.error('文件页面删除失败，未知错误');
            console.log(err);
        }).done((msg) => {
            $message.success('文件页面删除成功');
            console.log(msg);
            $message.info('刷新页面后文件列表才会更新');
        });
    });

}

// 移动功能
async function moveFile() {

    // 检查文件移动前后是否同名
    if (props.input === moveTo.value) {
        isTesting ? console.log('文件名不能和原来的相同') : $message.error('文件名不能和原来的相同');
        return;
    }

    // 检查文件后缀名是否发生改变
    let orgFileExt = (props.input.split('.').reverse())[0];
    let newFileExt = (moveTo.value.split('.').reverse())[0];
    if (orgFileExt !== newFileExt) {
        isTesting ? console.log(`文件后缀名（${orgFileExt}）不得发生改变`) : $message.error(`文件后缀名（${orgFileExt}）不得发生改变`);
        return;
    }

    // 本地测试（开始）
    console.log('正在移动……');
    await sleep(1000);
    console.log('移动成功\nvon ' + props.input + '\nnach ' + moveTo.value);
    showModal.value = false;
    return;
    // 本地测试（结束）

    $message.loading('正在移动……');

    await new mw.Api().postWithToken('csrf', {
        action: 'move',
        from: props.input,
        to: moveTo.value,
        tags: 'Base64文件变更',
        movetalk: true,
        movesubpages: true,
        noredirect: true,
    }).fail((err) => {
        $message.error('文件移动失败，未知错误');
        console.log(err);
    }).done((msg) => {
        $message.success('文件移动成功');
        $message.info('刷新页面后文件列表才会更新');
        console.log(msg);
    });

    showModal.value = false;

}

// 导入props
const props = defineProps({
    input: String
});

</script>