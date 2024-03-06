<script setup lang="ts">
import { useLoginStore } from "../../store";
import {getCourseAPI} from '../../request/course/api'
import { reactive, onMounted } from 'vue'
const loginstate = useLoginStore();
import { useRoute } from 'vue-router'
const route = useRoute()
const courseid = Number(route.params.id)
const userid = loginstate.id

const getCourse = async () => {
  let res = await getCourseAPI({course_id:courseid})
  console.log(res)
}

onMounted(getCourse)
</script>

<template>
 
</template>

<style lang="scss" scoped>
</style>