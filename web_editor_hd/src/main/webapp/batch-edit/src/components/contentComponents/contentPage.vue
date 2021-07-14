<template>
  <div class="pages">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      hide-on-single-page
      layout="prev, pager, next, jumper"
      :current-page="pageNum"
      :page-count="pageTotleNum"
      style="position: absolute; bottom: 0px"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "pages",
  data() {
    return {
      pageNum: 1,
    };
  },
  props: ["pageTotleNum"],
  methods: {
    dataFilter() {},
    handleSizeChange(val) {
      this.pageNum = val;
      this.$emit("pageChange", this.pageNum);
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.$emit("pageChange", this.pageNum);
    },
    firstPage() {
      this.pageNum = 1;
      this.$emit("pageChange", this.pageNum);
    },
    lastPage() {
      this.pageNum = this.pageTotleNum;
      this.$emit("pageChange", this.pageNum);
    },
    prePage() {
      if (this.pageNum > 1) {
        this.pageNum--;
        this.$emit("pageChange", this.pageNum);
      }
    },
    nextPage() {
      if (this.pageNum < this.pageTotleNum) {
        this.pageNum++;
        this.$emit("pageChange", this.pageNum);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.pages {
  float: left;
  position: absolute;
  bottom: 20px;
  left: 0px;
  right: 0px;
  width: 380px;
  margin: 0 auto;
  padding: 5px 0px 15px 0px;
}
// .pages button,
// .pages .pageInfo {
//   float: left;
//   min-height: 30px;
//   height: 30px;
//   line-height: 30px;
//   width: auto;
//   background-color: #f2f4f9;
// }
// .pages .pageInfo {
//   margin: 0px 10px;
//   width: 120px;
// }
// .pages button.prePage,
// .pages button.nextPage {
//   padding: 0px 20px;
//   border-radius: 0px;
// }
// .pages button.firstPage,
// .pages button.lastPage {
//   padding: 0px 5px;
//   border: none;
//   min-height: 30px;
// }
</style>
