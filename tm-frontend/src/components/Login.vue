<template>
  <!-- 未登录状态：显示登录/注册按钮 -->
  <div v-if="!loginstate.logined || loginstate.name.length === 0" class="auth-buttons">
    <el-button type="primary" plain @click="openLoginDialog">
      <el-icon><User /></el-icon> 登录
    </el-button>
    <el-button @click="openRegisterDialog">
      <el-icon><Plus /></el-icon> 注册
    </el-button>
  </div>

  <!-- 已登录状态：显示用户名和登出按钮 -->
  <div v-else class="auth-user">
    <el-dropdown trigger="click" @command="handleCommand">
      <div class="user-dropdown">
        <el-avatar :size="32" :src="userAvatar">
          {{ loginstate.name.charAt(0).toUpperCase() }}
        </el-avatar>
        <span class="username">{{ loginstate.name }}</span>
        <el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <el-icon><User /></el-icon> 个人中心
          </el-dropdown-item>
          <el-dropdown-item v-if="isAdmin" command="users" divided>
            <el-icon><UserFilled /></el-icon> 全塾用户
          </el-dropdown-item>
          <el-dropdown-item v-if="isAdmin" command="registers">
            <el-icon><Menu /></el-icon> 注册审核
          </el-dropdown-item>
          <el-dropdown-item v-if="isAdmin" command="admin">
            <el-icon><Setting /></el-icon> 系统管理
          </el-dropdown-item>
          <el-dropdown-item command="statistics" :divided="isAdmin">
            <el-icon><DataAnalysis /></el-icon> 数据统计
          </el-dropdown-item>
          <el-dropdown-item command="logout" divided>
            <el-icon><SwitchButton /></el-icon> 退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <!-- 登录对话框 -->
  <el-dialog
    v-model="loginstate.dialogFormVisible"
    title="用户登录"
    :width="400"
    center
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-position="top"
      size="large"
      status-icon
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="loginForm.phone"
          placeholder="请输入手机号"
          prefix-icon="Phone"
          clearable
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          show-password
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="openForgetDialog">忘记密码？</el-button>
        <el-button type="primary" :loading="loginLoading" @click="handleLogin">
          登录
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 注册对话框 -->
  <el-dialog
    v-model="loginstate.registerFormVisible"
    title="用户注册"
    :width="450"
    center
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      label-position="top"
      size="large"
      status-icon
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="name">
            <el-input
              v-model="registerForm.name"
              placeholder="2-5位字符"
              prefix-icon="User"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="11位手机号"
              prefix-icon="Phone"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="registerForm.email"
          placeholder="请输入邮箱"
          prefix-icon="Message"
          clearable
        />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="至少6位"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="checkpass">
            <el-input
              v-model="registerForm.checkpass"
              type="password"
              placeholder="再次输入密码"
              prefix-icon="Lock"
              show-password
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="loginstate.registerFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="registerLoading" @click="handleRegister">
          注册
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 忘记密码对话框 -->
  <el-dialog
    v-model="forgetDialogVisible"
    title="忘记密码"
    :width="400"
    center
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-alert
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px"
    >
      请输入注册时使用的手机号，我们将发送密码重置链接到您的邮箱。
    </el-alert>
    <el-form
      ref="forgetFormRef"
      :model="forgetForm"
      :rules="forgetRules"
      label-position="top"
      size="large"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="forgetForm.phone"
          placeholder="请输入手机号"
          prefix-icon="Phone"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="forgetDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="forgetLoading" @click="handleForget">
          发送重置邮件
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLoginStore } from '../store'
import { loginAPI, RegisterAPI, forgotPasswordAPI } from '../request/user/api'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  User, Plus, Lock, Phone, Message, ArrowDown, SwitchButton,
  Setting, UserFilled, Menu, DataAnalysis
} from '@element-plus/icons-vue'

const router = useRouter()
const loginstate = useLoginStore()

// 对话框状态 - 使用 store 中的状态
const forgetDialogVisible = ref(false)

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)
const forgetLoading = ref(false)

// 表单引用
const loginFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const forgetFormRef = ref<FormInstance>()

// 用户头像（使用默认头像）
const userAvatar = computed(() => {
  return 'https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png'
})

// 登录表单
const loginForm = reactive({
  phone: '',
  password: ''
})

const loginRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 注册表单
const registerForm = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
  checkpass: ''
})

const validateCheckPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules: FormRules = {
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 5, message: '用户名长度为2-5位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  checkpass: [{ validator: validateCheckPass, trigger: 'blur' }]
}

// 忘记密码表单
const forgetForm = reactive({
  phone: ''
})

const forgetRules: FormRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ]
}

// 打开对话框
const openLoginDialog = () => {
  loginstate.dialogFormVisible = true
}

const openRegisterDialog = () => {
  loginstate.registerFormVisible = true
}

const openForgetDialog = () => {
  loginstate.dialogFormVisible = false
  forgetDialogVisible.value = true
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) return

    loginLoading.value = true
    try {
      const res = await loginAPI({ phone: loginForm.phone, password: loginForm.password })
      if (res.id > 0) {
        loginstate.id = res.id
        loginstate.name = res.username
        loginstate.atoken = res.atoken
        loginstate.rtoken = res.rtoken
        loginstate.role = res.role || 'user'
        loginstate.logined = true
        loginstate.dialogFormVisible = false
        ElMessage.success('登录成功，欢迎回来！')
        router.push('/user')
      }
    } catch (error: any) {
      ElMessage.error(error.detail || error.message || '登录失败')
    } finally {
      loginLoading.value = false
    }
  })
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) return

    registerLoading.value = true
    try {
      const res = await RegisterAPI({
        name: registerForm.name,
        password: registerForm.password,
        email: registerForm.email,
        phone: registerForm.phone
      })

      if (res.code === 200) {
        ElMessage.success('注册成功，请等待审核！')
        loginstate.registerFormVisible = false
        // 清空表单
        registerForm.name = ''
        registerForm.phone = ''
        registerForm.email = ''
        registerForm.password = ''
        registerForm.checkpass = ''
      } else {
        ElMessage.error(res.detail || '注册失败')
      }
    } catch (error: any) {
      ElMessage.error(error.detail || error.message || '注册失败')
    } finally {
      registerLoading.value = false
    }
  })
}

// 处理忘记密码
const handleForget = async () => {
  if (!forgetFormRef.value) return

  await forgetFormRef.value.validate(async (valid) => {
    if (!valid) return

    forgetLoading.value = true
    try {
      const res = await forgotPasswordAPI({ phone: forgetForm.phone })
      if (res.message === '密码重置邮件已发送,请查收邮箱') {
        ElMessage.success('重置邮件已发送，请查收邮箱')
        forgetDialogVisible.value = false
        forgetForm.phone = ''
      }
    } catch (error: any) {
      ElMessage.error(error.detail || error.message || '发送失败')
    } finally {
      forgetLoading.value = false
    }
  })
}

// 下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'profile') {
    router.push('/user')
  } else if (command === 'admin') {
    router.push('/admin')
  } else if (command === 'users') {
    router.push('/user/all')
  } else if (command === 'registers') {
    router.push('/user/registers')
  } else if (command === 'statistics') {
    router.push('/statistics')
  } else if (command === 'logout') {
    handleLogout()
  }
}

// 判断是否是管理员
const isAdmin = computed(() => {
  return loginstate.id === 1 || loginstate.role === 'admin'
})

// 处理退出
const handleLogout = () => {
  loginstate.id = 0
  loginstate.name = ''
  loginstate.atoken = ''
  loginstate.rtoken = ''
  loginstate.logined = false
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>

<style scoped>
.auth-buttons {
  display: flex;
  gap: 8px;
}

.auth-user {
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dialog-footer .el-button {
  flex: 1;
  margin: 0 4px;
}

.dialog-footer .el-button:first-child {
  margin-left: 0;
}

.dialog-footer .el-button:last-child {
  margin-right: 0;
}
</style>
