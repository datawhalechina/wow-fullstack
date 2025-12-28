<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '../store'
import { addShuzhiAPI, fetchAllUsersAPI, updateUserRoleAPI, fetchPermissionsAPI, savePermissionsAPI } from '../request/user/api'
import { ElMessage } from 'element-plus'

document.title = '系统管理'

const router = useRouter()
const loginstate = useLoginStore()

const activeTab = ref('shuzhi')

// 塾值表单
const shuzhiForm = reactive({
  target_type: '学习',
  target_title: '',
  amount: 0,
  balance: 0,
  comments: ''
})

const addShuzhiLoading = ref(false)

const shuzhiTypes = [
  { label: '学习', value: '学习' },
  { label: '工作', value: '工作' },
  { label: '创作', value: '创作' },
  { label: '运动', value: '运动' },
  { label: '其他', value: '其他' }
]

// 用户角色管理
const userList = ref<any[]>([])
const userLoading = ref(false)
const roleDialogVisible = ref(false)
const currentUser = ref<any>(null)
const newRole = ref('user')

const roles = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '超级管理员', value: 'superadmin' }
]

// 权限配置
const permissions = ref<any[]>([])
const permissionLoading = ref(false)
const permissionSaving = ref(false)

// 获取所有用户
const fetchUsers = async () => {
  userLoading.value = true
  try {
    const res = await fetchAllUsersAPI()
    userList.value = res || []
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    userLoading.value = false
  }
}

// 获取权限配置
const fetchPermissions = async () => {
  permissionLoading.value = true
  try {
    const res = await fetchPermissionsAPI()
    permissions.value = res || []
  } catch (error) {
    // 如果获取失败，使用默认配置
    permissions.value = [
      { id: 'courses', name: '课程学习', enabled: true },
      { id: 'manager', name: '时间管理', enabled: true },
      { id: 'shuzhi', name: '塾值记录', enabled: true },
      { id: 'agents', name: '智能体', enabled: true },
      { id: 'profile', name: '个人资料', enabled: true },
      { id: 'registers', name: '注册审核', enabled: false },
      { id: 'all_users', name: '全塾用户', enabled: false },
      { id: 'reset_pass', name: '重置密码', enabled: false },
      { id: 'admin', name: '系统管理', enabled: false }
    ]
  } finally {
    permissionLoading.value = false
  }
}

// 打开角色编辑对话框
const openRoleDialog = (user: any) => {
  currentUser.value = user
  newRole.value = user.role || 'user'
  roleDialogVisible.value = true
}

// 更新用户角色
const updateUserRole = async () => {
  if (!currentUser.value) return

  try {
    const res = await updateUserRoleAPI({
      user_id: currentUser.value.id,
      role: newRole.value
    })
    if (res.code === 200) {
      ElMessage.success(`用户 ${currentUser.value.username} 的角色已更新`)
      roleDialogVisible.value = false
      fetchUsers()
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    ElMessage.error('更新角色失败')
  }
}

// 保存权限配置
const savePermissions = async () => {
  permissionSaving.value = true
  try {
    const res = await savePermissionsAPI({ permissions: permissions.value })
    if (res.code === 200) {
      ElMessage.success('权限配置已保存')
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    ElMessage.error('保存权限配置失败')
  } finally {
    permissionSaving.value = false
  }
}

// 添加塾值
const addShuzhi = async () => {
  if (!shuzhiForm.target_title) {
    ElMessage.warning('请输入标题')
    return
  }

  try {
    addShuzhiLoading.value = true
    const res = await addShuzhiAPI({
      user_id: loginstate.id,
      target_type: shuzhiForm.target_type,
      target_title: shuzhiForm.target_title,
      amount: shuzhiForm.amount,
      balance: shuzhiForm.balance,
      comments: shuzhiForm.comments
    })
    if (res.code === 200) {
      ElMessage.success('添加成功')
      shuzhiForm.target_title = ''
      shuzhiForm.amount = 0
      shuzhiForm.balance = 0
      shuzhiForm.comments = ''
    } else {
      ElMessage.error(res.message || '添加失败')
    }
  } catch (error) {
    ElMessage.error('添加失败')
  } finally {
    addShuzhiLoading.value = false
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  if (loginstate.id === 1 || loginstate.role === 'admin') {
    fetchUsers()
    fetchPermissions()
  }
})
</script>

<template>
  <div class="admin-container">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-page-header @click="goBack" title="首页" style="cursor: pointer">
            <template #content>
              <span class="header-title">系统管理</span>
            </template>
          </el-page-header>
        </div>
      </template>

      <el-tabs v-model="activeTab" type="card">
        <!-- 添加塾值 -->
        <el-tab-pane label="添加塾值" name="shuzhi">
          <el-form :model="shuzhiForm" label-width="80px" style="max-width: 500px">
            <el-form-item label="事项">
              <el-select v-model="shuzhiForm.target_type" placeholder="选择事项类型">
                <el-option
                  v-for="item in shuzhiTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="shuzhiForm.target_title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="单值">
              <el-input-number v-model="shuzhiForm.amount" :min="0" :precision="1" />
            </el-form-item>
            <el-form-item label="塾值">
              <el-input-number v-model="shuzhiForm.balance" :min="0" :precision="1" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="shuzhiForm.comments" type="textarea" :rows="2" placeholder="请输入备注" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addShuzhi" :loading="addShuzhiLoading">
                添加塾值
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 用户角色管理 -->
        <el-tab-pane label="用户角色" name="users">
          <el-table :data="userList" v-loading="userLoading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" width="120" />
            <el-table-column prop="phone" label="手机号" width="150" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="{ row }">
                <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
                  {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="shuzhi" label="塾值" width="100" />
            <el-table-column prop="learn_hour" label="学习时长" width="100" />
            <el-table-column prop="register_time" label="注册时间" width="180" />
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="openRoleDialog(row)">
                  设置角色
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 权限配置 -->
        <el-tab-pane label="权限配置" name="permissions">
          <el-alert
            title="权限配置说明"
            type="info"
            description="在这里配置各角色的功能权限。管理员角色默认拥有所有权限，其他角色的权限可根据需要配置。"
            show-icon
            style="margin-bottom: 20px"
          />

          <el-table :data="permissions" v-loading="permissionLoading" style="width: 100%">
            <el-table-column prop="name" label="权限名称" width="150" />
            <el-table-column label="启用" width="100" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" />
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 20px">
            <el-button type="primary" @click="savePermissions" :loading="permissionSaving">
              保存配置
            </el-button>
          </div>
        </el-tab-pane>

        <!-- 课程管理入口 -->
        <el-tab-pane label="课程管理" name="courses">
          <div class="quick-links">
            <el-card class="link-card" @click="router.push('/courses')">
              <el-icon :size="40" color="#409EFF"><Reading /></el-icon>
              <span>课程中心</span>
            </el-card>
            <el-card class="link-card" @click="router.push('/user/all')">
              <el-icon :size="40" color="#67C23A"><UserFilled /></el-icon>
              <span>全塾用户</span>
            </el-card>
            <el-card class="link-card" @click="router.push('/user/registers')">
              <el-icon :size="40" color="#E6A23C"><DocumentChecked /></el-icon>
              <span>注册审核</span>
            </el-card>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 角色编辑对话框 -->
    <el-dialog v-model="roleDialogVisible" title="设置用户角色" width="400px" center>
      <el-form label-width="80px">
        <el-form-item label="用户">
          <span>{{ currentUser?.username }}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newRole" style="width: 100%">
            <el-option
              v-for="role in roles"
              :key="role.value"
              :label="role.label"
              :value="role.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUserRole">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Reading, UserFilled, DocumentChecked } from '@element-plus/icons-vue'
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.main-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.quick-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.link-card {
  width: 150px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.link-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-card .el-icon {
  margin-bottom: 10px;
}

.link-card span {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: #606266;
}
</style>
