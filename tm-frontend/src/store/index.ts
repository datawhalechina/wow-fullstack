import { defineStore } from "pinia"

export const useLoginStore = defineStore('login',{
  state: ()=>{
    // 将初始化的变量或要用到的变量定义到这里
    return {
      id:0,
      logined: false,
      dialogFormVisible: false,
      name: '',
      atoken: '',
      rtoken: '',
      iframeurl:'http://127.0.0.1:8008',
    }
  },
  persist: {
    enabled: true,
  },
  // 类似computed,修饰一些值，也是有缓存的
  getters: {

  },
  // methods,同步异步都可以做，提交state
  actions: {

  }
})
