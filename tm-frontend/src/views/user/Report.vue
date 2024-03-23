<script setup lang="ts">
import { useLoginStore } from "../../store";
import {fetchReportsAPI} from '../../request/user/api'
import { onMounted, reactive } from 'vue'
const loginstate = useLoginStore();
let tableData:any = reactive([])
const fetchReports = async() => {
    let res = await fetchReportsAPI({userid:loginstate.id})
    tableData.push(...res)
}
onMounted(fetchReports)


</script>

<template>
  <el-table 
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column prop="target_type" label="事项" width="80" />
    <el-table-column prop="target_title" label="标题" />
    <el-table-column prop="time_granted" label="单时" />
    <el-table-column prop="grant_time" label="时间" />
  </el-table>
</template>

<style lang="scss" scoped>
</style>