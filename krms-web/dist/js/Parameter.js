//	---视觉设备标定---

//	生成标定ID
//	记录标定版本号，默认为标定时间
//	选择正常使用的视觉设备
//	录入内参数（焦距、中心点、分辨率、P1,P2,P3,K1,K2）
//	录入备注信息

//	只允许修改
//	内参数（焦距、中心点、分辨率、P1,P2,P3,K1,K2）
//	备注信息

var Parameter = {
	
	deviceType: "Parameter",
	
	name: "采集设备",
	
//	标定列表的模板
	Table: function(url){
		collecting_device.signType = true;
//		判断是否经过搜索的列表
		if(!url){
			var TableUrl = window.deviceURL+"calibrated/survey/device/findAll?pageSize=10";
		}else{
			var TableUrl = url;
		}
		
	    var test = ` 
        <div class="row">
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">标定信息列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option class="change" value="surveyDeviceId">根据采集设备id查找</option>
				            <option class="change" value="id">根据标定id查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="Parameter.Search(event)" style="float:left;width:130px;margin:0px 5px;" />
			        </div>
				    <div class="box-body">
					    <table id="example2" class="table table-bordered table-hover">
				            <thead>
				                <tr>
					                <th>标定id</th>
					                <th>采集设备</th>
					                <th>采集设备id</th>
					                <th>标定版本</th>
					                <th>创建时间</th>
					                <th>更新时间</th>
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
	            { "data": "id" },
//      		第2列----采集设备名称----显示
	            { 
	            	"data": "surveyDeviceId",
	              	"render": function ( data, type, row,  meta ) {
		    			var name = row.surveyDevice.name;
					    return	name;
					}
	            },
//      		第3列----采集设备id----显示
	            { 
	            	"data": "surveyDeviceId",
	              	"render": function ( data, type, row,  meta ) {
		    			var id = row.surveyDevice.id;
					    return	id;
					}
	            },
//      		第4列----标定次数----显示
	            { 
	            	"data": "surveyDeviceId",
	              	"render": function ( data, type, row,  meta ) {
		    			var version = row.leverArmCalibrationInfo.version + 1;
					    return	version;
					}
	            },
//      		第5列----创建时间----显示
	            { 
	            	"data": "createTime",
	              	"render": function ( data, type, row,  meta ) {
					    return	util.Time(data);
					}
	            },
//      		第6列----最近更新时间----显示
	            { 
	            	"data": "updateTime",
	              	"render": function ( data, type, row,  meta ) {
					    return	util.Time(row.cameraCalibrationInfo.updateTime);
					}
	            },
//      		第7列----操作按钮----显示(查看)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
		    			
					    return	'<a class="btn btn-success" title="查看标定信息" href="#" onclick="collecting_device.signChange(Parameter,'+data+',false)" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-eye-open"></i></a>'
								+'<a class="btn btn-primary" title="修改标定信息" href="#" onclick="collecting_device.signChange(Parameter,'+data+',true)" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-edit"></i></a>'
					},
					"class": "center"
	            }

	        ]
	    });
	},
	
//	查看标定数据事件
	eyes: function(value,id){
		var JsonForm = {};
		var resultModel = "";
        $.ajax({
            type: "GET",
    		url : window.deviceURL+"calibrated/survey/device/"+id,
		    async : false,
			contentType: "application/json; charset=utf-8",
            success: function (result) {
            	var datas = result.result;
            	
				for(var i in datas.cameraCalibrationInfo){
//					相机标定所需要展示的默认值修改
					for(var l=0; l<collecting_device.JsonForm1.length; l++){
						if( !(collecting_device.JsonForm1[l].id == i) ){
							
						}else{
							JsonForm[i] = datas.cameraCalibrationInfo[i];
						}
					}
//					杆臂值标定所需要展示的默认值修改
					for(var l=0; l<collecting_device.JsonForm2.length; l++){
						if( !(collecting_device.JsonForm2[l].id == i) ){
							
						}else{
							JsonForm[i] = datas.cameraCalibrationInfo[i];
						}
					}
				}
				for(var i in datas.leverArmCalibrationInfo){
//					杆臂值标定所需要展示的默认值修改
					for(var l=0; l<collecting_device.JsonForm2.length; l++){
						if( !(collecting_device.JsonForm2[l].id == i) ){
							
						}else{
							JsonForm[i] = datas.leverArmCalibrationInfo[i];
						}
					}
				};
				for(var name in datas){
//					相机标定所需要展示的默认值修改
					for(var l=0; l<collecting_device.JsonForm3.length; l++){
						if( !(collecting_device.JsonForm3[l].id == name) ){
							
						}else{
							JsonForm[name] = datas[name];
						}
					}
				}
//				采集设备标定具体的参数
				for (var Key in JsonForm){
					resultModel += `
						<p><span>${Key} :</span>${JsonForm[Key]}</p>
					`;
				}
//				查看采集设备标定数据的模板
				var FormModel = `
				<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
					<div class="modal-dialog task-dialog" style="width:800px;">
						<div class="modal-content task-modal-content">
							<div class="modal-header">
			    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
			    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			    				</button>
								<h4 class="modal-title">标定参数查看(${id})</h4>
							</div>
							<div class="modal-body task-modal-body" style="line-height:35px;">
						    	<div class="right-content">
			            			<div class="box-body pText" style="padding:10px 10px">
					                	${resultModel}
			  						</div>
								</div>
							</div>
						<!-- /.modal-content -->
						</div>
					<!-- /.modal-dialog -->
					</div>
				</div>
				`;
				
				$(".testmodal").html(FormModel);
				
            }
       	});
	},
	
//	设备搜索功能
    Search: function(e){
		var ev = document.all ? window.event : e;
		if(ev.keyCode==13) {
			var searchType = $('.searchType option:selected').val();
			var searchTypeValue = $('.searchTypeValue').val();
			Parameter.Table(window.deviceURL+"calibrated/survey/device/findAll?pageSize=10&"+searchType+"="+searchTypeValue);
		}
    },

}
