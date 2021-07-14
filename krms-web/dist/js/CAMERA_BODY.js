//$(".CAMERA_BODY").click(function(){
//  CAMERA_BODY.BODYTable();
//});


//	生成设备唯一ID，录入属性（品牌、型号、序列号、供应商、采购员、采购时间、分辨率、备注）、自动添加新增时间、更新时间、操作员

//	已绑定的不能删除，给出提示，删除视觉设备后方可删除，
//	另外是逻辑删除，不是物理删除

//	如果已绑定到视觉设备，则可以查询到视觉设备

var CAMERA_BODY = {
//	相机所需参数
	Form: [
		{ id: "brand", name: "品牌(必填)" },
		{ id: "model", name: "型号(必填)" },
		{ id: "serialNumber", name: "序列号(必填)" },
		{ id: "supplier", name: "供应商" },
		{ id: "purcUser", name: "采购员" },
		{ id: "resolution", name: "分辨率(必填)" },
		{ id: "remark", name: "备注" },
	],
	
//	硬件设备的类型
	deviceType: "1",
	
	name: "相机",
	
//	初始化相机列表
	Table: function(url, searchType){
		var TableUrl = window.deviceURL+"hardware/device/findAll?deviceType="+CAMERA_BODY.deviceType+"&pageSize=10",
			checked = "";
//		判断是否经过搜索的列表
		if(url){
			TableUrl = url;
		}
		
		if(searchType == "serialNumber"){
			checked = "selected";
		}
		
	    var test = ` 
        <div class="row">
		    <div class="CameraButtons" style="margin-left:15px; margin-bottom:10px;">
			    <a class="btn btn-social btn-success" onclick="IMU.createIMUModale(CAMERA_BODY)" data-toggle="modal" data-target="#modal-default">
	                <i class="fa fa-plus"></i> 新增相机
	            </a>
		    </div>
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">相机列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option value="id">根据硬件设备id查找</option>
				            <option value="serialNumber" ${checked}>根据硬件设备SN码查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="IMU.Search(CAMERA_BODY,event)" style="float:left;width:130px;margin:0px 5px;" />
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
					                <th>分辨率</th>
					                <th>SN码</th>
					                <th>状态</th>
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
	            
				var url =TableUrl+"&pageNum="+param.page;
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
//      		第1列----id----显示
	            { "data": "id" },
//      		第2列----品牌----显示
	            { "data": "brand" },
//      		第3列----型号----显示
	            { "data": "model" },
//      		第4列----供应商----显示
	            { "data": "supplier" },
//      		第5列----采购员----显示
	            { "data": "purcUser" },
//      		第6列----采购时间----显示
	            { "data": "purcTime" },
//      		第7列----分辨率----显示
	            {
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
	              		var resolution = row.tags[0] ? row.tags[0].v : '';
	              		if(!resolution){
	              			return "";
	              		}else{
	              			return resolution;
	              		}
						
					},
	            },
//      		SN码----显示
	            { "data": "serialNumber" },
//      		状态----显示
	            {
	            	"data": "useStatus",
	              	"render": function ( data, type, row,  meta ) {
	              		var useStatus = {
		              			'0': '正在使用',
		              			'1': '已停用'
		              		},
		              		_id = row.id,
		              		_value = useStatus[data] || '无状态',
		              		_a = '';
	              		if(data == '1'){
	              			_a = `
	              				 -- <a href='#' onclick='CAMERA_BODY.deviceUse("${_id}")'>启用</a>
	              			`;
	              		}
	              		var _value = useStatus[data] || '无状态';
	              		var _html = `
	              			<span title="${_value}">${_value}</span>
	              			${_a}
	              		`;
	              		
	              		return _html;
					},
	            },
//      		第8列----操作按钮----显示(修改和删除)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
	              		
//	              		判断设备是否已经被绑定----1为绑定 - 0为未被绑定  -----绑定之后的硬件可以修改，但不可以删除
		    			if(row.bindFlag == "1"){
					    	return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(CAMERA_BODY,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
					    	+'<a class="btn btn-danger" title="硬件已被绑定" href="#" disabled="disabled"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}else{
						    return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(CAMERA_BODY,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
						    +'<a class="btn btn-danger" title="删除" href="#" onclick="IMU.Delete(CAMERA_BODY,'+data+')" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}
					
					},
					"class": "center"
	            }

	        ]
	    });
	},
	
//	启用设备
	deviceUse: function(id){
		$('#loading').css('display', 'block');
		var _url = window.deviceURL + 'hardware/device/use?id=' + id;
	    $.ajax( {
	        type : "PUT",
	        url : _url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : {},
	        success : function(msg) {
				$('#loading').css('display', 'none');
	            if( msg.code!="0" ){
	            	util.errorView('启用失败：'+msg.message);
	            }else{
	            	util.errorView('启用成功', true);
	            	CAMERA_BODY.Table();
	            }
	        },
	        error: function(msg){
	            console.log('调用硬件设备启用：系统异常');
	        }
	    });
	}
}


