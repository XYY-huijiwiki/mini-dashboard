<template>
  <n-scrollbar>
    <n-spin :show="loading">
      <error-view v-if="error" />
      <shadow-root abstract v-else>
        <shadow-style>{{ GuthubMarkdownCss }}</shadow-style>
        <shadow-style>
          .markdown-body { border-radius: 6px; border: 1px solid var(--borderColor-default);
          box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px;
          } @media (max-width: 767px) { .markdown-body { padding: 15px; } }
        </shadow-style>
        <div v-html="docHTML" class="markdown-body"></div>
      </shadow-root>
    </n-spin>
  </n-scrollbar>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import errorView from './error-view.vue'
import { useLocalesStore } from '@/stores/locales'
import { storeToRefs } from 'pinia'
import GuthubMarkdownCss from 'github-markdown-css?raw'
import { ShadowRoot, ShadowStyle } from 'vue-shadow-dom'
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts'

const { langCode } = storeToRefs(useLocalesStore())
const route = useRoute()
let loading = ref(true)
let error = ref(false)
let docHTML = ref('')
let docs = import.meta.glob(`@/locales/docs/*/*.md`, {
  import: 'default',
  as: 'raw',
})
let imgs = import.meta.glob(`@/locales/docs/img/*`, {
  import: 'default',
  as: 'url',
  eager: true,
})
if (import.meta.env.DEV) console.log(docs)
console.log(import.meta.env.BASE_URL)

onMounted(async () => {
  try {
    let docStr = await docs[`/src/locales/docs/${langCode.value}/${route.params.title}.md`]()
    docHTML.value = new MarkdownIt({
      html: true,
      typographer: true,
    })
      .use((md) => {
        md.core.ruler.push('replace_img_links', function (state) {
          const tokens = state.tokens
          tokens.forEach((token) => {
            if (token.type === 'inline' && token.children) {
              token.children.forEach((child) => {
                if (child.type === 'image') {
                  const orgSrc = child.attrGet('src')
                  let newOrigin = import.meta.env.DEV
                    ? new URL(import.meta.url).origin
                    : import.meta.env.BASE_URL
                  let newPath =
                    imgs[new URL(`http://localhost/src/locales/docs/img/${orgSrc}`).pathname]
                  if (newPath) {
                    child.attrSet('src', newOrigin + newPath)
                  }
                }
              })
            }
          })
        })
      })
      .use(MarkdownItGitHubAlerts)
      .render(docStr)
  } catch (e) {
    console.log(e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
