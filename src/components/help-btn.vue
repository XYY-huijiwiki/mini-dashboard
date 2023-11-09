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
import { type RouteLocationRaw } from "vue-router";
defineProps<{
  link: RouteLocationRaw;
}>();
</script>

<style scoped></style>
