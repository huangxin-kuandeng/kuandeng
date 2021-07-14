//点击标注历史
$(".manageHistory").click(function(){
	$('.content-header h1').text('标注历史');
	manageHistory.Table();
})
//标注系统的历史列表--可以进行导出统计
var manageHistory = {
	
	taskName: null,
	
	taskId: null,
	
	searchType: {
		"taskAssignee"			: null,
		"taskDefinitionKey"		: null,
		"processDefinitionKey"	: null,
		"taskCompletedAfter"	: null,
		"taskCompletedBefore"	: null
	},
	
	handelFlag: {
		"true" : "是",
		"false" : "否"
	},
	
//	标注历史的模版列表
	Table: function(value=false){
		var startTime = "",
			endTime = "";
		if(value){
			startTime = manageHistory.searchType["taskCompletedAfter"];
			endTime = manageHistory.searchType["taskCompletedBefore"];
		}
		
//  	标注历史列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        <div class="box box-warning">
	        <div class="box-header">
	        <div class="buttons"></div>
	        <h3 class="box-title">标注历史列表</h3>
	    </div>
	    <!-- 
	    <div class="searchType" style="padding-left:10px;">
	        <input type="text" id="taskId" class="form-control" placeholder="任务号" onfocus="this.placeholder=''" onblur="this.placeholder='任务号'" style="float:left;width:130px;margin:0px 5px;" />
	    </div>
	     -->
	    <div class="searchType" style="padding-left:10px;">
	        <input type="text" id="taskAssignee" class="form-control" placeholder="用户名" onfocus="this.placeholder=''" onblur="this.placeholder='用户名'" style="float:left;width:130px;margin:0px 5px;" />
	    </div>
	    
        <div id="taskDefinitionKey" style="float:left;margin-left:10px;">
			<select class="form-control" style="width:120px;float:left;">
	            <option value="">所有任务</option>
		        <!-- <option value="SelectHandle">图片选取</option> -->
		        <option value="MarkHandle">标注作业</option>
		        <option value="MarkQC">标注质检</option>
		        <option value="MarkAcceptance">标注验收</option>
		        <option value="MarkPublish">发布成功</option>
            </select>
        </div>

		<!--标记起始时间-->
		<div class="form-group dataTime">
            <div class="input-group date col-sm-5">
              	<div class="input-group-addon">
                	<i class="fa fa-calendar"></i>
              	</div>
              	<input type="text" name="startTime" class="form-control pull-right time" id="taskCompletedAfter" value="${startTime}" readonly>
            </div>
            <div class="part">至</div>
            <div class="input-group date col-sm-5">
              	<div class="input-group-addon">
                	<i class="fa fa-calendar"></i>
              	</div>
              	<input type="text" name="endTime" class="form-control pull-right time" id="taskCompletedBefore" value="${endTime}" readonly>
            </div>
        </div>
	    <!-- 确认进行条件过滤 -->
	    <div id="searchButton">
			<button type="button" class="btn btn-success" onclick="manageHistory.manageHistorySearch(true);">搜索</button>
	    </div>
	    <!-- 获取列表的最新数据 -->
	    <div id="processDefinitionKey" style="right:130px;position:absolute;">
			<select class="form-control mark-activity" onchange="manageHistory.activityChange()">
	            <option value="A-Select_Mark-M">标注流程(默认)</option>
		        <option value="M-Survey_Select-S">选取流程(仅支持查看)</option>
            </select>
		</div>
	    <div id="export" style="right:10px;">
			<button type="button" class="btn btn-warning" onclick="manageHistory.manageHistorySearch(false)">导出文件</button>
	    </div>
	    <!-- /.box-header -->
	    <div class="box-body myTaskBody">
		    <table id="example2" class="table table-bordered table-hover">
		        <thead>
			        <tr>
			            <th>ID</th>
			            <th>名称</th>
			            <th>当前环节</th>
			            <th>环节创建时间</th>
			            <th>环节结束时间</th>
			            <th>处理人</th>
			            <!-- <th>创建者</th> -->
			            <th>操作</th>
			        </tr>
		        </thead>
		    </table>
	    </div>
	    <!-- /.box-body -->
	    </div>
	    <!-- /.box -->
	    
	    <!-- /.box -->
	    </div>
	    <!-- /.col -->
	    </div>
	    <!-- /.row -->
	    `;

    	$('.content.container-fluid').html(test1);
//		日期选择器的语言修改为中文格式的
	    $('.time').datepicker({
	    	format: 'yyyy-mm-dd',
	    	autoclose: true,
	    	language: "zh-CN"
	    });

//		初始化表格(我的任务列表的属性)
    	var table = $("#example2").DataTable({
	    	'language'    : window.lang,
	        'searching'   : false,								//原生搜索
	        'paging'      : true,
	        'lengthChange': false,
	        'ordering'    : false,
	        'info'        : true,
	        'autoWidth'   : false,
	        "aaSorting"	  : false,
        	'processing'  : true,  								//隐藏加载提示,自行处理
        	'serverSide'  : true,  								//启用服务器端分页
			fnDrawCallback: function(table) {
				var _input = `
	            	<input type="text" class="form-control jumpPage" title="输入页码,回车跳转" placeholder="跳转页码" style="float:right;width:75px;padding:4px;margin:2px 10px;" />
				`;
				$("#example2_paginate").append(_input);
				$('.jumpPage').keyup(function(e) {
					if(e.keyCode == 13){
						var _page = 0;
						if($(".jumpPage").val() && $(".jumpPage").val() > 0) {
							_page = $(".jumpPage").val() - 1;
						}
						$('#example2').DataTable().page(_page).draw(false);
					}
                });
            },
	        ajax: function (data, callback, settings) {
//				封装请求参数
	            param.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;						//开始的记录序号
	            param.page = (data.start / data.length)+1;		//当前页码
				var manageHistoryURL = window.kms+"query/historic-task-instances?size=10&sort=endTime&order=desc&start="+param.start;
				
				var queryData = {
					"includeProcessVariables":true,
//					"includeTaskLocalVariables":true,
					"finished":true,
					"processDefinitionKey":"A-Select_Mark-M",
//					"taskAssignee":"tag_marker1",
//					"taskCompletedAfter":"2018-03-07",
//					"taskCompletedBefore":"2018-03-08",
					"variables" : [
//						{
//							"name" : "taskId",
//							"value" : "2018-03-07",
//							"operation" : "",
//							"type" : "string"
//						}
					]
				};
				
//				标注任务管理列表条件环节过滤
				if(value){
					for(var item in manageHistory.searchType){
						if(manageHistory.searchType[item] != ""){
//							根据多条件搜索
							queryData[item] = manageHistory.searchType[item];
							if( (item == "taskDefinitionKey") || (item == "processDefinitionKey") ){
//								回显搜索条件
								for(var j=0; j<$("#"+item+" select option").length; j++) {
									if($("#"+item+" select option")[j].value == manageHistory.searchType[item]) {
										$("#"+item+" select option")[j].selected = true;
									}
								}
							}else{
								$("#"+item).val(manageHistory.searchType[item]);
							}
						}
					}
				}
//				使用post请求我的任务列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "POST",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: manageHistoryURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
				    data : JSON.stringify(queryData),
	                success: function (result) {
	                	taskData1 = result;
	                    var returnData = {};
	                    returnData.recordsTotal = result.total;				//返回数据全部记录
	                    returnData.recordsFiltered = result.total;			//后台不实现过滤功能，每次查询均视作全部结果
	                    returnData.data = result.data;						//返回的数据列表
//						调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
//						此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    	callback(returnData);
	                }
	           	});
	        },
//			我的任务列表的数据展示
        	columns: [
//      		第一列----taskID----显示
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskId"){
								var taskId1 = row.variables[i].value || "";
			    			}
						}
					    return	taskId1 || "";
					}, 
					"class": "ids"
				},
//      		第二列----任务名称----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName1 = row.variables[i].value || "";
			    			}
						}
						
					    return	taskName1 || "";
					    
					},
					"class": "names"
				},
//      		第五列----当前环节----显示
	            {
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						var activityName1 = row.name || "";
					    return	activityName1 || "";
					}, 
					"class": "activity" 
	            },
//      		第六列----创建时间----显示
	            {
	            	"data": "startTime", 
	              	"render": function ( data, type, row,  meta ) {
						var startTime1 = util.Time(row.startTime);
						
					    return	startTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },
//      		第七列----完成时间----显示
	            {
	            	"data": "endTime", 
	              	"render": function ( data, type, row,  meta ) {
						var endTime1 = util.Time(row.endTime);
						
					    return	endTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },
//      		第八列----处理人----显示
	            { 
	            	"data": "assignee",
	              	"render": function ( data, type, row,  meta ) {
						var assignee = row.assignee || ""
					    return	assignee || "";
					}, 
					"class": "assignee"
				},
//      		第九列----操作按钮----显示
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
					    var taskDefinitionKey1 = row.taskDefinitionKey;
						var taskTitle = row.name;
						var selectModel = "";
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName = row.variables[i].value || "";
			    			}else if(row.variables[i].name == "taskId"){
								var taskId = row.variables[i].value || "";
			    			}
						}
						
						if( (row.processDefinitionId.indexOf("M-Survey_Select-S") >= 0) ){
							selectModel = `
								<a class='btn btn-warning' title='查询' href='#' data-dtaskName='${taskName}' data-dtaskId='${taskId}' onclick='manageHistory.selectTasks(event)'>
									<i class='glyphicon glyphicon-tasks'></i>
								</a>
							`;
						}
						var centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dtaskId='${taskId}' onclick='manageHistory.flowingModale2(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
							${selectModel}
						`;
				    	return  centerModel;
					},
					"class": "center"
	            }
	        ]
	        
	    });
	},
	
//  标注历史任务的预览功能(监控界面)
    flowingModale2: function(e){
	    var activityTaskId  = e.currentTarget.getAttribute('data-dId');
	    var taskId  = e.currentTarget.getAttribute('data-dtaskId');
	    $.ajax( {
	        type : "get",
	        url : window.kms+"history/historic-task-instances/"+activityTaskId,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取所需要的监控界面所需要的参数
				monitor.monitorIds = {
					taskName			: "历史任务 ( "+taskId+"--"+data.name+" )",
					processDefinitionId : data.processDefinitionId,
					processInstanceId 	: data.processInstanceId,
					taskId 				: taskId
				}
				monitor.monitorInit('manageHistory');
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
    },
	
	selectTasks: function(e,value=""){
	    var taskName  = e.currentTarget.getAttribute('data-dtaskName') || manageHistory.taskName;
	    var taskId  = e.currentTarget.getAttribute('data-dtaskId') || manageHistory.taskId;
		var templModel = `
	     	<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
	          	<div class="modal-dialog task-dialog" style="margin:100px auto;height:75%;">
	            	<div class="modal-content task-modal-content" style="height:auto;">
	            		
		    		</div>
		    	</div>
			</div>
		`;
	    var templTable = ` 
    		<div class="box-header">
        		<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
          			<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
        		</button>
    			<h3 class="box-title">${taskName}--${taskId}</h3>
			</div>

	        <div class="finishType" style="padding-left:10px;float:left;margin:10px 0px;">
				<select class="form-control" style="width:200px;float:left;">
		            <option class="change" value="all">所有任务</option>
		            <option class="change" value="true">已完成任务</option>
		            <option class="change" value="false">未完成任务</option>
	            </select>
	        </div>
		    <div class="box-body">
			    <table id="example3" class="table table-bordered table-hover">
		            <thead>
		                <tr>
			                <th>ID</th>
			                <th>当前环节</th>
			                <th>轨迹ID</th>
			                <th>轨迹点ID</th>
			                <th>图片路径(原始)</th>
		                </tr>
		            </thead>
			    </table>
			</div>
	    `;
	    
	    if(value == ""){
			manageHistory.taskName = taskName;
			manageHistory.taskId = taskId;
	    	$('.testmodal').html(templModel);
	    }else if(value == "all"){
	    	value = "";
	    }
	    $('.testmodal .task-modal-content').html(templTable);
	    $('#modal-default').modal({
	        show:true
	    });
//		搜索的过滤添加
		var queryData = {
			"includeProcessVariables":true,
			"processDefinitionKey":"A-Select_Mark-M",
			"finished":value,
			"variables" : [
				{
					"name" : "sourceTaskId",
					"value" : taskId,
					"operation" : "equals",
					"type" : "string"
				}
			]
		};
//		记忆上次搜索操作的保存
		for(var j=0; j<$(".finishType select option").length; j++) {
			if($(".finishType select option")[j].value == value) {
				$(".finishType select option")[j].selected = true;
			}
		}
	    
//		初始化当前任务列表(列表的属性与属性值)
	    var table = $("#example3").DataTable({
	    	'language'    : window.lang,
	        'searching'   : false,								//原生搜索
	        'paging'      : true,
	        'lengthChange': false,
	        'ordering'    : false,
	        'info'        : true,
	        'autoWidth'   : false,
	        "aaSorting"	  : false,
        	'processing'  : true,  								//隐藏加载提示,自行处理
        	'serverSide'  : true,  								//启用服务器端分页
            "lengthMenu"  : [15], //每页显示几条数据
	        ajax: function (data, callback, settings) {
	            param1.limit = 15;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param1.start = data.start;						//开始的记录序号
	            param1.page = (data.start / data.length)+1;		//当前页码
				var manageHistoryURL = window.kms+"query/historic-process-instances?size=15&sort=endTime&order=desc&start="+param1.start;
				
//				获取当前的所有任务(由于接口为字符串排序,所以暂时由前端进行排序分页)
	            $.ajax({
	                type: "POST",
                	url: manageHistoryURL,
				    async : false,
					contentType: "application/json; charset=utf-8",
				    data : JSON.stringify(queryData),
	                success: function (result) {
	                	if(!result.data){
	                		util.errorView(result.message,false);
	                		return;
	                	}
	                    var returnData1 = {};
	                    returnData1.recordsTotal = result.total;				//返回数据全部记录
	                    returnData1.recordsFiltered = result.total;				//后台不实现过滤功能，每次查询均视作全部结果
	                    returnData1.data = result.data;							//返回的数据列表
//						调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
//						此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
	                    callback(returnData1);
	                },
				   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
				   	},
	           	});
	       	},
//			列表表头字段
	        columns: [
//	      		第一列----taskID----显示
	            {
	            	"data": "name",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskId"){
								var taskId1 = row.variables[i].value;
			    			}
						}
					    return	taskId1 || "";
					}, 
					"class": "taskId"
				},
//	      		第二列----当前环节----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "activityName"){
								var activityName1 = row.variables[i].value;
				    		}
						}
					    return	activityName1 || "";
					}, 
					"class": "activityName" 
	            },
//	      		第三列----轨迹ID----显示
	            { 
	            	"data": "name", 
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "trackIds"){
								var trackIds = row.variables[i].value;
				    		}
						}
					    return	trackIds || "";
					}, 
	            	"class":"trackIds" 
	            },
//	      		第四列----轨迹点ID----显示
	            { 
	            	"data": "name", 
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "TRACKPOINTID"){
								var trackPointId = row.variables[i].value;
				    		}
						}
					    return	trackPointId || "";
					}, 
	            	"class":"trackPointId" 
	            },
//	      		第四列----轨迹点ID----显示
	            { 
	            	"data": "name", 
	              	"render": function ( data, type, row, meta ) {
	              		var trackIds = null;
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "TRACKPOINTID"){
								var trackPointId = row.variables[i].value;
				    		}else if(row.variables[i].name == "trackIds"){
								trackIds = row.variables[i].value;
				    		}
						}
						var centerModel = "";
						if(trackPointId){
							var imageUrl = window.mark_image+"image/get?trackPointId="+trackPointId+"&trackId="+trackIds+"&type=00&seq=004&imageType=jpg"
							centerModel = `
								<a class='imageUrl' title='查看该标注任务的原始图片' href='${imageUrl}' target="view_window">查看图片</a>
							`;
						}

					    return	centerModel || "";
					}, 
	            	"class":"centerModel" 
	            }
	        ]  
	    });
//		点击下拉框过滤已完成和未完成
	    $(".finishType select").on('change', function () {
	    	var finishType = $('.finishType option:selected').val();
	    	manageHistory.selectTasks(event,finishType);
	    })
	},
	
//	根据流程来过滤查找
	activityChange: function(){
		var markValue = $(".mark-activity option:selected").val();
		manageHistory.searchType = {
			"taskAssignee"			: null,
			"taskDefinitionKey"		: null,
			"processDefinitionKey"	: markValue,
			"taskCompletedAfter"	: null,
			"taskCompletedBefore"	: null
		}
		if(markValue == "A-Select_Mark-M"){
			manageHistory.Table();
		}else{
			manageHistory.Table(true);
		}
	},
	
//	根据过滤条件搜索
	manageHistorySearch: function(value){
		manageHistory.searchType = {
			"taskAssignee"			: $("#taskAssignee").val(),
			"taskDefinitionKey"		: $("#taskDefinitionKey option:selected").val(),
			"processDefinitionKey"	: "A-Select_Mark-M",
			"taskCompletedAfter"	: $("#taskCompletedAfter").val(),
			"taskCompletedBefore"	: $("#taskCompletedBefore").val()
		}
		if(value){
			manageHistory.Table(true);
		}else{
			manageHistory.Export();
		}
	},
	
//	数据导出excel表
	Export: function(){
		var queryString = "";
		var queryData = {
			"includeProcessVariables":true,
			"includeTaskLocalVariables":true,
			"finished":true
		};
				
//		标注任务管理列表条件环节过滤
		for(var item in manageHistory.searchType){
			if(manageHistory.searchType[item] != ""){
//				根据多条件搜索
				queryData[item] = manageHistory.searchType[item];
				if(item == "taskDefinitionKey"){
//					回显搜索条件
					for(var j=0; j<$("#taskDefinitionKey select option").length; j++) {
						if($("#taskDefinitionKey select option")[j].value == manageHistory.searchType[item]) {
							$("#taskDefinitionKey select option")[j].selected = true;
						}
					}
				}else{
					$("#"+item).val(manageHistory.searchType[item]);
				}
			}
		}
//		使用get请求下载excel文件
		for(var item in queryData){
			if(item == "includeProcessVariables"){
				queryString += (item+"="+queryData[item]);
			}else{
				queryString += ("&"+item+"="+queryData[item]);
			}
		}
		window.open(window.kms+"activitiCollection/export/historic-task-instances?size=5000&sort=endTime&order=desc&start=1&"+queryString);
	}
	
}