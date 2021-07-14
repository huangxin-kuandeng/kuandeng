/*
 * 流程监控界面的质检功能-----可查看原始数据检查错误报告、采集数据检查错误报告
 */

var origDataCheckBatch,				//原始数据质检---批次id
	surveyCheckBatch,					//采集数据质检---批次id
	seqId;								//子流程操作id
var taskCheck = {
//	通过任务详细信息获取批次id
	check: function(openUrl,taskId,batchName){
//      不存在当前的环节时,则为历史流程,历史流程查询任务详情的接口变化
		if(!window.operation){
			var urlTask = window.kms+"history/historic-process-instances?includeProcessVariables=true&businessKey="+taskId;
		}else{
			var urlTask = window.kms+"runtime/process-instances?includeProcessVariables=true&businessKey="+taskId;
		};
//      点击检查按钮--图标时,会查询任务的详细信息,并获取任务batch批次id
//		获取当前任务的详细信息
		$.ajax( {
		    type : "get",
		    url : urlTask,
		    async : false,
		    data : {},
			success : function(data){
				if(data.data.length == 0){
				    return;
				}
				for(var i=0; i<data.data[0].variables.length; i++){
				    if(data.data[0].variables[i].name == "origDataCheckBatch"){
//				    	采集数据质检批次id
				    	origDataCheckBatch = data.data[0].variables[i].value;
				    }else if(data.data[0].variables[i].name == "surveyCheckBatch"){
//				    	原始数据质检批次id
		    			surveyCheckBatch = data.data[0].variables[i].value;
		    		}
		    	}
//				执行检查报告的展示
				taskCheck.DataCheck(openUrl,taskId,batchName);
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   	},
		});
	},
	
//	错误报告展示功能
	DataCheck: function(openUrl,taskId,batchName){
		if(openUrl == "OrigDataCheck"){
			if(!origDataCheckBatch){
				return;
			}
			var hText = "文件路径";
//			origDataCheckBatch---为采集数据质检-----查询轨迹错误报告
			var batchUrl = window.Kcs_survey_origdata+"origdata/list?taskId="+taskId+"&batchId="+origDataCheckBatch+"&pageSize=100";
		}else if(openUrl == "SurveyDataCheck"){
			if(!surveyCheckBatch){
				return;
			}
			var hText = "轨迹点Id";
//			surveyCheckBatch---原始数据质检-----查询原始数据错误报告
			var batchUrl = window.Kcs_survey+"track/list?taskId="+taskId+"&batchId="+surveyCheckBatch+"&pageSize=100";
		};
				
//		获取错误报告并用列表的形式展示出来
    	$.ajax( {
        	type : "get",
		    url : batchUrl,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取错误报告失败
	        	if(data.code != "0"){
	        		return;
	        	}
	        	var dataBatch = data.result.result;
//	        	新增一个模版,用来保存列表-表格
            	var batchModel = ` 
				<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
					<div class="modal-dialog" role="document" style="margin: 0 auto;">
						<div class="modal-content" style="padding:0px;min-height:auto;">
							<div class="modal-header" style="padding:10px;">
							    <button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.modalClose()">
							        <span aria-hidden="true">&times;</span>
							    </button>
							    <h4 class="modal-title">${batchName}错误报告</h4>
							</div>
							<div class="modal-body" style="padding:0;height:auto;max-height:350px;overflow:hidden;width:100%;">	
								<table id="example2" class="table table-bordered table-hover">
						            <thead style="font-weight:bold;">
						                <tr>
							                <th>错误信息</th>
							                <th>${hText}</th>
						                </tr>
						            </thead>
							        <tbody>
						                ${dataBatch.map(d => `
								            <tr>
									            <td title="${d.errorMsg}">${d.errorMsg}</td>
									            <td title="${d.filePath || d.trackPointId || '空'}">${d.filePath || d.trackPointId || "空"}</td>
								            </tr>
						                `).join('')}
							        </tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
            	`;
//          	模版显示
				$('.testmodalSon').html(batchModel);
				$('.testmodalSon .modal1.fade').addClass("in");
				$('.testmodalSon .modal1.fade').fadeIn(200);
//				table列表的属性样式等
            	$('#example2').DataTable({
	    			'language'    : window.lang,
	                'paging'      : true,
	                'lengthChange': false,
	                'searching'   : false,
	                'ordering'    : false,
	                'info'        : true,
	                'autoWidth'   : false,
	                "lengthMenu"  : [5]
            	})
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
	},
	
//	获取所点击的子流程获取其详细信息
	stop: function(processInstanceId){
		var runtimeSonUrl = window.kms+"runtime/process-instances?includeProcessVariables=true&id="+processInstanceId;
		var historySonUrl = window.kms+"history/historic-process-instances?includeProcessVariables=true&id="+processInstanceId;
		var instansId = processInstanceId+"_Seq";
		$.ajax( {
		    type : "get",
		    url : runtimeSonUrl,
		    async : false,
		    data : {},
		    success : function(data){
		    	if(!data || (data.size == 0)){
		    		return ;
		    	}
				    	
//				获取对应历史子流程/或当前子流程的实例id与流程id
		    	for(var i=0; i<data.data.length; i++){
		    		for(var l=0; l<data.data[i].variables.length; l++){
		    			if( instansId && (instansId == data.data[i].variables[l].name) ){
					    	seqId = data.data[i].variables[l].value;
		    			}
		    		}
		    	}
				    
				taskCheck.stopTrue(seqId,instansId);
	
	    	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   	},
		});
	},
	
//	子流程操作的模板
	stopTrue: function(seqId,instansId){
		var seqModel =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.modalClose()">
					          	<span aria-hidden="true">&times;</span>
					        </button>
			        		<h4 class="modal-title">任务子流程处理 (谨慎操作) </h4>
			      		</div>
			      		<div class="modal-body">
							<!------------------------------------确认分配或取消------------------------------------>
							<div class="form-group" style="border:none;margin-top:15px;">
								<button type="button" class="btn btn-danger sonButton" title="停止" onclick="taskCheck.stopModel('${seqId}','${instansId}',false)">停止(慎点)</button>
								<button type="button" class="btn btn-info sonButton" title="完成" onclick="taskCheck.stopModel('${seqId}','${instansId}',true)">完成(慎点)</button>
								<button type="button" class="btn btn-default sonButton" title="取消" onclick="taskManage.modalClose()">取消</button>
							</div>

			      		</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodalSon').html(seqModel);
		$('.testmodalSon .modal1.fade').addClass("in");
		$('.testmodalSon .modal1.fade').fadeIn(200);
	},
	
//	子流程的操作--停止与完成功能
	stopModel: function(value,id,key){
		if(key){
//			完成子流程的环节
		    $.ajax({
		        type : "post",
			    url : window.kms+"task/complete?seq="+value,
		        async : false,
				contentType: "application/json; charset=utf-8",
		        data : JSON.stringify(_data),
		        success : function(data) {
		        	taskManage.modalClose();
		        },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
			   	},
		    });
		}else{
//			停止子流程的环节
			$.ajax( {
			    type : "get",
			    url : window.kms+"task/stop?seq="+value,
			    async : false,
			    data : {},
			    success : function(data){
		        	taskManage.modalClose();
			    },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
			   	},
			});
		}
	},
	
//	融合任务的对比功能报表展示
	Contrast: function(batchId){
		$.ajax( {
		    type : "get",
		    url : window.Kcs_fusion+"compare/report/list?batchId="+batchId,
		    async : false,
		    data : {},
		    success : function(data){
		    	var batchList = data.result.result;
				if(batchList.length == 0){
					return;
				}
				var batchIds = batchList[0].batchId;
//	        	新增一个模版,用来保存列表-表格
            	var batchModel = ` 
				<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
					<div class="modal-dialog" role="document" style="margin: 0 auto;">
						<div class="modal-content" style="padding:0px;min-height:auto;">
							<div class="modal-header" style="padding:10px;">
							    <button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.modalClose()">
							        <span aria-hidden="true">&times;</span>
							    </button>
							    <h4 class="modal-title">融合任务对比报告(批次Id:${batchIds})</h4>
							</div>
							<div class="modal-body" style="padding:0;height:auto;max-height:350px;overflow:hidden;width:100%;">	
								<table id="example2" class="table table-bordered table-hover">
						            <thead style="font-weight:bold;">
						                <tr>
							                <!-- <th>batchId</th> -->
							                <th>id</th>
							                <th>type</th>
							                <th>precisionRate</th>
							                <th>recallRate</th>
							                <th>threshold</th>
							                <th>version</th>
						                </tr>
						            </thead>
							        <tbody>
						                ${batchList.map(d => `
								            <tr>
									            <!-- <td title="${d.batchId}">${d.batchId}</td> -->
									            <!-- <td title="${util.Time(d.createTime)}">${util.Time(d.createTime)}</td> -->
									            <td title="${d.id}">${d.id}</td>
									            <td title="${d.type}">${d.type}</td>
									            <td title="${d.precisionRate}">${d.precisionRate}</td>
									            <td title="${d.recallRate}">${d.recallRate}</td>
									            <td title="${d.threshold}">${d.threshold}</td>
									            <td title="${d.version}">${d.version}</td>
									            <!-- <td title="${util.Time(d.updateTime)}">${util.Time(d.updateTime)}</td> -->
								            </tr>
						                `).join('')}
							        </tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
            	`;
//          	模版显示
				$('.testmodalSon').html(batchModel);
				$('.testmodalSon .modal1.fade').addClass("in");
				$('.testmodalSon .modal1.fade').fadeIn(200);
//				table列表的属性样式等
            	$('#example2').DataTable({
	    			'language'    : window.lang,
	                'paging'      : true,
	                'lengthChange': false,
	                'searching'   : false,
	                'ordering'    : false,
	                'info'        : true,
	                'autoWidth'   : false,
	                "lengthMenu"  : [5]
            	})
	        	
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
		   	},
		});
	}
	
	
}
