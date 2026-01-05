<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchConfigAPI, saveConfigAPI } from '../../request/config/api'

// 配置数据
const loading = ref(false)
const saving = ref(false)
const configForm = ref({
    inactive_days_threshold: '7',
    enable_email_notification: 'false',
    notification_user_ids: ''
})

// 加载配置
const loadConfig = async () => {
    loading.value = true
    try {
        const res = await fetchConfigAPI()
        if (res.code === 200) {
            configForm.value = {
                inactive_days_threshold: res.data.inactive_days_threshold || '7',
                enable_email_notification: res.data.enable_email_notification || 'false',
                notification_user_ids: res.data.notification_user_ids || ''
            }
        }
    } catch (error) {
        console.error('加载配置失败:', error)
        ElMessage.error('加载配置失败')
    } finally {
        loading.value = false
    }
}

// 保存配置
const saveConfig = async () => {
    // 验证
    const threshold = Number(configForm.value.inactive_days_threshold)
    if (isNaN(threshold) || threshold < 1 || threshold > 365) {
        ElMessage.error('不活跃天数阈值必须在 1-365 之间')
        return
    }

    saving.value = true
    try {
        const res = await saveConfigAPI(configForm.value)
        if (res.code === 200) {
            ElMessage.success('配置保存成功')
        } else {
            ElMessage.error(res.message || '保存失败')
        }
    } catch (error) {
        console.error('保存配置失败:', error)
        ElMessage.error('保存配置失败')
    } finally {
        saving.value = false
    }
}

// 重置配置
const resetConfig = () => {
    configForm.value = {
        inactive_days_threshold: '7',
        enable_email_notification: 'false',
        notification_user_ids: ''
    }
}

onMounted(() => {
    loadConfig()
})
</script>

<template>
    <div class="statistics-config">
        <el-card v-loading="loading" class="config-card">
            <template #header>
                <div class="card-header">
                    <el-icon :size="20"><Setting /></el-icon>
                    <span>统计分析配置</span>
                </div>
            </template>

            <el-form :model="configForm" label-width="160px" label-position="left">
                <!-- 不活跃天数阈值 -->
                <el-form-item label="不活跃天数阈值">
                    <el-input-number
                        v-model="configForm.inactive_days_threshold"
                        :min="1"
                        :max="365"
                        :step="1"
                        controls-position="right"
                    />
                    <span class="form-tip">超过此天数未学习的用户将被标记为不活跃</span>
                </el-form-item>

                <!-- 启用邮件通知 -->
                <el-form-item label="邮件通知">
                    <el-switch
                        v-model="configForm.enable_email_notification"
                        active-value="true"
                        inactive-value="false"
                    />
                    <span class="form-tip">启用后将以邮件形式通知管理员不活跃用户情况</span>
                </el-form-item>

                <!-- 通知的管理员ID -->
                <el-form-item label="通知管理员">
                    <el-input
                        v-model="configForm.notification_user_ids"
                        placeholder="例如: 1,2,3"
                        style="width: 300px"
                    />
                    <span class="form-tip">需要接收通知的管理员ID，多个ID用逗号分隔</span>
                </el-form-item>

                <!-- 操作按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="saveConfig" :loading="saving">
                        保存配置
                    </el-button>
                    <el-button @click="resetConfig">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 配置说明 -->
        <el-card class="info-card">
            <template #header>
                <div class="card-header">
                    <el-icon :size="20"><InfoFilled /></el-icon>
                    <span>配置说明</span>
                </div>
            </template>
            <div class="info-content">
                <h4>不活跃天数阈值</h4>
                <p>用于判断用户是否活跃的标准。用户最后学习时间或最后登录时间超过此阈值的天数时，将被标记为不活跃用户。</p>

                <h4>邮件通知</h4>
                <p>启用邮件通知后，系统会在管理员登录时检测不活跃用户并发送邮件通知。需要先配置SMTP服务。</p>

                <h4>通知管理员</h4>
                <p>指定需要接收不活跃用户通知的管理员用户ID，多个ID用英文逗号分隔。留空则不发送通知。</p>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts">
import { Setting, InfoFilled } from '@element-plus/icons-vue'
export default {
    components: { Setting, InfoFilled }
}
</script>

<style scoped lang="scss">
.statistics-config {
    padding: 24px;
    max-width: 800px;
    margin: 0 auto;
}

.config-card,
.info-card {
    margin-bottom: 24px;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
}

.form-tip {
    margin-left: 12px;
    font-size: 12px;
    color: #94a3b8;
}

.info-content {
    h4 {
        margin: 16px 0 8px 0;
        font-size: 14px;
        color: #334155;
    }

    p {
        margin: 0 0 8px 0;
        font-size: 13px;
        color: #64748b;
        line-height: 1.6;
    }
}
</style>
