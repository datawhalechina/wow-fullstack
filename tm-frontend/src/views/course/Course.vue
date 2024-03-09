<script setup lang="ts">
import {fetchCourseAPI, selectCourseAPI, fetchCurrentSelectionAPI, reportLearnAPI} from '../../request/course/api'
import { ref, reactive, onMounted } from 'vue'
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

const currentTableData:any = reactive([])
const currentSelections:any = reactive([])
const getCurrentSelection = async () => {
  let res2 = await fetchCurrentSelectionAPI()
  currentTableData.push(...res2)
  res2.forEach((course:any) => {
    console.log(course.course_id)
    currentSelections.push(course.course_id)
  })
}
onMounted(getCurrentSelection)

function isFloat(str:string) {
    // 定义浮点数的正则表达式
    var reg = /^[-+]?(\d+)?\.\d+$/;
    
    return reg.test(str);
}


const report = async (row:any) => {
  let reported_hour = prompt("请确认已学完《"+row.chapter_title+"》并填写申报学习时间，单位为小时数。")
  
  if (reported_hour != null){
    if (isFloat(reported_hour)){
      let data = {chapter_id:row.chapter_id,course_id:row.course_id,chapter_title:row.chapter_title,sele_id:row.sele_id,reported_hour:reported_hour}
      let res = await reportLearnAPI(data)
      console.log(res)
      if(res.code==200){
        alert("已成功申报《"+row.chapter_title+"》"+reported_hour+"小时")
        currentTableData.length=0
        getCurrentSelection()
      }
    } else {
      alert("请输入整数或小数")
    }
  }
  
  
}

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
  <h5>我的选课</h5>
  <el-table :data="currentTableData" style="width: 100%">
    <el-table-column label="课程名称" width="100">
      <template #default="scope">
        <el-link :href="'/course/'+scope.row.course_id" target="_blank" type="primary">{{ scope.row.course_title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="章节名称">
      <template #default="scope">
        <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.chapter_title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="current_serial" label="课次" />
    <el-table-column label="截止日期">
      <template #default="scope">
        {{ scope.row.deadline.slice(0,10) }}
      </template>
    </el-table-column>
    <el-table-column prop="period" label="操作" width="180">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="report(scope.row)">申报时间</el-button>
      </template>
    </el-table-column>
  </el-table>

  <h5>全部课程</h5>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="课程名称" width="100">
      <template #default="scope">
        <el-link :href="'/course/'+scope.row.id" target="_blank" type="primary">{{ scope.row.title }}</el-link>
      </template>
    </el-table-column>
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