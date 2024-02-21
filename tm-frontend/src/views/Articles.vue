<script setup lang="ts">
import {checkAPI} from '../request/user/api'
const checkpro = async() => {
   console.log("发送项目查询")
    let res = await checkAPI()
    console.log(res);
    console.log("接收数据")
}
</script>

<template>
  <h1>你好</h1>
  <h5>信实 创新 奉献</h5>
  <el-button type="primary" @click="checkpro">检查</el-button>
</template>

<style lang="scss" scoped>
</style>