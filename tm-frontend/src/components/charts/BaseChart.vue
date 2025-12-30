<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, shallowRef } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { darkTheme } from '../../charts/theme'

const props = withDefaults(defineProps<{
  options: EChartsOption
  height?: string | number
  width?: string | number
  theme?: 'dark' | 'light'
  autoResize?: boolean
}>(), {
  height: 300,
  theme: 'dark',
  autoResize: true
})

const chartRef = ref<HTMLElement>()
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const initChart = () => {
  if (chartRef.value && !chartInstance.value) {
    chartInstance.value = echarts.init(chartRef.value, props.theme)
    chartInstance.value.setOption(props.options, true)
  }
}

const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.setOption(props.options, true)
  }
}

const resizeHandler = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

watch(() => props.options, updateChart, { deep: true })

onMounted(() => {
  initChart()
  if (props.autoResize) {
    window.addEventListener('resize', resizeHandler)
  }
})

onUnmounted(() => {
  if (props.autoResize) {
    window.removeEventListener('resize', resizeHandler)
  }
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
})

// 暴露resize方法
defineExpose({
  resize: resizeHandler,
  getInstance: () => chartInstance.value
})
</script>

<template>
  <div
    ref="chartRef"
    class="base-chart"
    :style="{ height: typeof height === 'number' ? `${height}px` : height, width: typeof width === 'number' ? `${width}px` : width }"
  />
</template>

<style scoped>
.base-chart {
  width: 100%;
  min-height: 200px;
}
</style>
