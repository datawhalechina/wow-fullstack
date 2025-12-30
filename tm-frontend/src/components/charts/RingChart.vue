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
  innerRadius?: number | string
  outerRadius?: number | string
  center?: [string | number, string | number]
}>(), {
  height: 300,
  innerRadius: '35%',
  outerRadius: '60%',
  center: () => ['50%', '50%']
})

const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

const options = computed<EChartsOption>(() => {
  const total = props.data.reduce((sum, item) => sum + item.value, 0)

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}<br/>${params.value}h (${params.percent.toFixed(1)}%)`
      }
    },
    legend: {
      orient: 'vertical',
      top: '5%',
      right: '5%',
      textStyle: { color: '#94a3b8', fontSize: 12 }
    },
    series: [{
      type: 'pie',
      radius: [props.innerRadius, props.outerRadius],
      center: props.center,
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#0f172a',
        borderWidth: 3
      },
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}\n{d}%',
        color: '#94a3b8',
        fontSize: 11
      },
      labelLine: {
        show: true,
        length: 15,
        length2: 10,
        lineStyle: { color: '#475569' }
      },
      emphasis: {
        scale: true,
        scaleSize: 8
      },
      data: props.data.map((item, index) => ({
        ...item,
        itemStyle: { color: colors[index % colors.length] }
      }))
    },
    // 中心文字
    {
      type: 'pie',
      radius: ['0%', '35%'],
      center: props.center,
      label: { show: false },
      data: [{
        value: total,
        name: '总计',
        itemStyle: { color: 'transparent' }
      }]
    }]
  }
})

// 计算总计用于显示
const totalHours = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0).toFixed(1)
})
</script>

<template>
  <div class="ring-chart-wrapper">
    <BaseChart :options="options" :height="height" />
    <div class="ring-center-text">
      <span class="total-value">{{ totalHours }}h</span>
      <span class="total-label">总计</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ring-chart-wrapper {
  position: relative;
  width: 100%;
}

.ring-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  text-align: center;
  pointer-events: none;
}

.total-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #f1f5f9;
}

.total-label {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}
</style>
