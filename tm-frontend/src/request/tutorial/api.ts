import instance from "../base";

// 获取课程列表
export const fetchCoursesAPI = (): Promise<any> =>
  instance.get("/api/tutorial/courses");

// 获取课程详情
export const fetchCourseDetailAPI = (courseName: string): Promise<any> =>
  instance.get(`/api/tutorial/course/${courseName}`);

// 获取教程内容
export const fetchTutorialContentAPI = (params: { path: string }): Promise<any> =>
  instance.get("/api/tutorial/content", { params });

// 申报学习时间
export const reportStudyTimeAPI = (data: {
  user_id: number;
  course_name: string;
  lesson_title: string;
  duration: number;
}): Promise<any> =>
  instance.post("/api/tutorial/report-study-time", data);

// 同步学习时间到时间管理
export const syncStudyTimeAPI = (data: {
  user_id: number;
  course_name: string;
  lesson_title: string;
  duration: number;
  date: string;
}): Promise<any> =>
  instance.post("/api/tutorial/sync-study-time", data);
