<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useLocalesStore, supportedLangs, userLang } from '@/stores/locales'

const { langCode } = storeToRefs(useLocalesStore())

let { settings } = storeToRefs(useSettingsStore())

let { resetSettings } = useSettingsStore()

let dataTypeOptions = [
  { label: 'XLSX', value: 'xlsx' },
  { label: 'JSON', value: 'json' },
]

const { t } = useI18n()

function clearData() {
  $dialog.warning({
    title: t('general.warning'),
    content: t('settings.text-confirm-restore'),
    positiveText: t('general.btn-confirm'),
    negativeText: t('general.btn-cancel'),
    autoFocus: false,
    onPositiveClick: () => {
      resetSettings()
      $message.success(t('settings.text-restore-done'))
    },
  })
}
</script>

<template>
  <n-form>
    <!-- language -->
    <n-form-item>
      <template #label>
        {{ t('settings.label-language') }}
      </template>
      <n-radio-group v-model:value="settings.language" name="radiogroup">
        <n-space>
          <n-radio key="auto" value="auto">
            {{
              t('settings.text-auto-language', [
                new Intl.DisplayNames([langCode], { type: 'language' }).of(userLang),
              ])
            }}
          </n-radio>
          <n-radio v-for="lang in supportedLangs" :key="lang" :value="lang">
            {{ new Intl.DisplayNames([lang], { type: 'language' }).of(lang) }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <!-- data type -->
    <n-form-item>
      <template #label>
        {{ t('settings.label-data-type') }}
        <info-label :content="t('settings.data-type-info')" />
      </template>
      <n-radio-group v-model:value="settings.dataType">
        <n-space>
          <n-radio v-for="option in dataTypeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <!-- export-backup -->
    <n-form-item>
      <template #label>
        {{ t('settings.label-export-backup') }}
        <info-label :content="t('settings.export-backup-info')" />
      </template>
      <n-checkbox v-model:checked="settings.exportBackup">
        {{ t('settings.text-export-backup') }}
      </n-checkbox>
    </n-form-item>
    <!-- github token -->
    <n-form-item>
      <template #label>
        {{ t('settings.label-github-token') }}
        <info-label :content="t('settings.github-token-info')" />
      </template>
      <n-input v-model:value="settings.ghToken" />
    </n-form-item>
    <!-- cloudflare token -->
    <n-form-item>
      <template #label>
        {{ t('settings.label-cloudflare-token') }}
        <info-label :content="t('settings.cloudflare-token-info')" />
      </template>
      <n-input v-model:value="settings.cfToken" />
    </n-form-item>
    <!-- restore defaults -->
    <n-form-item :label="t('settings.label-restore-defaults')">
      <n-button @click="clearData()">
        {{ t('settings.btn-restore') }}
      </n-button>
    </n-form-item>
    <!-- source code -->
    <n-form-item :label="t('settings.label-source-code')">
      <n-space>
        <n-button tag="a" href="//github.com/XYY-huijiwiki/mini-dashboard" target="_blank">
          {{ t('settings.btn-github') }}
        </n-button>
        <n-button tag="a" href="//xyy.huijiwiki.com/wiki/Html:迷你控制中心" target="_blank">
          {{ t('settings.btn-xyy-wiki') }}
        </n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>
