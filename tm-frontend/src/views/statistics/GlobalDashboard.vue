<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '../../store'
import {
    fetchGlobalOverviewAPI,
    fetchGlobalRankingAPI,
    fetchGrowthTrendAPI
} from '../../request/statistics/api'
import ChartCard from '../../components/charts/ChartCard.vue'
import BaseChart from '../../components/charts/BaseChart.vue'

const loginstate = useLoginStore()
const loading = ref(false)
const overview = ref<any>(null)
const ranking = ref<any[]>([])
const growthTrend = ref<any[]>([])
const rankingType = ref('shuzhi')

// 全局概览卡片
const overviewCards = computed(() => [
    {
        label: '总用户数',
        value: overview.value?.total_users || 0,
        icon: 'User',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
    },
    {
        label: '总塾值',
        value: overview.value?.total_shuzhi?.toFixed(1) || '0',
        icon: 'Coin',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    },
    {
        label: '总学习时长',
        value: `${overview.value?.total_learn_hours?.toFixed(1) || 0}h`,
        icon: 'Reading',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
        label: '总创作时长',
        value: `${overview.value?.total_create_hours?.toFixed(1) || 0}h`,
        icon: 'Edit',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    }
])

// 排行榜类型选项
const rankingTypes = [
    { label: '塾值排行', value: 'shuzhi' },
    { label: '学习时长排行', value: 'learn_hour' },
    { label: '创作时长排行', value: 'create_hour' }
]

// 用户增长趋势图配置
const growthChartOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
            if (!params.length) return ''
            const data = params[0]
            return `${data.name}<br/>${data.marker} 新增用户: ${data.value}`
        }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
        type: 'category',
        data: growthTrend.value.map(item => item.date),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 }
    },
    yAxis: {
        type: 'value',
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
    },
    series: [{
        name: '新增用户',
        type: 'bar',
        data: growthTrend.value.map(item => item.count),
        itemStyle: {
            color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#6366f1' },
                    { offset: 1, color: '#8b5cf6' }
                ]
            },
            borderRadius: [4, 4, 0, 0]
        },
        barWidth: '60%'
    }]
}))

// 用户分布饼图配置
const distributionChartOptions = computed(() => {
    const locationStats = overview.value?.location_stats || {}
    const data = Object.entries(locationStats).map(([name, value]) => ({
        name,
        value
    }))

    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
            textStyle: { color: '#94a3b8', fontSize: 12 }
        },
        series: [{
            type: 'pie',
            radius: ['35%', '60%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            itemStyle: {
                borderRadius: 6,
                borderColor: '#0f172a',
                borderWidth: 2
            },
            label: { show: false },
            data: data.map((item, index) => ({
                ...item,
                itemStyle: {
                    color: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
                }
            }))
        }]
    }
})

// 切换排行榜类型
const changeRankingType = async () => {
    loading.value = true
    try {
        const res = await fetchGlobalRankingAPI({
            type: rankingType.value,
            limit: 10
        })
        ranking.value = res.data || []
    } catch (error) {
        console.error('获取排行榜失败:', error)
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    loading.value = true
    try {
        const [overviewRes, rankingRes, growthRes] = await Promise.all([
            fetchGlobalOverviewAPI(),
            fetchGlobalRankingAPI({ type: rankingType.value, limit: 10 }),
            fetchGrowthTrendAPI({ days: 30 })
        ])
        overview.value = overviewRes.data
        ranking.value = rankingRes.data || []
        growthTrend.value = growthRes.data || []
    } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败')
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="global-dashboard" v-loading="loading">
        <!-- 概览卡片 -->
        <div class="overview-cards">
            <div v-for="card in overviewCards" :key="card.label" class="overview-card" :style="{ background: card.gradient }">
                <div class="card-icon">
                    <el-icon :size="28"><component :is="card.icon" /></el-icon>
                </div>
                <div class="card-info">
                    <span class="card-value">{{ card.value }}</span>
                    <span class="card-label">{{ card.label }}</span>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-row">
            <ChartCard title="用户增长趋势" subtitle="最近30天" class="chart-large">
                <BaseChart :options="growthChartOptions" height="350px" />
            </ChartCard>

            <ChartCard title="用户地区分布" class="chart-small">
                <BaseChart :options="distributionChartOptions" height="350px" />
            </ChartCard>
        </div>

        <!-- 排行榜 -->
        <div class="ranking-section">
            <el-card class="ranking-card">
                <template #header>
                    <div class="ranking-header">
                        <span>排行榜 Top 10</span>
                        <el-select v-model="rankingType" @change="changeRankingType" size="small" style="width: 140px">
                            <el-option v-for="type in rankingTypes" :key="type.value" :label="type.label" :value="type.value" />
                        </el-select>
                    </div>
                </template>
                <el-table :data="ranking" stripe style="width: 100%">
                    <el-table-column type="index" label="排名" width="80" align="center">
                        <template #default="{ $index }">
                            <span :class="['rank-badge', `rank-${$index + 1}`]">{{ $index + 1 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="用户名" min-width="120" />
                    <el-table-column prop="location" label="地区" width="100" />
                    <el-table-column prop="bumen" label="部门" width="100" />
                    <el-table-column :label="rankingType === 'shuzhi' ? '塾值' : '时长(h)'" width="120" align="center">
                        <template #default="{ row }">
                            <span class="rank-value">{{ row.value }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<style scoped lang="scss">
.global-dashboard {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.overview-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
}

.overview-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    border-radius: 16px;
    color: white;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
}

.card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
}

.card-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
}

.card-label {
    font-size: 14px;
    opacity: 0.9;
}

.charts-row {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
    margin-bottom: 24px;

    @media (max-width: 1000px) {
        grid-template-columns: 1fr;
    }
}

.chart-large,
.chart-small {
    :deep(.el-card__body) {
        padding: 16px;
    }
}

.ranking-card {
    :deep(.el-card__body) {
        padding: 0;
    }
}

.ranking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;

    &.rank-1 {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #1e293b;
    }

    &.rank-2 {
        background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
        color: white;
    }

    &.rank-3 {
        background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
        color: white;
    }

    &.rank-4,
    &.rank-5,
    &.rank-6 {
        background: #1e293b;
        color: #94a3b8;
    }

    &.rank-7,
    &.rank-8,
    &.rank-9,
    &.rank-10 {
        background: #0f172a;
        color: #64748b;
    }
}

.rank-value {
    font-weight: 600;
    color: #6366f1;
}
</style>
