;;(function(iD) {
	var roles = [
		{
			id: [100101,100103],
			classes: 1, //用户反馈
			role: 'work'
		},
		{
			id: [100102, 100104],
			classes: 1,
			role: 'check'
		},
        {
            id: [100501,100503],
            classes: 5, //步导任务
            role: 'work'
        },
        {
            id: [100502, 100504],
            classes: 5,
            role: 'check'
        },
		{
			id: [100201, 100203],
			classes: 2, // 重点工程
			role: 'work'
		},
		{
			id: [100202, 100204],
			classes: 2,
			role: 'check'
		},
        {
            id: [100505, 100507],
            classes: 5, // 步导任务
            role: 'work'
        },
        {
            id: [100506, 100508],
            classes: 5,
            role: 'check'
        },
		{
			id: [100000],
			classes: 1,
			role: 'admin'
		}
	];
	
	// 角色
	var ROLE = {
		// 管理员
		MANAGER: "Manager",
		// 采集
		SURVEY: "survey",
		// 识别
		RECOGNITION: "rec",
		//传统编辑
        SD_DATA_EDIT:'sdEdit',
		//传统编辑
        SD_DATA_CHECK:'SdDataCheck',
		//传统编辑
        SD_DATA_VERIFY:'SdDataVerify',
		// 融合
		FUSION: "fusion",
		// 编辑
		EDIT: "edit",
		// 编辑质检
		EDIT_CHECK: "edit_check",
		// 图像打标
		IMAGE_TAG: "tag_select",
		
		// 审核
		AUDIT: "audit",
		// 数据更新流程-人工审核
		MAUALCHECK: "manualCheck",
		// 验收
		VERIFY: "verify",
		// 作业
        WORK: "work",
		// 质检
        CHECK: "check",
        
        // 车道线作业
        LINE_WORKER: 'LinearWork',
        //病害作业
        DISEASE_WORK: 'diseaseWork',
        // 车道线质检
        LINE_CHECKER: 'LinearCheck',
        
        //病害质检
        DISEASE_CHECK: 'diseaseCheck',

        // 质检评估员
        QUALITY_ASSESSOR: 'quality_assessor',

        // 自动化拓扑作业
        AUTO_TOPOLOGY_WORK: 'autoTopologyWork',
        // 自动化拓扑质检
        AUTO_TOPOLOGY_CHECK: 'autoTopologyCheck',
        // 自动化拓扑验收
        AUTO_TOPOLOGY_VERIFY: 'autoTopologyVerify',
        
        //全要素接边作业
        EDGE_SNAP:'EdgeSnap',
        
        //病害验收
        DISEASE_VERIFY:'diseaseVerify',

        // 全要素编译 作业、质检、验收
        TOTAL_FACTOR_COMPILE_WORK: 'totalFactorCompileWork',
        TOTAL_FACTOR_COMPILE_CHECK: 'totalFactorCompileCheck',
        TOTAL_FACTOR_COMPILE_VERIFY: 'totalFactorCompileVerify',
        
        // 精度质检
        PRECISION_INSPECTION: 'PrecisionInspection'
	}
	
	function isRoleAuth(roleName){
		var user = iD.User.getInfo();
		if(!user){
			return false;
		}
        // user.authorities = [{
        //     authority: "audit"
        // }]
		var arr = user.authorities || [];
		
		for(var i in arr){
			var item = arr[i];
			if(item && item.authority == roleName){
				return true;
			}
		}
		
		return false;
	}
	function isAuthManager(){
		var user = iD.User.getInfo();
		if(!user){
			return false;
		}
		return user.authorities == undefined || isRoleAuth(ROLE.MANAGER);
	}
	

	var dispatch  = d3.dispatch('login', 'logout', 'error', 'dvr');
	function post(url, data, callback) {
		var formData = [];
		for (var field in data) {
			formData.push(field + '=' + data[field]);
		}
		data = formData.join('&');
		d3.json(url)
			.header("Content-Type", "application/x-www-form-urlencoded")
			.post(data, function(error, data) {
				if (error || !data.result) {
					// dispatch.error
					var error = error && JSON.parse(error.response) || '用户名密码错误';
					dispatch.error(error);
					return;
				}

				callback(data);
			});
	}
	iD = iD || {};
	iD.User = {
		_info: {},//{username: "admin", roleid: 100101, role: "role", userid: 1},
		// 判断是否已经进入过url中指定的task_id
		_urlTaskIsEnter: false,
		isOauthLogin: true,
		dispatch: dispatch,
		getInfo: function() {
			if (this._info.username) {
				return this._info;
			}

			//if (iD.util.cookie.hasItem('token')) {
			//	this._info = JSON.parse(iD.util.cookie.getItem('token'));
			//	return this._info;
			//}

			return false;
		},
		login: function(username, password, callback) {
			
			// if(username=="admin" && password=="admin"){
			//
			// 	this._info={username: "admin", roleid: 100101, role: "role", userid: 1};
			// 	dispatch.login({});
			// 	return this._info;
			// }
			
			
			//对密码进行MD5加密
			// password = iD.User.MD5(password);
			
			var _self = this;
			if(!_self.isOauthLogin){
	            var userInfo=this.getInfo();
				if (this.getInfo()&&userInfo.username==username) {
					dispatch.login(_self._info);
					callback && callback(_self._info);
					return;
				}
				var url = iD.config.URL.kus+'user/login?';
				post(url, {username: username, password: password}, function(data) {
					var result = data.result;
					_self._info = {
						roleid: 100101,
						role: "role",
						username: result.username,
						userid: result.userId,
						userId: result.userId
					};
	                Object.assign(_self._info, data.result);
	
					//iD.util.cookie.setItem('token', JSON.stringify(data));
					iD.util.parse2SystypeParam();
					
				   	dispatch.login({});
					//callback && callback(data.data);
				});
			}else {
				if(_self._info){
					dispatch.login(_self._info);
					iD.util.parse2SystypeParam();
				}
			}
			/*
			var _self = this;
            var userInfo=this.getInfo();
			if (this.getInfo()&&userInfo.username==username) {
				dispatch.login(_self._info);
				callback && callback(_self._info);
				return;
			}
			var url = iD.config.URL.kd_auth_server+'token';
			post(url, {
				username: username, 
				password: password,
				scope: "openid",
				grant_type: "password"
			}, function(data) {
				debugger ;
				_self._info = {username: "admin", roleid: 100101, role: "role", userid: 1};
                Object.assign(_self._info,data.result);

				//iD.util.cookie.setItem('token', JSON.stringify(data));
			   dispatch.login({});
			
				//callback && callback(data.data);
			});
			*/
			
		},
		logout: function(callback) {
			var _self = this;
			if(!_self.isOauthLogin){
				if (!this.getInfo()) {
					return;
				}
				var url = iD.config.URL.kus + '/logout';
				var token = this.getInfo().token;
	
//				post(url, {token: token}, function() {
					iD.util.cookie.removeItem('token');
					callback && callback();
//				});
			}else {
				d3.json(iD.config.URL.kd_auth_server + "logout").get(function(error, data){
					self._info = null;
				
					oAuthLoginPage();
				});
			}
			
			
			/*
			
			*/
		},
		getRole: function() {
			var id = this.getInfo().roleid;
			id = parseInt(id, 10);
			for (var i = 0, len = roles.length; i < len; i++) {
				if (roles[i].id.indexOf(id) !== -1) {
					return roles[i];
				}
			}
		},
		_oauthLogin: function(data, callback){
			var _self = this;
            var userInfo=this.getInfo();
            // console.trace("_oauthLogin ... ", userInfo);
			if (userInfo) {
				var urlTaskid = iD.url.getUrlParam("taskID");
				if(!urlTaskid){
					setTimeout(function(){
						dispatch.login(userInfo);
					}, 500);
				}
				return;
			}
			if(!data){
				return ;
			}
			
			var principal = data.principal || {};
			
			var _self = iD.User;
			_self._info = {
				roleid: 100101,
				role: "role",
				username: principal.username,
				userId: principal.userId,
				userid: principal.userId,
				authorities: principal.authorities || []
//				authorities: [{
//					authority: ROLE.RECOGNITION
//				}]
			};
			iD.util.parse2SystypeParam();
		},
		// 审核
		isAuditRole: function() {
            // return isRoleAuth(ROLE.AUDIT);
            return isRoleAuth(ROLE.AUDIT) || isRoleAuth(ROLE.MAUALCHECK);
		},
		// 验收
		isVerifyRole: function() {
			return isRoleAuth(ROLE.VERIFY) || this.isAutoTopologyVerifyRole() || this.isTotalFactorCompileVerify() || this.isSdDataVerifyRole() || this.isDiseaseVerify();
		},
		// 作业
		isWorkRole: function () {
			return isRoleAuth(ROLE.WORK) || this.isDiseaseWorkRole() || this.isLineWorkRole() || this.isAutoTopologyWorkRole() || this.isTotalFactorCompileWork() || this.isSdDataEditRole() || this.isEdgeSnap();
        },
        // 质检
		isCheckRole: function () {
			return isRoleAuth(ROLE.CHECK) || this.isLineCheckRole() || this.isAutoTopologyCheckRole() || this.isTotalFactorCompileCheck() || this.isSdDataCheckRole() || this.isDiseaseCheck();
        },
		// 车道线用户
		isLinearRole: function(){
			return this.isLineWorkRole() || this.isLineCheckRole();
        },
        isTotalFactorCompileRole(){
            return this.isTotalFactorCompileWork() || this.isTotalFactorCompileCheck() || this.isTotalFactorCompileVerify();
        },
		// 车道线作业
		isLineWorkRole: function(){
			return isRoleAuth(ROLE.LINE_WORKER);
        },
        
        //全要素接边作业
        isEdgeSnap:function(){
            return isRoleAuth(ROLE.EDGE_SNAP);
        },
		// 车道线作业
		isDiseaseWorkRole: function(){
			return isRoleAuth(ROLE.DISEASE_WORK);
		},
		// 车道线质检
		isLineCheckRole: function(){
			return isRoleAuth(ROLE.LINE_CHECKER);
        },
        // 自动化拓扑作业
        isAutoTopologyWorkRole: function(){
            return isRoleAuth(ROLE.AUTO_TOPOLOGY_WORK);
        },
        // 自动化拓扑质检
        isAutoTopologyCheckRole: function(){
            return isRoleAuth(ROLE.AUTO_TOPOLOGY_CHECK);
        },
        // 自动化拓扑验收
        isAutoTopologyVerifyRole: function(){
            return isRoleAuth(ROLE.AUTO_TOPOLOGY_VERIFY);
        },
        // 全要素编译 作业、质检、验收
        isTotalFactorCompileWork: function(){
            return isRoleAuth(ROLE.TOTAL_FACTOR_COMPILE_WORK);
        },
        isTotalFactorCompileCheck: function(){
            return isRoleAuth(ROLE.TOTAL_FACTOR_COMPILE_CHECK);
        },
        isTotalFactorCompileVerify: function(){
            return isRoleAuth(ROLE.TOTAL_FACTOR_COMPILE_VERIFY);
        },
        // 质检评估员
        isQualityAssessorRole: function(){
            return isRoleAuth(ROLE.QUALITY_ASSESSOR);
        },
		// 有融合角色，没有编辑角色
		isFusionRole: function(){
			return this.isWorkRole();
		},
		// 编辑
		isEditRole: function(){
			return this.isWorkRole();
		},
		// 管理员
		isManagerRole: function(){
			return false;
		},
		// 识别
		isRecognitionRole: function(){
			return false;
		},
        // 标精编辑
        isSdDataEditRole: function(){
            return isRoleAuth(ROLE.SD_DATA_EDIT);
        },
        // 标精质检
        isSdDataCheckRole: function(){
            return isRoleAuth(ROLE.SD_DATA_CHECK);
        },
        
        //病害质检
        isDiseaseCheck:function(){
            return isRoleAuth(ROLE.DISEASE_CHECK);
        },

        //病害验收
        isDiseaseVerify:function(){
            return isRoleAuth(ROLE.DISEASE_VERIFY);
        },
        // 标精验收
        isSdDataVerifyRole: function(){
            return isRoleAuth(ROLE.SD_DATA_VERIFY);
        },
		// 采集
		isSurveyRole: function(){
			return false;
		},
		// 精度质检
		isPrecisionRole: function(){
			return isRoleAuth(ROLE.PRECISION_INSPECTION);
		},
		// 质检
		isEditCheckRole: function(){
			return this.isCheckRole() || this.isVerifyRole();
		},
		// 质检作业系统，同时登录用户有质检角色
		// 20180824 历史任务时不限制质检标记操作；
		isEditCheckSystemAndRole: function(){
//			return this.isCheckRole() || this.isVerifyRole();
			return iD.util.urlParamHistory() || this.isCheckRole() || this.isVerifyRole() || this.isQualityAssessorRole();
		},
		isImageTagRole: function(){
			return this.isCheckRole() || this.isVerifyRole();
		},
		isAnalysisTagRole: function(){
			return this.isCheckRole();
		},
    	/*
		多批次功能逻辑（右侧多批次图层、数据查询/保存操作时用）：
		审核，线性编辑，线性质检带批次（新增、保存、查询都带批次）
		人工编辑，质检，验收，都不带批次（新增、保存时带批次，查询时不带批次兼容旧数据）
		
		历史任务时，任务只有一个批次时当多不带批次，多个批次时带批次
    	 * */
		isMultiBatchesRole: function(){
			return this.isAuditRole() || this.isLineWorkRole() || this.isLineCheckRole();
		},
		/**
		 * 核线标定
		 */
		isTrackStandardRole: function(){
			return window._systemType == 7 || window._systemType == 8 || window._systemType == 9;
		},
		/*
		 * 车高标定
		 * */
		isTrackHeightRole: function () {
			return window._systemType == 8;
        },
        /*
        * 标定-控制点
        * */
        isTrackControlPointRole: function () {
            return window._systemType == 9;
        },
		// 角色权限相关
		// authorize
		// 要素保存
		authEditSave: function(){
            // 20190412 标定控制点，允许保存
            if(iD.User.isTrackControlPointRole()){
                return true;
            }
			// 20180824 历史任务允许保存；
			return iD.util.urlParamHistory() 
				|| this.isAuditRole() 
				|| this.isWorkRole() 
				|| this.isCheckRole() 
				|| this.isVerifyRole() 
				|| this.isLinearRole()
                || this.isPrecisionRole()
                || this.isQualityAssessorRole();
		},
		//用户校色查看质检标记
		authQueryTag: function() {
			// 20180824 历史任务允许查询；
			return iD.util.urlParamHistory() 
				|| this.isAuditRole() 
				|| this.isWorkRole() 
				|| this.isCheckRole() 
				|| this.isVerifyRole() 
				|| this.isLinearRole()
				|| this.isPrecisionRole();
		},
		// 轨迹
		authTrail: function(){
			return true;
		},
		// 轨迹图片
		authTrailPicture: function(){
			return true;
		},
		// 轨迹识别成果
		authTrailIdentify: function(){
			return true;
		},
		// 轨迹点图片测量、反投、前方交汇
		authTrailDraw: function(){
			return true;
		},
		// 质检报表
		authCheckReportForm: function(){
			return true;
		},
		// 处理质检结果
		authCheckResultHandle: function(){
			return true;
		},
		// 触发质检
		authCheckTrigger: function(){
			return true;
		}
		/*
		// 有融合角色，没有编辑角色
		isFusionRole: function(){
			return isRoleAuth(ROLE.FUSION) && !isRoleAuth(ROLE.EDIT);
		},
		// 编辑
		isEditRole: function(){
			return isRoleAuth(ROLE.EDIT);
		},
		// 管理员
		isManagerRole: function(){
			return isAuthManager();
		},
		// 识别
		isRecognitionRole: function(){
			return isRoleAuth(ROLE.RECOGNITION);
		},
        // 传统编辑
        isTraditionalEditRole: function(){
            return isRoleAuth(ROLE.TRADITIONALEDIT);
        },
		// 采集
		isSurveyRole: function(){
			return isRoleAuth(ROLE.SURVEY);
		},
		// 质检
		isEditCheckRole: function(){
			return isRoleAuth(ROLE.EDIT_CHECK);
		},
		// 质检作业系统，同时登录用户有质检角色
		isEditCheckSystemAndRole: function(){
			return isRoleAuth(ROLE.EDIT_CHECK) && iD.util.urlParamSystemType() == "5";
		},
		isImageTagRole: function(){
			return isRoleAuth(ROLE.IMAGE_TAG);
		},
		authEditSave: function(){
			// 质检、图像标记，也可以保存
			return isAuthManager() || isRoleAuth(ROLE.EDIT) || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.EDIT_CHECK) || isRoleAuth(ROLE.IMAGE_TAG);
		},
		// 轨迹
		authTrail: function(){
			return isAuthManager()  || isRoleAuth(ROLE.EDIT) || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.RECOGNITION) || isRoleAuth(ROLE.SURVEY) || isRoleAuth(ROLE.EDIT_CHECK) || isRoleAuth(ROLE.IMAGE_TAG);
		},
		// 轨迹图片
		authTrailPicture: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.RECOGNITION) || isRoleAuth(ROLE.SURVEY) || isRoleAuth(ROLE.EDIT_CHECK) || isRoleAuth(ROLE.IMAGE_TAG);
		},
		// 轨迹识别成果
		authTrailIdentify: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.RECOGNITION) || isRoleAuth(ROLE.EDIT_CHECK) || isRoleAuth(ROLE.IMAGE_TAG);
		},
		// 轨迹点图片测量、反投、前方交汇
		authTrailDraw: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.EDIT_CHECK) || isRoleAuth(ROLE.IMAGE_TAG);
		},
		// 质检报表
		authCheckReportForm: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION)|| isRoleAuth(ROLE.EDIT_CHECK);
		},
		// 处理质检结果
		authCheckResultHandle: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.EDIT_CHECK);
		},
		// 触发质检
		authCheckTrigger: function(){
			return isAuthManager() || isRoleAuth(ROLE.EDIT)  || isRoleAuth(ROLE.FUSION) || isRoleAuth(ROLE.EDIT_CHECK);
		}
		*/
	};
	
	var ouc = {
		user: null,
		oauth2User: function(){
			return iD.config.URL.kd_auth_server;
		},
//		clientId: "c1ebe466-1cdc-4bd3-ab69-77c3561b9dee",
//		clientSecret: "d8346ea2-6017-43ed-ad68-19c0f971738b",
		clientId: "client",
		clientSecret: "secret",
		tokenKey: "utoken",
		tokenExpiresKey: "utoken_expires",
		tokenName: "utoken_name",
		tokenDomain: (function(){
			var domain = "";
			/*
			if(location.hostname==="localhost"){
				domain = "localhost";
			}else if(location.hostname.indexOf("com") > -1){
				domain = ".ishowchina.com";
			}else {
				domain = location.hostname;
			}
			*/
			domain = location.hostname;
			
			return domain;
		})(),
		/**
		 * 设置cookie，expires为秒数
		 * @param {Object} key
		 * @param {Object} value
		 * @param {Object} expires null或者-1为删除
		 */
		_cookie: function(key, value, expires){
			if(!$.cookie){
				return null;
			}
			var result = null;
			if(value==null&&expires==null){
				result = $.cookie(key);
				if(!isNotNull(result) || (""+result).toLocaleLowerCase()==="null"){
					this._cookie(key, null, -1);
				}
			}else{
				if(expires == null || expires == -1){
					// 过期时间1天的cookie会在浏览器端直接删除
					expires = -1*60*60*24;
				}
				expires = parseInt(expires);
				expires = this.getTimezoneDate(expires);
				result = $.cookie(key, (value || ""), {domain: this.tokenDomain, path: "/", expires: expires });
			}
			return result;
		},
		tokenCookie: function(value, expires){
			return this._cookie(this.tokenKey, value, expires);
		},
		timeCookie: function(value, expires){
			return this._cookie(this.tokenExpiresKey, value, expires);
		},
		nameCookie: function(value, expires){
			return this._cookie(this.tokenName, value, expires);
		},
		/**
		 * @param expiresSec 秒数
		 * @param isadd 若为true则在当前时间的基础上增加n秒，默认true
		 */
		getTimezoneDate: function(expiresSec, isadd){
			if(isadd==null){
				isadd = true;
			}
			var expires = null;
			if(isadd){
				expires = new Date(new Date().getTime()+(expiresSec*1000));
			}else{
				expires = new Date(expiresSec*1000);
			}
			/*
			// 与格林威治时间的时间差（单位为分钟）
			var diff = new Date().getTimezoneOffset();
			var date = new Date(expires.getTime() - (diff*60*1000));
			*/
			var date = expires;
			return date;
		},
		_logout: function(){
			this.tokenCookie(null, -1);
			this.timeCookie(null, -1);
			this.nameCookie(null, -1);
			this.user = null;
			_renderUserHtml && _renderUserHtml();
		},
		_loginPage: function (path) {
			// oauth2登录，使用access_token参数，在调用接口的请求中使用
			$.oauth2Client.begin({
				authorizeUrl: ouc.oauth2User() + "oauth/authorize",
				clientId: ouc.clientId,
				redirectUri: path || getNoHashUrl()
			});
		}
	}
	
	function getNoSearchUrl() {
		return window.location.origin + window.location.pathname;
	}
	
	function getNoHashUrl(){
		return window.location.href.split("#")[0];
	}
	
	function isNotNull(str) {
		return str != null && $.trim(str) != "";
	}
	
	function oAuthLoginPage(){
		/*
		var pageUrl = iD.config.URL.kd_auth_server + "login";
		var link = document.createElement("a");
		link.href = pageUrl;
		var $link = d3.select(link).style({
			display: "block",
			position: "absolute",
			"z-index": -9,
			top: 0,
			left: 0,
			width: 60,
			height: 20,
			background: "transparent"
		});
		d3.select("body").append($link);
		link.click();
		*/
		var url = window.location.href;
		window.location.hash = '';
		var codeReg = /&code=[^&#]*|&{0}code=[^&#]*&?/g;
		ouc._loginPage( url.replace(codeReg, "") );
	}
	
	// oauth2登录跳转回当前页面时会携带code参数
	// 检查code ==> access_token
	// var toCheckUser = iD.User.isOauthLogin;
//	var toCheckUser = true;
	/*
	var code = iD.url.getUrlParam("code");
	if(code!=""&& !isNotNull(ouc.tokenCookie())){
		$.oauth2Client.end({
			code : code,
			clientId: ouc.clientId,
			clientSecret: ouc.clientSecret,
			accessTokenUrl: ouc.oauth2User() + "/token",
		},function(accessToken,expiresSec){
			debugger ;
			if(accessToken==null||expiresSec==null){
				return ;
			}
			ouc.tokenCookie(accessToken, expiresSec);
			ouc.timeCookie(expiresSec, expiresSec);
			window.location.href = getNoSearchUrl();
		},function(XMLHttpRequest, textStatus, errorThrown){
			// 失效
			ouc.tokenCookie(null, -1);
			ouc.timeCookie(null, -1);
			toCheckUser = false;
		});
		
	}
	*/
	
	/**
	 * 判断是否登录，没有登录则跳回登录页面
	 */
	iD.User.checkUserLoginStatus = function(){
		var self = this;
		// if(self.isOauthLogin){
		// 	d3.json(iD.config.URL.kd_auth_server + "user").get(function(error, data){
		// 		if(!data){
		// 			oAuthLoginPage();
		// 			return ;
  //               }
                
		// 		iD.User._oauthLogin(data);
		// 	});
  //       }
        // var userString = '{"authorities":[{"authority":"edit_check"},{"authority":"fusion"},{"authority":"rec"},{"authority":"edit"},{"authority":"prod_group_leader"}],"details":{"remoteAddress":"10.11.5.40","sessionId":"D8D16EAB927A450DB8ABE823F5114362"},"authenticated":true,"principal":{"userId":787651159,"username":"edit_lead1","password":"887f8e7ac9a478642684200d5b1776792a5bc53650dd84adc9935cde","showname":"edit_lead1","officeCode":"01001002","roles":["edit_check","fusion","rec","edit","prod_group_leader"],"authorities":[{"authority":"edit_check"},{"authority":"fusion"},{"authority":"rec"},{"authority":"edit"},{"authority":"prod_group_leader"}],"enabled":true,"accountNonLocked":true,"credentialsNonExpired":true,"accountNonExpired":true},"credentials":null,"name":"edit_lead1"}';
        // var userString = '{"authorities":[{"authority":"edit_check"},{"authority":"fusion"},{"authority":"rec"},{"authority":"edit"},{"authority":"prod_group_leader"}],"details":{"remoteAddress":"10.11.5.40","sessionId":"D8D16EAB927A450DB8ABE823F5114362"},"authenticated":true,"principal":{"userId":1212164637,"username":"worker_hwl","password":"6325e116421652fdeeed84c81ec673e951ba6cd5377b3557a08575a2","showname":"worker_hwl","officeCode":"01001","roles":["work"],"authorities":[{"authority":"work"}],"enabled":true,"accountNonLocked":true,"credentialsNonExpired":true,"accountNonExpired":true},"credentials":null,"name":"worker_hwl"}';
        // var userString = '{"authorities":[{"authority":"work"}],"details":{"remoteAddress":"192.168.7.22","sessionId":"8D064F77E612CD5EE9D8E383EB3EDB13"},"authenticated":true,"principal":{"userId":766372114,"username":"worker1","password":"35dfe5f0ee3303ea7bd2d43e0ad30112d9c38f178d8e750f099c243b","showname":"worker1","officeCode":null,"roles":["work"],"accountNonLocked":true,"authorities":[{"authority":"work"}],"enabled":true,"accountNonExpired":true,"credentialsNonExpired":true},"credentials":null,"name":"worker1"}';
		// var userString = '{"authorities":[{"authority":"check"}],"details":{"remoteAddress":"192.168.7.22","sessionId":"79E0AA84B6CD32DD6AB7E62AFF785A01"},"authenticated":true,"principal":{"userId":1283307144,"username":"checker1","password":"dd0cc0d52e23de4485010e6130e77591af12e21f3f20f102a0b7e005","showname":"checker1","officeCode":null,"roles":["check"],"enabled":true,"credentialsNonExpired":true,"accountNonLocked":true,"accountNonExpired":true,"authorities":[{"authority":"check"}]},"credentials":null,"name":"checker1"}';
		// var userString = '{"authorities":[{"authority":"work"}],"details":{"remoteAddress":"192.168.7.22","sessionId":"31D607D9BF691590C45F45106E8650F4"},"authenticated":true,"principal":{"userId":674718710,"username":"worker2","password":"02aacd4799a0855a7fc8d529acb3f3815c9a89db4f6dbf4d128c8033","showname":"worker2","officeCode":null,"roles":["work"],"enabled":true,"credentialsNonExpired":true,"accountNonLocked":true,"accountNonExpired":true,"authorities":[{"authority":"work"}]},"credentials":null,"name":"worker2"}';
		
		// 80 user
		// var userString = '{"authorities":[{"authority":"fusion"},{"authority":"edit_check"},{"authority":"rec"},{"authority":"edit"},{"authority":"prod_group_leader"}],"details":{"remoteAddress":"10.11.5.80","sessionId":"78252947DADF61BA0DC43C915EF867D5"},"authenticated":true,"principal":{"userId":787651159,"username":"edit_lead1","password":"27b4058d37ce81ad985d10016540b943fe85d3be38e7f40c304daac9","showname":"edit_lead1","officeCode":null,"roles":["fusion","edit_check","rec","edit","prod_group_leader"],"authorities":[{"authority":"fusion"},{"authority":"edit_check"},{"authority":"rec"},{"authority":"edit"},{"authority":"prod_group_leader"}],"enabled":true,"accountNonLocked":true,"credentialsNonExpired":true,"accountNonExpired":true},"credentials":null,"name":"edit_lead1"}';
		// var userString = '{"authorities":[{"authority":"Operator"},{"authority":"work"}],"details":{"remoteAddress":"10.11.5.80","sessionId":"334A9FEB79E6B113CCE1BC563B5D35ED"},"authenticated":true,"principal":{"userId":1080098857,"username":"xiaofeili","password":"22bcfcc40ae6ad8f4ff6a8c07c7f80f37d07ef635c379b86a58c50da","showname":"xiaofeili","officeCode":null,"roles":["Operator","work"],"authorities":[{"authority":"Operator"},{"authority":"work"}],"enabled":true,"accountNonLocked":true,"credentialsNonExpired":true,"accountNonExpired":true},"credentials":null,"name":"xiaofeili"}';
		var userString = '{"authorities":[{"authority":"Operator"},{"authority":"work"}],"details":{"remoteAddress":"10.11.5.80","sessionId":"D588AAF1ED5633667F57AB8B4A16AEEC"},"authenticated":true,"principal":{"userId":1080098857,"username":"xiaofeili","password":"22bcfcc40ae6ad8f4ff6a8c07c7f80f37d07ef635c379b86a58c50da","showname":"xiaofeili","officeCode":null,"roles":["Operator","work"],"authorities":[{"authority":"Operator"},{"authority":"work"}],"enabled":true,"credentialsNonExpired":true,"accountNonExpired":true,"accountNonLocked":true},"credentials":null,"name":"xiaofeili"}';
		// var userString = '{"authorities":[{"authority":"check"}],"details":{"remoteAddress":"10.11.5.80","sessionId":"32616C00D0814E7A940B43BAC15723A2"},"authenticated":true,"principal":{"userId":783749514,"username":"zouyangyangzj","password":"1e35bfbc0124c3fc001b8e9c8fddd7abcc33a8150a9a1ce91e12cb8e","showname":"邹洋洋","officeCode":null,"roles":["check"],"authorities":[{"authority":"check"}],"enabled":true,"credentialsNonExpired":true,"accountNonExpired":true,"accountNonLocked":true},"credentials":null,"name":"zouyangyangzj"}';
        iD.User._oauthLogin(JSON.parse(userString));
	}
	
	d3.rebind(iD.User, dispatch, 'on');
})(iD);

