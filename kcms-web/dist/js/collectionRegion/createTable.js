
/******************************************************采集区域列表页******************************************************/

/*采集版本的列表显示*/
collectionRegion.Table = function(){
	var initTable = `
	    <table id="regionTable" class="table table-bordered table-hover">
	        <thead>
		        <tr>
		            <th>区域ID</th>
		            <th>区域名称</th>
		            <th>用户</th>
		            <th>版本ID</th>
		            <th>采集状态</th>
		            <th>导入状态</th>
		            <th>区域类型</th>
		            <th>更新状态</th>
		            <th>创建时间</th>
		            <th>操作</th>
		        </tr>
	        </thead>
	    </table>
	`;
	$('.content.container-fluid .box-body').html(initTable);
	
//	初始化表格
	var table = $("#regionTable").DataTable({
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

			var _url = configURL.kcms+"collection/region/queryForPage?pageNumber="+param1.page+"&pageSize=10&isCoord=true";
			$.getAjax({
				url: _url
			}, function(data){
                var returnData = {};
                returnData.recordsTotal = data.result.totalElements;
                returnData.recordsFiltered = data.result.totalElements;
                returnData.data = data.result.content;
            	callback(returnData);
			})
		},
    	columns: [
//      	第1列----区域ID----显示
            { "data":"id" || "", "class":"id"},
//      	第2列----区域名称----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var name = row.properties.name || '';
			    	return  name;
				},
				"class": "name"
            },
//      	第3列----用户----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var user = row.properties.user || '';
			    	return  user;
				},
				"class": "user"
            },
//      	第4列----版本ID----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var versionId = row.properties.versionId || '';
			    	return  versionId;
				},
				"class": "versionId"
            },
//      	第5列----采集状态----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var surveyStatus = {
              			'0': '未采集',
              			'1': '已采集'
              		}
              		var status = row.properties.surveyStatus,
              			_html = surveyStatus[status] || status || '';
			    	return  _html;
				},
				"class": "surveyStatus"
            },
//      	导入状态----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var impStatus = {
              			'0': '未导入',
              			'1': '正在导入',
              			'2': '已导入'
              		}
              		var status = row.properties.impStatus,
              			_html = impStatus[status] || status || '';
			    	return  _html;
				},
				"class": "impStatus"
            },
//      	区域类型----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var typeStatus = {
              			'0': '特殊采集',
              			'1': '正常采集',
              			'2': '区域补采'
              		}
              		var status = row.properties.collectionType,
              			_html = typeStatus[status] || status || '';
			    	return  _html;
				},
				"class": "collectionType"
            },
//      	更新状态----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var updateStatus = {
              			'1': '正执行更新',
              			'2': '未执行更新'
              		}
              		var status = row.properties.updateStatus,
              			_html = updateStatus[status] || status || '';
			    	return  _html;
				},
				"class": "updateStatus"
            },
//      	第6列----创建时间----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var createTime = row.properties.createTime,
              			_time = '';
              		if(createTime){
	              		var _time = $.timeData({
	              			time: Number(createTime),
	              			type: '2'
	              		})
              		}
			    	return  _time;
				},
				"class": "createTime"
            },
//      	第4列----操作按钮----显示
            { 
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
					var impStatus = row.properties.impStatus || '0',			//导入状态
						collectionType = row.properties.collectionType || '1',	//采集类型
						impStatusDisable = (impStatus=='0' && collectionType=='2') ? 'inline-block' : 'none';
					
					var centerModel = `
						<!--<div class="btn-group testBtn">
						  	<button type="button" class="btn btn-success centerBtn" title="测试按钮1">测试按钮1</button>
					      	<button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" style="width: initial;">
					            <span class="caret"></span>
					            <span class="sr-only">Toggle Dropdown</span>
					      	</button>
					      	<ul class="dropdown-menu" role="menu" style="min-width:100px;margin:0px;">
							    <li><a href="#" class="centerBtn" title="测试按钮2">测试按钮2</a></li>
					      	</ul>
					    </div>-->
						<a class='btn btn-warning centerBtn' title='触发采集线路导入' href='#' data-dFn='triggerImp' style='display:${impStatusDisable};'>
							<i class='glyphicon glyphicon-upload' data-dFn='triggerImp'></i>
						</a>
						<a class='btn btn-success centerBtn' title='查看采集区域' href='#' data-dFn='openRegion'>
							<i class='glyphicon glyphicon-eye-open' data-dFn='openRegion'></i>
						</a>
						<a class='btn btn-danger centerBtn' title='删除采集区域' href='#' data-dFn='deleteModal'>
							<i class='glyphicon glyphicon-trash' data-dFn='deleteModal'></i>
						</a>
					`;
			    	return centerModel;
				},
				"class": "center"
            }
        ]
    });
//	点击操作按钮
    $('#regionTable tbody').on('click', 'tr td .centerBtn', function (e) {
        var _fn = e.target.getAttribute('data-dFn'),
        	tr = $(this).closest('tr'),
        	row = table.row( tr ),
        	data = row.data();
        collectionRegion[_fn](data);
    });
	
}

collectionRegion.Table();