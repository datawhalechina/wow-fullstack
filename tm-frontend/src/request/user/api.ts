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

export const getProfileAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/get_profile/${params.userid}`, { params });

export const deleteProfileAPI = (data: User.IDeleteProfile): Promise<any> =>
    instance.post("/api/users/delete_profile", data);

export const submitProfileAPI = (data: User.ISubmitProfile): Promise<any> =>
    instance.post("/api/users/submit_profile", data);

export const fetchGoalAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/fetch_goal/${params.userid}`, { params });

export const fetchShushisAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/fetch_shushis/${params.userid}`, { params });

export const fetchShushengsAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/fetch_shushengs/${params.userid}`, { params });

export const fetchShuzhiAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/fetch_shuzhi/${params.userid}`, { params });

export const fetchReportsAPI = (params: User.IGetProfile): Promise<any> =>
    instance.get(`/api/users/fetch_reports/${params.userid}`, { params });

export const saveGoalAPI = (data: User.ISaveGoal): Promise<any> =>
    instance.post("/api/users/save_goal", data);

export const fetchAllUsersAPI = (): Promise<any> =>
    instance.get("/api/users/fetch_all_users");

export const checkAPI = (): Promise<User.ProData> =>
    instance.get("/api/users/pro");

