<script setup lang="ts">
import { useLoginStore } from "../../store";
const loginstate = useLoginStore();
const userid = loginstate.id
</script>

<template>
    <el-link v-if="loginstate.id==1" type="primary" href="/user/registers" target="_blank">注册列表</el-link>
    <br />
    <el-link type="primary" href="/user/changepass" target="_blank">修改密码</el-link>
    <br />
    <el-link type="primary" href="/user/editprofile" target="_blank">编辑个人信息</el-link>
    <br />
    <el-link type="primary" :href="'/user/profile/'+userid" target="_blank">展示个人信息</el-link>
    <br />
    <el-link type="primary" href="/user/supervise" target="_blank">监督</el-link>

    
</template>

<style lang="scss" scoped>
</style>