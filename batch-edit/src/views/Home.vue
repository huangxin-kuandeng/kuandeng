<template>
  <div class="home">
    <indexHeader msg="属性批量编辑" ref="header" />
    <indexSearch @refresh="refresh" ref="search" />
    <indexContent
      :tagDatas="tagDatas"
      @checkTagEdit="checkTagEdit"
      @checkTagCreate="checkTagCreate"
      @refreshForm="refreshForm"
      @finishTask="finishTask"
      ref="content"
    />
    <indexFooter
      ref="footer"
      :tagEdits="tagEdits"
      @tagDataUpdateState="tagDataUpdateState"
      @tagDataChange="tagDataChange"
      @drawerOpened="drawerOpened"
      @drawerClose="drawerClose"
      @contentPageChange="contentPageChange"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import indexHeader from "@/components/header.vue";
import indexSearch from "@/components/search.vue";
import indexContent from "@/components/content.vue";
import indexFooter from "@/components/footerForm.vue";

export default {
  name: "Home",
  data() {
    return {
      tagDatas: [],
      tagEdits: {},
    };
  },
  components: {
    indexHeader,
    indexSearch,
    indexContent,
    indexFooter,
  },
  methods: {
    contentPageChange(row) {
      this.$refs.content.contentPageChange(row);
    },
    refresh(id = "", featureGroupId = "") {
      this.tagDatas = [];
      this.$refs.content.refresh({
        page: 1,
        id: id,
        featureGroupId: featureGroupId,
      });
      this.$refs.footer.queryQualityTag(id);
    },
    refreshForm(id) {
      this.tagDatas = [];
      this.$refs.footer.queryQualityTag(id);
    },
    // 质检标记报表数据变化时，更新所有标信息
    tagDataChange(data) {
      this.tagDatas = data;
    },
    // 质检标记报表单数据修改状态时，更新数据内的状态
    tagDataUpdateState(id, properties, type) {
      var updateData = this.tagDatas.find((d) => {
        return d.id == id;
      });
      if (updateData) {
        var updateTag = updateData.tag || [];
        for (var prop in properties) {
          var updateTagProp = updateTag.find((s) => {
            return s.k == prop;
          });
          if (updateTagProp) {
            updateTagProp.v = properties[prop];
            updateData.cloneTag[prop] = properties[prop];
          } else {
            updateData.tag.push({
              k: prop,
              v: properties[prop],
            });
            updateData.cloneTag[prop] = properties[prop];
          }
        }
        !type &&
          this.$refs.content.changeTagEditorForm(updateData.id, properties);
      }
    },
    finishTask(type) {
      this.tagDatas = [];
      if (type == "report") {
        this.$refs.footer.finishDatas();
      } else if (type == "task") {
        this.$refs.footer.queryQualityTag();
        this.$refs.search.findTasks();
      }
    },
    // 质检标属性编辑：点击确定或分页时执行
    checkTagEdit(id, form, editId, modelName) {
      // this.tagEdits[id] = form;
      this.$refs.footer.updateTagDatas(id, form, editId, modelName);
      this.tagDataUpdateState(id, form, true);
    },
    checkTagCreate(id, form, editId, modelName) {
      this.$refs.footer.updateTagDatas(id, form, editId, modelName);
      var properties = this.$_.cloneDeep(form);
      properties.FEATURE_ID = editId;
      properties.FEATURE = modelName;
      this.tagDatas.push({
        id: id,
        cloneTag: properties,
        tag: [],
        modelName: "QUALITY_TAG",
      });
      // this.tagDataUpdateState(id, form, true);
    },
    drawerOpened() {
      this.$refs.content.contentClass({
        contentClass: "little",
      });
    },
    drawerClose() {
      this.$refs.content.contentClass({
        contentClass: "",
      });
    },
  },
};
</script>

<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
  margin: 0px;
}
.home {
  float: left;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f2f4f9;
}
.el-popover,
.el-select__popper,
.el-notification,
.el-image-viewer__wrapper,
.el-message {
  z-index: 4445 !important;
}
</style>
