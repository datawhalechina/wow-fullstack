<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { forgetPasswordAPI } from '../../request/user/api'
import type { IForgetPassword } from '../../request/user/type'

document.title = "忘记密码"

const phone = ref('')
const loading = ref(false)

const handleSubmit = async () => {
    if (!phone.value) {
        ElMessage.error('请输入手机号')
        return
    }
    
    loading.value = true
    try {
        const data: IForgetPassword = {
            phone: phone.value
        }
        const res = await forgetPasswordAPI(data)
        
        if (res.code === 200) {
            ElMessage.success('密码重置邮件已发送，请查收邮箱')
        } else {
            ElMessage.error(res.message || '发送失败')
        }
    } catch (error) {
        ElMessage.error('发送失败，请稍后重试')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="forgot-password-container">
        <h2>忘记密码</h2>
        <el-form :model="{ phone }" label-width="80px">
            <el-form-item label="手机号">
                <el-input v-model="phone" placeholder="请输入注册手机号" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="loading">
                    发送重置邮件
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.forgot-password-container {
    max-width: 500px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;

    h2 {
        text-align: center;
        margin-bottom: 30px;
    }
}
</style> 