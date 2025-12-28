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

// 忘记密码 - 发送重置邮件
export const forgotPasswordAPI = (data: { phone: string }): Promise<any> =>
    instance.post("/api/users/forgot-password", data);

// 重置密码
export const resetPasswordAPI = (data: { token: string; new_password: string }): Promise<any> =>
    instance.post("/api/users/reset-password", data);

