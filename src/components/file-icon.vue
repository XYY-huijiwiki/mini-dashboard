<template>
  <img
    :src="`https://ik.imagekit.io/gwa1ycz7gc/file-icons/${getIconName(fileType)}.ico`"
    :alt="fileType || 'file'"
    :width="size || 24"
    :height="size || 24"
    style="vertical-align: text-bottom; display: inline-block"
  />
</template>

<script setup lang="ts">
defineProps<{
  fileType?: string | null
  size?: number
}>()

function getIconName(type: string | undefined | null): string {
  if (type === 'application/pdf') return 'doc'
  if (type?.startsWith('image')) return 'image'
  if (type?.startsWith('audio')) return 'audio'
  if (type?.startsWith('video')) return 'video'
  if (type?.startsWith('text')) return 'text'
  return 'file'
}
</script>
