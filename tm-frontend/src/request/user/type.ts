// 下面两个TS接口，表示要传的参数
export interface ReqLogin {
    phone: string
    password: string
}


export interface ProData {
    projects?: string;
    detail?:{code:number,message:string,data:string};
  }


export interface ItypeAPI {
    id: number,//请求的数据，用泛型
    username: string, // 返回状态码的信息，如请求成功等
    email: string, //返回后端自定义的200，404，500这种状态码
    atoken: string, 
    rtoken: string, 
}

export interface IRegister {
    name: string,
    email: string,
    password: string,
    phone: string, 
}

export interface IRegisterRes {
    code: number,
    message: string,
}

export interface IHandleRegister {
    action:string
    id:number
}

export interface IChangePass {
    newpass:string
    name:string
}

export interface IHandleResetPass {
    action:string
    id:number
}

export interface IGetProfile {
    userid:number
}


export interface IDeleteProfile {
    filename:string
}

export interface ISubmitProfile {
    info:string
}
