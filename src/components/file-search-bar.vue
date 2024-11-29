<template>
  <Teleport to="#mini-dashboard-title-bar">
    <n-input-group class="flex-1">
      <n-input
        round
        v-model:value="searchText"
        clearable
        ref="searchBarEle"
        @keyup.enter="doSearch"
      >
        <template #prefix>
          <n-button circle quaternary size="tiny" @click="cancelSearch">
            <template #icon>
              <materialSymbol :size="24">
                {{ searchText ? ' arrow_back ' : 'search' }}
              </materialSymbol>
            </template>
          </n-button>
        </template>
      </n-input>
      <n-button @click="doSearch" round secondary>
        {{ t('github-files.btn-search') }}
      </n-button>
    </n-input-group>
  </Teleport>
</template>

<script setup lang="ts">
import type { DataTableFilterState } from 'naive-ui'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

let { t } = useI18n()
let searchBarEle = ref()
let searchText = ref('')
let filters = defineModel<DataTableFilterState>('filters', {
  required: true,
})
function cancelSearch() {
  searchText.value = ``
  filters.value.name = undefined
  // cancel focus on search bar
  searchBarEle.value.blur()
}
function doSearch() {
  filters.value.name = searchText.value
}
</script>

<style scoped></style>
