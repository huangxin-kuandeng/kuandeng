//$(".IMU").click(function(){
//  IMU.IMUTable();
//});


//	生成设备唯一ID，录入属性（品牌、型号、序列号、供应商、采购员、采购时间、备注）、自动添加新增时间、更新时间、操作员

//	已绑定的不能删除，删除视觉设备后方可删除，另外是逻辑删除，不是物理删除

var IMU = {
	
//	IMU所需要的参数
	Form: [
		{ id: "brand", name: "品牌(必填)" },
		{ id: "model", name: "型号(必填)" },
		{ id: "serialNumber", name: "序列号(必填)" },
		{ id: "supplier", name: "供应商" },
		{ id: "purcUser", name: "采购员" },
		{ id: "remark", name: "备注" },
	],
	
//	硬件设备的类型
	deviceType: "5",
	
	name: "IMU",
	
	FormdeviceType: null,

//	IMU的列表初始化
	Table: function(url){
		
//		判断是否经过搜索的列表
		if(!url){
			var TableUrl = window.deviceURL+"hardware/device/findAll?deviceType="+IMU.deviceType+"&pageSize=10";
		}else{
			var TableUrl = url;
		}
		
	    var test = ` 
        <div class="row">
		    <div class="CameraButtons" style="margin-left:15px; margin-bottom:10px;">
			    <a class="btn btn-social btn-success" onclick="IMU.createIMUModale(IMU)" data-toggle="modal" data-target="#modal-default">
	                <i class="fa fa-plus"></i> 新增IMU
	            </a>
		    </div>
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">IMU列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option class="change" value="id">根据硬件设备id查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="IMU.Search(IMU,event)" style="float:left;width:130px;margin:0px 5px;" />
			        </div>
				    <div class="box-body">
					    <table id="example2" class="table table-bordered table-hover">
				            <thead>
				                <tr>
					                <th>id</th>
					                <th>品牌 </th>
					                <th>型号</th>
					                <th>供应商</th>
					                <th>采购员</th>
					                <th>采购时间</th>
					                <th>操作 </th>
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
	        'searching'   : true,								//原生搜索
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
			            if( result.code!="0" ){
			            	IMU.Prompt(result.message);
			                return;
			            }
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
//      		第一列----id----显示
	            { "data": "id" },
//      		第一列----品牌----显示
	            { "data": "brand" },
//      		第一列----型号----显示
	            { "data": "model" },
//      		第一列----供应商----显示
	            { "data": "supplier" },
//      		第一列----采购员----显示
	            { "data": "purcUser" },
//      		第一列----采购时间----显示
	            { "data": "purcTime" },
//      		第六列----操作按钮----显示(修改和删除)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
		    			
//	              		判断设备是否已经被绑定----1为绑定 - 0为未被绑定  -----绑定之后的硬件可以修改，但不可以删除
		    			if(row.bindFlag == "1"){
					    	return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(IMU,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
					    	+'<a class="btn btn-danger" title="硬件已被绑定" href="#" disabled="disabled"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}else{
						    return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(IMU,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
						    +'<a class="btn btn-danger" title="删除" href="#" onclick="IMU.Delete(IMU,'+data+')" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}
					},
					"class": "center"
	            }

	        ]
	    });
	},
	
//	新增设备时的dom节点模版----新增设备Form数据,写入的Form表单数据应该与后台需要的数据保持一致,可以看到需要传输的数据是什么，然后再开始写入再新增
//	新增的时间data需要单个来处理
	createIMUModale: function(value){
		IMU.FormdeviceType = value;
		var Form = value.Form;
		var name = value.name;
		var createURL = value.deviceType;
	    var time = new Date().toLocaleDateString();
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
						<div class="devicemodal"></div>
				    	<div class="right-content">
	            			<div class="box-body" style="padding:30px 10px">
					
								<!--遍历循环其他信息-->
				                ${Form.map(f => `
									<div class="form-group" style="height: 35px; line-height:35px;">
										<label for="${f.id}" class="col-sm-4 control-label">${f.name} :</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" name="${f.id}" id="${f.id}" value="" placeholder="${f.name}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.name}'">
										</div>
									</div>
				                `).join('')}
						    	
								<div class="form-group" style="height: 35px; line-height:35px;">
					                <label class="col-sm-4 control-label">采购时间:</label>
					                <div class="input-group date col-sm-8" style="padding: 0 15px;">
					                  	<div class="input-group-addon">
					                    	<i class="fa fa-calendar"></i>
					                  	</div>
					                  	<input type="text" name="purcTime" class="form-control pull-right" id="datepicker" value="${time}">
					                </div>
					            </div>
				
	  						</div>
							<!--确定取消新增按钮-->
							<div class="box-footer">
		    					<button type="button" class="btn btn-success" title="确定" data-dURL="${createURL}" onclick="IMU.createTrue(event)" style="width:40%;float:left;" data-toggle="modal" data-target="#modal-default1">确定</button>
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
//		日期选择器的语言修改为中文格式的
	    $('#datepicker').datepicker({
	    	language: 'zh-CN',
	    	autoclose: true,
	    	todayHighlight: true,
	    	format:"yyyy/mm/dd"
	    });
	},

//	确认新增设备--新增设备需要传过来的url,然后通过FormdeviceType内的新增 接口 进行判断，最后再新增。
	createTrue: function(e){
//		data为传输的值
		var data = {};
		var operUser = login.username;
//		根据dom获取所有的数据参数
		var $inputList = $([]);
		for(var i in IMU.FormdeviceType.Form){
			var item = IMU.FormdeviceType.Form[i];
			$inputList = $inputList.add('#' + item.id);
		}
		
		$inputList.each(function(){
			data[this.name] = this.value;
		});
//		根据type字段来判断接口类型,即硬件类型
		var deviceType = IMU.FormdeviceType.deviceType;
//		获取日期选择器的value值
		var purcTime = $("#datepicker").val();
		data.deviceType = deviceType;
		data.purcTime = purcTime;
		data.operUser = operUser;
//		判断分辨率是否存在,存在则存在tags内
		if( $("#resolution").length!=0 ){
			var tags = [
		        {
		        	"k":"resolution",
		            "v": $("#resolution").val(),
		        }
		    ];
		    data.tags = tags;
		}else{
			
		}
		
//		新增设备
	    $.ajax( {
	        type : "POST",
	        url : window.deviceURL+"hardware/device",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(data),
	        success : function(msg) {
	            if( msg.code=="700" ){
	            	var message = msg.message;
	            	var _id = message.split('id:')[1].split('上')[0];
					util.openTips_btn({
						head: 'SN码被占用',
						btnName: '停用',
						data: [message],
						callback: function(){
							IMU.stopUsingSN(_id);
						}
					})
					return
	            }else if( msg.code!="0" ){
	            	IMU.Prompt(msg.message);
	                return;
	            }
				collecting_device.modalClose();
				IMU.FormdeviceType.Table();
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	    });
	},
	
//	停用设备--SN码被占用
	stopUsingSN: function(id){
		$('#loading').toggle();
		var _url = window.deviceURL + 'hardware/device/unuse?id=' + id;
	    $.ajax( {
	        type : "PUT",
	        url : _url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : {},
	        success : function(msg) {
				$('#loading').toggle();
	            if( msg.code!="0" ){
	            	util.errorView('停用失败：'+msg.message);
	            }else{
	            	util.errorView('停用成功', true);
	            }
	        },
	        error: function(msg){
	            console.log('调用硬件设备停用：系统异常');
	        }
	    });
	},
	
							
//	确认修改设备--修改设备需要传过来的id和url,然后通过FormdeviceType内的修改 接口 进行判断，最后再修改。
	changeTrue: function(e){
		var id  = e.currentTarget.getAttribute('data-dId');
		
		var data = {};
		var $inputList = $([]);
		for(var i in IMU.FormdeviceType.Form){
			var item = IMU.FormdeviceType.Form[i];
			$inputList = $inputList.add('#' + item.id);
		}
		
		$inputList.each(function(){
			data[this.name] = this.value;
		});
		var deviceType = IMU.FormdeviceType.deviceType;	
		var purcTime = $("#datepicker").val();
		data.deviceType = deviceType;
		data.purcTime = purcTime;
		data.id = id;
		if( $("#resolution").length!=0 ){
			var tags = [
			    {
			      "hardwareDeviceId": data.id,
			      "k": "resolution",
			      "v": $("#resolution").val()
			    }
		    ];
		    data.tags = tags;
		}else{
			
		}
		
//		修改设备提交
	    $.ajax( {
	        type : "PUT",
	        url : window.deviceURL+"hardware/device",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(data),
	        success : function(msg) {
	            if( msg.code=="700" ){
	            	var message = msg.message;
	            	var _id = message.split('id:')[1].split('上')[0];
					util.openTips_btn({
						head: 'SN码被占用',
						btnName: '停用',
						data: [message],
						callback: function(){
							IMU.stopUsingSN(_id);
						}
					})
					return
	            }else if( msg.code!="0" ){
	            	IMU.Prompt(msg.message);
	                return;
	            }
	            
				IMU.FormdeviceType.Table();
				collecting_device.modalClose();
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	    });
	},
	
//	修改设备参数的模板--修改设备Form数据,然后进行循环展示,可以看到当前的数据是什么，然后再开始修改
	Change: function(value,id){
		IMU.FormdeviceType = value;
		var Form = value.Form;
		var ChangeForm;
		var resolutionVal;
		var name = value.name;
//		修改设备的参数
	    $.ajax( {
	        type : "get",
	        url : window.deviceURL+"hardware/device/"+id,
	        async : false,
	        data : {},
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
	        	ChangeForm = data.result;
	        	if(ChangeForm.tags.length > 0){
	        		resolutionVal = ChangeForm.tags[0].v;
	        	}else{
	        		
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });

		var writeModel =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">修改${name}</h4>
					</div>
					<div class="modal-body task-modal-body">
						<div class="devicemodal"></div>
				    	<div class="right-content">
	            			<div class="box-body" style="padding:15px 10px">
	            			
								<!--遍历循环其他信息-->
				                ${Form.map(f => `
									<div class="form-group" style="height: 35px; line-height:35px;">
										<label for="${f.id}" class="col-sm-4 control-label">${f.name} :</label>
										<div class="col-sm-8">
											<input type="text" class="form-control" name="${f.id}" id="${f.id}" value="${ChangeForm[f.id]}" placeholder="${f.name}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.name}'">
										</div>
									</div>
				                `).join('')}
				                
								<div class="form-group" style="height: 35px; line-height:35px;">
					                <label class="col-sm-4 control-label">采购时间:</label>
					                <div class="input-group date col-sm-8" style="padding: 0 15px;">
					                  	<div class="input-group-addon">
					                    	<i class="fa fa-calendar"></i>
					                  	</div>
					                  	<input type="text" name="purcTime" class="form-control pull-right" id="datepicker" value="${ChangeForm.purcTime}">
					                </div>
					            </div>
					            
	  						</div>
		  					<!-- 确定与取消按钮 -->
		  					<div class="box-footer">
			    				<button type="button" class="btn btn-success" title="提交" data-dId="${id}" onclick="IMU.changeTrue(event)" style="width:40%;float:left;" data-toggle="modal" data-target="#modal-default1">提交</button>
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
		$('.testmodal').html(writeModel);
//		日期选择器的语言修改为中文格式的
	    $('#datepicker').datepicker({
	    	language: 'zh-CN',
	    	autoclose: true,
	    	todayHighlight: true,
	    	format:"yyyy/mm/dd"
	    });
		$('#resolution').val(resolutionVal);
		
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
						<h4 class="modal-title">删除${name}</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="text-align:center;font-size:18px;">
					
		  						<p>确定删除id为<span style="color:red;">${id}</span>的${name}吗?</p>
						
	  						</div>
		  					<!-- 确定与取消按钮 -->
		  					<div class="box-footer">
			    				<button type="button" class="btn btn-danger" title="确认" data-dId="${id}" onclick="IMU.deleteTrue(event)" style="width:40%;float:left;">确认</button>
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
	
	
//	确认删除的执行
	deleteTrue: function(e){
		var id  = e.currentTarget.getAttribute('data-dId');

//		确认删除这个硬件设备(通过传输的url与id)
	    $.ajax( {
	        type : "DELETE",
	        url : window.deviceURL+"hardware/device/"+id,
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
	
	Prompt: function(value){
		console.log(value);
		var promptModel = `
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default1">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="IMU.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">警告</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="text-align:center;font-size:18px;">
					
		  						<p style="color:red;">${value}</p>
						
	  						</div>
						</div>
					</div>
				<!-- /.modal-content -->
				</div>
			<!-- /.modal-dialog -->
			</div>
		</div>
		`;
		$(".Prompt").html(promptModel);
	},

//	搜索硬件设备功能
	Search: function(value,e){
		var ev = document.all ? window.event : e;
		var deviceType = value.deviceType;
		if(ev.keyCode==13) {
			var searchType = $('.searchType option:selected').val();
			var searchTypeValue = $('.searchTypeValue').val();
			value.Table(window.deviceURL+"hardware/device/findAll?deviceType="+deviceType+"&pageSize=10&"+searchType+"="+searchTypeValue, searchType);
		}
		
	},
	
	modalClose: function(){
	    $('#modal-default1').modal('hide');
	    $('.modal-backdrop').remove();
	},

}	




