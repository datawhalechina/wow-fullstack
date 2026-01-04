<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import hljs from 'highlight.js'
import InlineCodeRunner from './InlineCodeRunner.vue'
import { SUPPORTED_LANGUAGES, normalizeLanguage, getDefaultLanguageForCourse } from '@/utils/languageMapping'

interface Props {
  code: string
  language: string
  editable?: boolean
  courseDefaultLanguage?: string
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  courseDefaultLanguage: ''
})

// 是否展开为编辑器
const isExpanded = ref(false)

// 当前选择的语言（优先使用传入的语言，否则使用课程默认语言）
const selectedLanguage = ref<string>(props.language || props.courseDefaultLanguage || 'plaintext')

// 监听语言变化，更新选中状态
watch(() => props.language, (newLang) => {
  if (newLang) {
    selectedLanguage.value = normalizeLanguage(newLang)
  }
})

// 监听课程默认语言变化（仅在没有明确语言时使用）
watch(() => props.courseDefaultLanguage, (newLang) => {
  // 如果当前语言是 plaintext 且有课程默认语言，则使用课程默认语言
  if (newLang && selectedLanguage.value === 'plaintext') {
    selectedLanguage.value = newLang
  }
}, { immediate: true })

// 支持运行的语言列表
const runnableLanguages = ['python', 'py', 'vue', 'sql', 'html', 'css', 'javascript', 'js', 'typescript', 'ts']

// 判断当前语言是否支持运行
const isRunnable = computed(() => {
  return runnableLanguages.includes(selectedLanguage.value.toLowerCase())
})

// 代码高亮
const highlightedCode = computed(() => {
  const safeLang = hljs.getLanguage(selectedLanguage.value) ? selectedLanguage.value : 'plaintext'
  return hljs.highlight(props.code, { language: safeLang }).value
})

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 关闭编辑器
const closeEditor = () => {
  isExpanded.value = false
}

// 处理语言切换
const handleLanguageChange = (newLang: string) => {
  selectedLanguage.value = newLang
}
</script>

<template>
  <div class="code-block-wrapper">
    <!-- 折叠状态：显示静态代码块 -->
    <div v-if="!isExpanded" class="static-code-block">
      <div class="code-header">
        <el-select
          v-model="selectedLanguage"
          size="small"
          class="language-selector"
          @change="handleLanguageChange"
        >
          <el-option
            v-for="lang in SUPPORTED_LANGUAGES"
            :key="lang.id"
            :label="lang.name"
            :value="lang.id"
          />
        </el-select>
        <el-button
          v-if="isRunnable && editable"
          type="primary"
          size="small"
          @click="toggleExpand"
        >
          <el-icon><VideoPlay /></el-icon>
          运行
        </el-button>
      </div>
      <pre class="code-content"><code class="hljs" :class="`language-${selectedLanguage}`" v-html="highlightedCode"></code></pre>
    </div>

    <!-- 展开状态：显示内联编辑器 -->
    <InlineCodeRunner
      v-else
      :code="code"
      :language="selectedLanguage"
      @close="closeEditor"
    />
  </div>
</template>

<script lang="ts">
import { VideoPlay } from '@element-plus/icons-vue'
</script>

<style scoped>
.code-block-wrapper {
  margin: 16px 0;
}

.static-code-block {
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.language-selector {
  width: 140px;
  flex-shrink: 0;
}

.run-button {
  font-size: 13px;
}

.code-content {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  max-width: 100%;
}

.code-content code {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
  word-wrap: normal;
  word-break: normal;
}
</style>
