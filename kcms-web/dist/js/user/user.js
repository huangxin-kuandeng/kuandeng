
//--------------------------------------用户登录(  判断跳转   )---------------------------------
var currentUser = {
	
	ouc: {
		user: null,
		oauth2User: configURL.kd_auth_server+"oauth",
		clientId: "client",
		clientSecret: "secret"
	},
	
	userId: null,				//登录用户的id
	
	username: null,				//登录用户名
	
	showname: null,				//登录用户的显示名称
	
	officeCode: null,			//登录用户所对应的code编号
	
//	登录系统的判断
	userData: function(){
//		获取所登录的用户
//#region  dev
let data = {
	principal:{
    "ouc": {
        "user": null,
        "oauth2User": "http://192.168.7.28:13920/kd-auth-server/oauth",
        "clientId": "client",
        "clientSecret": "secret"
    },
    "userId": 787651159,
    "username": "edit_lead1",
    "showname": "edit_lead1",
    "officeCode": "01001002"
}
};
//		  		获取用户iD
if(data.principal.userId){
	currentUser.userId = data.principal.userId;
}
//		  		获取用户名
if(data.principal.username){
	currentUser.username = data.principal.username;
}
//		  		获取用户昵称
if(data.principal.showname){
	currentUser.showname = data.principal.showname;
}
//		  		获取用户code参数
if(data.principal.officeCode){
	currentUser.officeCode = data.principal.officeCode;
}
//				通过获取的昵称来进行修改页面上显示名称
if(data.principal.username){
	$(".userName").html(data.principal.showname);
	$(".userStatus").html('登陆成功');
}
//#endregion


//#region  prod
// 		$.ajax( {
// 		    type : "get",
// 		    url : configURL.kd_auth_server+"user",
// 		    async : false,
// 		    data : {},
// 		    success : function(data){
// //		    	获取不到登录用户则进行跳转登录
// 		    	if(!data){
// 		    		currentUser.oAuthLoginPage();
// 		    		return ;
// 		    	}
		    	
// //		  		获取用户iD
// 		    	if(data.principal.userId){
// 		    		currentUser.userId = data.principal.userId;
// 		    	}
// //		  		获取用户名
// 		    	if(data.principal.username){
// 		    		currentUser.username = data.principal.username;
// 		    	}
// //		  		获取用户昵称
// 		    	if(data.principal.showname){
// 		    		currentUser.showname = data.principal.showname;
// 		    	}
// //		  		获取用户code参数
// 		    	if(data.principal.officeCode){
// 		    		currentUser.officeCode = data.principal.officeCode;
// 		    	}
// //				通过获取的昵称来进行修改页面上显示名称
// 				if(data.principal.username){
// 					$(".userName").html(data.principal.showname);
// 					$(".userStatus").html('登陆成功');
// 				}
// 		    },
// 		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
// 		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
// 		   		currentUser.oAuthLoginPage();
// 		   		return ;
// 		   	},
// 		});
//#endregion
	},
	
	getNoSearchUrl: function(){
		return window.location.origin + window.location.pathname;
	},
	
	getNoHashUrl: function(){
		return window.location.href.split("#")[0];
	},
	
	isNotNull: function(str){
		return str != null && $.trim(str) != "";
	},
	
	oAuthLoginPage: function(){
		$.oauth2Client.begin({
			authorizeUrl: currentUser.ouc.oauth2User + "/authorize",
			clientId: currentUser.ouc.clientId,
			redirectUri: currentUser.getNoHashUrl()
		});
	},
	
	signout: function(){
		$.ajax({
			type: "get",
			url: configURL.kd_auth_server+"logout",
			async:false,
			success : function(data) {
//				登出成功，刷新页面(会自动跳转至登陆界面)
				window.location.reload();
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
	}
}

currentUser.userData();
