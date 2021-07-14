/*
 * 
 * 申领任务
 * 将该列表中的任务申领到所登陆用户的我的任务当中
 * 
 */

$(".claimTask").click(function(){
	$('.content-header h1').text('申领任务');
	queryValue = 0;
	claimTask.Table();
})

//申领任务的初始化及事件
var claimTask = {
	
	searchType: null,				//任务搜索功能(搜索类型)
	
	searchTypeValue: null,			//任务搜索功能(搜索条件)
	
	Table: function(queryValue){
		
//  	我的任务列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        <div class="box box-warning">
	        <div class="box-header">
	        <div class="buttons"></div>
	        <h3 class="box-title">待领任务列表</h3>
	    </div>
	    
	    <div class="searchType" style="width:500px;padding-left:10px;">
			<select class="form-control" style="width:200px;float:left;">
	            <option class="change" value="taskId">根据taskId来查找任务</option>
	            <option class="change" value="taskName">根据名称来查找任务</option>
	            <option class="change" value="activityName">根据当前环节来查找任务</option>
	        </select>
	        <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="claimTask.claimTaskSearch(event)" style="float:left;width:130px;margin:0px 5px;" />
	    </div>
	    
	    <!-- 获取列表的最新数据 -->
	    <div id="refresh" style="right:10px;">
			<button type="button" class="btn btn-success" onclick="util.Refresh(claimTask)">刷新列表</button>
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
			            <th>创建者</th>
			            <th>优先级</th>
			            <th>查看图片</th>
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
				if(!user.userType){
					var myTaskURL = window.kms+"query/tasks?size=10&sort=createTime&order=desc&start="+param.start;
				}else{
					var myTaskURL = window.kms+"mark/query/tasks?size=10&sort=createTime&order=asc&start="+param.start;
				}

				var queryData = {
					"includeProcessVariables":"true",
//					"assignee":user.username,
					"candidateUser":user.username,
					"processInstanceVariables" : [
						{
							"name" : "taskName",
							"value" : "%%",
							"operation" : "like",
							"type" : "string"
						}
					]
				};
				if( (queryValue == 0) || !queryValue ){
					//不经过搜索任务的我的任务列表
				}else{
					if(claimTask.searchTypeValue != ""){
						if( (claimTask.searchType == "taskId") && (!isNaN(Number(claimTask.searchTypeValue))) ){
							//经过taskId进行搜索的我的任务列表
							queryData = {
								"includeProcessVariables":"true",
//								"assignee":user.username,
								"candidateUser":user.username,
								"processInstanceVariables" : [
									{
										"name" : claimTask.searchType,
										"value" : Number(claimTask.searchTypeValue),
										"operation" : "equals",
										"type" : "long"
									}
								]
							};	
						}else{
							//经过taskName或者环节进行搜索的我的任务列表
							queryData = {
								"includeProcessVariables":"true",
//								"assignee":user.username,
								"candidateUser":user.username,
								"processInstanceVariables" : [
									{
										"name" : claimTask.searchType,
										"value" : "%"+claimTask.searchTypeValue+"%",
										"operation" : "like",
										"type" : "string"
									}
								]
							};
						}
						
					}else{
						//...
					}
//					记忆上次搜索操作的保存
					for(var j=0; j<$(".searchType select option").length; j++) {
						if($(".searchType select option")[j].value == claimTask.searchType) {
							$(".searchType select option")[j].selected = true;
							$(".searchType input").val(claimTask.searchTypeValue);
						}
					}
				}
				
//				使用post请求我的任务列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "POST",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: myTaskURL,
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
								var taskId1 = row.variables[i].value;
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
								var taskName1 = row.variables[i].value;
			    			}
						}
						
					    return	taskName1 || "";
					    
					},
					"class": "names"
				},
//      		第三列----当前环节----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "activityName"){
								var activityName1 = row.variables[i].value;
			    			}
						}
						
					    return	activityName1 || "";
					    
					}, 
					"class": "activity" 
	            },
//      		第四列----创建时间----显示
	            {
	            	"data": "createTime", 
	              	"render": function ( data, type, row,  meta ) {
						var createTime1 = util.Time(row.createTime);
						
					    return	createTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },
//      		第五列----创建者----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "starter"){
								var createBy1 = row.variables[i].value;
			    			}
						}
						
					    return	createBy1 || "";
					    
					}, 
					"class": "createBy"
				},
//      		第五列----优先级----显示
	            {
	            	"data": "name", 
	              	"render": function ( data, type, row,  meta ) {
						var priority = Number(row.priority) || "";
						var className = "<span class='blackColor'>"+priority+"</span>";
//						debugger
						if( 50 <= priority ){
							if( (53<priority) && (priority<55) ){
								className = "<span class='blackYellow'>"+priority+"</span>";
							}else if( (53==priority) && (55 < priority) ){
								className = "<span class='blackRed'>"+priority+"</span>";
							}
						}else{
							if( (3<priority) && (priority<5) ){
								className = "<span class='blackYellow'>"+priority+"</span>";
							}else if( (5==priority) || (5<priority) ){
								className = "<span class='blackRed'>"+priority+"</span>";
							}
						}
					    return	className;
					    
					}, 
	            	"class":"priority"
	            },
//      		第六列----查看图片----显示
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
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName = row.variables[i].value;
			    			}
						}
						var centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dKey='${row.processInstanceId}' onclick='claimTask.claimFlowing(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
							<a class='btn btn-receive receive2' title='' data-toggle='modal' data-target='.modal1' href='#' data-dId='${taskName}' data-dKey='${row.id}' data-dTaskDefinitionKey='${row.taskDefinitionKey}' onclick='claimTask.claimUser(event)'>
								<i class='glyphicon glyphicon-user'></i>
							</a>
						`;
				    	return  centerModel;
					},
					"class": "center"
	            }
	        ]
	            
	    });
		
//		只有存在标注功能时,才会存在优先级
//		if(!user.userType){
//			$(".priority").remove();
//		}
	    
	},
	

//	搜索条件------搜索类型，过滤条件
//-----------------------------------------当前任务--根据条件进行搜索任务
	claimTaskSearch: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			queryValue = 1;
			claimTask.searchType = $('.searchType option:selected').val();
			claimTask.searchTypeValue = $('.searchTypeValue').val();
			claimTask.Table(queryValue);
		}
	},
	
//	当前任务预览模板(监控界面)
	claimFlowing: function(e){
    	var processInstanceId  = e.currentTarget.getAttribute('data-dKey');
    	var id1  = e.currentTarget.getAttribute('data-dId');
    	var taskId, activitiesName, processDefinitionId;
//  	预览当前任务(打开监控界面),需要获取该任务的详情数据
    	$.ajax( {
        	type : "get",
	        url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+processInstanceId,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取所需要的监控界面所需要的参数
				processDefinitionId = data.data[0].processDefinitionId;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskId"){
						taskId = data.data[0].variables[l].value;					//任务的taskId
					}
					if(data.data[0].variables[l].name == "taskName"){
						activitiesName = data.data[0].variables[l].value;			//任务名
					}
				}
				
//				将所需参数存入数组当中
				monitor.monitorIds = {
					taskName			: "申领任务 ( "+taskId+"--"+activitiesName+" )",
					processDefinitionId : processDefinitionId,
					processInstanceId 	: processInstanceId,
					taskId 				: taskId
				}
				monitor.monitorInit('claimTask');
				
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
	claimUser: function(e){
		var taskDefinitionKey = e.currentTarget.getAttribute('data-dTaskDefinitionKey');
		if(taskDefinitionKey == "MarkHandle"){
	        util.errorView("请在标注软件上进行此操作!");
	        return;
		}
		var taskName = e.currentTarget.getAttribute('data-dId');
		var id = e.currentTarget.getAttribute('data-dKey');
		
		var receive1 =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">申领任务 ( ${taskName} )</h4>
			        </div>
			        <div class="modal-body">
						
						<p style="font-size:18px;">
							将此任务领取至我(<span style="color:red;"> ${user.showname} </span>)的任务
						</p>
						
						<!------------------------------------确认分配或取消------------------------------------>
						
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="申领" data-dismiss="modal" onclick="claimTask.claimTrue(${id})">申领</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`
		$('.testmodal').html(receive1);
	},
	
	claimTrue: function(id){
		if(!id || !user.username){
			return;
		}
		var _data = {
			"action" : "claim",
			"assignee" : user.username
		}
	    $.ajax({
	        type : "post",
	        url : window.kms+'runtime/tasks/'+id,			//通过id进行任务申领
	        async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_data),
	        success : function(data) {
	            main.modalClose(claimTask,true);
	            claimTask.Table();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	}
	
	
}
