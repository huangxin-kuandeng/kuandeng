
/******************************************************采集区域创建页******************************************************/

/*点击创建采集区域*/
$(".createRegion").click(function(){
	collectionRegion.createRegion();
})

/*创建采集区域所需要的参数*/
collectionRegion.createForm = [
	{
		id: 'name',
		name: '名称',
		require: true,
		small: false
	},
	{
		id: 'adcodeValue',
		newId: 'adcode',
		name: '行政区划',
		require: true,
		modal: true,
		small: false
	},
	{
		id: 'polygon',
		name: '范围',
		require: false,
		type: 'button',
		small: false
	},
	{
		id: 'versionId',
		name: '采集版本',
		require: true,
		modal: true,
		small: false
	},
	{
		id: 'deadlineTime',
		name: '开始时间',
		require: true,
		type: 'time',
		small: false
	},
	{
		id: 'user',
		name: '用户',
		require: true,
		hide: true,
		small: false
	},
	{
		id: 'collectionType',
		name: '采集类型',
		require: true,
		data: [
			{name: '正常采集', value: '1', selected: 'selected'},
			{name: '区域补采', value: '2'}
		],
		small: false
	}
];

/*创建采集区域模版*/
collectionRegion.createRegion = function(){
	var formChild = $.createForm(collectionRegion.createForm);
	var formBody = `
  		<div id="leafletMap" class="modal-body">
            <div class="createForms">
	            ${formChild.map(f => `
	                ${f}
	            `).join('')}
				<div class='col-md-12'>
					<button type="button" class="btn btn-success btnConfirm" title="提交">提交</button>
				</div>
            </div>
  		</div>
	`;
	
	$.modalCreate({
		html: formBody,
		id: 'bigModal',
		head: '创建采集区域',
		_fn: collectionRegion.mapInit
	}, function(){
		collectionRegion.submitRegion();
	})
}

/*地图初始化完成时,加载需要输入的参数*/
collectionRegion.mapInit = function(){
	$.mapLeaflet({},function(){
		collectionRegion.regionRange = {};
		collectionRegion.versionQuery('versionList');
		$.spopView({
			text: '地图初始化完成！',
			type: true
		})
	})
//	选择采集类型
	$('#leafletMap .collectionType').change(function(){
        let value = this.value,
        	display = (value == '2') ? 'block' : 'none';
        $('.surveyFile').css('display', display);
	})
//	选择采集版本
	$('#leafletMap .versionId').click(function(){
        var rect = $('#leafletMap .versionId')[0].getBoundingClientRect();
		$.modalPicker({
			'data': collectionRegion.versionList,
			'rect': rect,
			'head': '选择采集版本',
			'callback': function(data){
				$('#leafletMap .versionId').val(data.name);
	            $('#leafletMap .versionId')[0].name = data.id;
			}
		})
	})
//	绘制范围
	$('#leafletMap .polygon').click(function(){
        var adcode = $('#leafletMap .adcodeValue').val();
        if(!adcode){
			$.spopView({
				text: '请先选择行政区划'
			});
			return;
        }
        leafletMap.editTools.startPolygon();
//		$.mapRemove(collectionRegion.regionRange.leafletId);
        for(var _id in leafletMap.editTools.featuresLayer._layers){
			leafletMap.editTools.featuresLayer._layers[_id]._map && $.mapRemove(_id);
        }
		collectionRegion.regionRange = {};
	})
//	选择城市行政区划
	$('#leafletMap .adcodeValue').click(function(){
        var rect = $('#leafletMap .adcodeValue')[0].getBoundingClientRect();
        citypicker.show({
            top: rect.top + rect.height,
            left: rect.left
        }, function(cityname, city){
        	var adcode = city.adcode;
            $('#leafletMap .adcodeValue').val(cityname);
            $('#leafletMap .adcodeValue')[0].name = adcode;
            if(!city) return ;
            
            var _center = [city.loc[1], city.loc[0]];
            leafletMap.setView(_center);
        })
	})
}

//处理绘制的区域
collectionRegion.rectBounds = function(layers){
	if(layers.feature._latlngs[0].length < 3){
		layers.feature.remove();
		$.spopView({
			text: '请绘制一个多边形'
		});
		return;
	}
	var leafletId = layers.feature._leaflet_id,
		pathId = layers.feature._path._leaflet_id,
		range = $.geoPolygon(layers.feature._latlngs[0]);
	collectionRegion.regionRange = {
		'leafletId': layers.feature._leaflet_id,
		'pathId': layers.feature._path._leaflet_id,
		'range': 'POLYGON(('+range+'))'
	}
};

/*确认创建采集区域*/
collectionRegion.submitRegion = function(){
	var submitForm = {};
	for(var d of collectionRegion.createForm){
		let id = d.id,
			modal = d.modal,
			newId = d.newId,
			require = d.require,
			hide = d.hide,
			name = d.name,
			type = d.type,
			value = '';
		if(!hide && !modal && !type){
			value = $('.'+id).val();
		}else if(!hide && modal && !type){
			value = $('.'+id)[0].name;
		}else if(type == 'time'){
			value = $('.'+id).val();
			value = value ? (value+' 00:00:00.00') : '';
		}else if(id == 'polygon'){
			value = collectionRegion.regionRange.range;
		}else if(id == 'user'){
			value = currentUser.username;
//			value = 'surveyor1';
		}
		if(require && !value){
			$.spopView({
				text: name+'参数缺失'
			});
			return;
		}
		if(newId){
			submitForm[newId] = value || '';
		}else{
			submitForm[id] = value || '';
		}
	}
	
	var _url = configURL.kcms+'collection/region/create';
	$.postAjax({
		url: _url,
		data: submitForm
	}, function(data){
		var message = (data.code == '0') ? '创建成功' : ('创建失败：'+data.message),
			type = (data.code == '0') ? true : false;
		$.spopView({
			text: message,
			type: type
		});
		if(data.code != '0'){
			return;
		}
		$.modalClose();
		collectionRegion.Table();
	})
}

/*查询采集版本*/
collectionRegion.versionQuery = function(id){
	var _url = configURL.kcms+'collection/version/query';
	$.getAjax({
		url: _url
	}, function(data){
		if(data.code != '0'){
			$.spopView({
				text: '查询采集版本失败：'+data.code+'（'+data.message+'）'
			});
			collectionRegion[id] = [];
			return;
		}
		for(var d of data.result){
			d['name'] = d.version;
		}
		collectionRegion[id] = data.result;
	})
}
