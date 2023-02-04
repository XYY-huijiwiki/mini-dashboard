<template>
    <n-dropdown trigger="click" :options="options" @select="handleSelect">
        <n-button tertiary>
            <MaterialSymbol>more_vert</MaterialSymbol>
        </n-button>
    </n-dropdown>
</template>

<script setup>
import sleep from 'await-sleep';
import { ref } from 'vue';

const options = ref([
    {
        label: '移动（重命名）',
        key: 'move',
        disabled: true
    },
    {
        label: '删除',
        key: 'delete?',
        children: [{
            label: '确认删除',
            key: 'delete',
            props: { style: { color: '#e88080' } }
        }]
    },
]);

// 处理菜单选项
function handleSelect(key) {
    (key === 'delete') ? deleteFile(props.input) : console.log('无法处理菜单事件');
}

// 删除功能
async function deleteFile(title) {

    // 测试
    // console.log('正在删除……');
    // await sleep(1000);
    // console.log('已删除' + title);
    // return;

    $message.loading('正在删除……');
    console.log('正在删除……');

    await new mw.Api().postWithToken('csrf', {
        action: 'delete',
        title: title + '/0',
        tags: 'Base64文件变更',
        deletetalk: true,
    }).fail((err) => {
        $message.error('文件内容删除失败，未知错误');
        console.log(err);
    }).done((msg) => {
        $message.success('文件内容删除成功');
        console.log(msg);
    });

    await new mw.Api().postWithToken('csrf', {
        action: 'delete',
        title: title,
        tags: 'Base64文件变更',
        deletetalk: true,
    }).fail((err) => {
        $message.error('文件页面删除失败，未知错误');
        console.log(err);
    }).done((msg) => {
        $message.success('文件页面删除成功');
        console.log(msg);
    });

    $message.info('刷新页面后文件列表才会更新');
}

// 移动功能
// 还没做

// 导入props
const props = defineProps({
    input: String
});

</script>