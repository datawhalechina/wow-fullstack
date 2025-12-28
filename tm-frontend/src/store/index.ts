import { defineStore } from "pinia"

export const useUserStore = defineStore('user',{
  state: ()=>{
    // 将初始化的变量或要用到的变量定义到这里
    return {
      id:0,
      logined: false,
      dialogFormVisible: false,
      name: '',
      atoken: '',
      rtoken: '',
      role: 'user',
      iframeurl: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8008',
      _initialized: false,
    }
  },
  persist: {
    enabled: true,
    key: 'user-storage',
    storage: localStorage,
  },
  // 类似computed,修饰一些值，也是有缓存的
  getters: {
    isLoggedIn: (state) => state.logined && !!state.atoken,
    isInitialized: (state) => state._initialized,
    userInfo: (state) => ({
      id: state.id,
      name: state.name,
      role: state.role,
    }),
  },
  // methods,同步异步都可以做，提交state
  actions: {
    async initializeFromStorage() {
      // 确保状态已从持久化存储恢复
      this._initialized = true
    },
    
    setUserInfo(id: number, name: string, role: string = 'user') {
      this.id = id
      this.name = name
      this.role = role
      this.logined = true
    },
    
    setTokens(atoken: string, rtoken: string) {
      this.atoken = atoken
      this.rtoken = rtoken
      this.logined = true
    },
    
    logout() {
      this.id = 0
      this.logined = false
      this.name = ''
      this.atoken = ''
      this.rtoken = ''
      this.role = 'user'
    }
  }
})

// 保持向后兼容的别名
export const useLoginStore = useUserStore