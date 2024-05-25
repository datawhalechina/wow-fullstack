<script setup lang="ts">
import { useLoginStore } from "../../store";
import {getProfileAPI, deleteProfileAPI, submitProfileAPI} from '../../request/user/api'
const loginstate = useLoginStore();
document.title = "编辑个人信息"
import { reactive, onMounted } from 'vue'
import router from '../../router'
import { ref } from 'vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  },
  {
    name: 'plant-1.png',
    url: '/static/img/讲座.png',
  },
  {
    name: 'food.jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
  }
])



const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const userid = loginstate.id

const handleRemove: UploadProps['onRemove'] = async (uploadFile) => {
    let res = await deleteProfileAPI({filename:uploadFile.name})
    console.log(res)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleChange: UploadProps['onChange'] = (uploadFile) => {
    console.log(uploadFile)
}

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  gender: '',
  desc: '',
})

const getProfile = async () => {
  let res = await getProfileAPI({userid:userid})
  form.name = res.name
  form.region = res.location
  form.gender = res.gender
  form.desc = res.desc
  fileList.value.length = 0
  console.log(res.profiles)
  res.profiles.forEach((item:any) => {
    item.url = loginstate.iframeurl+'/'+ item.url
    fileList.value.push(item)
  });
}

onMounted(getProfile)

const onSubmit = async () => {
  console.log(form)
  let data = {info:JSON.stringify(form)}
  let res = await submitProfileAPI(data)
  console.log(res)
  router.push('/user/profile/'+userid)
}
</script>

<template>
    <el-form :model="form" label-width="120px">
    <el-form-item label="名字">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="性别">
      <el-radio-group v-model="form.gender">
        <el-radio label="男" />
        <el-radio label="女" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="居住地">
      <el-input v-model="form.region" />
    </el-form-item>
    <el-form-item label="相册">
        <div>限最多五张</div>
    </el-form-item>
    <el-form-item label="">
      <el-upload
        v-model:file-list="fileList"
        :action="loginstate.iframeurl+'/'+ 'api/users/save_profile'"
        list-type="picture-card"
        drag
        :data={id:userid}
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-change="handleChange"
        :limit=5
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </el-form-item>
    
    <br><br><br>
    <el-form-item label="知识资产">
      <el-input rows="10" v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
    
</template>

<style lang="scss" scoped>
</style>