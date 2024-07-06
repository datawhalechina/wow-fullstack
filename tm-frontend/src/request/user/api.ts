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

export const fetchGoaltalkAPI = (data: {presenter:string}): Promise<any> =>
    instance.post("/api/users/fetch_goaltalk", data);

export const fetchAllGoalsAPI = (data: {presenter:string}): Promise<any> =>
    instance.post("/api/users/fetch_all_goals", data);

export const fetchFinishedGoaltalkAPI = (data: {presenter:string}): Promise<any> =>
    instance.post("/api/users/fetch_finished_goaltalk", data);

export const editGoaltalkAPI = (data: User.IEditGoaltalk): Promise<any> =>
    instance.post("/api/users/edit_goaltalk", data);

export const confirmTalkAPI = (data: User.IConfirmTalk): Promise<any> =>
    instance.post("/api/users/confirm_talk", data);

export const confirmReserveAPI = (data: User.IConfirmReserve): Promise<any> =>
    instance.post("/api/users/confirm_reserve", data);

export const finishTalkAPI = (data: User.IFinishTalk): Promise<any> =>
    instance.post("/api/users/finish_talk", data);

export const checkAPI = (): Promise<User.ProData> =>
    instance.get("/api/users/pro");

