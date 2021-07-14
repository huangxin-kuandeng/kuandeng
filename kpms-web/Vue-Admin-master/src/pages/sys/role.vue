<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="24">
          <el-button type="primary" icon="plus" @click="addBtnClick">新增</el-button>
          <el-form :inline="true" :model="searchForm" class="demo-form-inline searchForm">
					  <el-form-item label="名称">
					    <el-input v-model="searchForm.name" placeholder="角色名称"></el-input>
					  </el-form-item>
					  <el-form-item label="英文名">
					    <el-input v-model="searchForm.enname" placeholder="角色英文名称"></el-input>
					  </el-form-item>
					  <el-form-item label="用户登录名">
					    <el-input v-model="searchForm.loginName" placeholder="用户登录名"></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="onSubmit">查询</el-button>
					  </el-form-item>
					</el-form>
        </el-col><!--
        <el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search" style="position: absolute;right: 0px;z-index: 99;"></i>
            <input type="text" placeholder="输入用户角色名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="position: absolute;right: 0px;z-index: 10;">
          </div>
        </el-col>-->
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        max-height="700"
        :data="tableData"
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
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="enname"
          label="英文名称">
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
					  <el-button size="small" title="编辑角色信息" type="primary" @click="addBtnClick(scope.$index, scope.row)">编辑</el-button>
					  <el-button size="small" title="删除当前角色" type="danger" @click="userRoleDelete(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
        </el-table-column>
      </el-table>
			<el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width=30%>
			  <el-form :model="createForm" ref="createForm" label-position="left">
			    <el-form-item label="角色名：" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '角色名不能为空'}]">
			      <el-input v-model="createForm.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="角色英文名：" :label-width="formLabelWidth" prop="enname" :rules="[{ required: true, message: '角色英文名不能为空'}]">
			      <el-input v-model="createForm.enname" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item class="menuList" label="资源菜单：" :label-width="formLabelWidth">
			      <el-tree
						  :data="menuData"
						  show-checkbox
						  node-key="id"
  						ref="menuTree"
						  @check="checkChange"
						  :props="defaultProps">
						</el-tree>
			    </el-form-item>
			    <el-form-item label="备注：" :label-width="formLabelWidth">
			      <el-input v-model="createForm.remarks" autocomplete="off"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addUserGroup('createForm')">确 定</el-button>
			  </div>
			</el-dialog>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
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
        menuData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      	
        currentRow: {},
        dialogVisible: false,
        childLoading: false,
        fatherLoading: false,
        dialogLoading: false,
        roleTree: [],
		   	userChangeType: '',
//			弹窗
		   	formLabelWidth: '120px',
		   	formTitle: '新增用户角色',
		   	dialogFormVisible: false,
		   	createForm: {
		   		id: '',
		   		name: '',
		   		remarks: '',
		   		menuIdList: '',
		   		enname: ''
		   	},
        expands: [],
        searchKey: '',
        tableData: [],
        pageNum: 1,
        searchForm: {
        	name: '',
        	enname: '',
        	loginName: ''
        },
        total: 0,
        pageSize: 10
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
      onSubmit(){
        this.loadData();
      },
      getRoleInfo(id){
      	if(id){
	        this.$http.get(api.SYS_MENU_GET+"?roleId="+id)
	          .then(res => {
	          	if(!res || !res.data || res.data.code!='0'){
		          	this.$message.error(res.data.message);
		          	return;
	          	}
	          	this.createForm.menuIdList = res.data.result.menuIdList || [];
	          	this.$refs.menuTree.setCheckedKeys( this.createForm.menuIdList );
	          }).catch(err=>{
			        this.$message.error('系统异常!');
						})
      	}
      },
      checkChange(value,data){
      	this.createForm.menuIdList = data.checkedKeys;
      },
      
      addBtnClick(index, row={}){
      	this.createForm.menuIdList = [];
      	for(var name in this.createForm){
      		if(name == 'menuIdList'){
      			this.createForm[name] = row[name] || [];
      		}else{
      			this.createForm[name] = row[name] || '';
      		}
      	}
      	if(this.$refs && this.$refs.createForm){
      		this.$refs.createForm.clearValidate();
	        this.$refs.menuTree.setCheckedKeys([]);
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      	this.formTitle = '新增用户角色';
      	if(row.name){
      		this.userChangeType = true;
      		this.formTitle = '修改用户角色（'+row.name+'）';
      		this.getRoleInfo(row.id);
      	}
      },
      addUserGroup(formName){
      	let that = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
          	that.submitAddUserGroup();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitAddUserGroup(){
//    	debugger
        this.dialogFormVisible = false;
        let _type = this.userChangeType ? '修改' : '新增';
        this.$http.post(api.SYS_ROLE_ADD, this.createForm)
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
          	this.$message.error('系统异常');
					})
      },
//    删除角色
      userRoleDelete(index, row){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.submitDelete(row.id);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
//    确认删除角色提交
      submitDelete(id){
        this.$http.get(api.SYS_ROLE_DELETE+"?roleId="+id)
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
//        sysApi.roleList({selectChildren:true})
          sysApi.roleList()
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
        this.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.loadData();
      },
      loadMenu(){
        sysApi.menuList({}).then(res => {
        	if(!res || res.code!='0'){
        		let _message = (res && res.message) ? res.message : '系统异常';
	          this.$message.error(_message);
        	}
        	let _data = (res && res.result) ? res.result : [];
          this.menuData = _data;
        });
      },
      loadData(){
      		this.fatherLoading = true;
          sysApi.roleList({
//          key: this.searchKey,
            name: this.searchForm.name,
            enname: this.searchForm.enname,
            loginName: this.searchForm.loginName,
            pageSize: this.pageSize,
            pageNum: this.pageNum
          })
          .then(res => {
            this.fatherLoading = false;
          	if(!res || res.code != '0'){
          		let _message = (res && res.message) ? (res.message) : '系统异常';
              this.$message.error(_message);
              return;
          	}
            this.tableData = res.result.list || [];
            this.total = res.result.total || 0;
          });
      }
    },
    created(){
      this.loadData();
      this.loadMenu();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
	.el-tree{
		border: 1px solid #EBEEF5;
    height: 300px;
    padding: 5px;
    overflow-x: auto;
	}
	.menuList .el-dialog__body .el-checkbox{
		width: auto;
		margin-right: 8px;
	}
  .searchForm{
  	float: left;
  }
</style>
