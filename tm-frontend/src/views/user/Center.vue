<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '../../store'

const router = useRouter()
const loginstate = useLoginStore()
const userid = computed(() => loginstate.id)
const isAdmin = computed(() => loginstate.id === 1)

const menuItems = computed(() => {
  const items = [
    { path: '/manager', icon: 'Timer', label: '时间管理', target: '' },
    { path: '/user/shuzhi', icon: 'Coin', label: '塾值', target: '' },
    { path: '/user/profile/' + userid.value, icon: 'User', label: '个人信息', target: '' },
    { path: '/user/editprofile', icon: 'Edit', label: '编辑资料', target: '' },
    { path: '/user/changepass', icon: 'Lock', label: '修改密码', target: '' },
    { path: '/agents', icon: 'ChatDotRound', label: '智能体', target: '' },
  ]
  if (isAdmin.value) {
    items.push({ path: '/user/registers', icon: 'DocumentChecked', label: '注册审核', target: '' })
    items.push({ path: '/user/resetpass', icon: 'Refresh', label: '重置密码', target: '' })
    items.push({ path: '/user/all', icon: 'Users', label: '全塾用户', target: '' })
  }
  return items
})

const navigateTo = (path: string, target: string) => {
  if (target) {
    window.open(path, target)
  } else {
    router.push(path)
  }
}
</script>

<template>
  <div class="user-center">
    <el-card class="user-card">
      <template #header>
        <div class="card-header">
          <div class="user-info">
            <el-avatar :size="64" :src="'https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png'">
              {{ loginstate.name.charAt(0).toUpperCase() }}
            </el-avatar>
            <div class="user-details">
              <h2>{{ loginstate.name }}</h2>
              <el-tag type="primary" size="small" v-if="isAdmin">管理员</el-tag>
              <el-tag type="info" size="small" v-else>普通用户</el-tag>
            </div>
          </div>
        </div>
      </template>

      <div class="menu-grid">
        <div
          v-for="item in menuItems"
          :key="item.path"
          class="menu-item"
          @click="navigateTo(item.path, item.target)"
        >
          <el-icon :size="28"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.user-center {
  padding: 20px;
  min-height: calc(100vh - 120px);
}

.user-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  padding: 10px 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-details h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding: 10px 0;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-radius: 8px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background: #e4e7ed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item .el-icon {
  color: #409eff;
  margin-bottom: 8px;
}

.menu-item span {
  font-size: 14px;
  color: #606266;
}
</style>
