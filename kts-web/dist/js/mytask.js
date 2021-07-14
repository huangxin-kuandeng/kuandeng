
//《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《《-----我的任务-------》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》

//点击我的任务
$(".MyTask").click(function(){
	$('.content-header h1').text('我的任务');
	
	var userModel = "";
	if(user.userType){
		userModel = `
			<div class="activityKey" style="padding-left:10px;float:left;margin-left:10px;">
				<select class="form-control" style="width:200px;float:left;" onchange="myTask.activityChange();">
					<option value="">所有任务</option>
					<option value="SelectHandle">图片选取</option>
					<option value="MarkHandle">标注作业</option>
					<option value="MarkQC">标注质检</option>
					<option value="MarkAcceptance">标注验收</option>
					<option value="MarkPublish">发布成功</option>
				</select>
			</div>
		`;
	}else{
		userModel = "";
	}
//  我的任务列表的模板
	var test1 = ` 
		<div class="row">
			<div class='testmodal'></div>
			<div class='devicemodal'></div>			
			<div class="col-xs-12">
			<div id='operByLot'></div>

				<div class="box box-warning">
					<div class="box-header">
						<div class="buttons"></div>
						<h3 class="box-title">我的任务列表</h3>
					</div>
					<div class="searchType" style="padding:0px 10px;">
						<select class="form-control markTypes" style="float: left;max-width: 120px;margin-right: 10px;">
							<option value="1" selected>语义分割</option>
							<option value="2">目标检测</option>
						</select>
						<button class="btn btn-warning randomClaimTasks" style="float:left;margin-right:10px;">领取任务</button>
						<!--<select class="form-control" style="width:200px;float:left;">
							<option class="change" value="taskId">根据taskId来查找任务</option>
							<option class="change" value="transId">根据transId来查找任务</option>
							<option class="change" value="trackIds">根据trackIds来查找任务</option>
							<option class="change" value="taskName">根据名称来查找任务</option>
						</select>
						<input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="myTask.myTaskSearch(event)" style="float:left;width:130px;margin:0px 5px;" />-->
						<button type="button" class="btn btn-success" onclick="util.Refresh(myTask)" style="float:right;">刷新列表</button>
						<button class="btn btn-success operByLotBtn" style = 'float: right;margin-right: 4px;'>批量操作</button>
					</div>
					${userModel}
					<div class="box-body myTaskBody">
					
					</div>
				</div>
			</div>
		</div>
	`;

	$('.content.container-fluid').html(test1);
	
	queryValue = 0;
	myTask.Table();

	let _option = {
		urlSets: {
			'sel': '',
			'del': '',
			'cus': window.kms_v2 + 'data/web_form/info/create'
		},
		'cols': [
			{ values: null, code: 'pacId', name: '任务包ID' },
			// {value:null,code:'name',name:'导入批次名称'},
			// {
			// 	values: {
			// 		'0': '未使用', '1': '失败',
			// 		'2': '进行中',
			// 		'3': '成功'
			// 	}, code: 'status', name: '状态'
			// },
			// { value: null, code: 'createTime', name: '导入时间', type: 'time' },
		],
		'selCallback': myTask.randomClaimTasks,
		'insByLotCallback': null,
		'insAlotCallback': null,
		'fn': {
			// insByLot: { inUse: true, desc: '查询结果批量创建' },
			// insAlot: { inUse: true, desc: '勾选多行批量创建' },
		},
		'pageName': 'MyTask'
	}
	operByLot.load(_option);
			/*进行批量操作*/
			$('button.operByLotBtn').click(function () {
				$('div#operByLot .operByLot').css('display', 'block')
			})

})

//------------------------------------------新增表格----表格内容----模板---------------------------------------------
	
var taskData1,						//任务的数据存储
	processInstanceId,				//流程的实例id
	activityId1,					//当前环节名称
	taskName,						//任务名称
	handleFlag,						//是否进入下一步的判断
	Key, 							//任务的KeyId
	processDefinitionId,			//流程Id
	param = {},						//分页对象
	CN_FORM = {						//中文显示
		"1":"机身",
		"2":"镜头",
		"3":"GPS",
		"4":"DTU",
		"5":"IMU",
		"6":"天线",
	},
	_data = {},						//任务分配时传输的数据
	loginName,						//用户名
	booleanId, 						//判断参数false----true
	lengthNum, 						//数据的条数
	formProperties, 				//数据分组1
	deviceId1,						//设备id
	deviceData,						//设备的数据
	activitiesName = "",			//任务名称
	people = null,					//判断任务处理时所需,判断处于哪个处理阶段1
	userJunge = null,				//判断任务处理时所需,判断处于哪个处理阶段2
	queryValue;						//进入我的任务判断所需
	
var myTask = {
	
	taskType: null,
	
	searchType: null,				//任务搜索功能(搜索类型)
	
	searchTypeValue: null,			//任务搜索功能(搜索条件)
	
	Table: function(){
		$('.randomClaimTasks').click(function(){
			myTask.randomClaimTasks();
		})
		myTask.tableInit();
	},
	
	/*列表初始化*/
	tableInit: function(){
		let _table = `
		    <table id="example2" class="table table-bordered table-hover">
		    
		    </table>
	    `;
	    $('.myTaskBody').html(_table);
	    
    	var table = $(".myTaskBody #example2").DataTable({
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
				var myTaskURL = window.kms+"task/taskInfo/current?pageSize=10&pageNum="+param.page+"&current_operator="+user.username;
				
				if(myTask.searchTypeValue && myTask.searchTypeValue){
					myTaskURL += ('&'+myTask.searchType+'='+myTask.searchTypeValue);
				}

		
				
				util.getAjax(myTaskURL, true, function(data){
                    var returnData = {};
                    returnData.recordsTotal = data.total;
                    returnData.recordsFiltered = data.total;
                    returnData.data = data.result;
                	callback(returnData);
				})
	        },
        	columns: [
	            { 
	            	"data": "taskId" || "",
					"title": "任务ID",
					"class": "taskId"
				},
	            { 
	            	"data": "taskName" || "",
					"title": "任务名称",
					"class": "taskName"
				},
	            { 
	            	"data": "currentLink" || "",
					"title": "当前环节",
					"class": "currentLink" 
	            },
	            {
	            	"data": "createTime", 
	              	"render": function ( data, type, row,  meta ) {
						var createTime1 = util.Time(row.createTime);
					    return	createTime1 || "";
					},
					"title": "创建时间",
	            	"class":"createTime" 
	            },
	            { 
	            	"data": "starter" || "",
					"title": "创建者",
					"class": "starter"
				},
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
					    let taskDefinitionKey1 = row.taskDefKey || '',
							taskTitle = row.currentLink || '',
							taskId = row.taskId || '',
							functionName = '',
							className = '',
							aclassName = '';
//          			分配人员时的展示效果与触发事件
						if( (taskDefinitionKey1.indexOf("Assign") >= 0) ){
							functionName = "myTask.receiveId1(event)";
							className = "glyphicon-user";
							aclassName = "receive2";
						}else if( (taskDefinitionKey1 == "MarkQC") || (taskDefinitionKey1 == "MarkAcceptance") || (taskDefinitionKey1 == "MarkHandle") ){
							className = "glyphicon-cog";
							aclassName = "receive3 ManualRec NewMark";
						}else{
							functionName = `myTask.user2(event,"myTask")`;
							className = "glyphicon-cog";
							aclassName = "receive3 ManualRec";
						}
						
						let centerModel = `
							<a class='btn btn-open' title='预览' href='#' data-dtaskId='${taskId}' data-dId='${data}' data-dKey='${row.processInstanceId}' onclick='myTask.flowingModale1(event)'>
								<i class='glyphicon glyphicon-eye-open'></i>
							</a>
							<a class='btn btn-receive ${aclassName}' title='${taskTitle}' data-toggle='modal' data-target='.modal1' href='#' data-dtaskId='${taskId}' data-dId='${data}' data-dKey='${row.processInstanceId}' onclick='${functionName}'>
								<i class='glyphicon ${className}'></i>
							</a>
						`;
				    	return  centerModel;
					},
					"title": "操作",
					"class": "center"
	            }
	        ]
	    });
	    
	    $('#example2 tbody').on('click', 'tr a.NewMark', function (event) {
	        var tr = event.target.closest('tr'),
	        	row = table.row( tr ),
	        	data = row.data() || {};
	        testAndCheck.Table(data);
	    });
	},
	
	/*我的任务列表--随机领取任务*/
	randomClaimTasks: function(_params){
//		mark_role mark_inspect_role mark_check_role
		let markType = $('.markTypes').val();
		$("#loading").css("display","block");
		let myTaskURL = window.kms_v2 + 'task/operation/claimTasks?markType=' + markType + '&user='+user.username;
				/**批量条件查询参数 */
				if (_params && !$.isEmptyObject(_params)) {

					Object.keys(_params).forEach(el => {
						let _val = _params[el];  let _el = el;
						myTaskURL += ('&'+_el+'='+ _val);
	
					})
				}
	    $.ajax( {
	        type : "get",
	        url : myTaskURL,
	        async : true,
	        success : function(data) {
				$("#loading").css("display","none");
				if(data.code != '0'){
	        		util.errorView(data.message);
	        		return;
				}
				let task_length = data.result.activitiTaskIds.length;
	        	util.errorView("此次领取了"+task_length+"个任务",true);
	        	// if(callback){
	        	// 	callback(data);
	        	// }else{
					myTask.tableInit();
	        	// }
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
		
		
	},
	
//	搜索条件------搜索类型，过滤条件
//-----------------------------------------当前任务--根据条件进行搜索任务
	myTaskSearch: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			queryValue = 1;
			myTask.searchType = $('.searchType option:selected').val();
			myTask.searchTypeValue = $('.searchTypeValue').val();
			myTask.tableInit();
		}
	},

	activityChange: function(){
		myTask.searchType = "taskDefinitionKey";
		myTask.searchTypeValue = $(".activityKey option:selected").val();
		myTask.tableInit();
	},

//任务领取-------------------------------------------我的任务-----------------------------------------
	receiveId1: function(e){
//		先获取所要操作的任务的详细信息
		processInstanceId  = e.currentTarget.getAttribute('data-dId');
		Key  = e.currentTarget.getAttribute('data-dKey');
	    $.ajax( {
	        type : "get",
//  		url : window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	    	url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+Key,
	        async : false,
	        data : {},
	        success : function(data) {
				activityId1 = data.data[0].taskDefinitionKey;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskName"){
						taskName = data.data[0].variables[l].value;				//任务名
					}
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	    myTask.user2(event);
	},

//---------------------------------我的任务流程预览
	flowingModale1: function(e){
//		我的任务预览功能(我的任务列表的监控界面)
	    processInstanceId  = e.currentTarget.getAttribute('data-dId');
	    Key  = e.currentTarget.getAttribute('data-dKey');
	    $.ajax( {
	        type : "get",
//      	url : window.kms+'task/queryforType?pageSize=100',
//      	url : window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	        url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+Key,
	        async : false,
	        data : {},
	        success : function(data) {
//	        	获取所需要的监控界面所需要的参数
				processDefinitionId = data.data[0].processDefinitionId;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskId"){
						taskId = data.data[0].variables[l].value || "";					//任务的taskId
					}
					if(data.data[0].variables[l].name == "taskName"){
						activitiesName = data.data[0].variables[l].value || "";			//任务名
					}
				}
//				将所需参数存入数组当中
				monitor.monitorIds = {
					taskName			: "我的任务 ( "+taskId+"--"+activitiesName+" )",
					processDefinitionId : processDefinitionId,
					processInstanceId 	: Key,
					taskId 				: taskId
				}
				monitor.monitorInit('myTask');
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	    
	},

//--------------------------------------------------我的任务处理--------------------------------------------------

//--------------------------------------------------查询可分配的人员列表------------------------------------------
	user2: function(e,type=null){
		myTask.taskType = type;
		if(!user.username){
			util.errorView("登陆信息已过期，请刷新页面重新登录!");
			return;
		}
//		查询当前所登陆的用户可以分配的人员列表
		var thisName, junge;
		people = null;
		userJunge = null;
		var dtaskId  = e.currentTarget.getAttribute('data-dtaskId');
		booleanId  = e.currentTarget.getAttribute('data-dId');
		Key  = e.currentTarget.getAttribute('data-dKey');
//		我的任务进行操作时,查询所需要的数据,并展示出来(传输)
	    $.ajax( {
	        type : "get",
	        url : window.kms+'form/form-data?taskId='+booleanId,			//查询传输给后台所需数据
	        async : false,
	        data : {},
	        success : function(data) {
				
				formProperties = data.formProperties;
				lengthNum = data.formProperties.length;					//判断数据数目
				taskManage.auditBatchs = [];
				formProperties1 = [];
				formBoolean = [];
				formBatch = [];
//	        	判断是否为分配用户
				if(lengthNum>0){
					if( (lengthNum >= 1) && (formProperties[0].type == "user") ){
						userJunge = formProperties[0].id;
					}
				}
				for(var i=0; i<formProperties.length; i++){
					if(formProperties[i].id == "deviceId"){
						junge = true;									//判断是否可以分配设备所需
					}
					if(formProperties[i].id == "surveyor"){
						people = true;									//判断是否为采集任务所需
					}
					
					if( (formProperties[i].type == "user") || (formProperties[i].id == "surveyor") ){
						formProperties1.push(formProperties[i]);
					}
					if(formProperties[i].type == "boolean"){
						formBoolean.push(formProperties[i]);
					}
					if(formProperties[i].id == "auditBatch"){
						formBatch.push(formProperties[i]);
						taskManage.batchLists(dtaskId);
					}
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
//--------------------------------------------------任务分配模板------------------------------------------------

		var receive1 =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">任务分配 ( ${taskName} )</h4>
			        </div>
			        <div class="modal-body">
						
						
						<!------------------------------------采集设备列表------------------------------------>
						
						<div class="form-group child getalldevice">
						
						</div>
						
							<!--------------------------------是否进入下一环节--------------------------------->
							
					        ${formBoolean.map(f => `
								<div class="form-group peoples">
									<label class="col-sm-5 control-label" >${f.name}:</label>
									<div class="col-sm-7" id="${f.id}">
										<select class="form-control" id="Boolean">
							            	<option class="change" value=true>是</option>
							            	<option class="change" value=false>否</option>
		                				</select>
									</div>
								</div>
					        `).join('')}
							
							<!-------------------------------选择相应批次进行数据审核------------------------------>
							
					        ${formBatch.map(f => `
								<div class="form-group">
									<label class="col-sm-5 control-label" >${f.name}:</label>
									<div class="col-sm-7">
										<select class="form-control" id=${f.id}>
											<option value="">请选择最佳批次</option>
						        			${taskManage.auditBatchs.map(t => `
								                <option value="${t.batchIds}">${t.batchNames}</option>
						        			`).join('')}
				                		</select>
									</div>
								</div>
					        `).join('')}
						
						<!------------------------------------确认分配或取消------------------------------------>
						
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="分配" data-dismiss="modal" onclick="myTask.receive()">分配</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`
		$('.testmodal').html(receive1);
//		获取任务的名称等需要显示的数据
    	$.ajax( {
        	type : "get",
//  		url : window.kms+"runtime/tasks?includeProcessVariables=true&size=10&assignee="+user.username+"&sort=executionId&order=desc&start="+param.start,
	        url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+Key,
	        async : false,
	        data : {},
	        success : function(data) {
				activityId1 = data.data[0].taskDefinitionKey;
				thisName = data.data[0].name;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskName"){
						taskName = data.data[0].variables[l].value;
					}
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });

//		----------初始化前段展示
		$('.modal1 h4').html( "任务分配 ( "+taskName+" )" );
		$('.modal1 #button1').html( "分配" );
		$('.modal1 #button1')[0].title = "分配";
//		设备分配-----普通分配
		if(people){
//			设备分配bug使用display:none功能隐藏起来
			myTask.getType();
			$(".child").css("display", "block");
//		-------------分配人员变化
		}else if( userJunge && !people && (lengthNum>0) ){
			$(".child").css("display", "none");
			if(junge){
				myTask.getType();
			}
//		-----------其他展示的样式
		}else{
			$(".child").css("display", "none");
			$('.modal1 h4').html( taskName+"( "+thisName+" )" );
			$('.modal1 #button1').html( "完成"+thisName );
			$('.modal1 #button1')[0].title = "完成"+thisName;
		}


	},

//	------------------------------------采集设备列表查询-----------------------------------------------

	getType: function(){
	    $.ajax( {
	        type : "get",
	        url : window.Ftp+"calibrated/survey/device/findAll?size=100&inUser=1",			//通过ip端口-相机-定位-等信息进行---采集设备列表查询---
//      	url示例:      http://127.0.0.1:8080/krs/device/getAll?cameraType=1000&locDeviceType=1000
	        async : false,
	        data : {},
	        success : function(data) {
//	        	console.log(data.result)
//      		if(data.result.length != 0){										//采集设备存在
	    		deviceData = data.result.result;
	    		var deviceModel = `
	    		
					<label class="col-sm-5 control-label" >采集设备:</label>
					<div class="col-sm-6" style="padding-right:0">
						<select class="form-control" id="deviceId">
				            <option class="change" value="change">请选择采集设备</option>
			                ${deviceData.map(d => `
				                <option value=${d.id}>${d.surveyDevice.name} ( 版本${d.cameraCalibrationInfo.version+1} )</option>
			                `).join('')}
		                </select>
		                
					</div>
					<div class="col-sm-1" style="padding:0">
						<a class="glyphicon glyphicon-chevron-right" title="预览设备" href="#" onclick="myTask.deviceOpen()" style="color:gray" data-toggle="modal" data-target="#modal-default1"></a>
					</div>
					
	    		`;
	    		$(".getalldevice").html(deviceModel);
        		
//      		$("#deviceId").val("deviceId : "+data.result[0].deviceId);
//      			deviceId1 = String(data.result[0].deviceId);
//      		}else{																//采集设备不存在
//      			$(".getalldevice").html();
//      		}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},

//	分配时,采集设备的预览功能(查看硬件设备的详细信息)
	deviceOpen: function(){
		deviceId1 = $('#deviceId option:selected').val();
		deviceIdName = $('#deviceId option:selected').text();
		if(deviceId1 == "change"){
			return;						//没有选择相应的采集设备时
		}
		var hardwareDevices;
        $.ajax({
            type: "GET",
    		url : window.Ftp+"calibrated/survey/device/"+deviceId1,
		    async : false,
			contentType: "application/json; charset=utf-8",
            success: function (result) {
	            if( result.code!="0" ){
	                return;
	            }
	            var hTime = util.Time(result.result.createTime) || "";			//更新时间
	            var hName = result.result.surveyDevice.name || "";				//采集设备名称
	            var hId = result.result.surveyDevice.id || "";					//采集设备的id
	            var hRemark = result.result.remark || "";						//采集设备的备注信息
	            var hSignId = result.result.id || "";							//最新标定的id
            	hardwareDevices = result.result.surveyDevice.hardwareDevices;
            	var hText = deviceIdName+"(设备id:"+result.result.surveyDevice.id+"-标定id:"+result.result.id+")"
            	var Model = `
				<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default1">
					<div class="modal-dialog task-dialog" style="width:500px;height:500px;">
						<div class="modal-content task-modal-content">
							<div class="modal-header">
			    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" >
			    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			    				</button>
								<h4 class="modal-title">${hName}</h4>
							</div>
							<div class="modal-body task-modal-body">
			            		<div class="box-body" style="text-align:center;font-size:14px;">

									<p>标定时间 : ${hTime}</p>
									<p>采集设备ID : ${hId}</p>
									<p>标定版本ID : ${hSignId}</p>
									<p>备注信息 : ${hRemark}</p>
									
								    <table id="example2" class="table table-bordered table-hover">
							            <thead style="font-weight:bold;">
							                <tr>
								                <th>类型</th>
								                <th>id</th>
								                <th>品牌 </th>
								                <th>型号</th>
								                <th>供应商</th>
								                <th>采购时间</th>
							                </tr>
							            </thead>
							            <tbody>
					                	${hardwareDevices.map(f => `
							                <tr>
								                <th>${CN_FORM[f.deviceType]}</th>
								                <th>${f.id}</th>
								                <th>${f.brand} </th>
								                <th>${f.model}</th>
								                <th>${f.supplier}</th>
								                <th>${f.purcTime}</th>
							                </tr>
					                	`).join('')}
							            </tbody>
								    </table>
								
			  					</div>
							</div>
						<!-- /.modal-content -->
						</div>
					<!-- /.modal-dialog -->
					</div>
				</div>
            	`;
				$('.devicemodal').html(Model);
            }
       	});
	},

//	------------------------------------------采集设备列表查询------------------------------------
	receive: function(){
		var users = [];
		var forms = [];
		var jungeFlag = false;
//		查询是否存在进入下一步或者重跑的参数
		for(var l in formProperties){
			if(formProperties[l].id == "handleFlag"){
				var formValue = $("#"+formProperties[l].id+" option:selected").val();
				if( (formValue == true) || (formValue == "true") ){
					jungeFlag = true;
				}
			}
		}
		
//		添加所需要传输的参数
		for(var i in formProperties){
			if(formProperties[i].type == "user"){
				if( $(".peoples #"+formProperties[i].id+" option:selected").val() == "" ){
					util.errorView("请选择分配用户！");
					return;
				}
				users.push({
		            "id": formProperties[i].id,
		            "value": $(".peoples #"+formProperties[i].id+" option:selected").val()
//		            "value": $(".peoples #"+formProperties[i].id+" option:selected").val() || user.username
				})
			}else{
				if(formProperties[i].id == "auditBatch"){
//					审核通过时所需要传输的最佳批次
					if(jungeFlag){
						if(formProperties[i].id == "handleFlag"){
							forms.push({
					            "id": formProperties[i].id,
					            "value": ("#"+formProperties[i].id+" option:selected").val() || ""
							})
						}else{
							if(jungeFlag){
								if(!$("#"+formProperties[i].id+" option:selected").val()){
									util.errorView("请选择最佳批次");
									return;
								}
							}
							forms.push({
					            "id": formProperties[i].id,
					            "value": $("#"+formProperties[i].id+" option:selected").val() || ""
							})
						}
					}
				}else{
//					审核通过时所需要传输的最佳批次
					if(formProperties[i].id == "handleFlag"){
						forms.push({
				            "id": formProperties[i].id,
				            "value": $("#"+formProperties[i].id+" option:selected").val() || ""
						})
					}else{
//						其他选择需要传输的参数
						forms.push({
				            "id": formProperties[i].id,
				            "value": $("#"+formProperties[i].id+" option:selected").val() || ""
						})
					}
				}
			}
		}
		
		var surveyor = $('.peoples #surveyor option:selected').val();
		deviceId1 = $('#deviceId option:selected').val();

//		--------------------------------------判断是否进行重跑的传参-------------------------------------
		if( !userJunge && !people && (forms.length != 0) ){
			_data = {
			    "taskId": booleanId,
			    "properties": forms
			}
//		--------------------------------------------设备分配给采集操作员-----------------------------------
		}else if(deviceId1 && deviceId1 != ""){
			if(surveyor == "change"){
				util.errorView("请选择分配人员");
				return;
			}
			_data = {
			    "taskId": booleanId,
			    "properties": forms
			}
		
//		-----------------------------------------分配操作员--------------------------------------
		}else if( !people && (users.length != 0) ){
			_data = {
			    "taskId": booleanId,
			    "properties": users
			}
//		-------------------------------------异常处理(采集数据上传异常处理-识别异常处理-融合异常处理-自动编辑异常处理)------------------------------
		}else{
			_data = {
			    "taskId": booleanId,
			    "properties": [
					
			    ]
			}
		}
//		--------------------------分配给采集员-------------------------
	    $.ajax({
	        type : "post",
	        url : window.kms+'form/form-data',			//通过deviceId分配给相应采集员
	        async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_data),
	        success : function(data) {
//	        	if(data.message){
//	           		util.errorView(data.message);
//	           		return;
//	        	}
	            main.modalClose();
	            if(myTask.taskType == "myTask"){
	    			myTask.tableInit();
	            }else if(myTask.taskType == "errorTask"){
	            	errorTask.Table();
	            }else{
	            	myTask.tableInit();
	            }
				
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
		
	}

}


