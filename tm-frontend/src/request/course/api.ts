import instance from "../base";
import  * as Course from "./type";

export const SaveCourseAPI = (data: Course.ISaveCourse): Promise<any> =>
    instance.post("/course/save_course", data);

export const fetchCourseAPI = (): Promise<any> =>
    instance.get("/course/fetch_all_courses");

export const getCourseAPI = (params: Course.IGetCourse): Promise<any> =>
    instance.get(`/course/get_course/${params.course_id}`, { params });

export const selectCourseAPI = (data:Course.ISelectCourse): Promise<any> =>
    instance.post("/course/select_course", data);

export const fetchCurrentSelectionAPI = (): Promise<any> =>
    instance.get("/course/fetch_current_selections");

export const fetchAllSelectionAPI = (): Promise<any> =>
    instance.get("/course/fetch_selections");

export const reportLearnAPI = (data:Course.IReportLearn): Promise<any> =>
    instance.post("/course/report_learn", data);