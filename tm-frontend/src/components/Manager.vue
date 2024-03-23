<template>
  <div>
    <div class="text-center">
      <h2 class="text-center">
        自塾时间管理
      </h2>
    </div>
    <div>
      <div style="margin-left: 20px; text-align: center">
        <div style="display: inline-block; margin: auto">
          <div>
            <button
              class="btn btn-primary spaced"
              @click="start"
              :disabled="cur == -1">
              开始
            </button>
            <button 
              class="btn btn-primary spaced" 
              @click="end" 
              :disabled="cur == -1">
              结束
            </button>
            <button 
              class="btn btn-primary spaced" 
              @click="addWorks">
              新增
            </button>
            <button
              class="btn btn-primary spaced"
              @click="deleteWorks"
              :disabled="cur == -1"
            >
              删除
            </button>

            <button
              class="btn btn-primary spaced"
              @click="finish"
              :disabled="validTime == 0 || no_time"
            >
              归档
            </button>
          </div>

          <table class="table-css">
            <thead>
              <tr @click="Unhighlight">
                <th class="row1">序号</th>
                <th class="row2">编号</th>
                <th class="row3">主题</th>
                <th class="row6">目标用时</th>
                <th class="row5">分拆事项</th>
                <th class="row6">计划用时</th>
                <th class="row6">开始时间</th>
                <th class="row6">结束时间</th>
                <th class="row6">实际用时</th>
                <th class="row6">日期</th>
              </tr>
            </thead>
            <tbody :key="key">
              <tr
                v-for="(item, index) in taskList"
                :key="index"
                @click="highlight(index)"
              >
                <td class="row1" :name="index">{{ index + 1 }}</td>
                <td class="row2">
                  <!-- <input class="editable" v-model="item[0]" @input="submit" /> -->
                  <el-autocomplete style="padding:0px;" v-model="item[0]" @input="submit" :fetch-suggestions="querySearch" class="editable"/>
                </td>
                <td class="row3">
                  <input class="editable" v-model="item[1]" @input="submit" />
                </td>
                <td class="row6">
                  <input
                    class="editable"
                    v-model="item[2]"
                    type="number"
                    step="0.01"
                    @input="submit"
                  />
                </td>
                <td class="row3">
                  <input class="editable" v-model="item[3]" @input="submit" />
                </td>
                <td class="row6">
                  <input
                    class="editable"
                    v-model="item[4]"
                    type="number"
                    step="0.01"
                    @input="submit"
                  />
                </td>
                <td class="row6">
                  <input class="editable" v-model="item[5]" @input="submit" />
                </td>
                <td class="row6">
                  <input class="editable" v-model="item[6]" @input="submit" />
                </td>
                <td class="row6">{{ item[7] }}</td>
                <td class="row2">
                  <input class="editable" v-model="item[8]" @input="submit" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="divfont">今天有效工作时间：{{ validTime }}小时。</div>
        </div>

        <hr />

        <div class="divfont" v-if="cur_archive != -1">
          {{cur_date}}有效工作时间：{{validTime_archive}}小时。
        </div>
        <div class="divfont" v-if="cur_archive != -1">
          {{cur_ID}}-{{cur_subject}}：目标用时{{targetTime}}小时，计划用时{{planTime
          || targetTime}}小时，实际用时{{spentTime}}小时。
        </div>
        <table class="table-css">
          <thead>
            <tr @click="Unhighlight_archive">
              <th class="row1">序号</th>
              <th class="row2">编号</th>
              <th class="row3">主题</th>
              <th class="row6">目标用时</th>
              <th class="row5">分拆事项</th>
              <th class="row6">计划用时</th>
              <th class="row6">开始时间</th>
              <th class="row6">结束时间</th>
              <th class="row6">实际用时</th>
              <th class="row6">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="row1"></th>
              <th class="row2">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchItems[0]"
                />
              </th>
              <th class="row3">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchItems[1]"
                />
              </th>
              <th class="row6"></th>
              <th class="row5"></th>
              <th class="row6"></th>
              <th class="row6"></th>
              <th class="row6"></th>
              <th class="row6"></th>
              <th class="row6">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchItems[2]"
                />
              </th>
            </tr>
            <tr
              v-for="(item, index) in finishList"
              :key="index"
              @click="highlight_archive(index)"
            >
              <!-- @ts-ignore -->
              <td class="row1">{{ index + 1 }}</td>
              <td class="row2" :id="'ID' + index">
                <span>{{ item[0] }}</span>
              </td>
              <td class="row3" :id="'subject' + index">
                <span>{{ item[1] }}</span>
              </td>
              <td class="row6">{{ item[2] }}</td>
              <td class="row3">{{ item[3] }}</td>
              <td class="row6">{{ item[4] }}</td>
              <td class="row6">{{ item[5] }}</td>
              <td class="row6">{{ item[6] }}</td>
              <td class="row6">{{ item[7] }}</td>
              <td class="row6" :id="'date' + index">{{ item[8] }}</td>
            </tr>
          </tbody>
        </table>
        <div class="divfont" v-if= "finishList.length > 0" >
          当前列表总实际时间：{{total_time}}小时。
        </div>
        <button
          v-if= "finishList.length > 0"
          class="btn btn-primary"
          @click="export_list"
        >
          导出
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useLoginStore } from "../store";
import { ref, reactive, onMounted, watchEffect } from "vue";
import {fetchDocketsAPI} from '../request/inno/api'
import {fetchTmAPI, fetchPrAPI, savePrAPI, finishTmAPI} from '../request/inno/api'
const loginstate = useLoginStore();
const tasks = JSON.parse(localStorage.getItem("zishu_active")) || [];
const finished = JSON.parse(localStorage.getItem("zishu_archive")) || [];
const now = new Date();

const year = ref(now.getFullYear());
const month = ref((now.getMonth() + 1).toString().padStart(2, "0"));
const day = ref(now.getDate().toString().padStart(2, "0"));

const formattedDate = `${year.value}-${month.value}-${day.value}`;

const taskList = ref(tasks)
const finishList = ref(finished)
const searchList = ref(finished)
const searchItems = ref(["", "", "", ""])
const cur = ref(-1)
const cur_archive = ref(-1)
const cur_ID = ref("")
const cur_subject = ref("")
const cur_date = ref("")
const validTime_archive = ref(0.0)
const spentTime = ref(0.0)
const planTime = ref(0.0)
const targetTime = ref(0)
const key = ref(0)
const skey = ref(0)
const no_time = ref(false)
const total_time = ref('')

const validTime = ref('')


interface IDockets{
  value:string
}
const dockets = reactive<IDockets[]>([])

const querySearch = (queryString: string, cb: any) => {
  const results:any = queryString?[]:dockets
  cb(results)
}


const getDockets = async () => {
  if (loginstate.logined = true) {
    let res = await fetchDocketsAPI({user_id:loginstate.id})
    dockets.push(...res)
    console.log(dockets)
  }
}

    watchEffect(() => {
      let sumTime = 0;
      for (let i = 0; i < taskList.value.length; i++) {
        if (taskList.value[i][7] > 0) {
          sumTime += taskList.value[i][7];
        }
      }
      validTime.value = sumTime.toFixed(2);
    });

    onMounted(() => {
      if (tasks && tasks.length > 0) {
        taskList.value = tasks;
      }

      if (finished && finished.length > 0) {
        finishList.value = finished;
        searchList.value = finished;
      }
      total_time.value = cal_total_time(finishList.value);
      submit();
      getDockets();
    });

    const addWorks = () => {
      if (cur.value > -1) {
        const curList = taskList.value[cur.value];
        const newList = [
          curList[0],
          curList[1],
          curList[2],
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        taskList.value.splice(cur.value + 1, 0, newList);
      } else if (cur_archive.value > -1) {
        const curList = finishList.value[cur_archive.value];
        const newList = [
          curList[0],
          curList[1],
          curList[2],
          "",
          "",
          "",
          "",
          "",
          "",
        ];
        taskList.value.push(newList);
      } else {
        taskList.value.push(["", "", "", "", "", "", "", "", ""]);
      }
      submit();
    };

    const getHour = (s1:any, s2:any) => {
      const reDate = /\d{4}-\d{1,2}-\d{1,2} /;
      s1 = new Date(
        (reDate.test(s1) ? s1 : "2018-1-1 " + s1).replace(/-/g, "/")
      );
      s2 = new Date(
        (reDate.test(s2) ? s2 : "2018-1-1 " + s2).replace(/-/g, "/")
      );
      const ms = s2.getTime() - s1.getTime();
      if (ms < 0) return 0;
      return Math.floor(ms / 10 / 60 / 60) / 100; //小时
    };

    const start = () => {
      const newDate = new Date();
      const timeString = newDate.toLocaleTimeString().substring(0, 8);
      console.log(timeString);
      const dateString = newDate.toLocaleDateString();
      console.log(dateString);

      taskList.value[cur.value][5] = timeString;
      taskList.value[cur.value][8] = dateString;
      key.value += 1;
      submit();
    };

    const end = () => {
      const newDate = new Date();
      const timeString = newDate.toLocaleTimeString().substring(0, 8);
      taskList.value[cur.value][6] = timeString;
      const startingTime = taskList.value[cur.value][5];
      console.log(startingTime);
      console.log(timeString);
      const hour = getHour(startingTime, timeString);
      console.log(hour);
      taskList.value[cur.value][7] = hour;
      no_time.value = false;
      key.value += 1;
      submit();
    };

    const deleteWorks = () => {
      if (confirm("确定删除此记录？")) {
        taskList.value.splice(cur.value, 1);
        submit();
        Unhighlight();
        key.value += 1;
      }
    };

    const cal_total_time = (tmpList:any) => {
      let tmp_time = ref(0.0);
      let rtn_time = ref('')
      for (let i = 0; i < tmpList.length; i++) {
        tmp_time.value += parseFloat(tmpList[i][7] || 0);
      }
      rtn_time.value = tmp_time.value.toFixed(2);
      return rtn_time.value;
    };

    const finish = async () => {
      let alertInfo;
      if (cur.value == -1) {
        alertInfo = "确定批量归档这些记录？";
      } else {
        alertInfo = "确定归档此记录？";
      }
      if (confirm(alertInfo)) {
        let deletetemp = [];
        const remaintemp = [];
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
        let res = await finishTmAPI({user_id:loginstate.id, finishitem:JSON.stringify(deletetemp)})
        console.log(res)
        const newArr = deletetemp.concat(finishList.value);
        finishList.value = newArr;
        searchList.value = newArr;
        total_time.value = cal_total_time(finishList.value);
        localStorage.setItem(
          "zishu_archive",
          JSON.stringify(finishList.value)
        );
        cur.value = -1;
        submit();
      }
    };

    const highlight = (ind:number) => {
      const cur_row = document.getElementsByName(ind.toString())[0];
      if (ind !== cur.value) {
        if (cur.value !== -1) {
          const old_row = document.getElementsByName(
            cur.value.toString()
          )[0];
          old_row.style.backgroundColor = "";
        }
        cur.value = ind;
        if (taskList.value[ind][7] > 0) {
          no_time.value = false;
        } else {
          no_time.value = true;
        }
      }
      cur_row.style.backgroundColor = "#a0f";

      skey.value += 1;
    };

    const Unhighlight = () => {
      if (cur.value !== -1) {
        const old_row = document.getElementsByName(
          cur.value.toString()
        )[0];
        old_row.style.backgroundColor = "";
        cur.value = -1;
        no_time.value = false;
      }
    };

    const highlight_archive = (ind:number) => {
      cur_ID.value = finishList.value[ind][0];
      cur_subject.value = finishList.value[ind][1];
      cur_date.value = finishList.value[ind][8];
      validTime_archive.value = 0;
      targetTime.value = finishList.value[ind][2];
      planTime.value = 0;
      spentTime.value = 0;
      if (ind !== cur_archive.value) {
        cur_archive.value = ind;
      }

      for (let i = 0; i < finishList.value.length; i++) {
        const cur_row_ID = document.getElementById("ID" + i);
        const cur_row_subject = document.getElementById("subject" + i);
        const cur_row_date = document.getElementById("date" + i);
        cur_row_ID.style.backgroundColor = "";
        cur_row_subject.style.backgroundColor = "";
        cur_row_date.style.backgroundColor = "";
        if (
          finishList.value[i][0] === cur_ID.value &&
          finishList.value[i][1] === cur_subject.value
        ) {
          cur_row_ID.style.backgroundColor = "#a9f";
          cur_row_subject.style.backgroundColor = "#a9f";
          planTime.value += parseFloat(
            finishList.value[i][4] || 0
          );
          spentTime.value += finishList.value[i][7];
        }
        if (finishList.value[i][8] === cur_date.value) {
          cur_row_date.style.backgroundColor = "#d7f";
          validTime_archive.value += finishList.value[i][7];
        }
      }
      validTime_archive.value = Number(validTime_archive.value.toFixed(2));
      planTime.value = Number(planTime.value.toFixed(2));
      spentTime.value = Number(spentTime.value.toFixed(2));
    };

    const Unhighlight_archive = () => {
      for (let i = 0; i < finishList.value.length; i++) {
        const cur_row_ID = document.getElementById("ID" + i);
        const cur_row_subject = document.getElementById("subject" + i);
        const cur_row_date = document.getElementById("date" + i);
        cur_row_ID.style.backgroundColor = "";
        cur_row_subject.style.backgroundColor = "";
        cur_row_date.style.backgroundColor = "";
      }
      cur_archive.value = -1;
    };

    const submit = async () => {
      for (let i = 0; i < taskList.value.length; i++) {
        if (
          taskList.value[i][5].length === 8 &&
          taskList.value[i][6].length === 8
        ) {
          taskList.value[i][7] = getHour(
            taskList.value[i][5],
            taskList.value[i][6]
          );
        }
      }
      localStorage.setItem(
        "zishu_active",
        JSON.stringify(taskList.value)
      );
      let res = await savePrAPI({user_id:loginstate.id, taskinfo:JSON.stringify(taskList.value)})
      console.log(res)
    };

    const compare_data = (data, filter) => {
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

    const export_list = () => {
      const title = [
        "编号",
        "主题",
        "目标用时",
        "分拆事项",
        "计划用时",
        "开始时间",
        "结束时间",
        "实际用时",
        "日期",
      ];
      const str = [];
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
    };

</script>

<style scoped>
img[src=""],
img:not([src]) {
  opacity: 0;
}
.table-css {
  margin-top: 10px;
  vertical-align: middle;
  text-align: center;
  font-size: 18px;
}
table th {
  border: 1px solid black;
}

table td {
  border: 1px solid black;
}
.row1 {
  width: 4%;
}
.row2 {
  width: 6%;
}
.row3 {
  width: 10%;
}
.row4 {
  width: 10%;
}
.row5 {
  width: 10%;
}
.row6 {
  width: 5%;
}

.kaoyou {
  text-align: right;
}
.kaozuo {
  text-align: left;
}
.editable {
  border-width: 0;
  width: 100%;
  height: 100%;
  font-size: 1em;
}
.opbtn {
  border-width: 0;
  height: 100%;
  font-size: 1em;
}
.readonly {
  width: 100%;
  font-size: 1em;
  vertical-align: middle;
}

.divfont { 
  font-size: 18px;
}

.spaced {
  margin:0 5px;
}

</style> 