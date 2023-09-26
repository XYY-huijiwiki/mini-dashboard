<template>
  <div>
    <n-dialog
      type="info"
      style="width: 440px; max-width: 100%"
      @close="() => emit('close-dialog')"
    >
      <!-- header -->
      <template #header>
        <n-ellipsis>
          {{ props.data[0].file.name }}
        </n-ellipsis>
      </template>

      <!-- body (default) -->
      <template #default>
        <n-divider title-placement="left">page</n-divider>
        <n-p>
          file page:
          <n-a
            :href="`/wiki/File:${props.data[0].file.name}.png`"
            target="_blank"
          >
            File:{{ props.data[0].file.name }}.png
          </n-a>
        </n-p>
        <n-p v-if="props.data[0].file.type.startsWith('video/')">
          poster page:
          <n-a
            :href="`/wiki/File:${props.data[0].file.name}.poster.png`"
            target="_blank"
          >
            File:{{ props.data[0].file.name }}.poster.png
          </n-a>
        </n-p>
        <n-p>
          data page:
          <n-a
            :href="`/wiki/Data:${props.data[0].file.name}.json`"
            target="_blank"
          >
            Data:{{ props.data[0].file.name }}.json
          </n-a>
        </n-p>
        <template v-for="(value, key) in props.data[0]">
          <template v-if="key !== '_id'">
            <n-divider title-placement="left" :key="key">
              {{ key }}
            </n-divider>
            <n-p v-for="(v, k) in value" :key="k">
              <n-tag size="small"> {{ k }} </n-tag> {{ v }}
            </n-p>
          </template>
        </template>
      </template>
    </n-dialog>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: RetrievedDataItem[];
}>();

const emit = defineEmits(["close-dialog"]);
</script>

<style scoped></style>
