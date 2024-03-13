export interface Chapter {
    id:number
    title: string
    author_id: number
    author_name: string
    period: string
    url:string
}

export interface ISaveCourse {
    courseid:number
    title: string
    desc: string
    chapters:string
}

export interface IGetCourse {
    course_id:number
}

export interface ISelectCourse {
    id:number
    courseid:number
}

export interface IReportLearn {
    chapter_id:number
    course_id:number
    chapter_title:string
    sele_id:number
    reported_hour:string
}

export interface ISelectMentor {
    shushi_id:number
    courseid:number
}