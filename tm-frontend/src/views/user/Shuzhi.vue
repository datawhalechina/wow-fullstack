<script setup lang="ts">
import { useLoginStore } from "../../store";
import {fetchShuzhiAPI} from '../../request/user/api'
import { onMounted, reactive } from 'vue'
const loginstate = useLoginStore();
let tableData:any = reactive([])
const fetchShuZhi = async() => {
    let res = await fetchShuzhiAPI({userid:loginstate.id})
    tableData.push(...res)
}
onMounted(fetchShuZhi)


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
    <el-table-column prop="amount" label="单值" />
    <el-table-column prop="balance" label="塾值" />
    <el-table-column prop="comments" label="备注" />
    <el-table-column prop="create_time" label="时间" />
  </el-table>
</template>

<style lang="scss" scoped>
</style>