

//	选择未使用的相机（机身），选择未使用的镜头
//	新增视觉设备，绑定相机和镜头（镜头可能多个，当前是一个），生成相机唯一ID，录入属性（待补充）、自动添加、更新时间、操作员；
//	新增成功提示；
//	标记使用到的相机和镜头为已使用

//	只能修改属性信息，不能修改相机、镜头绑定关系
//	如修改绑定关系，则删除后，再添加一个新视觉设备

//	标记删除
//	释放相机和镜头



//$(".collecting_device").click(function(){
//  collecting_device.collecting_deviceTable();
//});

var collecting_device = {
	
	signType: false,
	
//	中文显示
	CN_FORM:{
		"1":"机身",
		"2":"镜头",
		"3":"GPS",
		"4":"DTU",
		"5":"IMU",
		"6":"天线",
		"7":"雷达"
	},
	
	judge:{
		"0":"未标定",
		"1":"已标定"
	},
	
	sourceTrackId: [],
	
	name: "采集设备",
	
	directions: [
		{ id: "1", name: "左前" },
		{ id: "2", name: "前" },
		{ id: "3", name: "右前" },
		{ id: "4", name: "左" },
		{ id: "5", name: "右" },
		{ id: "6", name: "左后" },
		{ id: "7", name: "后" },
		{ id: "8", name: "右后" }
	],
	
//	相机标定所需要的参数
	JsonForm1: [
		{ id: "focusX", name: "焦距X", request: true },
		{ id: "focusY", name: "焦距Y", request: true },
		{ id: "principlePointX", name: "中心点X坐标", request: true },
		{ id: "principlePointY", name: "中心点Y坐标", request: true },
		{ id: "distortionK1", name: "畸变K1", request: true },
		{ id: "distortionK2", name: "畸变K2", request: true },
		{ id: "distortionK3", name: "畸变K3", request: true },
		{ id: "distortionP1", name: "畸变P1", request: true },
		{ id: "distortionP2", name: "畸变P2", request: true },
//		{ id: "remark2", name: "相机标定备注" },
		{ id: "imageWidth", name: "像素宽度", request: true },
		{ id: "imageHeight", name: "像素高度", request: true },
		{ id: "rotationX", name: "旋转X", request: true },
		{ id: "rotationY", name: "旋转Y", request: true },
		{ id: "rotationZ", name: "旋转Z", request: true },
		{ id: "armX", name: "armX", request: true },
		{ id: "armY", name: "armY", request: true },
		{ id: "armZ", name: "armZ", request: true },
		
		{ id: "rx", name: "偏心角RX" },
		{ id: "ry", name: "偏心角RY" },
		{ id: "rz", name: "偏心角RZ" }
	],

//	相机标定所需要的参数
	JsonForm2: [
		{ id: "xt", name: "IMU距天线X轴" },
		{ id: "yt", name: "IMU距天线Y轴" },
		{ id: "zt", name: "IMU距天线Z轴" },
		{ id: "xj", name: "IMU距相机X轴" },
		{ id: "yj", name: "IMU距相机Y轴" },
		{ id: "zj", name: "IMU距相机Z轴" },
		{ id: "imuOrientation", name: "IMU方向" },
		{ id: "apllyVehicleBodyRotationX", name: "车身旋转X" },
		{ id: "apllyVehicleBodyRotationY", name: "车身旋转Y" },
		{ id: "apllyVehicleBodyRotationZ", name: "车身旋转Z" }
//		{ id: "remark3", name: "杆臂值标定备注" },
	],
	
//	杆臂值标定所需要的参数
	JsonForm3: [
		{ id: "rollDelta", name: "roll偏移值" },
		{ id: "pitchDelta", name: "pitch偏移值" },
		{ id: "azimuthDelta", name: "azimuth偏移值" }
	],
	
//	激光雷达标定所需要的参数
	JsonForm4: [
		{ id: "lidarCameraX", name: "lidar相对相机x" },
		{ id: "lidarCameraY", name: "lidar相对相机y" },
		{ id: "lidarCameraZ", name: "lidar相对相机z" },
		{ id: "lidarCameraRoll", name: "lidar相对相机r" },
		{ id: "lidarCameraPitch", name: "lidar相对相机p" },
		{ id: "lidarCameraAzimuth", name: "lidar相对相机a" }
	],
	
	jsonDom: [],
	
//	激光雷达标定所需要的参数
	JsonForm5: [
		{ id: "lidarImuX", name: "lidar相对IMUx" },
		{ id: "lidarImuRoll", name: "lidar相对IMUr" },
		{ id: "lidarImuY", name: "lidar相对IMUy" },
		{ id: "lidarImuPitch", name: "lidar相对IMUp" },
		{ id: "lidarImuZ", name: "lidar相对IMUz" },
		{ id: "lidarImuAzimuth", name: "lidar相对IMUa" }
	],
	
//	标定时的备注
	remark: [
		{ id: "remark1", name: "备注" },
	],
	
//	获取列表的数据并生成table
	Table: function(url){
		collecting_device.signType = false;
		if(!url){
			var TableUrl = window.deviceURL+"survey/device/findAll?pageSize=10";
		}else{
			var TableUrl = url;
		}
		
	    var test = ` 
        <div class="row">
            <div class="CameraButtons" style="margin-left:15px; margin-bottom:10px;">
                <a class="btn btn-social btn-success" onclick="collecting_device.createcollecting_deviceModale(collecting_device)" data-toggle="modal" data-target="#modal-default">
                    <i class="fa fa-plus"></i> 新增采集设备
                </a>
			</div>
            <div class='choicemodal'></div>
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">采集设备列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option class="change" value="id">根据采集设备id查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="collecting_device.Search(event)" style="float:left;width:130px;margin:0px 5px;" />
			        </div>
				    <div class="box-body">
					    <table id="example2" class="table table-bordered table-hover">
				            <thead>
				                <tr>
					                <th>采集设备id</th>
					                <th>CODE</th>
					                <th>采集设备</th>
					                <th>设备组ID</th>
					                <th>标定状态</th>
					                <th>相机朝向</th>
					                <th>备注</th>
					                <th>创建时间</th>
					                <th>创建者</th>
					                <th>操作</th>
				                </tr>
				            </thead>
					    </table>
				    </div>
				</div>
			</div>
		</div>
	    `;
	    $('.content.container-fluid').html(test);
	    
//		初始化表格(表格的属性)
	    var table = $("#example2").DataTable({
	    	'language'    : window.lang,
	        'searching'   : false,								//原生搜索
	        'paging'      : true,
	        'lengthChange': false,
	        'ordering'    : false,
	        'info'        : true,
	        'autoWidth'   : false,
	        "aaSorting"	  : false,
//	        "processing"  : true,  								//隐藏加载提示,自行处理
	        "serverSide"  : true,  								//启用服务器端分页
//	        "order"	 	  : [0,'desc'],  								//取消默认排序查询,否则复选框一列会出现小箭头
	        ajax: function (data, callback, settings) {
	        	var param = {};
	            param.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param.start = data.start;						//开始的记录序号
	            param.page = (data.start / data.length)+1;		//当前页码
	            
				var url = TableUrl+"&pageNum="+param.page;

//				ajax请求数据
	            $.ajax({
	                type: "GET",
	        		url : url,
				    async : false,
					contentType: "application/json; charset=utf-8",
//				    data : JSON.stringify(queryData),
	                success: function (result) {
	                    var returnData1 = {};
	                    returnData1.recordsTotal = result.result.total;	
	                    returnData1.recordsFiltered = result.result.total;			
	                    returnData1.data = result.result.result;				
	                    callback(returnData1);
	                }
	           	});
	       },
//			列表表头字段
	        columns: [
//      		第1列----标定的id----显示
	            { 
	            	"data"	: "id",
	            	"class"	: "clickData"
	            },
//      		第2列----采集设备名称----显示
	            { 
	            	"data": "code" || '',
	            	"class"	: "code" 
	            },
//      		第2列----采集设备名称----显示
	            { 
	            	"data": "name",
	            	"class"	: "clickData" 
	            },
//      		设备组ID----显示
	            { 
	            	"data"	: "id",
	              	"render": function ( data, type, row,  meta ) {
	              		return row.groupId || '';
					},
	            	"class"	: "groupId" 
	            },
//      		第3列----标定状态----显示
	            { 
	            	"data"	: "isCalibrated",
	            	"class"	: "clickData",
	              	"render": function ( data, type, row,  meta ) {
					    return collecting_device.judge[data];
					}
	            },
	            { 
	            	"data"	: "id",
	            	"class"	: "direction",
	              	"render": function ( data, type, row,  meta ) {
	              		var _cn = {
		              			"1": "左前",
		              			"2": "前",
		              			"3": "右前",
		              			"4": "左",
		              			"5": "右",
		              			"6": "左后",
		              			"7": "后",
		              			"8": "右后"
		              		},
		              		direction = row.direction || "",
		              		new_direction = _cn[direction] || "";
	              		
					    return new_direction;
					}
	            },
	            { 
	            	"data"	: "id",
	            	"class"	: "remark",
	              	"render": function ( data, type, row,  meta ) {
					    return row.remark || "";
					},
	            },
//      		第4列----创建时间----显示
	            { 
	            	"data"	: "createTime",
	            	"class"	: "clickData",
	              	"render": function ( data, type, row,  meta ) {
					    return util.Time(data);
					},
	            },
//      		第5列----创建者----显示
	            { 
	            	"data": "operUser",
	            	"class"	: "clickData"
	            },
//      		第6列----操作按钮----显示(查看)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {

						return '<a class="btn btn-primary" title="修改采集设备信息" href="#" onclick="collecting_device.Change(collecting_device,'+data+')" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-edit"></i></a>'
						+'<a class="btn btn-warning" title="查看标定信息" href="#" onclick="collecting_device.lookSign('+data+')"><i class="fa fa-eye"></i></a>'
						+'<a class="btn btn-success" title="标定" href="#" onclick="collecting_device.signChange(collecting_device,'+data+',true)" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-facetime-video"></i></a>'
						+'<a class="btn btn-danger" title="删除" href="#" onclick="collecting_device.Delete(collecting_device,'+data+')" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-trash"></i></a>'
						
						
						
					},
					"class": "center"
	            }

	        ]
	    });
	    
//		点击任务名称可以显示更多信息-----场景、trackIds、transId。
	    $('#example2 tbody').on('click', 'tr td.clickData', function () {
	        var tr = $(this).closest('tr');
//	        tr.style.backgroundColor = "#f5f5f5";
	        var row = table.row( tr );
	        if ( row.child.isShown() ) {
	            row.child.hide();
	            tr.removeClass('shown');
	        }else{
	            if(!row.data()){
	            	return;
	            }
	            row.child( collecting_device.format(row.data().hardwareDevices) ).show();
	            tr.addClass('shown');
	        }
	    } );
	    
	},

//	点击设备时,显示更多的详细信息
	format: function(d){
	    if(d.length > 0){
			var model = `
			    <table id="example2" class="table table-bordered">
		            <thead>
		                <tr style="font-weight:bold;">
			                <th>类型</th>
			                <th>id</th>
			                <th>品牌 </th>
			                <th>型号</th>
			                <th>供应商</th>
			                <th>采购员</th>
			                <th>采购时间</th>
		                </tr>
		            </thead>
		            <tbody style="background:#fff;">
                	${d.map(d => `
		                <tr>
			                <th>${collecting_device.CN_FORM[d.deviceType]}</th>
			                <th>${d.id}</th>
			                <th>${d.brand} </th>
			                <th>${d.model}</th>
			                <th>${d.supplier}</th>
			                <th>${d.purcUser}</th>
			                <th>${d.purcTime}</th>
		                </tr>
                	`).join('')}
		            </tbody>
			    </table>
			`;
	    }else{
			var model = `
		    	空
			`;
	    }

	    return model;
	},
	
//	新增设备时的dom节点模版----新增设备Form数据,写入的Form表单数据应该与后台需要的数据保持一致,可以看到需要传输的数据是什么，然后再开始写入再新增
//	新增的时间data需要单个来处理
	createcollecting_deviceModale: function(value){
		IMU.FormdeviceType = value;
		var name = value.name;
		var datas;
		var resultModel = "";
        $.ajax({
            type: "GET",
    		url : window.deviceURL+"hardware/device/group?bindFlag=0",
		    async : false,
			contentType: "application/json; charset=utf-8",
            success: function (result) {
	            if( result.code!="0" ){
	            	IMU.Prompt(result.message);
	                return;
	            }
                datas = result.result;
				for (var Key in datas){
//					新增采集设备时,硬件设备的选择为多选,用button按钮
					resultModel += `
						<div class="form-group" style="height: 35px; line-height:35px;">
							<label for="${Key}" class="col-sm-4 control-label" >${collecting_device.CN_FORM[Key]}硬件 :</label>
							<div class="col-sm-8">
								<button type="button" id="${Key}" class="btn btn-block btn-default" title="选择${collecting_device.CN_FORM[Key]}" onclick="collecting_device.Choice(event)" data-toggle="modal" data-target="#modal-default1">请选择${collecting_device.CN_FORM[Key]}</button>
							</div>
						</div>
					`;
				}
            }
       	});
	    
//	   	 新增采集设备时所展示的模板
		var addModel = `
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">新增${name}</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="padding:30px 10px">
					
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="name" class="col-sm-4 control-label" >设备名称:</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="name" value="" placeholder="名称" onfocus="this.placeholder=''" onblur="this.placeholder='名称'">
									</div>
								</div>
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="code" class="col-sm-4 control-label" >CODE:</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="code" value="" placeholder="CODE" onfocus="this.placeholder=''" onblur="this.placeholder='CODE'">
									</div>
								</div>
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="direction" class="col-sm-4 control-label" >相机朝向:</label>
									<div class="col-sm-8">
										<select class="form-control" id="direction">
								            <option value="">请选择相机朝向</option>
								            <option value="2" selected>前</option>
								            <option value="7">后</option>
								            <option value="4">左</option>
								            <option value="5">右</option>
								            <option value="1">左前</option>
								            <option value="3">右前</option>
								            <option value="6">左后</option>
								            <option value="8">右后</option>
							            </select>
						            </div>
								</div>
							
								${resultModel}
								
								${collecting_device.remark.map(s => `
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="remark" class="col-sm-4 control-label" >备注 :</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="remark" value="" placeholder="备注" onfocus="this.placeholder=''" onblur="this.placeholder='备注'">
									</div>
								</div>
								`).join('')}
 							</div>
							<!--确定取消新增按钮-->
							<div class="box-footer">
		    					<button type="button" class="btn btn-success" title="确定" onclick="collecting_device.createTrue(event)" style="width:40%;float:left;" data-toggle="modal" data-target="#modal-default">确定</button>
		    					<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose()" style="width:40%;float:right;">取消</button>
							</div>
						</div>
					</div>
				<!-- /.modal-content -->
				</div>
			<!-- /.modal-dialog -->
			</div>
		</div>
		`;
		
		$('.testmodal').html(addModel);
	},

//	选择硬件设备------(新增采集设备时)
	Choice: function(e){
		var id = e.target.id;
		if($(".modal-backdrop").length>0){
			$(".modal-backdrop").remove();
		}
		var _url = window.deviceURL+'hardware/device/findAll?deviceType='+id;
		if( (id == '1') || (id == '2') ){
			_url += '&bindFlag=0';
		}
		
		
//		进行选择硬件设备时的模板
	    $.ajax( {
	        type : "get",
	        url : _url,
	        async : false,
	        data : {},
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
	        	sourceTrackArr1 = data.result.result;
	        	var sourceTrackTemp = `
				<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default1" style="z-index:1111">
					<div class="modal-dialog task-dialog" style="width:800px;">
						<div class="modal-content task-modal-content">
							<div class="modal-header">
					        	<button type="button" class="close" title="关闭" data-dId="${id}" onclick="collecting_device.ChoiceTrue(event)">
					        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
					        	</button>
					   	 		 <h4 class="modal-title">选择硬件设备</h4>
							</div>
							<div class="modal-body task-modal-body">
								<div class="list-group row sourceModal" style="width:100%;">
									
							    <table id="example2" class="table table-bordered table-hover">
						            <thead style="font-weight:bold;">
						                <tr>
							                <th></th>
							                <th>硬件id</th>
							                <th>品牌</th>
							                <th>型号</th>
							                <th>供应商</th>
							                <th>序列号</th>
						                </tr>
						            </thead>
						            <tbody>
				                	${sourceTrackArr1.map(s => `
						                <tr>
							                <th><label><input type="checkbox" class="${s.id}" value="${s.id}" /><span style="float:left;"></span></label></th>
							                <th>${s.id}</th>
							                <th>${s.brand}</th>
							                <th>${s.model} </th>
							                <th>${s.supplier}</th>
							                <th>${s.serialNumber}</th>
						                </tr>
				                	`).join('')}
						            </tbody>
							    </table>
									
								</div>
							</div>
							<div class="modal-footer" style="bottom:55px;">
								<button type="button" class="btn btn-info" data-dId="${id}" onclick="collecting_device.ChoiceTrue(event)">确认</button>
								<button type="button" class="btn btn-default" data-dId="${id}" onclick="collecting_device.ChoiceTrue(event)">取消</button>
							</div>
						</div>
					</div>
				</div>
	        	`;
    			$(".choicemodal").html(sourceTrackTemp);
					
//				判断是否选择过硬件设备
				var strId = $("#"+id).html();
			    if( strId != "请选择"+collecting_device.CN_FORM[id] ){
			    	var arrId = strId.split(",");
			    	for( var i=0; i<arrId.length; i++ ){
			    		$("."+arrId[i])[0].checked = "true";
			    	}
			    }else{
			    	return;
			    }
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	选择硬件设备成功时
	ChoiceTrue: function(e){
//		查询硬件设备的id
		var id  = e.currentTarget.getAttribute('data-dId');
		var addHtml = "";
//		已选中的项的value值
		collecting_device.sourceTrackId = [];
//		获取所有的已选中的项
		var sourceTrackLength = $(".sourceModal input:checkbox:checked");
//		显示所选择的硬件设备-----逗号隔开
		for(var i=0; i<sourceTrackLength.length; i++){
			collecting_device.sourceTrackId.push(sourceTrackLength[i].value);
			addHtml += sourceTrackLength[i].value;
			if( i!=sourceTrackLength.length-1 ){
				addHtml += ',';
			}
		}
		if(addHtml == ""){
			$("#"+id).html("请选择"+collecting_device.CN_FORM[id]);
		}else{
			$("#"+id).html(addHtml);
		}
		
		$('#modal-default1').modal('hide');
	},

//	采集设备标定模板--标定时的参数，需要通过获取数据，倘若是第一次标定，则所有的表单数据为空的，如果不是第一次标定，则需要显示标定的默认值
	signChange: function(value,id,judge){
		var JsonForm1 = [],
			JsonForm2 = [],
			JsonForm3 = [],
			JsonForm4 = [],
			JsonForm5 = [],
			remark = [],
			datas,
			showName,
			showButton;
//		判断操作方式-----即是修改标定参数，或是进行标定--重新标定(两者不同)
//		前者为修改该标定版本的参数(PUT请求)-----后者为重新产生一个新的标定版本(POST请求)
		if(!judge){
			var signUrl = window.deviceURL+"calibrated/survey/device/";
			var signObj = "PUT";
			showName = "查看标定参数("+id+")";
			showButton = "修改";
		}else if( value.deviceType && (value.deviceType == "Parameter") ){
			var signUrl = window.deviceURL+"calibrated/survey/device/";
			var signObj = "PUT";
			showName = "修改标定参数("+id+")";
			showButton = "修改";
		}else{
			var signUrl = window.deviceURL+"calibrated/survey/device/findAll?surveyDeviceId=";
			var signObj = "POST";
			showName = "采集设备标定("+id+")";
			showButton = "标定";
		}
		var _surveyId = id,
			dataResult = null;
		let _special = {
			'rx': true,
			'ry': true,
			'rz': true
		};
//		进行设备标定时,先查询是否为第一次标定,即是否有参数
        $.ajax({
            type: "GET",
    		url : signUrl+id,
		    async : false,
			contentType: "application/json; charset=utf-8",
            success: function (result) {
	            if( result.code!="0" ){
	            	IMU.Prompt(result.message);
	                return;
	            }
	            
	            if(!result.result.result){
	            	dataResult = result.result;
	            }else{
	            	dataResult = result.result.result;
	            }
            	//否则不存在参数时，显示默认值
            	//以下  循环语句是为了左右侧的输入栏整齐
				
				for(var i=0; i<collecting_device.JsonForm2.length; i++){
//					杆臂值标定所需要输入的参数增加
					JsonForm2.push(collecting_device.JsonForm2[i]);
				}
				for(var i=0; i<collecting_device.JsonForm3.length; i++){
//					杆臂值标定所需要输入的参数增加
					JsonForm3.push(collecting_device.JsonForm3[i]);
				}
				for(var i=0; i<collecting_device.JsonForm1.length; i++){
//					相机标定所需要输入的参数增加
					if(_special[collecting_device.JsonForm1[i].id]){
						JsonForm3.push(collecting_device.JsonForm1[i]);
					}else{
						JsonForm1.push(collecting_device.JsonForm1[i]);
					}
				}
				for(var i=0; i<collecting_device.JsonForm4.length; i++){
//					杆臂值标定所需要输入的参数增加
					JsonForm4.push(collecting_device.JsonForm4[i]);
				}
				
				for(var i=0; i<collecting_device.JsonForm5.length; i++){
//					杆臂值标定所需要输入的参数增加
					JsonForm5.push(collecting_device.JsonForm5[i]);
				}
				remark = collecting_device.remark;				//标定时的备注
				if( dataResult.length && (dataResult.length != 0) ){
//					判断是否已经被标定过
					datas = dataResult[0];
				}
//				判断是否为标定信息的修改
				if( value.deviceType && (value.deviceType == "Parameter") ){
					datas = dataResult;
	            	_surveyId = datas.surveyDeviceId;
				}else{
					
				}
				
            }
       	});
//		防止模态框的背景图层重复显示
		if($(".modal-backdrop").length>0){
			$(".modal-backdrop").remove();			
		}
//		标定的参数栏模版
		var writeModel =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:800px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">${showName}</h4>
					</div>
					<div class="modal-body task-modal-body" style="line-height:35px;">
				    	<div class="right-content">
	            			<div class="box-body" style="padding:10px 10px;overflow-x:auto;height:auto;max-height:800px;">
								<ul class="nav nav-tabs">
									<li class="active"><a href="#ProduceBar1" data-toggle="tab">相机参数</a></li>
									<li><a href="#ProduceBar2" data-toggle="tab">IMU参数</a></li>
									<li><a href="#ProduceBar3" data-toggle="tab">lidar参数</a></li>
								</ul>
								<div class="tab-content">
								    <div class="tab-pane active" id="ProduceBar1">
										<div class="addCamera">
											<!--遍历循环其他信息(标定所需要的---相机参数标定)-->
							                ${JsonForm1.map(f => `
												<div class="form-group">
													<label for="${f.id}" class="col-sm-5 control-label">${f.name} :</label>
													<div class="col-sm-7">
														<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
													</div>
												</div>
							                `).join('')}
										</div>
										<div>
											<!--遍历循环其他信息(标定所需要的---杆臂值标定)-->
							                ${JsonForm3.map(f => `
												<div class="form-group">
													<label for="${f.id}" class="col-sm-5 control-label">${f.name} :</label>
													<div class="col-sm-7">
														<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
													</div>
												</div>
							                `).join('')}
										</div>
								    
								    </div>
								    <div class="tab-pane" id="ProduceBar2">
										<div class="addCamera">
											<!--遍历循环其他信息(标定所需要的---杆臂值标定)-->
							                ${JsonForm2.map(f => `
												<div class="form-group">
													<label for="${f.id}" class="col-sm-5 control-label">${f.name} :</label>
													<div class="col-sm-7">
														<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
													</div>
												</div>
							                `).join('')}
										</div>
										<div>
							                <!--遍历循环其他信息(标定所需要的---备注信息)-->
							                ${remark.map(f => `
												<div class="form-group">
													<label for="${f.id}" class="col-sm-5 control-label">${f.name} :</label>
													<div class="col-sm-7">
														<input type="text" class="form-control" name="${f.id}" id="${f.id}" value="" placeholder="${f.name}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.name}'">
													</div>
												</div>
							                `).join('')}
										</div>
								    </div>
								    <div class="tab-pane" id="ProduceBar3">
										<div class="lidarHerder">
											<span>雷达相对IMU</span>
											<a href="#" title="新增">新增</a>
										</div>
										<div class="lidarCamera">
										
										</div>
										<div>
											<!--遍历循环其他信息(标定所需要的---杆臂值标定)-->
							                ${JsonForm4.map(f => `
												<div class="form-group">
													<label for="${f.id}" class="col-sm-5 control-label">${f.name} :</label>
													<div class="col-sm-7">
														<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
													</div>
												</div>
							                `).join('')}
										</div>
								    </div>
								</div>
	  						</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-success" title="${showButton}" onclick="collecting_device.signTrue(${id},'${signObj}')" style="width:20%;">${showButton}</button>
								<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose()" style="width:20%;">取消</button>
							</div>
						</div>
					</div>
				<!-- /.modal-content -->
				</div>
			<!-- /.modal-dialog -->
			</div>
		</div>
		`;
		$('.testmodal').html(writeModel);
		collecting_device.surveyInfo(_surveyId, datas, judge);
//		新增雷达对应IMU参数类
		$(".tab-content .tab-pane .lidarHerder a").click(function(){
			if(judge){
				collecting_device.addSurveyInfo();
			}
		})
//		删除雷达对应IMU参数类
	    $('.tab-content .tab-pane .lidarCamera').on('click', '.deleteBorder a', function (event) {
			if(judge){
				var _class = this.getAttribute("data-name");
				$('.tab-content .tab-pane .lidarCamera .'+_class).remove();
			}
	    });
	    $('.tab-content .tab-pane .lidarCamera').on('change', '.formSN select', function (event) {
			var selectVal = this.value,
				_class = this.getAttribute("data-name"),
				_arr = [1,2,3,4,5,6,7,8,9],
				lidarCamera = $(".right-content #ProduceBar3 .lidarCamera>div"),
				_hubport = {};
			for(var i=0; i<lidarCamera.length; i++){
				var _className = lidarCamera[i].className;
				if(_class != _className){
					var _value = $(".right-content #ProduceBar3 .lidarCamera ."+_className+" #hubport").val();
					if(_value == selectVal){
						util.errorView("当前序列号已被占用，自动匹配其他序列号");
					}
					_hubport[_value] = true;
				}
			}
			if(!_hubport[selectVal]){
				return;
			}
			for(var i=0; i<_arr.length; i++){
				var i_value = _arr[i];
				if(!_hubport[i_value]){
					$(this).val(i_value);
					return;
				}
			}
	    });
		if(!!datas){
			for(var i in datas.cameraCalibrationInfo){
//				相机标定所需要展示的默认值修改
				if($(".testmodal .box-body #"+i).length){
					$(".testmodal .box-body #"+i).val(datas.cameraCalibrationInfo[i]);
				}
			}
			for(var i in datas.leverArmCalibrationInfo){
//				杆臂值标定所需要展示的默认值修改
				for(var l=0; l<JsonForm2.length; l++){
					if( !(JsonForm2[l].id == i) ){
						
					}else{
						$("#"+JsonForm2[l].id).val(datas.leverArmCalibrationInfo[i]);
					}
				}
			}
			for(var i in datas.surveyDevice){
//				标定所需要展示的备注的默认值修改
				for(var l=0; l<remark.length; l++){
					if( !(remark[l].id == i) ){
						
					}else{
						$("#"+remark[l].id).val(datas.surveyDevice[i]);
					}
				}
			}
			for(var i in datas.lidarCalibrationInfo){
//				标定所需要展示的雷达的默认值修改
				for(var l=0; l<JsonForm4.length; l++){
					if( !(JsonForm4[l].id == i) ){
						
					}else{
						$("#"+JsonForm4[l].id).val(datas.lidarCalibrationInfo[i]);
					}
				}
				for(var l=0; l<JsonForm5.length; l++){
					if( !(JsonForm5[l].id == i) ){
						
					}else{
						$("#"+JsonForm5[l].id).val(datas.lidarCalibrationInfo[i]);
					}
				}
			}
			for(var names1 in datas){
//				标定所需要展示的备注的默认值修改
				for(var d=0; d<JsonForm3.length; d++){
					if( !(JsonForm3[d].id == names1) ){
						
					}else{
						$("#"+JsonForm3[d].id).val(datas[names1]);
					}
				}
			}
			if(datas.remark){
				$("#remark1").val(datas.remark);
			}
		}else{
			
		}
		
	},
	
//	新增一个雷达相对IMU标定参数
	addSurveyInfo: function(){
		var _arr = [1,2,3,4,5,6,7,8,9];
		var lidarCamera = $(".right-content #ProduceBar3 .lidarCamera>div"),
			_class = "lidar_"+lidarCamera.length;
		
		if(lidarCamera.length > 8){
			util.errorView("当前最多支持9个");
			return;
		}
		
		var lidarHtml = `
			<div class="${_class}">
				<div class="deleteBorder"><a href="#" class="glyphicon glyphicon-remove" title="删除该序列" data-name="${_class}"></a></div>
				<div class="form-group formSN">
					<label class="col-sm-5 control-label">序列号 :</label>
					<div class="col-sm-7">
						<select class="form-control" id="hubport" data-name="${_class}">
			                ${_arr.map(a => `
								<option value="${a}">${a}</option>
			                `).join('')}
						</select>
					</div>
				</div>
                ${collecting_device.JsonForm5.map(f => `
					<div class="form-group">
						<label class="col-sm-5 control-label">${f.name} :</label>
						<div class="col-sm-7">
							<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
						</div>
					</div>
                `).join('')}
			</div>
		`;
		$(".right-content #ProduceBar3 .lidarCamera").append(lidarHtml);
		
		var _hubport = {};
		for(var i=0; i<lidarCamera.length; i++){
			var _className = lidarCamera[i].className;
			var _value = $(".right-content #ProduceBar3 .lidarCamera ."+_className+" #hubport").val();
			_hubport[_value] = true;
		}
		for(var i=0; i<_arr.length; i++){
			var i_value = _arr[i];
			if(!_hubport[i_value]){
				$(".right-content #ProduceBar3 .lidarCamera ."+_class+" #hubport").val(i_value);
				return;
			}
		}
		
		
	},
	
//	查询当前采集设备信息--并展示标定参数
	surveyInfo: function(id,result,judge){
		var lidarInfoV2 = result ? result.lidarCalibrationInfoV2 : [],
			_arr = [1,2,3,4,5,6,7,8,9],
        	jsonDom = [],
        	_disabled = "";
        for(i=0; i<lidarInfoV2.length; i++){
        	jsonDom.push({
        		"data": lidarInfoV2[i],
        		"hubport": lidarInfoV2[i].hubport,
        		"_class": "lidar_"+i
        	})
        }
        !judge && (_disabled="disabled");
		var lidarHtml = `
            ${jsonDom.map(j => `
				<div class="${j._class}">
					<div class="deleteBorder"><a href="#" class="glyphicon glyphicon-remove" title="删除该序列" data-name="${j._class}" ${_disabled}></a></div>
					<div class="form-group formSN">
						<label class="col-sm-5 control-label">序列号 :</label>
						<div class="col-sm-7">
							<select class="form-control" id="hubport" data-name="${j._class}" ${_disabled}>
				                ${_arr.map(a => `
									<option value="${a}">${a}</option>
				                `).join('')}
							</select>
						</div>
					</div>
	                ${collecting_device.JsonForm5.map(f => `
						<div class="form-group">
							<label class="col-sm-5 control-label">${f.name} :</label>
							<div class="col-sm-7">
								<input type="text" class="form-control" title="${f.name}" name="${f.id}" id="${f.id}" value="${j.data[f.id] || ''}" placeholder="${f.id}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.id}'">
							</div>
						</div>
	                `).join('')}
				</div>
            `).join('')}
		`;
		$(".right-content #ProduceBar3 .lidarCamera").html(lidarHtml);
		
		for(var i=0; i<jsonDom.length; i++){
			var _class = jsonDom[i]._class,
				_hubport = jsonDom[i].hubport;
			$('.tab-content .tab-pane .lidarCamera .'+_class+' select').val(_hubport);
		}
		
//		判断所点击的为查看标定信息还是进行标定的操作----禁用input框或者开启input框
//		该逻辑已进行修改----直接跳转到标定列表界面并展示搜索之后的结果          (参考lookSign函数)
		if(judge == false){
			for(var i=0; i<$(".right-content input").length; i++){
				$(".right-content input")[i].disabled = "disabled";
//				查看标定信息时,判断是否存在value,无-用空来替代,有-显示默认值
				if($(".right-content input")[i].value == ""){
					$(".right-content input")[i].value = "空";
				}
			}
			$(".right-content .modal-footer button.btn-success")[0].disabled = "disabled";
			
		}
	},
	
//	确认标定--标定完成
	signTrue: function(id,obj){
		
		var text1 = "参数错误",
	    	regPos = /^\d+(\.\d+)?$/, 						//非负浮点数
	    	regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
			dataCamera = {},
			dataArm = {},
			dataLidar = {},
			dataDelta = {};
		var $inputList = $([]);
		var $inputList1 = $([]);
		var $inputList2 = $([]);
		var $inputList3 = $([]);
		
//		通过循环获取相对应的dom节点----相机标定的dom
		for(var i in collecting_device.JsonForm1){
			var item = collecting_device.JsonForm1[i].id,
				name = collecting_device.JsonForm1[i].name,
				request = collecting_device.JsonForm1[i].request || false,
				value = $('#'+item).val() || '';
			if(request && !value){
				util.errorView( name + '参数不能为空' );
				return;
			}else if(value){
				value = Number(value);
			}
			dataCamera[item] = value;
		}
		
//		通过循环获取相对应的dom节点----杆臂值标定的dom
		for(var i in collecting_device.JsonForm2){
			var item = collecting_device.JsonForm2[i].id;
			$inputList1 = $inputList1.add('#' + item);
		}
		for(var i=0; i<$inputList1.length; i++){
			var value = $inputList1[i].value;
			if(value === ""){
				text1 = "参数不能为空";
			}
			var name = $inputList1[i].name;
			var title = $inputList1[i].title;
		    if(regPos.test(value) || regNeg.test(value)){
				dataArm[name] = Number(value);
		    }else{
				util.errorView( title+text1 );
				return;
		    }
		}
		
		if(obj == "POST"){
			dataId = {											//标定所需要的采集设备参数
				"surveyDeviceId": Number(id),
	        	"remark": $("#remark1").val()
			}
		}else if(obj == "PUT"){
			dataId = {											//修改标定信息所需要的参数
				"id": Number(id),
	        	"remark": $("#remark1").val()
			}
		}
//		通过循环获取相对应的dom节点----杆臂值标定的dom
		for(var i in collecting_device.JsonForm3){
			var item = collecting_device.JsonForm3[i].id,
				name = collecting_device.JsonForm3[i].name,
				request = collecting_device.JsonForm3[i].request || true,
				value = $('#'+item).val() || '';
			if(request && !value){
				util.errorView( name + '参数不能为空' );
				return;
			}else if(value){
				value = Number(value);
			}
			dataId[item] = value;
		}
//		通过循环获取相对应的dom节点----杆臂值标定的dom
		for(var i in collecting_device.JsonForm4){
			var item = collecting_device.JsonForm4[i].id,
				_value = $('#'+item).val() || '',
				_num = _value ? Number(_value) : '';
			
			dataLidar[item] = _num;
		}
		
		var lidarCamera = $(".right-content #ProduceBar3 .lidarCamera>div"),
			lidarIMUs = [];
		for(var i=0; i<lidarCamera.length; i++){
			var _lidars = {};
			var _className = lidarCamera[i].className;
			var hubport = $(".right-content #ProduceBar3 .lidarCamera ."+_className+" #hubport").val();
			if(!hubport){
				util.errorView("雷达对应IMU缺少序列号")
				return;
			}
			_lidars["hubport"] = hubport;
			for(var s=0; s<collecting_device.JsonForm5.length; s++){
				var item = collecting_device.JsonForm5[s].id,
					_value = $(".right-content #ProduceBar3 .lidarCamera ."+_className+" #"+item).val() || '',
					_num = _value ? Number(_value) : null;
				_lidars[item] = _num;
			}
			lidarIMUs.push(_lidars);
		}
		
//		存入一个数组当中,该数组作为整个参数传于后台
		var data = [dataId, dataCamera, dataArm, dataLidar, lidarIMUs];
//		采集设备标定完成传输
	    $.ajax( {
	        type : obj,
			url : window.deviceURL+"calibrated/survey/device",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(data),
	        success : function(msg) {
	            if( msg.code!="0" ){
	            	alert(msg.message);
	                return;
	            }
				collecting_device.modalClose();
				if(collecting_device.signType){
					Parameter.Table();
				}else{
					collecting_device.Table();
				}
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	    });
	},
	
//	在采集界面查看标定参数----进行跳转并展示搜索之后的结果
	lookSign: function(value){
		$(".treeview-menu li.active").removeClass("active");
		$(".treeview.menu-open").removeClass("menu-open");
		$(".sidebar-menu li.active").removeClass("active");
		$(".Parameter").addClass("active");
		$(".Parameter").parent().parent().addClass("active menu-open");
		Parameter.Table(window.deviceURL+"calibrated/survey/device/findAll?pageSize=10&surveyDeviceId="+value);
	},

//	修改采集设备的参数
	Change: function(value,id){
		var name,
			code,
			direction,
			remark;
//		修改设备的参数
	    $.ajax( {
	        type : "get",
	        url : window.deviceURL+"survey/device/"+id,
	        async : false,
	        data : {},
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
	        	name = data.result.name;
	        	direction = data.result.direction;
	        	code = data.result.code || '';
	        	if(!!data.result.remark){
	        		remark = data.result.remark;
	        	}else{
	        		remark = "";
	        	}
	        	
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
		let directions = collecting_device.directions;
		for(i=0; i<directions.length; i++){
			directions[i]["selected"] = "";
			if(direction == directions[i].id){
				directions[i]["selected"] = "selected";
			}
		}
		
		var changeModel =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">修改采集设备信息(${name})</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="padding:15px 10px">
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="name" class="col-sm-4 control-label">名称 :</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="name" value="${name}" placeholder="名称" onfocus="this.placeholder=''" onblur="this.placeholder='名称'">
									</div>
								</div>
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="code" class="col-sm-4 control-label">CODE :</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="code" value="${code}" placeholder="CODE" onfocus="this.placeholder=''" onblur="this.placeholder='CODE'">
									</div>
								</div>
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="remark" class="col-sm-4 control-label">备注 :</label>
									<div class="col-sm-8">
										<input type="text" class="form-control" id="remark" value="${remark}" placeholder="备注" onfocus="this.placeholder=''" onblur="this.placeholder='备注'">
									</div>
								</div>
								<div class="form-group" style="height: 35px; line-height:35px;">
									<label for="direction" class="col-sm-4 control-label" >相机朝向:</label>
									<div class="col-sm-8">
										<select class="form-control" id="direction">
								            <option value="">请选择相机朝向</option>
											${directions.map(s => `
								            	<option value="${s.id}" ${s.selected}>${s.name}</option>
											`).join('')}
							            </select>
						            </div>
								</div>
	  						</div>
		  					<!-- 确定与取消按钮 -->
		  					<div class="box-footer">
			    				<button type="button" class="btn btn-success" title="提交" data-dId="${id}" onclick="collecting_device.changeTrue(event)" style="width:40%;float:left;">提交</button>
			    				<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose()" style="width:40%;float:right;">取消</button>
		  					</div>
						</div>
					</div>
				<!-- /.modal-content -->
				</div>
			<!-- /.modal-dialog -->
			</div>
		</div>
		`;
		$('.testmodal').html(changeModel);
	},

//	删除设备的模板--要判断传输过来的 删除接口 与 id，来进行删除设备
	Delete: function(value,id){
//		IMU.FormdeviceType为通用模版判断时使用的对象
		IMU.FormdeviceType = value;
		var name = value.name;
		
//		删除设备的模版
		var deleteModel =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">删除采集设备(${name})</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="text-align:center;font-size:18px;">
					
		  						<p>确定删除id为<span style="color:red;">${id}</span>的${name}吗?</p>
						
	  						</div>
		  					<!-- 确定与取消按钮 -->
		  					<div class="box-footer">
			    				<button type="button" class="btn btn-danger" title="确认" data-dId="${id}" onclick="collecting_device.deleteTrue(event)" style="width:40%;float:left;">确认</button>
			    				<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose()" style="width:40%;float:right;">取消</button>
		  					</div>
						</div>
					</div>
				<!-- /.modal-content -->
				</div>
			<!-- /.modal-dialog -->
			</div>
		</div>
		`;
		$('.testmodal').html(deleteModel);
	},
	
	
//	确定新增--直接用当前的接口可以新增，因为当前的设备系统只有改设备的参数不一致
	createTrue: function(e){
		var tags = [];
		var operUser = login.username;
//		新增设备所使用的模版
		var name = $('#name').val();
		var code = $('#code').val();
		var remark = $('#remark').val();
		var direction = $('#direction').val();
		if($(".modal-backdrop").length>0){
			$(".modal-backdrop").remove();
		}
		
//		获取采集设备参数所需要的dom节点的value值
		var $inputList = $([]);
		for(var i in collecting_device.CN_FORM){
			var item = collecting_device.CN_FORM[i];
			$inputList = $inputList.add('#' + i);
		}
		
		$inputList.each(function(){
			var strId = $('#'+this.id).html();
			if( strId.indexOf("请选择") < 0 ){
				var arrId = strId.split(",");
				for(var i=0; i<arrId.length; i++){
					tags.push( arrId[i] );
				}
			}else{
				
			}
		});
		
//		新增采集设备需要传输的参数
		var data = {
		  	"hardwareDeviceIds": tags,
		  	"name": name,
		  	"code": code,
		  	"remark": remark,
		  	"direction": direction,
		  	"groupId": '',
		  	"operUser": operUser
		}
		
//		新增采集设备确认
	    $.ajax( {
	        type : "POST",
			url : window.deviceURL+"survey/device",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(data),
	        success : function(msg) {
	            if( msg.code!="0" ){
	            	alert(msg.message);
	                return;
	            }
	            var id = msg.result.id;			//获取创建采集设备时所返回的id
//	           	 提示标定的事件
				
				var writeModel1 =`
				<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
					<div class="modal-dialog task-dialog" style="width:500px;">
						<div class="modal-content task-modal-content">
							<div class="modal-header">
			    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose(true)">
			    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			    				</button>
								<h4 class="modal-title">设备标定</h4>
							</div>
							<div class="modal-body task-modal-body">
						    	<div class="right-content">
			            			<div class="box-body" style="text-align:center;font-size:18px;">
							
				  						<p>是否开始进行标定?</p>
								
			  						</div>
			            			<div class="box-body" style="padding:15px 10px">
					    				<button type="button" class="btn btn-success" title="确认" onclick="collecting_device.signChange(collecting_device,${id},true)" style="width:40%;float:left;" data-toggle="modal" data-target="#modal-default">确认</button>
					    				<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose(true)" style="width:40%;float:right;">取消</button>
				  					</div>
								</div>
							</div>
						<!-- /.modal-content -->
						</div>
					<!-- /.modal-dialog -->
					</div>
				</div>
				`;
				
				collecting_device.modalClose();
//				collecting_device.Table();
				$('.testmodal').html(writeModel1);
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	    });
	},
	
//	采集设备修改的确认
	changeTrue: function(e){
		var id  = e.currentTarget.getAttribute('data-dId'),
			remark = $("#remark").val(),
			name = $("#name").val(),
			direction = $("#direction").val(),
			code = $("#code").val();
		var data = {
			"id":id,
			"code":code,
			"remark":remark,
			"direction":direction,
			"name":name,
		}
//		修改采集设备提交
	    $.ajax( {
	        type : "PUT",
	        url : window.deviceURL+"survey/device",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(data),
	        success : function(msg) {
	            if( msg.code!="0" ){
	            	IMU.Prompt(msg.message);
	                return;
	            }
				collecting_device.modalClose();
				collecting_device.Table();
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	    });
	},
	
//	确认删除的执行
	deleteTrue: function(e){
		var id  = e.currentTarget.getAttribute('data-dId');

//		确认删除这个设备(通过传输的url与id)
	    $.ajax( {
	        type : "DELETE",
	        url : window.deviceURL+"survey/device/"+id,
	        async : false,
	        data : {},
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
				collecting_device.modalClose();
				IMU.FormdeviceType.Table();
//				console.log("删除成功!");
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},

//	搜索设备功能
	Search: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			var searchType = $('.searchType option:selected').val();
			var searchTypeValue = $('.searchTypeValue').val();
			collecting_device.Table(window.deviceURL+"survey/device/findAll?pageSize=10&"+searchType+"="+searchTypeValue);
		}
	},
	
//	模版关闭按钮
	modalClose: function(value){
		if( value && value == true){
			collecting_device.Table();			//关闭模版重新获取列表
		}else{
			
		}
	    $('#modal-default').modal('hide');
//	    $('.modal').remove();
	    $('.modal-backdrop').remove();
	},
}
collecting_device.Table();