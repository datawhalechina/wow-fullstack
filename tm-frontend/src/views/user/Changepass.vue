<script setup lang="ts">
import { ChangePassAPI } from '../../request/user/api'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '../../store'
import { ElMessage } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'

document.title = '修改密码'

const loginstate = useLoginStore()
const ruleFormRef = ref<FormInstance>()
const loading = ref(false)

interface RuleForm {
  password: string
  checkpass: string
}

const form = reactive<RuleForm>({
  password: '',
  checkpass: ''
})

const validateCheckPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules<RuleForm> = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  checkpass: [{ validator: validateCheckPass, trigger: 'blur' }]
}

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await ChangePassAPI({
        name: loginstate.name,
        newpass: form.password
      })

      if (res.code === 200) {
        ElMessage.success('密码修改成功！')
        form.password = ''
        form.checkpass = ''
      } else {
        ElMessage.error(res.detail || '密码修改失败')
      }
    } catch (error: any) {
      ElMessage.error(error.detail || '密码修改失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <div class="changepass-container">
    <el-card class="form-card">
      <template #header>
        <el-page-header @back="$router.back()">
          <template #content>
            <span class="title">修改密码</span>
          </template>
        </el-page-header>
      </template>

      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        status-icon
      >
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入新密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="checkpass">
          <el-input
            v-model="form.checkpass"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleSubmit(ruleFormRef)"
            class="submit-btn"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.changepass-container {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 450px;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
