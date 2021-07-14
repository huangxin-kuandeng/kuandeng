
window.collectionCarGroup = {};
window.configURL = {
	'kcms': 'http://192.168.7.23:23370/kcms/'
}
/*点击创建设备组*/
$(".createGroup").click(function(){
	collectionCarGroup.createGroup();
})
/*点击搜索设备组*/
$('.searchType input.searchTypeValue').keydown(function(e){
	if(e.keyCode==13) {
		collectionCarGroup.Table();
	}
})
/*创建版本所需要的参数*/
collectionCarGroup.createForm = [
	{
		id: 'group',
		name: '名称',
		require: true,
		small: false
	}
];

/*创建版本模版*/
collectionCarGroup.createGroup = function(){
	var formChild = util.createForm(collectionCarGroup.createForm);	
	var formBody = `
  		<div class="modal-body">
            ${formChild.map(f => `
                ${f}
            `).join('')}
  		</div>
	`;
	util.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '创建设备组'
	}, function(){
		var param = {};
		for(var i=0; i<collectionCarGroup.createForm.length; i++){
			var _id = collectionCarGroup.createForm[i].id,
				_name = collectionCarGroup.createForm[i].name,
				_value = $('.modal-body .'+_id).val() || '';
			if(!_value){
				util.spopView({
					text: '参数缺失：'+_name
				});
				return;
			}
			param[_id] = _value;
		}
		collectionCarGroup.submitGroup(param);
	})
}

/*提交设备组的创建*/
collectionCarGroup.submitGroup = function(param, data=false){
	var _url = window.deviceURL+'survey/device/group'
		_data = {
			'name': param.group,
			'openUser': login.username
		},
		_x = (data && data.group.location) ? data.group.location.x : '',
		_y = (data && data.group.location) ? data.group.location.y : '';
	
	if(data){
		_url = window.deviceURL+'group/update';
		_data = {
			"id": data.group.id,
			"name": param.group,
			"location": {
				"x": _x,
				"y": _y
			}
		}
	}
	
	util.postAjax({
		url: _url,
		data: _data
	}, function(result){
		var message = (result.code == '0') ? '执行成功' : ('执行失败：'+result.message),
			type = (result.code == '0') ? true : false;
		util.spopView({
			text: message,
			type: type
		});
		if(result.code != '0'){
			return;
		}
		util.modalClose();
		collectionCarGroup.Table();
	})
}

/*车辆管理的列表显示*/
collectionCarGroup.Table = function(){
	$('#loading').css('display', 'block');
	var initTable = `
	    <table id="groupTable" class="table table-bordered table-hover">
	        <thead>
		        <tr>
		            <th>设备组ID</th>
		            <th>设备组名称</th>
		            <th>绑定设备</th>
		            <th>创建人</th>
		            <th>创建时间</th>
		            <th>操作</th>
		        </tr>
	        </thead>
	    </table>
	`;
	$('.box .box-body').html(initTable);
	
//	初始化表格
	var table = $("#groupTable").DataTable({
	    'language'    	: window.lang,
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
    	'serverSide'  	: true,/*
    	'processing'  	: true,
    	'serverSide'  	: true,*/
        ajax: function (data, callback, settings) {
        	var param1 = {};
            param1.limit = 10;
            param1.start = data.start;
            param1.page = (data.start / data.length)+1;
			
			var _url = window.deviceURL+'survey/device/group/query?pageNum='+param1.page+'&pageSize=10',
				_type = $('.searchType select').val(),
				_value = $('.searchType input').val();
			
			if(_value){
				_url = _url + '&' + _type + '=' + _value;
			}
			console.log(data)
			
			util.getAjax({
        		url : _url
			}, function(data){
				$('#loading').css('display', 'none');
				if(data.code != '0'){
					util.spopView({
						text: '查询设备组列表失败'
					});
					return;
				}
                var returnData = {};
                returnData.recordsTotal = data.result.total;
                returnData.recordsFiltered = data.result.total;
                returnData.data = data.result.result;
            	callback(returnData);
			})
		},
    	columns: [
//      	设备组ID----显示
            {
            	"data":"id" || "",
            	"class":"groupId"
            },
//      	设备组名称----显示
            {
            	"data":"name" || "",
            	"class":"groupName"
            },
//      	设备CODE----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var _html = `<a href="#" class="addDevice" title="新增关联设备"> 新增 </a>`;
              		if(row.surveyDevices && row.surveyDevices.length){
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
//      	创建人----显示
            {
            	"data": "operUser",
				"class": "operUser"
            },
//      	创建时间----显示
            {
            	"data": "createTime",
              	"render": function ( data, type, row, meta ) {
              		var _time = util.Time(data);
              		var _html = `
              			<span title="${_time || ''}">${_time || ''}</span>
              		`;
			    	return _html;
				},
				"class": "createTime"
            },
//      	操作按钮----显示
            { 
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
					var centerModel = `
						<a class='btn btn-danger centerBtn' title='删除设备组' href='#'>
							<i class='glyphicon glyphicon-trash'></i>
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
        	deviceList = data.surveyDevices;
        collectionCarGroup.openDeviceList(deviceList);
    });
//	点击操作按钮
    $('#groupTable tbody').on('click', 'tr td .centerBtn', function (e) {
        var tr = $(this).closest('tr'),
        	row = table.row( tr ),
        	data = row.data();
        collectionCarGroup.deleteModal(data);
    });
	
}

//新增关联设备
collectionCarGroup.createRelation = function(data){
	var deviceList = data.deviceCode || [],
		groupId = data.id;
	$('#loading').css('display', 'block');
	var _url = window.deviceURL+'survey/device/findAll?pageSize=1000&pageNum=1';
	util.getAjax({
		url: _url
	}, function(result){
		$('#loading').css('display', 'none');
		if(result.code != '0'){
			util.spopView({
				text: '查询设备列表失败'
			});
		}
		
//		multiple
		var content = (result.result && result.result.result) ? result.result.result : [],
			datas = [];
		
		for(var i=0; i<content.length; i++){
			var thisId = content[i].groupId;
			if(!thisId){
				datas.push(content[i]);
			}
		}
		
			
		var options_html = `
				<div class='col-md-12'>
					<label>采集设备：</label>
					<select class="form-control selectpicker selectDevice" style="float:left;" >
						<option value="">选择采集设备</option>
						${datas.map(c => `
			        		<option value="${c.id || ''}">${c.name}</option>
				        `).join('')}
		            </select>
				</div>
			`,
			formBody = `<div class="modal-body">${options_html}</div>`;

		util.modalCreate({
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
			var deviceId = $('.modal-body .selectDevice').val();
			if(!deviceId){
				util.spopView({
					text: '参数缺失：采集设备'
				});
				return;
			}
			var _data = {
			  "groupId": groupId,
			  "id": deviceId
			};
			collectionCarGroup.putDeviceList(_data);
		})
	})
}

collectionCarGroup.putDeviceList = function(data,callback=false){
	var _url = window.deviceURL+'survey/device';
    $.ajax( {
        type : "PUT",
        url : _url,
    	async : true,
		contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        success : function(data) {
			var message = (data.code == '0') ? '执行成功' : ('执行失败：'+data.message),
				type = (data.code == '0') ? true : false;
			util.spopView({
				text: message,
				type: type
			});
			if(data.code != '0'){
				return;
			}
			if(callback){
				callback();
				return;
			}
			util.modalClose();
			collectionCarGroup.Table();
        },
	   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			$("#loading").css("display","none");
	   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
            util.spopView({});
	   	},
    });
}

//关联设备列表
collectionCarGroup.openDeviceList = function(deviceList){
	if(deviceList.length){
		formBody = `
	  		<div class="modal-body" style="max-height:500px;overflow-x:auto;">
	            ${deviceList.map(d => `
			        <p class="modalCode code_${d.id}">
		            	<span>${d.id}：${d.name}</span>
		            	<a href="#" class="glyphicon glyphicon-remove-circle deleteDevice" data-value="${d.id}" title="从当前设备组中去除此设备"></a>
			        </p>
				`).join('')}
	  		</div>
		`;
		util.modalCreate({
			html: formBody,
			id: 'littleModal',
			head: '关联设备列表(CODE)',
			closeFn: function(){
				collectionCarGroup.Table();
			},
			_fn: function(){
				$('.deleteDevice').click(function(){
					var deviceId = this.getAttribute('data-value'),
						_classCode = 'code_'+deviceId;
						_data = {
						  "groupId": "",
						  "id": deviceId
						};
					collectionCarGroup.putDeviceList(_data, function(){
						$('.'+_classCode).remove();
					});
				})
			}
		})
	}
}

//删除设备组
collectionCarGroup.deleteModal = function(data){
	let _id = data.id,
		_name = data.name;
	
	var formBody = `
  		<div class="modal-body bodyCenter">
			确认要删除设备组：${_name}？
  		</div>
	`;
	
	util.modalCreate({
		html: formBody,
		id: 'littleModal',
		head: '删除设备组'
	}, function(){
		var _url = window.deviceURL+'survey/device/group/'+_id;
	    $.ajax( {
	        type : "DELETE",
	        url : _url,
	        async : true,
	        data : {},
	        success : function(data) {
				var message = (data.code == '0') ? '删除成功' : ('删除失败：'+data.message),
					type = (data.code == '0') ? true : false;
				util.spopView({
					text: message,
					type: type
				});
				if(data.code != '0'){
					console.log(data)
					return;
				}
				util.modalClose();
				collectionCarGroup.Table();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            util.spopView({});
		   	},
	    });
	})
}

collectionCarGroup.Table();