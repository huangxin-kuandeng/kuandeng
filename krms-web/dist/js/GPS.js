//$(".GPS").click(function(){
//  GPS.GPSTable();
//});



//	生成设备唯一ID，录入属性（品牌、型号、序列号、供应商、采购员、采购时间、备注）、自动添加新增时间、更新时间、操作员

// 	已绑定的不能删除，给出提示，
//	删除视觉设备后方可删除，另外是逻辑删除，不是物理删除


var GPS = {
	
//	GPS所需要的参数
	Form: [
		{ id: "brand", name: "品牌(必填)" },
		{ id: "model", name: "型号(必填)" },
		{ id: "serialNumber", name: "序列号(必填)" },
		{ id: "supplier", name: "供应商" },
		{ id: "purcUser", name: "采购员" },
		{ id: "remark", name: "备注" },
	],
	
//	硬件设备的类型
	deviceType: "3",
	
	name: "GPS",
	
//	GPS列表的初始化
	Table: function(url){
		
//		判断是否经过搜索的列表
		if(!url){
			var TableUrl = window.deviceURL+"hardware/device/findAll?deviceType="+GPS.deviceType+"&pageSize=10";
		}else{
			var TableUrl = url;
		}
		
	    var test = ` 
        <div class="row">
		    <div class="CameraButtons" style="margin-left:15px; margin-bottom:10px;">
			    <a class="btn btn-social btn-success" onclick="IMU.createIMUModale(GPS)" data-toggle="modal" data-target="#modal-default">
	                <i class="fa fa-plus"></i> 新增GPS
	            </a>
		    </div>
            <div class='testmodal'></div>
            <div class='Prompt'></div>
            <div class="col-xs-12">
                <div class="box box-primary box-solid">
					<div class="box-header with-border">
		              	<h3 class="box-title">GPS列表</h3>
		            </div>
			        <div class="searchType" style="position: absolute;z-index: 1000;width:500px;padding: 10px;">
						<select class="form-control" style="width:200px;float:left;">
				            <option class="change" value="id">根据硬件设备id查找</option>
			            </select>
			            <input type="text" class="form-control searchTypeValue" placeholder="回车搜索" onfocus="this.placeholder=''" onblur="this.placeholder='回车搜索'" onkeydown="IMU.Search(GPS,event)" style="float:left;width:130px;margin:0px 5px;" />
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
//      		第六列----操作按钮----显示(预览和删除)
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
	              		
//	              		判断设备是否已经被绑定----1为绑定 - 0为未被绑定  -----绑定之后的硬件可以修改，但不可以删除
		    			if(row.bindFlag == "1"){
					    	return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(GPS,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
					    	+'<a class="btn btn-danger" title="硬件已被绑定" href="#" disabled="disabled"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}else{
						    return	'<a class="btn btn-primary" title="修改" href="#" onclick="IMU.Change(GPS,'+data+')" data-toggle="modal" data-target="#modal-default" style="margin-right:3px;"><i class="glyphicon glyphicon-edit"></i></a>'
						    +'<a class="btn btn-danger" title="删除" href="#" onclick="IMU.Delete(GPS,'+data+')" data-toggle="modal" data-target="#modal-default"><i class="glyphicon glyphicon-trash"></i></a>'
		    			}
					
					},
					"class": "center"
	            }

	        ]
	    });
	},

}


