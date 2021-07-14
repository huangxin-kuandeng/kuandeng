/*
 * 
 * Created by wangtao on 2019/1/2.
 * 
*/
// -------------------------------------类型管理-------------------------------------
//点击当前
$(".manageClassify").click(function(){
	$('.content-header h1').text('类型管理');
    manageClassify.Table();
});
var manageClassify = {
	
	_types: {
		"one": [],
		"two": []
	},
	
//	当前任务的模版
	Table: function(){
	    manageClassify._types = {
			"one": [],
			"two": []
	    }
	    var test = ` 
		    <div class="row">
		        <div class='testmodal'></div>
		        <div class="col-xs-12">
		        	<div class="box box-primary">
		        		<div class="box-header">
		        			<div class="buttons"></div>
		        			<h3 class="box-title">类型管理列表</h3>
		    			</div>
					    <div class="taskButtons">
					      	<button type="button" onclick="manageClassify.updateFirstClassTag('','')" class="btn btn-default" data-toggle='modal' data-target='.modal1'>
					      		<font><font>新增一级分类</font></font>
					      	</button>
					      	<button type="button" onclick="manageClassify.updateFirstClassTag('','',true)" class="btn btn-default" data-toggle='modal' data-target='.modal1'>
					      		<font><font>新增二级分类</font></font>
					      	</button>
					    </div>
					    <div class="box-body">
						    <table id="example2" class="table table-bordered table-hover">
					            <thead>
					                <tr>
						                <th>ID</th>
						                <th>名称</th>
						                <th>类型</th>
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
//	        'processing'	: true,  								//隐藏加载提示,自行处理
	        'serverSide'	: false,  								//启用服务器端分页
//	        'order'			: [0,'desc'],  						//取消默认排序查询,否则复选框一列会出现小箭头
	        ajax: function (data, callback, settings) {
	            param1.limit = 10;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param1.start = data.start;						//开始的记录序号
	            param1.page = (data.start / data.length)+1;		//当前页码

				var collectionURL = window.kms+"task/getTags";
//				获取当前的所有任务(由于接口为字符串排序,所以暂时由前端进行排序分页)
	            $.ajax({
	                type: "GET",
                	url: collectionURL,
				    async : true,
					contentType: "application/json; charset=utf-8",
	                success: function (data) {
	                	var data_result = [],
	                		data_list = [],
	                		one_list = {};
	                	for(var i=0; i<data.result.length; i++){
	                		data.result[i]["type"] = "一级分类";
	                		data.result[i]["id"] = data.result[i].firstClassTagId;
	                		data_result.push(data.result[i]);
	                		one_list[data.result[i]["id"]] = true;
	                		var _list = data.result[i].list;
	                		for(var l=0; l<_list.length; l++){
	                			_list[l]["type"] = "二级分类";
	                			_list[l]["name"] = _list[l].tag;
	                			data_result.push(_list[l]);
	                			manageClassify._types.two.push(_list[l]);
	                		}
	                	}
	                	
			            $.ajax({
			                type: "GET",
		                	url: window.kms+"task/findAllFirstClassTag",
						    async : true,
							contentType: "application/json; charset=utf-8",
			                success: function (data) {
					        	for(var s=0; s<data.result.length; s++){
			                		data.result[s]["type"] = "一级分类";
			                		data.result[s]["id"] = data.result[s].firstClassTagId;
			                		data.result[s]["name"] = data.result[s].firstClassTagName;
	                				manageClassify._types.one.push(data.result[s]);
	                				if(!one_list[data.result[s]["id"]]){
	                					data_result.push(data.result[s])
	                				}
					        	}
			                    var returnData1 = {};
			                    returnData1.recordsTotal = data_result.length;		//返回数据全部记录
			                    returnData1.recordsFiltered = data_result.length;	//后台不实现过滤功能，每次查询均视作全部结果
			                    returnData1.data = data_result;						//返回的数据列表
			                    callback(returnData1);
			                },
						   	error: function(XMLHttpRequest, textStatus, errorThrown) {
						   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
						   	},
			           	});
			                	
	                },
				   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
				   	},
	           	});
	       	},
//			当前任务列表显示数据处理
	        columns: [
//      		第一列----任务的taskId---显示
	            { 
	            	"data": "id" || "",
	              	"render": function ( data, type, row,  meta ) {
	              		var color = "";
		    			if(row.type == "一级分类"){
		    				color = "red";
		    			}
						var centerModel = `
							<span style="color:${color}">${data}</span>
						`;
						return centerModel;
					},
					"class": "ids"
				},
//      		第二列----任务名称----显示
	            { 
	            	"data": "name" || "",
	              	"render": function ( data, type, row,  meta ) {
	              		var color = "";
		    			if(row.type == "一级分类"){
		    				color = "red";
		    			}
						var centerModel = `
							<span style="color:${color}">${data}</span>
						`;
						return centerModel;
					},
					"class": "names"
				},
//      		第3列----分类的类型----显示
	            { 
	            	"data": "type" || "",
	              	"render": function ( data, type, row,  meta ) {
	              		var color = "";
		    			if(data == "一级分类"){
		    				color = "red";
		    			}
						var centerModel = `
							<span style="color:${color}">${data}</span>
						`;
						return centerModel;
					},
					"class": "types"
				},
//      		第4列----操作按钮----显示(预览/删除/清除)
	            { 
	            	"data": "firstClassTagId",
	              	"render": function ( data, type, row,  meta ) {
		    			var name = row.name,
		    				type = row.type,
		    				_center = "无";
		    			if(type == "一级分类"){
							_center = `
								<button type="button" class="btn btn-warning" title="更新当前一级分类名称" data-toggle='modal' data-target='.modal1' onclick="manageClassify.updateFirstClassTag('${data}','${name}')">更新</button>
								<button type="button" class="btn btn-warning" title="为当前分类增加二级分类" data-toggle='modal' data-target='.modal1' onclick="manageClassify.updateFirstClassTag('${data}','${name}',true)">新增</button>
							`;
		    			}
//						任务操作按钮(打开监控界面 / 删除任务 / 清除任务数据)
						var centerModel = `
							<div class="btn-group">
								${_center}
							</div>
						`;
						return centerModel;
					},
					"class": "center"
	            }
	        ]
	    });
	},
	
	updateFirstClassTag: function(id="",name="",type){
		var _header_1 = "一级分类",
			_body = `
				<div class="form-group">
					<label class="col-sm-4 control-label" >名称:</label>
					<div class="col-sm-8">
						<input type="text" class="form-control firstClassTagName" value="${name}" >
					</div>
				</div>
			`;
		if(type){
			_header_1 = "二级分类";
		}
		var _header = _header_1+`更新 ( ${name} - ${id} )`;
		if(!id && !name){
			_header = "新增"+_header_1;
		}
		if(id && type){
//			修改二级分类到某一级分类里
			_body = `
				<div class="form-group">
					<label class="col-sm-4 control-label" >名称:</label>
					<div class="col-sm-8">
						<select class="form-control firstClassTagName">
			            	<option value="">请选择二级分类</option>
		                	${manageClassify._types.two.map(n => `
			                	<option value=${n.id}>${n.name}</option>
		                	`).join('')}
                		</select>
					</div>
				</div>
			`;
		}else if(!id && type){
//			增加二级分类并增加到一级分类里
			_body = `
				<div class="form-group">
					<label class="col-sm-4 control-label" >名称:</label>
					<div class="col-sm-8">
						<input type="text" class="form-control firstClassTagName" value="${name}" >
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-4 control-label" >一级:</label>
					<div class="col-sm-8">
						<select class="form-control firstClassTagId">
			            	<option value="">请选择一级分类</option>
		                	${manageClassify._types.one.map(n => `
			                	<option value=${n.id}>${n.name}</option>
		                	`).join('')}
                		</select>
					</div>
				</div>
			`;
		}
		var receive1 =`
			<div class="modal modal1 fade" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none; z-index:9999;background:none;">
			  <div class="modal-dialog" role="document">
			    <div class="modal-content">
				    <div class="modal-header">
			            <button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
			              	<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			            </button>
			            <h4 class="modal-title">${_header}</h4>
			        </div>
			        <div class="modal-body">
			        	${_body}
						<!------------------------------------确认或取消------------------------------------>
						<div class="form-group" style="border:none;margin-top:15px;">
							<button type="button" id="button1" class="btn btn-info" title="分配" data-dismiss="modal" onclick="manageClassify.confirm_true('${id}',${type})">确认</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" data-dismiss="modal" onclick="main.modalClose()">取消</button>
						</div>
			        </div>
			    </div>
			  </div>
			</div>
		`;
		$('.testmodal').html(receive1);
	},
	
//	确认更新或者确认修改
	confirm_true: function(id,type){
		var firstClassTagName = $(".firstClassTagName").val(),
			firstClassTagId = $(".firstClassTagId option:selected").val(),
			this_url = window.kms+"task/insertFirstClassTag?firstClassTagName="+firstClassTagName;		//新增一级
		if(id && !type){
//			修改一级
			this_url = window.kms+"task/updateFirstClassTag?firstClassTagId="+id+"&firstClassTagName="+firstClassTagName;
		}else if(!id && type){
//			新增二级
			this_url = window.kms+"task/insertTag?tagName="+firstClassTagName+"&firstClassTagId="+firstClassTagId;
		}else if(id && type){
//			将二级添加到一级内
			this_url = window.kms+"task/updateTag?id="+firstClassTagName+"&firstClassTagId="+id;
		}
        $.ajax({
            type: "GET",
        	url: this_url,
		    async : true,
			contentType: "application/json; charset=utf-8",
            success: function (data) {
	            main.modalClose();
	            manageClassify.Table();
            },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
       	});
	}

	
}

