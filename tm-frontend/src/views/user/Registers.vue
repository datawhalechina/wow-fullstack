<script setup lang="ts">
import { fetchRigiAPI, handleRigiAPI } from '../../request/user/api'
import { onMounted, ref, reactive } from 'vue'
import { ElTable, ElMessage } from 'element-plus'
import { Check, Delete } from '@element-plus/icons-vue'

document.title = '注册审核'

interface User {
  id: number
  name: string
  email: string
  phone: string
  register_time: string
}

const tableData = reactive<User[]>([])
const loading = ref(false)
const currentRow = ref<User | null>(null)
const singleTableRef = ref<InstanceType<typeof ElTable>>()

const fetchData = async () => {
  loading.value = true
  try {
    const res = await fetchRigiAPI()
    tableData.length = 0
    tableData.push(...res)
  } catch (error) {
    ElMessage.error('获取注册列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const handleCurrentChange = (val: User | undefined) => {
  currentRow.value = val || null
}

const handleAction = async (action: 'activate' | 'delete') => {
  if (!currentRow.value) {
    ElMessage.warning('请先选择一条记录')
    return
  }

  const actionText = action === 'activate' ? '激活' : '删除'
  const confirmed = await ElMessageBox.confirm(
    `确定要${actionText}用户 "${currentRow.value.name}" 吗？`,
    '确认操作',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => true).catch(() => false)

  if (!confirmed) return

  try {
    const res = await handleRigiAPI({ action, id: currentRow.value.id })
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
  <div class="registers-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>待审核注册列表</span>
          <el-button type="primary" link @click="fetchData">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <div v-if="currentRow" class="action-bar">
        <el-button type="success" @click="handleAction('activate')">
          <el-icon><Check /></el-icon> 激活用户
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
        <el-table-column prop="name" label="用户名" width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column prop="register_time" label="申请时间" width="180" />
      </el-table>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无待审核的注册申请" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { ElMessageBox } from 'element-plus'
</script>

<style scoped>
.registers-container {
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
