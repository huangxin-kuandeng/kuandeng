/*
 * 
 * 监控界面的环节处理
 * 
 */

//分配任务所需要的参数
var taskName = '',				//任务名称
	handleFlag,				//重跑或者进入下一环节的判断
	_data = {},				//任务处理时所需要传输的参数
	loginName,				//登录的用户信息
	deviceId1,				//设备的信息(传参使用)
	taskId,					//用户所需要的数据传输，这个id为任务数据的id
	lengthNum,				//重跑数据参数的length(判断重跑时所需要的)
	formProperties,			//查询的参数缓存1
	formProperties1 = [],		//查询的参数缓存2
	formBoolean = [],		//查询的参数存在是否选项
	formBatch = [],				//查询的参数是否包含批次信息
	thisName,				//任务名称
	junge,					//判断是否存在设备参数
	openUrl,				//当前环节名称
	urlArr = {},			//根据activities来对应相应的url页面
	IdTask,					//跳转页面所需要的id
	people = null,
	userJunge = null;

var taskManage = {

	CN_FORM: {						//中文显示
		"1":"机身",
		"2":"镜头",
		"3":"GPS",
		"4":"DTU",
		"5":"IMU",
		"6":"天线",
	},
	
	ContrastButton	: "",
	
	auditBatchs		: [],		//审核批次
	
//	根据历史任务跳转编辑器界面
	initHistory: function(processInstanceId,openUrl){
//		获取历史任务的详细信息
	    $.ajax( {
	        type : "get",
	        url : window.kms+"history/historic-process-instances/"+processInstanceId,
	        async : false,
	        data : {},
	        success : function(data) {
	        	var taskId = data.businessKey;
				urlArr = {
					"SelectHandle"		: "图片选取",					//图片选取
					"RecHandle"			: "识别",						//识别
					"FusionHandle"		: "融合",						//融合
					"ManualEdit"		: "编辑",						//编辑
					"sdEdit"			: "传统地图编辑",				//传统地图编辑
					"ManualCheckEdit"	: "质检"						//质检
				};
	        	var historyUrl = window.Web_editor+'editor/app/road-editor/index.html?system_type=6&user_type=2&taskID='+taskId;
	        	if( taskId && (urlArr[openUrl]) ){
					window.open(historyUrl);
	        	}
	     	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
//	获取任务的详细信息
	init: function(processInstanceId){
//		var fusionCheckBatch = 1654;			//融合任务对比
		var fusionCheckBatch = null;			//融合任务对比
//		获取我的任务的详细信息
	    $.ajax( {
	        type : "get",
	        url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+processInstanceId,
	        async : false,
	        data : {},
	        success : function(data) {
				var urls = window.Web_editor+'editor/app/road-editor/index.html?system_type=';
	        	openUrl = data.data[0].taskDefinitionKey;
				thisName = data.data[0].name;
				taskId = data.data[0].id;
				
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskName"){
						taskName = data.data[0].variables[l].value || "";					//任务名称
					}
					if(data.data[0].variables[l].name == "taskInfoId"){
						IdTask = data.data[0].variables[l].value || "";					//任务名称
					}
					if(data.data[0].variables[l].name == "fusionCheckBatch"){
						fusionCheckBatch = data.data[0].variables[l].value || "";					//任务名称
					}
				}
				urlArr = {
					"RecHandle" : urls+"3&user_type=2&taskID="+IdTask,							//识别
					"FusionHandle" : urls+"2&user_type=2&taskID="+IdTask,						//融合
					"ManualEdit" : urls+"1&user_type=2&taskID="+IdTask,							//编辑
					"ManualEditAutoCheckHandle" : urls+"1&user_type=2&taskID="+IdTask,			//编辑
					"SelectHandle" : urls+"6&user_type=2&taskID="+IdTask,						//图片选取
					"sdEdit" : urls+"4&user_type=2&taskID="+IdTask,								//传统地图编辑
					"ManualCheckEdit" : urls+"5&user_type=2&taskID="+IdTask						//质检
				};
	     	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	    
//		判断是否存在需要融合对比的参数
	    if(openUrl == "FusionHandle"){
	    	if(!fusionCheckBatch){
	    		ContrastButton = "";
	    	}else{
	    		ContrastButton = `<button type="button" id="ContrastBtn" class="btn btn-warning" title="融合任务对比" onclick="taskCheck.Contrast(${fusionCheckBatch})">对比</button>`;
	    	}
	    }else{
	    	ContrastButton = "";
	    }
		taskManage.userBoolean();
//	    taskManage.userCode();
	},
		
//	获取用户可分配的单位的列表
	userCode: function(){
		$.ajax( {
		    type : "get",
		    url : window.Kpms+'sys/user/findByOfficeCode?code='+user.officeCode,
		    async : false,
		    data : {},
		    success : function(data) {
		    	loginName = data;				//可分配到的用户列表
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
		taskManage.userBoolean();
	},

//	获取后台表单所需要的数据参数(传输)
	userBoolean: function(){
	    $.ajax( {
		    type : "get",
		    url : window.kms+'form/form-data?taskId='+taskId,			//查询传输给后台所需数据
		    async : false,
		    data : {},
		    success : function(data) {
				taskManage.auditBatchs = [];
				formProperties1 = [];
				formBoolean = [];
				formBatch = [];
				for(var i=0; i<data.formProperties.length; i++){
					if( (data.formProperties[i].type == "user") || (data.formProperties[i].id == "surveyor") ){
						formProperties1.push(data.formProperties[i]);
					}
					if(data.formProperties[i].type == "boolean"){
						formBoolean.push(data.formProperties[i]);
					}
					if(data.formProperties[i].id == "auditBatch"){
						formBatch.push(data.formProperties[i]);
						taskManage.batchLists(IdTask);
					}
				}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
    	taskManage.userModel();
	},
	
//	获取任务的版本列表和批次信息
	batchLists: function(value){
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/batchInfos?taskId='+value,
	        async : false,
	        success : function(data) {
	        	if(!data.result){
	        		return;
	        	}
	        	for(var item in data.result){
	        		taskManage.auditBatchs.push({
	        			"batchIds"	: item,
	        			"batchNames": item+" (审核通过时才生效)"
	        		});
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
	
//	进行环节处理的展示模板(使用环节名来判断)
	userModel: function(){
		var receive1 =`
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.modalClose()">
					          	<span aria-hidden="true">&times;</span>
					        </button>
			        		<h4 class="modal-title">任务分配 ( ${taskName} )</h4>
			      		</div>
			      		<div class="modal-body">
							
							<!----------------------------------采集设备列表---------------------------------->
							
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
					        
							<!----------------------------------确认分配或取消--------------------------------->
							
							<div class="form-group" style="border:none;margin-top:15px;">
								<button type="button" id="button1" class="btn btn-info" title="分配" onclick="taskManage.receive()">分配</button>
								${ContrastButton}
								<button type="button" id="button2" class="btn btn-default" title="取消" onclick="taskManage.modalClose(1)">取消</button>
							</div>
			      		</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodalSon').html(receive1);
		$('.testmodalSon .modal1').addClass("in");
		$('.testmodalSon .modal1').fadeIn(200);
//		判断环节是否可以进行跳转--修改显示文字
		if(!urlArr[openUrl]){
			$('.modal1 #button2').html( "取消" );
			$('.modal1 #button2')[0].title = "取消";
		}else{
			$('.modal1 #button2').html( "进入系统" );
			$('.modal1 #button2')[0].title = "进入系统";
		}

    	taskManage.userBoolean2();
	},
			
//	模板关闭
	modalClose: function(v){
		if(!v || !urlArr[openUrl]){
			//...模板关闭
		}else{
			//进行编辑器页面跳转
			window.open(urlArr[openUrl]);
		}
//		$('.testmodalSon .modal1').fadeOut(100);
		$('.testmodalSon').html("");
	},
	
//	硬件预览的模板关闭
	closeModel: function(){
		$('.devicemodal .modal').fadeOut(100);
		if($('.modal-backdrop').length > 1){
			$('.modal-backdrop')[0].remove();
		}
	},

//	重新获取后台所需要的数据(传输)
	userBoolean2: function(){
		junge = null;
		people = null;
		userJunge = null;
	    $.ajax( {
		    type : "get",
		    url : window.kms+'form/form-data?taskId='+taskId,			//查询传输给后台所需数据
		    async : false,
		    data : {},
		    success : function(data) {
				var handleFlag = $('#Boolean option:selected').val();
				formProperties = data.formProperties;
				for(var i=0; i<formProperties.length; i++){
					if(formProperties[i].id == "deviceId"){
						junge = true;									//判断是否可以分配设备所需
					}
					if(formProperties[i].id == "surveyor"){
						people = true;									//判断是否为采集任务所需
					}
				}
				
				lengthNum = data.formProperties.length;					//判断数据数目
				if(lengthNum>0){
					if( (lengthNum >= 1) && (formProperties[0].type == "user") ){
						userJunge = formProperties[0].id;
					}
					$('.boolean label').html( data.formProperties[0].name );
				}else{
					
				}
		    },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
	  	taskManage.userModelInit();
	},
		
//	对任务的环节名进行判断所要展示的模板
	userModelInit: function(){
//		----------初始化前段展示
		$('.modal1 h4').html( "任务分配 ( "+taskName+" )" );
		$('.modal1 #button1').html( "分配" );
		$('.modal1 #button1')[0].title = "分配";
//		设备分配-----普通分配
		if(people){
//			设备分配bug使用display:none功能隐藏起来
			taskManage.getType();
			$(".child").css("display", "block");
//		-------------分配人员变化
		}else if( userJunge && !people && (lengthNum>0) ){
			$(".child").css("display", "none");
			if(junge){
				taskManage.getType();
			}
//		-----------其他展示的样式
		}else{
			$(".child").css("display", "none");
			$('.modal1 h4').html( taskName+"( "+thisName+" )" );
			$('.modal1 #button1').html( "确认" );
			$('.modal1 #button1')[0].title = "确认";
//			处理环节前段展示变化
			if(lengthNum>0){
				
			}else{
				var Trigger = window.operation;
				if(Trigger.indexOf("rigger") > 0 ){
					$('.modal1 #button1').html("重新触发");
					$('.modal1 #button1')[0].title = thisName;
				}else{
					$('.modal1 #button1').html( "完成"+thisName );
					$('.modal1 #button1')[0].title = "完成"+thisName;
				}
			}
		}
	},

//	------------------------------------采集设备列表查询-----------------------------------------------
	getType: function(){
	    $.ajax( {
		    type : "get",
		    url : window.Ftp+"calibrated/survey/device/findAll?size=100&inUser=1",			//通过ip端口-相机-定位-等信息进行---采集设备列表查询---
		    async : false,
		    data : {},
		    success : function(data) {
	    		deviceData = data.result.result;
//	    		采集设备的模板选择
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
						<a class="glyphicon glyphicon-chevron-right" title="预览设备" href="#" onclick="taskManage.deviceOpen()" style="color:gray" data-toggle="modal" data-target="#modal-default1"></a>
					</div>
	    		`;
	    		$(".getalldevice").html(deviceModel);
	    	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	采集设备的硬件预览
	deviceOpen: function(){
		deviceId1 = $('#deviceId option:selected').val();
		deviceIdName = $('#deviceId option:selected').text();
		if(deviceId1 == "change"){
			util.errorView("请选择采集设备");
			return;
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
            	hardwareDevices = result.result.surveyDevice.hardwareDevices;
            	var hText = deviceIdName+"(设备id:"+result.result.surveyDevice.id+"-标定id:"+result.result.id+")"
            	var Model = `
				<div class="modal task-modal" data-show="true" id="modal-default1">
					<div class="modal-dialog task-dialog" style="width:500px;height:400px;">
						<div class="modal-content task-modal-content">
							<div class="modal-header">
			    				<button type="button" class="close" title="关闭" aria-label="Close" onclick="taskManage.closeModel()">
			    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			    				</button>
								<h4 class="modal-title">${hText}</h4>
							</div>
							<div class="modal-body task-modal-body">
			            			<div class="box-body" style="text-align:center;font-size:14px;">

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
								                <th>${taskManage.CN_FORM[f.deviceType]}</th>
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
				$('.devicemodal .modal').addClass("in");
				$('.devicemodal .modal').fadeIn(200);
            }
       	});
	},

//	------------------------------------------分配与环节处理请求------------------------------------
	receive: function(){
//		查询任务是否已经被用户申领,即是否存在assignee参数
		var assignee = null;
		var taskDefinitionKey = null;
	    $.ajax( {
		    type : "get",
		    url : window.kms+'runtime/tasks/'+taskId,		//查找任务的详细信息
		    async : false,
		    data : {},
		    success : function(data) {
		    	assignee = data.assignee;
		    	taskDefinitionKey = data.taskDefinitionKey;
	    	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
//		未进行申领的任务,自动进行申领到当前所登陆用户
	    if( !assignee && (taskDefinitionKey.indexOf("Handle") >= 0) ){
			if(!taskId || !user.username){
				return;
			}
			var _data = {
				"action" : "claim",
				"assignee" : user.username
			}
		    $.ajax({
		        type : "post",
		        url : window.kms+'runtime/tasks/'+taskId,			//通过id进行任务申领
		        async : false,
				contentType: "application/json; charset=utf-8",
		        data : JSON.stringify(_data),
		        success : function(data) {
		        	util.errorView("自动申领任务成功",true);
		        },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
			   	},
		    });
	    }
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
				})
			}else{
				if(formProperties[i].id == "auditBatch"){
//					审核通过时所需要传输的最佳批次
					if(formProperties[i].id == "handleFlag"){
						forms.push({
				            "id": formProperties[i].id,
				            "value": $("#"+formProperties[i].id+" option:selected").val() || ""
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
			    "taskId": taskId,
			    "properties": forms
			}
//		--------------------------------------------设备分配操作员-----------------------------------
		}else if(deviceId1 && deviceId1 != ""){
			if(surveyor == "change"){
				util.errorView("请选择分配人员");
				return;
			}
			_data = {
			    "taskId": taskId,
			    "properties": forms
			}
//		-----------------------------------------分配操作员--------------------------------------
		}else if( !people && (users.length != 0) ){
			_data = {
			    "taskId": taskId,
			    "properties": users
			}
//		-------------------------------------异常处理(采集数据上传异常处理-识别异常处理-融合异常处理-自动编辑异常处理)------------------------------
		}else{
			_data = {
			    "taskId": taskId,
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
//	        	if(data != ""){
//	           		util.errorView(data.message);
//	           		return;
//	        	}
	          	taskManage.modalClose();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},

}
