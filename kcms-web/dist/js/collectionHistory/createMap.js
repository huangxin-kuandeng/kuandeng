
/******************************************************采集线路管理页******************************************************/

/*采集线路管理----地图界面*/
collectionHistory.createMap = function(){
	var collection_link = configURL.kcms_mre+'?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540';
	var device_track = configURL.kcms_mre+'?lid=device_track&get=device_track&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540';
	$.mapLeaflet({
		'url': collection_link
	},function(){
		$.spopView({
			text: '地图初始化完成！',
			type: true
		})
		collectionHistory.regionRange = null;
		collectionHistory.deviceList = [];
		collectionHistory.searchDevice();
		collectionHistory.getDeviceList();
		
	})
	
	$('#leafletMap .openToggle').click(function(){
		$('#leafletMap .regionList').css('display', 'block');
	})
}

/*查询采集设备对应轨迹*/
collectionHistory.createDeviceLink = function(param){
	var getUrl = configURL.kcms+'device/track/query?startSurveyTime='+param.startSurveyTime+'.000&endSurveyTime='+param.endSurveyTime+'.000&deviceCode='+param.deviceCode

	$.getAjax({
		url: getUrl
	}, function(data){
		var errorView = '当前设备历史轨迹为空',
			type = true;
		if(data.code != '0'){
			errorView = '查询设备历史轨迹失败'+data.message;
			type = false;
		}
		if(collectionHistory.polyline){
			for(var o=0; o<collectionHistory.polyline.length; o++){
				collectionHistory.polyline[o].remove();
			}
		}
		collectionHistory.polyline = [];
		var points = data.result || [],
			polylines = [],
			latlngs = [];
		for(var i=0; i<points.length; i++){
			var time = points[i].properties.surveyTime,
				last_time = points[i-1] ? points[i-1].properties.surveyTime : points[i].properties.surveyTime,
				interval_time = Math.abs(time - last_time),
				latlng = [ points[i].geometry.coordinates[1], points[i].geometry.coordinates[0] ];
			if(interval_time > 9999){
				polylines.push(latlngs);
				latlngs = [];
			}
			latlngs.push(latlng);
		}
		if(polylines.length){
			errorView = '当前设备历史轨迹：'+polylines.length;
			leafletMap.setView(latlngs[0]);
			for(var s=0; s<polylines.length; s++){
//				if(polylines[s].length > 1){
					var _layer = L.polyline(polylines[s], {color: '#000000'}).addTo(leafletMap);
					collectionHistory.polyline.push(_layer);
//				}
			}
		}
		$.spopView({
			text: errorView,
			type: type
		})
	})

}

/*查询设备列表*/
collectionHistory.searchDevice = function(){
	var _url = configURL.krms+"survey/device/findAll?showSnExist=true&pageSize=1000";		//取SN存在的
	$.getAjax({
		url: _url
	}, function(data){
		var list = [];
		collectionHistory.deviceList = [];
		if(data.code != '0'){
			$.spopView({
				text: '查询设备列表失败'
			})
		}else{
			list = data.result.result;
		}
		for(var i=0; i<list.length; i++){
			collectionHistory.deviceList.push({
				'id': list[i].code || list[i].name,
				'name': list[i].name || list[i].code
			})
		}
		
	})
	
}

/*查询条件筛选模版*/
collectionHistory.getDeviceList = function(){

	var searchForm = [
		{
			id: 'startSurveyTime',
			name: '开始采集时间',
			require: true,
			type: 'time',
			small: false
		},
		{
			id: 'endSurveyTime',
			name: '结束采集时间',
			require: true,
			type: 'time',
			small: false
		},
		{
			id: 'deviceCode',
			name: '设备编码',
			require: true,
			modal: true,
			small: false
		}
	];
	var formChild = $.createForm(searchForm);	
	var formBody = `
        ${formChild.map(f => `
            ${f}
        `).join('')}
		<div class='col-md-12'>
			<button type="button" class="btn btn-success btnConfirm" title="查询">查询</button>
		</div>
	`;
	$('#leafletMap .deviceList').html(formBody);
	var endDate = $.timeData({
		'time': new Date(),
		'type': '2'
	})
//	startDate
//	日期选择器的语言修改为中文格式的
    $('#leafletMap .deviceList .time').datetimepicker({
    	format: 'yyyy-mm-dd hh:ii:ss',
    	autoclose: true,
    	language: "zh-CN",
    	endDate: endDate,
    	todayBtn: true,
    	todayHighlight: true,
    	initialDate: new Date()
    }).on('changeDate', function(event){
    	var name = (event.target.name=='startSurveyTime') ? 'endSurveyTime' : 'startSurveyTime',
    		value = event.target.value,
    		type = (name=='startSurveyTime') ? 'setEndDate' : 'setStartDate';
    	
    	$('#leafletMap .deviceList .'+name).datetimepicker(type, value);
	});;
//	选择采集版本
	$('#leafletMap .deviceList .deviceCode').click(function(){
        var rect = $('#leafletMap .deviceCode')[0].getBoundingClientRect();
		$.modalPicker({
			'data': collectionHistory.deviceList,
			'rect': rect,
			'head': '选择设备列表',
			'callback': function(data){
				$('#leafletMap .deviceCode').val(data.id);
	            $('#leafletMap .deviceCode')[0].name = data.id;
			}
		})
	})
//	选择采集版本
	$('#leafletMap .deviceList .btnConfirm').click(function(){
		var searchs = {};
		for(d of searchForm){
			var id = d.id,
				value = $('#leafletMap .deviceList .'+id).val(),
				name = d.name;
			if(!value){
				$.spopView({
					text: name+'查询条件缺少'
				})
				return;
			}
			searchs[id] = value;
		}
        collectionHistory.createDeviceLink(searchs);
	})
}

collectionHistory.createMap();