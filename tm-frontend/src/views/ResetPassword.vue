<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resetPasswordAPI } from '../request/user/api'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// 密码强度验证
const passwordStrength = ref({
  hasUpper: false,
  hasLower: false,
  hasDigit: false,
  hasSpecial: false,
  minLength: false
})

const checkPasswordStrength = () => {
  passwordStrength.value.hasUpper = /[A-Z]/.test(newPassword.value)
  passwordStrength.value.hasLower = /[a-z]/.test(newPassword.value)
  passwordStrength.value.hasDigit = /[0-9]/.test(newPassword.value)
  passwordStrength.value.hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword.value)
  passwordStrength.value.minLength = newPassword.value.length >= 8
}

const isPasswordValid = () => {
  const { hasUpper, hasLower, hasDigit, hasSpecial, minLength } = passwordStrength.value
  return hasUpper && hasLower && hasDigit && hasSpecial && minLength
}

const handleResetPassword = async () => {
  error.value = ''

  if (!token.value) {
    error.value = '无效的重置链接'
    return
  }

  if (!newPassword.value) {
    error.value = '请输入新密码'
    return
  }

  if (!isPasswordValid()) {
    error.value = '密码不符合要求'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = '两次输入的密码不一致'
    return
  }

  loading.value = true

  try {
    const res = await resetPasswordAPI({
      token: token.value,
      new_password: newPassword.value
    })

    if (res.message === '密码重置成功') {
      ElMessage.success('密码重置成功，请使用新密码登录')
      router.push('/login')
    }
  } catch (err: any) {
    error.value = err?.detail || err?.message || '重置密码失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 从 URL 获取 token
  const urlToken = route.query.token as string
  if (urlToken) {
    token.value = urlToken
  }
})
</script>

<template>
  <div class="reset-password-container">
    <el-card class="reset-card">
      <template #header>
        <div class="card-header">
          <h2>重置密码</h2>
        </div>
      </template>

      <div v-if="token" class="reset-form">
        <p class="tip">请输入您的新密码</p>

        <el-form label-position="top">
          <el-form-item label="新密码">
            <el-input
              v-model="newPassword"
              type="password"
              show-password
              @input="checkPasswordStrength"
              placeholder="请输入新密码"
            />
          </el-form-item>

          <!-- 密码强度提示 -->
          <div class="password-strength">
            <div :class="{ valid: passwordStrength.minLength }">至少8位</div>
            <div :class="{ valid: passwordStrength.hasUpper }">包含大写字母</div>
            <div :class="{ valid: passwordStrength.hasLower }">包含小写字母</div>
            <div :class="{ valid: passwordStrength.hasDigit }">包含数字</div>
            <div :class="{ valid: passwordStrength.hasSpecial }">包含特殊字符</div>
          </div>

          <el-form-item label="确认密码">
            <el-input
              v-model="confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入新密码"
            />
          </el-form-item>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              :disabled="!isPasswordValid() || newPassword !== confirmPassword"
              @click="handleResetPassword"
              class="submit-btn"
            >
              确认重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div v-else class="error-state">
        <el-empty description="无效的重置链接" />
        <p>请重新点击邮件中的重置链接</p>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.reset-card {
  width: 100%;
  max-width: 400px;
}

.card-header h2 {
  margin: 0;
  text-align: center;
  color: #303133;
}

.tip {
  color: #606266;
  margin-bottom: 20px;
  text-align: center;
}

.password-strength {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 12px;
}

.password-strength div {
  padding: 2px 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: white;
}

.password-strength div.valid {
  background: #67c23a;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.submit-btn {
  width: 100%;
}

.error-state {
  text-align: center;
}
</style>
