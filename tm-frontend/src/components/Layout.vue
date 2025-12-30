<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div class="layout">
    <el-container class="layout-container">
      <el-header class="layout-header">
        <Header />
      </el-header>
      <el-main class="layout-main">
        <div class="main-bg">
          <div class="main-bg-gradient"></div>
        </div>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
      <el-footer class="layout-footer">
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  background: #f8fafc;
}

.layout-container {
  min-height: 100vh;
}

.layout-header {
  padding: 0;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.layout-main {
  position: relative;
  padding: 0;
  min-height: calc(100vh - 64px - 60px);
  overflow-x: hidden;
}

.main-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.main-bg-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(99, 102, 241, 0.03) 0%,
    transparent 50%
  ),
  radial-gradient(
    circle at 70% 60%,
    rgba(139, 92, 246, 0.02) 0%,
    transparent 50%
  );
  animation: bg-pulse 15s ease-in-out infinite;
}

@keyframes bg-pulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

.layout-footer {
  padding: 0;
  height: 60px;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
