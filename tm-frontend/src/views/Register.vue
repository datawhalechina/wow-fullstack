<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="password" v-model="form.password" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="电话">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">注册</el-button>
    </el-form-item>
  </el-form>

  <el-card>
    <pre><code>{{ resultJson }}</code></pre>
  </el-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import { elCard } from "element-plus";
import axios from "axios";

const form = reactive({
  name: "",
  password: "",
  email: "",
  phone: "",
});

const resultJson = ref("");

const onSubmit = async () => {
  try {
    const response = await axios.post("/api/users/register", form);
    resultJson.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    resultJson.value = JSON.stringify(
      error.response?.data || error.message,
      null,
      2
    );
  }
};
</script>