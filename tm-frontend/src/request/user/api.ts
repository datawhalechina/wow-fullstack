import instance from "../base";
import  * as User from "./type";

// post请求，有参数,如传用户名和密码
export const loginAPI = (data: User.ReqLogin): Promise<User.ItypeAPI> =>
    instance.post("/api/users/token", data);

export const RegisterAPI = (data: User.IRegister): Promise<User.IRegisterRes> =>
    instance.post("/api/users/register", data);

export const fetchRigiAPI = (): Promise<any> =>
    instance.get("/api/users/fetch_registrations");

export const handleRigiAPI = (data: User.IHandleRegister): Promise<any> =>
    instance.post("/api/users/handle_registrations", data);

export const ChangePassAPI = (data: User.IChangePass): Promise<any> =>
    instance.post("/api/users/handle_changepass", data);

export const resetPassAPI = (data: User.ReqLogin): Promise<any> =>
    instance.post("/api/users/reset_pass", data);

export const resetListAPI = (): Promise<any> =>
    instance.get("/api/users/reset_list");

export const handleResetPassAPI = (data: User.IHandleResetPass): Promise<any> =>
    instance.post("/api/users/handle_reset_pass", data);

export const getProfileAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/get_profile/${params.userid}`, { params });

export const deleteProfileAPI = (data: User.IDeleteProfile): Promise<any> =>
    instance.post("/api/users/delete_profile", data);

export const submitProfileAPI = (data: User.ISubmitProfile): Promise<any> =>
    instance.post("/api/users/submit_profile", data);


export const fetchAllUsersAPI = (): Promise<any> =>
    instance.get("/api/users/fetch_all_users");
export const forgetPasswordAPI = (data: User.IForgetPassword): Promise<any> =>
    instance.post("/api/users/forget-password", data);

// 忘记密码 - 发送重置邮件
export const forgotPasswordAPI = (data: { phone: string }): Promise<any> =>
    instance.post("/api/users/forgot-password", data);

// 重置密码
export const resetPasswordAPI = (data: { token: string; new_password: string }): Promise<any> =>
    instance.post("/api/users/reset-password", data);

// 获取塾值记录
export const fetchShuzhiAPI = (params: { userid: number }): Promise<any> =>
    instance.get("/api/users/fetch_shuzhi", { params });

// 添加塾值记录
export const addShuzhiAPI = (data: {
    user_id: number;
    target_type: string;
    target_title: string;
    amount: number;
    balance: number;
    comments: string;
}): Promise<any> =>
    instance.post("/api/users/add_shuzhi", data);

// 更新用户角色
export const updateUserRoleAPI = (data: {
    user_id: number;
    role: string;
}): Promise<any> =>
    instance.post("/api/users/update_user_role", data);

// 获取权限配置
export const fetchPermissionsAPI = (): Promise<any> =>
    instance.get("/api/users/fetch_permissions");

// 保存权限配置
export const savePermissionsAPI = (data: { permissions: any[] }): Promise<any> =>
    instance.post("/api/users/save_permissions", data);

