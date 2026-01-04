<script setup lang="ts">
import { computed } from 'vue'

export interface ExecutionOutput {
  stdout?: string
  stderr?: string
  error?: string
  exitCode?: number
  html?: string
  rowCount?: number
  success?: boolean
}

interface Props {
  output: ExecutionOutput | null
  loading: boolean
  language: string
}

const props = defineProps<Props>()

// 判断是否需要 iframe 预览
const needsIframe = computed(() => {
  const lang = props.language.toLowerCase()
  return ['html', 'css', 'javascript', 'js', 'vue'].includes(lang)
})

// 判断是否有输出
const hasOutput = computed(() => {
  if (!props.output) return false
  return !!(props.output.stdout || props.output.stderr || props.output.error || props.output.html)
})

// iframe 预览的完整 HTML
const iframeContent = computed(() => {
  // 如果有 html 内容，直接使用
  if (props.output?.html) {
    return props.output.html
  }
  // 如果是 Web 语言但没有 html，返回默认提示
  if (needsIframe.value && props.output) {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
    .info { color: #059669; }
    .empty { color: #64748b; font-style: italic; }
  </style>
</head>
<body>
  <p class="info">✓ 代码已执行</p>
  <p class="empty">此代码不产生可视输出（如纯逻辑代码），或无输出内容。</p>
  <p style="font-size: 12px; color: #999;">尝试添加 console.log() 或 DOM 操作来查看输出</p>
</body>
</html>`
  }
  return ''
})

// 判断是否应该显示 iframe（有输出或是 Web 语言且执行完成）
const shouldShowIframe = computed(() => {
  return needsIframe.value && props.output && !props.loading
})

// 判断是否成功
const isSuccess = computed(() => {
  if (!props.output) return false
  // 如果有 exitCode，0 表示成功
  if (props.output.exitCode !== undefined) {
    return props.output.exitCode === 0
  }
  // 如果有 success 字段
  if (props.output.success !== undefined) {
    return props.output.success
  }
  // 如果只有 stdout 没有 stderr/error，认为成功
  return !!(props.output.stdout && !props.output.stderr && !props.output.error)
})

// 状态标签类型
const statusType = computed(() => {
  if (props.loading) return 'info'
  if (!props.output) return 'info'
  if (props.output.error || props.output.stderr || props.output.exitCode && props.output.exitCode !== 0) {
    return 'danger'
  }
  return 'success'
})

// 状态文本
const statusText = computed(() => {
  if (props.loading) return '执行中...'
  if (!props.output) return '等待运行'
  if (props.output.error) return '执行错误'
  if (props.output.stderr) return '执行完成（有错误）'
  if (props.output.exitCode !== undefined && props.output.exitCode !== 0) {
    return `退出码: ${props.output.exitCode}`
  }
  return '执行成功'
})

// 格式化输出文本（保留换行和空格）
const formatOutput = (text: string) => {
  if (!text) return ''
  return text
}
</script>

<template>
  <div class="execution-result">
    <!-- 状态栏 -->
    <div class="result-status" :class="`status-${statusType}`">
      <span class="status-text">{{ statusText }}</span>
      <span v-if="output?.rowCount !== undefined && output.rowCount > 0" class="row-count">
        {{ output.rowCount }} 行
      </span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="result-content loading-state">
      <el-icon class="is-loading" :size="24">
        <Loading />
      </el-icon>
      <span>正在执行代码...</span>
    </div>

    <!-- iframe 预览模式 -->
    <iframe
      v-else-if="shouldShowIframe"
      class="preview-iframe"
      :srcdoc="iframeContent"
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="代码预览"
    ></iframe>

    <!-- 文本输出模式 -->
    <div v-else-if="hasOutput" class="result-content text-output">
      <!-- 标准输出 -->
      <pre v-if="output?.stdout" class="output stdout">{{ formatOutput(output.stdout) }}</pre>

      <!-- 标准错误 -->
      <pre v-if="output?.stderr" class="output stderr">{{ formatOutput(output.stderr) }}</pre>

      <!-- 错误信息 -->
      <pre v-if="output?.error" class="output error">{{ formatOutput(output.error) }}</pre>

      <!-- 退出码提示 -->
      <div v-if="output?.exitCode !== undefined && output.exitCode !== 0" class="exit-code">
        程序退出码: {{ output.exitCode }}
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="result-content empty-state">
      <el-empty description="点击运行按钮查看代码执行结果" :image-size="60" />
    </div>
  </div>
</template>

<script lang="ts">
import { Loading } from '@element-plus/icons-vue'
</script>

<style scoped>
.execution-result {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
}

.result-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
}

.status-success {
  background: #f0f9ff;
  color: #059669;
}

.status-danger {
  background: #fef2f2;
  color: #dc2626;
}

.status-info {
  background: #f8fafc;
  color: #64748b;
}

.row-count {
  font-size: 12px;
  opacity: 0.8;
}

.result-content {
  flex: 1;
  overflow: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: #64748b;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.text-output {
  padding: 12px;
}

.output {
  margin: 0 0 12px 0;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.output.stdout {
  background: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

.output.stderr {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.output.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.exit-code {
  padding: 8px 12px;
  background: #fff7ed;
  color: #ea580c;
  border-radius: 4px;
  font-size: 13px;
  border: 1px solid #fed7aa;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
