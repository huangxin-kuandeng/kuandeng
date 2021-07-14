<template>

  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="24">
          <el-button type="primary" icon="plus" @click="createUser">新增</el-button>
          <el-form :inline="true" :model="tableData.pagination" class="demo-form-inline searchForm">
					  <el-select v-model="tableData.pagination.groupId" filterable placeholder="请选择权限组">
					    <el-option
					      v-for="item in groupIdList"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
					  <el-form-item label="名称">
					    <el-input v-model="tableData.pagination.name" placeholder="名称"></el-input>
					  </el-form-item>
					  <el-form-item label="登录名">
					    <el-input v-model="tableData.pagination.loginName" placeholder="登录名"></el-input>
					  </el-form-item>
					  <el-form-item label="角色ID">
					    <el-input v-model="tableData.pagination.roleId" placeholder="角色ID"></el-input>
					  </el-form-item>
					  <el-form-item>
					    <el-button type="primary" @click="onSubmit">查询</el-button>
					  </el-form-item>
					</el-form>
        </el-col>
        <!--<el-col :span="12">
          <div class="el-input" style="width: 200px; float: right;">
            <i class="el-input__icon el-icon-search" style="position: absolute;right: 0px;z-index: 99;"></i>
            <input type="text" placeholder="输入用户名称" v-model="searchKey" @keyup.enter="search($event)"
                   class="el-input__inner" style="position: absolute;right: 0px;z-index: 10;">
          </div>
        </el-col>-->
      </el-row>
    </h3>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        max-height="700"
        border
        style="width: 100%"
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <!--checkbox 适当加宽，否则IE下面有省略号 https://github.com/ElemeFE/element/issues/1563-->
        <el-table-column
          prop="id"
          type="selection"
          width="50">
        </el-table-column>
        <!--<el-table-column
          label="照片" width="76">
          <template slot-scope="scope">
            <img :src='scope.row.avatar' style="height: 35px;vertical-align: middle;" alt="">
          </template>
        </el-table-column>-->
        <el-table-column
          prop="loginName"
          label="登录名">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="no"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="joinTime"
          :formatter="formatDate"
          label="入职时间">
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
        <el-table-column label="操作" width="300">
					<el-button-group slot-scope="scope">
					  <el-button size="small" title="编辑用户信息" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					  <el-button size="small" title="更新用户角色" type="primary" @click="handleRoleConfig(scope.$index, scope.row)">角色</el-button>
					  <el-button size="small" title="删除当前用户" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>

      <el-dialog class="userRole" :title="userTitle" :visible.sync="dialogVisible" width=30%>
        <div class="select-tree">
				  <el-checkbox-group v-model="roleIdList">
			    	<el-checkbox v-for="role in roleLists" :label="role.id" :key="role.id" :title="role.name">{{role.name}}</el-checkbox>
				  </el-checkbox-group>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="configUserRoles()">确 定</el-button>
          </span>
      </el-dialog>
    </div>


  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        dialogVisible: false,
        dialogLoading: false,
        userTitle: '配置用户角色',
        roleIdList: [],
        groupIdList: [],
        userId: '',
        listLoading: false,
        searchKey: '',
        tableData: {
          pagination: {
            name: '',
            roleId: '',
            loginName: '',
            groupId: '',
            total: 0,
            pageNum: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        formatDate(row, column){
        	if(!row.joinTime){
        		return '';
        	}
	        let date = new Date(parseInt(row.joinTime));
	        let Y = date.getFullYear() + '-';
	        let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
	        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();;
	        return Y + M + D;
        },
//			当前用户配置相关角色
				roleLists: []
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
      onSubmit() {
        this.loadData();
      },
      createUser(){
        this.$router.push({path: '/sys/userAdd'});
      },
      handleSelectionChange(val){

      },
      handleRoleConfig(index, row){
      	this.userTitle = '配置用户角色（'+row.name+'）';
      	this.roleIdList = row.roleIdList;
      	this.userId = row.id;
        this.dialogVisible = true;
      },
      configUserRoles(){
      	let roles = this.roleIdList.join(',');
      	let _url = api.SYS_ROLE_ASSIGN + '?roleIds=' + roles + '&userId=' + this.userId;
        this.$http.get(_url, {})
        	.then(res => {
	        	if(res && res.data && res.data.code=='0'){
	            this.$message.success('成功');
        			this.dialogVisible = false;
        			this.loadData();
	        	}else{
		          this.$message.error(res.data.message);
	        	}
	        })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNum = val;
        this.loadData();
      },
      handleEdit(index, row){
        this.$router.push({path: '/sys/userAdd', query: {id: row.id}})
      },
//		用户删除界面
      handleDelete(index, row){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.userDelete(row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
//    确认进行删除用户
      userDelete(id){
        this.$http.get(api.SYS_USER_DELETE + "?id=" + id)
          .then(res => {
          	if(res){
	          	this.loadData();
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
          	}else{
		          this.$message({
		            type: 'error',
		            message: '删除失败!'
		          });
          	}
          }).catch(err=>{
					})
      },
//    获取用户查询过滤条件--组
      loadGroups(){
				this.groupIdList = [];
        this.$http.get(api.SYS_GROUP_LIST_PAGE + "?pageNumber=1&pageSize=10000")
          .then(res => {
	        	if(res && res.data && res.data.code=='0'){
	          	this.groupIdList = res.data.result.list || [];
	        	}else{
		          this.$message.error(res.data.message);
	        	}
          }).catch(err=>{
					})
      },
//    获取用户可选择的角色
      loadRoles(){
				this.roleLists = [];
        sysApi.roleList({
        	pageNum: '1',
        	pageSize: '9999'
        }).then(res => {
        	if(!res || res.code != '0'){
        		let _message = (res && res.message) ? (res.message) : '系统异常';
            this.$message.error(_message);
            return;
        	}
          this.roleLists = res.result.list || [];
        });
      },
      loadData(){
          sysApi.userList({
//          key: this.searchKey,
            pageSize: this.tableData.pagination.pageSize,
            pageNum: this.tableData.pagination.pageNum,
            loginName: this.tableData.pagination.loginName,
            groupId: this.tableData.pagination.groupId,
            roleId: this.tableData.pagination.roleId,
            name: this.tableData.pagination.name
          })
          .then(res => {
          	if(!res || res.code != '0'){
		          this.$message.error(res.message);
		          return;
          	}
            this.tableData.rows = res.result.list;
            this.tableData.pagination.total = res.result.total || 0;
          });
      }
    },
    created(){
      this.loadGroups();
      this.loadRoles();
      this.loadData();
    }
  }
</script>
<style>
  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .userRole .el-dialog__body .el-checkbox{
  	width: 140px;
  	overflow: hidden;
  	/*text-overflow: ellipsis;*/
  	margin-right: 0px;
  }
  .searchForm{
  	float: left;
  }
</style>
