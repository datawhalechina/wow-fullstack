<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'

interface DataPoint {
  date: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataPoint[]
  title?: string
  subtitle?: string
  height?: number
  color?: string
  areaStyle?: boolean
  smooth?: boolean
}>(), {
  height: 300,
  color: '#6366f1',
  areaStyle: true,
  smooth: true
})

const options = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      if (!params.length) return ''
      const data = params[0]
      return `${data.name}<br/>${data.marker} ${data.seriesName}: ${data.value.toFixed(1)}h`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.data.map(item => item.date),
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 }
  },
  yAxis: {
    type: 'value',
    name: '小时',
    axisLine: { show: false },
    axisLabel: { color: '#94a3b8', fontSize: 11 },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
  },
  series: [{
    name: '学习时长',
    type: 'line',
    smooth: props.smooth,
    symbol: 'circle',
    symbolSize: 8,
    lineStyle: { width: 3, color: props.color },
    itemStyle: { color: props.color, borderWidth: 2, borderColor: '#0f172a' },
    areaStyle: props.areaStyle ? {
      color: {
        type: 'linear',
        x: 0, y: 0, x2: 0, y2: 1,
        colorStops: [
          { offset: 0, color: `${props.color}80` },
          { offset: 1, color: `${props.color}00` }
        ]
      }
    } : undefined,
    data: props.data.map(item => item.value)
  }]
}))
</script>

<template>
  <BaseChart :options="options" :height="height" />
</template>
