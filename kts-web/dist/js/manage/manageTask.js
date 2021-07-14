//点击标注管理
$(".manageTask").click(function(){
	$('.content-header h1').text('标注管理');
	manageTask.Table();
})
//标注管理
var manageTask = {
	
	searchType: null,			//任务搜索功能(搜索条件)
	
	searchTypeValue: null,			//任务搜索功能(搜索条件)
	
//	标注管理的模版列表
	Table: function(value=false){
		
//  	标注管理列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        <div class="box box-warning">
	        <div class="box-header">
	        <div class="buttons"></div>
	        <h3 class="box-title">标注管理列表</h3>
	    </div>
	    
	    <div class="searchType" style="width:500px;padding-left:10px;">
			<select class="form-control" style="width:200px;float:left;">
	            <option class="change" value="taskId">根据taskId来查找任务</option>
	            <option class="change" value="taskName">根据名称来查找任务</option>
	            <option class="change" value="assignee">根据作业员来查找任务</option>
	        </select>
	        <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="manageTask.manageTaskSearch(event)" style="float:left;width:130px;margin:0px 5px;" />
	    </div>
	    
        <div class="activityKey" style="padding-left:10px;float:left;margin-left:10px;">
			<select class="form-control" style="width:200px;float:left;" onchange="manageTask.activityChange();">
	            <option value="">所有任务</option>
		        <option value="MarkHandle">标注作业</option>
		        <option value="MarkQC">标注质检</option>
		        <option value="MarkAcceptance">标注验收</option>
		        <option value="MarkPublish">发布成功</option>
		        <option value="unassigned">未申领</option>
            </select>
        </div>
	    <!-- 获取列表的最新数据 -->
	    <div id="refresh" style="right:10px;">
			<button type="button" class="btn btn-success" onclick="util.Refresh(manageTask)">刷新列表</button>
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
				var manageTaskURL = window.kms+"query/tasks?size=10&sort=createTime&order=desc&start="+param.start;
				
				var queryData = {
					"includeProcessVariables":true,
//					"assignee":"tag_marker1",
//					"processDefinitionId":"A-Select_Mark-M:48:2210047",
//					"unassigned":"true",
					"processInstanceVariables" : [
						{
							"name" : "processName",
							"value" : "%标注流程%",
							"operation" : "like",
							"type" : "string"
						}
					]
				};
				
//				标注任务管理列表条件环节过滤
				if(value){
					if(value == "search"){
//						根据条件搜索
						if(manageTask.searchTypeValue){
							if(manageTask.searchType == "assignee"){
								queryData["assignee"] = manageTask.searchTypeValue;
							}else{
								var forms = {
									"name" : manageTask.searchType,
									"value" : "%"+manageTask.searchTypeValue+"%",
									"operation" : "like",
									"type" : "string"
								};
								if(manageTask.searchType == "taskId"){
									forms.operation = "equals";
									forms.value = Number(manageTask.searchTypeValue);
									forms.type = "long";
								}
								queryData["processInstanceVariables"].push(forms)
							}
							for(var j=0; j<$(".searchType select option").length; j++) {
								if($(".searchType select option")[j].value == manageTask.searchType) {
									$(".searchType select option")[j].selected = true;
									$(".searchType input").val(manageTask.searchTypeValue);
								}
							}
						}
					}else{
//						根据环节搜索
						if(manageTask.searchTypeValue){
							if(manageTask.searchTypeValue == "unassigned"){
								queryData["unassigned"] = "true";
							}else{
								queryData["taskDefinitionKey"] = manageTask.searchTypeValue;
							}
							for(var j=0; j<$(".activityKey select option").length; j++) {
								if($(".activityKey select option")[j].value == manageTask.searchTypeValue) {
									$(".activityKey select option")[j].selected = true;
								}
							}
						}
					}
				}
//				使用post请求我的任务列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "POST",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: manageTaskURL,
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
//      		第五列----处理人----显示
	            { 
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						var assignee = row.assignee;
					    return	assignee || "";
					}, 
					"class": "createBy"
				},
//      		第五列----创建者----显示
	            /*{ 
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
				},*/
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
					    var taskDefinitionKey1 = row.taskDefinitionKey;
						var taskTitle = row.name;
					    var functionName = "";
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName = row.variables[i].value;
			    			}
						}
						
//          			处理任务/重跑环节时的展示效果与触发事件
						if( (taskDefinitionKey1 == "MarkHandle") && row.assignee ){
							functionName = `
								<a class='btn btn-delete' title='撤销领取' data-toggle='modal' data-target='.modal1' href='#' data-dId='${taskName}' data-dKey='${row.id}' onclick='manageTask.returnModel(event,"${taskDefinitionKey1}")'>
									<i class='fa fa-reply'></i>
								</a>
							`;
						}
						/*else if( taskDefinitionKey1 == "MarkAcceptance" ){
							functionName = `
								<a class='btn btn-receive' title='${taskTitle}' data-toggle='modal' data-target='.modal1' href='#' data-dId='${data}' data-dKey='${row.processInstanceId}' onclick='testAndCheck.Table(event,"${taskDefinitionKey1}")'>
									<i class='glyphicon glyphicon-cog'></i>
								</a>
							`;
						}*/
						
						var centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dKey='${row.processInstanceId}' onclick='myTask.flowingModale1(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
							${functionName}
						`;
				    	return  centerModel;
					},
					"class": "center"
	            }
	        ]
	        
	    });
//		列表点击任务名称可以隐藏 / 显示更多信息-----场景、trackIds、transId。
	    $('#example2 tbody').on('click', 'tr td.names', function () {
	    	if($(".trChild").length > 0){
	    		var junge = ( $(".trChild")[0].previousSibling==this.parentNode );
	    		$(".trChild").remove();
	    		if(junge){
	    			return;
	    		}
	    	}
	    	
//	    	增加任务详情的模板
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
    		$(this.parentNode).after("<tr class='trChild'><td colspan='6' class='infoColor'></td></tr>");
//			获取任务二级列表的详细信息(获取所点击任务的详细信息)
		    $.ajax( {
		        type : "get",
		        url : window.kms+'runtime/process-instances?includeProcessVariables=true&id='+row.data().executionId,
//		        url : window.kms+'runtime/process-instances?includeProcessVariables=true&id='+row.data().id,
		        async : false,
		        success : function(data) {
		        	if(!data.data[0].variables){
		        		return;
		        	}
			        main.format(data.data[0]);
			    },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
			   	},
			})
	    });
	},
	
//	撤销任务所属人的模版
	returnModel: function(event,taskDefinitionKey1){
		var taskName = event.currentTarget.getAttribute('data-dId');
		var id = event.currentTarget.getAttribute('data-dKey');
		
		var receive1 =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">撤销任务 ( ${taskName} )</h4>
			        </div>
			        <div class="modal-body">
						
						<p style="font-size:18px;">
							将此任务<span style="color:red;">撤销到未申领</span>的状态
						</p>
						
						<!------------------------------------确认分配或取消------------------------------------>
						
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="撤销" data-dismiss="modal" onclick="manageTask.returnTrue(${id})">撤销</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`
		$('.testmodal').html(receive1);
	},
	
//	主管所拥有的撤回功能
	returnTrue: function(id){
		var _data = {
			"action" : "claim",
			"assignee" : null
		}
	    $.ajax({
	        type : "post",
	        url : window.kms+'runtime/tasks/'+id,			//通过id进行任务申领
//	        url : 'http://192.168.5.31:23300/kts/runtime/tasks/'+"67285",			//通过id进行任务申领
	        async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_data),
	        success : function(data) {
	            main.modalClose(claimTask,true);
	            manageTask.Table();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	根据环节选择
	activityChange: function(){
		manageTask.searchTypeValue = $(".activityKey option:selected").val();
		manageTask.Table(true);
	},
	
//	根据过滤条件搜索
	manageTaskSearch: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			manageTask.searchType = $('.searchType option:selected').val();
			manageTask.searchTypeValue = $('.searchTypeValue').val();
			manageTask.Table("search");
		}
	}
	
	
}