/*
 * @Author: tao.w
 * @Date: 2020-11-06 15:01:35
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-18 14:47:05
 * @Description: 
 */
/**
 * boot.js -- config.json配置文件，获取接口
 */
(function() {
	$.ajax( {
	    type : "get",
	    url : './config.json',
	    async : false,
//	    data : {},
	    success : function(data) {
	    	window.version = "v3.2.5";
	    	window.cookie_type = false;
	    	window.config_url = {
	    		'pdds': data.pdds,
	    		'krs': data.krs,
	    		'mainshoot': data.mainshoot,
	    		'datasets': data.datasets,
	    		'datasets2d': data.datasets2d,
	    		'vector_tile': data.vector_tile,
	    		'datasets_adcode': data.datasets_adcode,
	    		'z_height': data.z_height,
	    		'nantong': data.business.nantong,
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
