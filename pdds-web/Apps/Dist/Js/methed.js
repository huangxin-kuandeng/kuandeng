
(function ($) {
	
	/*获取localStorage数据*/
	$.getLocalStorage = function(name){
		var _name = window.localStorage.getItem(name) || null;
		return _name;
	};
	
	/*存储localStorage数据*/
	$.setLocalStorage = function(name,data){
		var value = JSON.stringify(data);
		window.localStorage.setItem(name,value);
	};
	
	/*删除localStorage数据*/
	$.removeLocalStorage = function(name,data){
		window.localStorage.removeItem(name);
	};
	
    /*获取地址栏参数*/
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");     	//构造一个含有目标参数的正则表达式对象
        var location = window.location.search || window.location.hash || '';
        var r = location.substr(1).match(reg);          				//匹配目标参数
        if( name == 'name' || name == 'n' ){
            if (r != null) return decodeURI(r[2]); return null;        //中文名显示
        }
        if (r != null) return unescape(r[2]); return null;             //返回参数值
    }
	
	/*获取cookie数据*/
	$.getCookie = function(name){
		
        var _name = window.localStorage.getItem(name) || null;
        return _name;
		
		if(document.cookie.length > 0){
  			var c_start=document.cookie.indexOf(name + '=');
			if (c_start != -1){ 
			    c_start = c_start + name.length + 1;
			    var c_end = document.cookie.indexOf(';', c_start);
			    if(c_end == -1){
			    	c_end = document.cookie.length;
			    }
			    return unescape(document.cookie.substring(c_start,c_end));
			} 
		}
		return null;
	};
	
	/*设置cookie数据*/
	$.setCookie = function(data){
		
        window.localStorage.setItem(data.name, data.value);
        return
		
		var expires_hour = data.time || 8,			//失效时间
			cookie_value = data.value,
			cookie_name = data.name,
			new_data = new Date();
		
		$.removeCookie(cookie_name);
		new_data.setTime(new_data.getTime() + expires_hour*60*60*1000);
		
		if(window.cookie_type){
			document.cookie = cookie_name + '='+ escape (cookie_value) + '; path=/; domain=' +config_url.cookie+ '; expires=' + new_data.toGMTString();
		}else{
			document.cookie = cookie_name + '='+ escape (cookie_value) + '; path=/; expires=' + new_data.toGMTString();
		}
		
	};
	
	/*删除cookie数据*/
	$.removeCookie = function(name){
		
		window.localStorage.removeItem(name);
		return
		
		var _expires = new Date(),
			cookie_value = $.getCookie(name);
		_expires.setTime(_expires.getTime() - 1);
		if(cookie_value){
			if(window.cookie_type){
				document.cookie = name+'='+cookie_value+'; path=/; domain=' +config_url.cookie+ '; expires='+_expires.toGMTString();
			}else{
				document.cookie = name+'='+cookie_value+'; path=/; expires='+_expires.toGMTString();
			}
		}
	};
	
	/*错误提示信息*/
	$.errorView = function(view,type=false){
		console.warn(view);
		
		let _style = type ? 'success' : 'error';
		spop({
			template: view || '系统异常',
			style: _style,
			position  : 'top-center',
			group     : view,
			autoclose: 2000
		});
	};
	
	/*根据token请求图片*/
	$.getImageToken = function(dom, url,callback=false){
		var token = $.getCookie('token') || '';
		if(!token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		
		if(window.cookie_type && !callback){
			dom[0].src = url;
			return;
		}
		
	    let request = new XMLHttpRequest();
	    request.responseType = 'blob';
	    request.open('get', url, true);
	    request.setRequestHeader('Authorization', token);
	    request.onreadystatechange = e => {
	        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
	        	if(callback){
	        		callback(request);
	        	}else{
		            dom[0].src = URL.createObjectURL(request.response);
		            dom[0].onload = () => {
		                URL.revokeObjectURL(dom[0].src);
		            }
	        	}
	        }
	    };
	    request.send(null);
	};
	
	/*ajax-get-请求接口数据*/
	$.getAjax = function(forms){
		var token = $.getCookie('token') || '',
			token_type = forms.token || false,
			cookie = {
				'Authorization': token
			};
		if(!token && !forms.token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		if(window.cookie_type){
			// cookie = {};
		}
    	$.ajax( {
        	type : 'GET',
	        url : forms.url,
	        async : true,
	        data : {},
	        headers: cookie,
	        xhrFields: {
	        	withCredentials: true
        　　},
	        success : function(data) {
				$.indexToLogin(data);
	        	forms.callback(data);
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$('#loading').css('display','none');
		   		console.log(XMLHttpRequest.status+'---'+XMLHttpRequest.readyState+'---'+textStatus);
	            $.errorView('系统异常');
		   	},
	    });
	};
	
	$.indexToLogin = function(data){
		if(data && data.code == '10004'){
			$.errorView('权限校验-token已过期！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
	};
	
	/*ajax-get-请求接口数据*/
	$.getAjaxNoToken = function(forms){
    	$.ajax( {
        	type : 'GET',
	        url : forms.url,
	        async : true,
	        data : {},
	        xhrFields: {
	        	withCredentials: true
        　　},
	        success : function(data) {
                $.indexToLogin(data);
	        	forms.callback(data);
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				$('#loading').css('display','none');
		   		console.log(XMLHttpRequest.status+'---'+XMLHttpRequest.readyState+'---'+textStatus);
	            $.errorView('系统异常');
		   	},
	    });
	};
	
	/*ajax-post-请求接口数据*/
	$.postAjax = function(forms){
		var token = $.getCookie('token') || '',
			token_type = forms.token || false,
			cookie = {
				'Authorization': token
			};
		if(!token && !forms.token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		if(window.cookie_type){
			// cookie = {};
		}
	    $.ajax( {
	        type : 'POST',
	        url : forms.url,
        	async : true,
			contentType: 'application/json; charset=utf-8',
	        data : JSON.stringify(forms.data),
	        headers: cookie,
	        xhrFields: {
	        	withCredentials: true
        　　},
	        success : function(data) {
                $.indexToLogin(data);
	        	forms.callback(data);
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$('#loading').css('display','none');
		   		console.log(XMLHttpRequest.status+'---'+XMLHttpRequest.readyState+'---'+textStatus);
	            $.errorView('系统异常');
	        }
	    });
	};
	
	/* GEOJSON格式转换 */
	$.geoJsonParam = function(param){
		let range = param.range,
			properties = param.properties || {},
			type = param.type,
			id = param.id,
			weight = param.weight || 2,
			color = param.color || "#EC3A4E",
			opacity = param.opacity || 1,
			dash = param.dash || false,
			locs = $.cesium_range(range),
			newLocs = [];
		
		locs.forEach(d=>{
			newLocs.push([
				d[0], d[1]
			])
		})
		
		var geoJson = {
			'type': 'Feature',
			'id': id,
			'properties': {
				'ID': properties.ID || '',
				'TYPE': properties.TYPE || '',
				'datas': param.datas || {},
				'color': color,
				'weight': weight,
				'opacity': opacity
			},
			'geometry': {
				'type': type,
				'coordinates': [
					newLocs
				]
			}
		}
		
		if(type == 'Polyline'){
			geoJson.geometry = {
				'type': 'LineString',
				'coordinates': newLocs
			}
		}
		return geoJson;
	};
	
	/*新增形状区分-根据type类型变化*/
	$.add_layer = function(data){
		var type = 'Polygon',
			_layer = null;
		
		if(data && data.result){
			type = data.layer_type || data.result.properties.layer_type || 'Polygon';
		}
		if(!window._viewer){
			return null;
		}
		
		if(type == 'Point'){
			_layer = $.add_billboard(data, true);
			// _layer = $.add_point(data);
		}else if(type == 'Polygon'){
			_layer = $.add_polygon(data);
		}else if(type == 'Polyline'){
			_layer = $.add_polyline(data);
		}else if(type == 'Circle'){
			_layer = $.add_circle(data);
		}
		return _layer;
	};
	
	/*新增polygon多边形*/
	$.add_polygon = function(data = {}){
		var position_type = data.type || '',
			data_type = data.data_type || '',
			properties = data.result.properties,
			locs = properties.locs,
			coordinates = data.result.geometry ? data.result.geometry.coordinates[0] : [],
			geometry = locs.length ? locs : coordinates;
		// ROAD_MARK opacity
		if(!geometry || !geometry.length){
			$.errorView('坐标数据有误，请查验');
			return;
		}
		var locs = [],
			_color = data.color || Cesium.Color.RED,
			new_color = _color.withAlpha(0.4),
			line_color = _color;
		
		if(data.result.properties.data_type == '703'){
			new_color = _color.withAlpha(0.01);
			line_color = Cesium.Color.RED.withAlpha(0.01);
		}
		
		for(var i=0; i<geometry.length; i++){
			var _x = Number(geometry[i][0]) || 0,
				_y = Number(geometry[i][1]) || 0,
				_z = Number(geometry[i][2]) || 0,
				new_z = _z + config_url.z_height;
//			geometry[i][2] = new_z;
			locs.push( _x,_y,new_z );
//			locs.push( _x,_y );
		}
		
        var positions = Cesium.Cartesian3.fromDegreesArrayHeights(locs);
//      var positions = Cesium.Cartesian3.fromDegreesArray(locs);
        var polygon = new Cesium.Entity({
            name: properties.LINK_NAME || '',
            position_type: position_type,
			data_type: data_type,
            datas: properties,
			center: properties.center_xy,
            nodes: geometry,
			id: properties.new_ID || properties.ID || '',
		    data_id: properties.ID || '',
            polygon:{
                hierarchy: positions,						//多边形的经纬度,
//              classificationType: 1,
                perPositionHeight : false,					//z值，是否执行距离地面的高度
				height: 0,									//距离地表高度
//              extrudedHeight: 21000,
                fill: true,									//是否填充
//              arcType: Cesium.ArcType.RHUMB,				//线条类型
                material: new_color,						//填充颜色
                outline: true,								//是否有外边线
                outlineWidth: 2,							//外边线宽度
                outlineColor: line_color					//外边线颜色
            },
		    label: {
		        text: properties.LINK_NAME || '',
		        font: '12px',
				show: data.showLabel || false,
		        verticalOrigin: Cesium.VerticalOrigin.CENTER,
				scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
		        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
		    }
        });
        _viewer.entities.add(polygon);
        return polygon;
	};
	
	/*新增polyline线*/
	$.add_polyline = function(data = {}){
		var properties = data.result.properties,
			remove_type = data.remove_type || false,
			line_color = data.result.line_color || '#FF4057',
			line_dash = data.result.line_dash || false,
			geometry = properties.locs;
		
		if(!geometry || !geometry.length){
			$.errorView('坐标数据有误，请查验');
			return;
		}
		
		var locs = [];
		for(var i=0; i<geometry.length; i++){
			var _x = geometry[i][0] || 0,
				_y = geometry[i][1] || 0,
				_z = geometry[i][2] || 0;
			
			locs.push( _x, _y );
			// locs.push( _x,_y,_z );
		}
		
		var color = Cesium.Color.fromCssColorString(line_color);
		var material = color;
		if(line_dash){
			material = new Cesium.PolylineDashMaterialProperty({
				color: color,
				dashLength: 10.0
			});
		}
        var positions = Cesium.Cartesian3.fromDegreesArray(locs);
        // var positions = Cesium.Cartesian3.fromDegreesArrayHeights(locs);
		
		
        var polyline = new Cesium.Entity({
            name: properties.LINK_NAME || '',
            datas: properties,
			remove_type: remove_type,
			id: properties.new_ID || properties.ID || '',
		    data_id: data.result.id || properties.ID || '',
			data_type: 'polyline',
            polyline : {
                show : true,
				width: 1,
                positions : positions,
				// zIndex: 1000,
                material : material
            },
		    label: {
		        text: properties.LINK_NAME || '',
		        font: '12px',
				show: data.showLabel || false,
		        verticalOrigin: Cesium.VerticalOrigin.CENTER,
				scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
		        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
		    }
        });
        _viewer.entities.add(polyline)
        return polyline;
	};
	
	/*新增billboards图标点*/
	$.add_billboard = function(data = {}, type){
		var position_type = data.type || '',
			data_type = data.data_type || '',
			show_type = data.show_type ? false : true,
			remove_type = data.remove_type || false,
			verticalOrigin = data.verticalOrigin || false,
			width = position_type ? 36 : 20,
			height = position_type ? 36 : 22,
			id = position_type ? 'position_type' : '',
			properties = data.result.properties,
			layer_type = properties.TYPE || 'icon',
			mark_type = data.mark_type || '',
			icon_url = data.result.icon_url || './Apps/Dist/Img/icon.png',
			icon_active_url = data.result.icon_active_url || './Apps/Dist/Img/icon_active.png',
			geometry = data.result.geometry ? data.result.geometry[0] : data.result.properties.center_xy,
			height_z = geometry[2] || 0;
			_z = height_z + config_url.z_height;
		
		width = data.width || width;
		height = data.height || height;
		
		if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION' && type){
			var image_split = '';
			if(layer_type == 707){
				image_split = '707_' + properties.SUBTYPE;
			}else{
				image_split = layer_type;
			}
			icon_url = './Apps/Dist/Img/asset_icon/' + image_split +  '.png';
			icon_active_url = './Apps/Dist/Img/asset_icon/' + image_split +  '_active.png';
		}
		
		if(!geometry || !geometry.length){
			$.errorView('坐标数据有误，请查验');
			return;
		}
		
		// var positions = Cesium.Cartesian3.fromDegrees(geometry[0],geometry[1]);
        var positions = Cesium.Cartesian3.fromDegrees(geometry[0],geometry[1],height_z);
        
        var billboard = new Cesium.Entity({
            name: properties.LINK_NAME || '',
			default_url: icon_url,
			active_url: icon_active_url,
            datas: properties,
            position_type: position_type,
			remove_type: remove_type,
            data_type: data_type,
            mark_type: mark_type,
            center: geometry,
			show: show_type,
			id: id || properties.new_ID || properties.ID || '',
		    data_id: properties.ID || '',
            position: positions,
	        billboard : {
	            image : icon_url,
	            width: width,
	            height: height,
				zIndex: 1000,
            	verticalOrigin : verticalOrigin ? Cesium.VerticalOrigin.BASELINE : Cesium.VerticalOrigin.CENTER,
	            disableDepthTestDistance: Number.POSITIVE_INFINITY,		//0
	            pixelOffset: verticalOrigin ? new Cesium.Cartesian2(5, 5) : Cesium.Cartesian2.ZERO,
	            scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
	        }
        });
        _viewer.entities.add(billboard);
        
//      billboard.position = _viewer.scene.clampToHeight(positions, billboard)
//      billboard.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        
        return billboard;
	};
	
	/*新增分组聚类图标点*/
	$.add_group_billboard = function(data = {}){
		var height =  data.links.length * 10,
			// center = Cesium.Cartesian3.fromDegrees(data.positions[0], data.positions[1], data.height);
			center = Cesium.Cartesian3.fromDegrees(data.positions[0], data.positions[1]);
		var myLabelEntity = _viewer.entities.add({
		    position: center,
            center: data.positions,
			id: data.mp_code,
			point_length: data.links.length,
	        icon_length: data.icon_length,
		    properties: data.properties,
			show: false,
	        billboard : {
				show: false,
	            image : data.icon_url,
	            width: data.width,
	            color: null,
	            height: 32
	        },
			label: {
			    font: '14px Hiragino Sans GB,PingFang SC,Microsoft YaHei,Heiti SC',
				verticalOrigin: 0,
			    horizontalOrigin: 0,
				// heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
				// disableDepthTestDistance: Number.POSITIVE_INFINITY,
			    text: (data.links.length + '例'),
			    // text: `<span class='class_1'>例子例子</span>`,
		   		// eyeOffset: new Cesium.Cartesian3(0.0, 0.0, -10),
			    
                showBackground : true,
                backgroundColor: Cesium.Color.fromCssColorString('#EC3A4E'),
                backgroundPadding: new Cesium.Cartesian2(10, 5)
		  	}
       	});
        return myLabelEntity;
	};
	
	/*新增point点*/
	$.add_point = function(data = {}){
		var properties = data.result.properties,
			geometry = data.result.geometry.coordinates[0];
		
		if(!geometry || !geometry.length){
			$.errorView('坐标数据有误，请查验');
			return;
		}
		
        var positions = Cesium.Cartesian3.fromDegrees(geometry[0],geometry[1]);
        var point = new Cesium.Entity({
            name: properties.LINK_NAME || '',
            datas: properties,
			id: properties.ID || '',
		    data_id: properties.ID || '',
            position: positions,
            point: {
                color: data.color || Cesium.Color.RED,
                pixelSize: 5,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            },
		    label: {
		        text: properties.LINK_NAME || '',
		        font: '12px',
				show: data.showLabel || false,
		        verticalOrigin: Cesium.VerticalOrigin.CENTER,
				scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
		        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
		    }
        });
        _viewer.entities.add(point)
        return point;
	};
	
	/*新增circle圆*/
	$.add_circle = function(data = {}){
		var properties = data.result.properties,
			geometry = data.result.geometry.coordinates[0];
		
		if(!geometry || !geometry.length){
			$.errorView('坐标数据有误，请查验');
			return;
		}
		
        var positions = Cesium.Cartesian3.fromDegrees(geometry[0],geometry[1]);
        var circle = new Cesium.Entity({
            name: properties.LINK_NAME || '',
            datas: properties,
			id: properties.ID || '',
		    data_id: properties.ID || '',
		    position: positions,
		    ellipse: {
		        semiMinorAxis : 300.0,
		        semiMajorAxis : 300.0,
//		        height: 200000.0, 				//浮空
		        material : Cesium.Color.GREEN.withAlpha(0.6)
		    },
		    label: {
		        text: properties.LINK_NAME || '',
		        font: '12px',
				show: data.showLabel || false,
		        verticalOrigin: Cesium.VerticalOrigin.CENTER,
				scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
		        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
		    }
        });
        _viewer.entities.add(circle)
		return circle;
	};
	
	/*cesium获取当前视野bounds*/
	$.getBounds = function(){
		// 范围对象
		var extent = {};
		
		// 得到当前三维场景
		var scene = _viewer.scene;
		
		// 得到当前三维场景的椭球体
		var ellipsoid = scene.globe.ellipsoid;
		var canvas = scene.canvas;
		var client_rect = canvas.getBoundingClientRect();
		// canvas左上角
		var car3_lt = _viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0, 0), ellipsoid);
		// canvas右下角
		var car3_rb = _viewer.camera.pickEllipsoid(new Cesium.Cartesian2(client_rect.width,client_rect.height), ellipsoid);
		// 当canvas左上角和右下角全部在椭球体上
		if (car3_lt && car3_rb) {
			var carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
			var carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
			extent.east = Cesium.Math.toDegrees(carto_lt.longitude);
			extent.north = Cesium.Math.toDegrees(carto_lt.latitude);
			extent.west = Cesium.Math.toDegrees(carto_rb.longitude);
			extent.south = Cesium.Math.toDegrees(carto_rb.latitude);
		}
		// 当canvas左上角不在但右下角在椭球体上
		else if (!car3_lt && car3_rb) {
			var car3_lt2 = null;
			var yIndex = 0;
			do {
				// 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
				yIndex <= canvas.height ? yIndex += 10 : canvas.height;
				car3_lt2 = viewer.camera.pickEllipsoid(new Cesium.Cartesian2(0,yIndex), ellipsoid);
			}while (!car3_lt2);
			var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
			var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
			extent.east = Cesium.Math.toDegrees(carto_lt2.longitude);
			extent.north = Cesium.Math.toDegrees(carto_lt2.latitude);
			extent.west = Cesium.Math.toDegrees(carto_rb2.longitude);
			extent.south = Cesium.Math.toDegrees(carto_rb2.latitude);
		}
		
		return extent;
		
		
		
		
		
		
		
		
		var pt0 = $('#cesium_map')[0].getBoundingClientRect();
		var pt1 = new Cesium.Cartesian2(pt0.top, pt0.left);
		// var pt2 = new Cesium.Cartesian2(pt0.right - pt0.left, pt0.height);
		var pt2 = new Cesium.Cartesian2(pt0.width - pt0.left / 2, pt0.height / 2 + 100);
		 
		var pick1= _viewer.scene.globe.pick(_viewer.camera.getPickRay(pt1), _viewer.scene);
		var pick2= _viewer.scene.globe.pick(_viewer.camera.getPickRay(pt2), _viewer.scene);
		 
		 if(!pick1 || !pick2){
			 return;
		 }
		 
		//将三维坐标转成地理坐标
		var geoPt1= _viewer.scene.globe.ellipsoid.cartesianToCartographic(pick1);
		var geoPt2= _viewer.scene.globe.ellipsoid.cartesianToCartographic(pick2);
		 
		//地理坐标转换为经纬度坐标
		var point1=[geoPt1.longitude / Math.PI * 180, geoPt1.latitude / Math.PI * 180];
		var point2=[geoPt2.longitude / Math.PI * 180, geoPt2.latitude / Math.PI * 180];
		var bounds = {
			'west': point1[0],
			'south': point1[1],
			'east': point2[0],
			'north': point2[1]
		}
		return bounds;
		
		var rectangle = _viewer.camera.computeViewRectangle();
		// 弧度转为经纬度，west为左（西）侧边界的经度，以下类推
		var west =rectangle.west / Math.PI * 180;
		var north = rectangle.north / Math.PI * 180;
		var east = rectangle.east / Math.PI * 180;
		var south = rectangle.south / Math.PI * 180;
		var bounds = {
			'west': west,
			'south': south,
			'east': east,
			'north': north
		}
		return bounds;
	};
	
	/*判断点是否在矩形内*/
    $.isPointInRect = function(point, ext){
		//拉框起点坐标和结束点经纬度坐标
        var x1 = ext.east, y1 = ext.north; 
        var x2 = ext.west, y2 = ext.south;
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
	
	
	/*计算a点和b点的角度*/
	$.transform = function(lng, lat) {
	    var Rc = 6378137;
	    var Rj = 6356725;
	    var LoDeg = lng;
	    var LoMin = (lng - LoDeg) * 60;
	    var LoSec = (lng - LoDeg - LoMin / 60.) * 3600;
	
	    var LaDeg = lat;
	    var LaMin = (lat - LaDeg) * 60;
	    var LaSec = (lat - LaDeg - LaMin / 60.) * 3600;
	
	    var Longitude = lng;
	    var Latitude = lat;
	    var RadLo = lng * Math.PI / 180.;
	    var RadLa = lat * Math.PI / 180.;
	    var Ec = Rj + (Rc - Rj) * (90. - Latitude) / 90.;
	    var Ed = Ec * Math.cos(RadLa);
	    var result = {"RadLo":RadLo,"RadLa":RadLa,"Ec":Ec,"Ed":Ed,"Longitude":Longitude,"Latitude":Latitude};
	    return result;
	}
	$.courseAngle = function(lngA, latA, lngB, latB) {
	    var A = $.transform(lngA,latA);
	    var B = $.transform(lngB,latB);
	    var dx=(B.RadLo-A.RadLo)*A.Ed;
	    var dy=(B.RadLa-A.RadLa)*A.Ec;
	    var angle=0.0;
	    angle=Math.atan(Math.abs(dx/dy))*180./Math.PI;
	    // angle = _.isNaN(angle)?0:angle;
	    var dLo=B.Longitude-A.Longitude;
	    var dLa=B.Latitude-A.Latitude;
	    if(dLo>0&&dLa<=0){
	        angle=(90.-angle)+90;
	    }
	    else if(dLo<=0&&dLa<0){
	        angle=angle+180.;
	    }else if(dLo<0&&dLa>=0){
	        angle= (90.-angle)+270;
	    }
	    return (360 - angle);
	}
	
	
	/*根据坐标点计算重心点坐标*/
	$.getPointsCenter = function(points, way=false){
		if(points.length < 3){
			var x_y = way ? points[0] : points[0].center_xy;
			return x_y;
		}
	    var sum_x = 0;
	    	sum_y = 0;
	    	sum_area = 0;
	    	p1 = way ? points[1] : points[1].center_xy,
	    	p0 = way ? points[0] : points[0].center_xy;
	    for (var i = 2; i < points.length; i++) {
	        var p2 = way ? points[i] : points[i].center_xy,
	        	area = p0[0] * p1[1] + p1[0] * p2[1] + p2[0] * p0[1] - p1[0] * p0[1] - p2[0] * p1[1] - p0[0] * p2[1],
	        	new_area = area / 2;
	        
	        sum_area += area;
	        sum_x += (p0[0] + p1[0] + p2[0]) * area;
	        sum_y += (p0[1] + p1[1] + p2[1]) * area;
	        p1 = p2;
	    }
	    var xx = sum_x / sum_area / 3;
	    var yy = sum_y / sum_area / 3;
	    return [xx, yy];
	};
	
	/*根据两点之间的距离*/
	$.getDistance = function( point_1, point_2){
	    var radLat1 = point_1[1] * Math.PI / 180.0;
	    var radLat2 = point_2[1] * Math.PI / 180.0;
	    var a = radLat1 - radLat2;
	    var  b = point_1[0] * Math.PI / 180.0 - point_2[0] * Math.PI / 180.0;
	    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
	    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b/2),2)));
	    return s;
	};
	
	/*positions 包含两个点的数组--计算两点之间距离*/
	$.disTance = function(param){
		var point1cartographic = Cesium.Cartographic.fromDegrees(param.lat1, param.lng1);
		var point2cartographic = Cesium.Cartographic.fromDegrees(param.lat2, param.lng2);
		var geodesic = new Cesium.EllipsoidGeodesic();
		geodesic.setEndPoints(point1cartographic, point2cartographic);
		var s = geodesic.surfaceDistance || 0;
		return s;
	};
	
	/*基于一个坐标点,计算数组坐标内距离当前点最近的坐标*/
	$.getNearPointList = function(point, list){
		var distance_data = null,
			distance = null;
		list.forEach(function (data) {
			var param = {
					"lat1": point[0],
					"lng1": point[1],
					"lat2": data.x,
					"lng2": data.y
				},
				balance = $.disTance(param);
			if(!distance){
				distance = balance;
				distance_data = data;
			}else if(distance > balance){
				distance = balance;
				distance_data = data;
			}
		});
		return distance_data;
	};
	
	/*根据一组坐标,计算坐标中距离中心点最近的坐标点*/
	$.getNearPoint = function(points){
		var _center = $.getPointsCenter(points),
			near_point = null,
			center_point = null;
		for(var i=0; i<points.length; i++){
			var point = points[i].center_xy,
				near = $.getDistance(_center, point);
			if(!near_point || (near_point > near)){
				near_point = near;
				center_point = point;
			}
		}
		return center_point;
	};
	
	/*获取当前位置中心点*/
	$.getCenterPoint = function(){
		var rectangle = $.getBounds(),
        	_x = (rectangle.west + rectangle.east) / 2,
        	_y = (rectangle.north + rectangle.south) / 2;
		
		return [_x, _y];
	};
	
	/*格式化时间*/
	$.timeData = function(time,type){
		var new_time = Number(time),
			dateTime = new Date(new_time),
	    	y = dateTime.getFullYear(),			//年
	    	m = dateTime.getMonth() + 1;		//月
	    m = m < 10 ? '0' + m : m;
	    var d = dateTime.getDate();				//日
	    d = d < 10 ? ('0' + d) : d;
	    var h = dateTime.getHours();			//时
	    h = h < 10 ? ('0' + h) : h;
	    var t = dateTime.getMinutes();			//分
	    t = t < 10 ? ('0' + t) : t;
	    var s = dateTime.getSeconds();			//秒
	    s = s < 10 ? ('0' + s) : s;
	    if(type == 0){
	    	return y + '/' + m + '/' + d;
	    }else if(type == 1){
			return y + '/' + m + '/' + d + ' ' + h + ':' + t + ':' + s + '.' + dateTime.getMilliseconds();
	    }else{
			return y + '/' + m + '/' + d + ' ' + h + ':' + t + ':' + s;
	    }
	};
	
	/*时间维度转换*/
	$.timeConvert = function(time,type=false){
		var start_time = $.timeData(time, 0),
			end_time = $.timeData(Disease.system_time, 0),
			millisecond = new Date(end_time) - new Date(start_time),
			day_time = millisecond / 1000 / 60 / 60 / 24;
		if(day_time < 0 || day_time == 0){
			return '今天';
		}else if(day_time == 1){
			return '昨天';
		}else if(0 < day_time && day_time<4){
			return (day_time + '天前');
		}
		
		if(type){
			if( day_time < 7 ){
				return (day_time + '天前');
			}else{
				var before_time = parseInt(day_time / 7);
				return (before_time + '周前');
			}
		}
		
		return start_time;
	};
	
//	解析病害的坐标polygon
    $.cesium_range = function(range){
		if( !range || (range.indexOf("POLYGON") < 0 && range.indexOf("POINT") < 0 && range.indexOf("LINESTRING") < 0) ){
			return [];
		}
		if(range.indexOf("POLYGON ((") > -1){
			var replaces = range.replace("POLYGON ((","").replace("))","");
			var Coordinate = replaces.split(", ");
		}else if(range.indexOf("POINT (") > -1){
			var replaces = range.replace("POINT (","").replace(")","");
			var Coordinate = replaces.split(", ");
		}else if(range.indexOf("POINT(") > -1){
			var replaces = range.replace("POINT(","").replace(")","");
			var Coordinate = replaces.split(",");
		}else if(range.indexOf("LINESTRING(") > -1){
			var replaces = range.replace("LINESTRING(","").replace(")","");
			var Coordinate = replaces.split(",");
		}else if(range.indexOf("LINESTRING (") > -1){
			var replaces = range.replace("LINESTRING (","").replace(")","");
			var Coordinate = replaces.split(", ");
		}else{
			var replaces = range.replace("POLYGON((","").replace("))","");
			var Coordinate = replaces.split(",");
		}
		var locs = [];
		for(var i=0; i<Coordinate.length; i++){
			var strs1 = Coordinate[i].trim(),
				strs2 = strs1.split(" "),
				x = Number(strs2[0]),
				y = Number(strs2[1]),
				z = Number(strs2[2]),
				loc = [x, y, z];
			locs.push(loc);
		}
	    return locs;
    };
	
//	解析病害的坐标--判断并返回其类型
    $.cesium_range_type = function(range){
		if( !range || (range.indexOf("POLYGON") < 0 && range.indexOf("POINT") < 0 && range.indexOf("LINESTRING") < 0) ){
			return null;
		}
		if(range.indexOf("POLYGON ((") > -1){
			return 'Polygon';
		}else if(range.indexOf("POINT (") > -1){
			return 'Point';
		}else if(range.indexOf("POINT(") > -1){
			return 'Point';
		}else if(range.indexOf("LINESTRING(") > -1){
			return 'Polyline';
		}else if(range.indexOf("LINESTRING (") > -1){
			return 'Polyline';
		}else{
			return 'Polygon';
		}
    };
    
    /*解决地图上病害变动时,偶先不更新的问题*/
    $.cesium_refresh = function(){
    	_viewer && _viewer.camera.zoomIn(0.00000001);
    };
    
    /*删除地图上的覆盖物*/
    $.cesium_removeEntities = function(type=false){
		/*if(type){
			_viewer && _viewer.entities.removeAll();
    	}else if(_viewer){
    		for(let s=0; s<_viewer.entities.values.length; s++){
    			let entities_val = _viewer.entities.values[s];
    			if(!entities_val.mark_type || entities_val.mark_type != 'position_label' ){
    				_viewer.entities.removeById( entities_val.id );
    			}
    		}
    	}*/
		_viewer && _viewer.entities.removeAll();
		$.cesium_refresh();
    };
    
    /*解决地图上病害变动时,偶先不更新的问题*/
    $.get_cesium_xy = function(event){
	    let earthPosition  = _viewer.camera.pickEllipsoid(event.position, _viewer.scene.globe.ellipsoid);
     	let cartographic = Cesium.Cartographic.fromCartesian(earthPosition, _viewer.scene.globe.ellipsoid, new Cesium.Cartographic());
	    let lat = Cesium.Math.toDegrees(cartographic.latitude);
	    let lng = Cesium.Math.toDegrees(cartographic.longitude);
	    let height = cartographic.height || 0;
	    
	    return [lng, lat, height];
    };
	
})(jQuery);













