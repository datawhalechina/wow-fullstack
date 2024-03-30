import instance from "../base";
import  * as Create from "./type";

export const getNextSerialAPI = (params: Create.INextSerial): Promise<any> =>
    instance.get(`/api/create/fetch_next_serial/${params.task_type}`, { params });

export const addProjectAPI = (data: Create.ISaveProject): Promise<any> =>
    instance.post("/api/create/add_project", data);

export const fetchProjectsAPI = (): Promise<any> =>
    instance.get("/api/create/fetch_current_projects");

export const fetchFinishedProjectsAPI = (): Promise<any> =>
    instance.get("/api/create/fetch_finished_projects");

export const updateProjectAPI = (params: Create.IUpdateProject): Promise<any> =>
    instance.put(`/api/create/edit_project/${params.project_id}`, { params });

export const fetchDocketsAPI = (params: {user_id:number}): Promise<any> =>
    instance.get(`/api/create/fetch_dockets/${params.user_id}`, { params });

export const fetchTmAPI = (params: Create.Itm): Promise<any> =>
    instance.get(`/api/create/get_tm/${params.user_id}`, { params });

export const fetchPrAPI = (params: Create.Itm): Promise<any> =>
    instance.get(`/api/create/get_pr/${params.user_id}`, { params });

export const savePrAPI = (params: Create.Itm): Promise<any> =>
    instance.put(`/api/create/save_pr/${params.user_id}`, { params });

export const finishTmAPI = (params: Create.Itm): Promise<any> =>
    instance.put(`/api/create/finish_tm/${params.user_id}`, { params });