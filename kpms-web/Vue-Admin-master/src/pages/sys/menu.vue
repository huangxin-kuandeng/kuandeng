<template>
  <imp-panel>
    <h3 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%;">
        <el-col :span="12">
          <el-button type="primary" icon="plus" @click="addBtnClick">新增</el-button>
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
        :data="tableData"
        max-height="700"
        style="width: 100%"
        row-key="id"
        default-expand-all
        v-loading="fatherLoading"
        border>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            {{ scope.isShow=='1' ? '显示' : '隐藏' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="href"
          label="链接">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间">
        </el-table-column>
        <el-table-column label="操作" width="285">
					<el-button-group slot-scope="scope">
					  <el-button size="small" title="新增一个菜单" type="primary" @click="addParentClick(scope.$index, scope.row)">新增</el-button>
					  <el-button size="small" title="更新菜单信息" type="primary" @click="addBtnClick(scope.$index, scope.row)">编辑</el-button>
					  <el-button size="small" title="删除当前菜单" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
        </el-table-column>
      </el-table>
			<el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width=30%>
			  <el-form :model="createForm" ref="createForm" label-position="left">
			    <el-form-item label="名称：" :label-width="formLabelWidth" prop="name" :rules="[{ required: true, message: '菜单名称不能为空'}]">
			      <el-input v-model="createForm.name" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="排序：" :label-width="formLabelWidth" prop="sort" :rules="[{ required: true, message: '排序不能为空'}]">
			    	<el-slider v-model="createForm.sort"></el-slider>
			    </el-form-item>
			    <el-form-item label="状态：" :label-width="formLabelWidth" prop="isShow" :rules="[{ required: true, message: '状态不能为空'}]">
			      <el-select v-model="createForm.isShow" placeholder="请选择菜单状态">
			        <el-option label="隐藏" value="0"></el-option>
			        <el-option label="显示" value="1"></el-option>
			      </el-select>
			    </el-form-item>
			    <el-form-item label="链接：" :label-width="formLabelWidth">
			      <el-input v-model="createForm.href" autocomplete="off"></el-input>
			    </el-form-item>
			    <el-form-item label="描述：" :label-width="formLabelWidth">
			      <el-input v-model="createForm.remarks" autocomplete="off"></el-input>
			    </el-form-item>
			  </el-form>
			  <div slot="footer" class="dialog-footer">
			    <el-button @click="dialogFormVisible = false">取 消</el-button>
			    <el-button type="primary" @click="addUserGroup('createForm')">确 定</el-button>
			  </div>
			</el-dialog>
    </div>
  </imp-panel>
</template>
<style>
	.select-tree .roleLabel{
    float: left;
    color: #1e90ff;
    font-size: 14px;
    margin-right: 10px;
	}
	.select-tree .el-checkbox-group{
		margin: 10px 0px;
    padding-bottom: 10px;
    border-bottom: 1px solid #EBEEF5;
	}
	.select-tree .el-checkbox-group .el-checkbox{
		margin-right: 20px;
    margin-left: 10px;
	}
</style>
<script>
  import * as api from "../../api"
  import testData from "../../../static/data/data.json"
  import * as sysApi from '../../services/sys'

  export default {
    data(){
      return {
        currentRow: {},
        dialogVisible: false,
        fatherLoading: false,
//			弹窗
		   	formLabelWidth: '80px',
		   	formTitle: '新增菜单',
		   	dialogFormVisible: false,
		   	createForm: {
		   		name: '',
		   		isShow: '1',
		   		href: '',
		   		id: '',
		   		sort: 1,
		   		parentIds: '',
		   		parent: {
		   			id: '0'
		   		},
		   		remarks: ''
		   	},
        searchKey: '',
        tableData: []
      }
    },
    methods: {
      search(target){
        this.loadData();
      },
      addBtnClick(index, row={}){
      	if(this.$refs && this.$refs.createForm){
      		this.$refs.createForm.clearValidate();
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      	this.formTitle = '新增菜单';
      	if(row.name){
      		this.userChangeType = true;
      		this.formTitle = '修改菜单（'+row.name+'）';
      	}
      	for(var name in this.createForm){
      		if(name == 'isShow'){
      			this.createForm[name] = row[name] || '1';
      		}else if(name == 'parent'){
      			this.createForm[name].id = row.parentId || '0';
      		}else{
      			this.createForm[name] = row[name];
      		}
      	}
      },
//    在菜单下新增
      addParentClick(index, row={}){
      	this.formTitle = '新增菜单（'+row.name+'）';
      	for(var name in this.createForm){
      		if(name == 'parent'){
      			this.createForm[name].id = row.id;
      		}else if(name == 'isShow'){
      			this.createForm[name] = '1';
      		}else if(name == 'sort'){
      			this.createForm[name] = 0;
      		}else{
      			this.createForm[name] = '';
      		}
      	}
      	this.userChangeType = false;
      	this.dialogFormVisible = true;
      },
      addUserGroup(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.dialogFormVisible = false;
            this.submitMenu();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitMenu(){
        this.$http.post(api.SYS_MENU_UPSERT, this.createForm)
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
      handleDelete(index, row){
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
      submitDelete(id){
        this.$http.get(api.SYS_MENU_DELETE+"?id="+id)
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
      loadData(){
    		this.fatherLoading = true;
        sysApi.menuList({
//        key: this.searchKey,
//        pageSize: this.tableData.pagination.pageSize,
//        pageNo: this.tableData.pagination.pageNo
        }).then(res => {
        	if(!res || res.code!='0'){
        		let _message = (res && res.message) ? res.message : '系统异常';
	          this.$message.error(_message);
        	}
        	let _data = (res && res.result) ? res.result : [];
          this.tableData = _data;
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
