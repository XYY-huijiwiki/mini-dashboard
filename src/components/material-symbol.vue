<script lang="ts" setup>
defineProps({
  size: {
    type: Number,
    default: 24,
  },
  verticalAlign: {
    type: String,
    default: "sub",
  },
});
</script>

<template>
  <span
    class="material-symbols-outlined"
    :style="{ 'vertical-align': verticalAlign, 'font-size': `${size}px` }"
  >
    <slot></slot>
  </span>
</template>
