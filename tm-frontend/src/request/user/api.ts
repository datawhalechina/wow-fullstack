import instance from "../base";
import { ReqLogin, ProData, ItypeAPI } from "./type";
const headers = {"content-type": "application/x-www-form-urlencoded"}

// post请求，有参数,如传用户名和密码
export const loginAPI = (data: ReqLogin): Promise<ItypeAPI> =>
    instance.post("/v1/users/token", data,{headers: headers});

export const checkAPI = (): Promise<ProData> =>
    instance.get("v1/users/pro",{headers: headers});