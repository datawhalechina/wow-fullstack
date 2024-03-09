<script setup lang="ts">
import { useLoginStore } from "../../store";
import { ElTable } from 'element-plus'
import { onMounted, ref, reactive } from 'vue'
const loginstate = useLoginStore();
const userid = loginstate.id
const diaglogwidth = '400px'
const formLabelWidth = '100px'
const addTaskFormVisible = ref(false)
const editTaskFormVisible = ref(false)
const halfReportFormVisible = ref(false)
const finishReportFormVisible = ref(false)
const radio_half_process = ref('')
const taskdata = [
    {
        id: 1,
        publisher: "黎伟",
        publisher_id: 1,
        taker: "Tom",
        taker_id: 3,
        task_serial: "B001",
        title: "后端架构调整",
        url: "https://www.baidu.com",
        desc: "采用ts、vue3、element-plus等框架",
        start_date: "2024-01-09",
        deadline: "2024-01-29",
        planed_hour: 3,
        half_progress: "刚好",
        finish_date: "2024-01-28",
        actual_hour: 3,
        total_hour: 3,
        update_date: "2024-01-28",
    },
    {
        id: 2,
        publisher: "Lime",
        publisher_id: 2,
        taker: "",
        taker_id: 0,
        task_serial: "B002",
        title: "改变量名",
        url: "https://www.baidu.com",
        desc: "改成英文变量名",
        start_date: "2024-01-19",
        deadline: "2024-01-29",
        planed_hour: 3,
        half_progress: "",
        finish_date: "",
        actual_hour: 0,
        total_hour: 0,
        update_date: "",
    }
]
let tableData:any = reactive([])
tableData.push(...taskdata)
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

function padding(num:number, length:number) {
        let tmpnum = num.toString();
        for(var len = (tmpnum + "").length; len < length; len = tmpnum.length) {
            tmpnum = "0" + tmpnum;            
        }
        return tmpnum;
    }

const add_confirm = async() => {
    let tmpserial = ""
    let tmpnumber = 0
    tableData.forEach((row:Task) => {
        if (row.task_serial.slice(0,1) == selectvalue.value && Number(row.task_serial.slice(1))>tmpnumber) {
            tmpnumber = Number(row.task_serial.slice(1))
            let nextnumber = Number(row.task_serial.slice(1))+1
            tmpserial = selectvalue.value + padding(nextnumber,3)
        } else if (tmpserial=="") {
            tmpserial = selectvalue.value+"001"
        }
    });

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
    let now = new Date();
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}


const apply = async ()=> {
    let msg = "确定要认领《"+currentRow.value.title+"》吗？"
    if (confirm(msg)==true) {
        console.log("认领")
        currentRow.value.taker = loginstate.name
        currentRow.value.taker_id = loginstate.id
        let now = new Date();
        currentRow.value.update_date=now.toISOString().slice(0, 10)
    }
}


// 补充 half_confirm 函数
const half_confirm = async() => {
    currentRow.value.half_progress = radio_half_process.value
    halfReportFormVisible.value = false
    console.log(radio_half_process.value)
    let now = new Date();
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}

// 补充 finish_confirm 函数
const finish_confirm = async() => {
    finishReportFormVisible.value = false
    let now = new Date();
    currentRow.value.finish_date=now.toISOString().slice(0, 10)
    currentRow.value.update_date=now.toISOString().slice(0, 10)
}

</script>
<template>
<div>
    <el-button type="primary" @click="add">新增</el-button>
    <el-button v-if="currentRow && currentRow.taker==''" type="primary" @click="apply">认领</el-button>
    <el-button v-if="currentRow && currentRow.publisher_id==userid" type="primary" @click="edit">编辑</el-button>
    <el-button v-if="currentRow && currentRow.taker_id==userid && currentRow.half_progress==''" type="primary" @click="half_report">半程汇报</el-button>
    <el-button v-if="currentRow && currentRow.taker_id==userid && currentRow.half_progress.length>1 && currentRow.finish_date==''" type="primary" @click="finish_report">结束汇报</el-button>
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
    <el-table-column prop="taker" label="执行人" />
    <el-table-column prop="publisher" label="发布人" />
    <el-table-column prop="title" label="名称" />
    <el-table-column prop="start_date" label="开始日期" />
    <el-table-column prop="deadline" label="截止日期" />
    <el-table-column prop="planed_hour" label="计划用时" />
    <el-table-column prop="half_progress" label="半程进度" />
    <el-table-column prop="finish_date" label="结束日期" />
    <el-table-column prop="actual_hour" label="实际用时" />
    <el-table-column prop="total_hour" label="累计工时" />
    <el-table-column prop="update_date" label="更新日期" />
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


<el-dialog v-model="finishReportFormVisible" :width="diaglogwidth" :center="true" title="编辑任务">
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