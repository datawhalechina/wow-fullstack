<script setup lang="ts">
import {fetchGoaltalkAPI, fetchAllGoalsAPI, fetchFinishedGoaltalkAPI, editGoaltalkAPI, confirmTalkAPI, finishTalkAPI, fetchShushengsAPI} from '../../request/user/api'

import { useLoginStore } from "../../store";
const loginstate = useLoginStore();
const userid = loginstate.id
import { onMounted, ref, reactive } from 'vue'
import { ElTable } from 'element-plus'
document.title = "目标面谈安排"
let tableData:any = reactive([])
let allData:any = reactive([])
let goalData:any = reactive([])
const doFetch = async() => {
    let res = await fetchGoaltalkAPI({presenter:'塾师'})
    tableData.push(...res)
    let rtn = await fetchFinishedGoaltalkAPI({presenter:'塾师'})
    allData.push(...rtn)
    let rtn1 = await fetchAllGoalsAPI({presenter:'塾师'})
    goalData.push(...rtn1)
}
onMounted(doFetch)

const dialogFormVisible = ref(false)
const editFormVisible = ref(false)
const finishFormVisible = ref(false)
const contentFormVisible = ref(false)
const talk_content = ref('')
const formLabelWidth = '70px'
const diaglogwidth = '370px'

const form = reactive({
  id:0,
  shusheng_id:0,
  planed_time: '',
  planed_duration:10,
  access_info:''
})

const finish_data = reactive({
  actual_duration:10,
  content:''
})

const radio_performer = ref('不定')
const radio_shusheng = ref(0)

const shusheng_list = reactive([
  {
    id:1,
    name:"张三"
  },
  {
    id:2,
    name:"李四"
  }
])

const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()
interface Goaltalk {
    id: number
    shusheng_id: number
    shusheng_name: string
    create_time: string
    planed_time: string
    planed_duration: number
}

const handleCurrentChange = (val: Goaltalk | undefined) => {
  currentRow.value = val
}

const add = async() => {
    dialogFormVisible.value = true;
    let res = await fetchShushengsAPI({userid:userid})
    shusheng_list.length = 0
    shusheng_list.push(...res)
}



const submit_add = async() => {
  let temp = {
    id:0,
    shusheng_name: radio_performer.value=='塾生'?shusheng_list[radio_shusheng.value].name:'',
    shusheng_id:radio_performer.value=='塾生'?shusheng_list[radio_shusheng.value].id:0,
    planed_time:form.planed_time,
    planed_duration:form.planed_duration,
    presenter:"塾师"
  }
  let res = await editGoaltalkAPI({"id":temp.id,"counter_part_id":form.shusheng_id, "planed_time":form.planed_time, "planed_duration":form.planed_duration, "presenter":"塾师", "access_info":form.access_info})
  if (res.code == 200) {
    temp.id = res.id
    tableData.splice(0, 0, temp)
    dialogFormVisible.value = false
    form.shusheng_id = 0
    form.planed_time = ''
    form.planed_duration = 10
  }
}




const edit = async ()=> {
  editFormVisible.value = true;
  let res = await fetchShushengsAPI({userid:userid})
  shusheng_list.length = 0
  shusheng_list.push(...res)
  if (currentRow.value.shusheng_id) {
    for(let i=0;i<shusheng_list.length;i++){
      if (shusheng_list[i].id == currentRow.value.shusheng_id) {
        radio_shusheng.value = i
        radio_performer.value = '塾生'
      }
    }
  }
}

const submit_edit = async ()=> {
  currentRow.value.shusheng_name = radio_performer.value=='塾生'?shusheng_list[radio_shusheng.value].name:'';
  currentRow.value.shusheng_id = radio_performer.value=='塾生'?shusheng_list[radio_shusheng.value].id:0;
  let data = {
    "id":currentRow.value.id,
    "counter_part_id":currentRow.value.shusheng_id, 
    "planed_time":currentRow.value.planed_time, 
    "planed_duration":currentRow.value.planed_duration, 
    "presenter":"塾师",
    "access_info":currentRow.value.access_info
  }
  let res = await editGoaltalkAPI(data)
  if (res.code == 200) {
    editFormVisible.value = false;
  }
}

const confirm = async() => {
    let res = await confirmTalkAPI({id:currentRow.value.id, confirmer:"塾师"})
    currentRow.value.confirmed_time = new Date().toLocaleString()
    currentRow.value.confirmer = "塾师"
    console.log(res)
}



const finish = async ()=> {
  finishFormVisible.value = true;
}

const submit_finish = async ()=> {
  let data = {
    "id":currentRow.value.id,
    "actual_duration":finish_data.actual_duration, 
    "content":finish_data.content
  }
  let res = await finishTalkAPI(data)
  if (res.code == 200) {
    finishFormVisible.value = false;
    location.reload();
  }
  
}

const view_content = async (content:string)=> {
  talk_content.value = content;
  contentFormVisible.value = true;
}

function getDeadlineColor(deadline: string): string {  
  // 解析截止日期和今天日期  
  const deadlineDate = new Date(deadline);  
  const todayDate = new Date();  
  
  // 检查日期是否有效  
  if (isNaN(deadlineDate.getTime()) || isNaN(todayDate.getTime())) {  
    return ''; // 无效的日期，返回空字符串  
  }  
  
  // 计算日期差异（毫秒）  
  const diffMilliseconds = (deadlineDate.getTime() - todayDate.getTime());  
  // 转换为天数  
  const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24);  
  
  // 根据差异返回颜色  
  if (diffDays == 0) {  
    return 'orange';  
  } else if (diffDays > 0 && diffDays <= 3) {  
    return 'blue';  
  } else if (diffDays < 0) {  
    return 'red';  
  } else {  
    return '';  
  }  
}  



</script>

<template>
    <div>
    <el-button type="primary" @click="add">新增</el-button>
    <el-button v-if="currentRow" type="primary" @click="edit">编辑</el-button>
    <el-button v-if="currentRow && !currentRow.confirmer" type="primary" @click="confirm">确认</el-button>
    <el-button v-if="currentRow" type="primary" @click="finish">完成</el-button>
    </div>
  <el-table 
  ref="singleTableRef"
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  @current-change="handleCurrentChange"
  >
    <el-table-column label="面谈序号" type="index" width="80" />
    <el-table-column label="塾生">
      <template #default="scope">
        <el-link v-if="scope.row.shusheng_id" :href="'/user/profile/'+scope.row.shusheng_id" target="_blank" type="primary">{{ scope.row.shusheng_name }}</el-link>
        <el-link v-else type="primary"></el-link>
      </template>
    </el-table-column>
    <el-table-column label="预定时间">
      <template #default="scope">
        <span :class="getDeadlineColor(scope.row.planed_time)">  
          {{ scope.row.planed_time?scope.row.planed_time:'' }} 
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="planed_duration" label="计划时长" />
    <el-table-column prop="presenter" label="提出人" />
    <el-table-column prop="confirmed_time" label="确认时间" />
    <el-table-column prop="confirmer" label="确认人" />
    <el-table-column prop="access_info" label="面谈入口" />
  </el-table>

  <el-dialog v-model="dialogFormVisible" :width="diaglogwidth" :center="true" title="新建目标面谈">
    <el-form :model="form">
      <div v-if="shusheng_list.length>0">
        <el-radio-group v-model="radio_performer" class="ml-4">
            <el-radio label="不定" size="large">群发</el-radio>
            <el-radio label="塾生" size="large">约塾生</el-radio>
        </el-radio-group>
        <br />
        <el-radio-group v-if="radio_performer=='塾生'" v-model="radio_shusheng" class="ml-4">
            <span style="margin-right:20px;" v-for="(item, index) in shusheng_list">
              <el-radio :label="index" size="large">{{ item.name }}</el-radio>
            </span>
        </el-radio-group>
      </div>
      <el-form-item label="预定时间" prop="planed_time" :label-width="formLabelWidth">
        <el-date-picker v-model="form.planed_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
      </el-form-item>
      <el-form-item label="计划时长" :label-width="formLabelWidth">
        <el-input v-model="form.planed_duration" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit_add">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editFormVisible" :width="diaglogwidth" :center="true" title="编辑目标面谈">
    <el-form :model="currentRow">
      <div v-if="shusheng_list.length>0">
        <el-radio-group v-model="radio_performer" class="ml-4">
          <el-radio label="不定" size="large">群发</el-radio>
          <el-radio label="塾生" size="large">约塾生</el-radio>
        </el-radio-group>
        <br />
        <el-radio-group v-if="radio_performer=='塾生'" v-model="radio_shusheng" class="ml-4">
            <span style="margin-right:20px;" v-for="(item, index) in shusheng_list">
              <el-radio :label="index" size="large">{{ item.name }}</el-radio>
            </span>
        </el-radio-group>
      </div>
      <el-form-item label="预定时间" prop="planed_time" :label-width="formLabelWidth">
        <el-date-picker v-model="currentRow.planed_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
      </el-form-item>
      <el-form-item label="计划时长" :label-width="formLabelWidth">
        <el-input v-model="currentRow.planed_duration" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="面谈入口" :label-width="formLabelWidth">
        <el-input v-model="currentRow.access_info" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit_edit">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="finishFormVisible" :width="diaglogwidth" :center="true" title="完成目标面谈">
    <el-form :model="finish_data">
      <el-form-item label="实际时长" :label-width="formLabelWidth">
        <el-input v-model="finish_data.actual_duration" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="面谈内容" :label-width="formLabelWidth">
        <el-input rows="10" v-model="finish_data.content" type="textarea" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit_finish">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <br /><br /><br /><br />
  <h2 class="text-center">塾生目标</h2>
  <el-table 
  :data="goalData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column label="塾生" width="80" prop="shusheng_name" sortable>
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.shusheng_id" target="_blank">{{ scope.row.shusheng_name }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="start_time" label="开始时间" />
    <el-table-column label="截止时间">
      <template #default="scope">
        <span :class="getDeadlineColor(scope.row.deadline)">  
          {{ scope.row.deadline?scope.row.deadline:'' }} 
        </span>
      </template>
    </el-table-column>
    <el-table-column label="目标内容">
      <template #default="scope">
        <el-button type="primary" @click="view_content(scope.row.content)">查看</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="process" label="目标进度" />
    <el-table-column label="目标复盘">
      <template #default="scope">
        <el-button type="primary" @click="view_content(scope.row.review)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>

  <br /><br /><br /><br />
  <h2 class="text-center">历史目标面谈</h2>
  <el-table 
  :data="allData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  >
    <el-table-column prop="id" label="ID号" />
    <el-table-column label="塾生" width="80" prop="shusheng_name" sortable>
      <template #default="scope">
        <el-link type="primary" :href="'/user/profile/'+scope.row.shusheng_id" target="_blank">{{ scope.row.shusheng_name }}</el-link>
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

  <el-dialog v-model="contentFormVisible" :width="diaglogwidth" :center="true" title="具体内容">
    <div>{{ talk_content }}</div>
  </el-dialog>
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