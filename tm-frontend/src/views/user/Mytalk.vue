<script setup lang="ts">
import {fetchFinishedGoaltalkAPI} from '../../request/user/api'
import { onMounted, ref, reactive } from 'vue'
import { ElTable } from 'element-plus'
document.title = "全部面谈"
let allData:any = reactive([])
const doFetch = async() => {
    let rtn = await fetchFinishedGoaltalkAPI({presenter:'塾生'})
    allData.push(...rtn)
}
onMounted(doFetch)

const contentFormVisible = ref(false)
const talk_content = ref('')
const diaglogwidth = '370px'


const view_content = async (content:string)=> {
  talk_content.value = content;
  contentFormVisible.value = true;
}


</script>

<template>
  
  <h2 class="text-center">历史目标面谈</h2>
  <el-table 
  :data="allData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column prop="id" label="ID号" />
    <el-table-column label="塾师" width="80" prop="shusheng_name" sortable>
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.shushi_id" target="_blank">{{ scope.row.shushi_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="finish_time" label="结束时间" />
    <el-table-column prop="actual_duration" label="实际用时" />
    <el-table-column label="内容">
      <template #default="scope">
        <el-button type="primary" @click="view_content(scope.row.content)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="contentFormVisible" :width="diaglogwidth" :center="true" title="目标面谈内容">
    <div>{{ talk_content }}</div>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>