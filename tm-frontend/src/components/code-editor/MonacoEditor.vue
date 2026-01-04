<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

// 配置 Monaco Editor Web Workers
self.MonacoEnvironment = {
  getWorker(_: string, label: string) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

interface Props {
  modelValue: string
  language: string
  readonly?: boolean
  height?: string
  minHeight?: string
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  height: '300px',
  minHeight: '200px',
  options: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLDivElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// Monaco Editor 默认配置
const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-light',
  readOnly: props.readonly,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 21,
  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
  lineNumbers: 'on',
  renderLineHighlight: 'all',
  selectOnLineNumbers: true,
  automaticLayout: true,
  tabSize: 4,
  wordWrap: 'off',
  formatOnPaste: true,
  formatOnType: true,
  autoIndent: 'full',
  bracketPairColorization: {
    enabled: true
  },
  guides: {
    bracketPairs: true,
    indentation: true
  },
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  mouseWheelZoom: true
}

onMounted(() => {
  if (!containerRef.value) return

  editor = monaco.editor.create(containerRef.value, {
    value: props.modelValue,
    language: mapLanguage(props.language),
    ...defaultOptions,
    ...props.options
  })

  editor.onDidChangeModelContent(() => {
    if (editor) {
      emit('update:modelValue', editor.getValue())
    }
  })
})

onUnmounted(() => {
  editor?.dispose()
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (editor && newValue !== editor.getValue()) {
    editor.setValue(newValue)
  }
})

// 监听语言变化
watch(() => props.language, (newLanguage) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, mapLanguage(newLanguage))
    }
  }
})

// 监听只读状态变化
watch(() => props.readonly, (readonly) => {
  if (editor) {
    editor.updateOptions({ readOnly: readonly })
  }
})

// 映射语言到 Monaco 支持的语言标识
function mapLanguage(lang: string): string {
  const languageMap: Record<string, string> = {
    'python': 'python',
    'py': 'python',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'html': 'html',
    'css': 'css',
    'sql': 'sql',
    'vue': 'html',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'markdown': 'markdown',
    'bash': 'shell',
    'sh': 'shell',
    'plaintext': 'plaintext'
  }
  return languageMap[lang.toLowerCase()] || 'plaintext'
}
</script>

<template>
  <div
    ref="containerRef"
    class="monaco-editor-container"
    :style="{ height, minHeight }"
  ></div>
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}
</style>
