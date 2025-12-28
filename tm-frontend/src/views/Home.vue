<script setup lang="ts">
import { computed } from 'vue'
import { useLoginStore } from '../store'
import { useRouter } from 'vue-router'

const loginstate = useLoginStore()
const router = useRouter()

const isLoggedIn = computed(() => loginstate.logined && loginstate.name)

const goToManager = () => {
  router.push('/user')
}
</script>

<template>
  <div class="home-container">
    <el-card class="welcome-card" v-if="!isLoggedIn">
      <div class="welcome-content">
        <h1>欢迎使用自塾时间管理</h1>
        <p class="subtitle">登录后开始您的时间管理之旅</p>
        <div class="login-prompt">
          <el-button type="primary" size="large" @click="loginstate.dialogFormVisible = true">
            立即登录
          </el-button>
          <el-button size="large" @click="loginstate.registerFormVisible = true">
            注册账号
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="welcome-card" v-else>
      <div class="welcome-content">
        <h1>欢迎回来，{{ loginstate.name }}！</h1>
        <p class="subtitle">您已登录成功</p>
        <el-button type="primary" size="large" @click="goToManager">
          进入时间管理
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-card {
  max-width: 500px;
  text-align: center;
}

.welcome-content {
  padding: 40px 20px;
}

.welcome-content h1 {
  font-size: 28px;
  color: #303133;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 16px;
  color: #909399;
  margin-bottom: 32px;
}

.login-prompt {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
