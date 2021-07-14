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
			
			// data = {"url":{"kcs_fusion":"http://192.168.7.22:13540/kcs-fusion/","kcs_survey":"http://192.168.7.22:13520/kcs-survey/","kcs_survey_origdata":"http://192.168.7.22:13510/kcs-survey-origdata/","kd_auth_server":"http://192.168.7.22:13920/kd-auth-server/","kd_log_server":"http://192.168.7.22:13960/kd-log-server/","kds_osis":"http://192.168.7.22:13230/kds-osis/","kms":"http://192.168.7.22:13310/kms-v2/","kms_v2":"http://192.168.7.22:13310/kms-v2/","kpms":"http://192.168.7.22:13410/kpms/","krms":"http://192.168.7.22:14100/krms/","krs":"http://192.168.7.26:13200/krs/","kus":"http://192.168.7.22:10130/kus/","mark_image":"http://192.168.8.16:9527/test/","web_editor":"http://192.168.7.22:13920/web_editor/","web_editor_imgtag":"http://192.168.7.22:13920/web_editor_imgtag/"}}
	    	window.version = 'mark/v1.3.6';
//         	用户登录(OAuth)
			window.Kus = data.url.kus;
//         	OAuth登录
			window.Kd_auth_server = data.url.kd_auth_server;//"http://192.168.5.34:33920/kd-auth-server/"
//			编辑/融合/识别系统
			window.Web_editor = data.url.web_editor_imgtag;
//			获取文件所需要的变量(获取编辑器的文件，地图相关)
			window.WEB_EDITOR = data.url.web_editor;
//			window.WEB_EDITOR = "http://192.168.5.34:33920/web_editor_khy";
//			监控界面下方输出日志
			window.Ws = data.url.ws;
//			任务系统
//			window.kms = data.url.kms;
			window.kms = data.url.kms_v2 || 'http://192.168.5.34:33320/kms-v2/';
			// window.kms = 'http://192.168.7.22:13310/kms-v2/';
			window.kms_old = data.url.kms;
//			标注系统V2

			window.kms_v2 = data.url.kms_v2 || 'http://192.168.7.22:13310/kms-v2/';//'http://192.168.5.34:33320/kms-v2/';
			// window.kms_v2 = 'http://192.168.7.22:13310/kms-v2/';
			// window.kms_v2 = 'http://192.168.7.22:13310/kms-v2/';
//			获取标注图片
			window.mark_image = data.url.mark_image || "http://192.168.8.16:9527/test/";
			
//			人员系统
			window.Kpms = data.url.kpms;
//			shp数据
			window.shpUrl = data.url.kds_osis;
//			任务轨迹相关
			window.KrsUrl = data.url.krs;
//			ftp管理
			window.Ftp = data.url.krms;
//			监控界面检查相关
			window.Kcs_survey_origdata = data.url.kcs_survey_origdata;
			window.Kcs_survey = data.url.kcs_survey;
//			http请求日志
			window.Kd_log_server = data.url.kd_log_server;
			window.Kcs_fusion = data.url.kcs_fusion;

			window.configURL = {
								"map": data.url.baseMap || "http://mre.gzproduction.com/tile?mid=basemap_day&get=map&cache=true&p=2&x={x}&{x}&y={y}&z={z}",
								"nation_url": data.url.nation_url ||  "http://mre.gzproduction.com/tile?mid=nation&x={x}&y={y}&z={z}&cache=false",
				//				地图图层utm带
								"utmMap" : data.url.utmMap || "http://mre.gzproduction.com/tile?mid=utm&f=png&scale=1&cache=false&z={z}&x={x}&y={y}&t=1531212822146",
				//				任务区域层
								"bridge_url": data.url.bridge_url || "http://mre.gzproduction.com/tile?mid=bridge&x={x}&y={y}&z={z}&cache=false",
				//				行政区划
								"quhua_url": data.url.division_url || "http://mre.gzproduction.com/tile?mid=xingzhengquhua&f=png&scale=1&cache=true&z={z}&x={x}&y={y}",
				//              任务框底图
								"taskFrame_url": data.url.taskFrame_url || "http://mre-v2.gzproduction.com/tile?lid=lane_line_merge&get=lane_line_merge&cache=off&businesstype=1&collectiontype=0&version=6&z={z}&x={x}&y={y}"
								,
				//				轨迹图层
								"map_track_url": data.url.map_track_url || "http://mre-v2.gzproduction.com/tile?lid=track_base&get=track&cache=off&isFilterBlackTrack=true&isFilterBlackTask=true&z={z}&x={x}&y={y}&t=1543817994295"
								,
				//				城市采集状态
								"surveyStatus_url": data.url.surveyStatus_url,
				//				项目相关根据城市或者图幅跑任务
								"kss_automap_fullauto": data.url.kss_automap_fullauto || "http://192.168.5.74:9002/kss-automap-fullauto/",
								"kss": data.url.kss || "http://kss.gzproduction.com/kss/",
				//				任务系统
								"bach" : data.url.bach || "http://10.11.5.71:17800/bach/",
				//				生产平台
								"haydn" : data.url.haydn || "http://haydn.gzproduction.com/haydn/",
								"muses" : data.url.muses || "http://muses.gzproduction.com/muses/",
				//	    		任务框服务接口
			 					"task_frame" : data.url.task_frame || "http://task-frame-mgt.gzproduction.com/",
							
								"kms_v2" :  data.url.kms_v2 || 'http://192.168.7.22:13310/kms-v2/'
			}
	    },
	   	error: function(XMLHttpRequest, textStatus, errorThrown) {
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
	   	},
	});
})();
