<template>
  <n-scrollbar>
    <n-flex vertical>
      <n-steps :current="steps.current" :status="steps.status" class="m-4">
        <n-step title="登录" />
        <n-step title="填写" />
        <n-step title="预览" />
        <n-step title="提交" />
      </n-steps>
      <step-one v-if="steps.current === 1" @next="steps.current++" />
      <step-two
        v-if="steps.current === 2"
        @next="steps.current++"
        @prev="steps.current--"
        @update-result="
          (res) => {
            result = res
          }
        "
      />
      <step-three
        v-if="steps.current === 3 && result !== null"
        @next="steps.current++"
        @prev="steps.current--"
        :result="result"
      />
      <step-four
        v-if="steps.current === 4 && result !== null"
        :result="result"
        @prev="steps.current--"
      />
      <error-view v-if="steps.current >= 3 && result === null" />
    </n-flex>
  </n-scrollbar>
</template>

<script setup lang="ts">
// Third-party library imports
import { onMounted, ref } from 'vue'
import type { Ref } from 'vue'

// Local imports
import StepOne from './step1.vue'
import StepTwo from './step2.vue'
import StepThree from './step3.vue'
import StepFour from './step4.vue'
import type { Result } from './index'
import errorView from '../error-view.vue'

let steps = ref({
  current: 1,
  status: 'process',
})

let result: Ref<Result | null> = ref(null)
</script>

<style scoped></style>
