
//--------------------------------------用户登录(  判断跳转   )---------------------------------
var user = {
	ouc: {
		user: null,
		oauth2User: window.Kd_auth_server+"oauth",
		clientId: "client",
		clientSecret: "secret"
	},
	userId: null,				//登录用户的id
	
	username: null,				//登录用户名
	
	showname: null,				//登录用户的显示名称
	
	authority: null,			//登录的用户类型
	
	userImg: "dist/img/avatar04.png",	//登录的默认用户头像
	
	officeCode: null,			//登录用户所对应的code编号
	
	userType: false,				//用户类型与权限相关
	
	userEdit: null,
	
	tag_supervise: "",
	
	cssBlock:[
		"manageTask",
		"manageHistory",
		"returnTask",
//		"releaseTask",
		"manageClassify",
		"collectionTask",
		"taskQuality",
		"waitLabelTask"
	],
	
	role_dom: {
		'mark_role': ['MyTask'],
		'mark_inspect_role': ['MyTask'],
		'mark_check_role': ['MyTask'],
		'tag_supervise': [
			'collectionTask',
			'manageHistory',
			'baseCraft',
			'importManage',
			'searchMark',
			'taskPack',
			'efficiencyStatistics',
			'pickupAtMap'
		],
		'classify_role': ['imgMain'],
		'classify_inspect_role': ['imgCheck'],
		'classify_check_role': ['imgAccept']
	},
	
	mainBlock:[
		"imgMain"
	],
	
	checkBlock:[
		"imgCheck"
	],
	
	acceptBlock:[
		"imgAccept"
	],
	
//	登录系统的判断
	userData: function(){
//		获取所登录的用户
		$.ajax( {
		    type : "get",
		    url : window.Kd_auth_server+"user",
		    async : false,
		    data : {},
		    success : function(data){

//		    	获取不到登录用户则进行跳转登录
		    	if(!data){
		    		user.oAuthLoginPage();
		    		return ;
		    	}
		    	
//		  		获取用户iD
		    	if(data.principal.userId){
		    		user.userId = data.principal.userId;
		    	}
//		  		获取用户名
		    	if(data.principal.username){
		    		user.username = data.principal.username;
		    	}
//		  		获取用户昵称
		    	if(data.principal.showname){
		    		user.showname = data.principal.showname;
		    	}
//		  		获取用户类型
				for(var i=0; i<data.authorities.length; i++){
					let authority = data.authorities[i].authority;
					if( (authority.indexOf("tag_") >= 0) ){
						user.userType = true;
						$(".historyTask").css("display","none");
						$(".logo-lg").html("标注管理系统");
					}
					
					if(user.role_dom[authority]){
						user.showDom(authority);
					}
				}
//		  		获取用户code参数
		    	if(data.principal.officeCode){
		    		user.officeCode = data.principal.officeCode;
		    	}
//				通过获取的昵称来进行修改页面上显示名称
				if(data.principal.username && $(".userName").length){
					$(".hidden-xs").html(data.principal.showname);
					$(".userName").html(data.principal.showname);
				}
//				通过获取的头像图片来进行修改页面上显示图像
				if( user.userImg && $(".user-image").length ){
					$(".user-image")[0].src = user.userImg;
					for(var i=0; i<$(".img-circle").length; i++){
						$(".img-circle")[i].src = user.userImg;
					}
				}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   		user.oAuthLoginPage();
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
	
	oAuthLoginPage: function(){
		$.oauth2Client.begin({
			authorizeUrl: user.ouc.oauth2User + "/authorize",
			clientId: user.ouc.clientId,
			redirectUri: user.getNoHashUrl()
		});
	},
	
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
	
	showDom: function(authority){
		let doms = user.role_dom[authority];
		for(let s=0; s<doms.length; s++){
			let classname = doms[s],
				dom = $('.sidebar ul.sidebar-menu li.'+classname);
			dom.css("display","block");
		}
	}
}
user.userData();
