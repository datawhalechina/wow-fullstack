<script setup lang="ts">
import { useLoginStore } from "../../store";
import {getProfileAPI, fetchGoalAPI, saveGoalAPI, fetchGoaltalkAPI, confirmTalkAPI, confirmReserveAPI} from '../../request/user/api'
import {fetchShushisAPI, fetchShushengsAPI} from '../../request/user/api'
import { ISaveGoal, IGetShumen } from  '../../request/user/type'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
document.title = "个人信息"
const route = useRoute()
const loginstate = useLoginStore();
const current_userid = loginstate.id
const userid = Number(route.params.id)
const diaglogwidth = '600px'
const formLabelWidth = '100px'
const editGoalFormVisible = ref(false)
const goalTalkFormVisible = ref(false)
const radio_shushi = ref(0)
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



const goal_talk = reactive({
  id:0,
  shushi_id:0,
  shushi_name: '',
  planed_time: '',
  presenter:'',
  planed_duration: 10,
  access_info: '',
  confirmed_time: '',
})

const shushis = reactive<IGetShumen[]>([])
const shushengs = reactive<IGetShumen[]>([])
const who =computed(()=>{
  if (current_userid==userid){
    return '我'
  } else if (current_userid!=userid && form.gender=='男'){
    return '他'
  } else if (current_userid!=userid && form.gender=='女'){
    return '她'
  } else {
    return 'TA'
  }
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
  let rtn = await fetchGoalAPI({userid:userid})
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

const getShumen = async () => {
  let res1 = await fetchShushisAPI({userid:userid})
  shushis.push(...res1)
  let res2 = await fetchShushengsAPI({userid:userid})
  shushengs.push(...res2)

  let res3 = await fetchGoaltalkAPI({presenter:'塾生'})
  console.log(res3)
  if(res3.length>0) {
    
    goal_talk.id = res3[0].id
    goal_talk.shushi_id = res3[0].shushi_id
    goal_talk.shushi_name = res3[0].shushi_name
    goal_talk.presenter = res3[0].presenter
    goal_talk.planed_time = res3[0].planed_time
    goal_talk.planed_duration = res3[0].planed_duration
    goal_talk.access_info = res3[0].access_info
    goal_talk.confirmed_time = res3[0].confirmed_time
  }
  console.log(goal_talk)
  
}

onMounted(()=>{
  getProfile()
  getShumen()
})

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

const reserve_talk = async() => {
  goalTalkFormVisible.value = true
}

const confirm_reserve = async() => {
  goal_talk.shushi_id = shushis[radio_shushi.value].id
  goal_talk.shushi_name = shushis[radio_shushi.value].name
  let res = await confirmReserveAPI({shushi_id:goal_talk.shushi_id, planed_time:goal_talk.planed_time,planed_duration:goal_talk.planed_duration})
  goal_talk.id = res.talk_id
  goalTalkFormVisible.value = false
}

const confirm_talk = async() => {
  let res = await confirmTalkAPI({id:goal_talk.id, confirmer:"塾生"})
  goal_talk.confirmed_time = new Date().toLocaleTimeString()
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
        :preview-src-list="[loginstate.iframeurl+'/'+pic.url]"
        :max-scale="7"
        :min-scale="0.2"
        :src="loginstate.iframeurl+'/'+pic.url" 
        :fit="'scale-down'"/>
        </div>
    </div>
    <h2>{{ who }}的知识资产</h2>
    <div style="white-space: pre-wrap;">{{ form.desc }}</div>
    <h2>{{ who }}的目标</h2>
    <el-button v-if="current_userid==userid" type="primary" @click="edit()">编辑</el-button>
    <div style="white-space: pre-wrap;">{{ goal.content }}</div>
    <div>阶段：{{ goal.start_date?goal.start_date.slice(0,10):'' }}到{{ goal.deadline?goal.deadline.slice(0,10):'' }}</div>
    <div>进度：{{ goal.process }}</div>
    <div style="white-space: pre-wrap;">{{ goal.review }}</div>

    <h2>{{ who }}的<el-link type="primary" href="/user/mytalk" target="_blank"><h2>目标面谈</h2></el-link></h2>
    <el-button v-if="goal_talk.shushi_name==''" type="primary" @click="reserve_talk()">预约目标面谈</el-button>
    <div v-if="goal_talk.shushi_name">塾师：{{ goal_talk.shushi_name }}</div>
    <div v-if="goal_talk.planed_time">面谈时间：{{ goal_talk.planed_time?goal_talk.planed_time:'' }}</div>
    <div v-if="goal_talk.planed_time">面谈时长：{{ goal_talk.planed_duration }}分钟</div>
    <div v-if="goal_talk.access_info">面谈入口：{{ goal_talk.access_info }}</div>
    <el-button v-if="!goal_talk.confirmed_time && goal_talk.shushi_name && goal_talk.presenter=='塾师'" type="primary" @click="confirm_talk()">确认参加</el-button>
    <div v-if="!goal_talk.confirmed_time && goal_talk.shushi_name">待塾师确认</div>
    <div v-if="goal_talk.confirmed_time">已确认</div>

    <h2>{{ who }}的塾门</h2>
    <div>
      塾师：
      <div style="margin-right: 20px;" v-for="item in shushis">
        <el-link type="primary" :href="'/user/profile/'+item.id" target="_blank">{{ item.name }}</el-link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-link type="primary" :href="'/course/'+item.course_id" target="_blank">{{ item.course_title }}</el-link>
      </div>
    </div>

    <div>
      塾生：
      <div style="margin-right: 20px;" v-for="item in shushengs">
        <el-link type="primary" :href="'/user/profile/'+item.id" target="_blank">{{ item.name }}</el-link>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-link type="primary" :href="'/course/'+item.course_id" target="_blank">{{ item.course_title }}</el-link>
      </div>
    </div>

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

  <el-dialog v-model="goalTalkFormVisible" :width="diaglogwidth" :center="true" title="预约面谈">
    <el-form :model="goal_talk">
      <el-radio-group v-model="radio_shushi" class="ml-4">
            <span style="margin-right:20px;" v-for="(item,index) in shushis">
              <el-radio :label="index" size="large">{{ item.name }}</el-radio>
            </span>
        </el-radio-group>
      <el-form-item label="面谈时间" prop="start_date" :label-width="formLabelWidth">
        <el-date-picker v-model="goal_talk.planed_time" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" />
      </el-form-item>
      <el-form-item label="时长" prop="process" :label-width="formLabelWidth">
        <el-input type="number" min="10" max="60" step="5" v-model="goal_talk.planed_duration" autocomplete="off" />
        分钟
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm_reserve()">确定</el-button>
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