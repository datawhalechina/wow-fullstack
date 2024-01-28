<template>
  <div id="app">
    <div class="text-center">
      <!-- title -->
      <h2 class="text-center">
        自塾时间管理
      </h2>
    </div>
    <div id="app">
      <div style="margin-left: 20px; text-align: center">
        <div style="display: inline-block; margin: auto">
          <!-- button -->
          <div>
            <button
              class="btn btn-primary"
              @click="timingStart"
              :disabled="cur == -1"
            >
              开始
            </button>
            <button 
              class="btn btn-primary" 
              @click="timingEnd" 
              :disabled="cur == -1"
            >
              结束
            </button>
            <button 
              class="btn btn-primary" 
              @click="addWorks"
            >
              新增
            </button>
            <button
              class="btn btn-primary"
              @click="deleteWorks"
              :disabled="cur == -1"
            >
              删除
            </button>
            <button
              class="btn btn-primary"
              @click="finish"
              :disabled="validTime == 0 || endSign"
            >
              归档
            </button>
          </div>
          
          <!-- work timing table -->
          <table class="table-css">
            <thead>
              <tr @click="diminish">
                <th class="column1">序号</th>
                <th class="column2">编号</th>
                <th class="column3">主题</th>
                <th class="column6">目标用时</th>
                <th class="column5">分拆事项</th>
                <th class="column6">计划用时</th>
                <th class="column6">开始时间</th>
                <th class="column6">结束时间</th>
                <th class="column6">实际用时</th>
                <th class="column6">日期</th>
              </tr>
            </thead>
            <tbody :key="key">
              <tr
                v-for="(item, index) in taskList"
                :key="index"
                @click="highlight(index)"
              >
                <td class="column1" :name="index">{{ index + 1 }}</td>
                <td class="column2">
                  <input class="editable" v-model="item[0]" @input="submit" />
                </td>
                <td class="column3">
                  <input class="editable" v-model="item[1]" @input="submit" />
                </td>
                <td class="column6">
                  <input
                    class="editable"
                    v-model="item[2]"
                    type="number"
                    step="0.01"
                    @input="submit"
                  />
                </td>
                <td class="column3">
                  <input class="editable" v-model="item[3]" @input="submit" />
                </td>
                <td class="column6">
                  <input
                    class="editable"
                    v-model="item[4]"
                    type="number"
                    step="0.01"
                    @input="submit"
                  />
                </td>
                <td class="column6">
                  <input class="editable" v-model="item[5]" @input="submit" />
                </td>
                <td class="column6">
                  <input class="editable" v-model="item[6]" @input="submit" />
                </td>
                <td class="column6">{{ item[7] }}</td>
                <td class="column2">
                  <input class="editable" v-model="item[8]" @input="submit" />
                </td>
              </tr>
            </tbody>
          </table>
          <div>今天有效工作时间：{{ validTime }}小时。</div>
        </div>
      
        <hr />
        <!-- sumup of time -->
        <div v-if="cur_archive != -1">
          {{cur_date}}有效工作时间：{{validtime_archive}}小时。
        </div>
        <div v-if="cur_archive != -1">
          {{cur_Id}}-{{cur_subject}}：目标用时{{targetTime}}小时，计划用时{{planTime
          || targetTime}}小时，实际用时{{actualTime}}小时。
        </div>
        <!-- statistic of work time -->
        <table class="table-css">
          <thead>
            <tr @click="diminish_archive">
              <th class="column1">序号</th>
              <th class="column2">编号</th>
              <th class="column3">主题</th>
              <th class="column6">目标用时</th>
              <th class="column5">分拆事项</th>
              <th class="column6">计划用时</th>
              <th class="column6">开始时间</th>
              <th class="column6">结束时间</th>
              <th class="column6">实际用时</th>
              <th class="column6">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="column1"></th>
              <th class="column2">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchItems[0]"
                />
              </th>
              <th class="column3">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchItems[1]"
                />
              </th>
              <th class="column6"></th>
              <th class="column5"></th>
              <th class="column6"></th>
              <th class="column6"></th>
              <th class="column6"></th>
              <th class="column6"></th>
              <th class="column6">
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
              @click="highlightArchive(index)"
            >
              <!-- @ts-ignore -->
              <td class="column1">{{ index + 1 }}</td>
              <td class="column2" :id="'Id' + index">
                <span>{{ item[0] }}</span>
              </td>
              <td class="column3" :id="'subject' + index">
                <span>{{ item[1] }}</span>
              </td>
              <td class="column6">{{ item[2] }}</td>
              <td class="column3">{{ item[3] }}</td>
              <td class="column6">{{ item[4] }}</td>
              <td class="column6">{{ item[5] }}</td>
              <td class="column6">{{ item[6] }}</td>
              <td class="column6">{{ item[7] }}</td>
              <td class="column6" :id="'date' + index">{{ item[8] }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="finishList.length > 0">
          当前列表总实际时间：{{totalTime}}小时。
        </div>
        <button
          v-if="finishList.length > 0"
          class="btn btn-primary"
          @click="export_list"
        >
          导出
        </button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
// @ts-nocheck
import { ref, onMounted, watchEffect, defineComponent } from "vue";

export default defineComponent({
  setup() {
    const tasks = JSON.parse(localStorage.getItem("zishu_active")) || [];
    const finishs = JSON.parse(localStorage.getItem("zishu_archive")) || [];
    const now = new Date();
    const year = ref(now.getFullYear());
    const month = ref((now.getMonth() + 1).toString().padStart(2, "0"));
    const day = ref(now.getDate().toString().padStart(2, "0"));

    const formattedDate = `${year.value}-${month.value}-${day.value}`;

    const state = {
      taskList: ref(tasks),               // table1 当前任务列表
      finishList: ref(finishs),           // table1 完成的任务
      searchList: ref(finishs),           // table2 归档的的任务列表，可搜索
      searchItems: ref(["", "", "", ""]), // table2 搜索对象
      cur: ref(-1),                       // table1 当前所在行
      cur_archive: ref(-1),               // table2 当前所在行
      cur_Id: ref(""),                 // table2 编号
      cur_subject: ref(""),                 // table2 当前任务主题
      cur_date: ref(""),                  // table2 当前任务日期
      validtime_archive: ref(0),          // table2 归档的有效时间
      actualTime: ref(0),                 // table2 实际用时
      planTime: ref(0),                  // table2 计划用时
      targetTime: ref(0),                   // table2 目标用时
      key: ref(0),                        //
      skey: ref(0),                       // 
      endSign: ref(false),                // table1 是否结束的标志
      totalTime: ref(0),                 // 当前列表总实际时间
    };  

    const validTime = ref(0);             // 有效工作时间

    watchEffect(() => {
      let sumTime = 0;
      for (let i = 0; i < state.taskList.value.length; i++) {
        if (state.taskList.value[i][7] > 0) {
          sumTime += state.taskList.value[i][7];
        }
      }
      validTime.value = sumTime.toFixed(2);
    });

    onMounted(() => {
      if (tasks && tasks.length > 0) {
        state.taskList.value = tasks;
      }

      if (finishs && finishs.length > 0) {
        state.finishList.value = finishs;
        state.searchList.value = finishs;
      }
      state.totalTime.value = cal_totalTime(state.finishList.value);
      submit();
    });

    // 新增一个当前任务
    const addWorks = () => {
      if (state.cur.value > -1) {
        const curList = state.taskList.value[state.cur.value];
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
        state.taskList.value.splice(state.cur.value + 1, 0, newList);
      } else if (state.cur_archive.value > -1) {
        const curList = state.finishList.value[state.cur_archive.value];
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
        state.taskList.value.push(newList);
      } else {
        state.taskList.value.push(["", "", "", "", "", "", "", "", ""]);
      }
      submit();
    };

    const getHour = (s1, s2) => {
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

    const timingStart = () => {
      const newDate = new Date();
      const timeString = newDate.toLocaleTimeString().substring(0, 8);
      console.log(timeString);
      const datestring = newDate.toLocaleDateString();
      console.log(datestring);

      state.taskList.value[state.cur.value][5] = timeString;
      state.taskList.value[state.cur.value][8] = datestring;
      state.key.value += 1;
      submit();
    };

    const timingEnd = () => {
      const newDate = new Date();
      const timeString = newDate.toLocaleTimeString().substring(0, 8);
      state.taskList.value[state.cur.value][6] = timeString;
      const startTime = state.taskList.value[state.cur.value][5];
      console.log(startTime);
      console.log(timeString);
      const hour = getHour(startTime, timeString);
      console.log(hour);
      state.taskList.value[state.cur.value][7] = hour;
      state.endSign.value = false;
      state.key.value += 1;
      submit();
    };

    // 删除工作
    const deleteWorks = () => {
      if (confirm("确定删除此记录？")) {
        const deleteTemp = state.taskList.value.splice(state.cur.value, 1);
        submit();
        diminish();
        state.key.value += 1;
      }
    };

    // 计算总用时
    const cal_totalTime = (tmpList) => {
      let tmp_time = ref(0.0);
      for (let i = 0; i < tmpList.length; i++) {
        tmp_time.value += parseFloat(tmpList[i][7] || 0);
      }
      tmp_time.value = tmp_time.value.toFixed(2);
      return tmp_time;
    };

    // 完成
    const finish = () => {
      let alertInfo;
      if (state.cur.value == -1) {
        alertInfo = "确定批量归档这些记录？";
      } else {
        alertInfo = "确定归档此记录？";
      }
      if (confirm(alertInfo)) {
        let deleteTemp = [];
        const remainTemp = [];
        if (state.cur.value == -1) {
          for (let i = 0; i < state.taskList.value.length; i++) {
            if (state.taskList.value[i][7] > 0) {
              deleteTemp.push(state.taskList.value[i]);
            } else {
              remainTemp.push(state.taskList.value[i]);
            }
          }
          state.taskList.value = remainTemp;
        } else {
          deleteTemp = state.taskList.value.splice(state.cur.value, 1);
        }

        const newArr = deleteTemp.concat(state.finishList.value);
        state.finishList.value = newArr;
        state.searchList.value = newArr;
        state.totalTime.value = cal_totalTime(state.finishList.value);
        localStorage.setItem(
          "zishu_archive",
          JSON.stringify(state.finishList.value)
        );
        state.cur.value = -1;
        submit();
      }
    };

    // 高亮
    const highlight = (ind) => {
      const cur_row = document.getElementsByName(ind.toString())[0];
      if (ind !== state.cur.value) {
        if (state.cur.value !== -1) {
          const old_row = document.getElementsByName(
            state.cur.value.toString()
          )[0];
          old_row.style.backgroundColor = "";
        }
        state.cur.value = ind;
        if (state.taskList.value[ind][7] > 0) {
          state.endSign.value = false;
        } else {
          state.endSign.value = true;
        }
      }
      cur_row.style.backgroundColor = "#a0f";

      state.skey.value += 1;
    };

    // 
    const diminish = () => {
      if (state.cur.value !== -1) {
        const old_row = document.getElementsByName(
          state.cur.value.toString()
        )[0];
        old_row.style.backgroundColor = "";
        state.cur.value = -1;
        state.endSign.value = false;
      }
    };

    // 高亮table2
    const highlightArchive = (ind) => {
      state.cur_Id.value = state.finishList.value[ind][0];
      state.cur_subject.value = state.finishList.value[ind][1];
      state.cur_date.value = state.finishList.value[ind][8];
      state.validtime_archive.value = 0;
      state.targetTime.value = state.finishList.value[ind][2];
      state.planTime.value = 0;
      state.actualTime.value = 0;
      if (ind !== state.cur_archive.value) {
        state.cur_archive.value = ind;
      }

      for (let i = 0; i < state.finishList.value.length; i++) {
        const cur_row_Id = document.getElementById("Id" + i);
        const cur_row_subject = document.getElementById("subject" + i);
        const cur_row_date = document.getElementById("date" + i);
        cur_row_Id.style.backgroundColor = "";
        cur_row_subject.style.backgroundColor = "";
        cur_row_date.style.backgroundColor = "";
        if (
          state.finishList.value[i][0] === state.cur_Id.value &&
          state.finishList.value[i][1] === state.cur_subject.value
        ) {
          cur_row_Id.style.backgroundColor = "#a9f";
          cur_row_subject.style.backgroundColor = "#a9f";
          state.planTime.value += parseFloat(
            state.finishList.value[i][4] || 0
          );
          state.actualTime.value += state.finishList.value[i][7];
        }
        if (state.finishList.value[i][8] === state.cur_date.value) {
          cur_row_date.style.backgroundColor = "#d7f";
          state.validtime_archive.value += state.finishList.value[i][7];
        }
      }
      state.validtime_archive.value = state.validtime_archive.value.toFixed(2);
      state.planTime.value = state.planTime.value.toFixed(2);
      state.actualTime.value = state.actualTime.value.toFixed(2);
    };

    const diminish_archive = () => {
      for (let i = 0; i < state.finishList.value.length; i++) {
        const cur_row_Id = document.getElementById("Id" + i);
        const cur_row_subject = document.getElementById("subject" + i);
        const cur_row_date = document.getElementById("date" + i);
        cur_row_Id.style.backgroundColor = "";
        cur_row_subject.style.backgroundColor = "";
        cur_row_date.style.backgroundColor = "";
      }
      state.cur_archive.value = -1;
    };

    const submit = () => {
      for (let i = 0; i < state.taskList.value.length; i++) {
        if (
          state.taskList.value[i][5].length === 8 &&
          state.taskList.value[i][6].length === 8
        ) {
          state.taskList.value[i][7] = getHour(
            state.taskList.value[i][5],
            state.taskList.value[i][6]
          );
        }
      }
      localStorage.setItem(
        "zishu_active",
        JSON.stringify(state.taskList.value)
      );
    };

    // 数据搜索
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

    // 
    const filterfn = () => {
      const temp = [];
      for (let i = 0; i < state.searchList.value.length; i++) {
        if (compare_data(state.searchList.value[i], state.searchItems.value)) {
          temp.push(state.searchList.value[i]);
        }
      }
      state.finishList.value = temp;
      state.totalTime.value = cal_totalTime(state.finishList.value);
    };

    // 导出excel
    const export_list = () => {
      const title = [
        "编号",
        "主题",
        "统筹配时",
        "分拆事项",
        "分拆配时",
        "开始时间",
        "结束时间",
        "实际用时",
        "日期",
      ];
      const str = [];
      str.push(title.join(",") + "\n");
      for (let i = 0; i < state.finishList.value.length; i++) {
        str.push(state.finishList.value[i].join(",") + "\n");
      }
      const blob = new Blob(["\uFEFF" + str.join("")], {
        type: "text/plain;charset=utf-8",
      });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "记录导出" + formattedDate + ".csv";
      downloadLink.click();
    };

    return {
      ...state,
      validTime,
      timingStart,
      timingEnd,
      addWorks,
      deleteWorks,
      finish,
      highlight,
      diminish,
      highlightArchive,
      diminish_archive,
      submit,
      compare_data,
      filterfn,
      export_list,
    };
  },
});
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
}
table th {
  border: 1px solid black;
}

table td {
  border: 1px solid black;
}
.column1 {
  width: 4%;
}
.column2 {
  width: 6%;
}
.column3 {
  width: 10%;
}
.column4 {
  width: 10%;
}
.column5 {
  width: 10%;
}
.column6 {
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

</style> 