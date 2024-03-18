<script setup lang="ts">
import { useLoginStore } from "../../store";
import {fetchFinishedProjectsAPI} from '../../request/inno/api'
import { ref, reactive, onMounted, computed } from 'vue'
const loginstate = useLoginStore();
const tableData:any = reactive([])
const today = ref(new Date());  
const getAllFinishedProjects = async () => {
  let res = await fetchFinishedProjectsAPI()
  console.log(res)
  tableData.push(...res)
}
onMounted(getAllFinishedProjects)

// 计算属性，根据截止日期返回颜色  
const deadlineColors = computed(() => {  
  return tableData.reduce((colors, row) => {  
    const deadlineDate = new Date(row.deadline);  
    const diffDays = (deadlineDate - today.value) / (1000 * 60 * 60 * 24);  
  
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
  


</script>

<template>
  <h5>所有项目</h5>
  <el-table 
    :data="tableData" 
    stripe 
    highlight-current-row
    style="width: 100%"
    >
        <el-table-column prop="task_serial" label="项目号" width="80" />
        <el-table-column label="执行人">
        <template #default="scope">
            <el-link type="primary" :href="'/user/profile/'+scope.row.taker_id" target="_blank">{{ scope.row.taker }}</el-link>
        </template>
        </el-table-column>
        <el-table-column label="塾师">
          <template #default="scope">
            <el-link type="primary" :href="'/user/profile/'+scope.row.shushi_id" target="_blank">{{ scope.row.shushi }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="发布人">
        <template #default="scope">
            <el-link type="primary" :href="'/user/profile/'+scope.row.publisher_id" target="_blank">{{ scope.row.publisher }}</el-link>
        </template>
        </el-table-column>
        <el-table-column label="名称">
        <template #default="scope">
            <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.title }}</el-link>
        </template>
        </el-table-column>
        <el-table-column label="开始日期">
        <template #default="scope">
            {{ scope.row.start_date?scope.row.start_date.slice(0,10):'' }}
        </template>
        </el-table-column>
        <el-table-column label="截止日期">
        <template #default="scope">
            {{ scope.row.deadline?scope.row.deadline.slice(0,10):'' }}
        </template>
        </el-table-column>
        <el-table-column prop="planed_hour" label="计划用时" />
        <el-table-column prop="actual_hour" label="实际用时" />
        <el-table-column prop="half_progress" label="半程进度" />
        <el-table-column label="完成日期">
        <template #default="scope">
            {{ scope.row.finish_date?scope.row.finish_date.slice(0,10):'' }}
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