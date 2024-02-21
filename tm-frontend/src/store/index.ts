import { defineStore } from "pinia"

export const useLoginStore = defineStore('login',{
  state: ()=>{
    // 将初始化的变量或要用到的变量定义到这里
    return {
        logined: false,
        dialogFormVisible: false,
        name: '黎伟',
        atoken: '',
        rtoken: '',
    }
  },
  persist: {
    enabled: true,
    encryptionKey: 'letscode',
  },
  // 类似computed,修饰一些值，也是有缓存的
  getters: {

  },
  // methods,同步异步都可以做，提交state
  actions: {

  }
})
