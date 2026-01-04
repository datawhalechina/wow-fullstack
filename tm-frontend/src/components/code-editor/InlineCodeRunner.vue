<script setup lang="ts">
import { ref, computed } from 'vue'
import MonacoEditor from './MonacoEditor.vue'
import ExecutionResult from './ExecutionResult.vue'
import type { ExecutionOutput } from './ExecutionResult.vue'
import { SUPPORTED_LANGUAGES, normalizeLanguage } from '@/utils/languageMapping'

interface Props {
  code: string
  language: string
  minHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: '400px'
})

const emit = defineEmits<{
  close: []
}>()

// 当前选择的语言
const selectedLanguage = ref<string>(normalizeLanguage(props.language))

// 本地代码（可编辑）
const localCode = ref(props.code)

// 执行状态
const output = ref<ExecutionOutput | null>(null)
const loading = ref(false)

// 编辑器高度
const editorHeight = computed(() => {
  return props.minHeight === '400px' ? '350px' : '300px'
})

// 重置代码
const resetCode = () => {
  localCode.value = props.code
  output.value = null
}

// 运行代码
const runCode = async () => {
  loading.value = true
  output.value = null

  try {
    const { executeCode } = await import('@/composables/useCodeExecution')
    output.value = await executeCode(selectedLanguage.value, localCode.value)
  } catch (error: any) {
    output.value = {
      error: error?.message || '执行失败，请检查代码是否正确'
    }
  } finally {
    loading.value = false
  }
}

// 处理语言切换
const handleLanguageChange = (newLang: string) => {
  selectedLanguage.value = newLang
}
</script>

<template>
  <div class="inline-code-runner" :style="{ minHeight }">
    <!-- 工具栏 -->
    <div class="runner-header">
      <div class="header-left">
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
        <span class="header-tip">点击运行查看结果</span>
      </div>
      <div class="header-actions">
        <el-button size="small" @click="resetCode" :disabled="localCode === code">
          <el-icon><RefreshLeft /></el-icon>
          重置
        </el-button>
        <el-button size="small" @click="emit('close')">
          <el-icon><Close /></el-icon>
          收起
        </el-button>
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          @click="runCode"
        >
          <el-icon><VideoPlay /></el-icon>
          运行
        </el-button>
      </div>
    </div>

    <!-- 主体内容：编辑器 + 结果 -->
    <div class="runner-body">
      <div class="editor-pane">
        <div class="pane-header">
          <span>代码</span>
        </div>
        <MonacoEditor
          v-model="localCode"
          :language="selectedLanguage"
          :height="editorHeight"
        />
      </div>
      <div class="result-pane">
        <div class="pane-header">
          <span>运行结果</span>
        </div>
        <ExecutionResult
          :output="output"
          :loading="loading"
          :language="selectedLanguage"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RefreshLeft, Close, VideoPlay } from '@element-plus/icons-vue'
</script>

<style scoped>
.inline-code-runner {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.runner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.language-selector {
  width: 140px;
  flex-shrink: 0;
}

.header-tip {
  font-size: 13px;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.runner-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 350px;
}

.editor-pane,
.result-pane {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}

.result-pane {
  border-right: none;
}

.pane-header {
  padding: 8px 16px;
  background: #fafbfc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 响应式：小屏幕改为单栏 */
@media (max-width: 1024px) {
  .runner-body {
    grid-template-columns: 1fr;
  }

  .editor-pane {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
}
</style>
