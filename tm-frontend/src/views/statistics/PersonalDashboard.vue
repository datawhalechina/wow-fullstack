<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLoginStore } from '../../store'
import {
    fetchPersonalOverviewAPI,
    fetchPersonalTrendAPI,
    fetchShuzhiHistoryAPI,
    fetchTimeDistributionAPI
} from '../../request/statistics/api'
import ChartCard from '../../components/charts/ChartCard.vue'
import TrendChart from '../../components/charts/TrendChart.vue'
import PieChart from '../../components/charts/PieChart.vue'
import RingChart from '../../components/charts/RingChart.vue'

const loginstate = useLoginStore()
const loading = ref(false)
const overview = ref<any>(null)
const trendData = ref<any[]>([])
const shuzhiHistory = ref<any[]>([])
const timeDistribution = ref<any[]>([])

// 统计卡片数据
const statCards = computed(() => [
    {
        label: '当前塾值',
        value: overview.value?.shuzhi?.toFixed(1) || '0',
        icon: 'Coin',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
    },
    {
        label: '学习时长',
        value: `${overview.value?.learn_hours?.toFixed(1) || 0}h`,
        icon: 'Reading',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    },
    {
        label: '创作时长',
        value: `${overview.value?.create_hours?.toFixed(1) || 0}h`,
        icon: 'Edit',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
        label: '任务完成率',
        value: `${overview.value?.completion_rate || 0}%`,
        icon: 'CircleCheck',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    }
])

// 饼图数据
const completionPieData = computed(() => [
    { name: '已完成', value: overview.value?.finished_tasks || 0 },
    { name: '未完成', value: (overview.value?.total_tasks || 0) - (overview.value?.finished_tasks || 0) }
])

// 环形图数据
const ringChartData = computed(() => timeDistribution.value)

onMounted(async () => {
    loading.value = true
    try {
        const [overviewRes, trendRes, shuzhiRes, timeDistRes] = await Promise.all([
            fetchPersonalOverviewAPI(),
            fetchPersonalTrendAPI({ days: 7 }),
            fetchShuzhiHistoryAPI(),
            fetchTimeDistributionAPI()
        ])
        overview.value = overviewRes.data
        trendData.value = trendRes.data || []
        shuzhiHistory.value = shuzhiRes.data || []
        timeDistribution.value = timeDistRes.data || []
    } catch (error) {
        console.error('获取统计数据失败:', error)
        ElMessage.error('获取统计数据失败')
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="personal-dashboard" v-loading="loading">
        <!-- 统计卡片 -->
        <div class="stat-cards">
            <div v-for="stat in statCards" :key="stat.label" class="stat-card" :style="{ background: stat.gradient }">
                <div class="stat-icon">
                    <el-icon :size="32"><component :is="stat.icon" /></el-icon>
                </div>
                <div class="stat-info">
                    <span class="stat-value">{{ stat.value }}</span>
                    <span class="stat-label">{{ stat.label }}</span>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-grid">
            <ChartCard title="学习时长趋势" subtitle="最近7天" class="chart-item span-2">
                <TrendChart :data="trendData" :height="280" />
            </ChartCard>

            <ChartCard title="任务完成情况" class="chart-item">
                <PieChart :data="completionPieData" :height="280" :donut="true" />
            </ChartCard>

            <ChartCard title="时间分配" class="chart-item">
                <RingChart :data="ringChartData" :height="280" />
            </ChartCard>
        </div>

        <!-- 塾值变化记录 -->
        <el-card class="shuzhi-table">
            <template #header>
                <div class="card-header">
                    <span>塾值记录</span>
                    <el-tag type="success" size="small">共 {{ shuzhiHistory.length }} 条</el-tag>
                </div>
            </template>
            <el-table :data="shuzhiHistory" stripe max-height="400" style="width: 100%">
                <el-table-column prop="target_type" label="事项类型" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.target_type === '收入' ? 'success' : 'warning'">
                            {{ row.target_type }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="target_title" label="标题" min-width="150" show-overflow-tooltip />
                <el-table-column prop="amount" label="单值" width="80" align="center">
                    <template #default="{ row }">
                        <span :class="row.amount > 0 ? 'positive' : 'negative'">
                            {{ row.amount > 0 ? '+' : '' }}{{ row.amount }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="balance" label="塾值" width="100" align="center">
                    <template #default="{ row }">
                        <strong>{{ row.balance }}</strong>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间" width="160" />
            </el-table>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.personal-dashboard {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.stat-cards {
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

.stat-card {
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

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
}

.stat-value {
    display: block;
    font-size: 28px;
    font-weight: 700;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 24px;

    .span-2 {
        grid-column: span 2;

        @media (max-width: 900px) {
            grid-column: span 1;
        }
    }

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
}

.chart-item {
    :deep(.el-card__body) {
        padding: 16px;
    }
}

.shuzhi-table {
    :deep(.el-card__body) {
        padding: 0;
    }
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.positive {
    color: #10b981;
    font-weight: 600;
}

.negative {
    color: #ef4444;
    font-weight: 600;
}
</style>
