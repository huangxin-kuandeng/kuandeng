<template>
  <div class="contentList">
    <el-button class="btn-change" icon="el-icon-edit-outline" @click="change()"
      >修改</el-button
    >
    <el-button-group>
      <el-button class="btn-quality" icon="el-icon-location" @click="qualitytag()"
        >质检标记</el-button
      >
      <el-button
        class="btn-question"
        icon="el-icon-location"
        @click="questiontag()"
        >问题标记</el-button
      >
    </el-button-group>
    <el-button-group>
      <el-button class="btn-surface" icon="el-icon-search" @click="surface()"
        >报表</el-button
      >
      <el-button class="btn-refresh" icon="el-icon-refresh" @click="refresh()"
        >刷新</el-button
      >
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: "contentSearch",
  data() {
    return {
      cities: [],
      value: "",
    };
  },
  methods: {
    change() {
      console.log("修改");
    },
    qualitytag() {
      console.log("质检标记");
    },
    questiontag() {
      console.log("问题标记");
    },
    surface() {
      console.log("报表");
    },
    refresh() {
      console.log("刷新");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.contentSearch {
  width: calc(100% - 20px);
  height: 40px;
  float: left;
  padding: 5px 10px;
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
</style>
