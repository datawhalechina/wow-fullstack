<script setup lang="ts">
import {fetchAllUsersAPI} from '../../request/user/api'
import { onMounted, reactive } from 'vue'
import { useLoginStore } from "../../store";
const loginstate = useLoginStore();
document.title = "全塾"
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
    <el-table-column label="手机">
        <template #default="scope">
            <span v-if="loginstate.id==1">{{ scope.row.phone}}</span>
            <span v-else>{{ scope.row.phone.slice(0,3) }}****{{ scope.row.phone.slice(-4) }}</span>
        </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
</style>