<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
      	 <!--@tab-click="handleClick"-->
			  <el-tabs v-model="first" type="card">
			    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
			    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
			    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
			    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
			  </el-tabs>
      </el-row>
    </h3>

    <el-row slot="body" :gutter="24" style="margin-bottom: 20px;">
      <el-col :span="6" :xs="24" :sm="24" :md="6" :lg="6" style="margin-bottom: 20px;">
      	<!--draggable-->
				<el-tree
				  :data="menuTree"
				  node-key="id"
				  :props="defaultProps"
				  @node-click="nodeClick"
				  :expand-on-click-node="false"
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
				      v-model="userData.rightRow"
				      :titles="transferTitle"
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
				  	<el-button type="text" class="saveBtn" title="保存当前权限到组内" @click="saveRoleToGroup">保存当前权限到组内</el-button>
			      <el-table
			        :data="roleData.rows"
			        ref="roleTable"
			        max-height="700"
			        style="width: 100%"
			        v-loading="fatherLoading"
			        @select-all="roleSelectionChange"
			        @select="roleSelectionChange"
			        border>
			        <el-table-column
			          prop="id"
			          type="selection"
			          width="50"
			          selected>
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
			      </el-table>
			      <el-pagination
			        @size-change="roleSizeChange"
			        @current-change="roleCurrentChange"
			        :current-page="roleData.pageNumber"
			        :page-sizes="[5, 10, 20]"
			        :page-size="roleData.pageSize"
			        layout="total, sizes, prev, pager, next, jumper"
			        :total="roleData.total">
			      </el-pagination>
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
      	transferTitle: ['用户列表', '组内用户'],
      	
      	
	      multipleSelectionAll: {
	      	user: [],
	      	role: []
	      }, // 所有选中的数据包含跨页数据
	      multipleSelection: {
	      	user: [],
	      	role: []
	      }, // 当前页选中的数据
	      idKey: "id", // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      	
      	
        currentRow: {},
        menuTree:[],
        
        tableTitle: '关联列表',
        fatherLoading: false,
        defaultProps: {
          children: 'childGroup',
          label: 'name',
          id: "id"
        },
		   	userChangeType: '',
//			数据权限组变更时,重置当前右侧列表的选择
				groupDatas: null,
		   	groupUsers: {},
		   	groupCatchUsers: {},
		   	groupRoles: {},
		   	groupCatchRoles: {},
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
        expands: [],
        searchKey: '',
        roleData: {
        	rows: [],
        	rightRow: [],
          total: 0,
          pageNumber: 1,
          pageSize: 10
        },
        userData: {
        	rows: [],
        	rightRow: [],
          total: 0,
          pageNumber: 1,
          pageSize: 10
        }
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
//    新增/修改数据权限组模版
      appendGroup(data={}, type){
      	this.groupDatas = data;
      	for(var name in this.createForm){
      		this.createForm[name] = (data[name] && !type) ? data[name] : '';
      	}
      	this.createForm['parentId'] = data['parentId'] || data['id'] || '';
      	if(this.$refs && this.$refs.createForm){
      		this.$refs.createForm.clearValidate();
//    		this.$refs.createForm.resetFields();
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      	
      	let _headTitle = data.name || data.id || '第一级';
      	this.formTitle = '新增数据权限组（'+_headTitle+'）';
      	if(data.id && !type){
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
      GroupDelete(index, row){
        this.$confirm('此操作将永久删除该组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.submitDelete(row.id);
        }).catch(() => {
          this.$message.info(已取消删除);
        });
      },
      submitDelete(id){
        this.$http.post(api.SYS_GROUP_DELETE+"?id="+id, {})
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
      loadData(){
        sysApi.groupList({
//        pageSize: 99999,
//        pageNumber: 1
        }).then(res => {
        	if(res.code == '0'){
          	this.menuTree = res.result || [];
        	}else{
          	this.$message.error(res.message);
        	}
        });
      },
      
      
	    // 设置选中的方法
	    setSelectRow(type) {
	    	var _stateType = (type == 'user') ? 'userTable' : 'roleTable',
	    		_dataType = (type == 'user') ? 'userData' : 'roleData';
	      if (!this.multipleSelectionAll[type] || this.multipleSelectionAll[type].length <= 0) {
	        return;
	      }
	      // 标识当前行的唯一键的名称
	      let idKey = this.idKey;
	      let selectAllIds = [];
	      let that = this;
	      this.multipleSelectionAll[type].forEach(row => {
	        selectAllIds.push(row[idKey]);
	      });
	      this.$refs[_stateType].clearSelection();
	      for (var i = 0; i < this[_dataType].rows.length; i++) {
	        if (selectAllIds.indexOf(this[_dataType].rows[i][idKey]) >= 0) {
	          // 设置选中，记住table组件需要使用ref="userTable"
	          this.$refs[_stateType].toggleRowSelection(this[_dataType].rows[i], true);
	        }
	      }
	    },
      changePageCoreRecordData(type){
	    	let _dataType = (type == 'user') ? 'userData' : 'roleData';
        // 标识当前行的唯一键的名称
        let idKey = this.idKey;
        let that = this;
        // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
        if (this.multipleSelectionAll[type].length <= 0) {
          this.multipleSelectionAll[type] = this.multipleSelection[type];
          return;
        }
        // 总选择里面的key集合
        let selectAllIds = [];
        this.multipleSelectionAll[type].forEach(row=>{
          selectAllIds.push(row[idKey]);
        })
        let selectIds = [];
        // 获取当前页选中的id
        this.multipleSelection[type].forEach(row=>{
          selectIds.push(row[idKey]);
          // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
          if (selectAllIds.indexOf(row[idKey]) < 0) {
            that.multipleSelectionAll[type].push(row);
          }
        })
        let noSelectIds = [];
        // 得到当前页没有选中的id
        this[_dataType].rows.forEach(row=>{
          if (selectIds.indexOf(row[idKey]) < 0) {
            noSelectIds.push(row[idKey]);
          }
        })
        noSelectIds.forEach(id=>{
          if (selectAllIds.indexOf(id) >= 0) {
            for(let i = 0; i< that.multipleSelectionAll[type].length; i ++) {
              if (that.multipleSelectionAll[type][i][idKey] == id) {
                // 如果总选择中有未被选中的，那么就删除这条
                that.multipleSelectionAll[type].splice(i, 1);
                break;
              }
            }
          }
        })
      },
//    加载用户列表
			userSelectionChange(val){
// 			table组件选中事件,记得加上@selection-change="handleSelectionChange"
				this.multipleSelection['user'] = val;
			},
			
      userSizeChange(val) {
      	this.changePageCoreRecordData('user');
        this.userData.pageSize = val;
        this.loadUserData();
      },
      userCurrentChange(val) {
      	this.changePageCoreRecordData('user');
        this.userData.pageNumber = val;
        this.loadUserData();
      },
      loadUserData(){
    		this.fatherLoading = true;
        sysApi.userList({
          pageSize: 99999,
          pageNum: this.userData.pageNumber
//        this.userData.pageSize
        }).then(res => {
    			this.fatherLoading = false;
        	if(!res || res.code != '0'){
	          this.$message.error(res.message);
	          return;
        	}
          this.userData.rows = res.result || [];
          this.userData.total = res.total || 99999;
        }).then(res => {
        	this.setSelectRow('user');
        });
      },
//    获取当前组内的用户
      getCatchUser(){
    		this.fatherLoading = true;
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_FIND_GROUP_USER+"?groupId="+_groupId;
        this.$http.get(_url, {}).then(res => {
        	this.userData.rightRow = [];
    			this.fatherLoading = false;
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
//    保存用户至组内
      saveUserToGroup(){
      	let _users = [];
      	for(var i=0; i<this.multipleSelectionAll.user.length; i++){
      		_users.push( this.multipleSelectionAll.user[i].id );
      	}
      	var _confirm = '将'+_users.length+'个用户添加到当前组, 是否继续?',
      		_strUser = JSON.stringify(_users);
        this.$confirm(_confirm, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.deleteGroupAllUser(_strUser);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
//    保存用户到组内时,先进行删除用户的操作
      deleteGroupAllUser(_strUser){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('未选择相关权限组');
      		return;
      	}
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_GROUP_USER_DELETE+"?id="+_groupId;
        this.$http.post(_url, {}).then(res => {
        	if(!res || !res.data || res.data.code!='0'){
        		this.$message.error('用户关联组失败');
        		return;
        	}
        	this.submitSaveUserToGroup(_strUser);
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
//    确认保存用户至组内
      submitSaveUserToGroup(str){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('未选择相关权限组');
      		return;
      	}
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_USER_TO_GROUP+"?goupId="+_groupId+'&userIdJson='+str;
        this.$http.post(_url, {}).then(res => {
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
      
      
//    权限与组
			roleSelectionChange(val){
				this.multipleSelection['role'] = val;
			},
      roleSizeChange(val) {
      	this.changePageCoreRecordData('role');
        this.roleData.pageSize = val;
        this.loadRoleData();
      },
      roleCurrentChange(val) {
      	this.changePageCoreRecordData('role');
        this.roleData.pageNumber = val;
        this.loadRoleData();
      },
      loadRoleData(){
    		this.fatherLoading = true;
        sysApi.permissionList({
          pageSize: this.roleData.pageSize,
          pageNumber: this.roleData.pageNumber
        }).then(res => {
    			this.fatherLoading = false;
        	if(!res || res.code != '0'){
	          this.$message.error(res.message);
	          return;
        	}
          this.roleData.rows = res.result || [];
          this.roleData.total = res.total || 99999;
        }).then(res => {
        	this.setSelectRow('role');
        });
      },
      getCatchRole(){
    		this.fatherLoading = true;
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_FIND_GROUP_ROLE+"?groupId="+_groupId;
        this.$http.get(_url, {}).then(res => {
    			this.fatherLoading = false;
    			if(!res || !res.data || res.data.code!='0'){
    				let _message = (res && res.data) ? res.data.message : '查询组下用户失败';
    				this.$message.error(_message);
    				return;
    			}
      		for(var i=0; i<res.data.result.length; i++){
      			this.multipleSelectionAll['role'].push({
      				id: res.data.result[i].id || ''
      			});
      		}
        	this.setSelectRow('role');
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
      saveRoleToGroup(){
      	let _roles = [];
      	for(var i=0; i<this.multipleSelectionAll.role.length; i++){
      		_roles.push( this.multipleSelectionAll.role[i].id );
      	}
      	var _confirm = '将'+_roles.length+'个数据权限添加到当前组, 是否继续?',
      		_strRole = JSON.stringify(_roles);
        this.$confirm(_confirm, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.deleteGroupAllRole(_strRole);
        }).catch(() => {
          this.$message.info('已取消删除');
        });
      },
//    保存用户到组内时,先进行删除用户的操作
      deleteGroupAllRole(_strRole){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('未选择相关权限组');
      		return;
      	}
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_GROUP_ROLE_DELETE+"?id="+_groupId;
        this.$http.post(_url, {}).then(res => {
        	if(!res || !res.data || res.data.code!='0'){
        		this.$message.error('权限关联组失败');
        		return;
        	}
        	this.submitSaveRoleToGroup(_strRole);
        }).catch(err=>{
        	this.$message.error('系统异常!');
				})
      },
      submitSaveRoleToGroup(str){
      	if(!this.currentRow || !this.currentRow.id){
      		this.$message.error('未选择相关权限组');
      		return;
      	}
      	var _groupId = this.currentRow.id,
      		_url = api.SYS_ROLE_TO_GROUP+"?goupId="+_groupId+'&dataPermissionJson='+encodeURIComponent(str);
        this.$http.post(_url, {}).then(res => {
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
      checked(){
				let userPage = this.userData.pageNumber,
					rolePage = this.roleData.pageNumber;
	  		this.userData.rows.forEach(row => {
	  			if(this.groupUsers[userPage] && this.groupUsers[userPage][row.id]){
	  				this.$refs.userTable.toggleRowSelection(row,true);
	  			}else if(this.groupCatchUsers[row.id] && !this.groupUsers[userPage]){
	  				this.$refs.userTable.toggleRowSelection(row,true);
	  			}else{
	        	this.$refs.userTable.toggleRowSelection(row,false);
	  			}
	    	});
	  		this.roleData.rows.forEach(row => {
	  			if(this.groupRoles[userPage] && this.groupRoles[userPage][row.id]){
	  				this.$refs.userTable.toggleRowSelection(row,true);
	  			}else if(this.groupCatchRoles[row.id] && !this.groupRoles[userPage]){
	  				this.$refs.userTable.toggleRowSelection(row,true);
	  			}else{
	        	this.$refs.userTable.toggleRowSelection(row,false);
	  			}
	    	});
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
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
	.el-tree{
		border: 1px solid #EBEEF5;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    height: 700px;
    padding: 5px;
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
