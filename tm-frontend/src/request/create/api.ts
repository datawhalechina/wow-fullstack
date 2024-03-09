import instance from "../base";
import  * as Create from "./type";

export const addProjectAPI = (data: Create.ISaveProject): Promise<any> =>
    instance.post("/project/add_project", data);

export const fetchProjectsAPI = (): Promise<any> =>
    instance.get("/project/fetch_current_projects");