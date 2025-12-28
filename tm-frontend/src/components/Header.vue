<script setup lang="ts">
import { ref } from 'vue'
import Login from './Login.vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-row align="middle">
    <el-col :span="8">
      <a href="https://zishu.co">
        <img src="/logo.png" class="logo" alt="你好" />
      </a>
    </el-col>
    <el-col :span="8">

    </el-col>

    <el-col :span="8" style="text-align: right;">
      <Login />
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