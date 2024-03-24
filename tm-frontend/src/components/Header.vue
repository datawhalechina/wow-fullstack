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
      <a href="/">
        <img src="/logo.png" class="logo" alt="你好" />
      </a>
    </el-col>
    <el-col :span="9">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        @select="handleSelect"
        style="width: 50%"
        router
      >
        <el-menu-item index="/learn">学习</el-menu-item>
        <el-menu-item index="/inno">创新</el-menu-item>
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