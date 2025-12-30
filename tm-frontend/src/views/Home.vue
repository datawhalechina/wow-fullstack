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

const features = [
  { icon: 'Clock', title: '时间管理', desc: '高效规划每日任务', color: '#6366f1' },
  { icon: 'Reading', title: '课程学习', desc: '13门完整教程', color: '#10b981' },
  { icon: 'Coin', title: '塾值系统', desc: '记录学习创作积分', color: '#f59e0b' },
  { icon: 'TrendCharts', title: '数据统计', desc: '可视化分析报告', color: '#8b5cf6' },
]
</script>

<template>
  <div class="home-container">
    <!-- 背景装饰 -->
    <div class="home-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 主要内容 -->
    <div class="home-content">
      <!-- 欢迎卡片 -->
      <el-card class="welcome-card" v-if="!isLoggedIn">
        <div class="welcome-content">
          <div class="welcome-icon">
            <img src="/logo.png" alt="自塾" class="logo-img" />
          </div>
          <h1 class="welcome-title">欢迎使用 <span class="brand">自塾</span> 时间管理</h1>
          <p class="subtitle">登录后开始您的时间管理之旅</p>
          <div class="features-row">
            <div v-for="feature in features" :key="feature.title" class="feature-item">
              <div class="feature-icon" :style="{ background: feature.color }">
                <el-icon><component :is="feature.icon" /></el-icon>
              </div>
              <span class="feature-title">{{ feature.title }}</span>
            </div>
          </div>
          <div class="login-prompt">
            <el-button type="primary" size="large" @click="loginstate.dialogFormVisible = true" class="btn-primary">
              立即登录
            </el-button>
            <el-button size="large" @click="loginstate.registerFormVisible = true" class="btn-secondary">
              注册账号
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 已登录欢迎卡片 -->
      <el-card class="welcome-card logged-in" v-else>
        <div class="welcome-content">
          <div class="user-greeting">
            <el-avatar :size="80" class="user-avatar">
              {{ loginstate.name?.charAt(0)?.toUpperCase() }}
            </el-avatar>
            <h1 class="welcome-title">欢迎回来，<span class="user-name">{{ loginstate.name }}</span>！</h1>
            <p class="subtitle">您已准备好开始今天的旅程</p>
          </div>
          <div class="quick-actions">
            <el-button type="primary" size="large" @click="goToManager" class="action-btn">
              <el-icon><Clock /></el-icon>
              进入时间管理
            </el-button>
            <el-button size="large" @click="router.push('/statistics')" class="action-btn secondary">
              <el-icon><DataAnalysis /></el-icon>
              查看统计
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-container {
  min-height: calc(100vh - 120px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.home-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(99, 102, 241, 0.2);
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(139, 92, 246, 0.15);
  bottom: -50px;
  left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

.circle-3 {
  width: 200px;
  height: 200px;
  background: rgba(16, 185, 129, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.home-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
}

.welcome-card {
  background: rgba(30, 41, 59, 0.8) !important;
  backdrop-filter: blur(20px);
  border: 1px solid #334155 !important;
  border-radius: 24px !important;
  text-align: center;
}

.welcome-content {
  padding: 48px 32px;
}

.welcome-icon {
  margin-bottom: 24px;
}

.logo-img {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 12px;
  line-height: 1.3;
}

.brand {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-name {
  color: #6366f1;
}

.subtitle {
  font-size: 16px;
  color: #94a3b8;
  margin-bottom: 32px;
}

.features-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.feature-title {
  font-size: 13px;
  color: #94a3b8;
}

.login-prompt {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  min-width: 140px;
  height: 48px;
  border-radius: 12px !important;
  font-size: 16px !important;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border: none !important;
}

.btn-secondary {
  background: transparent !important;
  border: 1px solid #334155 !important;
  color: #94a3b8 !important;

  &:hover {
    border-color: #6366f1 !important;
    color: #6366f1 !important;
  }
}

.user-greeting {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.user-avatar {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
}

.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  min-width: 180px;
  height: 48px;
  border-radius: 12px !important;
  gap: 8px;
}

@media (max-width: 600px) {
  .welcome-title {
    font-size: 24px;
  }

  .features-row {
    gap: 16px;
  }

  .feature-icon {
    width: 40px;
    height: 40px;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .quick-actions {
    flex-direction: column;
  }
}
</style>
