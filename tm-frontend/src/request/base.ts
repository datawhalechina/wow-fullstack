import axios from 'axios'
import router from '../router/index'
// 创建axios实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8008',// 所有的请求地址前缀部分(没有后端请求不用写)
    timeout: 80000, // 请求超时时间(毫秒)
    withCredentials: false,// 异步请求携带cookie
    headers: {
    // 设置后端需要的传参类型
    // 'Content-Type': 'application/json',
    'token': localStorage.getItem("token"),//一开始就要token
    // 'X-Requested-With': 'XMLHttpRequest',
    },
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
        router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
        }
        return Promise.reject(error)
    }
)
export default instance