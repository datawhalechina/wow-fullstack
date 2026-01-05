<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../../store'
import {
    fetchUserDetailAPI,
    fetchStudyCalendarAPI,
    fetchCourseProgressAPI,
    fetchTimeAnalysisAPI,
    fetchPersonalTrendAPI
} from '../../request/statistics/api'
import ChartCard from '../../components/charts/ChartCard.vue'
import BaseChart from '../../components/charts/BaseChart.vue'
import RingChart from '../../components/charts/RingChart.vue'

const route = useRoute()
const userStore = useUserStore()
const isAdmin = computed(() => userStore.role === 'admin')

// 当前查看的用户ID
const currentUserId = computed(() => {
    const userId = Number(route.params.id)
    return userId || userStore.id
})

const isViewingSelf = computed(() => currentUserId.value === userStore.id)

// 数据
const loading = ref(false)
const userDetail = ref<any>(null)
const calendarData = ref<any[]>([])
const courseProgress = ref<any[]>([])
const timeAnalysis = ref<any>(null)
const trendData = ref<any[]>([])

// 学习趋势图配置
const trendChartOptions = computed(() => ({
    tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
            if (!params.length) return ''
            const data = params[0]
            return `${data.name}<br/>学习时长: ${data.value}h`
        }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
        type: 'category',
        data: trendData.value.map(item => item.date),
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
    },
    yAxis: {
        type: 'value',
        name: '小时',
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
    },
    series: [{
        name: '学习时长',
        type: 'line',
        data: trendData.value.map(item => item.value),
        smooth: true,
        areaStyle: {
            color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
                    { offset: 1, color: 'rgba(99, 102, 241, 0)' }
                ]
            }
        },
        itemStyle: { color: '#6366f1' },
        lineStyle: { width: 3, color: '#6366f1' }
    }]
}))

// 时间分布环形图数据
const distributionData = computed(() => timeAnalysis.value?.distribution || [])

// 计划vs实际对比图
const comparisonChartOptions = computed(() => {
    if (!timeAnalysis.value) return {}

    const planned = timeAnalysis.value.planned_hours || 0
    const actual = timeAnalysis.value.actual_hours || 0

    return {
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}h'
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['计划', '实际'],
            axisLine: { lineStyle: { color: '#334155' } },
            axisLabel: { color: '#94a3b8', fontSize: 12 }
        },
        yAxis: {
            type: 'value',
            name: '小时',
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
        },
        series: [{
            type: 'bar',
            data: [
                {
                    value: planned,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#94a3b8' },
                                { offset: 1, color: '#64748b' }
                            ]
                        },
                        borderRadius: [4, 4, 0, 0]
                    }
                },
                {
                    value: actual,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#10b981' },
                                { offset: 1, color: '#34d399' }
                            ]
                        },
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ],
            barWidth: '40%'
        }]
    }
})

// 加载数据
const loadData = async () => {
    if (!isViewingSelf.value && !isAdmin.value) {
        ElMessage.error('无权访问此用户数据')
        return
    }

    loading.value = true
    try {
        const userId = currentUserId.value

        const [detailRes, calendarRes, courseRes, analysisRes, trendRes] = await Promise.all([
            fetchUserDetailAPI(userId),
            fetchStudyCalendarAPI(userId, 365),
            fetchCourseProgressAPI(userId),
            fetchTimeAnalysisAPI(userId, 30),
            fetchPersonalTrendAPI({ days: 7 })
        ])

        if (detailRes.code === 200) {
            userDetail.value = detailRes.data
        }
        if (calendarRes.code === 200) {
            calendarData.value = calendarRes.data
        }
        if (courseRes.code === 200) {
            courseProgress.value = courseRes.data
        }
        if (analysisRes.code === 200) {
            timeAnalysis.value = analysisRes.data
        }
        if (trendRes.code === 200) {
            trendData.value = trendRes.data
        }
    } catch (error) {
        console.error('加载数据失败:', error)
        ElMessage.error('加载数据失败')
    } finally {
        loading.value = false
    }
}

// 监听路由参数变化
watch(() => route.params.id, () => {
    if (route.params.id) {
        loadData()
    }
})

onMounted(() => {
    loadData()
})
</script>

<template>
    <div class="user-analysis" v-loading="loading">
        <!-- 用户信息卡片 -->
        <el-card v-if="userDetail?.user" class="user-info-card">
            <div class="user-header">
                <el-avatar :size="80" :src="userDetail.user.avantar || ''">
                    {{ userDetail.user.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <div class="user-details">
                    <h2>{{ userDetail.user.username }}</h2>
                    <div class="user-meta">
                        <el-tag v-if="userDetail.user.bumen" type="info" size="small">
                            {{ userDetail.user.bumen }}
                        </el-tag>
                        <el-tag v-if="userDetail.user.location" type="info" size="small">
                            {{ userDetail.user.location }}
                        </el-tag>
                    </div>
                </div>
                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-value">{{ userDetail.user.shuzhi }}</span>
                        <span class="stat-label">塾值</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ userDetail.user.learn_hour }}h</span>
                        <span class="stat-label">学习时长</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">{{ userDetail.user.create_hour }}h</span>
                        <span class="stat-label">创作时长</span>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 图表区域 -->
        <div class="charts-grid">
            <!-- 学习时长趋势 -->
            <ChartCard title="学习时长趋势" subtitle="最近7天" class="chart-item span-2">
                <BaseChart :options="trendChartOptions" height="280px" />
            </ChartCard>

            <!-- 时间分布 -->
            <ChartCard title="时间分配" class="chart-item">
                <RingChart :data="distributionData" :height="280" />
            </ChartCard>

            <!-- 计划vs实际 -->
            <ChartCard title="计划 vs 实际" subtitle="最近30天" class="chart-item">
                <BaseChart :options="comparisonChartOptions" height="280px" />
            </ChartCard>

            <!-- 完成率 -->
            <ChartCard title="任务完成率" class="chart-item">
                <div class="completion-rate">
                    <el-progress
                        type="circle"
                        :percentage="timeAnalysis?.completion_rate || 0"
                        :color="[
                            { color: '#f56c6c', percentage: 20 },
                            { color: '#e6a23c', percentage: 40 },
                            { color: '#5cb87a', percentage: 60 },
                            { color: '#1989fa', percentage: 80 },
                            { color: '#6f7ad3', percentage: 100 }
                        ]"
                        :width="160"
                    >
                        <span class="progress-text">{{ timeAnalysis?.completion_rate || 0 }}%</span>
                    </el-progress>
                </div>
            </ChartCard>
        </div>

        <!-- 课程学习进度 -->
        <el-card class="course-progress-card">
            <template #header>
                <div class="card-header">
                    <span>课程学习进度</span>
                    <el-tag type="success" size="small">共 {{ courseProgress.length }} 门课程</el-tag>
                </div>
            </template>
            <div v-if="courseProgress.length > 0" class="course-list">
                <div v-for="course in courseProgress" :key="course.course_name" class="course-item">
                    <div class="course-info">
                        <h4>{{ course.course_name }}</h4>
                        <span class="course-meta">{{ course.lessons_count }} 课时 · {{ course.total_hours }}h</span>
                    </div>
                    <div class="recent-lessons">
                        <el-tag
                            v-for="(lesson, idx) in course.recent_lessons.slice(0, 3)"
                            :key="idx"
                            size="small"
                            type="info"
                        >
                            {{ lesson.title }}
                        </el-tag>
                    </div>
                </div>
            </div>
            <el-empty v-else description="暂无学习记录" />
        </el-card>

        <!-- 学习日历热力图 -->
        <el-card class="calendar-card">
            <template #header>
                <div class="card-header">
                    <span>学习日历</span>
                    <el-tag type="info" size="small">最近一年</el-tag>
                </div>
            </template>
            <div v-if="calendarData.length > 0" class="calendar-heatmap">
                <div
                    v-for="day in calendarData"
                    :key="day.date"
                    class="calendar-day"
                    :class="`level-${day.level}`"
                    :title="`${day.date}: ${day.value}h`"
                >
                    <span class="day-date">{{ day.date.slice(5) }}</span>
                </div>
            </div>
            <el-empty v-else description="暂无学习记录" />
        </el-card>

        <!-- 最近任务 -->
        <el-card v-if="userDetail?.recent_tasks?.length > 0" class="recent-tasks-card">
            <template #header>
                <div class="card-header">
                    <span>最近完成的任务</span>
                    <el-tag type="info" size="small">最近10条</el-tag>
                </div>
            </template>
            <el-table :data="userDetail.recent_tasks" stripe style="width: 100%">
                <el-table-column prop="1" label="主题" width="150" />
                <el-table-column prop="3" label="内容" min-width="200" show-overflow-tooltip />
                <el-table-column prop="7" label="用时(分钟)" width="100" align="center">
                    <template #default="{ row }">
                        {{ row[7] || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="8" label="日期" width="120">
                    <template #default="{ row }">
                        {{ row[8] || '-' }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style scoped lang="scss">
.user-analysis {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.user-info-card {
    margin-bottom: 24px;
}

.user-header {
    display: flex;
    align-items: center;
    gap: 24px;
}

.user-details {
    flex: 1;

    h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        color: #303133;
    }

    .user-meta {
        display: flex;
        gap: 8px;
    }
}

.user-stats {
    display: flex;
    gap: 32px;

    .stat-item {
        text-align: center;

        .stat-value {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: #6366f1;
        }

        .stat-label {
            font-size: 12px;
            color: #94a3b8;
        }
    }
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

.completion-rate {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    .progress-text {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
    }
}

.course-progress-card {
    margin-bottom: 20px;
}

.course-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
}

.course-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    .course-info {
        h4 {
            margin: 0 0 4px 0;
            font-size: 14px;
            color: #1e293b;
        }

        .course-meta {
            font-size: 12px;
            color: #64748b;
        }
    }

    .recent-lessons {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: flex-end;
    }
}

.calendar-card {
    margin-bottom: 20px;
}

.calendar-heatmap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 4px;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 10px;
    color: #475569;
    background: #f1f5f9;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }

    &.level-1 { background: #c7d2fe; }
    &.level-2 { background: #a5b4fc; }
    &.level-3 { background: #818cf8; }
    &.level-4 { background: #6366f1; color: white; }

    .day-date {
        writing-mode: vertical-rl;
        text-orientation: mixed;
    }
}

.recent-tasks-card {
    :deep(.el-card__body) {
        padding: 0;
    }
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
