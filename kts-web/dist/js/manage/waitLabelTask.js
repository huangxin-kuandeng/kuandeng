//点击待标注任务
$(".waitLabelTask").click(function(){
	$('.content-header h1').text('待标注任务');
	waitLabelTask.Table();
})
//待标注任务
var waitLabelTask = {
	
	createForm: [
		{
			"id": "imgOpRange",
			"name": "图片操作范围",
			"data": [
				{
					"name": "半图",
					"value": "0",
					"selected": "selected"
				},
				{
					"name": "全图",
					"value": "1"
				}
			],
			"type": "select"
		},
		{
			"id": "priority",
			"name": "优先级",
			"data": [
				{
					"name": "低",
					"value": "low"
				},
				{
					"name": "中",
					"value": "mid",
					"selected": "selected"
				},
				{
					"name": "高",
					"value": "hi"
				}
			],
			"type": "select"
		},
		{
			"id": "roadElement",
			"name": "色板信息",
			"type": "text"
		},
		{
			"id": "source",
			"name": "数据来源",
			"data": [
				{
					"name": "在线导入",
					"value": "0",
					"selected": "selected"
				},
				{
					"name": "离线导入",
					"value": "1"
				},
				{
					"name": "人工挑图",
					"value": "2"
				}
			],
			"type": "select"
		},
		{
			"id": "author",
			"name": "作者信息",
			"type": "text"
		},
		{
			"id": "annoType",
			"name": "标注种类",
			"data": [
				{
					"name": "数据标注",
					"value": "0",
					"selected": "selected"
				},
				{
					"name": "返工标注",
					"value": "1"
				},
				{
					"name": "二次返工",
					"value": "2"
				}
			],
			"type": "select"
		},
		{
			"id": "dataKind",
			"name": "数据种类",
			"data": [
				{
					"name": "正式数据",
					"value": "0",
					"selected": "selected"
				},
				{
					"name": "测试数据",
					"value": "1"
				}
			],
			"type": "select"
		},
		{
			"id": "city",
			"name": "城市",
			"type": "select"
		}
	],
	
	searchType: null,			//任务搜索功能(搜索条件)
	
	searchTypeValue: null,			//任务搜索功能(搜索条件)
	
//	待标注任务的模版列表
	Table: function(value=false){
		
//  	待标注任务列表的模板
	    var test1 = ` 
	    <div class="row">
	        <div class='testmodal'></div>
	        <div class='devicemodal'></div>
	        <div class="col-xs-12">
	        	<div class="box box-warning">
	        		<div class="box-header">
	        			<div class="buttons"></div>
	    			</div>
				    <!-- 获取列表的最新数据 -->
				    <div id="refresh" style="right:10px;">
						<button type="button" class="btn btn-success" onclick="util.Refresh(waitLabelTask)">刷新列表</button>
				    </div>
				    <div class="box-body myTaskBody">
					    <table id="example2" class="table table-bordered table-hover">
					        <thead>
						        <tr>
						            <th>ID</th>
						            <th>名称</th>
						            <th>状态</th>
						            <!-- <th>环节创建时间</th>
						            <th>处理人</th>
						            <th>创建者</th> -->
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

//		初始化表格(待标注任务列表的属性)
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
        	'serverSide'  : false,  								//启用服务器端分页
	        ajax: function (data, callback, settings) {
//				封装请求参数
	            param.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;						//开始的记录序号
	            param.page = (data.start / data.length)+1;		//当前页码
				var waitLabelTaskURL = window.kms+"jsonTask/findAll";
				
//				使用post请求待标注任务列表(每次只请求十条任务,然后对其进行分页)
	            $.ajax({
	                type: "get",
//              	url: window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	                url: waitLabelTaskURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
//				    data : JSON.stringify(queryData),
	                success: function (data) {
	                    var returnData = {};
	                    returnData.recordsTotal = data.result.length;				//返回数据全部记录
	                    returnData.recordsFiltered = data.result.length;			//后台不实现过滤功能，每次查询均视作全部结果
	                    returnData.data = data.result;						//返回的数据列表
//						调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
//						此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    	callback(returnData);
	                }
	           	});

	        },
//			待标注任务列表的数据展示
        	columns: [
//      		第一列----taskID----显示
	            { 
	            	"data": "id",
	              	/*"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskId"){
								var taskId1 = row.variables[i].value;
			    			}
						}
					    return	taskId1 || "";
					}, */
					"class": "ids"
				},
//      		第二列----任务名称----显示
	            { 
	            	"data": "name",
	              	/*"render": function ( data, type, row,  meta ) {
						for(var i=0; i<row.variables.length; i++){
							if(row.variables[i].name == "taskName"){
								var taskName1 = row.variables[i].value;
			    			}
						}
						
					    return	taskName1 || "";
					    
					},*/
					"class": "names"
				},
//      		第三列----当前环节----显示
	            {
	            	"data": "status",
	              	"render": function ( data, type, row,  meta ) {
					    return	"未创建" || "";
					}, 
					"class": "_status" 
	            },
//      		第四列----创建时间----显示
	            /*{
	            	"data": "createTime" || "", 
	              	"render": function ( data, type, row,  meta ) {
						var createTime1 = util.Time(row.createTime);
						
					    return	createTime1 || "";
					    
					}, 
	            	"class":"createTime" 
	            },*/
//      		第五列----处理人----显示
	            /*{ 
	            	"data": "name",
	              	"render": function ( data, type, row,  meta ) {
						var assignee = row.assignee;
					    return	assignee || "";
					}, 
					"class": "createBy"
				},*/
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
						var taskTitle = row.name;
						var centerModel = `
							<a class='btn btn-success' title='创建标注任务' href='#' data-dId='${data}' data-dName='${taskTitle}' onclick='waitLabelTask.createMark(event)'>
								<i class='glyphicon glyphicon-plus'></i>
							</a>
							<a class='btn btn-danger' title='删除' href='#' data-dId='${data}' data-dName='${taskTitle}' onclick='waitLabelTask.deleteMark(event)'>
								<i class='glyphicon glyphicon-trash'></i>
							</a>
						`;
				    	return  centerModel;
					},
					"class": "center"
	            }
	        ]
	    });
	},
	
//	创建任务所需要的参数
	forMat_Data: function(){
		var form_Html = [],
			html_child = "";
		for(var i=0; i<waitLabelTask.createForm.length; i++){
			var this_form = waitLabelTask.createForm[i];
			if(this_form.data){
				var form_data = this_form.data;
				html_child = `
					<div class="form-group" style="width: 100%;height: 40px;">
  						<label class="col-sm-5 control-label" style="white-space: nowrap;">${this_form.name}:</label>
  						<div class="col-sm-7">
							<select class="form-control ${this_form.id}" style="float:left;">
					            <option value="">请选择${this_form.name}</option>
				                ${form_data.map(f => `
					            	<option value="${f.value}" ${f.selected || ''}>${f.name}</option>
				                `).join('')}
				            </select>
						</div>
					</div>
				`;
			}else if(this_form.id == "adcode"){
				html_child = `
					<div class="form-group" style="width: 100%;height: 40px;">
  						<label class="col-sm-5 control-label" style="white-space: nowrap;">${this_form.name}:</label>
  						<div class="col-sm-7">
							<input type="text" class="form-control ${this_form.id}" readonly="" style="height:34px;vertical-align: middle;" value="" data-toggle="tooltip" data-placement="bottom" title="选择城市仅作为定位使用(当前城市创建项目除外)">
						</div>
					</div>
				`;
			}else{
				html_child = `
					<div class="form-group" style="width: 100%;height: 40px;">
  						<label class="col-sm-5 control-label" style="white-space: nowrap;">${this_form.name}:</label>
  						<div class="col-sm-7">
							<input type="text" style="height: 34px;text-align:left;" class="form-control ${this_form.id}" placeholder="${this_form.name}" onfocus="this.placeholder=''" onblur="this.placeholder='${this_form.name}'">
						</div>
					</div>
				`;
			}
			form_Html.push(html_child);
		}
		return form_Html;
	},
	
//	根据当前JSON文件创建标注任务
	createMark: function(event){
		var taskName = event.currentTarget.getAttribute('data-dName');
		var id = event.currentTarget.getAttribute('data-dId');
		var forMatData = waitLabelTask.forMat_Data();
		var createModel = `
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="top:1%;z-index:9999;display:none;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;z-index:2;padding:0px;">
				    	<div class="modal-header">
			        		<h4 class="modal-title">创建任务(${taskName})</h4>
			      		</div>
			      		<div class="modal-body" style="height:auto;">
			                ${forMatData.map(f => `
				            	${f}
			                `).join('')}
			      		</div>
						<div class="modal-footer" style="border:none;">
							<button type="button" id="button1" class="btn btn-danger" title="确认">确认</button>
							<button type="button" id="button2" class="btn btn-default" title="取消">取消</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(createModel);
		$('.testmodal .modal1').fadeIn(200);
		$('.testmodal .modal-footer #button1').click(function(){
			var _dataString = "id="+id+"&userName="+user.username;
			for(var i=0; i<waitLabelTask.createForm.length; i++){
				var _class = waitLabelTask.createForm[i].id,
					_name = waitLabelTask.createForm[i].name,
					_value = $(".modal-body ."+_class).val();
				if(!_value){
					util.errorView("缺少参数: "+_name);
					return;
				}
				_dataString = _dataString+"&"+_class+"="+_value;
			}
			$("#loading").css("display","block");
			var _url = window.kms+'jsonTask/createTask?'+_dataString;
			util.postAjax(_url,{},function(data){
	        	$("#loading").css("display","none");
	        	if(data.code != "0"){
	        		util.openTips([data.message]);
	        		return;
	        	}
	        	console.log(data);
	        	if(data.result){
	        		util.openTips([data.result]);
	        		return;
	        	}
	    		waitLabelTask.closeModel();
	            waitLabelTask.Table();
			})
		})
		$('.testmodal .modal-footer #button2').click(function(){
		    waitLabelTask.closeModel();
		})
	},
	
//	删除当前JSON文件
	deleteMark: function(event){
		var taskName = event.currentTarget.getAttribute('data-dName');
		var id = event.currentTarget.getAttribute('data-dId');
		var deleteModel = `
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="top:1%;z-index:9999;display:none;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;z-index:2;min-height:200px;padding:0px;">
				    	<div class="modal-header">
			        		<h4 class="modal-title">删除JSON文件(${taskName})</h4>
			      		</div>
			      		<div class="modal-body">
							<p style="font-size:18px;text-align:center;"><span style="color:red;">删除当前JSON文件</span>${id}</p>
			      		</div>
						<div class="modal-footer" style="border:none;">
							<button type="button" id="button1" class="btn btn-danger" title="确认">确认</button>
							<button type="button" id="button2" class="btn btn-default" title="取消">取消</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(deleteModel);
		$('.testmodal .modal1').fadeIn(200);
		$('.testmodal .modal-footer #button1').click(function(){
			$("#loading").css("display","block");
			var _url = window.kms+'jsonTask/deleteStatus?id='+id;
			util.getAjax(_url,true,function(data){
	        	$("#loading").css("display","none");
	        	if(data.code != "0"){
	        		util.errorView(data.message);
	        		return;
	        	}
	        	util.errorView("删除"+data.message);
	    		waitLabelTask.closeModel();
	            waitLabelTask.Table();
			})
		})
		$('.testmodal .modal-footer #button2').click(function(){
		    waitLabelTask.closeModel();
		})
	},
	
//	根据环节选择
	closeModel: function(){
		$('.testmodal .modal1').fadeOut(200);
	},
	
//	关闭模态框
	modalClose1: function(){
		$('.modal1').hide();
		waitLabelTask.Table();
	}
}