/**
 * map editor CSS and JS library
 */
(function() {
//	获取url配置文件( config配置文件，获取接口   )
	$.ajax( {
	    type : "get",
	    url : window._init_url,
	    async : false,
	    data : {},
	    success : function(data) {
	    	window.webVersion = 'v1.0.9';
			//dev
			window.configURL ={
				"baseMap": "http://10.11.5.77:13340/tile?mid=basemap_day&get=map&cache=true&p=2&x={x}&{x}&y={y}&z={z}",
				"kcms": "http://192.168.7.28:23370/kcms/",
				"kd_auth_server": "http://192.168.7.28:13920/kd-auth-server/",
				"kd_regionsearch": "http://192.168.7.28:13970/kd-regionsearch/",
				"kpms": "http://192.168.7.28:13410/kpms/",
				"krms": "http://192.168.7.28:14100/krms/",
				"kcms_mre": "http://192.168.7.28:8081/tile/",
				
				"kcms_dev": "http://192.168.5.34:33370/kcms/"
			};
			//prod
	    	// window.configURL = {

			// 	'baseMap': data.url.baseMap,					//baseMap底图
			// 	'kcms': data.url.kcms,							//采集监控
			// 	'kd_auth_server': data.url.kd_auth_server,		//OAuth登录
			// 	'kd_regionsearch': data.url.kd_regionsearch,	//识别轨迹
			// 	'kpms': data.url.kpms,							//用户系统
			// 	'krms': data.url.krms,							//设备系统
			// 	'kcms_mre': data.url.kcms_mre				//kcms_mre渲染服务
				
	    	// };
	    	window.cn_lang = {
			    "sProcessing": "加载中...",
				"sLengthMenu": "显示 _MENU_ 项结果",
				"sZeroRecords": "没有匹配结果",
				"sInfo": "第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			  	"sInfoEmpty": "第 0 至 0 项结果，共 0 项",
			  	"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			  	"sInfoPostFix": "",
			  	"sSearch": "搜索:",
			  	"sUrl": "",
			  	"sEmptyTable": "空",
			  	"sLoadingRecords": "载入中...",
			  	"sInfoThousands": ",",
			  	"oPaginate": {
			      	"sFirst": "&lt;&lt;",
			      	"sPrevious": "&lt;",
			      	"sNext": "&gt;",
			      	"sLast": "&gt;&gt;"
			  	}

			};
	    },
	   	error: function(XMLHttpRequest, textStatus, errorThrown) {
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
	   	},
	});
})();