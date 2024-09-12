### 为什么要封装axios
明确我们的封装目标：能用上TypeScript 带来的好处:类型检查（安全性）和语法提示（便捷性） 。

`axios.get().then()`这样的书写会存在以下缺点：
1. 请求头能不能统一处理
   解决：创建一个`request/request.js`文件夹，
        在里面可以使用axios.create创建实例对象
        也可以在里面设置  请求 与 响应 拦截器

2. 不便于接口的统一管理  
   解决：在`request`文件夹加多一个api文件来管理所有接口，
        (会先导入request.js的实例)
        并使用函数，不然每次发请求时都会跑一次api文件

3. 容易出现回调地狱
    LogoutAPI()最终的结果是返回Promise对象
    解决`acync + await`
    `await`后面一般放promise对象

封装axios后还是可以用 .then() 

Axios 提供了完备的类型声明。声明文件可以直接去看 `node_modules/axios/index.d.ts` 这个文件：
可以在编辑器中，按 ctrl，同时鼠标点击 axios 模块跳转过去：

TypeScript 中 class 不仅是类，还可以是类类型。作为前者，它是一个值。作为后者，它是一个类型。

下面的 Axios 就是一个类类型，它声明了一些成员的类型。我们看其中的核心请求方法，request，get ，post ：
```typescript
export class Axios {
  // ......
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
    
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  
  // ......
}
```
`axios.get`，`axios.post`这些方法其实是对`axios.request`的一层封装。所以我们就看 request 方法的声明。

request 方法有三个泛型，`T` ，`R` 和 `D`，接收一个`AxiosRequestConfig`类型的参数作为配置对象，返回值的类型是一个接收泛型R 的 Promise 类型。

这三个泛型，T 的含义是什么？要去看 R。R 的含义是什么？要去看它的默认类型 AxiosResponse ：

```typescript
export interface AxiosResponse<T = any, D = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
```
看到这个结构，我们知道了，原来`AxiosResponse`就是在设置响应拦截器中用到的那个`response`对象的类型。

同时也就知道了泛型`T`就是服务器返回的数据的类型。因为服务器究竟返回什么类型，代码是不知道的，所以它的默认类型是`any`。

第三个泛型`D`，就是在设置请求拦截器中用到的那个`config`对象的类型。

回到头来再来看`request`方法的定义，现在就能明白了，它接收的第一个泛型`T`就是将来服务器返回数据的类型，`R`就是这个数据经过`axios`包装一层得到的`response`对象的类型，而`request`方法的返回值是一个`Promise`，其值就是成功态的`R`，也就是`response`对象。

AxiosRequestConfig 类型
先看下它的类型声明：
```typescript
export interface AxiosRequestConfig<D = any> {
  url?: string;
  method?: Method | string;
  baseURL?: string;
  headers?: RawAxiosRequestHeaders;
  // .....
}
```
可以看到，它接收一个泛型`D`，这个泛型就是上面提到的第三个泛型。它其实就是 axios 的配置对象的类型。在设置请求拦截器和封装公共请求方法时会用到。

`AxiosInstance`该类型为`axios.create`方法创建出的实例的类型。后面直接用到。

`AxiosError`该类型为请求发送过程中出现错误产生的错误对象的类型：
```typescript
export class AxiosError<T = unknown, D = any> extends Error {
  constructor(
      message?: string,
      code?: string,
      config?: AxiosRequestConfig<D>,
      request?: any,
      response?: AxiosResponse<T, D>
  );
 
  config?: AxiosRequestConfig<D>;
  code?: string;
  request?: any;
  response?: AxiosResponse<T, D>;
  isAxiosError: boolean;
  status?: number;
  toJSON: () => object;
  cause?: Error;
  // ......
}
```
我们会用到其中的`response`属性，它表示响应对象，需要根据它的`HTTP`状态码做一些处理。


## 封装request
先在`src`下创建一个`request`文件夹，并添加一个`base.ts`文件

```typescript
import axios from 'axios'
// 创建axios实例
const instance = axios.create({
    baseURL: '',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 80000, // 请求超时时间(毫秒)
    withCredentials: true,// 异步请求携带cookie
    // headers: {
    // 设置后端需要的传参类型
    // 'Content-Type': 'application/json',
    // 'token': x-auth-token',//一开始就要token
    // 'X-Requested-With': 'XMLHttpRequest',
    // },
})
 
// request拦截器
instance.interceptors.request.use(
    config => {
        // 如果你要去localStor获取token,(如果你有)
        // let token = localStorage.getItem("x-auth-token");
        // if (token) {
                //添加请求头
                //config.headers["Authorization"]="Bearer "+ token
        // }
        return config
    },
    error => {
        // 对请求错误做些什么
        Promise.reject(error)
    }
)
 
// response 拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data
    },
    error => {  
        // 处理401错误
        if (error.response.status === 401) {
        // 删除用户信息
        localStorage.setItem("x-auth-token", "");
        // 跳转登录页
        // router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
        }
        return Promise.reject(error)
    }
)
export default instance
```

注意：​​因为get请求的参数需要`params`，它是即将与请求一起发送的 URL 参数，为了简写采用了ES6的解构，就是把下面的 params 解构，只有get 请求需要加多一层`params`。其它请求，如 post 等请求等就不用解构，形参是什么都行。

在 request 文件夹，分别建立各个模块的文件夹，如 admin,user 等。
比如新建一个user文件夹，user文件夹下新建一个 type.ts 文件和一个 api.ts 文件。
在 type.ts 中写接口类型，在 api.ts 中写请求方法。

在 type.ts 中写接口类型：
```typescript
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
    token: string, 
}
```
在 api.ts 中写请求方法:

定义请求api格式：
export  const  自定义api名  =  (形参:请求类型)：返回类型  =>  instance.方法(路径，后端要的参数);

```typescript
import instance from "../base";
import { ReqLogin, ProData, ItypeAPI } from "./type";
const headers = {"content-type": "application/x-www-form-urlencoded"}

// post请求，有参数,如传用户名和密码
export const loginAPI = (data: ReqLogin): Promise<ItypeAPI> =>
    instance.post("/v1/users/token", data,{headers: headers});

export const checkAPI = (): Promise<ProData> =>
    instance.get("v1/users/pro",{headers: headers});
 
```

在要请求的组件上使用
使用方式一：直接使用(setup自带async，await在顶层可以直接使用)

```html
<script setup lang="ts">
import { checkAPI} from "../../request/api";
//直接使用，一般用在进入页面入请求数据的接口
let res = await checkAPI()
console.log(res);
</script>
```

使用方式二：使用 async / await，（setup虽然自带async，但单独用await只能在顶层使用，如果在函数下还是要async / await一起写）
```html
<script setup lang="ts">
import {loginAPI} from '../request/user/api'
const data = {username: "mockuser", password: "123456"}
const get_query = async() => {
    let res = await loginAPI(data)
    console.log(res);
}
</script>
```
