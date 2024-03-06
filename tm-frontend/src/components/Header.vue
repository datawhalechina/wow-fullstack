<script setup lang="ts">
import { ref } from 'vue'
import Login from './Login.vue'

const activeIndex = ref('1')
const input = ref('')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<template>
  <el-row>
    <el-col :span="9">
      <a href="" target="_blank">
        <img src="/logo.png" class="logo" alt="你好" />
      </a>
    </el-col>
    <el-col :span="9">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        style="width: 400px"
        router
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-sub-menu index="2">
          <template #title>学习</template>
          <el-menu-item index="/course">课程</el-menu-item>
          <el-menu-item index="">item two</el-menu-item>
          <el-menu-item index="">item three</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/create/project">创造</el-menu-item>
      </el-menu>
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