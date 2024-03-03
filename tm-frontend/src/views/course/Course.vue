<script setup lang="ts">
import {fetchCourseAPI, selectCourseAPI} from '../../request/course/api'
import { reactive, onMounted } from 'vue'
import router from '../../router'
import { useLoginStore } from "../../store";
const loginstate = useLoginStore();
const tableData:any = reactive([])
const getAllCourse = async () => {
  let res = await fetchCourseAPI()
  console.log(res)
  tableData.push(...res)
}
onMounted(getAllCourse)

// 补充selection函数
const selection = async (title:string,id:number) => {
  if(confirm("确定要选择"+title+"吗？")==true){
    let data = {id:loginstate.id,courseid:id}
    let res = await selectCourseAPI(data)
    console.log(res)
    router.push('/user/learn/')
  }
}
</script>

<template>
  <h5>全部课程</h5>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="title" label="课程名称" width="180" />
    <el-table-column prop="director_name" label="塾师" />
    <el-table-column prop="period" label="操作" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="selection(scope.row.title, scope.row.id)">选课</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
</style>