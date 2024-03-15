<script setup lang="ts">
import { calMentorsAPI, selectMentorAPI } from '../../request/course/api';
import { reactive, onMounted } from 'vue'
import router from '../../router'
import { useLoginStore } from "../../store";
const loginstate = useLoginStore();

const shushidata = reactive([
    {
        id:1,
        mentor_id:1,
        mentor_name:"黎伟",
        course_id:1,
        course_title:"前端开发",
    },
])


const tableData:any = reactive([])
const getAllMentor = async () => {
    let res = await calMentorsAPI()
    console.log(res)
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
const selection = async (title:string,shushi_id:number,course_id:number) => {
  if(confirm("确定要选择"+title+"作为塾师吗？")==true){
    let data = {shushi_id:shushi_id,courseid:course_id}
    let res = await selectMentorAPI(data)
    console.log(res)
    // router.push('/learn/')
  }
}
</script>

<template>
  <h5 class="tablecss">选择塾师</h5>
  <h5 v-if="tableData.length==0" class="tablecss">请先选课再选塾师</h5>
  <el-table v-if="tableData.length>0" class="tablecss" :data="tableData">
    <el-table-column label="塾师">
      <template #default="scope">
        <el-link :href="'/user/profile/'+scope.row.shushi_id" target="_blank" type="primary">{{ scope.row.shushi_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template #default="scope">
        <el-button link type="primary" @click="selection(scope.row.shushi_name, scope.row.shushi_id, scope.row.id)">选择</el-button>
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