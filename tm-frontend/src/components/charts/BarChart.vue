<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'
import type { EChartsOption } from 'echarts'

interface DataItem {
  name: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DataItem[]
  title?: string
  height?: number
  color?: string
  horizontal?: boolean
  showLabel?: boolean
  barWidth?: number | string
}>(), {
  height: 300,
  color: '#6366f1',
  horizontal: false,
  showLabel: true,
  barWidth: '60%'
})

const options = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (params: any) => {
      if (!params.length) return ''
      const data = params[0]
      return `${data.name}<br/>${data.marker} ${data.value.toFixed(1)}`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true
  },
  xAxis: props.horizontal ? {
    type: 'value',
    axisLabel: { color: '#94a3b8', fontSize: 11 },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
  } : {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8', fontSize: 11, rotate: props.data.length > 7 ? 30 : 0 }
  },
  yAxis: props.horizontal ? {
    type: 'category',
    data: props.data.map(item => item.name),
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8', fontSize: 11 }
  } : {
    type: 'value',
    axisLabel: { color: '#94a3b8', fontSize: 11 },
    splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
  },
  series: [{
    type: 'bar',
    data: props.data.map((item, index) => ({
      value: item.value,
      name: item.name,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: props.horizontal ? 1 : 0, y2: props.horizontal ? 0 : 1,
          colorStops: [
            { offset: 0, color: props.color },
            { offset: 1, color: `${props.color}99` }
          ]
        },
        borderRadius: props.horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]
      }
    })),
    barWidth: props.barWidth,
    label: {
      show: props.showLabel,
      position: props.horizontal ? 'right' : 'top',
      formatter: '{c}',
      color: '#94a3b8',
      fontSize: 11
    }
  }]
}))
</script>

<template>
  <BaseChart :options="options" :height="height" />
</template>
