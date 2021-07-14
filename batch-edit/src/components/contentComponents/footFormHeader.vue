<template>
  <div :class="{ isActive: hideHeader }" class="footHeader">
    <div class="footHeaderToggle">
      <el-button type="default" plain round @click="tableToggle()">
        <i :class="toggleClass"></i>
        <span class="toggleText">质量标记报表</span>
      </el-button>
      <!-- <el-button type="text" @click="table = true">打开嵌套表格的 Drawer</el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "footHeader",
  data() {
    return {
      toggleClass: this.hideHeader
        ? "el-icon-caret-top"
        : "el-icon-caret-bottom",
    };
  },
  props: ["hideHeader"],
  methods: {
    tableToggle() {
      this.$emit("tableToggle", this.hideHeader);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.footHeader {
  float: left;
  width: 100%;
  margin: 0 auto;
  padding: 0px;
  margin-bottom: 40px;
  z-index: 333;
  background: #fff;
}
.footHeader.isActive {
  margin-bottom: 0px;
}
.footHeader .footHeaderToggle {
  height: 20px;
  float: left;
  width: 100%;
}
.footHeader .footHeaderToggle button {
  position: absolute;
  top: -10px;
  border: none;
  height: 30px;
  padding: 0px;
  width: 140px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  border: none;
  min-height: 30px;
}
.footHeader .footHeaderToggle button i {
  position: absolute;
  left: 0px;
  right: 0px;
  float: left;
  font-size: 12px;
  top: 0px;
}
.footHeader .footHeaderToggle button .toggleText {
  position: absolute;
  left: 0px;
  right: 0px;
  float: left;
  bottom: 2px;
}
</style>
