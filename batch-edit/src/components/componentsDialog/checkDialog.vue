<template>
  <div :class="{ isActive: hideHeader }" class="checkDialog">
    <el-popover placement="top" :width="400" v-model:visible="visible">
      <p>属性栏</p>
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-form-item label="错误类型">
          <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="错误属性">
          <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容描述">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="标记状态">
          <el-radio-group v-model="sizeForm.resource" size="medium">
            <el-radio border label="待核实"></el-radio>
            <el-radio border label="数据错误，需修改"></el-radio>
            <el-radio border label="数据正确，误报"></el-radio>
            <el-radio border label="数据错误，搁置"></el-radio>
            <el-radio border label="数据错误，已修改"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" size="mini" @click="visible = false"
            >确定</el-button
          >
          <el-button size="mini" @click="visible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "checkDialog",
  data() {
    return {
      visible: false,
      toggleClass: this.hideHeader
        ? "el-icon-caret-top"
        : "el-icon-caret-bottom",
      sizeForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
    };
  },
  methods: {
    tableToggle() {
      this.$emit("tableToggle", this.hideHeader);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.checkDialog {
  float: left;
  margin: 0 auto;
  padding: 0px;
  position: absolute;
  right: 5px;
  bottom: 35px;
  width: auto;
}
.checkDialog .footHeaderToggle button {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(58, 142, 230, 0);
  min-height: 20px;
  padding: 5px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}
.checkDialog .footHeaderToggle button:focus,
.checkDialog .footHeaderToggle button:hover {
  border: 1px solid rgba(58, 142, 230, 1);
  color: rgba(255, 255, 255, 1);
}
.el-form .el-radio-group .el-radio {
  margin-right: 5px;
  padding: 5px 10px 0px 5px;
  height: 26px;
  margin-bottom: 5px;
  float: left;
  margin-left: 0px !important;
}
.el-popover {
  max-height: 300px;
  overflow: auto;
}
.el-popover p {
  font-weight: bold;
  margin: 5px 0px;
}
</style>
