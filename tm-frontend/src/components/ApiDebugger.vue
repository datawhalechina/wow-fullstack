<template>
  <el-card>
    <el-form :model="form" label-width="120px">
      <el-form-item label="接口地址">
        <el-input v-model="form.endpoint" placeholder="请输入接口地址" />
      </el-form-item>
      <el-form-item label="请求方法">
        <el-select v-model="form.method" placeholder="请选择请求方法">
          <el-option label="GET" value="GET" />
          <el-option label="POST" value="POST" />
          <el-option label="PUT" value="PUT" />
          <el-option label="DELETE" value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item label="请求参数">
        <el-input
          v-model="form.params"
          type="textarea"
          :rows="4"
          placeholder="请输入JSON格式的请求参数"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发送请求</el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="响应结果" name="response">
        <pre><code>{{ response }}</code></pre>
      </el-tab-pane>
      <el-tab-pane label="请求信息" name="request">
        <pre><code>{{ requestInfo }}</code></pre>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const props = defineProps({
  defaultEndpoint: {
    type: String,
    default: ''
  },
  defaultMethod: {
    type: String,
    default: 'GET'
  }
})

const form = reactive({
  endpoint: props.defaultEndpoint,
  method: props.defaultMethod,
  params: ''
})

const activeTab = ref('response')
const response = ref('')
const requestInfo = ref('')

const onSubmit = async () => {
  try {
    const config = {
      method: form.method,
      url: form.endpoint,
      data: form.params ? JSON.parse(form.params) : null
    }

    requestInfo.value = JSON.stringify(config, null, 2)
    const res = await axios(config)
    response.value = JSON.stringify(res.data, null, 2)
  } catch (error) {
    response.value = JSON.stringify(
      error.response?.data || error.message,
      null,
      2
    )
  }
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>