<template>
  <div class="coze-chat-container">
    <div ref="chatContainer" class="coze-chat-slot"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import "@coze/chat-sdk/webCss"
import ChatSdk from "@coze/chat-sdk/webJs"

const props = defineProps<{
  id: string
}>()

const chatContainer = ref<HTMLElement | null>(null)
let chatFramework: any = null

// 从环境变量获取配置
const baseUrl = import.meta.env.VITE_COZE_BASE_URL || 'http://localhost:8888'
const token = import.meta.env.VITE_COZE_TOKEN || ''

// 用户信息（可以从 store 获取）
const userInfo = {
  id: "user_" + Date.now(),
  name: "用户",
  avatar: "https://sf16-passport-sg.ibytedtos.com/obj/user-avatar-alisg/e0622b06d99df6ead022ca4533ca631f.png"
}

const { ChatFramework, ChatType, Language } = ChatSdk

onMounted(() => {
  if (!token) {
    ElMessage.warning('请先配置 Coze API Token')
    return
  }
  if (chatContainer.value) {
    chatFramework = new ChatFramework({
      chat: {
        appId: props.id,
        type: ChatType.Bot,
      },
      setting: {
        apiBaseUrl: baseUrl,
        language: Language.ZH,
        requestHeader: {},
        logLevel: "debug",
      },
      auth: {
        token: token,
        onRefreshToken: () => {
          return token
        },
      },
      user: userInfo,
    })

    // 渲染到容器
    chatFramework.mount(chatContainer.value)
  }
})

onUnmounted(() => {
  if (chatFramework && chatContainer.value) {
    chatFramework.unmount(chatContainer.value)
  }
})
</script>

<style scoped>
.coze-chat-container {
  width: 100%;
  height: calc(100vh - 60px);
}

.coze-chat-slot {
  width: 100%;
  height: 100%;
}
</style>
