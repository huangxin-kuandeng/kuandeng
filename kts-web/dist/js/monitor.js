/*
 * 
 * 监控界面的模版(可复用)
 * 
 */
var monitor = {
	
	highlightJunge: null,
	
	monitorIds: {},
	
	monitorInit: function(task){
//		得到所有的参数
		var taskName = monitor.monitorIds['taskName'];
		var processDefinitionId = monitor.monitorIds['processDefinitionId'];
		var processInstanceId = monitor.monitorIds['processInstanceId'];
		var taskId = monitor.monitorIds['taskId'];
		
//		监控界面的模板
	    var templ =`
	     	<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
	          	<div class="modal-dialog task-dialog" >
	            	<div class="modal-content task-modal-content">
	              		<div class="modal-header flowing-header">
	                		<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose(${task},true)">
	                  			<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	                		</button>
	                		<h4 class="modal-title">${taskName}</h4>
	              		</div>
	              		<div class="modal-body flowing-modal-body">
		              		<!-- 监控界面 -->
							<div style="height:100%;">
		              			<!-- 流程展示界面 -->
							    <div id="canvas" >
		              				<!-- 返回上一步  返回到父流程 -->
							    	<div id="lastReturn">
										<a class='btn btn-primary' title='返回' href='#' onclick='mainLog.lastReturn("${processDefinitionId}","${processInstanceId}","${taskId}")'>
											<i class='fa fa-mail-reply'></i>
										</a>
							    	</div>
		              				<!-- 流程模版展示 -->
									<div class="wrapper" style="overflow: hidden;background-color:#fff;">
									  	<div id="overlayBox" >
									    	<div id="diagramHolder" class="diagramHolder"></div>
									    	<div class="diagram-info" id="diagramInfo"></div>
									    	<div class="testmodalSon"></div>
										  	<div class='devicemodal'></div>
									  	</div>
									</div>
						    	</div>
		              			<!-- websocket日志界面 -->
							    <div id="log-container"></div>
							</div>
	              		</div>
	            	</div>
	          	</div>
	        </div>
	    `;
	    $('.testmodal').html(templ);
	    $('#modal-default').modal({
	        show:true
	    });
//		去执行日志输出/监控流程图
		if(task == "History"){
//			mainLog.activityOpen = null;			//判断日志是否加载完成
			mainLog.processInstanceId = processInstanceId;			//防止加载时间过长时，日志串行
			mainLog.containerLog(processDefinitionId,processInstanceId,taskId,false);
		}else{
//			mainLog.activityOpen = null;			//判断日志是否加载完成
			mainLog.processInstanceId = processInstanceId;			//防止加载时间过长时，日志串行
			mainLog.containerLog(processDefinitionId,processInstanceId,taskId);
		}
//		main.batchInfos(taskId,true);
	}
}
