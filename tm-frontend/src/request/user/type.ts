// 下面两个TS接口，表示要传的参数
export interface ReqLogin {
    username: string
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
    rtoken: string
}


