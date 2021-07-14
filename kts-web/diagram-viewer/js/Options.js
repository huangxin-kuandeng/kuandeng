/*
 * 
 * 页面加载完成时触发的初始化
 * 
 */


var DiagramGenerator = {},
	pb1;
window.operation = 0;
window.TaskName = null;
window.activitySonId = false;

//$(document).ready(function(){
function activityReady(processDefinitionId,processInstanceId,taskId,junge){
	
	monitor.highlightJunge = junge;
	
    if( (processDefinitionId.indexOf("S-ServiceProcess") >= 0) ){
    	$("#lastReturn").css("display","block");
    }else{
    	$("#lastReturn").css("display","none");
    }
	
	DiagramGenerator = {};
	ProcessDiagramGenerator._activities = [];
	pb1 = null;
	ProcessDiagramGenerator.processDiagrams = {};		//初始化内容数据

	var	openUrl,									//所点击的流程环节
		batchName,									//环节中文名称
  		processDefinitionId = processDefinitionId,
  		processInstanceId = processInstanceId,
  		taskId = taskId;
  	mainLog.highLightTime = null;

    $.ajax( {
        type : "get",
        url : window.kms+"history/historic-activity-instances?processInstanceId="+processInstanceId+"&size=1000",
        async : false,
        data : {},
        success : function(data) {
        	window.TimeEvent = data.data;
        },
	   	error: function(XMLHttpRequest, textStatus, errorThrown) {
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
	   	},
    });
//	初始化时的高亮效果
  	pb1 = new $.ProgressBar({
	    boundingBox: '#pb1',
	    label: 'Progressbar!',
	    on: {
      		complete: function() {
//      	console.log("Progress Bar COMPLETE");
	        this.set('label', 'complete!');
		        if (processInstanceId) {
		        	ProcessDiagramGenerator.drawHighLights(processInstanceId);
		        }
	      	},
	      	valueChange: function(e) {
	        	this.set('label', e.newVal + '%');
	      	}
    	},
    	value: 0
  	});
	
//	定时进行高亮刷新(环节变化的展示效果--3s一次)
	mainLog.highLightTime = setInterval(function(){
		if(monitor.highlightJunge){
	  		ProcessDiagramGenerator.drawHighLights(processInstanceId);
		}
	},3000)
	
//	console.log("Progress bar inited");

  	ProcessDiagramGenerator.options = {
	    diagramBreadCrumbsId: "diagramBreadCrumbs",
	    diagramHolderId: "diagramHolder",
	    diagramInfoId: "diagramInfo",
	    on: {
//  		流程的点击触发事件
      		click: function(canvas, element, contextObject){
		        var mouseEvent = this;
		        console.log("[CLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
		        openUrl = element.id;
		        handelFlag.batchName = contextObject.properties.name;				//当前环节的中文显示名称

        		if ( (contextObject.getProperty("type") == "callActivity") ) {
//      			判断进入子流程或者查看检查报告
        			if( (openUrl == "OrigDataCheck") || (openUrl == "SurveyDataCheck") ){
        				handelFlag.handelModel(taskId, element, contextObject, processInstanceId);
        			}else{
        				handelFlag.handelSon(processInstanceId,contextObject.id,taskId)
        			}
        			
		          	var processDefinitonKey = contextObject.getProperty("processDefinitonKey");
		          	var processDefinitons = contextObject.getProperty("processDefinitons");
		          	var processDefiniton = processDefinitons[0];
		          	console.log("Load callActivity '" + processDefiniton.processDefinitionKey + "', contextObject: ", contextObject);

        		}else if( (contextObject.getProperty("type") == "userTask") && (openUrl == window.operation) ){
//      			分配任务--任务处理功能
					if( (openUrl == "MarkQC") || (openUrl == "MarkAcceptance") ){
		        		util.errorView("请在我的任务进行操作！");
		        		return;
					}else if(openUrl == "MarkHandle"){
		        		util.errorView("请在标注软件进行标注！");
		        		return;
					}
					taskManage.init(processInstanceId);
        		}else if( (contextObject.getProperty("type") != "callActivity") && ((openUrl == "OrigDataCheck") || (openUrl == "SurveyDataCheck")) ){
//      			监控界面的错误报告
					taskCheck.check(openUrl,taskId,batchName);
        		}else if( window.activitySonId && (contextObject.getProperty("type") == "receiveTask") && (openUrl == window.operation) ){
//      			子流程异常处理
					taskCheck.stop(processInstanceId);
        		}else if( (contextObject.getProperty("type") == "userTask") && openUrl && (!window.operation) ){
//      			分配任务--任务处理功能
					taskManage.initHistory(processInstanceId,openUrl);
        		}else{
        			//...
        		}
      		},
			
//			鼠标的右键点击事件
	      	rightClick: function(canvas, element, contextObject){
		        var mouseEvent = this;
		        console.log("[RIGHTCLICK] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
	      	},
      
//			鼠标的滑上事件(原本是会执行show事件--并在右侧显示除该环节的详细信息,因为会影响到布局并不需要该功能,已去除)
	      	over: function(canvas, element, contextObject){
	        	var mouseEvent = this;
//        		console.log("[OVER] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);

        		// TODO: show tooltip-window with contextObject info
//      		ProcessDiagramGenerator.showActivityInfo(contextObject);
      		},
      
//			鼠标的离开事件
	      	out: function(canvas, element, contextObject){
	        	var mouseEvent = this;
//        		console.log("[OUT] mouseEvent: %o, canvas: %o, clicked element: %o, contextObject: %o", mouseEvent, canvas, element, contextObject);
//     		 	ProcessDiagramGenerator.hideInfo();
        
      		}
    	},
    	
//  	判断是否为子流程
/*
  	    log: function(){
	        if( (processDefinitionId.indexOf("S-ServiceProcess") >= 0) ){
	        	ProcessDiagramGenerator.options.diagramHolderId = "diagramSon";
	        }else{
	        	ProcessDiagramGenerator.options.diagramHolderId = "diagramHolder";
	        }
	    },
*/

  	};

//	判断是否为子流程
//  ProcessDiagramGenerator.options.log();

//	关键性的事件回调(highLight为高亮)
	ActivitiRest.options = {
	    processInstanceHighLightsUrl: window.kms+"process-instance/"+processInstanceId+"/highlights?callback=?",
	    processDefinitionUrl: window.kms+"process-definition/"+processDefinitionId+"/diagram-layout?callback=?",
	    processDefinitionByKeyUrl: window.kms+"process-definition/"+processDefinitionId+"/diagram-layout?callback=?",
	};

	if(processDefinitionId) {
//		延时执行监控界面(加载速度过快时,会导致某些环节不显示)
		var definitionTime = setTimeout(function(){
			ProcessDiagramGenerator.drawDiagram(processDefinitionId);
			clearTimeout(definitionTime);
		},100)
	    
	}else{
//  	alert("processDefinitionId parameter is required");
	}

};
//});

