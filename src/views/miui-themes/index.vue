<template>
  <n-scrollbar>
    <n-flex vertical>
      <n-steps :current="currentStep" class="m-4">
        <n-step :title="t('miui-themes.label-login')" />
        <n-step :title="t('miui-themes.label-fill-in')" />
        <n-step :title="t('miui-themes.label-preview')" />
        <n-step :title="t('miui-themes.label-submit')" />
      </n-steps>
      <step-one v-if="currentStep === 1" @next="currentStep++" />
      <step-two
        v-if="currentStep === 2"
        @next="currentStep++"
        @prev="currentStep--"
        @update-result="
          (res: Result) => {
            result = res
          }
        "
      />
      <step-three
        v-if="currentStep === 3 && result !== null"
        @next="currentStep++"
        @prev="currentStep--"
        :result="result"
      />
      <step-four
        v-if="currentStep === 4 && result !== null"
        :result="result"
        @prev="currentStep--"
      />
      <error-view v-if="currentStep >= 3 && result === null" />
    </n-flex>
  </n-scrollbar>
</template>

<script setup lang="ts">
// Third-party library imports
import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'

// Local imports
import StepOne from './step1.vue'
import StepTwo from './step2.vue'
import StepThree from './step3.vue'
import StepFour from './step4.vue'
import type { Result } from './index'
import errorView from '../error-view.vue'

// configure i18n
const { t } = useI18n()

let currentStep = ref(1)
watch(currentStep, () => {
  // scroll to top smoothly with offset
  let element = document.getElementById('mini-dashboard')
  if (element) {
    const offset = 100
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
})

let result: Ref<Result | null> = ref(null)
</script>

<style scoped></style>
