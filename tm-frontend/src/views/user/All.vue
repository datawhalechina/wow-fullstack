<script setup lang="ts">
import { fetchAllUsersAPI } from '../../request/user/api'
import { onMounted, reactive, ref } from 'vue'
import { useLoginStore } from '../../store'
import { ElTable, ElMessage } from 'element-plus'

document.title = '全塾用户'

const loginstate = useLoginStore()
const tableData = reactive<any[]>([])
const loading = ref(false)

const isAdmin = computed(() => loginstate.id === 1)

const fetchAll = async () => {
  loading.value = true
  try {
    const res = await fetchAllUsersAPI()
    tableData.length = 0
    tableData.push(...res)
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchAll)

const maskPhone = (phone: string) => {
  if (!phone) return ''
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}
</script>

<template>
  <div class="all-container">
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="$router.back()" title="返回">
            <template #content>
              <span class="header-title">全塾用户</span>
            </template>
          </el-page-header>
          <el-button type="primary" link @click="fetchAll">
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
        <el-table-column label="用户名" width="100">
          <template #default="scope">
            <el-link type="primary" :href="`/user/profile/${scope.row.id}`" target="_blank">
              {{ scope.row.username }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="100" />
        <el-table-column prop="location" label="地点" min-width="150" />
        <el-table-column label="手机号" width="150">
          <template #default="scope">
            <span v-if="isAdmin">{{ scope.row.phone }}</span>
            <span v-else>{{ maskPhone(scope.row.phone) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="register_time" label="注册时间" width="180" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag type="danger" v-if="scope.row.role === 'admin'">管理员</el-tag>
            <el-tag v-else>用户</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && tableData.length === 0" description="暂无用户" />
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.all-container {
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

.header-title {
  font-size: 18px;
  font-weight: 600;
}
</style>
