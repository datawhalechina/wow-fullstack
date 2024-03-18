import instance from "../base";
import  * as Create from "./type";

export const getNextSerialAPI = (params: Create.INextSerial): Promise<any> =>
    instance.get(`/create/fetch_next_serial/${params.task_type}`, { params });

export const addProjectAPI = (data: Create.ISaveProject): Promise<any> =>
    instance.post("/create/add_project", data);

export const fetchProjectsAPI = (): Promise<any> =>
    instance.get("/create/fetch_current_projects");

export const fetchFinishedProjectsAPI = (): Promise<any> =>
    instance.get("/create/fetch_finished_projects");

export const updateProjectAPI = (params: Create.IUpdateProject): Promise<any> =>
    instance.put(`/create/edit_project/${params.project_id}`, { params });

export const fetchShushengsAPI = (params: Create.IFetchShushengs): Promise<any> =>
    instance.get(`/users/fetch_shushengs/${params.user_id}`, { params });