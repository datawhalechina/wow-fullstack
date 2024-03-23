<script setup lang="ts">
import {fetchAllUsersAPI} from '../../request/user/api'
import { onMounted, reactive } from 'vue'
let tableData:any = reactive([])
const fetchAll = async() => {
    let res = await fetchAllUsersAPI()
    tableData.push(...res)
}
onMounted(fetchAll)


</script>

<template>
  <el-table 
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column label="名字" width="80">
        <template #default="scope">
            <el-link type="primary" :href="'/user/profile/'+scope.row.id" target="_blank">{{ scope.row.username }}</el-link>
        </template>
    </el-table-column>
    <el-table-column prop="gender" label="性别" />
    <el-table-column prop="location" label="地点" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="learn_hour" label="学时" />
    <el-table-column prop="create_hour" label="创时" />
    <el-table-column prop="shuzhi" label="塾值" />
    <el-table-column label="7天内计时">
        <template #default="scope">
            {{ Math.round(scope.row.total_hours_7d * 10) / 10 }}
        </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
</style>