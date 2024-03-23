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

export interface Itm {
    user_id:number
    taskinfo?:string
    finishitem?:string
}

export interface IUpdateProject {
    project_id:number
    action:string
    shusheng_id?:number
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
