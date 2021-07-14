<template>
  <el-dialog
    title="信息确认"
    v-model="centerDialogVisible1"
    width="30%"
    destroy-on-close
    center
  >
    <strong>请确认是否所有数据已编辑完成并提交检查进入下一环节。</strong>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="autoCheckStatus">确 定</el-button>
        <el-button @click="centerDialogVisible1 = false">取 消</el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog title="信息确认" v-model="centerDialogVisible2" width="300px">
    <el-form :model="passForm">
      <el-form-item label="是否通过" label-width="100px">
        <el-select
          v-model="passForm.isPass"
          placeholder="是否通过"
          popper-class="isPassSelect"
        >
          <el-option label="是" value="true"></el-option>
          <el-option label="否" value="false"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="processPassStatus(passForm.isPass)"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <div class="contentSearch">
    <el-button-group>
      <el-button class="btn-form" icon="el-icon-search" @click="form()"
        >报表</el-button
      >
      <el-button class="btn-refresh" icon="el-icon-refresh" @click="refresh()"
        >刷新</el-button
      >
      <el-button
        class="btn-save"
        icon="el-icon-document-checked"
        @click="save()"
        >保存</el-button
      >
      <el-button
        class="btn-finish"
        icon="el-icon-folder-checked"
        @click="finish"
        >{{ finishText }}</el-button
      >
    </el-button-group>
  </div>
</template>

<script>
import * as sysApi from "../../services/sys";
import * as util from "../../services/util";
export default {
  name: "contentSearch",
  data() {
    return {
      passForm: {
        isPass: "true",
      },
      modal: false,
      centerDialogVisible1: false,
      centerDialogVisible2: false,
      cities: [],
      value: "",
      finishText: "编辑完成",
    };
  },
  mounted() {
    var role = util.isRoleAuth(this.$user);
    if ([1, 3].includes(role)) {
      this.finishText = "编辑完成";
    }
    if ([2, 3].includes(role)) {
      this.finishText = "质检完成";
    }
  },
  methods: {
    form() {
      this.$emit("refreshForm");
    },
    refresh() {
      this.$emit("refresh");
    },
    save() {
      this.$emit("finish");
    },
    finish() {
      if (!window.currentTask) {
        return;
      }
      if (this.finishText == "编辑完成") {
        this.centerDialogVisible2 = true;
      } else {
        this.centerDialogVisible2 = true;
      }
    },
    finishToProcess(isPass) {
      // 0：正在启动， 1：无需启动检查服务
      if (isPass == "0") {
        this.centerDialogVisible1 = false;
        this.centerDialogVisible2 = false;
        this.$emit("remakeTask");
      } else if (isPass == "1") {
        this.processPassStatus(true);
      }
    },
    processPassStatus(isPass) {
      var $this = this;
      var _checkData = {
        taskId: "" + window.currentTask.id,
        properties: [
          {
            id: "passFlag",
            value: isPass + "",
          },
        ],
      };
      var $url = $this.$config.kts + "form/form-data";
      sysApi
        .postAsyncDatas({
          url: $url,
          data: _checkData,
        })
        .then((res) => {
          console.log(res);
          $this.centerDialogVisible1 = false;
          $this.centerDialogVisible2 = false;
          $this.$emit("remakeTask");
        });
    },
    // 完成时,先调用检查
    autoCheckStatus() {
      var $this = this;
      var bodyParam = {
        activityId: window.currentTask.formatTags.currentActivity, //工作流ID (tag中的currentActivity的值）环节名称
        taskId: window.currentTask.taskId,
      };
      var $url = $this.$config.kts + "dispatch/job/start";
      sysApi
        .postAsyncDatas({
          url: $url,
          data: bodyParam,
        })
        .then((res) => {
          if (res.code != "0") {
            $this.$notify({
              title: "检查服务",
              message: "启动检查服务失败: " + res.message,
              type: "warning",
            });
            $this.centerDialogVisible1 = false;
            $this.centerDialogVisible2 = false;
            return;
          }
          $this.finishToProcess(res.result);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.contentSearch {
  height: 40px;
  float: left;
  padding: 5px 10px;
  position: absolute;
  right: 0px;
  z-index: 99;
}
.contentSearch button {
  float: left;
  padding: 0px 15px;
  min-height: 30px;
  height: 30px;
  line-height: 30px;
  width: auto;
}
.contentSearch .el-button-group {
  float: left;
  margin-left: 20px;
}
.contentSearch .el-button-group:last-child {
  float: right;
  margin-left: 0px;
}
.el-overlay {
  z-index: 8999 !important;
}
.is-fullscreen {
  z-index: 8999 !important;
}
.isPassSelect.el-popper {
  z-index: 9111 !important;
}
</style>
