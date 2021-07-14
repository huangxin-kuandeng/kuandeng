
/******************************************************采集线路管理页******************************************************/

/*采集线路管理----地图界面*/
collectionLink.createMap = function(){
	var collection_link = configURL.kcms_mre+'?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540';
	var device_track = configURL.kcms_mre+'?lid=device_track&get=device_track&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540';
	$.mapLeaflet({
		'url': collection_link
	},function(){
		$.spopView({
			text: '地图初始化完成！',
			type: true
		})
		collectionLink.regionRange = null;
		collectionLink.deviceList = {};
		collectionLink.searchRegion();
		collectionLink.searchDevice();
		setInterval(function(){
			collectionLink.searchDevice();
		}, 3000);
		
	})
	
	$('#leafletMap .openToggle').click(function(){
		$('#leafletMap .regionList').css('display', 'block');
	})

//	关闭图片展示
	$(".linkImage h5 span.glyphicon").click(function(e) {
		$(".linkImage").toggle();
	});
//	打开图片
	$(".linkImage img").click(function(e) {
		var _url = $(".linkImage img")[0].src;
		window.open(_url)
	});
//	点击设备列表
    $('.deviceList .deviceBody').on('click', 'a', function () {
		if( $(".deviceList a.active").length>0 ){
			$(".deviceList a.active").removeClass("active");
		}
		$(this).addClass("active");
		var _marker = collectionLink.deviceList[this.title];
		if(_marker){
			collectionLink.LocationDeviceCode = this.title;
			var _center = [
				_marker.carMarker._latlng.lat, _marker.carMarker._latlng.lng
			];
			leafletMap.setView(_center);
			collectionLink.searchDevice();
		}
    });
//	点击设备列表
    $('.deviceList h5 a').click(function() {
		if( $(".deviceList a.active").length>0 ){
			$(".deviceList a.active").removeClass("active");
		}
		collectionLink.LocationDeviceCode = null;
	});
	
}

/*查询采集区域*/
collectionLink.searchRegion = function(){
	$('#leafletMap .closeToggle a').click(function(){
		$('#leafletMap .regionList').css('display', 'none');
	})
//	初始化表格
	var table = $(".regionList #regionTable").DataTable({
	    'language'    	: window.cn_lang,
        'searching'   	: false,								//原生搜索
        'paging'      	: true,
        'lengthChange'	: false,
        'ordering'    	: false,
        'info'        	: true,
        'scrollY'		: 400,
        'scrollCollapse': true,
        'autoWidth'   	: false,
        "aaSorting"	  	: false,
	    'pagingType'  	: "simple",
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
                if(data.code != '0'){
					$.spopView({
						text: '查询采集区域列表'+data.message
					})
					return;
                }
                returnData.recordsTotal = data.result.totalElements;
                returnData.recordsFiltered = data.result.totalElements;
                returnData.data = data.result.content;
            	callback(returnData);
			})
		},
    	columns: [
//      	第1列----区域名称----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var name = row.properties.name || '',
              			nameHtml = `<span class="ellipsisTitle" title="${name}">${name}</span>`;
			    	return  nameHtml;
				},
				"class":"name"
            },
//      	采集版本----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var versionId = row.properties.versionId || '',
              			versionHtml = `<span class="ellipsisTitle" title="${versionId}">${versionId}</span>`;
			    	return  versionHtml;
				},
				"class":"versionId"
            },
//      	第2列----采集状态----显示
            {
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
              		var state = {
	              			0: {
	              				'cn': '未采集',
	              				'color': ''
	              			},
	              			1: {
	              				'cn': '已采集',
	              				'color': '#BCEE68'
	              			}
	              		},
	              		surveyStatus = row.properties.surveyStatus || 0,
	              		surveyStatus_cn = state[surveyStatus].cn,
	              		color = state[surveyStatus].color;
              		
              		var stateHtml = `
              			<span style='background:${color}'>${surveyStatus_cn}</span>
              		`;
			    	return  stateHtml;
				},
				"class": "name"
            },
//      	第3列----操作按钮----显示
            { 
            	"data": "id",
              	"render": function ( data, type, row, meta ) {
					var taskName = row.properties.name || '';
					var centerModel = `
						<a class="glyphicon glyphicon-chevron-right" title="${taskName}" href="#" style="color:gray"></a>
					`;
			    	return centerModel;
				},
				"class": "center"
            }
        ]
    });
//	点击操作按钮
    $('#regionTable tbody').on('click', 'tr td .glyphicon', function (e) {
    	if(collectionLink.regionRange){
    		collectionLink.regionRange.remove();
    	}
    	
        var tr = $(this).closest('tr');
        var row = table.row( tr );
        var data = row.data();
        
		var coordinates = data.geometry.coordinates[0],
			surveyStatus = data.properties.surveyStatus || '0';
		if(!coordinates || !coordinates.length){
			$.spopView({
				text: '查询当前区域定位失败'
			})
			return;
		}
		var collection_link = configURL.kcms_mre+'?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540&regionId='+data.id;
		
		if($.lineTileLayer){
			$.lineTileLayer.setUrl(collection_link);
		}else{
			$.lineTileLayer = L.tileLayer(collection_link).addTo(leafletMap);
			$.lineTileLayer.setZIndex(222);
		}
		
		var _color = (surveyStatus == '0') ? 'red' : 'green';
	    
	    var nodes = [];
	    for(var i=0; i<coordinates.length; i++){
	    	nodes.push([
	    		coordinates[i][1], coordinates[i][0]
	    	])
	    }
		nodes.length && leafletMap.fitBounds(nodes);
	    
	    collectionLink.regionRange = L.geoJSON(data, {
	        style: function (feature) {
	            return {color: _color};
	        }
	    }).addTo(leafletMap);
    });
//  $(".regionList").css('display', 'none');
}

/*查询设备列表*/
collectionLink.searchDevice = function(){
	var _url = configURL.kcms+'device/track/current';
	$.getAjax({
		url: _url
	}, function(data){
        if(data.code != '0'){
			$.spopView({
				text: '查询设备实时轨迹失败'
			})
			return;
        }
        var devices = data.result || [],
        	surveyStatus = {
        		'0': '停止采集',
        		'1': '正在采集',
        		'2': '已离线'
        	};
        collectionLink.setDeviceList(devices);
		for(var i=0; i<devices.length; i++){
			var thisDevice = devices[i];
			if(thisDevice){
				var node = [thisDevice.geometry.coordinates[1], thisDevice.geometry.coordinates[0]],
					id = thisDevice.id,
					code = thisDevice.properties.deviceCode || i,
					rotationAngle = Number(thisDevice.properties.direction || 0),
					_time = $.timeData({
						time: Number(thisDevice.properties.surveyTime),
						type: 2
					}),
					rotationAngle_ = rotationAngle / 2,
					rotationAngle_ = rotationAngle / 2,
					status = thisDevice.properties.surveyStatus || '0',
					velocity = thisDevice.properties.velocity*3.6 || 0,
					iconUrl = '../dist/img/car/car_'+status+'.png',
	        		imgaeBtn = (status=='1') ? `<p class="openImage"><a href="#" onclick="collectionLink.openImage('${code}')" title="获取当前实时图片">获取图片</a></p>` : '',
					infoContent = `
						<p>设备Code： ${code}</p>
						<p>当前角度： ${rotationAngle}</p>
						<p>速度： ${velocity} km/h</p>
						<p>相机SN码： ${thisDevice.properties.cameraSN}</p>
						<p>采集状态： ${surveyStatus[status] || status}</p>
						<p>用户： ${thisDevice.properties.user}</p>
						<p>区域ID： ${thisDevice.properties.regionId}</p>
						<p>采集时间： ${_time || ''}</p>
						${imgaeBtn}
					`,
			        carIcon = L.icon({
			            iconUrl: iconUrl,
						iconAnchor: [15, 15],
			            jsonParam: thisDevice,
			            iconSize:[30, 30]
			        }),
			        pointIcon = L.divIcon({
			            html: '',
			            className: 'my-point-icon',
			            iconSize: 6,
						iconAnchor: [0, 0],
			        });
				if(collectionLink.deviceList[code]){
//					更新点坐标
					collectionLink.deviceList[code].carMarker.setLatLng(node);
					collectionLink.deviceList[code].textMarker.setLatLng(node);
					collectionLink.deviceList[code].carMarker.options.rotationAngle = rotationAngle_;	//更新车头朝向
					collectionLink.deviceList[code].carMarker.setIcon(carIcon);							//更新设备状态
					collectionLink.deviceList[code].carMarker.setPopupContent(infoContent);				//更新pupop内容
//					增加历史设备轨迹点
					let histortLength = collectionLink.deviceList[code].historyMarker.length,
						firstMarker = collectionLink.deviceList[code].historyMarker[0];
					if(firstMarker && histortLength>10){
						collectionLink.deviceList[code].historyMarker.shift();
						firstMarker.setLatLng(node);
						collectionLink.deviceList[code].historyMarker.push(firstMarker);
					}else{
						let pointMarker = L.marker(node, { icon: pointIcon }).addTo(leafletMap);
						collectionLink.deviceList[code].historyMarker.push(pointMarker);
					}
				}else{
			        var myIcon = L.divIcon({
			            html: code,
			            className: 'my-div-icon',
			            iconSize: 15,
						iconAnchor: [-10, 15],
			        });
			        var carMarker = L.marker(node, {
			        	icon: carIcon,
			        	title: code,
			        	rotationAngle: rotationAngle_
			        }).bindPopup(function (layer) {
					    return infoContent;
					}).addTo(leafletMap);
			        var textMarker = L.marker(node, { icon: myIcon }).addTo(leafletMap);
			        collectionLink.deviceList[code] = {
			        	'carMarker': carMarker,
			        	'textMarker': textMarker,
			        	'historyMarker': []
			        };
				}
				
				if(collectionLink.LocationDeviceCode == code){
					var _bbox = leafletMap.getBounds(),
						_point = collectionLink.deviceList[code].carMarker._latlng,
						_ext = [
							[ _bbox._southWest.lng, _bbox._southWest.lat ],
							[  _bbox._northEast.lng, _bbox._northEast.lat ]
						];
					var centerType = $.isPointInRect(_point,_ext);
					if(!centerType){
						leafletMap.setView(node);
					}
				}
			}
		}
	})
}

collectionLink.openImage = function(deviceCode){
	var _time = $.timeData({
		time: new Date()
	});
	$('#imageLoding').css('display', 'block');
	var _url = configURL.kcms+'device/collection/img/trigger?deviceCode='+deviceCode+'&t='+_time,
		t_img = null;
	
	$(".linkImage h5 span.head").html( '设备CODE：'+deviceCode );
	$(".linkImage img")[0].src = '';
	$(".linkImage img")[0].src = (_url);
	$(".linkImage").css('display', 'block');
	completeImg();
	
	function completeImg(){
		var _complete = $(".linkImage img")[0].complete;
		if(_complete){
			$('#imageLoding').css('display', 'none');
			t_img && clearTimeout(t_img);
		}else{
			t_img = setTimeout(function(){
	            completeImg();
	        },300);
		}
	}
//	
//	$.getAjax({
//		url: _url
//	}, function(data){
//		$('#imageLoding').css('display', 'none');
//		if(data.code){
//			$.spopView({
//				text: data.code+'：'+data.message
//			})
//			return;
//		}
//		$(".linkImage h5 span.head").html( '设备CODE：'+deviceCode );
//		$(".linkImage img")[0].src = '';
//		$(".linkImage img")[0].src = (_url+'&t='+_time);
//		$(".linkImage").css('display', 'block');
//	})
}

collectionLink.setDeviceList = function(data){
	if(!collectionLink.LocationDeviceList){
		collectionLink.LocationDeviceList = data || [];
		var _list = `
            ${collectionLink.LocationDeviceList.map(f => `
				<a href="#" title="${f.properties.deviceCode}" class="status_${f.properties.surveyStatus}">设备${f.properties.deviceCode}</a>
            `).join('')}
		`;
		$('.deviceList .deviceBody').html(_list);
	}
}


collectionLink.createMap();