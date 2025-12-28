<template>
  <div class="agent-list-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-page-header @back="$router.back()" title="返回">
            <template #content>
              <span class="header-title">Coze 智能体列表</span>
            </template>
          </el-page-header>
          <el-button type="primary" @click="dialogVisible = true">
            <el-icon><Plus /></el-icon>添加智能体
          </el-button>
        </div>
      </template>

      <div v-if="agents.length === 0" class="empty-tip">
        <el-empty description="暂未添加智能体" />
      </div>

      <div v-else class="agent-grid">
        <el-card
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          shadow="hover"
        >
          <div class="agent-info">
            <el-avatar :size="60" :src="agent.avatar" />
            <h3>{{ agent.name }}</h3>
            <p class="agent-desc">{{ agent.description }}</p>
            <div class="agent-actions">
              <el-button type="primary" @click="startChat(agent.id)">开始对话</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 添加智能体对话框 -->
    <el-dialog v-model="dialogVisible" title="添加智能体" width="400px">
      <el-form :model="newAgent" label-width="80px">
        <el-form-item label="智能体ID">
          <el-input v-model="newAgent.id" placeholder="从扣子开发页面URL中获取" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="newAgent.name" placeholder="给智能体起个名字" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="newAgent.description" type="textarea" placeholder="简单描述一下" />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model="newAgent.avatar" placeholder="头像URL（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addAgent">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Agent {
  id: string
  name: string
  description: string
  avatar: string
}

const router = useRouter()
const agents = ref<Agent[]>([])
const dialogVisible = ref(false)
const newAgent = ref({
  id: '',
  name: '',
  description: '',
  avatar: 'https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png'
})

// 从本地存储加载智能体列表
onMounted(() => {
  const saved = localStorage.getItem('coze-agents')
  if (saved) {
    agents.value = JSON.parse(saved)
  }
})

// 保存智能体列表到本地存储
const saveAgents = () => {
  localStorage.setItem('coze-agents', JSON.stringify(agents.value))
}

// 添加智能体
const addAgent = () => {
  if (!newAgent.value.id || !newAgent.value.name) {
    ElMessage.warning('请填写智能体ID和名称')
    return
  }

  agents.value.push({
    id: newAgent.value.id,
    name: newAgent.value.name,
    description: newAgent.value.description,
    avatar: newAgent.value.avatar || 'https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png'
  })

  saveAgents()
  dialogVisible.value = false
  newAgent.value = {
    id: '',
    name: '',
    description: '',
    avatar: 'https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png'
  }
  ElMessage.success('添加成功')
}

// 开始对话
const startChat = (id: string) => {
  router.push(`/agent/${id}`)
}
</script>

<style scoped>
.agent-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
}

.empty-tip {
  padding: 40px 0;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 10px 0;
}

.agent-card {
  text-align: center;
  transition: transform 0.3s;
}

.agent-card:hover {
  transform: translateY(-5px);
}

.agent-info h3 {
  margin: 15px 0 10px;
  font-size: 18px;
}

.agent-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.agent-actions {
  margin-top: 10px;
}
</style>
