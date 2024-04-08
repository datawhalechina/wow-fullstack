import instance from "../base";
import  * as Inno from "./type";

export const getNextSerialAPI = (params: Inno.INextSerial): Promise<any> =>
    instance.get(`/api/inno/fetch_next_serial/${params.task_type}`, { params });

export const addProjectAPI = (data: Inno.ISaveProject): Promise<any> =>
    instance.post("/api/inno/add_project", data);

export const fetchProjectsAPI = (): Promise<any> =>
    instance.get("/api/inno/fetch_current_projects");

export const fetchFinishedProjectsAPI = (): Promise<any> =>
    instance.get("/api/inno/fetch_finished_projects");

export const updateProjectAPI = (params: Inno.IUpdateProject): Promise<any> =>
    instance.put(`/api/inno/edit_project/${params.project_id}`, { params });

export const fetchDocketsAPI = (params: {user_id:number}): Promise<any> =>
    instance.get(`/api/inno/fetch_dockets/${params.user_id}`, { params });

export const fetchTmAPI = (params: Inno.Itm): Promise<any> =>
    instance.get(`/api/inno/get_tm/${params.user_id}`, { params });

export const fetchPrAPI = (params: Inno.Itm): Promise<any> =>
    instance.get(`/api/inno/get_pr/${params.user_id}`, { params });

export const savePrAPI = (params: Inno.Itm): Promise<any> =>
    instance.put(`/api/inno/save_pr/${params.user_id}`, { params });

export const finishTmAPI = (params: Inno.Itm): Promise<any> =>
    instance.put(`/api/inno/finish_tm/${params.user_id}`, { params });