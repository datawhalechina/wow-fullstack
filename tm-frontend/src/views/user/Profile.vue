<script setup lang="ts">
import {getProfileAPI, fetchGoalAPI, saveGoalAPI} from '../../request/user/api'
import { ISaveGoal } from  '../../request/user/type'
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const userid = Number(route.params.id)
const diaglogwidth = '600px'
const formLabelWidth = '100px'
const editGoalFormVisible = ref(false)
const fileList = reactive([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  }
])

const form = reactive({
  name: '',
  region: '',
  gender: '',
  desc: '',
})

const goal = reactive<ISaveGoal>({
  goal_id:0,
  content: '',
  start_date: '',
  deadline: '',
  process: 0,
  review:'',
  action:''
})



const getProfile = async () => {
  let res = await getProfileAPI({userid:userid})
  form.name = res.name
  form.region = res.location
  form.gender = res.gender
  form.desc = res.desc
  fileList.length = 0
  fileList.push(...res.profiles)
  console.log(res.profiles)
  let rtn = await fetchGoalAPI()
  console.log(rtn)
  if (rtn.id>0) {
    goal.goal_id = rtn.id
    goal.content = rtn.content
    goal.start_date = rtn.start_time
    goal.deadline = rtn.deadline
    goal.process = rtn.process
    goal.review = rtn.review
  } else {
    goal.goal_id = 0
    goal.content = ""
    goal.start_date = ""
    goal.deadline = ""
    goal.process = 0
    goal.review = ""
  }
  
  
}

onMounted(getProfile)

const edit = async ()=> {
    editGoalFormVisible.value = true
}

const goal_confirm = async() => {
  editGoalFormVisible.value = false
  console.log(goal.goal_id)
    let data = {goal_id:goal.goal_id, 
      content:goal.content, 
      start_date:goal.start_date,
      deadline:goal.deadline,
      process:goal.process,
      review:goal.review,
      action:"保存"
    }
    let res = await saveGoalAPI(data)
    console.log(res)
}


const goal_complete = async() => {
  editGoalFormVisible.value = false
    let data = {goal_id:goal.goal_id, 
      content:goal.content, 
      start_date:goal.start_date,
      deadline:goal.deadline,
      process:goal.process,
      review:goal.review,
      action:"完成"
    }
    let res = await saveGoalAPI(data)
    console.log(res)
}
</script>

<template>
    <div>名字：{{ form.name }}</div>
    <div>性别：{{ form.gender }}</div>
    <div>居住地：{{ form.region }}</div>
    <div>相册：</div>
    <div class="demo-image">
        <div v-for="pic in fileList" :key="pic.name" class="block">
        <el-image 
        style="width: 100px; height: 100px" 
        :preview-src-list="[pic.url]"
        :max-scale="7"
        :min-scale="0.2"
        :src="pic.url" 
        :fit="'scale-down'"/>
        </div>
    </div>
    <div>自我描述：{{ form.desc }}</div>
    <h2>我的目标</h2>
    <el-button type="primary" @click="edit()">编辑</el-button>
    <div style="white-space: pre-wrap;">{{ goal.content }}</div>
    <div>阶段：{{ goal.start_date?goal.start_date.slice(0,10):'' }}到{{ goal.deadline?goal.deadline.slice(0,10):'' }}</div>
    <div>进度：{{ goal.process }}</div>
    <div style="white-space: pre-wrap;">{{ goal.review }}</div>

  <el-dialog v-model="editGoalFormVisible" :width="diaglogwidth" :center="true" title="编辑目标">
    <el-form :model="goal">
      <el-form-item label="目标" prop="content" :label-width="formLabelWidth">
        <el-input type="textarea" :row="3" v-model="goal.content" autocomplete="off" />
      </el-form-item>
      <el-form-item label="开始日期" prop="start_date" :label-width="formLabelWidth">
        <el-date-picker v-model="goal.start_date" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="截止日期" prop="deadline" :label-width="formLabelWidth">
        <el-date-picker v-model="goal.deadline" value-format="YYYY-MM-DD" type="date" />
      </el-form-item>
      <el-form-item label="进度" prop="process" :label-width="formLabelWidth">
        <el-input type="number" min="0" max="10" step="1" v-model="goal.process" autocomplete="off" />
      </el-form-item>
      <el-form-item label="复盘" prop="review" :label-width="formLabelWidth">
        <el-input type="textarea" :row="3" v-model="goal.review" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="goal_confirm()">保存</el-button>
        <el-button v-if="goal.review" type="primary" @click="goal_complete()">完成</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<style lang="scss" scoped>
.demo-image .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  display: inline-block;
  width: 20%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image .block:last-child {
  border-right: none;
}
</style>