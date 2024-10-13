<script setup lang="ts">
import { ref } from 'vue'
import Login from './Login.vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-row>
    <el-col :span="9">
      <a href="https://zishu.co">
        <img src="/logo.png" class="logo" alt="你好" />
      </a>
    </el-col>
    <el-col :span="9">

    </el-col>

    <el-col :span="6">
      <el-link style="float: right;margin-top:20px;" type="primary">
        <Login />
      </el-link>
    </el-col>
  </el-row>
  
</template>

<style lang="scss" scoped>
img.logo {
  padding-top:10px;
  height:40px;
  vertical-align: middle;
}
.logo {
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>