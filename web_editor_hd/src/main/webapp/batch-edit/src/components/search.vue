<template>
  <div class="search">
    <el-select
      v-model="value"
      placeholder="请选择"
      filterable
      :filter-method="dataFilter"
      @change="changeTask"
      no-data-text="无任务"
      no-match-text="无匹配任务"
    >
      <el-option
        v-for="item in searchTasks"
        v-show="renderShow(item)"
        :key="renderValue(item)"
        :label="renderLabel(item)"
        :value="renderValue(item)"
        :title="renderLabel(item)"
      >
        <span v-html="renderLabel(item)"></span>
        <span
          class=""
          :style="
            'float: right; color: ' +
            item.fcolor +
            ';background-color:' +
            item.checkColro +
            '; font-size: 13px;width: 60px;text-align: center;'
          "
          v-html="renderStatus(item)"
        ></span>
        <span
          style="float: right; color: #8492a6; font-size: 13px"
          v-html="renderKey(item)"
        ></span>
      </el-option>
    </el-select>
    <el-button
      class="btn-cliam"
      type="primary"
      icon="el-icon-circle-plus-outline"
      @click="cliam()"
      >领取</el-button
    >
    <el-button
      class="btn-logout"
      type="primary"
      icon="el-icon-user"
      @click="logout()"
      >退出</el-button
    >
  </div>
</template>

<script>
import * as sysApi from "../services/sys";
import * as userApi from "../services/jquery.oauth2-client";
import * as util from "../services/util";
export default {
  name: "search",
  data() {
    return {
      loading: null,
      catchTasks: {},
      searchTasks: [],
      tasks: [],
      value: "",
    };
  },
  // 初始化
  mounted() {
    this.findTasks();
  },
  methods: {
    // 每次切换任务时执行
    changeTask(val) {
      var featureGroupId = this.catchTasks[val].featureGroupId;
      var taskId = this.catchTasks[val].taskId;
      window.currentTask = this.catchTasks[val];
      this.$emit("refresh", taskId, featureGroupId);
    },
    // 根据用户的任务列表进行筛选
    dataFilter(val) {
      if (val) {
        //val存在
        this.searchTasks = this.tasks.filter((item) => {
          var label = this.renderLabel(item);
          var value = this.renderValue(item);
          if (
            !!~value.indexOf(val) ||
            !!~value.toUpperCase().indexOf(val.toUpperCase()) ||
            !!~label.indexOf(val) ||
            !!~label.toUpperCase().indexOf(val.toUpperCase())
          ) {
            return true;
          }
        });
      } else {
        //val为空时，还原数组
        this.searchTasks = this.tasks;
      }
    },
    // 第一次查询任务信息--部分信息（通过用户）
    findTasks() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      var $this = this;
      var $url =
        $this.$config.kts +
        "runtime/tasks?includeProcessVariables=true&size=100&sort=createTime&order=desc&assignee=" +
        $this.$user.name;
      $this.catchTasks = {};
      $this.searchTasks = [];
      $this.tasks = [];
      $this.value = "";
      sysApi
        .getAsyncDatas({
          url: $url,
          data: {},
        })
        .then((res) => {
          var datas = res.data || [];
          var taskIds = [];
          datas.forEach((d) => {
            var taskId = d.variables.find((s) => {
              return s.name == "taskId";
            });
            if (taskId) {
              d.taskId = taskId.value;
              taskIds.push(taskId.value);
            }
          });
          $this.tasks = datas;
          $this.findTaskLists(taskIds);
        });
    },
    // 第二次查询任务信息--详细信息（通过id）
    findTaskLists(taskIds) {
      var $this = this;
      var formData = new FormData();
      if (!taskIds.length) {
        this.loading.close();
        return;
      }
      formData.append("ids", taskIds.join(","));
      var $url = $this.$config.kts + "task/findByIds";
      sysApi
        .postAsyncDatas({
          url: $url,
          data: formData,
        })
        .then((res) => {
          if (res.code != "0") {
            $this.$notify({
              title: "警告",
              message: res.message,
              type: "warning",
            });
          }
          var results = res.result || {};
          for (var id in results) {
            var tags = util.formatTags(results[id].tags);
            var featureGroups = results[id].featureGroups || [];
            var catchTask = $this.tasks.filter((d) => {
              return d.taskId == id;
            });

            if (catchTask && catchTask.length) {
              catchTask.forEach((s) => {
                var taskDefinitionKey = s.taskDefinitionKey;
                var feature = featureGroups.find((d) => {
                  return d.linkId == taskDefinitionKey;
                });
                if (feature) {
                  var checkStatus = this.checkStatus(tags);
                  s.featureGroupId = feature.featureGroupId;
                  s.taskName = results[id].name;
                  s.formatTags = tags;
                  s.checkText = checkStatus.checkText;
                  s.checkColro = checkStatus.checkColro;
                  s.fcolor = checkStatus.fcolor;
                  $this.catchTasks[s.id] = s;
                }
              });
            }
          }
          $this.searchTasks = $this.tasks;
          this.loading.close();
        });
    },
    checkStatus(tags) {
      var checkText = "未检查";
      var checkColro = "";
      var fcolor = "#000";
      if (
        tags.checkStatus &&
        (tags.checkStatus == "1" || tags.checkStatus == "0")
      ) {
        checkText = ["等待中", "检查中"][tags.checkStatus] || "";
        checkColro = "#FFFF00";
      } else if (tags.checkStatus && tags.checkStatus == "2") {
        checkText = "检查完成";
        checkColro = "#ff0000";
      } else if (tags.checkStatus && tags.checkStatus == "3") {
        checkText = "检查异常";
        checkColro = "#0000FF";
        fcolor = "#fff";
      } else if (tags.checkStatus && tags.checkStatus == "4") {
        checkText = "进行中";
        checkColro = "#FFFF00";
        fcolor = "#000";
      } else if (
        tags.checkStatus &&
        (tags.checkStatus == "100" || tags.checkStatus == "5")
      ) {
        checkText = "可作业";
        checkColro = "#008000";
        fcolor = "#000";
      } else if (tags.checkStatus && tags.checkStatus == "6") {
        checkText = "处理异常";
        checkColro = "#0000FF";
        fcolor = "#fff";
      }
      return {
        checkText,
        checkColro,
        fcolor,
      };
    },
    renderShow(row) {
      return row.featureGroupId ? true : false;
    },
    renderLabel(row) {
      return row.taskName || " - ";
    },
    renderValue(row) {
      return row.id;
    },
    renderKey(row) {
      return row.taskId || " - ";
    },
    renderStatus(row) {
      return row.checkText || " - ";
    },
    // 领取任务
    cliam() {
      var $this = this;
      var $url = $this.$config.kts + "task/claim?user=" + $this.$user.name;
      sysApi
        .getAsyncDatas({
          url: $url,
          data: {},
        })
        .then((res) => {
          if (res.code == "0" && res.result.length) {
            $this.$notify({
              title: "成功",
              message: res.message,
              type: "success",
            });
            $this.findTasks();
          } else {
            $this.$notify({
              title: "警告",
              message: res.message,
              type: "warning",
            });
          }
        });
    },
    save() {
      // console.log("保存");
    },
    // 用户登出
    logout() {
      userApi.oauth2Client(null, this.$config.kd_auth_server).signout();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search {
  width: calc(100% - 20px);
  height: 40px;
  float: left;
  padding: 5px 10px;
  background-color: #ffffff;
  padding-bottom: 15px;
  position: relative;
  z-index: 4444;
}
.el-select__popper {
  z-index: 4445 !important;
}
.el-select__popper ul li {
  padding-right: 0px;
}
.el-select__popper ul li span {
  padding-right: 10px;
}
.search .el-select {
  float: left;
}
.search button {
  float: left;
  padding: 0px 15px;
}
.search button.btn-cliam {
  margin-left: 30px;
}
.search button.btn-logout {
  float: right;
}
</style>
