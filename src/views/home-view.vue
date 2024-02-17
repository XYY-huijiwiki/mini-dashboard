<template>
  <div>
    <n-thing content-indented>
      <template #header-extra>
        <help-btn link="special-files" />
      </template>
      <template #avatar>
        <n-avatar>
          <MaterialSymbol> home_storage </MaterialSymbol>
        </n-avatar>
      </template>
      <template #header> {{ t("home.text-special-file-title") }} </template>
      <template #description>
        {{
          t("home.text-special-file-description", [
            "." + fileExtList.join(" ."),
          ])
        }}
      </template>
      <template #action>
        <n-space>
          <router-link :to="{ name: 'file-uploader' }">
            <n-button size="small">
              {{ t("file-uploader.title") }}
            </n-button>
          </router-link>
          <router-link :to="{ name: 'file-manager' }">
            <n-button size="small">
              {{ t("file-manager.title") }}
            </n-button>
          </router-link>
        </n-space>
      </template>
    </n-thing>
    <n-divider></n-divider>
    <n-thing content-indented>
      <template #header-extra>
        <help-btn link="cartoon-data" />
      </template>
      <template #avatar>
        <n-avatar>
          <MaterialSymbol> database </MaterialSymbol>
        </n-avatar>
      </template>
      <template #header> {{ t("home.text-cartoon-data-title") }} </template>
      <template #description>
        {{
          t("home.text-cartoon-data-description", [
            "." + fileExtList.join(" ."),
          ])
        }}
      </template>
      <template #action>
        <n-space>
          <router-link :to="{ name: 'data-importer' }">
            <n-button size="small">
              {{ t("data-importer.title") }}
            </n-button>
          </router-link>
          <router-link :to="{ name: 'data-exporter' }">
            <n-button size="small">
              {{ t("data-exporter.title") }}
            </n-button>
          </router-link>
        </n-space>
      </template> </n-thing
    ><n-divider></n-divider>
    <n-thing content-indented>
      <template #header-extra>
        <help-btn link="destroy-and-rescue" />
      </template>
      <template #avatar>
        <n-avatar>
          <MaterialSymbol> delete </MaterialSymbol>
        </n-avatar>
      </template>
      <template #header>
        {{ t("home.text-destroy-and-rescue-title") }}
      </template>
      <template #description>
        {{ t("home.text-destroy-and-rescue-description") }}
      </template>
      <template #action>
        <n-space>
          <router-link :to="{ name: 'search-and-destroy' }">
            <n-button size="small">
              {{ t("search-and-destroy.title") }}
            </n-button>
          </router-link>
          <router-link :to="{ name: 'search-and-rescue' }">
            <n-button size="small">
              {{ t("search-and-rescue.title") }}
            </n-button>
          </router-link>
        </n-space>
      </template>
    </n-thing>
    <n-divider>Under Development</n-divider>
    <n-space>
      <router-link to="/regex-editor">
        <n-button>regex editor</n-button>
      </router-link>
      <router-link to="/rename-pages">
        <n-button>rename-pages</n-button>
      </router-link>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import fileTypeList from "@/utils/fileTypeList";
let fileExtList = Object.values(fileTypeList)
  .map((item) => item.ext)
  .flat()
  .sort();
const { t } = useI18n();
</script>

<style scoped></style>
