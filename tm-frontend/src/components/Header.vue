<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store'
import Login from './Login.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const navItems = [
  { path: '/', name: '首页', icon: 'HomeFilled' },
  { path: '/courses', name: '课程', icon: 'Reading' },
  { path: '/manager', name: '时间管理', icon: 'Clock' },
  { path: '/statistics', name: '统计', icon: 'DataAnalysis' },
]

const adminNavItems = [
  { path: '/admin', name: '管理', icon: 'Setting' },
  { path: '/admin/statistics', name: '数据', icon: 'TrendCharts' },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- Logo区域 -->
      <div class="header-left">
        <a href="https://zishu.co" class="logo-link">
          <img src="/logo.png" class="logo" alt="自塾" />
          <span class="brand-name">自塾</span>
        </a>
      </div>

      <!-- 导航菜单 -->
      <nav class="header-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </router-link>

        <!-- 管理员菜单 -->
        <template v-if="userStore.role === 'admin' || userStore.id === 1">
          <div class="nav-divider"></div>
          <router-link
            v-for="item in adminNavItems"
            :key="item.path"
            :to="item.path"
            class="nav-item admin"
            :class="{ active: isActive(item.path) }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.name }}</span>
          </router-link>
        </template>
      </nav>

      <!-- 右侧用户区域 -->
      <div class="header-right">
        <Login />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.logo {
  height: 36px;
  width: auto;
  filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.3));
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    color: #1e293b;
    background: rgba(99, 102, 241, 0.08);
  }

  &.active {
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);

    .el-icon {
      color: #6366f1;
    }
  }

  &.admin {
    &:hover {
      background: rgba(245, 158, 11, 0.08);
    }

    &.active {
      background: rgba(245, 158, 11, 0.1);

      .el-icon {
        color: #f59e0b;
      }
    }
  }
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
  margin: 0 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .brand-name {
    display: none;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 8px 12px;
  }
}
</style>
