export interface ISaveProject {
    title:string
    url: string
    desc: string
    start_date:string
    deadline:string
    planed_hour:number
}

export interface INextSerial {
    task_type:string
}

export interface IUpdateProject {
    project_id:number
    action:string
    title?:string
    url?: string
    desc?: string
    start_date?:string
    deadline?:string
    planed_hour?:number
    half_progress?:string
    finish_date?:string
    actual_hour?:string
}