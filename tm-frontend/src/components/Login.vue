<template>

  <!-- Form -->
  <span v-if="!loginstate.logined || loginstate.name.length==0">
    <el-button text @click="loginstate.dialogFormVisible = true">登录</el-button>
    <el-button text @click="registerFormVisible = true">注册</el-button>
  </span>
  
  <span v-else>
    <el-link type="primary" href="/user" target="_blank">{{ loginstate.name }}</el-link>
    <el-button text @click="logOut">登出</el-button>
  </span>
  

  <el-dialog v-model="loginstate.dialogFormVisible" :width="diaglogwidth" :center="true" title="登录">
    <el-form :model="form">
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.password" autocomplete="off" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="checklogin">登录</el-button>
        <el-button @click="forgetPassDialogVisible = true">
          忘记密码
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="forgetPassDialogVisible" :width="diaglogwidth" :center="true" title="忘记密码">
    <el-form :model="forgetPassForm">
      <el-form-item label="手机号" :label-width="formLabelWidth">
        <el-input v-model="forgetPassForm.phone" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="sendResetEmail">发送重置邮件</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="registerFormVisible" :width="diaglogwidth" :center="true" title="注册">
    <el-form :model="formRegi" ref="ruleFormRef" :rules="rules" status-icon>
      <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
        <el-input v-model="formRegi.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
        <el-input v-model="formRegi.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass" :label-width="formLabelWidth">
        <el-input v-model="formRegi.checkpass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
        <el-input v-model="formRegi.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone" :label-width="formLabelWidth">
        <el-input v-model.number="formRegi.phone" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="register(ruleFormRef)">注册</el-button>
      </span>
    </template>
  </el-dialog>



</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useLoginStore } from "../store";
import { loginAPI, RegisterAPI, resetPassAPI, forgotPasswordAPI } from '../request/user/api'
import router from "../router";
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const registerFormVisible = ref(false)
const forgetPassDialogVisible = ref(false)
const formLabelWidth = '70px'
const diaglogwidth = '370px'
const loginstate = useLoginStore();

const form = reactive({
  phone: '',
  password: '',
})

const forgetPassForm = reactive({
  phone: '',
})

const ruleFormRef = ref<FormInstance>()
interface RuleForm {
  name: string
  password: string
  checkpass: string
  email: string
  phone: string
}

const formRegi = reactive<RuleForm>({
  name: '',
  password: '',
  checkpass: '',
  email: '',
  phone: ''
})

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== formRegi.password) {
    console.log("密码不一致")
    console.log(rule)
    callback(new Error("密码不一致!"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: '请输入名字', trigger: 'blur' },
    { min: 2, max: 5, message: '长度为2到5个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码应不少于六位', trigger: 'blur' },
  ],
  checkpass: [{ validator: validatePass2, trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式错误', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ],
})



const checklogin = async() => {
  try {
    console.log("发送请求")
    let data = {phone: form.phone, password: form.password}
    let res = await loginAPI(data)
    // console.log(res);
    // console.log("接收数据")
    if (res.id>0) {
      loginstate.id = res.id
      loginstate.name = res.username
      loginstate.atoken = res.atoken
      loginstate.rtoken = res.rtoken
      loginstate.logined = true
      loginstate.dialogFormVisible = false
      form.phone = ""
      form.password = ""
      window.location.reload();
    }
  } catch (error) {
      // alert("用户名或密码错误,请重新输入")
      ElMessage({
        type: 'error',
        message: error,
      })

    console.log(error)
  }
}

const logOut = () => {
  loginstate.id = 0
  loginstate.name = ""
  loginstate.atoken = "atoken"
  loginstate.rtoken = "rtoken"
  loginstate.logined = !loginstate.logined
  router.push('/')
  window.location.reload();
}

const sendResetEmail = async () => {
  try {
    let data = { phone: forgetPassForm.phone }
    let res = await forgotPasswordAPI(data)
    if (res.message === "密码重置邮件已发送,请查收邮箱") {
      ElMessage({
        type: 'success',
        message: '密码重置邮件已发送,请查收邮箱',
      })
      forgetPassDialogVisible.value = false
      forgetPassForm.phone = ''
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: error.message || '发送重置邮件失败',
    })
  }
}

const register = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      console.log(formRegi)
      doRegister()
    } else {
      alert('请完善注册信息!')
    }
  })
}

const doRegister = async() => {
  let data = {
    name: formRegi.name, 
    password: formRegi.password,
    email:formRegi.email,
    phone:formRegi.phone,
  }
  let res = await RegisterAPI(data)
  if (res.code == 200){
    alert("注册成功，请等待至多三天审核！")
    formRegi.name = ''
    formRegi.password = ''
    formRegi.checkpass = ''
    formRegi.email = ''
    formRegi.phone = ''
    registerFormVisible.value = false
  } else {
    alert("注册失败")
  }
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
