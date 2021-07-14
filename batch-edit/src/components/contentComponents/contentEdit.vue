<template>
  <div class="contentEdit">
    <el-popover
      :placement="placement"
      :width="popWidth"
      trigger="manual"
      popper-class="editPopover"
      :popper-options="{
        boundariesElement: 'body',
        gpuAcceleration: false,
      }"
      v-model:visible="visible"
    >
      <p>属性栏</p>
      <el-scrollbar max-height="450px" style="padding-bottom: 30px">
        <el-form
          v-if="formType == 1"
          ref="editForm"
          :model="editForm"
          label-width="150px"
          size="medium"
          :rules="editRules"
          :label-position="'left'"
        >
          <div v-for="formChild in formDatas" :key="formChild.fieldName">
            <el-form-item
              v-if="formChild.display"
              :label="formChild.fieldTitle"
              :prop="formChild.fieldName"
            >
              <el-select
                v-if="formChild.fieldInput == 'select'"
                v-model="editForm[formChild.fieldName]"
                placeholder="formChild.message"
                :disabled="editDisabled"
                @change="groupLinkage(formChild.fieldName)"
              >
                <el-option
                  v-for="options in formChild.cloneValues"
                  :key="options.value"
                  :label="options.name"
                  :value="options.value"
                ></el-option>
              </el-select>
              <el-input
                v-else
                type="text"
                :disabled="editDisabled"
                v-model="editForm[formChild.fieldName]"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item size="large">
            <el-button
              type="primary"
              size="medium"
              :disabled="editDisabled"
              @click="submitEdit('editForm')"
              >确定</el-button
            >
            <el-button size="medium" @click="visible = false">取消</el-button>
          </el-form-item>
        </el-form>
        <el-form
          v-if="formType == 2 || formType == 4"
          ref="checkForm"
          :model="checkForm"
          label-width="120px"
          size="medium"
          :label-position="'left'"
          :rules="checkRules"
          :disabled="stateDisabled && checkDisabled ? true : false"
        >
          <div v-for="formChild in formDatas" :key="formChild.fieldName">
            <el-form-item
              :label="formChild.fieldTitle"
              :prop="formChild.fieldName"
            >
              <el-radio-group
                v-if="formChild.fieldName == 'STATE'"
                v-model="checkForm[formChild.fieldName]"
                size="medium"
                :disabled="stateDisabled"
              >
                <el-radio
                  v-for="formdata in formChild.fieldType.fieldTypeValues"
                  :key="formdata.value"
                  :value="formdata.value"
                  :label="formdata.value"
                  border
                  >{{ formdata.name }}</el-radio
                >
              </el-radio-group>
              <el-input
                v-else-if="formChild.fieldName == 'DESC'"
                type="textarea"
                v-model="checkForm[formChild.fieldName]"
                :disabled="checkDisabled"
              ></el-input>
              <el-select
                v-else-if="formChild.fieldInput == 'select'"
                v-model="checkForm[formChild.fieldName]"
                :placeholder="formChild.fieldTitle"
                @change="groupLinkage(formChild.fieldName)"
                :disabled="checkDisabled"
              >
                <el-option
                  v-for="options in formChild.cloneValues || []"
                  :key="options.value"
                  :label="options.name"
                  :value="options.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item size="large">
            <el-button
              type="primary"
              size="medium"
              @click="submitCheck('checkForm')"
              >确定</el-button
            >
            <el-button size="medium" @click="visible = false">取消</el-button>
          </el-form-item>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
            layout="prev, pager, next, jumper"
            :current-page="page.currentPage"
            :page-count="page.totalPage"
            v-show="formType == 2"
            style="position: absolute; bottom: 0px"
          >
          </el-pagination>
        </el-form>
        <el-form
          v-if="formType == 3"
          ref="imageForm"
          :model="imageForm"
          label-width="150px"
          size="medium"
          :rules="imageRules"
          :label-position="'left'"
        >
          <div v-for="formChild in formDatas" :key="formChild.fieldName">
            <el-form-item
              :label="formChild.fieldTitle"
              :prop="formChild.fieldName"
            >
              <el-select
                v-if="formChild.fieldInput == 'select'"
                v-model="imageForm[formChild.fieldName]"
                placeholder="formChild.message"
              >
                <el-option
                  v-for="options in formChild.cloneValues"
                  :key="options.value"
                  :label="options.name"
                  :value="options.value"
                ></el-option>
              </el-select>
              <el-input
                v-else
                type="text"
                v-model="imageForm[formChild.fieldName]"
              ></el-input>
            </el-form-item>
          </div>
          <el-form-item size="large">
            <el-button
              type="primary"
              size="medium"
              @click="submitImage('imageForm')"
              >确定</el-button
            >
            <el-button size="medium" @click="visible = false">取消</el-button>
            <el-button
              v-show="deleteDisabled"
              type="danger"
              size="medium"
              @click="deleteQuestionTag"
              >删除</el-button
            >
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #reference>
        <div class="footHeaderToggle">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改"
            placement="top"
            :enterable="enterable"
          >
            <el-button
              @click.stop="editImage($event)"
              icon="el-icon-edit-outline"
              title="修改"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="新增质检标记"
            placement="top"
            :enterable="enterable"
          >
            <el-button
              @click.stop="checkImage($event, 'add')"
              icon="el-icon-location"
              v-show="showAddBtn()"
              title="新增质检标记"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="修改质检标记"
            placement="top"
            :enterable="enterable"
          >
            <el-button
              @click.stop="checkImage($event, 'edit')"
              icon="el-icon-map-location"
              v-show="showEditBtn()"
              title="修改质检标记"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="问题标记"
            placement="top"
            :enterable="enterable"
          >
            <el-button
              @click.stop="tagImage()"
              icon="el-icon-add-location"
              title="问题标记"
            ></el-button>
          </el-tooltip>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "contentEdit",
  data() {
    return {
      tagDataEdit: false, //根据质检标记的数量显示质检标记的编辑按钮
      editTagId: null,
      createTagId: 1,
      page: {
        currentPage: 1,
        pageSize: 1,
        totalPage: 1,
      },
      enterable: false,
      //根据用户权限校验：作业员可修改；质检员只读。
      toggleClass: this.hideHeader
        ? "el-icon-caret-top"
        : "el-icon-caret-bottom",
      visible: false,
      deleteDisabled: false, //问题标记是否可删除
      childInstanseTag: this.instanseTag,
      formType: 1,
      popWidth: 400,
      placement: "right",
      formDatas: [],
      editForm: {},
      imageForm: {},
      checkForm: {
        ERROR_TYPE: "",
        ATTRIBUTE: "",
        STATE: "",
        DESC: "",
      },
      ATTRIBUTE_filter: [
        "AREA_FLAG",
        "OPERATOR",
        "SOURCE",
        "SDATE",
        "FLAG",
        "TASK_ID",
        "BATCH",
        "SEQ",
      ],
      editRules: {},
      imageRules: {},
      checkRules: {
        ERROR_TYPE: [
          { required: false, message: "请选择错误类型", trigger: "change" },
        ],
        ATTRIBUTE: [
          { required: false, message: "请选择错误属性", trigger: "change" },
        ],
        STATE: [
          { required: false, message: "请选择标记状态", trigger: "change" },
        ],
        DESC: [{ required: false, message: "请输入内容描述", trigger: "blur" }],
      },
    };
  },
  props: [
    "editId",
    "entity",
    "entityId",
    "editTags",
    "modelName",
    "editDisabled",
    "checkDisabled",
    "stateDisabled",
    "tagDatas",
    "editQuestionTag", //问题标记
  ],
  mounted() {
    this.tagDataEdit = true;
    if (this.tagDatas.length) {
      this.tagDataEdit = true;
    }
  },
  methods: {
    showAddBtn() {
      return !this.checkDisabled;
    },
    showEditBtn() {
      var filterEntity = this.tagDatas.filter((d) => {
        return d.cloneTag.FEATURE_ID == this.entityId;
      });
      return filterEntity.length;
    },
    getInstanse(model) {
      var modelFile = this.$tags[model] || {};
      var fields = modelFile.fields || [];
      return fields;
    },
    // 每次进行属性编辑时，初始化当前编辑界面
    attributeInstanseInit() {
      this.editRules = {};
      this.editForm = {};
      this.formDatas = [];
      var modelAttr = this.$fruit[this.modelName] || {},
        fields = modelAttr.fields || [],
        cloneFields = this.$_.cloneDeep(fields);
      cloneFields.forEach((d) => {
        if (d.display) {
          var trigger = d.fieldInput == "select" ? "change" : "blur";
          var text = d.fieldInput == "select" ? "选择" : "输入";
          var message = "请" + text + d.fieldTitle;

          var defaultValue = this.editTags[d.fieldName] || "";
          this.editForm[d.fieldName] = defaultValue || d.defaultValue || "";
          this.editRules[d.fieldName] = [
            { required: false, message: message, trigger: trigger },
          ];
          d.message = message;
        }
      });
      this.formDatas = cloneFields;
    },
    // 每次进行属性编辑时，初始化当前编辑界面
    questionInstanseInit(modelName) {
      this.imageRules = {};
      this.imageForm = {};
      this.formDatas = [];
      var editTagForm = this.editQuestionTag[this.editId] || {};
      var modelAttr = this.$tags[modelName] || {},
        fields = modelAttr.fields || [],
        cloneFields = this.$_.cloneDeep(fields);

      var formValues = {
        TRACKPOINTID: this.entity.trackPointId || "",
        TRACKID: this.entity.trackId || "",
        CREATEBY: this.$user.name,
        TASKID: window.currentTask.taskId || "",
        PROJECTID: this.entity.autoProjectId || "",
      };

      cloneFields.forEach((d) => {
        // if (d.display) {
        var trigger = d.fieldInput == "select" ? "change" : "blur";
        var text = d.fieldInput == "select" ? "选择" : "输入";
        var message = "请" + text + d.fieldTitle;

        var defaultValue = editTagForm[d.fieldName] || "";
        this.imageForm[d.fieldName] = defaultValue || d.defaultValue || "";
        if (formValues[d.fieldName] && !this.imageForm[d.fieldName]) {
          this.imageForm[d.fieldName] = formValues[d.fieldName];
        }
        this.imageRules[d.fieldName] = [
          { required: false, message: message, trigger: trigger },
        ];
        d.message = message;
        // }
      });
      this.formDatas = cloneFields;
    },
    // 质检标记初始化
    tagInstanseInit() {
      this.formDatas = [];
      var instanseTags = this.getInstanse("QUALITY_TAG");
      instanseTags.forEach((d) => {
        if (d.fieldName == "STATE") {
          this.formDatas[3] = d;
          this.checkForm[d.fieldName] = d.defaultValue || "";
        } else if (d.fieldName == "ERROR_TYPE") {
          this.formDatas[0] = d;
          this.checkForm[d.fieldName] = d.defaultValue || "";
        } else if (d.fieldName == "DESC") {
          this.formDatas[2] = d;
          this.checkForm[d.fieldName] = d.defaultValue || "";
        } else if (d.fieldName == "ATTRIBUTE") {
          d.fieldInput = "select";
          d.fieldType = { fieldTypeValues: [] };
          this.formDatas[1] = d;
          this.checkForm[d.fieldName] = d.defaultValue || "";
        }
      });
    },
    /*
     **级联关系的联动处理**
     *1、传fieldName：
     *****   则查看当前fieldName下是否存在子集关系，并进行更新选项
     *2、不传fieldName：
     *****   则查看当前模型下所有的级联关系，并进行更新所有选项
     */
    groupLinkage(fieldName, type) {
      var $this = this;
      var modelFields = $this.$fruit[$this.modelName] || null;
      var fields = modelFields ? modelFields.fields : [];

      if (fieldName == "ERROR_TYPE") {
        var attrs = this.formDatas.find((d) => {
          return d.fieldName == "ATTRIBUTE";
        });
        if (!["3", "4", "8"].includes($this.checkForm[fieldName] + "")) {
          attrs.cloneValues = [];
        } else {
          attrs.cloneValues =
            fields
              .filter(function (d) {
                return !$this.ATTRIBUTE_filter.includes(d.fieldName);
              })
              .map(function (d) {
                return {
                  name: d.fieldTitle || d.fieldName,
                  value: d.fieldName,
                };
              }) || [];
        }
        if (!type) {
          $this.checkForm["ATTRIBUTE"] = "";
        }
        console.log(this.ATTRIBUTE_filter);
      } else {
        fields.forEach((d) => {
          if (fieldName && d.fieldName != fieldName) {
            return;
          }
          var selectGroup = d.selectGroup || [];
          if (selectGroup.length) {
            var fieldTypeValues = d.fieldType.fieldTypeValues || [];
            var value = $this.editForm[d.fieldName] || d.defaultValue;
            var selectValue = fieldTypeValues.find((s) => {
              return s.value == value;
            });
            for (var i = 0; i < selectGroup.length; i++) {
              $this.groupSelectChange(selectGroup[i], selectValue, fieldName);
            }
          }
        });
      }
    },
    // 级联菜单--子集可选项变化
    groupSelectChange(fieldName, selectValue, f_Name) {
      var fieldSelect = [];
      var field = this.formDatas.find((d) => {
        return d.fieldName == fieldName;
      });
      if (selectValue && selectValue.id) {
        fieldSelect = field.fieldType.fieldTypeValues.filter((d) => {
          return d.parentId == selectValue.id;
        });
      }
      field.cloneValues = fieldSelect;
      if (f_Name) {
        this.editForm[fieldName] = field.defaultValue;
      }
    },
    /*
     **编辑属性面板的处理**
     *1、editImage：
     *****   属性编辑
     *2、checkImage：
     *****   质检标状态编辑
     */
    editImage(e) {
      this.closePopover();
      this.attributeInstanseInit();
      this.groupLinkage();
      if (window.innerWidth - e.clientX < 600) {
        this.placement = "left";
      } else {
        this.placement = "right";
      }
      this.popWidth = 400;
      this.formType = 1;
      this.visible = true;
    },
    // 点击质检标记
    checkImage(e, type) {
      this.closePopover();
      this.page.currentPage = 1;
      this.tagInstanseInit();
      if (type == "add") {
        this.groupLinkage("ERROR_TYPE", true);
        if (window.innerWidth - e.clientX < 500) {
          this.placement = "left";
        } else {
          this.placement = "right";
        }
        this.formType = 4;
        this.visible = true;
      } else {
        this.changeTagEditor();
        if (this.page.totalPage) {
          if (window.innerWidth - e.clientX < 500) {
            this.placement = "left";
          } else {
            this.placement = "right";
          }
          this.popWidth = 400;
          this.formType = 2;
          this.visible = true;
        } else if (!this.page.totalPage && this.tagDatas.length) {
          this.visible = false;
          this.$notify({
            title: "提示",
            message: "未匹配到质检标记",
            type: "warning",
          });
        }
      }
    },
    // 问题标记--点击按钮
    tagImage() {
      this.closePopover();
      // if (this.checkDisabled) {
      //   this.$notify({
      //     title: "提示",
      //     message: "当前用户不是质检员！",
      //     type: "warning",
      //   });
      //   return;
      // }
      this.questionInstanseInit("QUESTION_TAG");
      if (this.editQuestionTag[this.editId]) {
        this.deleteDisabled = true;
      }
      this.formType = 3;
      this.visible = true;
    },
    closePopover() {
      var popover = document.querySelector(
        ".el-popper.editPopover[aria-hidden=false]"
      );
      if (popover) {
        var button = popover.getElementsByClassName("el-button--default")[0];
        if (button) {
          button.click();
        }
      }
    },
    // 属性栏编辑分页监听
    handleSizeChange(val) {
      this.page.currentPage = val;
      this.submitCheck("checkForm", true);
      this.changeTagEditor();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.submitCheck("checkForm", true);
      this.changeTagEditor();
    },
    // 质检标记不同分页,其中的属性改变时
    changeTagEditor() {
      var f_id = this.entityId;
      // var f_id = "28";
      var thisData = this.tagDatas.filter((d) => {
        return d.cloneTag.FEATURE_ID == f_id;
      });
      var pageData = thisData[this.page.currentPage - 1];
      this.page.totalPage = thisData.length;
      if (pageData) {
        this.editTagId = pageData.id;
      }
      for (var item in this.checkForm) {
        if (pageData) {
          // this.checkForm[item] =
          //   pageData.cloneTag[item] || this.checkForm[item];
          this.checkForm[item] = pageData.cloneTag[item] || "";
        }
      }
      this.groupLinkage("ERROR_TYPE", true);
    },
    changeTagEditorForm(u_id, properties) {
      if (u_id && u_id == this.editTagId) {
        for (var item in properties) {
          this.checkForm[item] = properties[item];
        }
      }
    },
    // 模型属性面板--点击确定
    submitEdit(formName) {
      var $this = this;
      $this.$refs[formName].validate((valid) => {
        if (valid) {
          $this.visible = false;
          $this.$emit("editList", $this.editId, $this.editForm);
        } else {
          return false;
        }
      });
    },
    // 质检标记属性面板--点击确定
    submitCheck(formName, type) {
      var $this = this;
      $this.$refs[formName].validate((valid) => {
        if (valid) {
          if ($this.formType == 4) {
            var createId = $this.editId + "_tag_" + $this.createTagId;
            $this.$emit(
              "checkListCreate",
              createId,
              $this.checkForm,
              $this.entityId
            );
            $this.visible = false;
            $this.createTagId++;
          } else {
            $this.$emit(
              "checkList",
              $this.editTagId,
              $this.checkForm,
              $this.entityId
            );
            if (this.page.currentPage == this.page.totalPage && !type) {
              $this.visible = false;
            } else if (!type) {
              this.page.currentPage++;
              this.changeTagEditor();
            }
          }
        } else {
          return false;
        }
      });
    },
    // 问题标记属性面板--点击确定
    submitImage(formName) {
      var $this = this;
      $this.$refs[formName].validate((valid) => {
        if (valid) {
          $this.visible = false;
          $this.$emit("tagImage", $this.editId, $this.imageForm);
        } else {
          return false;
        }
      });
    },
    deleteQuestionTag() {
      this.$emit("tagImageDelete", this.editId);
      this.visible = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.contentEdit {
  float: left;
  margin: 0 auto;
  padding: 0px;
  position: absolute;
  right: 5px;
  bottom: 35px;
  width: auto;
  z-index: 10;
}
.contentEdit .footHeaderToggle button {
  background-color: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(58, 142, 230, 0);
  min-height: 20px;
  padding: 5px;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}
.contentEdit .footHeaderToggle button:focus,
.contentEdit .footHeaderToggle button:hover {
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
  padding-right: 0px;
}
.el-popover .el-form {
  padding-right: 15px;
  overflow-x: hidden;
}
.el-popover p {
  font-weight: bold;
  margin: 5px 0px;
}
.el-popover .el-form .el-select {
  width: 100%;
}
</style>
