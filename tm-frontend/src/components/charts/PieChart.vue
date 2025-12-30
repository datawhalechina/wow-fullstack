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
  radius?: [string | number, string | number]
  center?: [string | number, string | number]
  donut?: boolean
}>(), {
  height: 300,
  radius: () => ['45%', '70%'],
  center: () => ['50%', '50%'],
  donut: false
})

const options = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'horizontal',
    bottom: '5%',
    left: 'center',
    textStyle: { color: '#94a3b8', fontSize: 12 }
  },
  series: [{
    type: 'pie',
    radius: props.donut ? props.radius : '70%',
    center: props.center,
    avoidLabelOverlap: true,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#1e293b',
      borderWidth: 2
    },
    label: {
      show: false,
      position: 'center'
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f1f5f9'
      },
      scale: true,
      scaleSize: 10
    },
    labelLine: { show: false },
    data: props.data.map((item, index) => ({
      ...item,
      itemStyle: {
        color: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'
        ][index % 6]
      }
    }))
  }]
}))
</script>

<template>
  <BaseChart :options="options" :height="height" />
</template>
