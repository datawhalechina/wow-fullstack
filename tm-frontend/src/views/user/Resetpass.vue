<script setup lang="ts">
import { resetListAPI, handleResetPassAPI } from '../../request/user/api'
import { onMounted, ref, reactive } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import { Refresh, Delete } from '@element-plus/icons-vue'

document.title = '密码重置列表'

interface User {
  id: number
  username: string
  phone: string
  times: number
  create_time: string
  update_time: string
}

const tableData = reactive<User[]>([])
const loading = ref(false)
const currentRow = ref<User | null>(null)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

const fetchResetList = async () => {
  loading.value = true
  try {
    const res = await resetListAPI()
    tableData.length = 0
    tableData.push(...res)
  } catch (error) {
    ElMessage.error('获取重置列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchResetList)

const handleCurrentChange = (val: User | undefined) => {
  currentRow.value = val || null
}

const handleAction = async (action: 'reset' | 'delete') => {
  if (!currentRow.value) {
    ElMessage.warning('请先选择一条记录')
    return
  }

  const actionText = action === 'reset' ? '重置' : '删除'
  const confirmed = await ElMessageBox.confirm(
    `确定要${actionText}用户 "${currentRow.value.username}" 的密码重置申请吗？`,
    '确认操作',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => true).catch(() => false)

  if (!confirmed) return

  try {
    const res = await handleResetPassAPI({ action, id: currentRow.value.id })
    if (res.code === 200) {
      ElMessage.success(`${actionText}成功`)
      const index = tableData.findIndex(u => u.id === currentRow.value?.id)
      if (index > -1) {
        tableData.splice(index, 1)
      }
      currentRow.value = null
    } else {
      ElMessage.error(res.detail || `${actionText}失败`)
    }
  } catch (error) {
    ElMessage.error(`${actionText}失败`)
  }
}
</script>

<template>
  <div class="resetpass-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>密码重置列表</span>
          <el-button type="primary" link @click="fetchResetList">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <div v-if="currentRow" class="action-bar">
        <el-button type="warning" @click="handleAction('reset')">
          <el-icon><Refresh /></el-icon> 重置密码
        </el-button>
        <el-button type="danger" @click="handleAction('delete')">
          <el-icon><Delete /></el-icon> 删除申请
        </el-button>
      </div>

      <el-table
        ref="singleTableRef"
        :data="tableData"
        v-loading="loading"
        stripe
        highlight-current-row
        style="width: 100%"
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="100" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="times" label="申请次数" width="100" />
        <el-table-column prop="create_time" label="创建时间" width="180" />
        <el-table-column prop="update_time" label="更新时间" width="180" />
      </el-table>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无重置申请" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { ElMessageBox } from 'element-plus'
</script>

<style scoped>
.resetpass-container {
  padding: 20px;
}

.table-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-bar {
  padding: 16px 0;
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}
</style>
