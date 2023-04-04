<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'

const defaultSettings = {
    enableBeta: false,
    betaHash: '',
}

const settings = useLocalStorage('settings', defaultSettings)

if (!settings.value) {
    settings.value = defaultSettings
}

function clearData() {
    settings.value = defaultSettings
}

</script>

<template>
    <n-form label-placement="left" label-width="120px">
        <n-form-item label="启用测试版">
            <n-switch v-model:value="settings.enableBeta" disabled/>
        </n-form-item>
        <n-form-item v-if="settings.enableBeta" label="测试版哈希后缀">
            <n-input v-model:value="settings.betaHash" />
        </n-form-item>
        <n-form-item label="恢复默认设置">
            <n-popconfirm positive-text="确定" negative-text="取消" @positive-click="clearData">
                <template #trigger>
                    <n-button>恢复</n-button>
                </template>
                您确定要恢复默认设置吗？
            </n-popconfirm>
        </n-form-item>
    </n-form>
</template>