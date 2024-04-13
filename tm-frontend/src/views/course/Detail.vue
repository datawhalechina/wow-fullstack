<script setup lang="ts">
import { useLoginStore } from "../../store";
import {getCourseAPI} from '../../request/course/api'
import {Chapter} from '../../request/course/type'
import { reactive, onMounted} from 'vue'
const loginstate = useLoginStore();
document.title  = "课程明细"
import { useRoute } from 'vue-router'
const tableData:Chapter[] = reactive([])
const route = useRoute()
const courseid = Number(route.params.id)
const userid = loginstate.id

const getCourse = async () => {
  let res = await getCourseAPI({course_id:courseid})
  console.log(res)
  course.id = res.course.id
  course.title=res.course.title
  course.director_id=res.course.director_id
  course.director_name=res.course.director_name
  course.desc=res.course.desc
  tableData.push(...res.chapters)
  document.title  = course.title
}

onMounted(getCourse)

const course = reactive({
  id:0,
  title: '',
  director_name: '',
  director_id: 0,
  desc: '',
})

</script>

<template>
  <h3>{{ course.title }}</h3>
  <h5>塾主：<el-link type="primary" :href="'/user/profile/'+course.director_id" target="_blank">{{ course.director_name }}</el-link></h5>
  <h5 v-if="course.director_id==userid"><el-link type="primary" :href="'/course/edit/'+course.id" target="_blank">编辑课程</el-link></h5>
  <div>{{ course.desc }}</div>
 <el-table 
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column label="章节序号" type="index" width="100" />
    <el-table-column label="章节名称">
      <template #default="scope">
        <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="author_name" label="作者" />
    <el-table-column prop="period" label="学习周期" />
  </el-table>
</template>

<style lang="scss" scoped>
</style>