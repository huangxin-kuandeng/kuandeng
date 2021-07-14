

//千寻账号管理

var Chihiro = {
	
//	Chihiro所需要的参数
	Form: [
		{ id: "accessKeyId", name: "用户账号" },
		{ id: "accessKeySecret", name: "用户密码" },
		{ id: "deviceId", name: "千寻设备id" },
		{ id: "meid", name: "手机MEID" },
		{ id: "meid1", name: "手机MEID1" },
		{ id: "meid2", name: "手机MEID2" },
		{ id: "remark", name: "备注" }
	],
	
//	千寻账号条件查询
	Search: function(e){
		if(e.keyCode == "13"){
			var searchType = $('.searchType select').val(),
				searchValue = $('.searchType .searchTypeValue').val();
			if(searchValue){
				var searchForm = {};
				searchForm[searchType] = searchValue;
				Chihiro.Table(searchForm);
			}
		}
	},
	
//	初始化Chihiro列表
	Table: function(searchs={}){
//		判断是否经过搜索的列表
	    var test = ` 
        <div class="row">
		    <div class="CameraButtons" style="margin-left:15px; margin-bottom:10px;">
			    <a class="btn btn-social btn-success" onclick="Chihiro.createChihiro()" data-toggle="modal" data-target="#modal-default">
	                <i class="fa fa-plus"></i> 新增千寻账号
	            </a>
		    </div>
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">千寻账号列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option value="deviceId">根据千寻设备id查找</option>
				            <option value="meid">根据手机MEID查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="Chihiro.Search(event)" style="float:left;width:130px;margin:0px 5px;" />
			        </div>
				    <div class="box-body">
					    <table id="example2" class="table table-bordered table-hover">
				            <thead>
				                <tr>
					                <th>ID</th>
					                <th>千寻设备ID</th>
					                <th>千寻账号</th>
					                <th>千寻密码</th>
					                <th>有效期</th>
					                <th>手机MEID</th>
					                <th>手机MEID1</th>
					                <th>手机MEID2</th>
					                <th>备注</th>
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
	            var TableUrl = window.deviceURL+"chihiro/account/page?pageSize=10&pageNum="+param.page;
	            
	            for(var item in searchs){
	            	if(searchs[item]){
		            	$('.searchType select').val(item);
		            	$('.searchType .searchTypeValue').val(searchs[item]);
	            		TableUrl += ("&"+item+"="+searchs[item]);
	            	}
	            }
	            
//				ajax请求数据
	            $.ajax({
	                type: "GET",
	        		url : TableUrl,
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
//      		第一列----id----显示
	            { "data": "id" },
//      		第一列----千寻设备id----显示
	            { "data": "deviceId" },
//      		第一列---- 千寻账号----显示
	            { "data": "accessKeyId" },
//      		第一列----千寻密码----显示
	            { "data": "accessKeySecret" },
//      		第一列----有效期----显示
	            { "data": "validity" },
//      		第一列----手机MEID----显示
	            { "data": "meid" },
//      		第一列----手机MEID1----显示
	            { "data": "meid1" },
//      		第一列----手机MEID2----显示
	            { "data": "meid2" },
//      		第一列----备注----显示
	            { "data": "remark" },
//      		第六列----操作按钮----显示(预览和删除)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row, meta ) {
	              		
	              		var _html = `
	              			<a class="btn btn-primary update" title="更新" href="#" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>
	              			<a class="btn btn-danger delete" title="删除" href="#" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-trash"></i></a>
	              		`;
	              		return _html;
					},
					"class": "center"
	            }
	        ]
	    });
//		点击更新千寻账号信息
	    $('#example2').on('click', 'tr td a.update', function () {
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
	        var data = row.data();
	        Chihiro.createChihiro(data);
	    });
//		点击删除千寻账号
	    $('#example2').on('click', 'tr td a.delete', function () {
	        var tr = $(this).closest('tr');
	        var row = table.row( tr );
	        var data = row.data(),
	        	_id = data.id;
	        Chihiro.Delete(_id);
	    });
	},
	
//	新增的时间data需要单个来处理
	createChihiro: function(param=null){
		var Form = Chihiro.Form;
	    var _time = util.getDateStr(0);
	    
	    var _type = param ? param.id : '',
	    	_head = param ? '修改千寻设备' : '新增千寻账号';
	    
		var addModel = `
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">${_head}</h4>
					</div>
					<div class="modal-body task-modal-body">
						<div class="devicemodal"></div>
				    	<div class="right-content">
	            			<div class="box-body" style="padding:0px 10px">
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
					                <label class="col-sm-4 control-label">有效期:</label>
					                <div class="input-group date col-sm-8" style="padding: 0 15px;">
					                  	<div class="input-group-addon">
					                    	<i class="fa fa-calendar"></i>
					                  	</div>
					                  	<input type="text" name="purcTime" class="form-control pull-right" id="validity" value="${_time}">
					                </div>
					            </div>
				
	  						</div>
							<!--确定取消新增按钮-->
							<div class="box-footer">
		    					<button type="button" class="btn btn-success" title="确定" onclick="Chihiro.createTrue(${_type})" style="width:40%;float:left;" data-toggle="modal" data-target="#modal-default1">确定</button>
		    					<button type="button" class="btn btn-default" title="取消" onclick="collecting_device.modalClose()" style="width:40%;float:right;">取消</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		`;
		
		$('.testmodal').html(addModel);
//		日期选择器的语言修改为中文格式的
	    $('#validity').datepicker({
	    	language: 'zh-CN',
	    	autoclose: true,
	    	todayHighlight: true,
	    	format:"yyyy-mm-dd"
	    });
	    
	    if(param){
	    	for(var _id in param){
	    		var _value = param[_id];
	    		if( $('.right-content .box-body #'+_id).length ){
	    			$('.right-content .box-body #'+_id).val(_value)
	    		}
	    	}
	    }
	    
	},

//	确认新增设备--新增设备需要传过来的url,然后通过FormdeviceType内的新增 接口 进行判断，最后再新增。
	createTrue: function(type){
//		data为传输的值
		var _time = $('#validity').val();
		var jsons = {
			'validity': (_time+' 08:00:00')
		};
//		var operUser = login.username;
		for(var i=0; i<Chihiro.Form.length; i++){
			var _id = Chihiro.Form[i].id,
				_value = $('#'+_id).val() || '';
			jsons[_id] = _value;
		}
		
		var ajaxType = type ? "PUT" : "POST";
		if(type){
			jsons["id"] = type;
		}
//		新增设备
	    $.ajax( {
	        type : ajaxType,
	        url : window.deviceURL+"chihiro/account",
        	async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(jsons),
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
				collecting_device.modalClose();
				Chihiro.Table();
	        },
	        error: function(data){
	            console.log('异常');
	        }
	    });
	},

//	删除设备的模板--要判断传输过来的 删除接口 与 id，来进行删除设备
	Delete: function(id){
//		删除设备的模版
		var deleteModel =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="width:500px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="collecting_device.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">删除千寻账号</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="right-content">
	            			<div class="box-body" style="text-align:center;font-size:18px;">
					
		  						<p>确定删除id为<span style="color:red;">${id}</span>的千寻账号吗?</p>
						
	  						</div>
		  					<!-- 确定与取消按钮 -->
		  					<div class="box-footer">
			    				<button type="button" class="btn btn-danger" title="确认" data-dId="${id}" onclick="Chihiro.deleteTrue(event)" style="width:40%;float:left;">确认</button>
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
	        url : window.deviceURL+"chihiro/account/"+id,
	        async : false,
	        data : {},
	        success : function(data) {
	            if( data.code!="0" ){
	            	IMU.Prompt(data.message);
	                return;
	            }
				collecting_device.modalClose();
				Chihiro.Table();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
}


