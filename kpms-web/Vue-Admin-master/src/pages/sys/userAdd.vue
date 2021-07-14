<template>
  <imp-panel :title="userTitle">

    <el-row>
			<!--<el-upload
			  action="https://jsonplaceholder.typicode.com/posts/"
			  list-type="picture-card"
			  :on-preview="handlePictureCardPreview"
			  :on-remove="handleRemove">
			  <i class="fa fa-image"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
			  <img width="100%" :src="dialogImageUrl" alt="">
			</el-dialog>-->

    </el-row>
    <el-form
    	ref="form"
    	label-position="left"
    	hide-required-asterisk: true
    	:model="form"
    	:rules="rules"
    	v-loading="editLoading"
    	label-width="180px">

	    <el-row class="headForm">
	      <el-form-item label="工号：" prop="no" :rules="[{ required: true, message: '工号不能为空'}]">
	        <el-input v-model="form.no"></el-input>
	      </el-form-item>
	      <el-form-item label="姓名：" prop="name" :rules="[{ required: true, message: '姓名不能为空'}]">
	        <el-input v-model="form.name"></el-input>
	      </el-form-item>
	      <el-form-item label="入职日期：" prop="joinTime">
			    <el-date-picker
			      v-model="form.joinTime"
			      align="right"
			      type="date"
			      format="yyyy-MM-dd"
			      value-format="timestamp"
			      placeholder="选择日期"
			      :editable=false
			      :picker-options="pickerOptions">
			    </el-date-picker>
	      </el-form-item>
	    </el-row>

	    <el-row class="inputForm">
	      <el-form-item label="登录名：" prop="loginName" :rules="[{ required: true, message: '登录名不能为空'}]">
	        <el-input v-model="form.loginName"></el-input>
	        <el-input type="text" style="position:fixed;bottom:-9999px;"></el-input>
	      </el-form-item>
	      <el-form-item label="密码：" v-if="form.id">
	        <el-input type="password" style="position:fixed;bottom:-9999px;"></el-input>
	        <el-input type="password" v-model="form.newPassword"></el-input><span class="passTitle">若不修改密码，请留空。</span>
	      </el-form-item>
	      <el-form-item label="密码：" prop="newPassword" :rules="[{ required: true, message: '密码不能为空'}]" v-else>
	        <el-input type="password" style="position:fixed;bottom:-9999px;"></el-input>
	        <el-input type="password" v-model="form.newPassword"></el-input>
	      </el-form-item>
	      <el-form-item label="邮箱：" prop="email" :rules="[{ required: true, message: '邮箱不能为空'}]">
	        <el-input v-model="form.email"></el-input>
	      </el-form-item>
	      <el-form-item label="确认密码：" prop="checkPass">
	        <el-input type="password" v-model="form.checkPass"></el-input>
	      </el-form-item>
	      <el-form-item label="电话：">
	        <el-input v-model="form.phone"></el-input>
	      </el-form-item>
	      <el-form-item label="用户类型：">
	        <el-radio-group v-model="form.userType">
	          <el-radio label="1">超级管理员</el-radio>
	          <el-radio label="2">管理员</el-radio>
	          <el-radio label="3">普通用户</el-radio>
	        </el-radio-group>
	      </el-form-item>
	    </el-row>

      <el-form-item label="用户角色：" v-loading="checkLoading">
			  <el-checkbox-group v-model="form.roleIdList">
			    <el-checkbox v-for="role in roles.roleList" :label="role.id" :key="role.id">{{role.name}}</el-checkbox>
			  </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="form.remarks"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="userBtnClick('form')" v-if="form.id">保存</el-button>
        <el-button type="primary" @click="userBtnClick('form')" v-else>立即创建</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<style>
  .el-upload {
    width: 80px;
    height: 80px;
    line-height: 90px;
  }
  .el-upload-list .el-upload-list__item{
  	width: 80px;
  	height: 80px;
  }
  .inputForm .el-form-item{
  	width: 50%;
  	float: left;
  }
  .inputForm  .el-form-item input{
  	width: 200px;
  }
  .headForm{
  	border-bottom: 1px solid #888888;
  	margin-bottom: 20px;
  }
  .headForm  .el-form-item{
  	width: 50%;
  }
  .headForm  .el-form-item input{
  	width: 200px;
  }
  .el-checkbox-group{
    line-height: 25px;
  }
  .el-checkbox-group .el-checkbox{
		margin-right: 20px;
    line-height: 25px;
  }
  .passTitle{
    position: absolute;
    top: 0px;
    left: 210px;
    color: #aaaaaa;
    font-size: 13px;
  }
</style>

<script>
	const cityOptions = ['权限1', '权限2', '权限3', '权限4'];
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      var validatePass2 = (rule, value, callback) => {
        if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
      	pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }]
      	},
      	checkLoading: false,
      	default_value: new Date(),
      	editLoading: false,
        dialogImageUrl: '',
        userTitle: '新增用户',
        dialogVisible: false,
        form: {
          id: '',
          no: '',
          name: '',
          newPassword: '',
          loginName: '',
          checkPass: '',
          joinTime: null,
          phone: '',
          email: '',
          userType: '3',
          remarks: '',
          roleIdList: []
        },
        roles: {
	        checkAll: false,
	        roleList: cityOptions,
	        isIndeterminate: true
        },
        rules: {
        	checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      this.loadRoles();
      this.loadData();
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
//    创建新的用户提交
      userBtnClick(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.userSubmit();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
//    修改当前用户提交
      userSubmit(){
      	console.log(this.form)
        this.$http.post(api.SYS_USER_ADD, this.form)
          .then(res => {
          	if(res && res.data && res.data.code=='0'){
	            this.$confirm('提交成功, 是否返回列表?', '提示', {
	              confirmButtonText: '确定',
	              cancelButtonText: '取消',
	              type: 'success'
	            }).then(() => {
	              this.$router.push({path: 'userList'})
	            })
          	}else{
          		let _message = (res && res.data && res.data.message) ? res.data.message : '系统异常';
		          this.$message.error(_message);
          	}
          })
      },
//    获取用户可选择的角色
      loadRoles(){
				this.roles.roleList = [];
				this.checkLoading = true;
        sysApi.roleList({
        	pageNum: 1,
        	pageSize: 9999
        }).then(res => {
        	if(!res || res.code != '0'){
        		let _message = (res && res.message) ? (res.message) : '系统异常';
            this.$message.error(_message);
            return;
        	}
          this.roles.roleList = res.result.list || [];
					this.checkLoading = false;
  				console.log(this.roles.roleList);
        });
      },
//    获取当前修改的用户信息
      loadData(){
//    	判断是否为修改操作进入
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
          this.form.id = this.$route.query.id;
          this.editLoading = true;
          this.$http.get(api.SYS_USER_GET + "?id=" + this.form.id)
            .then(res => {
          		this.editLoading = false;
            	if(res && res.data && res.data.result){
            		for(let name in this.form){
            			this.form[name] = res.data.result[name] || '';
            		}
            		this.form.roleIdList = res.data.result.roleIdList || [];
            	}else{
            		this.$message.warning('当前用户信息获取失败');
            	}
            	this.userTitle = this.form.name ? ('用户编辑（'+this.form.name+'）') : '新增用户';
            })
        }
      }
    }
  }
</script>
