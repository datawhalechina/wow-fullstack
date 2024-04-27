<script setup lang="ts">
import {resetListAPI, handleResetPassAPI} from '../../request/user/api'
import { onMounted, ref, reactive } from 'vue'
import { ElTable } from 'element-plus'
document.title = "重置密码列表"
let tableData:any = reactive([])
const fetchResetList= async() => {
    let res = await resetListAPI()
    tableData.push(...res)
}
onMounted(fetchResetList)

const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()
interface User {
    id: number
    username: string
    phone: string
    times:number
    create_time: string
    update_time: string
}

const handleCurrentChange = (val: User | undefined) => {
  currentRow.value = val
}

const reset_user = async ()=> {
    let msg = "确定要重置用户"+currentRow.value.username+"的密码吗？"
    if (confirm(msg)==true) {
        console.log("激活")
        let res = await handleResetPassAPI({"action":"reset", "id":currentRow.value.id})
        if (res.code == 200) {
            let index = tableData.indexOf(currentRow.value);
            if (index > -1) {
                tableData.splice(index, 1);
            }
        }
        
    }
}

const delete_user = async ()=> {
    let msg = "确定要删除用户"+currentRow.value.username+"的重置密码申请吗？"
    if (confirm(msg)==true) {
        console.log("删除")
        let res = await handleResetPassAPI({"action":"delete", "id":currentRow.value.id})
        if (res.code == 200) {
            let index = tableData.indexOf(currentRow.value);
            if (index > -1) {
                tableData.splice(index, 1);
            }
        }
    }
}

</script>

<template>
    <div v-if="currentRow">
    <el-button type="primary" @click="reset_user">重置</el-button>
    <el-button type="primary" @click="delete_user">删除</el-button>
    </div>
  <el-table 
  ref="singleTableRef"
  :data="tableData" 
  stripe 
  highlight-current-row
  style="width: 100%"
  @current-change="handleCurrentChange"
  >
    <el-table-column prop="id" label="id" width="80" />
    <el-table-column prop="username" label="名字" width="80" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="times" label="次数" />
    <el-table-column prop="create_time" label="创建时间" />
    <el-table-column prop="update_time" label="更新时间" />
  </el-table>
</template>

<style lang="scss" scoped>
</style>