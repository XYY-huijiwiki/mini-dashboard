<template>
    <span class="material-symbols-outlined" :style="{ 'vertical-align': 'sub', 'font-size': `${size}px` }">
        <slot></slot>
    </span>
</template>
<script setup>
const props = defineProps({
    size: {
        type: Number,
        default: 24
    }
});
</script>