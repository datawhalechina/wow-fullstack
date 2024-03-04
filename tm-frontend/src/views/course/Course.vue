<script setup lang="ts">
import {fetchCourseAPI, selectCourseAPI, fetchCurrentSelectionAPI} from '../../request/course/api'
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

const currentSelections:any = reactive([])
const getCurrentSelection = async () => {
  let res2 = await fetchCurrentSelectionAPI()
  res2.forEach((course:any) => {
    console.log(course.course_id)
    currentSelections.push(course.course_id)
  })
}
onMounted(getCurrentSelection)

// 补充selection函数
const selection = async (title:string,id:number) => {
  if(confirm("确定要选择"+title+"吗？")==true){
    let data = {id:loginstate.id,courseid:id}
    let res = await selectCourseAPI(data)
    console.log(res)
    router.push('/user/learn/')
  }
}

// 补充selection函数
const deselection = async () => {
  alert("不要轻言放弃，请找塾师谈心。")
}
</script>

<template>
  <h5>全部课程</h5>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="title" label="课程名称" width="180" />
    <el-table-column label="塾师">
      <template #default="scope">
        <el-link :href="'/user/profile/'+scope.row.director_id" target="_blank" type="primary">{{ scope.row.director_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button v-if="currentSelections.includes(scope.row.id)" link type="primary" @click="deselection()">退选</el-button>
        <el-button v-else-if="currentSelections.length<4" link type="primary" @click="selection(scope.row.title, scope.row.id)">选课</el-button>
        <span v-else>禁选</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
</style>