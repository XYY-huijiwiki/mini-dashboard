<template>
  <n-thing content-indented>
    <template #header-extra>
      <help-btn link="miui-themes" />
    </template>
    <template #avatar>
      <n-avatar>
        <n-icon><img :src="MiLogoSvg" alt="MIUI" /> </n-icon>
      </n-avatar>
    </template>
    <template #header> {{ t('miui-themes.title') }} </template>
    <template #description>
      {{ t('miui-themes.description') }}
    </template>
    <template #action>
      <n-space>
        <router-link :to="{ name: 'miui-themes' }">
          <n-button size="small">
            {{ t('miui-themes.title') }}
          </n-button>
        </router-link>
      </n-space>
    </template>
  </n-thing>
  <n-divider></n-divider>
  <n-thing content-indented>
    <template #header-extra>
      <help-btn link="github-files" />
    </template>
    <template #avatar>
      <n-avatar>
        <n-icon><Github /></n-icon>
      </n-avatar>
    </template>
    <template #header> {{ t('home.text-github-files-title') }} </template>
    <template #description>
      {{ t('home.text-github-files-description') }}
    </template>
    <template #action>
      <n-space>
        <router-link :to="{ name: 'github-files' }">
          <n-button size="small">
            {{ t('github-files.title') }}
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
    <template #header> {{ t('home.text-cartoon-data-title') }} </template>
    <template #description>
      {{ t('home.text-cartoon-data-description') }}
    </template>
    <template #action>
      <n-space>
        <router-link :to="{ name: 'data-importer' }">
          <n-button size="small">
            {{ t('data-importer.title') }}
          </n-button>
        </router-link>
        <router-link :to="{ name: 'data-exporter' }">
          <n-button size="small">
            {{ t('data-exporter.title') }}
          </n-button>
        </router-link>
      </n-space>
    </template>
  </n-thing>
  <n-divider></n-divider>
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
      {{ t('home.text-destroy-and-rescue-title') }}
    </template>
    <template #description>
      {{ t('home.text-destroy-and-rescue-description') }}
    </template>
    <template #action>
      <n-space>
        <router-link :to="{ name: 'search-and-destroy' }">
          <n-button size="small">
            {{ t('search-and-destroy.title') }}
          </n-button>
        </router-link>
        <router-link :to="{ name: 'search-and-rescue' }">
          <n-button size="small">
            {{ t('search-and-rescue.title') }}
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
    <router-link to="/check-revisions">
      <n-button>check-revisions</n-button>
    </router-link>
    <img src="../assets/mi-logo.svg" />
  </n-space>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Github } from '@vicons/fa'
import MiLogoSvg from '@/assets/mi-logo.svg'

const { t } = useI18n()
</script>
