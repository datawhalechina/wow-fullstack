<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { resetPasswordAPI } from '../../request/user/api'
import type { IResetPassword } from '../../request/user/type'

document.title = "重置密码"

const route = useRoute()
const router = useRouter()
const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

onMounted(() => {
    token.value = route.query.token as string
    if (!token.value) {
        ElMessage.error('无效的重置链接')
        router.push('/login')
    }
})

const handleSubmit = async () => {
    if (!newPassword.value || !confirmPassword.value) {
        ElMessage.error('请填写完整信息')
        return
    }
    
    if (newPassword.value !== confirmPassword.value) {
        ElMessage.error('两次输入的密码不一致')
        return
    }
    
    loading.value = true
    try {
        const data: IResetPassword = {
            token: token.value,
            new_password: newPassword.value
        }
        const res = await resetPasswordAPI(data)
        
        if (res.code === 200) {
            ElMessage.success('密码重置成功，请重新登录')
            router.push('/login')
        } else {
            ElMessage.error(res.message || '重置失败')
        }
    } catch (error) {
        ElMessage.error('重置失败，请稍后重试')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="reset-password-container">
        <h2>重置密码</h2>
        <el-form :model="{ newPassword, confirmPassword }" label-width="100px">
            <el-form-item label="新密码">
                <el-input 
                    v-model="newPassword" 
                    type="password" 
                    placeholder="请输入新密码"
                    show-password
                />
            </el-form-item>
            <el-form-item label="确认密码">
                <el-input 
                    v-model="confirmPassword" 
                    type="password" 
                    placeholder="请再次输入新密码"
                    show-password
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit" :loading="loading">
                    重置密码
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
.reset-password-container {
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