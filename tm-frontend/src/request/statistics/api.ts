import instance from "../base"

// ===== 个人统计 API =====

export const fetchPersonalOverviewAPI = (): Promise<any> =>
    instance.get("/api/statistics/personal/overview")

export const fetchPersonalTrendAPI = (params?: { days?: number }): Promise<any> =>
    instance.get("/api/statistics/personal/trend", { params: params || { days: 7 } })

export const fetchShuzhiHistoryAPI = (): Promise<any> =>
    instance.get("/api/statistics/personal/shuzhi-history")

export const fetchTimeDistributionAPI = (): Promise<any> =>
    instance.get("/api/statistics/personal/time-distribution")

// 新增：用户详细分析
export const fetchUserDetailAPI = (userId: number): Promise<any> =>
    instance.get(`/api/statistics/personal/detail/${userId}`)

// 新增：学习日历热力图
export const fetchStudyCalendarAPI = (userId: number, days: number = 365): Promise<any> =>
    instance.get(`/api/statistics/personal/study-calendar/${userId}`, { params: { days } })

// 新增：课程学习进度
export const fetchCourseProgressAPI = (userId: number): Promise<any> =>
    instance.get(`/api/statistics/personal/course-progress/${userId}`)

// 新增：时间管理分析
export const fetchTimeAnalysisAPI = (userId: number, days: number = 30): Promise<any> =>
    instance.get(`/api/statistics/personal/time-analysis/${userId}`, { params: { days } })

// ===== 全局统计 API (管理员) =====

export const fetchGlobalOverviewAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/overview")

export const fetchGlobalRankingAPI = (params?: { type?: string; limit?: number }): Promise<any> =>
    instance.get("/api/statistics/global/ranking", { params: params || { type: "shuzhi", limit: 10 } })

export const fetchGrowthTrendAPI = (params?: { days?: number }): Promise<any> =>
    instance.get("/api/statistics/global/growth-trend", { params: params || { days: 30 } })

export const fetchCourseStatsAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/course-stats")

// 新增：用户学习情况列表
export const fetchUsersLearningListAPI = (params?: {
    page?: number
    page_size?: number
    sort_by?: string
    sort_order?: string
    location?: string
    bumen?: string
}): Promise<any> =>
    instance.get("/api/statistics/global/users-list", { params })

// 新增：不活跃用户列表
export const fetchInactiveUsersAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/inactive-users")

// 新增：地区选项
export const fetchLocationsAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/locations")

// 新增：部门选项
export const fetchDepartmentsAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/departments")
