<template>
  <imp-panel title="重置密码">
    <el-form ref="form" :model="form" label-width="180px" :rules="rules">
      <el-form-item label="旧密码" prop="oldPassword" :rules="[{ required: true, message: '旧密码不能为空'}]">
        <el-input v-model="form.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" :rules="[{ required: true, message: '新密码不能为空'}]">
        <el-input v-model="form.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="newPassword2">
        <el-input v-model="form.newPassword2" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import * as api from "../api"
  import * as sysApi from '../services/sys'
  import  auth from '../common/auth'
  export  default{
    data(){
      var validatePass2 = (rule, value, callback) => {
      	if(!value){
      		callback(new Error('确认新密码不能为空!'));
      	}else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        form: {
          oldPassword: '',
          newPassword: '',
          newPassword2: ''
        },
        rules: {
        	newPassword2: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
//  	触发修改密码操作
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.checkConfirm();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
//    修改密码二次确认
      checkConfirm(){
        this.$confirm('是否修改当前用户密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	this.modifyPwd();
        }).catch(() => {
          this.$message.info('已取消修改');
        });
      },
//    执行密码修改
      modifyPwd(){
      	let item = window.localStorage.getItem("user-info");
      	if(!!item){
      		item = JSON.parse(item);
	        sysApi.modifyPwd({
	        	userId: item.userId,
	          oldPassword: this.form.oldPassword,
	          newPassword: this.form.newPassword
	        })
	        .then(res => {
	        	if(res && res.code=='0'){
	        		this.pwdSubmit();
	        	}else{
	        		this.$message.error('修改密码失败：'+res.message);
	        	}
	        });
      	}else{
      		this.$message.error('修改密码失败：获取当前用户失败，请刷新！');
      	}
      },
      pwdSubmit(){
        this.$alert('修改密码成功, 确认重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
		        auth.logout();
//		        this.$http.defaults.headers.common['authSid'] = '';
		        this.$router.push({path: '/login'});
          }
        });
      }
    }
  }
</script>
