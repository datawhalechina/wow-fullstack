<script setup lang="ts">
import { useLoginStore } from "../../store";
import {fetchAllSelectionAPI} from '../../request/course/api'
import { ref, reactive, onMounted } from 'vue'
const loginstate = useLoginStore();
const tableData:any = reactive([])
const getAllSelection = async () => {
  let res = await fetchAllSelectionAPI()
  console.log(res)
  tableData.push(...res)
}
onMounted(getAllSelection)


function isFloat(str:string) {
    // 定义浮点数的正则表达式
    var reg = /^[-+]?(\d+)?\.\d+$/;
    
    return reg.test(str);
}


</script>

<template>
  <h5>所有选课</h5>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="名字">
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.user_id" target="_blank">{{ scope.row.user_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="course_title" label="课程名称" width="180" />
    <el-table-column label="章节名称">
      <template #default="scope">
        <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.chapter_title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="current_serial" label="课次" />
    <el-table-column prop="deadline" label="截止日期" />
  </el-table>
</template>


<style lang="scss" scoped>
</style>