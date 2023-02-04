<template>
    <n-popconfirm @positive-click="deleteFile(input)" :positive-button-props="{ type: 'error' }">
        <template #trigger>
            <n-button tertiary type="error">
                <template #icon><material-symbol>delete_forever</material-symbol></template>
            </n-button>
        </template>
        确认要删除吗？
    </n-popconfirm>
</template>

<script setup>
import sleep from 'await-sleep';

const props = defineProps({
    input: String
});

async function deleteFile(title) {

    // 测试
    console.log('正在删除……');
    await sleep(1000);
    console.log('已删除' + title);
    return;

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
</script>