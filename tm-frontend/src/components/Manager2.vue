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
              class="btn btn-primary"
              @click="start"
              :disabled="cur == -1"
            >
              开始
            </button>
            <button class="btn btn-primary" @click="end" :disabled="cur == -1">
              结束
            </button>
            <button class="btn btn-primary" @click="addwords">新增</button>
            <button
              class="btn btn-primary"
              @click="deletewords"
              :disabled="cur == -1"
            >
              删除
            </button>

            <button
              class="btn btn-primary"
              @click="finish"
              :disabled="validtime == 0 || no_time"
            >
              归档
            </button>
          </div>

          <table class="table-css">
            <thead>
              <tr @click="quliang">
                <th class="lie1">序号</th>
                <th class="lie2">编号</th>
                <th class="lie3">主题</th>
                <th class="lie6">目标用时</th>
                <th class="lie5">分拆事项</th>
                <th class="lie6">计划用时</th>
                <th class="lie6">开始时间</th>
                <th class="lie6">结束时间</th>
                <th class="lie6">实际用时</th>
                <th class="lie6">日期</th>
              </tr>
            </thead>
            <tbody :key="key">
              <tr
                v-for="(item, index) in tasklist"
                :key="index"
                @click="gaoliang(index)"
              >
                <td class="lie1" :name="index">{{ index + 1 }}</td>
                <td class="lie2">
                  <input class="editable" v-model="item[0]" @input="tijiao" />
                </td>
                <td class="lie3">
                  <input class="editable" v-model="item[1]" @input="tijiao" />
                </td>
                <td class="lie6">
                  <input
                    class="editable"
                    v-model="item[2]"
                    type="number"
                    step="0.01"
                    @input="tijiao"
                  />
                </td>
                <td class="lie3">
                  <input class="editable" v-model="item[3]" @input="tijiao" />
                </td>
                <td class="lie6">
                  <input
                    class="editable"
                    v-model="item[4]"
                    type="number"
                    step="0.01"
                    @input="tijiao"
                  />
                </td>
                <td class="lie6">
                  <input class="editable" v-model="item[5]" @input="tijiao" />
                </td>
                <td class="lie6">
                  <input class="editable" v-model="item[6]" @input="tijiao" />
                </td>
                <td class="lie6">{{ item[7] }}</td>
                <td class="lie2">
                  <input class="editable" v-model="item[8]" @input="tijiao" />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="divfont">今天有效工作时间：{{ validtime }}小时。</div>
        </div>

        <hr />

        <div class="divfont" v-if="cur_archive != -1">
          {{cur_riqi}}有效工作时间：{{validtime_archive}}小时。
        </div>
        <div class="divfont" v-if="cur_archive != -1">
          {{cur_anhao}}-{{cur_zhuti}}：目标用时{{tongchou}}小时，计划用时{{yi_peishi
          || tongchou}}小时，实际用时{{yi_yongshi}}小时。
        </div>
        <table class="table-css">
          <thead>
            <tr @click="quliang_archive">
              <th class="lie1">序号</th>
              <th class="lie2">编号</th>
              <th class="lie3">主题</th>
              <th class="lie6">目标用时</th>
              <th class="lie5">分拆事项</th>
              <th class="lie6">计划用时</th>
              <th class="lie6">开始时间</th>
              <th class="lie6">结束时间</th>
              <th class="lie6">实际用时</th>
              <th class="lie6">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="lie1"></th>
              <th class="lie2">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchitems[0]"
                />
              </th>
              <th class="lie3">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchitems[1]"
                />
              </th>
              <th class="lie6"></th>
              <th class="lie5"></th>
              <th class="lie6"></th>
              <th class="lie6"></th>
              <th class="lie6"></th>
              <th class="lie6"></th>
              <th class="lie6">
                <input
                  class="editable"
                  placeholder="筛选"
                  @input="filterfn"
                  v-model="searchitems[2]"
                />
              </th>
            </tr>
            <tr
              v-for="(item, index) in finishlist"
              :key="index"
              @click="gaoliang_archive(index)"
            >
              <!-- @ts-ignore -->
              <td class="lie1">{{ index + 1 }}</td>
              <td class="lie2" :id="'anhao' + index">
                <span>{{ item[0] }}</span>
              </td>
              <td class="lie3" :id="'zhuti' + index">
                <span>{{ item[1] }}</span>
              </td>
              <td class="lie6">{{ item[2] }}</td>
              <td class="lie3">{{ item[3] }}</td>
              <td class="lie6">{{ item[4] }}</td>
              <td class="lie6">{{ item[5] }}</td>
              <td class="lie6">{{ item[6] }}</td>
              <td class="lie6">{{ item[7] }}</td>
              <td class="lie6" :id="'riqi' + index">{{ item[8] }}</td>
            </tr>
          </tbody>
        </table>
        <div class="divfont" v-if="finishlist.length > 0">
          当前列表总实际时间：{{total_time}}小时。
        </div>
        <button
          v-if="finishlist.length > 0"
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
      tasklist: ref(tasks),
      finishlist: ref(finishs),
      searchlist: ref(finishs),
      searchitems: ref(["", "", "", ""]),
      cur: ref(-1),
      cur_archive: ref(-1),
      cur_anhao: ref(""),
      cur_zhuti: ref(""),
      cur_riqi: ref(""),
      validtime_archive: ref(0),
      yi_yongshi: ref(0),
      yi_peishi: ref(0),
      tongchou: ref(0),
      key: ref(0),
      skey: ref(0),
      no_time: ref(false),
      total_time: ref(0),
    };

    const validtime = ref(0);

    watchEffect(() => {
      let sumTime = 0;
      for (let i = 0; i < state.tasklist.value.length; i++) {
        if (state.tasklist.value[i][7] > 0) {
          sumTime += state.tasklist.value[i][7];
        }
      }
      validtime.value = sumTime.toFixed(2);
    });

    onMounted(() => {
      if (tasks && tasks.length > 0) {
        state.tasklist.value = tasks;
      }

      if (finishs && finishs.length > 0) {
        state.finishlist.value = finishs;
        state.searchlist.value = finishs;
      }
      state.total_time.value = cal_total_time(state.finishlist.value);
      tijiao();
    });

    const addwords = () => {
      if (state.cur.value > -1) {
        const curList = state.tasklist.value[state.cur.value];
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
        state.tasklist.value.splice(state.cur.value + 1, 0, newList);
      } else if (state.cur_archive.value > -1) {
        const curList = state.finishlist.value[state.cur_archive.value];
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
        state.tasklist.value.push(newList);
      } else {
        state.tasklist.value.push(["", "", "", "", "", "", "", "", ""]);
      }
      tijiao();
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

    const start = () => {
      const newDate = new Date();
      const timestring = newDate.toLocaleTimeString().substring(0, 8);
      console.log(timestring);
      const datestring = newDate.toLocaleDateString();
      console.log(datestring);

      state.tasklist.value[state.cur.value][5] = timestring;
      state.tasklist.value[state.cur.value][8] = datestring;
      state.key.value += 1;
      tijiao();
    };

    const end = () => {
      const newDate = new Date();
      const timestring = newDate.toLocaleTimeString().substring(0, 8);
      state.tasklist.value[state.cur.value][6] = timestring;
      const starttime = state.tasklist.value[state.cur.value][5];
      console.log(starttime);
      console.log(timestring);
      const hour = getHour(starttime, timestring);
      console.log(hour);
      state.tasklist.value[state.cur.value][7] = hour;
      state.no_time.value = false;
      state.key.value += 1;
      tijiao();
    };

    const deletewords = () => {
      if (confirm("确定删除此记录？")) {
        const deletetemp = state.tasklist.value.splice(state.cur.value, 1);
        tijiao();
        quliang();
        state.key.value += 1;
      }
    };

    const cal_total_time = (tmplist) => {
      let tmp_time = ref(0.0);
      for (let i = 0; i < tmplist.length; i++) {
        tmp_time.value += parseFloat(tmplist[i][7] || 0);
      }
      tmp_time.value = tmp_time.value.toFixed(2);
      return tmp_time;
    };

    const finish = () => {
      let alertinfo;
      if (state.cur.value == -1) {
        alertinfo = "确定批量归档这些记录？";
      } else {
        alertinfo = "确定归档此记录？";
      }
      if (confirm(alertinfo)) {
        let deletetemp = [];
        const remaintemp = [];
        if (state.cur.value == -1) {
          for (let i = 0; i < state.tasklist.value.length; i++) {
            if (state.tasklist.value[i][7] > 0) {
              deletetemp.push(state.tasklist.value[i]);
            } else {
              remaintemp.push(state.tasklist.value[i]);
            }
          }
          state.tasklist.value = remaintemp;
        } else {
          deletetemp = state.tasklist.value.splice(state.cur.value, 1);
        }

        const newArr = deletetemp.concat(state.finishlist.value);
        state.finishlist.value = newArr;
        state.searchlist.value = newArr;
        state.total_time.value = cal_total_time(state.finishlist.value);
        localStorage.setItem(
          "zishu_archive",
          JSON.stringify(state.finishlist.value)
        );
        state.cur.value = -1;
        tijiao();
      }
    };

    const gaoliang = (ind) => {
      const cur_row = document.getElementsByName(ind.toString())[0];
      if (ind !== state.cur.value) {
        if (state.cur.value !== -1) {
          const old_row = document.getElementsByName(
            state.cur.value.toString()
          )[0];
          old_row.style.backgroundColor = "";
        }
        state.cur.value = ind;
        if (state.tasklist.value[ind][7] > 0) {
          state.no_time.value = false;
        } else {
          state.no_time.value = true;
        }
      }
      cur_row.style.backgroundColor = "#a0f";

      state.skey.value += 1;
    };

    const quliang = () => {
      if (state.cur.value !== -1) {
        const old_row = document.getElementsByName(
          state.cur.value.toString()
        )[0];
        old_row.style.backgroundColor = "";
        state.cur.value = -1;
        state.no_time.value = false;
      }
    };

    const gaoliang_archive = (ind) => {
      state.cur_anhao.value = state.finishlist.value[ind][0];
      state.cur_zhuti.value = state.finishlist.value[ind][1];
      state.cur_riqi.value = state.finishlist.value[ind][8];
      state.validtime_archive.value = 0;
      state.tongchou.value = state.finishlist.value[ind][2];
      state.yi_peishi.value = 0;
      state.yi_yongshi.value = 0;
      if (ind !== state.cur_archive.value) {
        state.cur_archive.value = ind;
      }

      for (let i = 0; i < state.finishlist.value.length; i++) {
        const cur_row_anhao = document.getElementById("anhao" + i);
        const cur_row_zhuti = document.getElementById("zhuti" + i);
        const cur_row_riqi = document.getElementById("riqi" + i);
        cur_row_anhao.style.backgroundColor = "";
        cur_row_zhuti.style.backgroundColor = "";
        cur_row_riqi.style.backgroundColor = "";
        if (
          state.finishlist.value[i][0] === state.cur_anhao.value &&
          state.finishlist.value[i][1] === state.cur_zhuti.value
        ) {
          cur_row_anhao.style.backgroundColor = "#a9f";
          cur_row_zhuti.style.backgroundColor = "#a9f";
          state.yi_peishi.value += parseFloat(
            state.finishlist.value[i][4] || 0
          );
          state.yi_yongshi.value += state.finishlist.value[i][7];
        }
        if (state.finishlist.value[i][8] === state.cur_riqi.value) {
          cur_row_riqi.style.backgroundColor = "#d7f";
          state.validtime_archive.value += state.finishlist.value[i][7];
        }
      }
      state.validtime_archive.value = state.validtime_archive.value.toFixed(2);
      state.yi_peishi.value = state.yi_peishi.value.toFixed(2);
      state.yi_yongshi.value = state.yi_yongshi.value.toFixed(2);
    };

    const quliang_archive = () => {
      for (let i = 0; i < state.finishlist.value.length; i++) {
        const cur_row_anhao = document.getElementById("anhao" + i);
        const cur_row_zhuti = document.getElementById("zhuti" + i);
        const cur_row_riqi = document.getElementById("riqi" + i);
        cur_row_anhao.style.backgroundColor = "";
        cur_row_zhuti.style.backgroundColor = "";
        cur_row_riqi.style.backgroundColor = "";
      }
      state.cur_archive.value = -1;
    };

    const tijiao = () => {
      for (let i = 0; i < state.tasklist.value.length; i++) {
        if (
          state.tasklist.value[i][5].length === 8 &&
          state.tasklist.value[i][6].length === 8
        ) {
          state.tasklist.value[i][7] = getHour(
            state.tasklist.value[i][5],
            state.tasklist.value[i][6]
          );
        }
      }
      localStorage.setItem(
        "zishu_active",
        JSON.stringify(state.tasklist.value)
      );
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
      for (let i = 0; i < state.searchlist.value.length; i++) {
        if (compare_data(state.searchlist.value[i], state.searchitems.value)) {
          temp.push(state.searchlist.value[i]);
        }
      }
      state.finishlist.value = temp;
      state.total_time.value = cal_total_time(state.finishlist.value);
    };

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
      for (let i = 0; i < state.finishlist.value.length; i++) {
        str.push(state.finishlist.value[i].join(",") + "\n");
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
      validtime,
      start,
      end,
      addwords,
      deletewords,
      finish,
      gaoliang,
      quliang,
      gaoliang_archive,
      quliang_archive,
      tijiao,
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
  font-size: 18px;
}
table th {
  border: 1px solid black;
}

table td {
  border: 1px solid black;
}
.lie1 {
  width: 4%;
}
.lie2 {
  width: 6%;
}
.lie3 {
  width: 10%;
}
.lie4 {
  width: 10%;
}
.lie5 {
  width: 10%;
}
.lie6 {
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

</style> 