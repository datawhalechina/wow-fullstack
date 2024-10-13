<script setup lang="ts">
import { useLoginStore } from "../../store";
document.title = "个人中心"
const loginstate = useLoginStore();
const userid = loginstate.id
</script>

<template>
    <el-link v-if="loginstate.id==1" type="primary" href="/user/registers" target="_blank">注册列表</el-link>
    <br />
    <el-link type="primary" href="/user/changepass" target="_blank">修改密码</el-link>
    <br />
    <div v-if="loginstate.id==1"><el-link type="primary" href="/user/resetpass" target="_blank">重置密码</el-link></div>
    <el-link type="primary" href="/user/editprofile" target="_blank">编辑个人信息</el-link>
    <br />
    <el-link type="primary" :href="'/user/profile/'+userid" target="_blank">展示个人信息</el-link>
    <br />
    <el-link type="primary" href="/user/all" target="_blank">全塾</el-link>
    

    
</template>

<style lang="scss" scoped>
</style>