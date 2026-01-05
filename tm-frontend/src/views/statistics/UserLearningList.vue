<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useUserStore } from '../../store'
import {
    fetchUsersLearningListAPI,
    fetchInactiveUsersAPI,
    fetchLocationsAPI,
    fetchDepartmentsAPI
} from '../../request/statistics/api'
import { checkInactiveUsersAPI } from '../../request/config/api'
import ChartCard from '../../components/charts/ChartCard.vue'
import BaseChart from '../../components/charts/BaseChart.vue'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.role === 'admin')

// 数据
const loading = ref(false)
const usersData = ref<any>(null)
const inactiveData = ref<any>(null)
const locations = ref<string[]>([])
const departments = ref<string[]>([])

// 筛选和分页
const filters = ref({
    location: '',
    bumen: '',
    sort_by: 'learn_hour',
    sort_order: 'desc'
})
const pagination = ref({
    page: 1,
    pageSize: 20,
    total: 0
})

// 统计卡片
const statCards = computed(() => [
    {
        label: '总用户数',
        value: usersData.value?.total || 0,
        icon: 'User',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
    },
    {
        label: '活跃用户',
        value: usersData.value?.active_users || 0,
        icon: 'UserFilled',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
    },
    {
        label: '不活跃用户',
        value: usersData.value?.inactive_users || 0,
        icon: 'Warning',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    },
    {
        label: '平均学习时长',
        value: `${usersData.value?.avg_learn_hours || 0}h`,
        icon: 'Clock',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
    }
])

// 不活跃用户图表配置
const inactiveChartOptions = computed(() => {
    const users = inactiveData.value?.users || []
    const topInactive = users.slice(0, 10)

    return {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                if (!params.length) return ''
                const data = params[0]
                return `${data.name}<br/>不活跃天数: ${data.value}天`
            }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
        xAxis: {
            type: 'category',
            data: topInactive.map((u: any) => u.username),
            axisLine: { lineStyle: { color: '#334155' } },
            axisLabel: { color: '#94a3b8', fontSize: 11, rotate: 30 }
        },
        yAxis: {
            type: 'value',
            name: '天数',
            axisLabel: { color: '#94a3b8', fontSize: 11 },
            splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } }
        },
        series: [{
            name: '不活跃天数',
            type: 'bar',
            data: topInactive.map((u: any) => u.days_inactive),
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#f59e0b' },
                        { offset: 1, color: '#ef4444' }
                    ]
                },
                borderRadius: [4, 4, 0, 0]
            },
            barWidth: '60%'
        }]
    }
})

// 加载数据
const loadData = async () => {
    loading.value = true
    try {
        const [usersRes, inactiveRes, locRes, deptRes] = await Promise.all([
            fetchUsersLearningListAPI({
                page: pagination.value.page,
                page_size: pagination.value.pageSize,
                sort_by: filters.value.sort_by,
                sort_order: filters.value.sort_order,
                location: filters.value.location || undefined,
                bumen: filters.value.bumen || undefined
            }),
            fetchInactiveUsersAPI(),
            fetchLocationsAPI(),
            fetchDepartmentsAPI()
        ])

        if (usersRes.code === 200) {
            usersData.value = usersRes.data
            pagination.value.total = usersRes.data.total
        }
        if (inactiveRes.code === 200) {
            inactiveData.value = inactiveRes.data
        }
        if (locRes.code === 200) {
            locations.value = locRes.data
        }
        if (deptRes.code === 200) {
            departments.value = deptRes.data
        }

        // 管理员登录时检查不活跃用户并通知
        if (isAdmin.value && inactiveRes.data?.users?.length > 0) {
            checkInactiveAndNotify()
        }
    } catch (error) {
        console.error('加载数据失败:', error)
        ElMessage.error('加载数据失败')
    } finally {
        loading.value = false
    }
}

// 检查不活跃用户并通知管理员
const checkInactiveAndNotify = async () => {
    try {
        const res = await checkInactiveUsersAPI()
        if (res.code === 200 && res.data?.inactive_users?.length > 0) {
            const inactiveUsers = res.data.inactive_users
            const threshold = res.data.threshold

            ElNotification({
                title: '不活跃用户提醒',
                message: `发现 ${inactiveUsers.length} 位用户超过 ${threshold} 天未学习，请及时关注！`,
                type: 'warning',
                duration: 0,
                position: 'top-right'
            })
        }
    } catch (error) {
        console.error('检查不活跃用户失败:', error)
    }
}

// 分页变化
const handlePageChange = (page: number) => {
    pagination.value.page = page
    loadData()
}

const handleSizeChange = (size: number) => {
    pagination.value.pageSize = size
    pagination.value.page = 1
    loadData()
}

// 筛选变化
watch(filters, () => {
    pagination.value.page = 1
    loadData()
}, { deep: true })

// 排序变化
const handleSort = ({ prop, order }: any) => {
    if (prop) {
        filters.value.sort_by = prop
        filters.value.sort_order = order === 'descending' ? 'desc' : 'asc'
    } else {
        filters.value.sort_by = 'learn_hour'
        filters.value.sort_order = 'desc'
    }
}

// 重置筛选
const resetFilters = () => {
    filters.value = {
        location: '',
        bumen: '',
        sort_by: 'learn_hour',
        sort_order: 'desc'
    }
    pagination.value.page = 1
    loadData()
}

// 查看用户详情
const viewUserDetail = (userId: number) => {
    if (isAdmin.value) {
        // 跳转到用户分析页面
        window.location.href = `#/statistics/analysis/${userId}`
    }
}

onMounted(() => {
    loadData()
})
</script>

<template>
    <div class="user-learning-list" v-loading="loading">
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

        <!-- 筛选器 -->
        <el-card class="filter-card">
            <el-form :inline="true" :model="filters">
                <el-form-item label="地区">
                    <el-select v-model="filters.location" placeholder="全部地区" clearable style="width: 150px">
                        <el-option v-for="loc in locations" :key="loc" :label="loc" :value="loc" />
                    </el-select>
                </el-form-item>
                <el-form-item label="部门">
                    <el-select v-model="filters.bumen" placeholder="全部部门" clearable style="width: 150px">
                        <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetFilters">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 用户列表 -->
        <el-card class="table-card">
            <template #header>
                <div class="card-header">
                    <span>用户学习情况</span>
                    <el-tag type="info" size="small">共 {{ pagination.total }} 位用户</el-tag>
                </div>
            </template>
            <el-table
                :data="usersData?.users || []"
                stripe
                style="width: 100%"
                @sort-change="handleSort"
            >
                <el-table-column prop="username" label="用户名" width="120" />
                <el-table-column prop="bumen" label="部门" width="120" />
                <el-table-column prop="location" label="地区" width="100" />
                <el-table-column prop="learn_hour" label="学习时长(h)" width="120" sortable="custom">
                    <template #default="{ row }">
                        <span :class="{ 'low-value': row.learn_hour < 10 }">{{ row.learn_hour }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_hour" label="创作时长(h)" width="120" sortable="custom" />
                <el-table-column prop="shuzhi" label="塾值" width="100" sortable="custom">
                    <template #default="{ row }">
                        <el-tag type="success" size="small">{{ row.shuzhi }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="courses_completed" label="完成课时" width="100">
                    <template #default="{ row }">
                        <span>{{ row.courses_completed }} 课时</span>
                    </template>
                </el-table-column>
                <el-table-column prop="last_study_time" label="最后学习" width="120">
                    <template #default="{ row }">
                        <span v-if="row.last_study_time">{{ row.last_study_time }}</span>
                        <span v-else class="text-muted">无记录</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.is_inactive" type="danger" size="small">
                            不活跃 ({{ row.days_inactive }}天)
                        </el-tag>
                        <el-tag v-else type="success" size="small">活跃</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="viewUserDetail(row.id)">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination
                    v-model:current-page="pagination.page"
                    v-model:page-size="pagination.pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                />
            </div>
        </el-card>

        <!-- 不活跃用户图表 -->
        <div v-if="inactiveData?.users?.length > 0" class="inactive-section">
            <el-card class="inactive-card">
                <template #header>
                    <div class="card-header">
                        <span>不活跃用户 Top 10</span>
                        <el-tag type="warning" size="small">
                            阈值: {{ inactiveData.threshold }} 天
                        </el-tag>
                    </div>
                </template>
                <BaseChart :options="inactiveChartOptions" height="350px" />
            </el-card>
        </div>
    </div>
</template>

<style scoped lang="scss">
.user-learning-list {
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

.filter-card {
    margin-bottom: 20px;
}

.table-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
        padding: 0;
    }
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.pagination {
    display: flex;
    justify-content: center;
    padding: 20px;
}

.low-value {
    color: #ef4444;
    font-weight: 600;
}

.text-muted {
    color: #94a3b8;
}

.inactive-section {
    margin-top: 20px;
}

.inactive-card {
    :deep(.el-card__body) {
        padding: 16px;
    }
}

// 不活跃用户行高亮
:deep(.el-table__row) {
    &.is-inactive {
        background-color: #fef2f2;
    }
}
</style>
