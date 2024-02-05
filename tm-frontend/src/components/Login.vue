<template>

  <!-- Form -->
  <el-button v-if="!loginstate.logined" text @click="dialogFormVisible = true">登录</el-button>
  <span v-else>
    <el-button text>{{ loginstate.name }}</el-button>
    <el-button text @click="logOut">登出</el-button>
  </span>
  

  <el-dialog v-model="dialogFormVisible" :width="diaglogwidth" :center="true" title="登录">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="checklogin">登录</el-button>
        <el-button @click="dialogFormVisible = false">
          注册
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useLoginStore } from "../store";

const dialogFormVisible = ref(false)
const formLabelWidth = '70px'
const diaglogwidth = '370px'
const loginstate = useLoginStore();

const form = reactive({
  name: '',
  password: '',
})

const checklogin = () => {
  loginstate.logined = true
dialogFormVisible.value = false
}

const logOut = () => {
  loginstate.logined = false
}

</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 200px;
}
.el-input {
  width: 200px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
