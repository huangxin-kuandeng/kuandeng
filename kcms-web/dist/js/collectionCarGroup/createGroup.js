
/******************************************************采集版本创建页******************************************************/

/*点击创建版本*/
$(".createGroup").click(function(){
	collectionCarGroup.createGroup();
})

/*创建版本所需要的参数*/
collectionCarGroup.createForm = [
	{
		id: 'group',
		name: '名称',
		require: true,
		small: false
	},
	{
		id: 'maxDistance',
		name: '最大距离',
		require: true,
		small: false
	}
];

/*创建版本模版*/
collectionCarGroup.createGroup = function(){
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
		head: '创建设备组'
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
		collectionCarGroup.submitGroup(param);
	})
}

/*提交设备组的创建*/
collectionCarGroup.submitGroup = function(param, data=false){
	var _url = configURL.kcms+'group/create?name='+param.group+'&maxDistance='+param.maxDistance,
		_data = {},
		_x = (data && data.group.location) ? data.group.location.x : '',
		_y = (data && data.group.location) ? data.group.location.y : '';
	
	if(data){
		_url = configURL.kcms+'group/update';
		_data = {
			"id": data.group.id,
			"name": param.group,
			"location": {
				"x": _x,
				"y": _y
			},
			"maxDistance": param.maxDistance
		}
	}
	
	$.postAjax({
		url: _url,
		data: _data
	}, function(result){
		var message = (result.code == '0') ? '执行成功' : ('执行失败：'+result.message),
			type = (result.code == '0') ? true : false;
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
}
