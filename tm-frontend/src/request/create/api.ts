import instance from "../base";
import  * as Create from "./type";

export const getNextSerialAPI = (params: Create.INextSerial): Promise<any> =>
    instance.get(`/create/fetch_next_serial/${params.task_type}`, { params });

export const addProjectAPI = (data: Create.ISaveProject): Promise<any> =>
    instance.post("/create/add_project", data);

export const fetchProjectsAPI = (): Promise<any> =>
    instance.get("/create/fetch_current_projects");

export const updateProjectAPI = (params: Create.IUpdateProject): Promise<any> =>
    instance.put(`/create/edit_project/${params.project_id}`, { params });