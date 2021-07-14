
/******************************************************车辆管理列表页******************************************************/

/*车辆管理的列表显示*/
collectionCarGroup.Table = function(){
	$('#loading').css('display', 'block');
	var initTable = `
	    <table id="groupTable" class="table table-bordered table-hover">
	        <thead>
		        <tr>
		            <th>设备组ID</th>
		            <th>设备组名称</th>
		            <th>最大距离</th>
		            <th>X</th>
		            <th>Y</th>
		            <th>设备CODE</th>
		            <th>区域ID</th>
		            <th>操作</th>
		        </tr>
	        </thead>
	    </table>
	`;
	$('.content.container-fluid .box-body').html(initTable);
	
//	初始化表格
	var table = $("#groupTable").DataTable({
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
    	'processing'  	: false,
    	'serverSide'  	: false,/*
    	'processing'  	: true,
    	'serverSide'  	: true,*/
        ajax: function (data, callback, settings) {
        	var param1 = {};
            param1.limit = data.length;
            param1.start = data.start;
            param1.page = (data.start / data.length)+1;
			
			var _url = configURL.kcms+'group/findAll?pageNumber=1&pageSize=1000';
//			var _url = configURL.kcms+'group/findAll?pageNumber='+param1.page+'&pageSize=1000';
			$.getAjax({
				url: _url
			}, function(data){
				$('#loading').css('display', 'none');
				if(data.code != '0'){
					$.spopView({
						text: '查询设备组列表失败'
					});
					return;
				}
                var returnData = {};
                returnData.recordsTotal = data.result.length;
                returnData.recordsFiltered = data.result.length;
                returnData.data = data.result;
            	callback(returnData);
			})
		},
    	columns: [
//      	第1列----设备组ID----显示
            {
            	"data":"regionId" || "",
              	"render": function ( data, type, row, meta ) {
              		var _id = row.group.id || '';
			    	return _id;
				},
            	"class":"name"
            },
//      	第1列----设备组名称----显示
            {
            	"data":"regionId" || "",
              	"render": function ( data, type, row, meta ) {
              		var _name = row.group.name || '';
			    	return _name;
				},
            	"class":"name"
            },
//      	第2列----最大距离----显示
            {
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
              		var _maxDistance = row.group.maxDistance || '';
			    	return _maxDistance;
				},
				"class": "maxDistance"
            },
//      	第3列----locationX----显示
            {
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
              		var _x = (row.group.location && row.group.location.x) ? row.group.location.x : '';
			    	return _x;
				},
				"class": "locationX"
            },
//      	第4列----locationY----显示
            {
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
              		var _y = (row.group.location && row.group.location.y) ? row.group.location.y : '';
			    	return _y;
				},
				"class": "locationY"
            },
//      	第5列----设备CODE----显示
            {
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
              		var _html = `<a href="#" class="addDevice" title="新增关联设备"> 新增 </a>`;
              		if(row.deviceCode && row.deviceCode.length){
              			_html = `
	              			<a href="#" class="openDevice" title="打开关联设备列表">设备列表 </a>
	              			 - 
	              			<a href="#" class="addDevice" title="新增关联设备"> 新增 </a>
	              		`;
              		}
			    	return _html;
				},
				"class": "deviceCode"
            },
//      	第6列----区域ID----显示
            {
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
              		var _html = `
              			<span title="${data || ''}">${data || ''}</span>
              		`;
			    	return _html;
				},
				"class": "regionId"
            },
//      	第7列----操作按钮----显示
            { 
            	"data": "regionId",
              	"render": function ( data, type, row, meta ) {
					var centerModel = `
						<a class='btn btn-warning centerBtn' title='更新设备组' href='#' data-dFn='updateModal'>
							<i class='glyphicon glyphicon-refresh' data-dFn='updateModal'></i>
						</a>
						<a class='btn btn-danger centerBtn' title='删除设备组' href='#' data-dFn='deleteModal'>
							<i class='glyphicon glyphicon-trash' data-dFn='deleteModal'></i>
						</a>
					`;
			    	return centerModel;
				},
				"class": "center"
            }
        ]
    });
//	点击新增关联设备
    $('#groupTable tbody').on('click', 'tr td .addDevice', function (e) {
        var tr = $(this).closest('tr'),
        	row = table.row( tr ),
        	data = row.data();
        collectionCarGroup.createRelation(data);
    });
//	点击打开关联设备列表
    $('#groupTable tbody').on('click', 'tr td .openDevice', function (e) {
        var tr = $(this).closest('tr'),
        	row = table.row( tr ),
        	data = row.data(),
        	deviceList = data.deviceCode;
        collectionCarGroup.openDeviceList(deviceList);
    });
//	点击操作按钮
    $('#groupTable tbody').on('click', 'tr td .centerBtn', function (e) {
        var _fn = e.target.getAttribute('data-dFn'),
        	tr = $(this).closest('tr'),
        	row = table.row( tr ),
        	data = row.data();
        collectionCarGroup[_fn](data);
    });
	
}

//新增关联设备
collectionCarGroup.createRelation = function(data){
	var deviceList = data.deviceCode || [],
		groupId = data.group.id;
	$('#loading').css('display', 'block');
	var _url = configURL.krms+'survey/device/findAll?pageSize=1000&pageNum=1';
	$.getAjax({
		url: _url
	}, function(result){
		$('#loading').css('display', 'none');
		if(result.code != '0'){
			$.spopView({
				text: '查询设备列表失败'
			});
		}
//		multiple
		var content = (result.result && result.result.result) ? result.result.result : [],
			options_html = `
				<div class='col-md-12'>
					<label>采集设备：</label>
					<select class="form-control selectpicker selectDevice" style="float:left;" >
						<option value="">选择采集设备</option>
						${content.map(c => `
			        		<option value="${c.code || ''}">${c.name}</option>
				        `).join('')}
		            </select>
				</div>
			`,
			formBody = `<div class="modal-body">${options_html}</div>`;

		$.modalCreate({
			html: formBody,
			id: 'littleModal',
			head: '新增关联设备'/*,
			_fn: function(){
				$('.selectpicker').selectpicker({
		            'selectedText': 'cat',
		            'liveSearch': true,
		            'showSubtext': true
		        })
			}*/
		}, function(){
			var deviceCode = $('.modal-body .selectDevice').val();
			if(!deviceCode){
				$.spopView({
					text: '参数缺失：采集设备'
				});
				return;
			}
			var _url = configURL.kcms+'group/device/add';
			$.postAjax({
				url: _url,
				data: {
				  "groupId": groupId,
				  "deviceCode": deviceCode
				}
			}, function(datas){
				var message = (datas.code == '0') ? '执行成功' : ('执行失败：'+datas.message),
					type = (datas.code == '0') ? true : false;
				$.spopView({
					text: message,
					type: type
				});
				if(result.code != '0'){
					return;
				}
				$.modalClose();
				collectionCarGroup.Table();
			})
		})
	})
}

//关联设备列表
collectionCarGroup.openDeviceList = function(deviceList){
	if(deviceList.length){
		formBody = `
	  		<div class="modal-body">
	            ${deviceList.map(d => `
			        <p class="modalCode code_${d}">
		            	<span>${d}</span>
		            	<a href="#" class="glyphicon glyphicon-remove-circle deleteDevice" data-value="${d}" title="从当前设备组中去除此设备"></a>
			        </p>
				`).join('')}
	  		</div>
		`;
		$.modalCreate({
			html: formBody,
			id: 'littleModal',
			head: '关联设备列表(CODE)',
			closeFn: function(){
				collectionCarGroup.Table();
			},
			_fn: function(){
				$('.deleteDevice').click(function(){
					var _code = this.getAttribute('data-value'),
						_classCode = 'code_'+_code;
					console.log(_code);

					var _url = configURL.kcms+'group/device/delete?deviceCode='+_code;
					$.postAjax({
						url: _url
					}, function(datas){
						var message = (datas.code == '0') ? '删除成功' : ('删除失败：'+datas.message),
							type = (datas.code == '0') ? true : false;
						$.spopView({
							text: message,
							type: type
						});
						if(datas.code != '0'){
							return;
						}
						$('.'+_classCode).remove();
					})
					
					
				})
			}
		})
	}
}

//删除设备组
collectionCarGroup.deleteModal = function(data){
	let _id = data.group.id,
		_name = data.group.name;
	
	var formBody = `
  		<div class="modal-body bodyCenter">
			确认要删除采集区域：${_name}？
  		</div>
	`;
	
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '删除设备组'
	}, function(){
		var _url = configURL.kcms+'group/deleteById?groupId='+_id;
		$.postAjax({
			url: _url,
			data: {}
		}, function(result){
			var message = (result.code == '0') ? '删除成功' : ('删除失败：'+result.message),
				type = (result.code == '0') ? true : false;
			$.spopView({
				text: message,
				type: type
			});
			if(result.code != '0'){
				console.log(result)
				return;
			}
			$.modalClose();
			collectionCarGroup.Table();
		})
	})
}

//更新设备组
collectionCarGroup.updateModal = function(data){
	let _id = data.group.id,
		_name = data.group.name,
		_maxDistance = data.group.maxDistance;
	var _form = [
		{
			id: 'group',
			name: '名称',
			value: _name || '',
			require: true,
			small: false
		},
		{
			id: 'maxDistance',
			name: '最大距离',
			value: _maxDistance || '',
			require: true,
			small: false
		}
	];

	var formChild = $.createForm(collectionCarGroup.createForm);	
	var formBody = `
  		<div class="modal-body">
            ${formChild.map(f => `
                ${f}
            `).join('')}
  		</div>
	`;
	$.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '更新设备组'
	}, function(){
		var param = {};
		for(var i=0; i<collectionCarGroup.createForm.length; i++){
			var _id = collectionCarGroup.createForm[i].id,
				_name = collectionCarGroup.createForm[i].name,
				_value = $('.modal-body .'+_id).val() || '';
			if(!_value){
				$.spopView({
					text: '参数缺失：'+_name
				});
				return;
			}
			param[_id] = _value;
		}
		collectionCarGroup.submitGroup(param, data);
	})
}

collectionCarGroup.Table();