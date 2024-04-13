<script setup lang="ts">
import { calMentorsAPI, selectMentorAPI } from '../../request/course/api';
import { reactive, onMounted } from 'vue'
import router from '../../router'

document.title = "选塾师"
const tableData:any = reactive([])
const getAllMentor = async () => {
    let res = await calMentorsAPI()
    console.log(res)
    let tmp = {
      shushi_id:res.director_id,
      shushi_name:res.director_name,
      course_id:res.course_id
    }
    if (res.mentor_count <10) {
      tableData.push(tmp)
    }
    let mentors = res.mentors
    tableData.push(...mentors)
}
onMounted(getAllMentor)

const currentSelections:any = reactive([])
const getCurrentSelection = async () => {
  let res2:any[] = []
  res2.forEach((course:any) => {
    console.log(course.course_id)
    currentSelections.push(course.course_id)
  })
}
onMounted(getCurrentSelection)

// 补充selection函数
const selection = async (shushi_name:string,shushi_id:number,course_id:number) => {
  if(confirm("确定要选择"+shushi_name+"作为塾师吗？")==true){
    let data = {shushi_id:shushi_id,courseid:course_id}
    let res = await selectMentorAPI(data)
    console.log(res)
    router.push('/learn/')
  }
}
</script>

<template>
  <h5 class="tablecss">选择塾师</h5>
  <h5 v-if="tableData.length==0" class="tablecss">当前没有塾师可供选择</h5>
  <el-table v-if="tableData.length>0" class="tablecss" :data="tableData">
    <el-table-column label="塾师">
      <template #default="scope">
        <el-link :href="'/user/profile/'+scope.row.shushi_id" target="_blank" type="primary">{{ scope.row.shushi_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button link type="primary" @click="selection(scope.row.shushi_name, scope.row.shushi_id, scope.row.course_id)">选择</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
// 样式
.tablecss {
    margin: 0 auto;
    margin-top: 50px;
    margin-bottom: 50px;
    text-align: center;
}
</style>