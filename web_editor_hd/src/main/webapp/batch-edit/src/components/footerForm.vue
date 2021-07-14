<template>
  <div class="indexFooter">
    <footHeader @tableToggle="tableToggle" :hideHeader="true" />
    <el-drawer
      ref="drawer"
      title=""
      v-model="table"
      direction="btt"
      size="size"
      :modal="false"
      :close-on-press-escape="false"
      :with-header="false"
      @opened="drawerOpened()"
      @close="drawerClose()"
    >
      <footHeader @tableToggle="tableToggle" :hideHeader="false" />
      <el-button
        class="export"
        type="default"
        icon="el-icon-upload2"
        title="导出"
        @click="exports()"
        >导出</el-button
      >
      <el-table
        :data="tableData"
        id="out-table"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
        lazy
        highlight-current-row
        @current-change="handleCurrentChange"
        :load="loadChildren"
        :row-class-name="tableRowClassName"
        empty-text=" - "
        max-height="400"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column fixed="left" label="状态" width="120" type="">
          <template #default="scope">
            <el-button
              icon="el-icon-check"
              :type="scope.row.status == '4' ? 'success' : 'info'"
              @click="changeStatus(scope.row, '4')"
              size="mini"
              title="已修改"
              circle
            ></el-button>
            <el-button
              icon="el-icon-close"
              :type="scope.row.status == '2' ? 'success' : 'info'"
              @click="changeStatus(scope.row, '2')"
              size="mini"
              title="误报"
              circle
            ></el-button>
            <el-button
              icon="el-icon-right"
              :type="scope.row.status == '3' ? 'success' : 'info'"
              @click="changeStatus(scope.row, '3')"
              size="mini"
              title="搁置"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="errortype"
          label="错误类别"
          width="180"
          type=""
        ></el-table-column>
        <el-table-column
          prop="checknum"
          label="检查项编码"
          width="180"
          type=""
        ></el-table-column>
        <el-table-column
          prop="datatype"
          label="数据类型"
          type=""
        ></el-table-column>
        <el-table-column
          prop="question"
          label="问题描述"
          type=""
        ></el-table-column>
        <el-table-column
          prop="tagsource"
          label="标记类型"
          type=""
        ></el-table-column>
        <el-table-column
          prop="progress"
          label="核标进度"
          type=""
        ></el-table-column>
        <el-table-column label="操作" width="100"></el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import footHeader from "@/components/contentComponents/footFormHeader.vue";
import * as sysApi from "../services/sys";
import * as util from "../services/util";
export default {
  name: "indexFooter",
  props: [],
  data() {
    return {
      size: "500px",
      table: false,
      taskId: null,
      exportData: [],
      tableData: [],
      editDatas: {},
      tableDataChild: {},
    };
  },
  mounted() {
    this.queryQualityTag();
  },
  computed: {
    // tableRowType(row, rowIndex) {
    //   return "success";
    // },
  },
  methods: {
    // 导出功能，暂时不可用
    exports() {
      let taskId = this.taskId;
      let tag_state = { 2: "误报", 3: "搁置", 4: "已修改" };
      let tag_sources = [
        "",
        "质检员",
        "验收员",
        "质量评估员",
        "基于资料的打标服务",
        "基于车道模型的打标服务",
        "逻辑检查项服务",
        "后自动化服务",
        "融合前单轨迹核线检查",
        "融合后单轨迹核线检查",
        "多轨迹核线检查",
        "静态激光点云真值评估",
      ];
      let str1 =
        '<tr style="background-color:#f2f2f2;"><td>任务ID</td><td>状态</td><td>错误类别</td><td>检查项编码</td><td>数据类型</td><td>问题描述</td><td>内容</td><td>标记类型</td><td>核标进度</td><td>标记来源</td><td>是否误报</td><td>坐标</td></tr>';
      for (let s = 0; s < this.exportData.length; s++) {
        let tag = this.exportData[s].tags || {},
          tag_source = tag.TAG_SOURCE ? tag.TAG_SOURCE : "0",
          tag_source_cn = tag_sources[tag_source] || "",
          locs = this.exportData[s].locs || [],
          locsStr = locs.join(","),
          state = tag.STATE && tag_state[tag.STATE] ? tag_state[tag.STATE] : "";

        if (this.exportData[s].pid < 0) {
          str1 += '<tr style="background-color:rgb(255, 255, 199);">';
        } else {
          str1 += "<tr>";
        }

        str1 += `<td>${taskId + "\t"}</td>`;
        str1 += `<td>${state + "\t"}</td>`;
        str1 += `<td>${this.exportData[s].errortype + "\t"}</td>`;
        str1 += `<td>${this.exportData[s].checknum + "\t"}</td>`;
        str1 += `<td>${this.exportData[s].datatype + "\t"}</td>`;
        str1 += `<td>${this.exportData[s].question + "\t"}</td>`;
        str1 += `<td>${
          this.exportData[s].checknum + this.exportData[s].question + "\t"
        }</td>`;
        str1 += `<td>${this.exportData[s].tagsource + "\t"}</td>`;
        str1 += `<td STYLE='MSO-NUMBER-FORMAT:\\@'>${
          this.exportData[s].progress + "\t"
        }</td>`;
        str1 += `<td>${tag_source_cn + "\t"}</td>`;
        str1 += `<td>\t</td>`;
        str1 += `<td>${locsStr + "\t"}</td>`;

        str1 += "</tr>";
      }
      //Worksheet名
      let worksheet = "Sheet1";
      let _uri = "data:application/vnd.ms-excel;base64,";

      //下载的表格模板数据
      let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      	xmlns:x="urn:schemas-microsoft-com:office:excel" 
      	xmlns="http://www.w3.org/TR/REC-html40">
      	<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        	<x:Name>${worksheet}</x:Name>
        	<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        	</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        	</head><body><table>${str1}</table></body></html>`;

      //下载模板
      let base64 = window.btoa(unescape(encodeURIComponent(template)));

      var a = document.createElement("a");
      a.download = taskId + " -- 质量标记报表.xls";
      a.href = _uri + base64;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    tableToggle(type) {
      this.table = type;
    },
    tableRowClassName({ row }) {
      if (row.pid === -1) {
        return "warning-row";
      }
      return "";
    },
    // 表格列点击
    handleCurrentChange(row) {
      this.$emit("contentPageChange", row);
    },
    // 更新质检标记的属性
    updateTagDatas(id, form, editId, modelName) {
      if (!this.editDatas[id] || id.indexOf("_tag_") > -1) {
        this.editDatas[id] = {
          id: id,
          properties: {
            TAG_SOURCE: "1",
            FEATURE_GROUP: window.currentTask.featureGroupId,
            FEATURE: modelName,
            FEATURE_ID: editId,
            TASK_ID: this.taskId,
          },
        };
      }
      for (var name in form) {
        this.editDatas[id].properties[name] = form[name];
      }
      for (var f_id in this.tableDataChild) {
        var childs = this.tableDataChild[f_id];
        var thisChild = childs.find((d) => {
          return d.entityId == id;
        });
        if (thisChild && form.STATE) {
          thisChild.tags.STATE = form.STATE;
        }
      }
    },
    // 报表修改状态
    changeStatus(row, state) {
      row.status = state;
      if (row.pid === -1) {
        var child = this.tableDataChild[row.id] || [];
        child.forEach((d) => {
          d.status = state;
          this.updateTagDatas(d.entityId, { STATE: state });
          this.$emit(
            "tagDataUpdateState",
            d.entityId,
            this.editDatas[d.entityId].properties
          );
        });
      } else {
        this.updateTagDatas(row.entityId, { STATE: state });
        this.$emit(
          "tagDataUpdateState",
          row.entityId,
          this.editDatas[row.entityId].properties
        );
      }
    },
    // 保存报表所修改的数据
    finishDatas() {
      var $this = this;
      var $url = $this.$config.kd_tag + "tag/QUALITY_TAG/update";
      var edits = [];
      var created = [];
      for (var id in $this.editDatas) {
        if (id.indexOf("_tag_") > -1) {
          created.push({
            properties: $this.editDatas[id].properties,
          });
        } else {
          edits.push($this.editDatas[id]);
        }
      }
      if (created.length) {
        this.createQualitDatas(created, edits);
      }
      if (!edits.length && !created.length) {
        $this.tableData = [];
        $this.editDatas = {};
        $this.tableDataChild = {};
        return;
      }
      if (!edits.length) {
        return;
      }
      sysApi
        .postAsyncDatas({
          url: $url,
          data: edits,
        })
        .then((res) => {
          if (res.code == "0" && res.result) {
            $this.$notify({
              title: "质量标记修改",
              message: res.message,
              type: "success",
            });
            $this.queryQualityTag($this.taskId);
          } else {
            $this.$notify({
              title: "质量标记修改",
              message: res.message,
              type: "warning",
            });
          }
        });
    },
    // 保存报表所修改的数据
    createQualitDatas(create, edit) {
      var $this = this;
      var $url = $this.$config.kd_tag + "tag/QUALITY_TAG/create";
      sysApi
        .postAsyncDatas({
          url: $url,
          data: create,
        })
        .then((res) => {
          if (res.code == "0") {
            $this.$notify({
              title: "质量标记新增",
              message: res.message,
              type: "success",
            });
            if (!edit.length) {
              $this.queryQualityTag($this.taskId);
            }
          } else {
            $this.$notify({
              title: "质量标记新增",
              message: res.message,
              type: "warning",
            });
          }
        });
    },
    // 报表加载子集
    loadChildren(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(this.tableDataChild[tree.id]);
      }, 500);
    },
    // 加载任务的质检标记
    queryQualityTag(id) {
      var $this = this;
      $this.tableData = [];
      $this.exportData = [];
      $this.editDatas = {};
      $this.tableDataChild = {};
      if (!id) {
        return;
      }
      $this.taskId = id;
      var temp1 = [
        { k: "TASK_ID", op: "eq", v: id },
        {
          k: "FEATURE_GROUP",
          op: "eq",
          v: window.currentTask.featureGroupId,
        },
      ];
      var $url =
        $this.$config.kd_tag +
        "tag/osm/QUALITY_TAG/query?tagsJson=" +
        encodeURIComponent(JSON.stringify(temp1));
      sysApi
        .getAsyncDatas({
          url: $url,
        })
        .then((res) => {
          var model = $this.$tags["QUALITY_TAG"] || {};
          var modelEntity = model.fields || [];
          var errorType = $this.$_.filter(modelEntity, {
            fieldName: "ERROR_TYPE",
          })[0];
          var types = errorType.fieldType.fieldTypeValues;
          var tagSource = $this.$_.filter(modelEntity, {
            fieldName: "TAG_SOURCE",
          })[0];
          var source = tagSource.fieldType.fieldTypeValues;
          var nodes = (res.result && res.result.node) || [];
          var newDatas = {};
          nodes.forEach(function (entity) {
            let tags = util.formatTags(entity.tag);
            entity.cloneTag = tags;
            let ERROR_TYPE = tags.ERROR_TYPE;
            let FEATURE = tags.FEATURE;
            let CHECK_ITEM_ID = tags.CHECK_ITEM_ID;
            let type = $this.$_.filter(types, { value: ERROR_TYPE })[0];
            let type_name = type && type.name ? type.name : "";
            var obj = {
              id: "",
              state: "xx",
              children: [],
              errortype: type_name,
              checknum: "",
              datatype: "",
              question: "",
              tagsource: "",
              progress: "",
              pid: -1,
              hasChildren: false,
              status: 0,
            };
            //数据分类
            if (ERROR_TYPE == "0") {
              if (!newDatas[CHECK_ITEM_ID + "-" + FEATURE]) {
                newDatas[CHECK_ITEM_ID + "-" + FEATURE] = obj;
                newDatas[CHECK_ITEM_ID + "-" + FEATURE].datatype = FEATURE;
                newDatas[CHECK_ITEM_ID + "-" + FEATURE].datas = [];
              }
              newDatas[CHECK_ITEM_ID + "-" + FEATURE].datas.push(entity);
            } else {
              // if (ERROR_TYPE && FEATURE) {
              if (!newDatas[ERROR_TYPE + "-" + FEATURE]) {
                newDatas[ERROR_TYPE + "-" + FEATURE] = obj;
                newDatas[ERROR_TYPE + "-" + FEATURE].datatype = FEATURE;
                newDatas[ERROR_TYPE + "-" + FEATURE].datas = [];
              }
              newDatas[ERROR_TYPE + "-" + FEATURE].datas.push(entity);
            }
          });
          $this.$emit("tagDataChange", nodes);

          var num = 1;
          var results = [];
          for (let i in newDatas) {
            let item = newDatas[i];
            item.id = num;
            let data = $this.$_.clone(item.datas);
            delete item.datas;
            var subResult = [],
              progress = 0;
            data.forEach(function (d) {
              let tags = util.formatTags(d.tag);
              num++;
              let tagSource =
                $this.$_.filter(source, { value: tags.TAG_SOURCE })[0] || {};
              let tagSourceName = tagSource.name;
              if (
                tagSource.value == "4" ||
                tagSource.value == "5" ||
                tagSource.value == "6" ||
                tagSource.value == "7"
              ) {
                tagSourceName = "作业标";
              }
              let locs = [d.lon, d.lat, d.z];
              let subObj = {
                id: num,
                state: d.id,
                errortype: "",
                children: [],
                tags: tags,
                checknum: tags.CHECK_ITEM_ID || "",
                datatype: item.datatype,
                question: tags.DESC,
                tagsource: tagSourceName || "",
                progress: "",
                pid: item.id,
                entityId: d.id,
                changed: false,
                misstate: false,
                shelve: false,
                locs: locs,
                status: tags.STATE || 0,
              };
              if (tags.STATE == "0" || tags.STATE == "1") {
                subResult.unshift(subObj);
              } else {
                progress += 1;
                subResult.push(subObj);
              }
            });
            item.progress = progress + "/" + data.length;
            if (data.length) {
              item.hasChildren = true;
              $this.tableDataChild[item.id] = subResult;
              $this.exportData.push(item);
              $this.exportData.push(...subResult);
              results.push(item);
            }
            num++;
          }
          $this.tableData = results;
        });
    },
    drawerOpened() {
      this.$emit("drawerOpened");
    },
    drawerClose() {
      this.$emit("drawerClose");
    },
  },
  components: {
    footHeader,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.indexFooter {
  float: left;
  position: absolute;
  bottom: 0px;
  z-index: 100;
  height: 20px;
  width: calc(100% - 10px);
  padding: 0px 5px;
}
.indexFooter .el-table .warning-row {
  background: rgb(255, 255, 199);
}
.indexFooter .el-table td,
.indexFooter .el-table th {
  padding: 6px 0;
}
.indexFooter .el-table .el-button {
  padding: 0px;
  min-height: 10px;
}
.indexFooter button.export {
  position: absolute;
  right: 15px;
  top: 10px;
}
.indexFooter .el-drawer {
  overflow: initial;
  height: 500px;
}
</style>
