<script setup lang="ts">
import {ChangePassAPI} from '../../request/user/api'
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from "../../store";

document.title = "修改密码"
const loginstate = useLoginStore();
const formLabelWidth = '70px'
const ruleFormRef = ref<FormInstance>()
interface RuleForm {
  password: string
  checkpass: string
}

const formRegi = reactive<RuleForm>({
  password: '',
  checkpass: '',
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
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码应不少于六位', trigger: 'blur' },
  ],
  checkpass: [{ validator: validatePass2, trigger: 'blur' }],
})

const changepass = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      console.log(formRegi)
      doChangePass()
    } else {
      alert('请完善密码!')
    }
  })
}

const doChangePass = async() => {
  let data = {
    "name": loginstate.name,
    "newpass": formRegi.password,
  }
  let res = await ChangePassAPI(data)
  if (res.code == 200){
    alert("修改密码成功！")
    formRegi.password = ''
    formRegi.checkpass = ''

  } else {
    alert("修改密码失败！")
  }
}

</script>

<template>
    <el-form :model="formRegi" ref="ruleFormRef" :rules="rules" status-icon>
      <el-form-item label="新密码" prop="password" :label-width="formLabelWidth">
        <el-input v-model="formRegi.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkpass" :label-width="formLabelWidth">
        <el-input v-model="formRegi.checkpass" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="changepass(ruleFormRef)">确认</el-button>
</template>

<style lang="scss" scoped>
</style>