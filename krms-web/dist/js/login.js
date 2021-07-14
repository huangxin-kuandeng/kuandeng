
var ouc = {
	user: null,
	oauth2User: window.Kd_auth_server+"oauth",
	clientId: "client",
	clientSecret: "secret"
};

//用户登陆登出系统
var login = {
	userId: null,				//登录用户对应的Id
	
	username: null,				//登录用户对应的用户名
	
	showname: null,				//登录用户对应的显示名称
	
	authority: null,			//登录用户对应的用户类型
	
	officeCode: null,			//登录用户对应的code编号
	
	userImg: null,				//登录用户对应的头像
	
	userData: function(){
		$.ajax( {
		    type : "get",
		    url : window.Kd_auth_server+"user",
		    async : false,
		    data : {},
		    success : function(data){
//		    	找不到所登录的用户则跳转到登陆界面
		    	if(!data){
		    		login.oAuthLoginPage()
		    		return ;
		    	}
		    	
//  			获取用户iD
		    	if(data.principal.userId){
		    		login.userId = data.principal.userId;
		    	}
//  			获取用户名
		    	if(data.principal.username){
		    		login.username = data.principal.username;
		    	}
//  			获取用户昵称
		    	if(data.principal.showname){
		    		login.showname = data.principal.showname;
		    	}
//  			获取用户类型
				for(var i=0; i<data.authorities.length; i++){
					if(data.authorities[i].authority == "edit"){
						login.authority = data.authorities[i].authority;
					}else if(data.authorities[i].authority == "survey"){
						login.authority = data.authorities[i].authority;
					}
				}
//  			获取用户code参数
		    	if(data.principal.officeCode){
		    		login.officeCode = data.principal.officeCode;
		    	}
//  			获取用户头像图片
		    	if(data.principal.showimg){
		    		login.userImg = data.principal.showimg;
		    	}else{
		    		login.userImg = "dist/img/user2-160x160.jpg";
		    	}
//				通过获取的昵称来进行修改页面上显示名称
				if(data.principal.username){
					$(".hidden-xs").html(login.showname);
					$(".userName").html(login.showname);
				}
//				通过获取的头像图片来进行修改页面上显示图像
				if(login.userImg && $(".user-image").length){
					$(".user-image")[0].src = login.userImg;
					for(var i=0; i<$(".img-circle").length; i++){
						$(".img-circle")[i].src = login.userImg;
					}
				}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   		login.oAuthLoginPage();
		   		return ;
		   	},
		});
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
	
// 	oauth2登录，使用access_token参数，在调用接口的请求中使用
	oAuthLoginPage: function(){
		$.oauth2Client.begin({
			authorizeUrl: ouc.oauth2User + "/authorize",
			clientId: ouc.clientId,
			redirectUri: login.getNoHashUrl()
		});
	},

//	登出用户
	signout: function(){
		$.ajax({
			type:"get",
			url:window.Kd_auth_server+"logout",
			async:false,
			success : function(data) {
//				登出成功，刷新页面(会自动跳转至登陆界面)
				window.location.reload();
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
	},
}
login.userData();
