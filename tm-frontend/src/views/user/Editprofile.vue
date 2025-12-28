<script setup lang="ts">
import { useLoginStore } from '../../store'
import { getProfileAPI, deleteProfileAPI, submitProfileAPI } from '../../request/user/api'
import { reactive, onMounted, ref } from 'vue'
import router from '../../router'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { UploadFilled, Delete, Picture } from '@element-plus/icons-vue'

document.title = '编辑个人信息'

const loginstate = useLoginStore()
const userid = loginstate.id
const loading = ref(false)
const submitting = ref(false)

const fileList = ref<UploadUserFile[]>([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const form = reactive({
  name: '',
  region: '',
  gender: '',
  desc: ''
})

const getProfile = async () => {
  loading.value = true
  try {
    const res = await getProfileAPI({ userid })
    form.name = res.name || ''
    form.region = res.location || ''
    form.gender = res.gender || ''
    form.desc = res.desc || ''
    fileList.value = []

    if (res.profiles && res.profiles.length) {
      res.profiles.forEach((item: any) => {
        fileList.value.push({
          name: item.name,
          url: item.url.startsWith('http') ? item.url : `${loginstate.iframeurl}/${item.url}`
        })
      })
    }
  } catch (error) {
    ElMessage.error('获取信息失败')
  } finally {
    loading.value = false
  }
}

onMounted(getProfile)

const handleRemove: UploadProps['onRemove'] = async (uploadFile) => {
  try {
    const res = await deleteProfileAPI({ filename: uploadFile.name })
    if (res.code === 200) {
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const onSubmit = async () => {
  submitting.value = true
  try {
    const data = { info: JSON.stringify(form) }
    const res = await submitProfileAPI(data)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      router.push(`/user/profile/${userid}`)
    } else {
      ElMessage.error(res.detail || '保存失败')
    }
  } catch (error: any) {
    ElMessage.error(error.detail || '保存失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="editprofile-container" v-loading="loading">
    <el-card class="form-card">
      <template #header>
        <el-page-header @back="$router.back()">
          <template #content>
            <span class="title">编辑个人信息</span>
          </template>
        </el-page-header>
      </template>

      <el-form :model="form" label-position="top" size="large">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="form.name" placeholder="请输入用户名" prefix-icon="User" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.gender">
                <el-radio value="男">男</el-radio>
                <el-radio value="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="居住地">
          <el-input v-model="form.region" placeholder="请输入居住地" prefix-icon="Location" clearable />
        </el-form-item>

        <el-form-item label="相册（最多5张）">
          <el-upload
            v-model:file-list="fileList"
            :action="`${loginstate.iframeurl}/api/users/save_profile`"
            :data="{ id: userid }"
            list-type="picture-card"
            :limit="5"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
          >
            <el-icon><UploadFilled /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible" title="预览" width="600px">
            <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%" />
          </el-dialog>
        </el-form-item>

        <el-form-item label="个人简介">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="6"
            placeholder="请输入个人简介"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="onSubmit" class="submit-btn">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.editprofile-container {
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.submit-btn {
  width: 120px;
}

:deep(.el-upload--picture-card) {
  width: 80px;
  height: 80px;
  line-height: 80px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 80px;
  height: 80px;
}
</style>
