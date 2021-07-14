<template>
  <div class="tabs" :class="paneClass">
    <contentSearch
      @remakeTask="remakeTask"
      @refresh="refresh"
      @finish="finishTask"
      @refreshForm="refreshForm"
    />
    <el-tabs
      v-loading.fullscreen.lock="fullscreenLoading"
      class="contentTabs"
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="list in lists"
        :label="list.name"
        :name="list.value"
        :key="list.name"
      >
        <el-scrollbar>
          <div
            v-for="aList in filterActiveLists"
            :key="aList.id"
            class="blockImage hide"
            :class="'_' + aList.id"
            @mouseenter="mouseenter($event)"
            @mouseleave="mouseleave($event)"
          >
            <el-image
              style="height: 170px"
              :src="aList.file_url"
              :preview-src-list="[aList.file_url]"
              fit="fill"
            >
            </el-image>
            <contentEdit
              ref="contentEdit"
              :editTags="aList.tags"
              :tagDatas="tagDatas"
              :editQuestionTag="editQuestionTag"
              :modelName="aList.modelName"
              :editDisabled="editDisabled"
              :checkDisabled="checkDisabled"
              :stateDisabled="stateDisabled"
              :editId="aList.id"
              :entity="aList"
              :entityId="aList.entityId"
              @editList="editList"
              @checkList="checkList"
              @checkListCreate="checkListCreate"
              @tagImage="tagImage"
              @tagImageDelete="tagImageDelete"
            />
            <span
              class="demonstration"
              :title="aList.modelName + '_' + aList.entityId"
              >{{ aList.modelName }}_{{ aList.entityId }}</span
            >
            <i
              class="mark el-icon-warning"
              v-show="editQuestionTag[aList.id]"
            ></i>
          </div>
        </el-scrollbar>
        <contentPage
          :pageTotleNum="pageTotleNum"
          ref="contentPage"
          @pageChange="pageChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import contentSearch from "@/components/contentComponents/contentSearch.vue";
import contentPage from "@/components/contentComponents/contentPage.vue";
import contentEdit from "@/components/contentComponents/contentEdit.vue";
import * as sysApi from "../services/sys";
import * as util from "../services/util";
export default {
  name: "search",
  props: ["tagDatas"],
  data() {
    return {
      paneClass: "",
      editDisabled: false,
      checkDisabled: false,
      stateDisabled: true,
      fullscreenLoading: false,
      lists: [
        {
          name: "数据",
          value: "DATA",
          modelName: "DATA",
        },
      ],
      activeLists: [],
      value: "",
      taskId: null,
      featureGroupId: null,
      pageTotleNum: 0,
      editHistory: {},
      pageNum: 0,
      tagImageId: -1,
      tagHistoryData: [],
      editQuestionTag: {},
      activeName: "DATA",
    };
  },
  computed: {
    filterActiveLists() {
      var activeList = this.activeLists[this.pageNum - 1];
      var datas = activeList ? activeList.datas : [];
      return datas;
    },
  },
  mounted() {
    this.refresh(1);
    // editDisabled：属性编辑栏根据用户权限验证是否可修改
    // stateDisabled：作业员只可改 标记状态
    var role = util.isRoleAuth(this.$user);
    if ([1, 3].includes(role)) {
      this.editDisabled = false;
      this.stateDisabled = false;
    } else {
      this.editDisabled = true;
      this.stateDisabled = true;
    }
    // checkDisabled：质检标记属性编辑栏根据用户权限验证是否可修改 ： 质检员都可修改
    if ([2, 3].includes(role)) {
      this.checkDisabled = false;
      this.stateDisabled = false;
    } else {
      this.checkDisabled = true;
    }
  },
  methods: {
    contentClass(param) {
      this.paneClass = param.contentClass;
    },
    // 模型类型切换
    handleClick() {
      return;
    },
    mouseenter(event) {
      event.currentTarget.className = "blockImage show";
    },
    mouseleave(event) {
      event.currentTarget.className = "blockImage hide";
    },
    logout() {
      // console.log("退出");
    },
    // 是否被标记的状态
    renderMarkType(tag) {
      if (!tag) {
        return;
      }
      if (this.editQuestionTag[tag.id]) {
        return true;
      } else {
        return false;
      }
    },
    // 每次属性编辑后保存编辑记录
    editList(id, form) {
      if (!this.editHistory[id]) {
        this.editHistory[id] = {
          id: id,
          tags: {},
        };
      }
      form["FLAG"] = "2";
      form["OPERATOR"] = this.$user.name;
      form["SDATE"] = new Date().getTime();
      var pageNumData = this.activeLists[this.pageNum - 1];
      if (pageNumData && pageNumData.datas) {
        var entity = pageNumData.datas.find((d) => {
          return d.id == id;
        });
        if (entity) {
          for (var key in form) {
            this.editHistory[id].tags[key] = form[key];
            entity.tags[key] = form[key];
          }
        }
      }
    },
    // 每次编辑质检标记属性
    checkList(id, form, editId) {
      var active = this.activeLists[this.pageNum - 1] || {};
      this.$emit("checkTagEdit", id, form, editId, active.modelName);
    },
    checkListCreate(id, form, editId) {
      var active = this.activeLists[this.pageNum - 1] || {};
      this.$emit("checkTagCreate", id, form, editId, active.modelName);
    },
    changeTagEditorForm(id, prop) {
      this.$refs.contentEdit.changeTagEditorForm(id, prop);
    },
    // 问题标记--新增
    tagImage(id, form) {
      var properties = form;
      properties.ENTITY_ID = id;
      properties.TASK_ID = this.taskId;
      this.editQuestionTag[id] = properties;
    },
    // 问题标记--删除
    tagImageDelete(id) {
      this.editQuestionTag[id] = false;
    },
    // 保存问题标记
    saveQuestionTag(list) {
      if (!this.taskId) {
        return;
      }
      var createTag = [];
      var deleteTag = [];
      for (var id in this.editQuestionTag) {
        var catchTag = this.tagHistoryData.find((d) => {
          return d.newTag.ENTITY_ID == id;
        });
        if (this.editQuestionTag[id] && !catchTag) {
          //新增
          createTag.push({
            properties: this.editQuestionTag[id],
          });
        } else if (!this.editQuestionTag[id] && catchTag) {
          deleteTag.push(catchTag.id);
        }
      }
      if (deleteTag.length) {
        this.deleteQuestionTag(deleteTag);
      }
      if (createTag.length) {
        this.createQuestionTag(createTag, list);
      }
    },
    // 新增问题标记
    createQuestionTag(createTag, list) {
      var $url = this.$config.kd_tag + "tag/QUESTION_TAG/create";
      sysApi
        .postAsyncDatas({
          url: $url,
          data: createTag,
        })
        .then((res) => {
          if (res.code == "0") {
            this.$notify({
              title: "问题标记",
              message: "新增问题标记成功",
              type: "success",
            });
          } else {
            this.$notify({
              title: "问题标记",
              message: "新增问题标记失败：" + res.message,
              type: "warning",
            });
          }
          // 如果不存在保存的属性数据，则自己去单独执行一次查询问题标记的事件
          if (!list.length) {
            this.queryTagImage();
          }
        });
    },
    // 删除问题标记
    deleteQuestionTag(deleteTag) {
      var ids = deleteTag.join(",");
      var $url =
        this.$config.kd_tag + "tag/QUESTION_TAG/deleteByIds?ids=" + ids;
      sysApi
        .getAsyncDatas({
          url: $url,
        })
        .then((res) => {
          if (res.code == "0") {
            this.$notify({
              title: "问题标记",
              message: "删除问题标记成功",
              type: "success",
            });
          } else {
            this.$notify({
              title: "问题标记",
              message: "删除问题标记失败：" + res.message,
              type: "warning",
            });
          }
        });
    },
    // 查询当前任务--问题标记
    queryTagImage() {
      this.tagHistoryData = [];
      this.editQuestionTag = {};
      if (!this.taskId) {
        return;
      }

      var $this = this;
      var temp1 = [{ k: "TASK_ID", op: "eq", v: this.taskId }];
      var $url =
        $this.$config.kd_tag +
        "tag/osm/QUESTION_TAG/query?tagsJson=" +
        encodeURIComponent(JSON.stringify(temp1));
      sysApi
        .getAsyncDatas({
          url: $url,
        })
        .then((res) => {
          if (res.code != "0") {
            $this.$notify({
              title: "问题标记",
              message: res.message,
              type: "warning",
            });
          }
          var nodes = (res.result && res.result.node) || [];
          nodes.forEach((d) => {
            var tags = util.formatTags(d.tag);
            d.newTag = tags;
            if (tags.ENTITY_ID) {
              this.editQuestionTag[tags.ENTITY_ID] = tags;
            }
          });
          this.tagHistoryData = nodes;
        });
    },
    // 完成保存所修改的数据
    finishTask() {
      var $this = this;
      $this.$emit("finishTask", "report");
      var list = [];
      for (var id in $this.editHistory) {
        list.push($this.editHistory[id]);
      }
      $this.saveQuestionTag(list);
      if (!list.length || !$this.taskId) {
        return;
      }
      $this.fullscreenLoading = true;
      var $url =
        $this.$config.kds_data +
        "data/tags/edit?taskId=" +
        $this.taskId +
        "&featureGroupId=" +
        $this.featureGroupId;
      sysApi
        .postAsyncDatas({
          url: $url,
          data: list,
        })
        .then((res) => {
          $this.message(res.code, res.message);
          $this.fullscreenLoading = false;
          if (res.code == "0") {
            $this.refresh();
          }
        });
    },
    remakeTask() {
      this.taskId = null;
      this.featureGroupId = null;
      this.pageTotleNum = 0;
      this.activeLists = [];
      this.$emit("finishTask", "task");
    },
    // 刷新数据
    refresh(param = {}) {
      var page = param.page || this.pageNum;
      if (param.id) {
        this.taskId = param.id;
        this.featureGroupId = param.featureGroupId;
      }
      this.queryTagImage();
      this.findLists(page);
    },
    // 刷新报表
    refreshForm() {
      this.$emit("refreshForm", this.taskId);
    },
    // 分页查询
    pageChange(page) {
      this.pageNum = page;
    },
    contentPageChange(row) {
      var active = document.getElementsByClassName("active")[0];
      if (active) {
        active.classList.remove("active");
      }
      if (!row.tags || !row.tags.FEATURE_ID) {
        return;
      }
      for (var i = 0; i < this.activeLists.length; i++) {
        var datas = this.activeLists[i].datas;
        var findData = datas.find((d) => {
          return d.entityId == row.tags.FEATURE_ID;
        });
        if (findData) {
          let page = i + 1;
          if (page != this.pageNum) {
            this.$refs.contentPage.handleSizeChange(page);
            setTimeout(function () {
              active = document.getElementsByClassName("_" + findData.id)[0];
              active.classList.add("active");
            }, 500);
            return;
          } else {
            active = document.getElementsByClassName("_" + findData.id)[0];
            active.classList.add("active");
            return;
          }
        }
      }
    },
    // 查询模型分类
    findLists(page) {
      var $this = this;
      $this.pageTotleNum = 0;
      $this.activeLists = [];
      if (page) {
        $this.pageNum = page;
      }
      if (!$this.taskId) {
        return;
      }
      var $url =
        $this.$config.kds_data +
        "data/tags/queryByGroup?taskId=" +
        // 1 +
        $this.taskId +
        "&featureGroupId=" +
        $this.featureGroupId;
      $this.fullscreenLoading = true;

      var new_multi_tiles = $this.$config.file.replace(
        /\{switch:([^}]+)\}/,
        function (s, r) {
          var subdomains = r.split(",");
          return subdomains[0 % subdomains.length];
        }
      );
      sysApi
        .getAsyncDatas({
          url: $url,
          data: {},
        })
        .then((res) => {
          if (res.code != "0") {
            $this.$notify({
              title: "数据",
              message: res.message,
              type: "warning",
            });
          }
          var results = res.result || [];
          if (results.length) {
            $this.pageNum = 1;
          }
          results.forEach((d) => {
            var dataChild = d.datas || [];
            for (var s = 0; s < dataChild.length; s++) {
              let key = dataChild[s].dataTaskId;
              let t = new Date().getTime();
              let index = dataChild[s].modelName + "_" + dataChild[s].entityId;
              let projectId = dataChild[s].autoProjectId;
              let file_url =
                new_multi_tiles +
                "key=" +
                key +
                "&index=" +
                index +
                "&projectId=" +
                projectId +
                "&t=" +
                t;
              dataChild[s].file_url = file_url;
            }
          });
          $this.fullscreenLoading = false;
          $this.pageTotleNum = results.length;
          $this.activeLists = results;
        });
    },
    message(type, message) {
      if (type == "0") {
        this.$notify({
          title: "数据属性编辑",
          message: message,
          type: "success",
        });
      } else {
        this.$notify({
          title: "数据属性编辑",
          message: "错误信息：" + message,
          type: "warning",
        });
      }
    },
  },
  components: {
    contentSearch,
    contentPage,
    contentEdit,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.tabs {
  float: left;
  width: 100%;
  margin-bottom: 10px;
  height: calc(100% - 140px);
  border-bottom: 1px solid #e4e7ed;
}
.tabs.little {
  z-index: 3000;
  position: relative;
  height: calc(100% - 640px);
}
.tabs .el-scrollbar {
  height: calc(100% - 40px);
}
.tabs.little .el-scrollbar {
  height: calc(100% - 20px);
}
.tabs.little .pages {
  bottom: 0px;
}
.tabs .contentTabs {
  height: 100%;
}
.tabs .contentTabs .el-tabs__content {
  height: calc(100% - 50px);
  padding-top: 10px;
  background-color: #f2f4f9;
  overflow: auto;
}
.tabs .contentTabs .el-tabs__content .el-tab-pane {
  height: 100%;
}
.tabs .blockImage {
  width: calc(14.2% - 30px);
  margin: 0px 15px;
  height: 200px;
  float: left;
  position: relative;
}
.tabs .blockImage .mark {
  color: rgb(255, 0, 0);
  position: absolute;
  right: 5px;
  bottom: 35px;
  z-index: 1;
}
.tabs .blockImage img {
  // width: calc(100% - 4px);
  width: auto;
  max-width: 100%;
  height: calc(100% - 4px);
  border: 2px solid rgba(58, 142, 230, 0);
}
.tabs .blockImage img:hover {
  border: 2px solid rgba(58, 142, 230, 1);
}
.tabs .blockImage.active img {
  border: 2px solid rgb(43, 255, 0);
}
.tabs .blockImage .demonstration {
  float: left;
  height: 30px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  left: 0px;
  line-height: 30px;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tabs .blockImage.hide .footHeaderToggle {
  opacity: 0;
}
</style>
