//点击标注历史
$(".returnTask").click(function(){
	$('.content-header h1').text('返修列表');
	returnTask.createTasks = {};
	returnTask.Table();
})
//标注系统的历史列表--可以进行导出统计
var returnTask = {
	
	createTasks: {},
	
	errorTypes: [{
		"name"	: "默认选择",
		"value"	: ""
	}],
	
	searchType: null,
	
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
	Table: function(queryValue=false){
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
	        			<h3 class="box-title">返修任务列表</h3>
	    			</div>
					<!--标注任务的错误类型-->
					<div class="form-group ERRORTYPE">
						<div class="">
							<select class="form-control">
			    				${releaseTask.errorTypes.map(f => `
				            		<option value="${f.value}" title="${f.name}">${f.name}</option>
			    				`).join('')}
							</select>
						</div>
					</div>
			        <div class="activityName" style="float:left;">
						<select class="form-control" style="width:140px;">
				            <option value="">所有任务</option>
					        <option value="标注作业">标注作业</option>
					        <option value="标注质检">标注质检</option>
					        <option value="标注验收">标注验收</option>
					        <option value="发布成功">发布成功</option>
			            </select>
			        </div>
				    <div class="searchType" style="width:400px;padding-left:10px;float:left;">
						<select class="form-control" style="width:200px;float:left;">
				            <option class="change" value="taskId">根据taskId来查找任务</option>
				            <option class="change" value="taskName">根据任务名称来查找任务</option>
				            <option class="change" value="repairName">根据返修名称来查找任务</option>
				        </select>
				        <input type="text" class="form-control" style="float:left;width:130px;margin:0px 5px;" />
				    </div>
	    			<!-- 确认进行条件过滤 -->
				    <div id="searchButton">
						<button type="button" class="btn btn-success" onclick="returnTask.returnTaskSearch();">搜索</button>
				    </div>
	    			<div class="box-body myTaskBody">
					    <table id="example2" class="table table-bordered table-hover">
					        <thead>
						        <tr>
						            <th>ID</th>
						            <th>名称</th>
						            <th>当前环节</th>
						            <!-- 
						            <th>环节创建时间</th>
						            <th>环节结束时间</th>
						             -->
						            <th>错误类型</th>
						            <th>轨迹点</th>
						            <th>返修名称</th>
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
//					"businessKey":"7681",
//					"finished":true,
					"variables" : [
						{
							"name"		: "isRepair",
							"value"		: true,
							"operation" : "equals",
							"type"		: "boolean"
						}
					]
				};
				
//				标注任务管理列表条件环节过滤

				if( (queryValue == 0) || !queryValue ){
					//不经过搜索任务的我的任务列表
				}else{
					for(var item in returnTask.searchType){
						if( (item == "taskId") && returnTask.searchType[item] ){
							var taskId = returnTask.searchType[item];
							queryData["variables"].push({
								"name" : item,
								"value" : Number(taskId),
								"operation" : "equals",
								"type" : "long"
							})
						}else if(returnTask.searchType[item]){
							var searchVal = returnTask.searchType[item];
							queryData["variables"].push({
								"name" : item,
								"value" : "%"+searchVal+"%",
								"operation" : "like",
								"type" : "string"
							})
						}
					}
				}
//				记忆上次搜索操作的保存
				for(var item in returnTask.searchType){
					var searchVal = returnTask.searchType[item];
					if( $("."+item+" option").length ){
						for(var j=0; j<$("."+item+" select option").length; j++) {
							if($("."+item+" select option")[j].value == searchVal) {
								$("."+item+" select option")[j].selected = true;
							}
						}
					}else{
						for(var l=0; l<$(".searchType select option").length; l++) {
							if($(".searchType select option")[l].value == item) {
								$(".searchType select option")[l].selected = true;
								$(".searchType input").val(searchVal);
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
//      		第五列----错误类型----显示
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
//      		第六列----trackPointId----显示
	            {
	            	"data": "id", 
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
//      		第七列----repairName----显示返修名称
	            {
	            	"data": "id", 
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "repairName"){
								var repairName = row.variables[i].value;
				    		}
						}
					    return	repairName || "";
					}, 
	            	"class":"repairName" 
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
	    					var imageUrl = window.mark_image+"image/get?trackPointId="+trackPointId+'&trackId='+trackIds+"&type=70&seq=001&imageType=png"
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
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dtaskId='${taskId}' onclick='returnTask.flowingModale2(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
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
				monitor.monitorInit('returnTask');
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
    },
	
//	根据过滤条件搜索
	returnTaskSearch: function(){
		var errorType = $(".ERRORTYPE option:selected").val();
		var activityName = $(".activityName option:selected").val();
		var searchType = $(".searchType option:selected").val();
		var searchVal = $(".searchType input").val();
		returnTask.searchType = {
			"ERRORTYPE" : errorType,
			"activityName" : activityName
		}
		returnTask.searchType[searchType] = searchVal;
		returnTask.Table(true);
	}

}
for(var item in returnTask.errorType){
	returnTask.errorTypes.push({
		"name"	: returnTask.errorType[item],
		"value"	: item
	});
}
