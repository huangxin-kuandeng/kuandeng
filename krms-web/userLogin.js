(function(){
    //验证地址--修改为当前项目的auth_server地址（不经过代理的）
    var Kd_auth_server = window.Kd_auth_server;
    //跳转登录地址
//  var login_html = Kd_auth_server + 'login';
    //增加定时器，定时查询token是否失效
    var default_token_time = 1000 * 60 * 20;
//  var default_token_time = 1000;
	
//	token信息初始化
	function tokenInit(){
		refresh_token( check_token );
	}
	
//	刷新token有效期-重置(获取checktoken)
	function refresh_token(callback){
        let token = _get('token') || get_localStorage('refresh_token') || null;
        if(!token){
        	jump_login_html();
        	return;
        }
        var ajax_url = Kd_auth_server + 'oauth/token?grant_type=refresh_token&client_id=client&client_secret=secret&refresh_token=' + token;
        //重置token的有效时间
    	$.ajax( {
        	type : 'POST',
            url : ajax_url,
	        async : true,
	        data : {},
	        success : function(data) {
                if(data.error){			//无效token则进入跳转事件
		   			alert(data.error);
                	jump_login_html();
                }else{
                    config_localStorage('check_token', data.access_token);
                    config_localStorage('refresh_token', data.refresh_token);
                }
                callback && callback();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		alert('token接口请求失败：oauth/token?grant_type=refresh_token');
                jump_login_html();
		   	},
	    });
	}
	
//	检查token-验证有效期
    function check_token(){
        let token = get_localStorage('check_token') || null;
        if(!token){
        	jump_login_html();
        	return;
        }
		
        var ajax_url = Kd_auth_server + 'oauth/check_token?token=' + token;
        //查询token是否有效
    	$.ajax( {
        	type : 'GET',
            url : ajax_url,
	        async : true,
	        data : {},
	        success : function(data) {
                if(data.error){			//无效token则进入跳转事件
		   			alert(data.error);
                	jump_login_html();
                }else{
                    config_localStorage('check_token', token);
                }
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		alert('token接口请求失败：oauth/check_token');
                jump_login_html();
		   	},
	    });
    }
	
//  登出用户
    function out_login(callback){
		var loginType;
		loginType = confirm('确认退出当前用户吗?'); 		//在页面上弹出对话框
		if( loginType ){
			config_localStorage('check_token');
			config_localStorage('refresh_token');
			jump_login_html();
		};
    }
	
	//跳转登录界面--根据当前环境拼接登录地址（如果地址栏存在token字段则去除）
	function jump_login_html(){
//		return
		let html = Kd_auth_server + 'login',
			histroy_html = funcUrlDel('token'),
			new_html = html + '?redirect_uri=' + histroy_html;
		window.open(new_html, '_self');
	}
	
    //获取地址栏query参数方法
    function _get(name){
        var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
	
    //获取指定名称的localStorage
    function get_localStorage(name){
    	if(name){
    		let value = window.localStorage.getItem(name) || null;
			return value;
    	}
    }
    
    //删除url地址栏相应参数
	function funcUrlDel(name){
	    var loca = window.location;
	    var baseUrl = loca.origin + loca.pathname + '?';
	    var query = loca.search.substr(1);
	    if (query && query.indexOf(name)>-1) {
	        var obj = {}
	        var arr = query.split('&');
	        for (var i = 0; i < arr.length; i++) {
	            arr[i] = arr[i].split('=');
	            obj[arr[i][0]] = arr[i][1];
	        };
	        delete obj[name];
	        var url = baseUrl + JSON.stringify(obj).replace(/[\'\{\}]/g,'').replace(/\:/g,'=').replace(/\,/g,'&');
	        return url;
	    }else{
	    	return loca;
	    };
	}
	
    //设置或删除指定名称的localStorage
    function config_localStorage(name,value=''){
    	if(name && value){
    		window.localStorage.setItem(name, value);
    	}else if(name){
    		window.localStorage.removeItem(name);
    	}
    }
	
	//定时查询token是否有效
    var check_time_token = setInterval(refresh_token, default_token_time);
    tokenInit();
    //抛出变量、方法
    window.out_login = out_login;
    window.jump_login_html = jump_login_html;
    window.get_localStorage = get_localStorage;
    
    
})();