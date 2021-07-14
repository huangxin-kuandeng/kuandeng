<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
      	 <!--@tab-click="handleClick"-->
			  <el-tabs value="KDS" @tab-click="appTabClick">
			    <el-tab-pane label="KTS" name="KTS"></el-tab-pane>
			    <el-tab-pane label="KMS" name="KMS"></el-tab-pane>
			    <el-tab-pane label="KCS" name="KCS"></el-tab-pane>
			    <el-tab-pane label="KDS" name="KDS"></el-tab-pane>
			  </el-tabs>
      </el-row>
    </h3>

    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
      	<!--draggable-->
				<el-tree
				  :data="menuTree"
				  node-key="id"
				  ref="groupTree"
				  :props="defaultProps"
				  @node-click="nodeClick"
				  :expand-on-click-node="false"
				  v-loading="treeLoading"
				  :allow-drag="allowDrag">
		      <span class="custom-tree-node" slot-scope="{ node, data }">
		        <span style="float: left;">{{ node.label }}</span>
		        <span style="float: right;">
		          <el-button
		            type="text"
		            size="mini"
		            style="color:#67c23a;"
		            title="当前组下新建一个组"
		            @click="() => appendGroup(data,1)">
								新增
		          </el-button>
		          <el-button
		            type="text"
		            size="mini"
		            style="color:#67c23a;"
		            title="当前组下新建一个组"
		            @click="() => appendGroup(data)">
								修改
		          </el-button>
		          <el-button
		            type="text"
		            style="color:#f56c6c;"
		            size="mini"
		            title="删除当前组"
		            @click="() => GroupDelete(node, data)">
								删除
		          </el-button>
		        </span>
		      </span>
				</el-tree>
      </el-col>
      <el-col :span="18" :xs="24" :sm="24" :md="18" :lg="18">
        <h4 class="tableTitle">{{tableTitle}}</h4>
				<el-tabs type="border-card" tab-position="left" style="height: 700px;">
				  <el-tab-pane label="用户列表">
				    <el-transfer
				      style="text-align: left; display: inline-block"
    					:props="{key: 'id',label: 'name'}"
				      filterable
				      target-order="unshift"
				      v-model="userData.rightRow"
				      filter-placeholder="请输入用户名"
				      @change="userHandleChange"
				      v-loading="userLoading"
					    element-loading-text="未选择相关组或其他错误"
					    element-loading-spinner="el-icon-loading"
				      :titles="userTitle"
				      :data="userData.rows">
				    	<span slot-scope="{ option }">
				    		<span>{{ option.loginName }} ： </span>
				    		<span style="margin-left: 10px;">{{ option.name }}</span>
				    	</span>
				    </el-transfer>
						<el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width=30%>
						  <el-form :model="createForm" ref="createForm" label-position="left">
						    <el-form-item label="组名" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '组名不能为空'}]">
						      <el-input v-model="createForm.name" autocomplete="off"></el-input>
						    </el-form-item>
						    <el-form-item label="英文名称" :label-width="formLabelWidth">
						      <el-input v-model="createForm.ename" autocomplete="off"></el-input>
						    </el-form-item>
						    <el-form-item label="描述" :label-width="formLabelWidth">
						      <el-input v-model="createForm.remarks" autocomplete="off"></el-input>
						    </el-form-item>
						  </el-form>
						  <div slot="footer" class="dialog-footer">
						    <el-button @click="dialogFormVisible = false">取 消</el-button>
						    <el-button type="primary" @click="addUserGroup('createForm')">确 定</el-button>
						  </div>
						</el-dialog>
				  </el-tab-pane>
				  <el-tab-pane label="权限列表">
				    <el-transfer
				      style="text-align: left; display: inline-block"
    					:props="{key: 'id',label: 'name'}"
				      filterable
				      target-order="unshift"
				      v-model="roleData.rightRow"
				      @change="roleHandleChange"
				      filter-placeholder="请输入权限名"
				      v-loading="roleLoading"
					    element-loading-text="未选择相关组或其他错误"
					    element-loading-spinner="el-icon-loading"
				      :titles="roleTitle"
				      :data="roleData.rows">
				    	<span slot-scope="{ option }">
				    		<span style="margin-left: 10px;">{{ option.name }}</span>
				    	</span>
				    </el-transfer>
				  </el-tab-pane>
				</el-tabs>
      </el-col>
    </el-row>

  </imp-panel>
</template>

<script>
  import * as api from "../../api"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'

  export default {
    data(){
      return {
//    	穿梭框
      	userTitle: ['用户列表', '组内用户'],
      	userLoading: true,
      	roleTitle: ['权限列表', '组内权限'],
      	roleLoading: true,
      	
      	currentAppId: 'KDS',
        currentRow: {},
        menuTree: [],
        treeLoading: false,
        tableTitle: '关联列表',
        defaultProps: {
          children: 'childGroup',
          label: 'name',
          id: "id"
        },
		   	userChangeType: '',
//			弹窗
		   	formLabelWidth: '80px',
		   	formTitle: '新增权限组',
		   	dialogFormVisible: false,
		   	createForm: {
		   		name: '',
		   		ename: '',
		   		remarks: '',
		   		parentId: '',
		   		id: ''
		   	},
        searchKey: '',
        roleData: {
        	rows: [],
        	rightRow: []
        },
        userData: {
        	rows: [],
        	rightRow: []
        }
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
//    切换标签--appId时执行
      appTabClick(data){
      	this.currentAppId = data.name;
      	this.$message.success('切换成功：'+data.name);
      	this.roleLoading = true;
      	this.userLoading = true;
	      this.loadData();
	      this.loadUserData();
	      this.loadRoleData();
      },
//    新增/修改数据权限组模版
      appendGroup(data={}, type){
      	for(var name in this.createForm){
      		this.createForm[name] = (data[name] && !type) ? data[name] : '';
      	}
      	this.createForm['parentId'] = data['id'] || '';
      	if(this.$refs && this.$refs.createForm){
      		this.$refs.createForm.clearValidate();
//    		this.$refs.createForm.resetFields();
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      	
      	let _headTitle = data.name || data.id || '第一级';
      	this.formTitle = '新增数据权限组（'+_headTitle+'）';
      	if(data.id && !type){
      		this.createForm['parentId'] = data['parentId'] || '';
      		this.userChangeType = true;
      		this.formTitle = '修改数据权限组（'+_headTitle+'）';
      	}
      },
//    校验数据权限组的新增与修改
      addUserGroup(formName){
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
//    新增/修改数据权限组
      submitAdd(){
      	let _dataRoleUrl = this.userChangeType ? api.SYS_GROUP_UPDATE : api.SYS_GROUP_ADD;
        this.$http.post(_dataRoleUrl, this.createForm)
          .then(res => {
          	let _type = 'error';
          	if(res.data && res.data.code=='0'){
          		_type = 'success';
	          	if(this.userChangeType && this.currentRow){
	          		this.currentRow.name = this.createForm.name;
	          	}
          	}
	          this.$message({
	            type: _type,
	            message: res.data.message
	          });
          }).catch(err=>{
		        this.$message.error('系统异常!');
					})
      },
      GroupDelete(index, row){
        this.$confirm('此操作将永久删除该组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.submitDelete(row);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
      submitDelete(row){
        this.$http.post(api.SYS_GROUP_DELETE+"?id="+row.id, {})
          .then(res => {
          	let _type = 'error';
          	if(res.data && res.data.code=='0'){
          		_type = 'success';
      				this.$refs && this.$refs.groupTree.remove(row.id);
//	          this.loadData();
          	}
	          this.$message({
	            type: _type,
	            message: res.data.message
	          });
          }).catch(err=>{
          	this.$message.error('系统异常!');
					})
      },
//    向组内添加数据权限及用户的操作
      groupHandleChange(param){
        this.$http.post(param.url, {}).then(res => {
        	let _type = 'success';
        	if(!res.data || res.data.code!='0'){
        		_type = 'error';
        		this[param.loading] = true;
        	}
          this.$message({
            type: _type,
            message: res.data.message
          });
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
      loadData(){
      	this.treeLoading = true;
        sysApi.groupList({
//        pageSize: 99999,
//        pageNumber: 1
        }).then(res => {
      		this.treeLoading = false;
        	if(res.code == '0'){
          	this.menuTree = res.result || [];
        	}else{
          	this.$message.error(res.message);
        	}
        });
      },
			
//		关联--用户
      userHandleChange(value, direction, movedKeys){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('获取组ID失败，当前操作均无效');
      		return;
      	}
      	var groupId = this.currentRow.id,
      		ids = JSON.stringify(movedKeys),
      		
      		_url = api.SYS_GROUP_USER_DELETES + '?groupId=' + groupId + '&userIds=' + ids,
      		param = {
	      		'url': _url,
	      		'loading': 'userLoading'
	      	};
      	if(direction == 'right'){		//添加权限
      		param.url = api.SYS_USER_TO_GROUP + "?groupId=" + groupId + '&userIds=' + ids;
      	}
      	this.groupHandleChange(param);
      },
      loadUserData(){
        sysApi.userList({
          pageSize: 99999,
          pageNum: 1
        }).then(res => {
        	if(!res || res.code != '0'){
	          this.$message.error(res.message);
	          return;
        	}
          this.userData.rows = res.result.list || [];
        });
      },
//    获取当前组内的用户
      getCatchUser(){
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_FIND_GROUP_USER+"?groupId="+_groupId;
        this.$http.get(_url, {}).then(res => {
        	this.userData.rightRow = [];
    			this.userLoading = false;
    			if(!res || !res.data || res.data.code!='0'){
    				let _message = (res && res.data) ? res.data.message : '查询组下用户失败';
    				this.$message.error(_message);
    			}
      		for(var i=0; i<res.data.result.length; i++){
      			this.userData.rightRow.push( res.data.result[i].id || '' );
      		}
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
      
      
//    权限与组
      roleHandleChange(value, direction, movedKeys){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('获取组ID失败，当前操作均无效');
      		return;
      	}
      	var groupId = this.currentRow.id,
      		ids = JSON.stringify(movedKeys),
      		_url = api.SYS_GROUP_ROLE_DELETES + '?groupId=' + groupId + '&permissionIds=' + ids,
      		param = {
	      		'url': _url,
	      		'loading': 'roleLoading'
	      	};
      	if(direction == 'right'){		//添加权限
      		param.url = api.SYS_ROLE_TO_GROUP + "?groupId=" + groupId + '&permissionIds=' + ids;
      	}
      	this.groupHandleChange(param);
      },
      loadRoleData(){
        sysApi.permissionList({
          pageSize: 99999,
          pageNumber: 1
        }).then(res => {
        	if(!res || res.code != '0'){
	          this.$message.error(res.message);
	          return;
        	}
          this.roleData.rows = res.result.list || [];
        });
      },
      getCatchRole(){
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_FIND_GROUP_ROLE+"?groupId="+_groupId;
        this.$http.get(_url, {}).then(res => {
        	this.roleData.rightRow = [];
    			this.roleLoading = false;
    			if(!res || !res.data || res.data.code!='0'){
    				let _message = (res && res.data) ? res.data.message : '查询组下用户失败';
    				this.$message.error(_message);
    				return;
    			}
      		for(var i=0; i<res.data.result.length; i++){
      			this.roleData.rightRow.push( res.data.result[i].id || '' );
      		}
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
//    树形tree结构操作
      nodeClick(data){		//节点点击操作
      	this.currentRow = data;
    		this.multipleSelectionAll = {
	      	user: [],
	      	role: []
	      };
				this.tableTitle = '组：'+(data.name || '');
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('当前组ID查询失败');
      		return;
      	}
				this.getCatchUser();
				this.getCatchRole();
      },
      allowDrag(draggingNode) {		//节点拖拽操作
        return draggingNode.childNodes.length === 0;
      }
      
    },
    created(){
      this.loadData();
      this.loadUserData();
      this.loadRoleData();
    }
  }
</script>
<style>
	.content .box>.box-header{
		padding-top: 5px;
		padding-bottom: 0px;
	}
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
	.el-tree{
		border: 1px solid #EBEEF5;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 700px !important;
    padding: 5px;
    overflow-x: auto;
	}
	.tableTitle {
	  padding: 5px 0px;
	}
	.custom-tree-node{
		width: 100%;
		line-height: 200%;
	}
	.el-button.saveBtn{
		color: #67C23A;
	}
	.el-transfer .el-transfer-panel{
		height: 650px;
		width: 400px;
	}
	.el-transfer .el-transfer-panel .el-transfer-panel__body .el-transfer-panel__list{
		height: 550px;
	}
	.el-transfer .el-transfer-panel .el-transfer-panel__body .el-transfer-panel__list>label{
		display: block;
		
	}
	
</style>
