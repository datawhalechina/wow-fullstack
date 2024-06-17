<script setup lang="ts">
import {fetchAllSelectionAPI} from '../../request/course/api'
import { ref, reactive, onMounted, computed } from 'vue'

document.title = "学习管理"
const tableData:any = reactive([])
const today = ref(new Date());  
const getAllSelection = async () => {
  let res = await fetchAllSelectionAPI()
  console.log(res)
  tableData.push(...res)
}
onMounted(getAllSelection)

// 计算属性，根据截止日期返回颜色  
const deadlineColors = computed(() => {  
  return tableData.reduce((colors:any, row:any) => {  
    const deadlineDate = new Date(row.deadline);  
    const diffMilliseconds = (deadlineDate.getTime() - (today.value as Date).getTime());
    const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);  
  
    if (diffDays === 0) {  
      colors[row.deadline] = 'orange';  
    } else if (diffDays > 0 && diffDays <= 3) {  
      colors[row.deadline] = 'blue';  
    } else if (diffDays < 0) {  
      colors[row.deadline] = 'red';  
    } else {  
      colors[row.deadline] = '';  
    }  
  
    return colors;  
  }, {} as { [key: string]: string });  
});  
  
// 函数，用于获取截止日期的颜色  
function getDeadlineColor(deadline: string) {  
  return deadlineColors.value[deadline] || '';  
}  


</script>

<template>
  <h5>所有选课</h5>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="塾生" width="80" prop="user_name" sortable>
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.user_id" target="_blank">{{ scope.row.user_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="塾师" width="80" prop="shushi_name" sortable>
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.shushi_id" target="_blank">{{ scope.row.shushi_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="课程名称" prop="course_title" sortable>
      <template #default="scope">
        <el-link :href="'/course/'+scope.row.course_id" target="_blank" type="primary">{{ scope.row.course_title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column label="章节名称" prop="chapter_title" sortable>
      <template #default="scope">
        <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.chapter_title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="current_serial" label="课次" />
    <el-table-column label="截止日期">
      <template #default="scope">
        <span :class="getDeadlineColor(scope.row.deadline)">  
          {{ scope.row.deadline?scope.row.deadline.slice(0,10):'' }} 
        </span>  
      </template>
    </el-table-column>
  </el-table>
</template>


<style lang="scss" scoped>
.orange {  
  color: orange;  
}  
.blue {  
  color: blue;  
}  
.red {  
  color: red;  
}  
</style>