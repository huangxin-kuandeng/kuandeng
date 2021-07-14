/*
 * 
 * 监控界面的websocket日志输出
 * 
 */
//var websocket = null;

var mainLog = {

	highLightTime: null,		//定时监控界面高亮的变化
	
	logTime: null,		//定时监控界面高亮的变化
	
	taskId: null,				//任务taskId
	
	lastTime: "",				//日志请求所需传输时间
	
//	初始化事件(变量/参数/地址/日志...的初始化)
	containerLog: function(processDefinitionId,processInstanceId,taskId,junge = true){
//		初始化数据
		mainLog.lastTime = "";
		mainLog.taskId = taskId;
		mainLog.logTime = setInterval(function(){
			mainLog.ws();
		},3000);
		activityReady(processDefinitionId,processInstanceId,taskId,junge);
	},
	
//	执行日志(第一次获取所有日志，第二次加上时间条件，根据事件请求最新的日志)
	ws: function(){
        $.ajax({
            type: "GET",
    		url : window.Kd_log_server+"kms/log/query?taskId="+mainLog.taskId+mainLog.lastTime,
		    async : false,
			contentType: "application/json; charset=utf-8",
            success: function (result) {
            	if(!result.result){
	                util.errorView(result.message,false);
            		return;
            	}
            	for(var i=0; i<result.result.length; i++){
            		
            		var timeText = "[taskId_" + mainLog.taskId + "] <span style='width:210px;display:inline-block;white-space:nowrap;'>" + util.Millisecond(new Date(result.result[i].time)) + "</span> ------------------ ";
            		
            		var logText = timeText + result.result[i].message;
					$("#log-container").append(logText + "</br>");
					$("#log-container").scrollTop( $('#log-container')[0].scrollHeight );
            	}
            	if(result.result.length != 0){
            		mainLog.lastTime = "&time=" + result.result[result.result.length - 1].time;
            	}
            }
       	});
	},
	
//	返回上一步,即返回到父流程
	lastReturn: function(defindId,instansId,taskId){
		$("#diagramHolder").html("");
		clearTimeout(mainLog.highLightTime); 
		var returnTime = setTimeout(function(){
			activityReady(defindId,instansId,taskId,true);
			clearTimeout(returnTime)
		},100)
	},
}
/*
var websocket = null;

var mainLog = {
	processInstanceId: null,
	
	highLightTime: null,
	
	closeJunge : false,
	
//	初始化事件(变量/参数/地址/日志...的初始化)
//	containerLog: function(processDefinitionId,processInstanceId,taskId){
	containerLog: function(processDefinitionId,processInstanceId,taskId,junge = true){
//		初始化数据
		mainLog.processInstanceId = processInstanceId;
		mainLog.closeJunge = true;

		if(junge){
    		mainLog.ws();
		}
		activityReady(processDefinitionId,processInstanceId,taskId,junge);
	},
//	websockt执行日志
	ws: function(){
//  	指定websocket路径
//      websocket = new WebSocket(window.Ws+mainLog.processInstanceId+'.log');
        websocket = new WebSocket(window.Ws+mainLog.processInstanceId+'.log');
        websocket.onopen = function(){
            $("#log-container").append('日志连接成功<br>');
        };
//      websocket发生错误时
        websocket.onerror = function(){
			console.log("连接错误");
        };
//      websocket连接关闭时
        websocket.onclose = function(){
			console.log("连接关闭");
        };
//      websocket有返回消息时
        websocket.onmessage = function(event) {
//          接收服务端的实时日志并添加到HTML页面中   
//			var date1 = new Date().getTime();
			$("#log-container").append(event.data);
        	$("#log-container").scrollTop( $('#log-container')[0].scrollHeight );
       		console.log(websocket.readyState);
        };
	},

	logs: function(instanceId){
		console.log(instanceId)
	},
	

//	返回上一步,即返回到父流程
	lastReturn: function(defindId,instansId,taskId){
		$("#diagramHolder").html("");
		clearTimeout(mainLog.highLightTime); 
		setTimeout(function(){
			activityReady(defindId,instansId,taskId,true);
		},100)
		
	},
	
}
*/
