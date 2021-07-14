<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="addBtnClick">新增</el-button>
        </el-col><!--
        <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search" style="position: absolute;right: 0px;z-index: 99;"></i>
            <input type="text" placeholder="输入数据权限名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="position: absolute;right: 0px;z-index: 10;">
          </div>
        </el-col>-->
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        max-height="700"
        style="width: 100%"
        v-loading="fatherLoading"
        border>
        <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="appId"
          label="appId">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标记">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间">
        </el-table-column>
        <!--<el-table-column
          label="状态">
          <template slot-scope="scope">
            {{ scope.row.status===1 ? '已激活' : '未激活' }}
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="285">
					<el-button-group slot-scope="scope">
					  <el-button size="small" title="更新权限信息" type="primary" @click="addBtnClick(scope.$index, scope.row)">编辑</el-button>
					  <el-button size="small" title="删除当前权限" type="danger" @click="permissionDelete(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
        </el-table-column>
      </el-table>
			<el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width=30%>
			  <el-form :model="createForm" ref="createForm" label-position="left">
			    <el-form-item label="appID" :label-width="formLabelWidth" prop="appId" :rules="[{ required: true, message: 'appID不能为空'}]">
			      <el-input v-model="createForm.appId" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="权限名" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '数据权限名不能为空'}]">
			      <el-input v-model="createForm.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="标记" :label-width="formLabelWidth" prop="tag">
			      <el-input v-model="createForm.tag" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="类型" :label-width="formLabelWidth" prop="type">
			      <el-input v-model="createForm.type" autocomplete="off"></el-input>
			    </el-form-item>
			    <!--<el-form-item label="状态" :label-width="formLabelWidth">
			      <el-select v-model="createForm.state" placeholder="请选择数据权限状态">
			        <el-option label="区域一" value="shanghai"></el-option>
			        <el-option label="区域二" value="beijing"></el-option>
			      </el-select>
			    </el-form-item>-->
			    <el-form-item label="描述" :label-width="formLabelWidth">
			      <el-input v-model="createForm.remarks" autocomplete="off"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addDataRole('createForm')">确 定</el-button>
			  </div>
			</el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNumber"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>
    </div>
  </imp-panel>
</template>
<script>
  import * as api from "../../api"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'

  export default {
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        childLoading: false,
        fatherLoading: false,
        dialogLoading: false,
        roleTree: [],
		   	userChangeType: '',
//			弹窗
		   	formLabelWidth: '80px',
		   	formTitle: '新增数据权限',
		   	dialogFormVisible: false,
		   	createForm: {
		   		appId: '',
		   		name: '',
		   		id: '',
		   		remarks: '',
		   		tag: '',
		   		type: ''
		   	},
        expands: [],
        searchKey: '',
        tableData: {
          pagination: {
            total: 0,
            pageNumber: 1,
            pageSize: 10,
            hasChildren: true,
            parentId: 0
          },
          rows: [],
          childrens: []
        }
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
      addBtnClick(index, row={}){
      	for(var name in this.createForm){
      		this.createForm[name] = row[name] || '';
      	}
      	if(this.$refs && this.$refs.createForm){
      		this.$refs.createForm.clearValidate();
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      	this.formTitle = '新增数据权限';
      	if(row.id){
      		this.userChangeType = true;
      		this.formTitle = '修改数据权限（'+(row.name || '')+'）';
      	}
      },
      addDataRole(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.dialogFormVisible = false;
          	this.submitAdd();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitAdd(){
      	let _dataRoleUrl = this.userChangeType ? api.SYS_PERMISSION_UPDATE : api.SYS_PERMISSION_ADD;
        this.$http.post(_dataRoleUrl, this.createForm)
          .then(res => {
          	let _type = 'error';
          	if(res.data && res.data.code=='0'){
          		_type = 'success';
	          	this.loadData();
          	}
	          this.$message({
	            type: _type,
	            message: res.data.message
	          });
          }).catch(err=>{
		        this.$message.error('系统异常!');
					})
      },
      permissionDelete(index, row){
        this.$confirm('此操作将永久删除该数据权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.submitDelete(row.id);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      submitDelete(id){
        this.$http.post(api.SYS_PERMISSION_DELETE+"?id="+id)
          .then(res => {
          	let _type = 'error';
          	if(res.data && res.data.code=='0'){
          		_type = 'success';
	          	this.loadData();
          	}
	          this.$message({
	            type: _type,
	            message: res.data.message
	          });
          }).catch(err=>{
		        this.$message.error('系统异常!');
					})
      },
      handleRoleConfig(index, row){
        this.currentRow = row;
        this.dialogVisible = true;
        if (this.roleTree.length <= 0) {
          sysApi.roleList({selectChildren:true})
            .then(res => {
              this.roleTree = res
            })
        }
        this.$http.get(api.SYS_USER_ROLE + "?id=" + row.id)
          .then(res => {
            this.$refs.roleTree.setCheckedKeys(res.data);
          }).catch(err=>{

        })
      },
      configUserRoles(){
        let checkedKeys = this.$refs.roleTree.getCheckedKeys();
          this.$http.get(api.SYS_SET_USER_ROLE + "?userId=" + this.currentRow.id + "&roleIds="+checkedKeys.join(','))
          .then(res => {
              this.$message('修改成功');
              this.dialogVisible = false;
          })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNumber = val;
        this.loadData();
      },
      loadData(){
      		this.fatherLoading = true;
          sysApi.permissionList({
//          key: this.searchKey,
            pageSize: this.tableData.pagination.pageSize,
            pageNumber: this.tableData.pagination.pageNumber
          })
          .then(res => {
            this.tableData.rows = res.result.list || [];
            this.tableData.pagination.total = res.result.total || 0;
            this.fatherLoading = false;
          });
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
</style>
