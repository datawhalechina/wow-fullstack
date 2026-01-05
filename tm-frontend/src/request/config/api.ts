import instance from "../base"

// 获取系统配置
export const fetchConfigAPI = (): Promise<any> =>
    instance.get("/api/config/get")

// 保存系统配置
export const saveConfigAPI = (configs: Record<string, string>): Promise<any> =>
    instance.post("/api/config/save", configs)

// 检查不活跃用户
export const checkInactiveUsersAPI = (): Promise<any> =>
    instance.get("/api/config/check-inactive")
