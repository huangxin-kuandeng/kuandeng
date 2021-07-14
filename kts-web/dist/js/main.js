/*
 * 
 * Created by wangtao on 2017/8/2.
 * Changed by huangxin on 2017/8/30.
 * 
*/

$('.baseCraft').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/baseCraft/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})
$('.importManage').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/importManage/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})
$('.searchMark').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/searchMark/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})
$('.taskPack').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/taskPack/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})
$('.pickupAtMap').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/pickupAtMap/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})
$('.efficiencyStatistics').click(function(){
	$('.content-header h1').text('');
	var height = document.documentElement.clientHeight - 95;
	var iframe = `
		<iframe id="dataIframe" style="height:${height}px;" src="pages/efficiencyStatistics/index.html"></iframe>
	`;
    $('.content.container-fluid').html(iframe);
})

var i = 0;
// -------------------------------------当前任务-------------------------------------
var deleteId1,					//删除任务所需要的id
	deleteKey1,					//删除任务需要的任务号
	taskData,					//当前任务的数据存放
	searchType,					//进行当前任务搜索的类型
	searchTypeValue,			//进行当前任务搜索的过滤条件
	param1 = {};				//创建一个新的集合来储存数据

//--------------------------------------用户登录(  判断跳转   )---------------------------------

//点击当前
$(".collectionTask").click(function(){
	$('.content-header h1').text('当前任务');
	var queryValue = 0;
	main.checks = {};
    main.Table(queryValue);
});
// 批量删除任务
$('.content.container-fluid').on('click', 'button.deleteTasks', function (e) {
	var id_arr = [];
	for(var id in main.checks){
		if( main.checks[id] ){
			id_arr.push(id)
		}
	}
	if( !id_arr.length ){
		util.errorView('未选择相关任务');
		return;
	}
	var text = "批量删除任务：" + id_arr.length + "条";
	var ids = id_arr.join(",");
	main.deleteTasks( text, ids );
});
var main = {
	
	checks: {},
	
	userList: [],
	
	batchList: null,
	
//	删除任务功能 / 清除任务数据功能
	deleteTasks: function( text, ids ){
		
		util.openTips_btn([text], function(){
			var _url = window.kms_v2 + 'task/taskInfo/delete?taskIds=' + ids;
			$('#loading').fadeIn();
			util.postAjax(_url, {}, function(data){
				$('#loading').fadeOut();
				if(data.code != "0"){
					util.errorView('删除任务失败');
					return;
				}
				util.errorView('删除任务成功', true);
				$('.testmodal .modal1').modal('hide');
				main.checks = {};
				main.Table(0);
			})
		})
		
	},
	
	
//	当前任务的模版
	Table: function(queryValue,activityValue=false){
	    
	    var test = ` 
		    <div class="row">
		        <div class='testmodal'></div>
		        <div class="col-xs-12">
		        <div class="box box-primary">
		        <div class="box-header">
		        <div class="buttons"></div>
		        <h3 class="box-title">当前任务列表</h3>
		    </div>
		    <!--<div class="taskButtons" style="position:absolute;z-index:100;">
		      <button type="button" onclick="createTasks.createTask()" class="btn btn-default" data-toggle="modal" data-target="#modal-default">
		      	<font><font>创建任务</font></font>
		      </button>
		    </div>-->
		    
	        <div class="searchType" style="padding-left:10px;float:left;">
				<select class="form-control" style="width:200px;float:left;">
		            <option class="change" value="taskId">根据taskId来查找任务</option>
		            <option class="change" value="taskName">根据名称来查找任务</option>
		            <option class="change" value="currentLink">根据当前环节来查找任务</option>
	            </select>
	            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="main.collectionSearch(event)" style="float:left;width:130px;margin:0px 5px;" />
	        </div>
		    
	        <!-- 
		    <div id="shp">
				<input type="text" class="form-control" id="shpId" placeholder="任务Id" />
				<button type="button" class="btn btn-info" onclick="main.shpDownload()">下载</button>
		    </div>
		     -->
		    <!-- 获取列表的最新数据 -->
		    <div id="refresh">
				<button type="button" class="btn btn-danger deleteTasks">批量删除</button>
				<button type="button" class="btn btn-success" onclick="util.Refresh(main)">刷新列表</button>
		    </div>
		    <!-- /.box-header -->
		    <div class="box-body">
			    <table id="example2" class="table table-bordered table-hover">
		            <thead>
		                <tr>
			                <th>
								<label class="delete_check_all" style="padding:0px 5px;">
									<input type="checkbox" />
									<span></span>
								</label>
							</th>
			                <th>ID</th>
			                <th>名称 <span style="font-weight:normal;"> (点击名称显示详细信息)</span></th>
			                <th>流程名称</th>
			                <th>当前环节</th>
			                <th>创建者</th>
			                <th>作业员</th>
			                <th>操作</th>
		                </tr>
		            </thead>
			    </table>
				<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
				  <div class="modal-dialog" role="document">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></button>
				        <h4 class="modal-title" id="gridSystemModalLabel">删除任务</h4>
				      </div>
				      <div class="modal-body">
						<p style="color:black;">确定删除该任务吗?</p>
				      </div>
				      <div class="modal-footer">
				        <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="main.deleteTrueId(event)" >确认删除</button>
				        <button type="button" class="btn btn-default" title="取消" data-dismiss="modal">取消</button>
				      </div>
				    </div>
				  </div>
				</div>
		    </div>
		    <!-- /.box-body -->
		    </div>
		    <!-- /.box -->
		    </div>
		    <!-- /.col -->
		    </div>
		    <!-- /.row -->
	    `;
	    $('.content.container-fluid').html(test);
	    
//		初始化当前任务列表(列表的属性与属性值)
	    var table = $("#example2").DataTable({
	    	'language'		: window.lang,
	        'searching'		: false,								//原生搜索
	        'paging'		: true,
	        'lengthChange'	: false,
	        'ordering'		: false,
	        'info'			: true,
	        'autoWidth'		: false,
	        'scrollY'		: 600,
	        'scrollCollapse': true,
	        'aaSorting'		: false,
	        "lengthChange"	: true,
	        "lengthMenu"	: [ 10, 30, 50, 100 ],
//	        'processing'	: true,  								//隐藏加载提示,自行处理
	        'serverSide'	: true,  								//启用服务器端分页
//	        'order'			: [0,'desc'],  						//取消默认排序查询,否则复选框一列会出现小箭头
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
	        	
	        	let _key = $('.searchType select').val(),
	        		_val = $('.searchType input').val();
	        	
	            param1.limit = data.length;
	            param1.start = data.start;
	            param1.page = (data.start / data.length)+1;
//				var collectionURL = window.kms+"task/taskInfo/current?pageNum="+param1.page+"&pageSize=10&user="+user.username;
				var collectionURL = window.kms+"task/taskInfo/current?pageNum="+param1.page+"&pageSize="+param1.limit;
				
				if(queryValue && searchTypeValue){
					collectionURL += ('&'+searchType+'='+searchTypeValue);
				}
				
				
				/*
				if( !queryValue || (queryValue == 0) ){
//					不经过搜索任务的当前任务列表
				}else if(queryValue == "activityValue"){
//					选择单个流程--并显示该指定流程的所有对应任务
					if( activityValue && (activityValue != "") ){
						collectionURL = collectionURL+"&processDefinitionKey="+activityValue;
					}
					for(var j=0; j<$(".activityKey select option").length; j++) {
						if($(".activityKey select option")[j].value == activityValue) {
							$(".activityKey select option")[j].selected = true;
						}
					}
				}else{
					if(searchTypeValue != ""){
						if( searchType == "taskName" ){
//							经过taskName进行搜索的当前任务列表
							collectionURL = collectionURL+"&taskName="+searchTypeValue
						}else if( (searchType == "taskId") && (!isNaN(Number(searchTypeValue))) ){
//							经过taskId进行搜索的当前任务列表
							collectionURL = collectionURL+"&taskId="+searchTypeValue
						}else if( searchType == "currentLink" ){
//							经过taskId进行搜索的当前任务列表
							collectionURL = collectionURL+"&currentLink="+searchTypeValue
						}
					}else{
						//...
					}
//					记忆上次搜索操作的保存
					for(var j=0; j<$(".searchType select option").length; j++) {
						if($(".searchType select option")[j].value == searchType) {
							$(".searchType select option")[j].selected = true;
							$(".searchType input").val(searchTypeValue);
						}
					}
				}*/
	            $.ajax({
	                type: "POST",
                	url: collectionURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
				    data : [],
	                success: function (result) {
	                	taskData = result.result;
	                	if(!taskData){
	                		util.errorView(result.message,false);
	                		return;
	                	}
	                    var returnData1 = {};
	                    returnData1.recordsTotal = result.total;
	                    returnData1.recordsFiltered = result.total;
	                    returnData1.data = result.result;
	                    callback(returnData1);
	                },
				   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
				   	},
	           	});
	       },
	        columns: [
				{
					"data": "taskId" || "",
					"render": function ( data, type, row,  meta ) {
						var checked = main.checks[data],
							checked_s = checked ? "checked" : "";
						var model = `
							<label class="delete_check" style="padding:0px 5px;">
								<input type="checkbox" value="${data}" ${checked_s}/>
								<span></span>
							</label>
						`;
						return model;
					},
					"class": "checkTask"
				},
	            { 
	            	"data": "taskId" || "",
					"class": "ids"
				},
	            { 
	            	"data": "taskName" || "",
					"class": "names"
				},
	            { 
	            	"data": "processDefinitionName" || "",
	            },
	            { 
	            	"data": "currentLink" || "",
					"class": "activity" 
	            },
	            {
	            	"data": "starter" || "",
					"class": "createBy"
				},
	            {
	            	"data": "currentOperator" || "",
					"class": "currentOperator"
				},
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
		    			
//						任务操作按钮(打开监控界面 / 删除任务 / 清除任务数据)
						var centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dId='${data}' data-dKey='${data}' onclick='main.flowingModale(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
							<a class='btn btn-delete deleteTask' title='删除' href='#'>
								<i class='glyphicon glyphicon-trash'></i>
							</a>
						`;
						return centerModel;
					},
					"class": "center"
	            }
	        ]
	    });
	    
	    // 全选按钮
	    $('#example2_wrapper thead').on('click', 'label.delete_check_all input', function (e) {
	    	
	    	var c_check = e.target.checked;
	    	var delete_checks = $('#example2 tbody label.delete_check input');
	    	for(var i=0; i<delete_checks.length; i++){
	    		var _id = delete_checks[i].value;
	    		
	    		delete_checks[i].checked = c_check;
	    		main.checks[_id] = c_check;
	    	}
	    	
	    });
	    // 单选按钮
	    $('#example2 tbody').on('click', 'label.delete_check input', function (e) {
	    	
	    	var c_check = e.target.checked;
	    	var _id = e.target.value;
	    	main.checks[_id] = c_check;
	    	
	    });
		
	    // 删除按钮
	    $('#example2 tbody').on('click', 'a.deleteTask', function (e) {
			
			var tr = $(this).closest('tr'),
				row = table.row( tr ),
				data = row.data(),
				id = data.taskId,
				name = data.taskName || "",
				text = "删除任务：（ "+ name +" ）";
			
			main.deleteTasks( text, id );
	    	
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
    		$(this.parentNode).after("<tr class='trChild'><td colspan='8' class='infoColor'></td></tr>");
//			获取任务二级列表的详细信息(获取所点击任务的详细信息)
		    $.ajax( {
		        type : "get",
		        url : window.kms+'runtime/process-instances?includeProcessVariables=true&id='+row.data().id,
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

//	当前任务--根据条件进行搜索任务
	collectionSearch: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			var queryValue = 1;
			searchType = $('.searchType option:selected').val();
			searchTypeValue = $('.searchTypeValue').val();
			main.checks = {};
			main.Table(queryValue);
		}
	},

//	点击任务名称可以显示更多信息-----显示更多详细信息时的数据处理与显示方式
	format: function(datas){
		main.userList = [];
//		main.batchList = [];
//		变量中文显示
		var data_language = {
	    	"trackIds"		:"轨迹ID",
	    	"transId"		:"事务ID",
	    	"sceneCode"		:"场景",
	    	"range"			:"范围",
	    	"mapElement"	:"地图要素",
	    	"pacId"			:"所属任务包"
		};
	    var dataName = [],			//表格表头
	    	dataValue = [],			//表格对应值
//	    	serviceModel = "",		//批次信息模板
	    	viewModel = "";			//任务详细信息模板
//		场景中文显示
	    var sceneCodeArr = {
	    	"Routing"  :"道路",
	    	"AutoDrive":"自动驾驶",
	    	"POI"	   :"兴趣点",
	    	"BMD"	   :"背景",
	    	"HD_DATA"  :"高精数据"
	    };
//		地图要素中文显示
	    var mapElementArr = {
	    	"lane"				:"车道线",
	    	"pole"				:"灯杆",
	    	"roadElement"		:"地面要素",
	    	"smallTrafficSign"	:"小路牌",
	    	"trafficSign"		:"路牌"
	    };
	    
	    var processInstanceId = datas.id;
	    $.ajax( {
	        type : "get",
	        url : window.kms+'history/historic-activity-instances?size=100&processInstanceId='+processInstanceId,
	        async : false,
	        success : function(data) {
	        	for(var i=0; i<data.data.length; i++){
	        		if(data.data[i].activityId == "startevent"){
	    				dataName.push( "开始时间" );
	    				dataValue.push( util.Time(data.data[i].startTime) );
	        		}else if(data.data[i].assignee){
	        			main.userList.push( data.data[i] );
	        		}
	        	}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		})
	    
//		轨迹名称name
		var surveyTrackNames = "";
	    for(var i=0; i<datas.variables.length; i++){
	    	if(datas.variables[i].name == "surveyTrackNames"){
	    		surveyTrackNames = datas.variables[i].value;
	    	}
	    };
	
//		循环添加所需要的数据
	    for(var i=0; i<datas.variables.length; i++){
//	    	展示的数据只包括trackIds/transId/sceneCode/range/mapElement
	    	if( data_language[datas.variables[i].name] && (datas.variables[i].name != "trackIds") ){
	    		if( !datas.variables[i].value || (datas.variables[i].value == "null") ){
	    			//...trackIds或者transId
	    		}else{
	    			if( mapElementArr[datas.variables[i].value] || sceneCodeArr[datas.variables[i].value] ){
	    				datas.variables[i].value = (mapElementArr[datas.variables[i].value]) || (sceneCodeArr[datas.variables[i].value]);
	    			}
		    		dataName.push(data_language[datas.variables[i].name]);
		    		dataValue.push(datas.variables[i].value);
	    		}
	    	}
	    	
	    	if(datas.variables[i].name == "trackIds"){
	    		dataName.push(data_language[datas.variables[i].name]);
	    		dataValue.push(datas.variables[i].value+"("+surveyTrackNames+")");
	    	}
	    	
	    };

//		更多详细信息的显示模板
		viewModel = `
			<table id="information" class="table table-bordered">
				<h4 class="infoHeader">详细信息<span style="font-weight:normal;font-size:16px;">(点击可复制)</span></h4>
		        <thead>
			        <tr>
		                ${dataName.map(d => `
				            <th title="${d}">${d}</th>
		                `).join('')}
			        </tr>
		        </thead>
		        <tbody>
			        <tr onclick="main.copyInfo(event)">
		                ${dataValue.map(d => `
				            	<td title="${d}">${d}</td>
		                `).join('')}
			        </tr>
		        </tbody>
		    </table>
		`;
		
//		使用服务版本号的批次信息
		var serviceModel = `
			<table id="information" class="table table-bordered" style="margin-left:1%;width:99%;">
				<h4 class="infoHeader">作业信息</h4>
		        <thead>
			        <tr>
				        <th title="环节名称">环节名称</th>
				        <th title="作业用户">作业用户</th>
				        <th title="开始时间">开始时间</th>
				        <th title="结束时间">结束时间</th>
			        </tr>
		        </thead>
		        <tbody>
			        ${main.userList.map(d => `
				        <tr>
					        <td title="${d.activityName || ''}">${d.activityName || ''}</td>
					        <td title="${d.assignee || ''}">${d.assignee || ''}</td>
					        <td title="${util.Time(d.startTime || '')}">${util.Time(d.startTime || '')}</td>
					        <td title="${util.Time(d.endTime || '')}">${util.Time(d.endTime || '')}</td>
				    	</tr>
				    `).join('')}
		        </tbody>
		    </table>
		`;
		$(".infoColor").html(viewModel+serviceModel);
	},

//	点击复制详细内容内容
	copyInfo: function(e){
        var copyText = e.target.innerText;
        var copyInput = document.createElement('input');
        copyInput.value = copyText;
        document.body.appendChild(copyInput);
        copyInput.select();
        document.execCommand("Copy");
        copyInput.className = 'copyInput';
        copyInput.style.display='none';
		util.errorView("复制到剪切板",true);
        copyInput.remove();
	},
	
//	查看某一类型相关工作流的任务
	activityChange: function(){
		var activityValue = $(".activityKey option:selected").val();
		main.Table('activityValue',activityValue);
	},
	
	
//	获取任务的版本列表和批次信息
	batchInfos: function(taskId,junge=false){
		if(junge){
			var batchUrl = window.kms+'task/currentBatchInfo?taskId='+taskId;
		}else{
			var batchUrl = window.kms+'task/batchInfos?taskId='+taskId;
		}
	    $.ajax( {
	        type : "get",
	        url : batchUrl,
//			url : window.kms+'task/batchInfos?taskId='+row.data().taskId,
	        async : false,
	        success : function(data) {
	        	if(!data.result){
	        		return;
	        	}
	        	main.batchList = data.result;
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},

//	模版关闭按钮
	modalClose: function(isTable = false,isRefresh = false,isCheck = false){
		
//		clearTimeout(window.timeLog); 
		
//		窗口关闭后,修改变量值以判断websocket的关闭
		mainLog.closeJunge = false;
//		关闭所有的模态框
	    $('#modal-default').modal('hide');
	    $('#modal-default-flowing').modal('hide');
	    $('#write-modal').modal('hide');
	    $('.modal-backdrop').remove();
	    $('.modals3').remove();
	    $('#flowingFrame').remove();
	    $('.Receives').remove();
//		判断是否处于当前任务的关闭---刷新列表
		if(isTable && isRefresh){
//			重置监控日志的计时器
			clearTimeout(mainLog.highLightTime); 
			clearTimeout(mainLog.logTime); 
//			关闭websocket日志
//			if(websocket){
//				websocket.close();
//			}
		};
		if(isCheck && isTable){
			myTask.Table();
		}
	},

//	当前任务预览模板(监控界面)
	flowingModale: function(e){
    	var processInstanceId  = e.currentTarget.getAttribute('data-dId');
    	var id1  = e.currentTarget.getAttribute('data-dKey');
    	var taskId = '', 
    		activitiesName = '',
    		processDefinitionId = '';
//  	预览当前任务(打开监控界面),需要获取该任务的详情数据
    	$.ajax( {
        	type : "get",
	        url : window.kms+'runtime/process-instances?includeProcessVariables=true&id='+id1,
//	        url : window.kms+'runtime/process-instances?includeProcessVariables=true&id='+id1,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取所需要的监控界面所需要的参数
				processDefinitionId = data.data[0].processDefinitionId;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskInfoId"){
						taskId = data.data[0].variables[l].value;					//任务的taskId
					}
					if(data.data[0].variables[l].name == "taskName"){
						activitiesName = data.data[0].variables[l].value;			//任务名
					}
				}
				
//				将所需参数存入数组当中
				monitor.monitorIds = {
					taskName			: "当前任务 ( "+taskId+"--"+activitiesName+" )",
					processDefinitionId : processDefinitionId,
					processInstanceId 	: processInstanceId,
					taskId 				: taskId
				}
				monitor.monitorInit('main');
				
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},

//	选择流程方式窗口关闭
	modalClose1: function(){
		$('.modals1').hide();
		$('.modal1').hide();
	}

}

