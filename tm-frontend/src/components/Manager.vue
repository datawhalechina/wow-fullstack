<template>
  <div class="manager-container">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-page-header @click="goHome" title="首页" style="cursor: pointer">
              <template #content>
                <span class="header-title">自塾时间管理</span>
              </template>
            </el-page-header>
          </div>
          <div class="header-actions">
            <el-button type="primary" @click="goToAgents">
              <el-icon><ChatDotRound /></el-icon>智能体
            </el-button>
          </div>
        </div>
      </template>

      <!-- 今日任务列表 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">今日任务</span>
          <span class="valid-time">今日有效工作时间：{{ validTime }}小时</span>
        </div>

        <div class="action-bar">
          <el-button type="primary" @click="start" :disabled="cur === -1">
            <el-icon><VideoPlay /></el-icon>开始
          </el-button>
          <el-button type="primary" @click="end" :disabled="cur === -1">
            <el-icon><VideoPause /></el-icon>结束
          </el-button>
          <el-button type="primary" @click="addWorks">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button type="danger" @click="deleteWorks" :disabled="cur === -1">
            <el-icon><Delete /></el-icon>删除
          </el-button>
          <el-button type="success" @click="finish" :disabled="validTime === '0' || no_time">
            <el-icon><FolderChecked /></el-icon>归档
          </el-button>
        </div>

        <el-table
          :data="taskList"
          highlight-current-row
          @current-change="highlight"
          style="width: 100%"
          row-class-name="task-row"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="[0]" label="编号" width="80">
            <template #default="{ row }">
              <el-input v-model="row[0]" @change="submit" size="small" placeholder="编号" />
            </template>
          </el-table-column>
          <el-table-column prop="[1]" label="主题" min-width="150">
            <template #default="{ row }">
              <el-input v-model="row[1]" @change="submit" size="small" placeholder="主题" />
            </template>
          </el-table-column>
          <el-table-column prop="[2]" label="目标用时" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row[2]" @change="submit" :min="0" size="small" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column prop="[3]" label="分拆事项" min-width="120">
            <template #default="{ row }">
              <el-input v-model="row[3]" @change="submit" size="small" placeholder="分拆事项" />
            </template>
          </el-table-column>
          <el-table-column prop="[4]" label="计划用时" width="100" align="center">
            <template #default="{ row }">
              <el-input-number v-model="row[4]" @change="submit" :min="0" size="small" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column prop="[5]" label="开始时间" width="100" align="center">
            <template #default="{ row }">
              <el-input v-model="row[5]" @change="submit" size="small" placeholder="开始时间" />
            </template>
          </el-table-column>
          <el-table-column prop="[6]" label="结束时间" width="100" align="center">
            <template #default="{ row }">
              <el-input v-model="row[6]" @change="submit" size="small" placeholder="结束时间" />
            </template>
          </el-table-column>
          <el-table-column prop="[7]" label="实际用时" width="90" align="center">
            <template #default="{ row }">
              <span>{{ row[7] ? (row[7]/60).toFixed(2) : '0' }}h</span>
            </template>
          </el-table-column>
          <el-table-column prop="[8]" label="日期" width="110" align="center">
            <template #default="{ row }">
              <el-input v-model="row[8]" @change="submit" size="small" placeholder="日期" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-divider />

      <!-- 归档记录 -->
      <div class="section" v-if="finishList.length > 0">
        <div class="section-header">
          <span class="section-title">归档记录</span>
          <span class="valid-time">当前列表总实际时间：{{ total_time }}小时</span>
        </div>

        <div class="filter-bar">
          <el-input
            v-model="searchItems[0]"
            placeholder="筛选编号"
            @input="filterfn"
            size="small"
            style="width: 120px"
          />
          <el-input
            v-model="searchItems[1]"
            placeholder="筛选主题"
            @input="filterfn"
            size="small"
            style="width: 150px; margin-left: 10px"
          />
          <el-input
            v-model="searchItems[2]"
            placeholder="筛选日期"
            @input="filterfn"
            size="small"
            style="width: 120px; margin-left: 10px"
          />
          <el-button type="primary" @click="export_list" size="small" style="margin-left: 10px">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>

        <el-table
          :data="finishList"
          highlight-current-row
          @current-change="highlight_archive"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="[0]" label="编号" width="80" align="center" />
          <el-table-column prop="[1]" label="主题" min-width="150" />
          <el-table-column prop="[2]" label="目标用时" width="90" align="center">
            <template #default="{ row }">
              {{ row[2] ? (row[2]/60).toFixed(2) : '0' }}h
            </template>
          </el-table-column>
          <el-table-column prop="[3]" label="分拆事项" min-width="120" />
          <el-table-column prop="[4]" label="计划用时" width="90" align="center">
            <template #default="{ row }">
              {{ row[4] ? (row[4]/60).toFixed(2) : '0' }}h
            </template>
          </el-table-column>
          <el-table-column prop="[5]" label="开始时间" width="100" align="center" />
          <el-table-column prop="[6]" label="结束时间" width="100" align="center" />
          <el-table-column prop="[7]" label="实际用时" width="90" align="center">
            <template #default="{ row }">
              {{ row[7] ? (row[7]/60).toFixed(2) : '0' }}h
            </template>
          </el-table-column>
          <el-table-column prop="[8]" label="日期" width="110" align="center" />
        </el-table>

        <!-- 选中归档项的详情 -->
        <div v-if="cur_archive !== -1" class="archive-detail">
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="日期">{{ cur_date }}</el-descriptions-item>
            <el-descriptions-item label="有效工作时间">{{ validTime_archive }}小时</el-descriptions-item>
            <el-descriptions-item label="编号">{{ cur_ID }}</el-descriptions-item>
            <el-descriptions-item label="主题">{{ cur_subject }}</el-descriptions-item>
            <el-descriptions-item label="目标用时">{{ targetTime }}小时</el-descriptions-item>
            <el-descriptions-item label="计划用时">{{ planTime }}小时</el-descriptions-item>
            <el-descriptions-item label="实际用时">{{ spentTime }}小时</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>

      <el-empty v-if="finishList.length === 0" description="暂无归档记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useLoginStore } from "../store";
import { useRouter } from "vue-router";
import { ref, reactive, onMounted, watchEffect, computed } from "vue";
import { fetchTmAPI, fetchPrAPI, savePrAPI, finishTmAPI } from '../request/inno/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatDotRound, VideoPlay, VideoPause, Plus, Delete, FolderChecked, Download
} from '@element-plus/icons-vue'

const loginstate = useLoginStore();
const router = useRouter();

document.title = "自塾时间管理";

const now = new Date();
const year = ref(now.getFullYear());
const month = ref((now.getMonth() + 1).toString().padStart(2, "0"));
const day = ref(now.getDate().toString().padStart(2, "0"));
const formattedDate = `${year.value}-${month.value}-${day.value}`;

const taskList: any = ref([]);
const finishList: any = ref([]);
const searchList: any = ref([]);
const searchItems = ref(["", "", "", ""]);
const cur = ref(-1);
const cur_archive = ref(-1);
const cur_ID = ref("");
const cur_subject = ref("");
const cur_date = ref("");
const validTime_archive = ref(0);
const spentTime = ref(0);
const planTime = ref(0);
const targetTime = ref(0);
const skey = ref(0);
const no_time = ref(false);
const total_time = ref('');

const validTime = computed(() => {
  let sumTime = 0;
  for (let i = 0; i < taskList.value.length; i++) {
    if (taskList.value[i][7] > 0) {
      sumTime += taskList.value[i][7];
    }
  }
  sumTime = sumTime / 60;
  return sumTime.toFixed(2);
});

const getTm = async () => {
  if (loginstate.id > 0) {
    let res = await fetchTmAPI({ user_id: loginstate.id });
    let pr = res.pr;
    let fn = res.fn;
    taskList.value = pr;
    finishList.value = fn;
    searchList.value = fn;
    if (taskList.value.length === 0) {
      addWorks();
    }
    total_time.value = cal_total_time(finishList.value);
  }
};

onMounted(() => {
  getTm();
});

const addWorks = () => {
  if (cur.value > -1) {
    const curList = taskList.value[cur.value];
    const newList = [
      curList[0], curList[1], curList[2], "", 0, "", "", "", "",
    ];
    taskList.value.splice(cur.value + 1, 0, newList);
  } else if (cur_archive.value > -1) {
    const curList = finishList.value[cur_archive.value];
    const newList = [
      curList[0], curList[1], curList[2], "", 0, "", "", "", "",
    ];
    taskList.value.push(newList);
  } else {
    taskList.value.push(["", "", 0, "", 0, "", "", "", ""]);
  }
  submit();
};

const getMin = (s1: any, s2: any) => {
  const reDate = /\d{4}-\d{1,2}-\d{1,2} /;
  s1 = new Date(
    (reDate.test(s1) ? s1 : "2018-1-1 " + s1).replace(/-/g, "/")
  );
  s2 = new Date(
    (reDate.test(s2) ? s2 : "2018-1-1 " + s2).replace(/-/g, "/")
  );
  const ms = s2.getTime() - s1.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 1000 / 60); //分钟
};

const start = () => {
  const newDate = new Date();
  const timeString = newDate.toLocaleTimeString().substring(0, 8);
  const dateString = newDate.toLocaleDateString();
  taskList.value[cur.value][5] = timeString;
  taskList.value[cur.value][8] = dateString;
  submit();
};

const end = () => {
  const newDate = new Date();
  const timeString = newDate.toLocaleTimeString().substring(0, 8);
  const startingTime = taskList.value[cur.value][5];
  const hour = getMin(startingTime, timeString);
  taskList.value[cur.value][6] = timeString;
  taskList.value[cur.value][7] = hour;
  no_time.value = false;
  submit();
};

const deleteWorks = async () => {
  try {
    await ElMessageBox.confirm('确定删除此记录？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    taskList.value.splice(cur.value, 1);
    submit();
    cur.value = -1;
  } catch {
    // 用户取消
  }
};

const cal_total_time = (tmpList: any) => {
  let tmp_time = 0;
  for (let i = 0; i < tmpList.length; i++) {
    tmp_time += parseFloat(tmpList[i][7] || 0);
  }
  tmp_time = tmp_time / 60;
  return tmp_time.toFixed(2);
};

const finish = async () => {
  const alertInfo = cur.value == -1 ? "确定批量归档这些记录？" : "确定归档此记录？";
  try {
    await ElMessageBox.confirm(alertInfo, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    let deletetemp: any[] = [];
    const remaintemp: any[] = [];
    if (cur.value == -1) {
      for (let i = 0; i < taskList.value.length; i++) {
        if (taskList.value[i][7] > 0) {
          deletetemp.push(taskList.value[i]);
        } else {
          remaintemp.push(taskList.value[i]);
        }
      }
      taskList.value = remaintemp;
    } else {
      deletetemp = taskList.value.splice(cur.value, 1);
    }
    let res = await finishTmAPI({ user_id: loginstate.id, finishitem: JSON.stringify(deletetemp) });
    const newArr = deletetemp.concat(finishList.value);
    finishList.value = newArr;
    searchList.value = newArr;
    total_time.value = cal_total_time(finishList.value);
    cur.value = -1;
    submit();
    ElMessage.success('归档成功');
  } catch {
    // 用户取消
  }
};

const highlight = (row: any) => {
  if (!row) {
    cur.value = -1;
    no_time.value = false;
    return;
  }
  const index = taskList.value.indexOf(row);
  if (index !== cur.value) {
    if (taskList.value[index][7] > 0) {
      no_time.value = false;
    } else {
      no_time.value = true;
    }
  }
  cur.value = index;
  fetch();
};

const Unhighlight = () => {
  cur.value = -1;
  no_time.value = false;
  fetch();
};

const highlight_archive = (row: any) => {
  if (!row) {
    cur_archive.value = -1;
    return;
  }
  const index = finishList.value.indexOf(row);
  cur_ID.value = finishList.value[index][0];
  cur_subject.value = finishList.value[index][1];
  cur_date.value = finishList.value[index][8];
  validTime_archive.value = 0;
  targetTime.value = finishList.value[index][2];
  targetTime.value = targetTime.value / 60;
  targetTime.value = Number(targetTime.value.toFixed(2));
  planTime.value = 0;
  spentTime.value = 0;
  cur_archive.value = index;

  for (let i = 0; i < finishList.value.length; i++) {
    if (
      finishList.value[i][0] === cur_ID.value &&
      finishList.value[i][1] === cur_subject.value
    ) {
      planTime.value += parseFloat(finishList.value[i][4] || 0);
      spentTime.value += finishList.value[i][7];
    }
    if (finishList.value[i][8] === cur_date.value) {
      validTime_archive.value += finishList.value[i][7];
    }
  }
  validTime_archive.value = validTime_archive.value / 60;
  validTime_archive.value = Number(validTime_archive.value.toFixed(2));
  planTime.value = planTime.value / 60;
  planTime.value = Number(planTime.value.toFixed(2));
  spentTime.value = spentTime.value / 60;
  spentTime.value = Number(spentTime.value.toFixed(2));
};

const Unhighlight_archive = () => {
  cur_archive.value = -1;
};

const fetch = async () => {
  let res = await fetchPrAPI({ user_id: loginstate.id });
  if (taskList.value.toString() !== res.toString()) {
    taskList.value = res;
  }
};

const submit = async () => {
  for (let i = 0; i < taskList.value.length; i++) {
    if (
      taskList.value[i][5]?.length === 8 &&
      taskList.value[i][6]?.length === 8
    ) {
      taskList.value[i][7] = getMin(
        taskList.value[i][5],
        taskList.value[i][6]
      );
    }
  }
  let res = await savePrAPI({ user_id: loginstate.id, taskinfo: JSON.stringify(taskList.value) });
};

const compare_data = (data: any, filter: any) => {
  let ind = true;
  if (filter[0].length > 0 && ind) {
    if (!data[0].includes(filter[0])) {
      ind = false;
    }
  }
  if (filter[1].length > 0 && ind) {
    if (!data[1].includes(filter[1])) {
      ind = false;
    }
  }
  if (filter[2].length > 0 && ind) {
    if (!data[8].includes(filter[2])) {
      ind = false;
    }
  }
  return ind;
};

const filterfn = () => {
  const temp = [];
  for (let i = 0; i < searchList.value.length; i++) {
    if (compare_data(searchList.value[i], searchItems.value)) {
      temp.push(searchList.value[i]);
    }
  }
  finishList.value = temp;
  total_time.value = cal_total_time(finishList.value);
};

const goToAgents = () => {
  router.push('/agents');
};

const goHome = () => {
  router.push('/');
};

const export_list = () => {
  const title = [
    "编号", "主题", "目标用时", "分拆事项", "计划用时",
    "开始时间", "结束时间", "实际用时", "日期",
  ];
  const str: string[] = [];
  str.push(title.join(",") + "\n");
  for (let i = 0; i < finishList.value.length; i++) {
    str.push(finishList.value[i].join(",") + "\n");
  }
  const blob = new Blob(["\uFEFF" + str.join("")], {
    type: "text/plain;charset=utf-8",
  });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "记录导出" + formattedDate + ".csv";
  downloadLink.click();
  ElMessage.success('导出成功');
};
</script>

<style scoped>
.manager-container {
  padding: 20px;
}

.main-card {
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.section {
  margin-top: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.valid-time {
  font-size: 14px;
  color: #909399;
}

.action-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.archive-detail {
  margin-top: 15px;
}

:deep(.task-row:hover) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  cursor: pointer;
}
</style>
