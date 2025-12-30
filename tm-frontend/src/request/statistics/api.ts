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

// ===== 全局统计 API (管理员) =====

export const fetchGlobalOverviewAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/overview")

export const fetchGlobalRankingAPI = (params?: { type?: string; limit?: number }): Promise<any> =>
    instance.get("/api/statistics/global/ranking", { params: params || { type: "shuzhi", limit: 10 } })

export const fetchGrowthTrendAPI = (params?: { days?: number }): Promise<any> =>
    instance.get("/api/statistics/global/growth-trend", { params: params || { days: 30 } })

export const fetchCourseStatsAPI = (): Promise<any> =>
    instance.get("/api/statistics/global/course-stats")
