/**
 * boot.js -- config.json配置文件，获取接口
 */
(function() {
	$.ajax( {
	    type : "get",
	    url : './config.json',
	    async : false,
	    data : {},
	    success : function(data) {
	    	window.version = "v1.1.0";
	    	window.cookie_type = false;
	    	window.config_url = {
	    		'pdds': data.pdds,
	    		'krs': data.krs,
	    		'key': data._oooo_oooo_,
	    		'cookie': data.cookie || '.kuandeng.com'
	    	}
	    	
	    	if( window.location.hostname.indexOf(data.cookie) > -1 ){
	    		window.cookie_type = true
	    	}
	    },
	   	error: function(XMLHttpRequest, textStatus, errorThrown) {
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
	   	},
	});
})();