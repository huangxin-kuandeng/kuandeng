//点击标注历史
$(".releaseTask").click(function(){
	$('.content-header h1').text('待返修任务');
	releaseTask.createTasks = {};
	releaseTask.Table();
})
//标注系统的历史列表--可以进行导出统计
var releaseTask = {
	
	createTasks: {},
	
	errorTypes: [{
		"name"	: "默认选择",
		"value"	: ""
	}],
	
	searchType: {
		"startedAfter"	: null,
		"finishedBefore": null,
		"ERRORTYPE"		: null
	},
	
	errorType: {
		"0"	: "其他",
		"1"	: "Ignore",
		"2"	: "车道标线-白色",
		"3"	: "左侧车道边缘线",
		"4"	: "右侧车道边缘线",
		"5"	: "纵向减速标线",
		"6"	: "专用车道标线",
		"7"	: "停止线",
		"8"	: "减速让行标线",
		"9"	: "减速标线/减速带",
		"10": "人行横道",
		"11": "路面连接带",
		"13": "出入口标线",
		"14": "文字符号箭头类",
		"15": "导流线（鱼刺线）",
		"16": "停止网格标线",
		"17": "车距确认标线",
		"18": "道路",
		"19": "车辆及路面上其他物体",
		"20": "虚拟车道线-路缘石",
		"21": "虚拟车道线-凸型屏障",
		"22": "虚拟车道线-其他",
		"23": "潮汐车道线",
		"24": "左弯待转区线",
		"25": "可变导向车道线",
		"26": "车道标线-黄色",
		"27": "减速丘"
	},
	
//	返修任务的模版列表
	Table: function(value=false){
		var startTime = "",
			endTime = "";
//  	返修任务列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        	<div class="box box-warning">
	        		<div class="box-header">
	        			<div class="buttons"></div>
	        			<h3 class="box-title">待返修任务列表</h3>
	    			</div>
					<!--标记起始时间-->
					<!-- 
					<div class="form-group dataTime">
			            <div class="input-group date col-sm-5">
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" name="startTime" class="form-control pull-right time" id="startedAfter" value="${startTime}" readonly>
			            </div>
			            <div class="part">至</div>
			            <div class="input-group date col-sm-5">
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" name="endTime" class="form-control pull-right time" id="finishedBefore" value="${endTime}" readonly>
			            </div>
			        </div>
			         -->
					<!--标注任务的错误类型-->
					<div class="form-group ERRORTYPE">
						<div class="" id="ERRORTYPE">
							<select class="form-control">
			    				${releaseTask.errorTypes.map(f => `
				            		<option value="${f.value}" title="${f.name}">${f.name}</option>
			    				`).join('')}
							</select>
						</div>
					</div>
	    			<!-- 确认进行条件过滤 -->
				    <div id="searchButton">
						<button type="button" class="btn btn-success" onclick="releaseTask.returnTaskSearch();">搜索</button>
				    </div>
				    <div id="export" style="right:10px;">
						<button type="button" class="btn btn-warning" onclick="releaseTask.createTask()" data-toggle='modal' data-target='.modal1'>任务返修</button>
				    </div>
	    			<div class="box-body myTaskBody">
					    <table id="example2" class="table table-bordered table-hover">
					        <thead>
						        <tr>
						            <th>选择</th>
						            <th>ID</th>
						            <th>名称</th>
						            <th>当前环节</th>
						            <!-- 
						            <th>环节创建时间</th>
						            <th>环节结束时间</th>
						             -->
						            <th>错误类型</th>
						            <th>查看图片</th>
						            <th>操作</th>
						        </tr>
					        </thead>
					    </table>
	    			</div>
	    		</div>
	    	</div>
	    </div>
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
	        ajax: function (data, callback, settings) {
//				封装请求参数
	            param.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;						//开始的记录序号
	            param.page = (data.start / data.length)+1;		//当前页码
				var returnTaskURL = window.kms+"query/process-instances?size=10&sort=id&order=desc&start="+param.start;
				
				var queryData = {
					"includeProcessVariables":true,
					"processDefinitionKey":"A-Select_Mark-M",
//					"activityId":"PublishSuccess",
//					"finished":true,
					"variables" : [
						{
							"name"		: "activityName",
							"value"		: "%发布成功%",
							"operation" : "like",
							"type"		: "string"
						}
					]
				};
				
//				标注任务管理列表条件环节过滤
				if(value){
					for(var item in releaseTask.searchType){
						if(releaseTask.searchType[item] != ""){
//							根据多条件搜索
							if(item == "ERRORTYPE"){
								queryData["variables"].push({
									"name"		: "ERRORTYPE",
									"value"		: releaseTask.searchType[item],
									"operation" : "equals",
									"type"		: "string"
								});
//								回显搜索条件
								for(var j=0; j<$("#"+item+" select option").length; j++) {
									if($("#"+item+" select option")[j].value == releaseTask.searchType[item]) {
										$("#"+item+" select option")[j].selected = true;
									}
								}
							}else{
								queryData[item] = releaseTask.searchType[item];
								$("#"+item).val(releaseTask.searchType[item]);
							}
						}
					}
				}
//				使用post请求我的任务列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "POST",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: returnTaskURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
				    data : JSON.stringify(queryData),
	                success: function (result) {
	                	if(!result.data){
	                		util.errorView(result.message);
	                		return;
	                	}
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
//	      		第一列----taskID----显示
	            {
	            	"data": "name",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							var instanceId = row.id;
							if(row.variables[i].name == "taskId"){
								var taskId = row.variables[i].value;
			    			}
						}
						var model = `
							<label title="${taskId}" style="padding:5px;">
								<input class="${taskId}" type="checkbox" value="${taskId}" name="${instanceId}" onclick="releaseTask.checkedTask(event)" />
								<span></span>
							</label>
						`;
					    return	model || "";
					}, 
					"class": "checkboxs"
				},
//      		第二列----taskID----显示
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskId"){
								var taskId1 = row.variables[i].value || "";
			    			}
						}
					    return	taskId1 || "";
					}, 
					"class": "ids"
				},
//      		第三列----任务名称----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName1 = row.variables[i].value || "";
			    			}
						}
						
					    return	taskName1 || "";
					    
					},
					"class": "names"
				},
//      		第四列----当前环节----显示
	            {
	            	"data": "name",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "activityName"){
								var activityName = row.variables[i].value || "";
			    			}
						}
					    return	activityName || "";
					}, 
					"class": "activity" 
	            },
//      		第五列----创建时间----显示
	            /*{
	            	"data": "startTime", 
	              	"render": function ( data, type, row, meta ) {
						var startTime1 = util.Time(row.startTime);
						
					    return	startTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },
//      		第六列----完成时间----显示
	            {
	            	"data": "endTime", 
	              	"render": function ( data, type, row, meta ) {
						var endTime1 = util.Time(row.endTime);
						
					    return	endTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },*/
//      		第七列----完成时间----显示
	            {
	            	"data": "id", 
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "ERRORTYPE"){
								var errorTypeStr = row.variables[i].value;
								var errorType = "";
								if( errorTypeStr.indexOf(",") >= 0 ){
									var errorTypeArr = errorTypeStr.split(",");
									for(var s=0; s<errorTypeArr.length; s++){
										var value = returnTask.errorType[ errorTypeArr[s] ];
										errorType = errorType + value + ", ";
									}
								}else{
									errorType = returnTask.errorType[row.variables[i].value];
								}
				    		}
						}
					    return	errorType || "";
					}, 
	            	"class":"errorType" 
	            },
//      		第八列----查看图片----显示
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
							var imageUrl = window.mark_image+"image/get?trackPointId="+trackPointId+"&trackId="+trackIds+"&type=70&seq=001&imageType=png"
							centerModel = `
								<a class='imageUrl' title='查看该标注任务的原始图片' href='${imageUrl}' target="view_window">查看图片</a>
							`;
						}

					    return	centerModel || "";
					    
					}, 
	            	"class":"createTime" 
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
						
						var centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dtaskId='${taskId}' onclick='releaseTask.flowingModale2(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
						`;
				    	return  centerModel;
					},
					"class": "center"
	            }
	        ]
	    });
//		回显
		for(var item in releaseTask.createTasks){
			if(releaseTask.createTasks[item]){
				if( $(".checkboxs label ."+item).length > 0 ){
					$(".checkboxs label ."+item)[0].checked = true;
				}
			}
		}
//		点击分页的回显功能
		$('#example2_paginate').on('click', function () {
			releaseTask.pageTask();
		})
	},
	
//	点击复选框选择需要返修的任务时
	checkedTask: function(e){
		var taskId = e.target.value;
		var instanceId = e.target.name;
		if(e.target.checked == true){
			releaseTask.createTasks[taskId] = instanceId;
		}else{
			releaseTask.createTasks[taskId] = false;
		}
	},
	
//	点击分页的回显功能
	pageTask: function(){
		for(var item in releaseTask.createTasks){
			if(releaseTask.createTasks[item]){
				if( $(".checkboxs label ."+item).length > 0 ){
					$(".checkboxs label ."+item)[0].checked = true;
				}
			}
		}
	},

//  预览功能(监控界面)
    flowingModale2: function(e){
	    var activityTaskId  = e.currentTarget.getAttribute('data-dId');
	    var taskId  = e.currentTarget.getAttribute('data-dtaskId');
	    $.ajax( {
	        type : "get",
	        url : window.kms+"history/historic-process-instances/"+activityTaskId,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取所需要的监控界面所需要的参数
				monitor.monitorIds = {
					taskName			: "历史任务 ( "+taskId+"--"+data.name+" )",
					processDefinitionId : data.processDefinitionId,
					processInstanceId 	: data.id,
					taskId 				: taskId
				}
				monitor.monitorInit('releaseTask');
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
    },
	
//	根据过滤条件搜索
	returnTaskSearch: function(){
		var startedAfter = $("#startedAfter").val();
		var finishedBefore = $("#finishedBefore").val();
		var errorType = $("#ERRORTYPE option:selected").val();
		releaseTask.searchType = {
			"startedAfter"	: startedAfter,
			"finishedBefore": finishedBefore,
			"ERRORTYPE"		: errorType
		}
		releaseTask.Table(true);
	},
	
//	根据历史的标注任务来创建返修任务
	createTask: function(){
		var createTaskArr = [],
			instanceIdArr = [],
			taskIds = "",
			instanceIds = "";
//		将所有选中的任务进行格式化处理
		for(var item in releaseTask.createTasks){
			if(releaseTask.createTasks[item]){
				instanceIdArr.push(releaseTask.createTasks[item]);
				createTaskArr.push(item);
			}
		}
		if(!createTaskArr.length){
			util.errorView("请至少选择一条任务");
			return;
		}
		for(var i=0; i<createTaskArr.length; i++){
			taskIds += createTaskArr[i];
			instanceIds += instanceIdArr[i];
			if(i != createTaskArr.length-1){
				taskIds += ",";
				instanceIds += ",";
			}
		}
	    var createBy = user.userId;
	    var username = user.username;
		var dataForm = {
			"processDefinitionKey":"M-Mark_Repair-R",
			"createBy":createBy,
			"username":username,
			"name":"",
			"tags":{
				"multiSourceTaskIds":taskIds,
				"repairProcIds":instanceIds,
				"isRepair":"true"
			}
		}
//		创建任务的确认模板以及需要手动输入的参数
		var imgNum =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">任务返修(已选择${createTaskArr.length}条任务)</h4>
			        </div>
			        <div class="modal-body">

						<div class="form-group peoples">
							<label class="col-sm-5 control-label">任务名称:</label>
							<div class="col-sm-7" id="taskName">
					            <input type="text" class="form-control" value="" placeholder="必填" onfocus="this.placeholder=''" onblur="this.placeholder='必填'">
							</div>
						</div>
						
						<!------------------------------------确认分配或取消------------------------------------>
						
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="确认返修" data-dismiss="modal">确认返修</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`;
		$('.testmodal').html(imgNum);
		$("#button1").on('click', function () {
			releaseTask.createTaskTrue(dataForm);
		})
	},
	
//	提交创建返修任务
	createTaskTrue: function(dataForm){
		var name = $("#taskName input").val();
		if(!name){
			util.errorView("请输入返修任务名称");
			return
		}
		dataForm["name"] = name;
		$("#loading").css("display","block");
//		创建任务的事件处理
	    $.ajax( {
	        type : "POST",
	        url : window.kms+"mark/repair/task",
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(dataForm),
	        success : function(msg) {
				$("#loading").css("display","none");
	            if( !msg.code || (Number(msg.code) == 0) ){
	            	main.modalClose();
					releaseTask.Table();
	            }else{
	        		util.errorView(msg.message,false);
	            	main.modalClose();
					releaseTask.Table();
	                console.log('新增任务错误');
	        		return;
	            }
	        },
	        error: function(msg){
				$("#loading").css("display","none");
	            console.log('异常');
	        }
	    });
	},
	
//	创建任务过程中
	createView: function(){
		util.errorView("请耐心等待");
	}
	
}
for(var item in releaseTask.errorType){
	releaseTask.errorTypes.push({
		"name"	: releaseTask.errorType[item],
		"value"	: item
	});
}
