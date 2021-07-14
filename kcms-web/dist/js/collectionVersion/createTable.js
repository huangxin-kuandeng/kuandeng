
/******************************************************采集版本列表页******************************************************/

/*采集版本的列表显示*/
collectionVersion.Table = function(){
	var initTable = `
	    <table id="versionTable" class="table table-bordered table-hover">
	        <thead>
		        <tr>
		            <th>版本ID</th>
		            <th>版本名称</th>
		            <th>创建时间</th>
		            <th>操作</th>
		        </tr>
	        </thead>
	    </table>
	`;
	$('.content.container-fluid .box-body').html(initTable);
	
//	初始化表格
	var table = $("#versionTable").DataTable({
	    'language'    	: window.cn_lang,
        'searching'   	: false,								//原生搜索
        'paging'      	: true,
        'lengthChange'	: false,
        'ordering'    	: false,
        'info'        	: true,
        'scrollY'		: 600,
        'scrollCollapse': true,
        'autoWidth'   	: false,
        "aaSorting"	  	: false,
    	'processing'  	: true,
    	'serverSide'  	: true,
        ajax: function (data, callback, settings) {
        	var param1 = {};
            param1.limit = data.length;
            param1.start = data.start;
            param1.page = (data.start / data.length)+1;
			
			var _url = configURL.kcms+"collection/version/queryForPage?pageNumber="+param1.page+"&pageSize=10";
			$.getAjax({
				url: _url
			}, function(data){
				console.log(data.result)
                var returnData = {};
                returnData.recordsTotal = data.result.totalElements;
                returnData.recordsFiltered = data.result.totalElements;
                returnData.data = data.result.content;
            	callback(returnData);
			})
        },
    	columns: [
//      	第1列----版本ID----显示
            { "data":"id" || "", "class":"id"},
//      	第2列----版本名称----显示
            { "data":"version" || "", "class":"version"},
//      	第3列----创建时间----显示
            { 
            	"data": "createTime",
              	"render": function ( data, type, row, meta ) {
              		var _time = $.timeData({
              			time: Number(data),
              			type: '2'
              		})
			    	return  _time;
				},
				"class": "createTime"
            },
//      	第4列----操作按钮----显示
            { 
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
					var taskName = row.taskName;
					var centerModel = `
						<div class="btn-group testBtn">
						  	<button type="button" class="btn btn-success" title="测试按钮1" data-dId='${data}' data-dtaskName='${taskName}'>测试按钮1</button>
					      	<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" style="width: initial;">
					            <span class="caret"></span>
					            <span class="sr-only">Toggle Dropdown</span>
					      	</button>
					      	<ul class="dropdown-menu" role="menu" style="min-width:100px;margin:0px;">
							    <li><a href="#" title="测试按钮2" data-dId='${data}' data-dtaskName='${taskName}'>测试按钮2</a></li>
					      	</ul>
					    </div>
						<a class='btn btn-warning' title='预览' href='#' data-dId='${data}' data-dtaskName='${taskName}'>
							<i class='glyphicon glyphicon-eye-open'></i>
						</a>
					`;
			    	return  '空' || centerModel;
				},
				"class": "center"
            }
        ]
    });
	
}

collectionVersion.Table();