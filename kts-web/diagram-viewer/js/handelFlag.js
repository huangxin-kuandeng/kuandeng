
var handelFlag = {
	
	batchName: null,
	
	handelModel: function(taskId, element, contextObject, processInstanceId){
        var openUrl = element.id;
        handelFlag.batchName = contextObject.properties.name;				//当前环节的中文显示名称
        var activityId = contextObject.id;							//环节名称
		var callActivityModel = `
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.modalClose()">
					          	<span aria-hidden="true">&times;</span>
					        </button>
			        		<h4 class="modal-title">操作选择 </h4>
			      		</div>
			      		<div class="modal-body">
							<!------------------------------------确认分配或取消------------------------------------>
							<div class="form-group" style="border:none;margin-top:15px;">
								<button type="button" class="btn btn-info handelButton" title="进入子流程" onclick="handelFlag.handelSon('${processInstanceId}','${activityId}','${taskId}')">进入子流程</button>
								<button type="button" class="btn btn-danger handelButton" title="查看检查报告" onclick="taskCheck.check('${openUrl}','${taskId}','${handelFlag.batchName}')">查看检查报告</button>
								<button type="button" class="btn btn-default handelButton" title="取消" onclick="taskManage.modalClose()">取消</button>
							</div>

			      		</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodalSon').html(callActivityModel);
		$('.testmodalSon .modal1.fade').addClass("in");
		$('.testmodalSon .modal1.fade').fadeIn(1);
	},
	
	
	
	handelSon: function(processInstanceId,activityId,taskId){
		taskManage.modalClose();
//      子流程的点击进入事件
//		通过点击的是否为当前环节，来判断查找的为当前流程或是历史流程
		var runtimeSonUrl = window.kms+"runtime/process-instances?includeProcessVariables=true&superProcessInstanceId="+processInstanceId+"&activityId="+activityId+"&size=100";
		var historySonUrl = window.kms+"history/historic-process-instances?includeProcessVariables=true&superProcessInstanceId="+processInstanceId+"&activityId="+activityId+"&size=100";
//		实例ID与流程ID
		var instansId, defindId;
//		点击的环节是否存在当前流程当中,不存在则取历史中查找
		$.ajax( {
		    type : "get",
		    url : runtimeSonUrl,
		    async : false,
		    data : {},
		    success : function(data){
		    	if(!data || (data.size == 0)){
		    		historySon();
		    	}else{
//					获取对应历史子流程/或当前子流程的实例id与流程id
			    	for(var i=0; i<data.data.length; i++){
			    		for(var l=0; l<data.data[i].variables.length; l++){
			    			if(handelFlag.batchName == data.data[i].variables[l].value){
						    	instansId = data.data[i].id;
						    	defindId = data.data[i].processDefinitionId;
			    			}
			    		}
			    	}
		    	}

//				判断是否找到相对应的id/并执行相对应的事件(存在则显示子流程，不存在则不作操作)
		    	if(!instansId || !defindId){
		    		historySon();
		    	}else{
					clearTimeout(mainLog.highLightTime); 
					$("#diagramHolder").html("");
		    		activityReady(defindId,instansId,taskId,true);
		    	}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   	},
		});

//		点击的环节是否存在历史流程当中
		function historySon(){
			$.ajax( {
			    type : "get",
			    url : historySonUrl,
			    async : false,
			    data : {},
			    success : function(data){
			    	if(!data || (data.size == 0)){
			    		return ;
			    	}
//					获取对应历史子流程/或当前子流程的实例id与流程id
			    	for(var i=0; i<data.data.length; i++){
			    		for(var l=0; l<data.data[i].variables.length; l++){
			    			if(handelFlag.batchName == data.data[i].variables[l].value){
						    	instansId = data.data[i].id;
						    	defindId = data.data[i].processDefinitionId;
			    			}
			    		}
			    	}
			    	if(!instansId || !defindId){
			    		return;
			    	}else{
						clearTimeout(mainLog.highLightTime); 
						$("#diagramHolder").html("");
		    			activityReady(defindId,instansId,taskId,false);
			    	}
			    },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
			   	},
			});
		};
		
	}
	
}
