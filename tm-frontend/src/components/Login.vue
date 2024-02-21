<template>

  <!-- Form -->
  <span v-if="!loginstate.logined">
    <el-button text @click="loginstate.dialogFormVisible = true">登录</el-button>
    <el-button text @click="registerFormVisible = true">注册</el-button>
  </span>
  
  <span v-else>
    <el-button text>{{ loginstate.name }}</el-button>
    <el-button text @click="logOut">登出</el-button>
  </span>
  

  <el-dialog v-model="loginstate.dialogFormVisible" :width="diaglogwidth" :center="true" title="登录">
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
        <el-button @click="forgetPass">
          忘记密码
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="registerFormVisible" :width="diaglogwidth" :center="true" title="注册">
    <el-form :model="formRegi">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="formRegi.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="创建密码" :label-width="formLabelWidth">
        <el-input v-model="formRegi.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" :label-width="formLabelWidth">
        <el-input v-model="formRegi.password2" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="register">注册</el-button>
      </span>
    </template>
  </el-dialog>



</template>

<script lang="ts" setup>
import { reactive,ref } from 'vue'
import { useLoginStore } from "../store";
import {loginAPI} from '../request/user/api'

const registerFormVisible = ref(false)
const formLabelWidth = '70px'
const diaglogwidth = '370px'
const loginstate = useLoginStore();

const form = reactive({
  name: '',
  password: '',
})

const formRegi = reactive({
  name: '',
  password: '',
  password2: '',
})

const checklogin = async() => {
    console.log("发送请求")
    let data = {username: form.name, password: form.password}
    let res = await loginAPI(data)
    console.log(res);
    console.log("接收数据")
    loginstate.atoken = res.atoken
    loginstate.rtoken = res.rtoken
    loginstate.logined = true
    loginstate.dialogFormVisible = false
}

const logOut = () => {
  loginstate.logined = false
  loginstate.atoken = "atoken"
  loginstate.rtoken = "rtoken"
}

const forgetPass = () => {
  console.log(form.name);
}

const register = () => {
  console.log(formRegi.name);
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
