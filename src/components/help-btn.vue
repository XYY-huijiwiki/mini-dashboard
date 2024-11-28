<template>
  <div>
    <router-link :to="`/help-docs/${$props.link}`">
      <n-button circle quaternary>
        <template #icon>
          <MaterialSymbol> help </MaterialSymbol>
        </template>
      </n-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  link: string
}>()
</script>

<style scoped></style>
