
/******************************************************采集监控封装通用函数******************************************************/

/*使用JQ封装通用函数*/
(function ($) {
	$.errorView = function(view,junge=false){
		
		console.warn(view);
		
		let _style = junge ? 'success' : 'error';
		spop({
			template: view || '系统异常',
			style: _style,
			position  : 'top-center',
			autoclose: 2000
		});
	};
//	时间格式方法(年月日-时分秒)
	$.timeData = function(param){
		var dateTime = new Date(param.time);
	    var y = dateTime.getFullYear();			//年
	    var m = dateTime.getMonth() + 1;		//月
	    m = m < 10 ? '0' + m : m;
	    var d = dateTime.getDate();				//日
	    d = d < 10 ? ('0' + d) : d;
	    var h = dateTime.getHours();			//时
	    h = h < 10 ? ('0' + h) : h;
	    var t = dateTime.getMinutes();			//分
	    t = t < 10 ? ('0' + t) : t;
	    var s = dateTime.getSeconds();			//秒
	    s = s < 10 ? ('0' + s) : s;
	    
	    var millisecond = dateTime.getTime();	//毫秒
	    if(param.type == '1'){						//年月日
	    	return y + '-' + m + '-' + d;
	    }else if(param.type == '2'){				//年月日，时分秒
			return y + '-' + m + '-' + d + ' ' + h + ':' + t + ':' + s;
	    }else{
	    	return millisecond;
	    }
	};
	
	/*使用ajax的方式get获取请求数据           (jq自带的获取接口数据)*/
	$.getAjax = function(param,callback){
		$("#loading").css("display","block");
    	$.ajax( {
        	type : "GET",
	        url : param.url,
	        async : true,
	        data : {},
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(callback){
	        		callback(data);
	        	}else{
	        		return data;
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            $.spopView({});
		   	},
	    });
	};
	
	/*使用ajax的方式post获取请求数据             (jq自带的获取接口数据)*/
	$.postAjax = function(param,callback){
		$("#loading").css("display","block");
	    $.ajax( {
	        type : "POST",
	        url : param.url,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(param.data),
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(callback){
	        		callback(data);
	        	}else{
	        		return data;
	        	}
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
	            $.spopView({});
	        }
	    });
	};
	
	$.lineTileLayer = null;
	
	/*leafletJS地图的初始化*/
	$.mapLeaflet = function(param, callback){
		if( (typeof(L) == "undefined") || !L || !L.tileLayer || !L.map || !L.control){
			$.spopView({
				text: '地图初始化失败！'
			})
			return;
		}
		
		/*所有图层加载项*/
		var mapTiles = {
			'pano': {
				'url': configURL.baseMap,
	    		'name': '地图',
	    		'default': true
			},
			'yingxiang': {
				'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
	    		'name': '影像'
			},
			'world': {
	    		'url': "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
	    		'name': '世界地图'
			}/*,
			'track': {
	    		'url': 'http://10.11.5.75:20777/tile?lid=track_base&get=track&cache=off&isFilterBlackTrack=true&isFilterBlackTask=true&z={z}&x={x}&y={y}&t=1543817994295',
	    		'name': '轨迹层',
				'type': true,
	    		'default': true
			}*/
		};
		
		var defaults = [],
			layerList = {},
    		baseMaps = {},
    		overlayMaps = {};
    	
//  	新增初始化地图时，自带传过来的底图
    	/*if(param.url){
    		for(var s=0; s<param.url.length; s++){
    			let paramId = param.url[s].id,
    				paramName = param.url[s].name,
    				paramValue = param.url[s].value,
    				defaultType = param.url[s].defaultType;
    			mapTiles[paramId] = {
					'url': paramValue,
		    		'name': paramName,
					'type': true,
		    		'default': defaultType
    			}
    		}
    	}*/
    	
		for(var _id in mapTiles){
	    	var mapUrl = mapTiles[_id].url,
	    		mapName = mapTiles[_id].name,
	    		mapType = mapTiles[_id].type || false,
	    		_default = mapTiles[_id].default || false,
	    		mapChild;
	    	if(mapUrl.indexOf("switch")>=0){
	    		var urlString = 'switch:'+mapUrl.split('}')[0].split('switch:')[1];
	    		mapUrl = mapUrl.replace(urlString, "s");
	    	}
	    	if(_id == 'yingxiang'){
	    		mapChild = L.tileLayer.bing(mapUrl);
	    	}else{
	    		if(mapUrl.indexOf("{s}")>=0){
		    		mapChild = L.tileLayer(mapUrl, {id: _id, subdomains: [4006,4007,4008], maxZoom: 25});
	    		}else{
					mapChild = L.tileLayer(mapUrl, {id: _id, maxZoom: 25});
	    		}
				if( _default ){
					defaults.push(mapChild)
				}
	    	}
	    	layerList[_id] = {
	    		'name': mapName,
	    		'layer': mapChild,
	    		'type': mapType
	    	}
		}
		
	    for(var layers in layerList){
	    	var name = layerList[layers].name;
	    	if(layerList[layers].type){
	    		overlayMaps[name] = layerList[layers].layer;
	    	}else{
	    		baseMaps[name] = layerList[layers].layer;
	    	}
	    }
	    
		window.leafletMap = L.map('leafletMap', {
			drawControl: true,
			attributionControl: true,
		    center: [39.907218, 116.374145],
		    zoom: 10,
		    maxZoom: 25,
		    editable: true,
		    layers: defaults
//		    renderer : labelTextCollision
		});
		L.control.layers(baseMaps, overlayMaps).addTo(leafletMap);
		
		$.lineTileLayer = null;
    	if(param.url){
			$.lineTileLayer = L.tileLayer(param.url, {
				maxZoom: 25, 
				minZoom: 11
			}).addTo(leafletMap);
			/*$.lineTileLayer = L.tileLayer("http://192.168.5.34:{s}/tile?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540", {
				maxZoom: 25, 
				minZoom: 11,
				subdomains: ["10001", "10002", "10003"]
			}).addTo(leafletMap);*/
			$.lineTileLayer.setZIndex(222);
    	}
		
   		window.infoOpen = L.control();
		
//		右侧详细信息展示
		infoOpen.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'infoOpen');
			this.update();
			return this._div;
		};
	
		infoOpen.update = function (props) {
			this._div.innerHTML = '';
			for(var item in props){
				if(item != "trackids"){
					this._div.innerHTML += item+': '+ props[item] +'<br />';
				}
			}
		};
	
		infoOpen.addTo(leafletMap);
		
	    callback();
	};
	
	/*创建FORM表单模版*/
	$.createForm = function(param){
		var paramHtml = [];
		for(var d of param){
			var html_child = '',
				colClass = (d.small ? 'col-md-6' : 'col-md-12');
			if( d.data && !d.hide ){
				var selectData = d.data;
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<select class="form-control ${d.id}" style="float:left;">
				            <option value="">选择${d.name}</option>
			                ${selectData.map(s => `
				            	<option value="${s.value}" ${s.selected || ''}>${s.name}</option>
			                `).join('')}
			            </select>
					</div>
				`;
			}else if( (d.id == 'polygon') && !d.hide ){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<button type="button" class="btn btn-block btn-warning ${d.id}">绘制范围</button>
					</div>
				`;
			}else if( (d.type == 'time') && !d.hide ){
				var newTime = new Date();
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<div class='input-group date'>
			              	<div class="input-group-addon">
			                	<i class="fa fa-calendar"></i>
			              	</div>
			              	<input type="text" class="form-control pull-right time ${d.id}" name="${d.id}" value="" readonly>
						</div>
					</div>
				`;
			}else if( d.modal && !d.hide ){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<input type="text" class="form-control ${d.id}" placeholder="${d.name}" readonly>
					</div>
				`;
			}else if(!d.hide){
				html_child = `
					<div class='${colClass}'>
						<label>${d.name}：</label>
						<input type="text" class="form-control ${d.id}" placeholder="${d.name}" value="${d.value || ''}">
					</div>
				`;
			}
			paramHtml.push(html_child);
		}
		return paramHtml;
	};
	
	/*生成弹窗*/
	$.modalCreate = function(param, callback){
		var footerHtml = '';
		if( (param.id == 'littleModal') && callback){
			footerHtml = `
				<div class="modal-footer" style="border:none;">
					<button type="button" class="btn btn-success btnConfirm" title="确认">确认</button>
					<button type="button" class="btn btn-default btnCancel" title="取消">取消</button>
				</div>
			`;
		}
		var test =`
			<div class="modal ${param.id}" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
			  	<div class="modal-dialog" role="document">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close">
					          	<span aria-hidden="true">&times;</span>
					        </button>
				    		<h5 class="modal-title">${param.head}</h5>
				  		</div>
				    	${param.html}
				    	${footerHtml}
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(test);
		$('.testmodal .modal').fadeIn(200);
		$('.testmodal .modal .close').click(function(){
			$.modalClose();
			if(param.closeFn){
				param.closeFn();
			}
		})
		if($('.testmodal .modal .time').length){
//			日期选择器的语言修改为中文格式的
		    $('.testmodal .modal .time').datepicker({
		    	format: 'yyyy-mm-dd',
		    	autoclose: true,
		    	language: "zh-CN",
		    	todayBtn: true,
		    	todayHighlight: true,
		    	initialDate: new Date()
		    });
		}
//		面板生成完成时,有需要调用的函数则自动调用
		if(param._fn){
			param._fn();
		}
		$('.testmodal .modal-content .btnConfirm').click(function(){
			callback();
		})
		$('.testmodal .modal-content .btnCancel').click(function(){
			$.modalClose();
		})
	};
	// 生成弹窗 新ui 2021.5
	$.modalCreate_new = function(param, callback){
		var footerHtml = '',
		leftHtml = `<div class="modal-header">
		<button type="button" class="close" title="关闭" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<h5 class="modal-title">${param.head}</h5>
	  </div>			    
	${param.html}
	`;
		if( (param.id == 'littleModal') && callback){
			leftHtml = `${param.html}`;
			footerHtml = `
				<div class="modal-footer footer" style="border:none;height:100px">
					<button type="button" class="btn btn-success-new btnConfirm" title="确认">确认</button>
					<button type="button" class="btn btn-cancal-new btnCancel" title="取消">取消</button>
				</div>
			`;
		} 
	
		if(param.type == 'withLeftMenu'){
			leftHtml = `<div class="dialog-leftMenu" >${param._leftHtml}</div>	
			<div class="dialog-rightCnt" >	
				<div class="modal-header">
					<button type="button" class="close" title="关闭" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
					<h5 class="modal-title">${param.head}</h5>
				  </div>			    
				${param.html}
				</div>`;
		}
		var test =`
			<div class="modal ${param.id}" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
				  <div class="modal-dialog" role="document">
			    	<div class="modal-content" style='border-radius:10px;'>
					${leftHtml}
					${footerHtml}
			    	</div>
			  	</div>
			</div>
		`;
		$(param.domname).html(test);
		$(param.domname + ' .modal').fadeIn(200);
		$(param.domname + ' .modal .close').click(function(){
			$.modalClose_new(param.domname);
			if(param.closeFn){
				param.closeFn();
			}
		})

		if($(param.domname + ' .modal .time').length){
//			日期选择器的语言修改为中文格式的
		    $('.littlemodal .modal .time').datepicker({
		    	format: 'yyyy-mm-dd',
		    	autoclose: true,
		    	language: "zh-CN",
		    	todayBtn: true,
		    	todayHighlight: true,
		    	initialDate: new Date()
		    });
		}
//		面板生成完成时,有需要调用的函数则自动调用
		if(param._fn.length > 0){
			for(let i in param._fn){
				param._fn[i].fn(param._fn[i].param);
			}		
		}
		if(param.type == 'withLeftMenu' && param.leftListener && param.leftListener.fn){
			param.leftListener.fn(param.leftListener.param);
		}
		$(param.domname + ' .modal-content .btnConfirm').click(function(){
			callback();
		})
		$(param.domname + ' .modal-content .btnCancel').click(function(){
			$.modalClose_new(param.domname);
		})
	};
	$.mapLeaflet_new = function(param, callback){
	
		if( (typeof(L) == "undefined") || !L || !L.tileLayer || !L.map || !L.control){
			$.spopView({
				text: '地图初始化失败！'
			})
			return;
		}
		
		/*所有图层加载项*/
		var mapTiles = {
			'pano': {
				'url': configURL.baseMap,
	    		'name': '地图',
	    		'default': true
			},
			'yingxiang': {
				'url': 'https://ecn.{subdomain}.tiles.virtualearth.net/tiles/a{quadkey}.jpeg?g=587&mkt=en-gb&n=z',
	    		'name': '影像'
			},
			'world': {
	    		'url': "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
	    		'name': '世界地图'
			}/*,
			'track': {
	    		'url': 'http://10.11.5.75:20777/tile?lid=track_base&get=track&cache=off&isFilterBlackTrack=true&isFilterBlackTask=true&z={z}&x={x}&y={y}&t=1543817994295',
	    		'name': '轨迹层',
				'type': true,
	    		'default': true
			}*/
		};
		
		var defaults = [],
			layerList = {},
    		baseMaps = {},
    		overlayMaps = {};
    	
//  	新增初始化地图时，自带传过来的底图
    	/*if(param.url){
    		for(var s=0; s<param.url.length; s++){
    			let paramId = param.url[s].id,
    				paramName = param.url[s].name,
    				paramValue = param.url[s].value,
    				defaultType = param.url[s].defaultType;
    			mapTiles[paramId] = {
					'url': paramValue,
		    		'name': paramName,
					'type': true,
		    		'default': defaultType
    			}
    		}
    	}*/
    	
		for(var _id in mapTiles){
	    	var mapUrl = mapTiles[_id].url,
	    		mapName = mapTiles[_id].name,
	    		mapType = mapTiles[_id].type || false,
	    		_default = mapTiles[_id].default || false,
	    		mapChild;
	    	if(mapUrl.indexOf("switch")>=0){
	    		var urlString = 'switch:'+mapUrl.split('}')[0].split('switch:')[1];
	    		mapUrl = mapUrl.replace(urlString, "s");
	    	}
	    	if(_id == 'yingxiang'){
	    		mapChild = L.tileLayer.bing(mapUrl);
	    	}else{
	    		if(mapUrl.indexOf("{s}")>=0){
		    		mapChild = L.tileLayer(mapUrl, {id: _id, subdomains: [4006,4007,4008], maxZoom: 25});
	    		}else{
					mapChild = L.tileLayer(mapUrl, {id: _id, maxZoom: 25});
	    		}
				if( _default ){
					defaults.push(mapChild)
				}
	    	}
	    	layerList[_id] = {
	    		'name': mapName,
	    		'layer': mapChild,
	    		'type': mapType
	    	}
		}
		
	    for(var layers in layerList){
	    	var name = layerList[layers].name;
	    	if(layerList[layers].type){
	    		overlayMaps[name] = layerList[layers].layer;
	    	}else{
	    		baseMaps[name] = layerList[layers].layer;
	    	}
	    }
	     let leafletMap = L.map(param.leafletMap, {
			drawControl: true,
			attributionControl: true,
		    center: [39.907218, 116.374145],
		    zoom: 10,
		    maxZoom: 25,
		    editable: true,
		    layers: defaults
//		    renderer : labelTextCollision
		});
		L.control.layers(baseMaps).addTo(leafletMap);
		
		$.lineTileLayer = null;
    	if(param.url){
			$.lineTileLayer = L.tileLayer(param.url, {
				maxZoom: 25, 
				minZoom: 11
			}).addTo(leafletMap);
			/*$.lineTileLayer = L.tileLayer("http://192.168.5.34:{s}/tile?lid=collection_link&get=collection_link&cache=off&offset=false&z={z}&x={x}&y={y}&t=1555465051540", {
				maxZoom: 25, 
				minZoom: 11,
				subdomains: ["10001", "10002", "10003"]
			}).addTo(leafletMap);*/
			$.lineTileLayer.setZIndex(222);
    	}
		
   		let infoOpen = L.control();
		
//		右侧详细信息展示
		infoOpen.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'infoOpen');
			this.update();
			return this._div;
		};
	
		infoOpen.update = function (props) {
			this._div.innerHTML = '';
			for(var item in props){
				if(item != "trackids"){
					this._div.innerHTML += item+': '+ props[item] +'<br />';
				}
			}
		};
	
		infoOpen.addTo(leafletMap);

		window[param.leafletMap] = leafletMap;
		window[param.infoOpen] = infoOpen;
		
	    callback();
	};
	/*生成弹窗*/
	$.viewModalCreate = function(param, callback){
		var test =`
			<div class="modal littleModal" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel">
			  	<div class="modal-dialog" role="document">
			    	<div class="modal-content">
				    	<div class="modal-header">
					        <button type="button" class="close" title="关闭" aria-label="Close">
					          	<span aria-hidden="true">&times;</span>
					        </button>
				    		<h5 class="modal-title">${param.head}</h5>
				  		</div>
				    	${param.html}
						<div class="modal-footer" style="border:none;">
							<button type="button" class="btn btn-success btnConfirm" title="确认">确认</button>
							<button type="button" class="btn btn-default btnCancel" title="取消">取消</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.viewModal').html(test);
		$('.viewModal .modal').fadeIn(200);
		$('.viewModal .modal .close').click(function(){
			$.modalClose();
		})
		if($('.viewModal .modal .time').length){
//			日期选择器的语言修改为中文格式的
		    $('.viewModal .modal .time').datepicker({
		    	format: 'yyyy-mm-dd',
		    	autoclose: true,
		    	language: "zh-CN",
		    	todayBtn: true,
		    	todayHighlight: true,
		    	initialDate: new Date()
		    });
		}
//		面板生成完成时,有需要调用的函数则自动调用
		if(param._fn){
			param._fn();
		}
		$('.viewModal .modal-content .btnConfirm').click(function(){
			callback();
		})
		$('.viewModal .modal-content .btnCancel').click(function(){
			$.modalClose();
		})
	};
	
	/*弹窗子列表选择*/
	$.modalPicker = function(param){
        var rectTop = param.rect.top + param.rect.height,
        	rectLeft = param.rect.left;
        var styleJson = 'display:block;left:'+rectLeft+'px;top:'+rectTop+'px;width:400px;z-index:10000;';
		var testModel = `
			<div class='mod_list_city engine_list' style='${styleJson}'>
				<div id='div_city_list' class='list_wrap' style='width:378px;'>
					<div class='city_cont' style='width:378px;'>
						<h4 style='font-weight: bold;'>${param.head}：</h4>
						<div class='engineRight'></div>
						<table class='mod_city_list'>
							<tbody>
								<tr>
									<td>
			                			${param.data.map(d => `
											<a name='${d.id}' href='javascript:void(0)'>${d.name}</a>
			                			`).join('')}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		`;
		$('.modalPicker').html(testModel);
		$('.modalPicker').css('display','block');
		$('.modalPicker .engine_list').click(function(e){
			if( e.target.nodeName == 'A' ){
				param.callback({
					'name': e.target.innerText,
					'id': e.target.name
				})
				$('.modalPicker').css('display','none');
			}
		})
		$('.modalPicker .engine_list').mouseleave(function(e){
			$('.modalPicker').css('display','none');
		})
	};
	
	/*关闭弹窗*/
	$.modalClose = function(){
		$('.testmodal .modal').fadeOut(200);
		$('.viewModal .modal').fadeOut(200);
	};
	/*关闭弹窗*/
	$.modalClose_new= function(dom){
		$(dom + ' .modal').fadeOut(200);
		$('.viewModal .modal').fadeOut(200);
	};
	$.geoPolygon_new = function(polygonsArr){
		polygonsArr.map(el => {
			return el.type.toUpperCase() + '((' +
				el.coordinates.map(el_1 => {
					return el_1.map(el_2 => {
						return el_2.join(' ')
					}).join(',')
				}) + '))'
		})
	}
	$.geoPolyline_new = function(collectionLinks){
		collectionLinks.map(el => {
			return el.geometry.type.toUpperCase() + '((' +
				el.geometry.coordinates.map(el_1 => {
					return el_1.map(el_2 => {
						return el_2.join(' ')
					}).join(',')
				}) + '))'
		})
	}

	/*将坐标数组转为字符串*/
	$.geoPolygon = function(layer){
		var latlngs = [];
		for(var i=0; i<layer.length; i++){
			latlngs.push(layer[i])
		}
		if(latlngs[0] !== latlngs[latlngs.length-1]){
			latlngs.push( latlngs[0] );
		}
	    var xys =[];
	    var geo='';
        for(var i=0; i<latlngs.length; i++){
            xys.push(latlngs[i].lng+" "+latlngs[i].lat);
        }
        geo = xys.join(',');
	    return geo;
	};

	//  10-处理任务的可视化范围range格式化polygon
    $.leafletRange = function(range,type=false){
		if( !range || (range.indexOf("POLYGON") < 0) ){
			return [];
		}
		if(range.indexOf("POLYGON ((") < 0){
			var replaces = range.replace("POLYGON((","").replace("))","");
			var Coordinate = replaces.split(",");
		}else{
			var replaces = range.replace("POLYGON ((","").replace("))","");
			var Coordinate = replaces.split(", ");
		}
//		添加任务范围显示
		var locs = [];
		for(var i=0; i<Coordinate.length; i++){
			var strs1 = Coordinate[i].trim(),
				strs2 = strs1.split(" ");
			if(type){
				var loc = [Number(strs2[0]), Number(strs2[1])]; 								//定义一数组 
			}else{
				var loc = [Number(strs2[1]), Number(strs2[0])]; 								//定义一数组 
			}
			locs.push(loc);
		}
	    return locs;
    };
	
	/*根据覆盖物ID删除对应覆盖物*/
	$.mapRemove = function(id){
    	var mapLayer = leafletMap.editTools.featuresLayer._layers[id] || leafletMap._layers[id];
		if( mapLayer ){
			mapLayer.remove();
		}
	};
		/*根据覆盖物ID删除对应覆盖物*/
		$.mapRemove_new = function(id,mapName){
			let leafletMap =  window[mapName];
			var mapLayer = leafletMap.editTools.featuresLayer._layers[id] || leafletMap._layers[id];
			if( mapLayer ){
				mapLayer.remove();
			}
		};
	
	/*使用spop插件提示框*/
	$.spopView = function(param){
		let _style = param.type ? 'success' : 'error';
		spop({
			template: param.text || '系统异常',
			style: _style,
			position  : 'top-center',
			autoclose: 3000
		});
	};
	
    /**
     * 判断点是否在矩形内
     * @param point = {lng:'',lat:''} 点对象
     * @param ext 矩形边任意【对角】点的经纬度数组对象 即拉框起点坐标和结束点经纬度坐标
     * @returns {Boolean} 点在矩形内返回true,否则返回false
     */
    $.isPointInRect = function(point, ext){
		//拉框起点坐标和结束点经纬度坐标
        var x1 = ext[0][0], y1 = ext[0][1]; 
        var x2 = ext[1][0], y2 = ext[1][1];
		//线与边没有相交
        var Xmin = Math.min(x1, x2);
        var Xmax = Math.max(x1, x2);
        var Ymin = Math.min(y1, y2);
        var Ymax = Math.max(y1, y2);
        
        //西南脚点
        var sw = {
        		lng: Xmin,
        		lat: Ymin
        };
        //东北脚点
        var ne = {
        		lng: Xmax,
        		lat: Ymax
        }; 
        return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
    };

	$.isJSON4object  = function(obj){
		return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		
	};
	
	
})(jQuery);