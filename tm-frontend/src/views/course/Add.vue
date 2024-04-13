<script setup lang="ts">
import {SaveCourseAPI} from '../../request/course/api'
import {Chapter} from '../../request/course/type'
import { ref, reactive } from 'vue'
import { ElTable } from 'element-plus'
import router from '../../router'

document.title = "新增课程"
const courseid = ref(0)
const desc = ref('')
const input = ref('')

const addChapterFormVisible = ref(false)
const editChapterFormVisible = ref(false)
const diaglogwidth = '400px'
const formLabelWidth = '100px'
let tableData:Chapter[] = reactive([])

const course_text = ref('')

const update_course = async() => {
  tableData.length = 0
  let chapter_split = course_text.value.split("\n")
  chapter_split.forEach((row)=>{
    let fields = row.split("\t")
    if (fields.length==4){
      let temp = {
        id: 0,
        title: fields[0],
        author_id: 0,
        author_name: fields[1],
        period: fields[2],
        url:fields[3]
      }
      tableData.push(temp)
    }
  })
}

const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()


let newChapter = reactive<Chapter>({
  id: 0,
  title: '',
  author_id: 0,
  author_name: '',
  period: '',
  url:''
})

const handleCurrentChange = (val: Chapter | undefined) => {
  currentRow.value = val
}


const add_chapter = async() => {
  addChapterFormVisible.value = true
}



const add_confirm = async() => {
  let temp = {
    id: newChapter.id,
    title: newChapter.title,
    author_id: newChapter.author_id,
    author_name: newChapter.author_name,
    period: newChapter.period,
    url:newChapter.url
  }
  if (!currentRow.value) {
    tableData.push(temp)
  } else {
    let rowindex = tableData.indexOf(currentRow.value);
    tableData.splice(rowindex + 1, 0, temp)
  }
  addChapterFormVisible.value = false
  newChapter.title = ''
  newChapter.author_name = ''
  newChapter.period = ''
  newChapter.url = ''

}

// 请写出 edit_chapter 函数的处理逻辑
const edit_chapter = async() => {
  editChapterFormVisible.value = true
}

const edit_confirm = async() => {
  editChapterFormVisible.value = false

}

// 请写出 move_up 的函数
const move_up = async() => {
  if (!currentRow) return
  let rowindex = tableData.indexOf(currentRow.value)
  if (rowindex === 0) return
  let temp = tableData[rowindex]
  tableData.splice(rowindex, 1)
  tableData.splice(rowindex - 1, 0, temp)
}

// 请写出 move_down 的函数
const move_down = async() => {
  if (!currentRow) return
  let rowindex = tableData.indexOf(currentRow.value)
  if (rowindex === tableData.length - 1) return
  let temp = tableData[rowindex]
  tableData.splice(rowindex, 1)
  tableData.splice(rowindex + 1, 0, temp)
}

// 请写出 delete_chapter 的函数
const delete_chapter = async() => {
  if (!currentRow) return
  let rowindex = tableData.indexOf(currentRow.value)
  if (rowindex === -1) return
  tableData.splice(rowindex, 1)
}

// 请写出 save_course 的函数
const save_course = async() => {
  // 保存tableData的数据
  let data={
    "courseid":courseid.value,
    "title": input.value, 
    "desc":desc.value, 
    "chapters":JSON.stringify(tableData)
  }
  let res = await SaveCourseAPI(data)
  console.log(res)
  if (res.code == '200'){
    router.push('/learn')
  }
}

</script>

<template>
  <el-input v-model="input" placeholder="请输入课程名称" />
  <br><br>
  <el-input
    v-model="desc"
    maxlength="100"
    placeholder="请输入课程简介"
    show-word-limit
    type="textarea"
  />
  <br><br>
  <div>
    <el-button v-if="input.length>1 && desc.length>1" type="primary" @click="add_chapter">新增</el-button>
    <el-button v-if="currentRow" type="primary" @click="edit_chapter">编辑</el-button>
    <el-button v-if="currentRow" type="primary" @click="move_up">上移</el-button>
    <el-button v-if="currentRow" type="primary" @click="move_down">下移</el-button>
    <el-button v-if="currentRow" type="primary" @click="delete_chapter">删除</el-button>
  </div>
  <el-table 
  ref="singleTableRef"
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  @current-change="handleCurrentChange"
  v-if="tableData.length>0"
  >
    <el-table-column label="章节序号" type="index" width="100" />
    <el-table-column label="章节名称">
      <template #default="scope">
        <el-link type="primary" :href="scope.row.url" target="_blank">{{ scope.row.title }}</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="author_name" label="作者" />
    <el-table-column prop="period" label="学习周期" />
  </el-table>
  <el-button v-if="tableData.length>0" type="primary" @click="save_course">保存课程</el-button>

  <br><br>
  <el-input
    v-model="course_text"
    placeholder="请输入课程详细信息"
    :rows="5"
    type="textarea"
    @blur="update_course"
    v-if="input.length>1 && desc.length>1"
  />

  <el-dialog v-model="addChapterFormVisible" :width="diaglogwidth" :center="true" title="新增章节">
    <el-form :model="newChapter" ref="ruleFormRef" status-icon>
      <el-form-item label="章节名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="newChapter.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="作者" prop="author_name" :label-width="formLabelWidth">
        <el-input v-model="newChapter.author_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学习周期" prop="period" :label-width="formLabelWidth">
        <el-input v-model="newChapter.period" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学习地址" prop="url" :label-width="formLabelWidth">
        <el-input v-model="newChapter.url" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="add_confirm()">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="editChapterFormVisible" :width="diaglogwidth" :center="true" title="编辑章节">
    <el-form :model="currentRow" ref="ruleFormRef" status-icon>
      <el-form-item label="章节名称" prop="title" :label-width="formLabelWidth">
        <el-input v-model="currentRow.title" autocomplete="off" />
      </el-form-item>
      <el-form-item label="作者" prop="author_name" :label-width="formLabelWidth">
        <el-input v-model="currentRow.author_name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学习周期" prop="period" :label-width="formLabelWidth">
        <el-input v-model="currentRow.period" autocomplete="off" />
      </el-form-item>
      <el-form-item label="学习地址" prop="url" :label-width="formLabelWidth">
        <el-input v-model="currentRow.url" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="edit_confirm()">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>