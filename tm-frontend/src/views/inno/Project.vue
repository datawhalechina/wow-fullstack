<script setup lang="ts">
import { useLoginStore } from "../../store";
import {fetchShushengsAPI} from '../../request/user/api'
import {fetchProjectsAPI, getNextSerialAPI, addProjectAPI, updateProjectAPI} from '../../request/inno/api'
import { ElTable } from 'element-plus'
import { onMounted, ref, reactive } from 'vue'
const loginstate = useLoginStore();
const userid = loginstate.id
const diaglogwidth = '400px'
const formLabelWidth = '100px'
const applyFormVisible = ref(false)
const addTaskFormVisible = ref(false)
const editTaskFormVisible = ref(false)
const halfReportFormVisible = ref(false)
const finishReportFormVisible = ref(false)
const radio_performer = ref('自己')
const radio_shusheng = ref(0)
const radio_half_process = ref('')
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


let tableData:any = reactive([])
// tableData.push(...taskdata)
const getAllProjects = async () => {
  let res = await fetchProjectsAPI()
  console.log(res)
  tableData.push(...res)
}
onMounted(getAllProjects)
const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()
interface Task {
    id: number
    publisher: string
    publisher_id: number
    taker: string
    taker_id: number
    task_serial: string
    title: string
    url: string
    desc: string
    start_date: string
    deadline: string
    planed_hour: number
    half_progress: string
    finish_date: string
    actual_hour: number
    total_hour: number
    update_date: string

}

const newTask = reactive<Task>({
  id: 0,
  publisher: loginstate.name,
  publisher_id: loginstate.id,
  taker: '',
  taker_id: 0,
  task_serial: '',
  title: '',
  url: '',
  desc: '',
  start_date: '',
  deadline: '',
  planed_hour: 0,
  half_progress: '',
  finish_date: '',
  actual_hour: 0,
  total_hour: 0,
  update_date: '',
  
})


const handleCurrentChange = (val: Task | undefined) => {
  currentRow.value = val
}

const add = async ()=> {
    addTaskFormVisible.value = true
}

const edit = async ()=> {
    editTaskFormVisible.value = true
}

const half_report = async ()=> {
    halfReportFormVisible.value = true
}

const finish_report = async ()=> {
    finishReportFormVisible.value = true
}

let selectvalue = ref('')

const select_options = [
  {
    value: 'F',
    label: '前端',
  },
  {
    value: 'B',
    label: '后端',
  },
  {
    value: 'D',
    label: '文档',
  },
  {
    value: 'T',
    label: '教程',
  },
  {
    value: 'G',
    label: '指南',
  },
  {
    value: 'C',
    label: '课程',
  }
]


const add_confirm = async() => {
    let tmpserial = ""
    let res = await getNextSerialAPI({task_type:selectvalue.value})
    tmpserial = res
    // let tmpnumber = 0
    // tableData.forEach((row:Task) => {
    //     if (row.task_serial.slice(0,1) == selectvalue.value && Number(row.task_serial.slice(1))>tmpnumber) {
    //         tmpnumber = Number(row.task_serial.slice(1))
    //         let nextnumber = Number(row.task_serial.slice(1))+1
    //         tmpserial = selectvalue.value + padding(nextnumber,3)
    //     } else if (tmpserial=="") {
    //         tmpserial = selectvalue.value+"001"
    //     }
    // });

    let temp = {
        id: 0,
        publisher: newTask.publisher,
        publisher_id: newTask.publisher_id,
        taker: newTask.taker,
        taker_id: newTask.taker_id,
        task_serial: tmpserial,
        title: newTask.title,
        url: newTask.url,
        desc: newTask.desc,
        start_date: newTask.start_date,
        deadline: newTask.deadline,
        planed_hour: newTask.planed_hour,
        half_progress: '',
        finish_date: '',
        actual_hour: 0,
        total_hour: 0,
        update_date: '',
        
        }
    let res2 = await addProjectAPI(temp)
    console.log(res2)
    temp.id = res2.project_id
    tableData.push(temp)
    console.log(temp)
    addTaskFormVisible.value = false
    newTask.title = ''
    newTask.task_serial = ''
    newTask.start_date = ''
    newTask.deadline = ''
    newTask.url = ''

}

// 补充 edit_confirm函数
const edit_confirm = async() => {
    editTaskFormVisible.value = false
    console.log(currentRow.value.title)
    let data = {
      project_id:currentRow.value.id, 
      action:'edit',
      title:currentRow.value.title,
      url:currentRow.value.url,
      desc:currentRow.value.desc,
      start_date:currentRow.value.start_date,
      deadline:currentRow.value.deadline,
      planed_hour:currentRow.value.planed_hour
    }
    let res = await updateProjectAPI(data)
    console.log(res)
    let now = new Date();
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}

const apply_confirm = async ()=> {
  console.log(radio_shusheng.value)
  applyFormVisible.value = false
  let data;
  if (radio_performer.value == "自己") {
    currentRow.value.taker = loginstate.name
    currentRow.value.taker_id = loginstate.id
    data = {project_id:currentRow.value.id, action:'apply'}
  } else {
    currentRow.value.shushi = loginstate.name
    currentRow.value.shushi_id = loginstate.id
    currentRow.value.taker = shusheng_list[radio_shusheng.value].name
    currentRow.value.taker_id = shusheng_list[radio_shusheng.value].id
    data = {project_id:currentRow.value.id, action:'allo', shusheng_id:shusheng_list[radio_shusheng.value].id}
  }
  console.log(data)
  let res = await updateProjectAPI(data)
  console.log(res)
  let now = new Date();
  currentRow.value.update_date=now.toISOString().slice(0, 10)

}

const apply = async ()=> {
  applyFormVisible.value = true
  let res = await fetchShushengsAPI({userid:userid})
  shusheng_list.length = 0
  shusheng_list.push(...res)
}



// 补充 half_confirm 函数
const half_confirm = async() => {
    currentRow.value.half_progress = radio_half_process.value
    halfReportFormVisible.value = false
    console.log(radio_half_process.value)
    let data = {project_id:currentRow.value.id, action:'half_report', half_progress:radio_half_process.value}
    let res = await updateProjectAPI(data)
    console.log(res)
    let now = new Date();
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}

// 补充 finish_confirm 函数
const finish_confirm = async() => {
    finishReportFormVisible.value = false
    let data = {project_id:currentRow.value.id, action:'finish_report', actual_hour:currentRow.value.actual_hour}
    let res = await updateProjectAPI(data)
    console.log(res)
    if (res.code == "200"){
      alert("成功申报"+currentRow.value.actual_hour+"小时！")
    }
    let now = new Date();
    currentRow.value.finish_date=now.toISOString().slice(0, 10)
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}

</script>
<template>
<div>
    <el-button type="primary" @click="add">新增</el-button>
    <el-button v-if="currentRow && !currentRow.taker" type="primary" @click="apply">认领</el-button>
    <el-button v-if="currentRow && currentRow.publisher_id==userid" type="primary" @click="edit">编辑</el-button>
    <el-button v-if="currentRow && currentRow.taker_id==userid && !currentRow.half_progress" type="primary" @click="half_report">半程汇报</el-button>
    <el-button v-if="currentRow && currentRow.taker_id==userid && currentRow.half_progress && !currentRow.finish_date" type="primary" @click="finish_report">结束汇报</el-button>
</div>
<el-table 
ref="singleTableRef"
:data="tableData" 
stripe 
highlight-current-row
style="width: 100%"
@current-change="handleCurrentChange"
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
    <el-table-column prop="half_progress" label="半程进度" />
    <el-table-column label="更新日期">
      <template #default="scope">
        {{ scope.row.update_date?scope.row.update_date.slice(0,10):'' }}
      </template>
    </el-table-column>
</el-table>

<el-dialog v-model="addTaskFormVisible" :width="diaglogwidth" :center="true" title="新增任务">
    <el-form :model="newTask">
      <el-form-item label="项目类别" :label-width="formLabelWidth">
        <el-select v-model="selectvalue" placeholder="请选择">
        <el-option
            v-for="item in select_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      </el-form-item>
      <el-form-item label="项目名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="newTask.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开始日期" prop="start_date" :label-width="formLabelWidth">
        <el-date-picker v-model="newTask.start_date" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="截止日期" prop="deadline" :label-width="formLabelWidth">
        <el-date-picker v-model="newTask.deadline" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="计划用时" prop="planed_hour" :label-width="formLabelWidth">
        <el-input v-model="newTask.planed_hour" autocomplete="off" />
      </el-form-item>
      <el-form-item label="详情链接" prop="url" :label-width="formLabelWidth">
        <el-input v-model="newTask.url" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="add_confirm()">确定</el-button>
      </span>
    </template>
</el-dialog>


<el-dialog v-model="editTaskFormVisible" :width="diaglogwidth" :center="true" title="编辑任务">
    <el-form :model="currentRow">
      <el-form-item label="项目名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="currentRow.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开始日期" prop="start_date" :label-width="formLabelWidth">
        <el-date-picker v-model="currentRow.start_date" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="截止日期" prop="deadline" :label-width="formLabelWidth">
        <el-date-picker v-model="currentRow.deadline" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="计划用时" prop="planed_hour" :label-width="formLabelWidth">
        <el-input v-model="currentRow.planed_hour" autocomplete="off" />
      </el-form-item>
      <el-form-item label="详情链接" prop="url" :label-width="formLabelWidth">
        <el-input v-model="currentRow.url" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="edit_confirm()">确定</el-button>
      </span>
    </template>
</el-dialog>

<el-dialog v-model="applyFormVisible" :width="diaglogwidth" :center="true" title="认领任务">
  <div v-if="shusheng_list.length>0">
    <el-radio-group v-model="radio_performer" class="ml-4">
        <el-radio label="自己" size="large">自己做</el-radio>
        <el-radio label="塾生" size="large">带塾生做</el-radio>
    </el-radio-group>
    <br />
    <el-radio-group v-if="radio_performer=='塾生'" v-model="radio_shusheng" class="ml-4">
        <span v-for="(item, index) in shusheng_list">
          <el-radio :label="index" size="large">{{ item.name }}</el-radio>&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
    </el-radio-group>
  </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="apply_confirm()">确定</el-button>
      </span>
    </template>
</el-dialog>

<el-dialog v-model="halfReportFormVisible" :width="diaglogwidth" :center="true" title="半程汇报">
    <el-radio-group v-model="radio_half_process" class="ml-4">
        <el-radio label="超前" size="large">超前</el-radio>
        <el-radio label="刚好" size="large">刚好</el-radio>
        <el-radio label="落后" size="large">落后</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="half_confirm()">确定</el-button>
      </span>
    </template>
</el-dialog>


<el-dialog v-model="finishReportFormVisible" :width="diaglogwidth" :center="true" title="结束汇报">
    <el-form :model="currentRow">
      <el-form-item label="实际用时" :label-width="formLabelWidth">
        <el-input type="number" v-model="currentRow.actual_hour" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="finish_confirm()">确定</el-button>
      </span>
    </template>
</el-dialog>


</template>

<style lang="scss" scoped>
</style>