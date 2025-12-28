<script setup lang="ts">
import { useLoginStore } from '../../store'
import { fetchShuzhiAPI } from '../../request/user/api'
import { onMounted, ref, reactive } from 'vue'
import { ElTable, ElMessage } from 'element-plus'

document.title = '塾值'

interface ShuzhiItem {
  target_type: string
  target_title: string
  amount: number
  balance: number
  comments: string
  create_time: string
}

const loginstate = useLoginStore()
const tableData = reactive<ShuzhiItem[]>([])
const loading = ref(false)

const fetchShuZhi = async () => {
  loading.value = true
  try {
    const res = await fetchShuzhiAPI({ userid: loginstate.id })
    tableData.length = 0
    tableData.push(...res)
  } catch (error) {
    ElMessage.error('获取塾值失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchShuZhi)
</script>

<template>
  <div class="shuzhi-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>塾值记录</span>
          <el-button type="primary" link @click="fetchShuZhi">
            <el-icon><Refresh /></el-icon> 刷新
          </el-button>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="target_type" label="事项" width="80" />
        <el-table-column prop="target_title" label="标题" min-width="150" />
        <el-table-column prop="amount" label="单值" width="80" />
        <el-table-column prop="balance" label="塾值" width="80" />
        <el-table-column prop="comments" label="备注" min-width="150" />
        <el-table-column prop="create_time" label="时间" width="180" />
      </el-table>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无塾值记录" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { Refresh } from '@element-plus/icons-vue'
</script>

<style scoped>
.shuzhi-container {
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
</style>
