<script setup lang="ts">
import { useLoginStore } from '../../store'
import { getProfileAPI } from '../../request/user/api'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElImage } from 'element-plus'

document.title = '个人信息'

const route = useRoute()
const loginstate = useLoginStore()
const currentUserId = computed(() => loginstate.id)
const targetUserId = Number(route.params.id)

const fileList = reactive<{ name: string; url: string }[]>([])
const loading = ref(false)

const form = reactive({
  name: '',
  gender: '',
  region: '',
  desc: ''
})

const who = computed(() => {
  if (currentUserId.value === targetUserId) return '我'
  if (currentUserId.value !== targetUserId && form.gender === '男') return '他'
  if (currentUserId.value !== targetUserId && form.gender === '女') return '她'
  return 'TA'
})

const getProfile = async () => {
  loading.value = true
  try {
    const res = await getProfileAPI({ userid: targetUserId })
    form.name = res.name || ''
    form.gender = res.gender || ''
    form.region = res.location || ''
    form.desc = res.desc || ''
    fileList.length = 0
    if (res.profiles && res.profiles.length) {
      fileList.push(...res.profiles)
    }
  } catch (error) {
    console.error('获取信息失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(getProfile)

const getImageUrl = (url: string) => {
  if (url.startsWith('http')) return url
  return `${loginstate.iframeurl}/${url}`
}
</script>

<template>
  <div class="profile-container" v-loading="loading">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="$router.back()">
            <template #content>
              <span class="title">{{ who }}的个人信息</span>
            </template>
          </el-page-header>
        </div>
      </template>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户名">
          <el-tag type="primary">{{ form.name || '未设置' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="性别">{{ form.gender || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="居住地">{{ form.region || '未设置' }}</el-descriptions-item>
        <el-descriptions-item label="简介">{{ form.desc || '暂无简介' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 相册 -->
      <div class="section" v-if="fileList.length > 0">
        <h3 class="section-title">相册</h3>
        <div class="image-gallery">
          <el-image
            v-for="pic in fileList"
            :key="pic.name"
            :src="getImageUrl(pic.url)"
            :preview-src-list="fileList.map(p => getImageUrl(p.url))"
            fit="cover"
            class="gallery-image"
          />
        </div>
      </div>

      <el-empty v-if="!loading && !form.name" description="暂无信息" />
    </el-card>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  padding: 4px 0;
}

.title {
  font-size: 18px;
  font-weight: 600;
}

.section {
  margin-top: 24px;
}

.section-title {
  font-size: 16px;
  color: #303133;
  margin: 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gallery-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;
}

.gallery-image:hover {
  transform: scale(1.05);
}
</style>
