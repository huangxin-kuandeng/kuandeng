/**
 * 地图相关
 */

import {
    disease_init
} from './disease_init.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_group
} from './disease_group.js';
import {
    disease_user
} from './disease_user.js';
import {
    disease_player
} from './disease_player.js';
import {
    disease_map
} from './disease_main_map.js';

var disease_cesium = {};

disease_cesium.right_point = null;
disease_cesium.last_point = null;			//---高亮的点缓存
disease_cesium.last_info_point = null;		//---高亮的点缓存
disease_cesium.load_image = null;;;
disease_cesium.time_spac = 300;;
disease_cesium.minZoom = 9;
disease_cesium.maxZoom = 27;
disease_cesium.camera_zoom = null;
disease_cesium.layer_type = '2';

disease_cesium.point_to_info = function(type){
	if(!this.last_point){
		$.errorView('获取病害信息失败');
		return;
	}
	disease_player.click_types = true;
	$(".cesium_popup").hide();
	disease_init.player_mode_init(type);
	disease_info.come_to_info(this.last_point.datas.index,true,true);
};

disease_cesium.maps_init = function() {
	
	var _this = this;
	
	/*cesium地图-离开pop弹窗*/
	/*$('#cesium_map_parent .cesium_popup_mark').mouseout(function(){
		$('#cesium_map_parent .cesium_popup_mark').hide();
	})*/
	/*cesium地图-点击打开正射图、采集图、点云图*/
	$('.cesium_popup .popup_content .image_buttons').on('click', 'button', function () {
		let name = this.name;
		_this.point_to_info(name);
	})
	// $('.cesium_popup .popup_content .image_buttons button.image_buttons_up').click(function(){
	// 	let name = this.name;
	// 	_this.point_to_info(name);
	// })
	// $('.cesium_popup .popup_content .image_buttons button.image_buttons_survey').click(function(){
	// 	let name = this.name;
	// 	_this.point_to_info(name);
	// })
	// $('.cesium_popup .popup_content .image_buttons button.image_buttons_point').click(function(){
	// 	let name = this.name;
	// 	_this.point_to_info(name);
	// })
	
	/*cesium地图的缩放按钮*/
	$('.cesium_control .zoom_in a').click(function(){
		var level = $('.cesium_control .zoom_level a').html(),
			new_level = Number(level) + 1;
		_this.zoomInOut(new_level);
	})
	$('.cesium_control .zoom_out a').click(function(){
		var level = $('.cesium_control .zoom_level a').html() - 1;
		_this.zoomInOut(level);
	})
	/*cesium地图的平移按钮*/
	$('.cesium_control .cesium_move span').click(function(){
		var data_type = this.getAttribute('data-type'),
			viewer_height = _viewer.camera.positionCartographic.height;
		if(data_type){
			_viewer.camera[data_type](viewer_height);
		}
	})
	/*cesium地图的图层按钮*/
	$('.cesium_control .layer_list').mouseleave(function(){
		$('.cesium_control .cesium_layers').removeClass('active');
		$('.cesium_control .layer_list').hide();
	})
	$('.cesium_control .cesium_layers a').click(function(){
		$('.cesium_control .cesium_layers').toggleClass('active');
		$('.cesium_control .layer_list').toggle();
	})
	$('.layer_list li label input').click(function(e){
		let val = e.target.value,
			checked = e.target.checked;
		_this.layers_changed({
			'value': val,
			'checked': checked
		});
	})
	$('.layer_list li span.radio_label').click(function(e){
		let _type = $('.layer_list .checkbox_label input[value="1"]')[0].checked;
		if(!_type){
			$.errorView('请先选中底图！');
			return;
		}
		let dom = (e.target.localName == 'b') ? e.target.parentNode : e.target;
		$('.layer_list li span.radio_label').removeClass('active');
		$(dom).addClass('active');
		
		let val = dom.getAttribute('name'),
			checked = true;
		_this.layers_changed({
			'value': val,
			'checked': checked
		});
		disease_cesium.layer_type = val;
	})
	/*cesium地图的返回初始按钮*/
	$('.cesium_control .full_screen a').click(function(){
		var _center = disease_user.current_adcode.center,
			new_center = _center ? _center.split(',') : null,
			_zoom = config_url.nantong.zoom,
			_height = disease_user.zoomToAltitude(_zoom);
		
		if(!new_center){
			$.errorView('当前城市中心点获取失败！');
			return;
		}
		
		var center =  Cesium.Cartesian3.fromDegrees(new_center[0], new_center[1], _height);
		
		_viewer.camera.setView({  
			destination: center
		})
		/*var _bounds = config_url.nantong.info_bounds;
		_viewer.camera.setView({
			destination: Cesium.Rectangle.fromDegrees(_bounds.west, _bounds.south, _bounds.east, _bounds.north)
		});*/
//		zoom_level();
	})
	/*cesium地图的搜索按钮*/
	$('.cesium_control .cesium_search a').mouseover(function(){
		$('.cesium_control .cesium_search input').css('display', 'block');
		$('.cesium_control .cesium_search input').animate({
			'width': '178px'
		},200);
	})
	$('.cesium_control .cesium_search').mouseleave(function(){
		$('.cesium_control .cesium_search input').animate({
			'width': '0px'
		},200,'swing',function(){
			$('.cesium_control .cesium_search input').css('display', 'none');
		});
	})
	$('.cesium_control .cesium_search input').keydown(function(e){
		var value = e.target.value,
			code = e.keyCode;
		
		if(code == 13 && value){
			var _url = 'https://nominatim.openstreetmap.org/search?format=json&q='+value;
			$.getAjax({
				'url': _url,
				'token': true,
				'callback': function(data){
					var result = (data && data[0]) ? data[0] : {},
						boundingbox = result.boundingbox || null;
					if(!boundingbox){
						$.errorView('查询失败');
						return;
					}
					_viewer.camera.setView({
						destination: Cesium.Rectangle.fromDegrees(
							boundingbox[2],
							boundingbox[0],
							boundingbox[3],
							boundingbox[1]
						)
					});
				}
			})
		}
	})
	
	var handler3D = new Cesium.ScreenSpaceEventHandler(_viewer.canvas),
		scene = _viewer.scene,
		_id = null;
	//绑定鼠标移动事件
	handler3D.setInputAction(function (movement) {
		var picked = scene.pick(movement.endPosition);
		$(".cesium_popup").hide();
		if(_this.last_point){
			if(_this.last_info_point && (_this.last_point._id == _this.last_info_point._id)){
			
			}else if(_this.last_point._billboard && _this.last_point._billboard._image._value){
				_this.last_point._billboard._image._value = _this.last_point._default_url;
//		        	_this.last_point._billboard.disableDepthTestDistance._value = 0;
				_this.last_point = null;
			}else if( _this.last_point.datas && _this.last_point.datas.TYPE == '703' ){
				_this.last_point.polygon.material.color.setValue( Cesium.Color.RED.withAlpha(0.01) );
				_this.last_point.polygon.outlineColor.setValue( Cesium.Color.RED.withAlpha(0.01) );
			}else if(_this.last_point._pickPrimitive && _this.last_point.datas){
				_this.last_point._pickPrimitive.image = _this.last_point.default_url;
			}
		}
		
		if(picked && picked.id && picked.id.datas && picked.id.datas.TYPE == '703'){
			picked.id.polygon.material.color.setValue( Cesium.Color.RED.withAlpha(0.4) );
			picked.id.polygon.outlineColor.setValue( Cesium.Color.RED.withAlpha(0.4) );
			_this.last_point = picked.id;
		}
		
		if (picked && picked.id && picked.id.data_id && !picked.id.mark_type && (picked.id._billboard || picked.id.datas.TYPE == '703')) {
			var obj = { position: movement.endPosition },
				_id = _this.last_point ? _this.last_point._id : null;
			if (picked.id._billboard && picked.id._billboard._image._value) {
				
				picked.id._billboard._image._value = picked.id._active_url;
				picked.id._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
				_this.last_point = picked.id;
			}
			_this.cesium_popup_html({
				'obj': obj,
				'_id': _id,
				'scene': scene,
				'picked': picked
			});
		}else if(picked && picked.primitive && picked.primitive._billboardCollection && picked.primitive.datas){
			
			var obj = { position: movement.endPosition },
				_id = _this.last_point ? _this.last_point._id : null;
			
			if(!_id){
				_id = _this.last_point ? _this.last_point.datas.ID : null;
			}
			
			picked.primitive._pickPrimitive.image = picked.primitive.active_url;
			
			_this.last_point = picked.primitive;
			_this.cesium_popup_html({
				'obj': obj,
				'_id': _id,
				'scene': scene,
				'picked': picked
			});
			
		}else {
			$(".cesium_popup").hide();
		}
		$.cesium_refresh();
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	
	//绑定地图左键点击事件
	handler3D.setInputAction(function (movement) {
		
//		$('.disease_info').fadeIn(200);
		var picked = scene.pick(movement.position);
		if(picked && picked.id && picked.id._datas && !picked.id.mark_type){
			
			console.log(picked);
			
			var index = picked.id._datas.index;
			if( (picked.id._billboard || picked.id.datas.TYPE == '703') && index != undefined){
				
				var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
					return data.ACTIVE == 'active';
				})
				disease_init.player_mode_init(active.ID);
				
				disease_info.come_to_info(index,true,true);
				
//					disease_info.info_init(index,true,true);
//					_this.change_last_point(picked.id);
//					_this.listen_cesium_body('disease_info', true);
//					if(display == 'none'){
//						$('.disease_info').css('display', 'block');
//					}
			}
			$(".cesium_popup").hide();
		}else if(picked && picked.id && picked.id.point_length && !picked.id.mark_type){
			var center = picked.id._center,
				z_height = _viewer.camera.positionCartographic.height,
				zoom_height = 300;
			
			// if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '441400'){
			// 	zoom_height = 450;
			// }else if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '522700'){
			// 	zoom_height = 1300;
			// }
			
			var lng_lat = Cesium.Cartesian3.fromDegrees(center[0], center[1], zoom_height);
			_viewer.camera.setView({  
				destination: lng_lat
			})
			_this.zoom_level();
		}
		
	}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
	//绑定地图移动事件
	handler3D.setInputAction(function (movement) {
		$('#cesium_popup').hide();
		$('.cesium_popup_mark').hide();
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
	//绑定地图缩放事件
	/*handler3D.setInputAction(function (movement) {
		zoom_level();
	}, Cesium.ScreenSpaceEventType.WHEEL);*/
	//绑定滚轮点击事件事件
	handler3D.setInputAction(function (movement) {
		$('#cesium_popup').hide();
	}, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
	
	/*绑定-监听鼠标右键*/
	handler3D.setInputAction(function (event) {
		_this.cesium_popup_mark(event);
	}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
};

/*鼠标在地图上的右键执行事件*/
disease_cesium.cesium_popup_mark = function(event){
	
	$('.cesium_popup_mark').hide();
	let map_width = $('#cesium_map').width() || 0,
		map_height = $('#cesium_map').height() || 0,
		dom_width = $('#cesium_map_parent').width() || 0,
		dom_height = $('#cesium_map_parent').height() || 0,
		left_width = dom_width - map_width,
		top_height = dom_height - map_height,
		new_left = event.position.x + left_width + 5,
		new_top = event.position.y + top_height + 52,
		picked = _viewer.scene.pick(event.position);
	
	$('.cesium_popup_mark').css({
		'top': new_top,
		'left': new_left
	});
	
	if(picked && picked.id && picked.id.mark_type == 'position_label'){
		$('.cesium_popup_mark.remove_mark').show();
		this.right_point = picked.id.id;
	}else{
		$('.cesium_popup_mark.add_mark').show();
		this.right_point = $.get_cesium_xy(event);
	}
};

/*图层列表发生改变时*/
disease_cesium.layers_changed = function(param){
	let show = param.checked,
		param_val = param.value,
		layers = _viewer.imageryLayers._layers || [],
		values = _viewer.entities.values || [],
		param_l = {
			'1': { 'tdtImg_c': true, 'tdtCva': true, 'tdtAdcode': true, 'tdtAdcodeM': true },
			'2': { 'tdtAdcode': true, 'tdtAdcodeM': true },
			'3': { 'tdtImg_c': true, 'tdtCva': true },
			'4': null
		};
	
	if(show && param.value == '1'){
		$('.radio_label').removeClass('active');
		$('.radio_label[name="2"]').addClass('active');
		param_val = $('.radio_label.active').attr('name');
	}else if(param.value == '1'){
		$('.radio_label').removeClass('active');
	}
	
	if(param.value == '4'){
		for(let i=0; i<values.length; i++){
			if(values[i].mark_type == 'position_label'){
				values[i].show = show;
			}
		}
	}else{
		for(let i=0; i<layers.length; i++){
			let layer_name = layers[i].imageryProvider._layer,
				createid = layers[i].imageryProvider._credit;
			if( createid && createid._html == 'tile2d' ){
				continue;
			}
			if(param.value == '5'){
				layers[i].show = show;
			}else if( param_l[param_val][layer_name] ){
				layers[i].show = show;
			}else{
				layers[i].show = !show;
			}
		}
	}
	$.cesium_refresh();
};

//更改最后一个点的值
disease_cesium.change_last_point = function(layer){
	if(this.last_info_point){
		
		this.last_info_point._billboard._image._value = this.last_info_point._default_url;
		this.last_info_point._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
		this.last_info_point = null;
	}
	if(layer && layer._billboard){
		
		layer._billboard._image._valu = layer._active_url;
		layer._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
		this.last_info_point = layer;
	}
	$.cesium_refresh();
};

/*地图缩放--放大-缩放*/
disease_cesium.zoomInOut = function(zoom){
	var height = disease_user.zoomToAltitude(zoom);
	if(height){
		var center = $.getCenterPoint();
		_viewer.camera.setView({
			destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], height)
		})
	}
};

/*地图等级*/
disease_cesium.zoom_level = function(){
	var height = _viewer.camera.positionCartographic.height,
		zoom = disease_user.altitudeToZoom(height),
		math_zoom = Math.round(zoom);
	_viewer.camera.mathZoom = math_zoom;
	$('.cesium_control .zoom_level a').html(math_zoom);
	
	if( (math_zoom > 15) && !window.tile2d.show ){
		window.tile2d.show = true;
	}else if( (math_zoom < 16) && window.tile2d.show ){
		window.tile2d.show = false;
	}
	
	if( math_zoom > 19  ){
		$('.layer_list .checkbox_label input[value="1"]')[0].checked = false;
		$('.layer_list li span.radio_label').removeClass('active');
		disease_cesium.layers_changed({
			'value': 5,
			'checked': false
		});
	}else if( math_zoom < 20 ){
		$('.layer_list .checkbox_label input[value="1"]')[0].checked = true;
		var  _active = $('.layer_list li span.radio_label.active');
		if(!_active.length){
			$('.layer_list li span.radio_label[name="' + disease_cesium.layer_type + '"]').addClass('active');
			disease_cesium.layers_changed({
				'value': disease_cesium.layer_type,
				'checked': true
			});
		}
	}
	
	disease_group.point_group();
};

/*地图气泡方法样式*/
disease_cesium.cesium_popup = function(param = null){
	if (param && Cesium.defined(param.picked)) {
		var center = param.picked.id ? param.picked.id._datas.center_xy : param.picked.primitive.datas.center_xy,
			_id = param.picked.id ? param.picked.id._id : param.picked.primitive.datas.ID,
			id = Cesium.defaultValue(param.picked.id, param.picked.primitive.id),
			properties = param.picked.id ? param.picked.id._datas : param.picked.primitive.datas,
			positions = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
			position_popup = Cesium.SceneTransforms.wgs84ToWindowCoordinates(param.scene, positions);
		
		var _this = disease_cesium;
		var _cns = [
			{ 'id': 'WIDTH', 'name': 'WIDTH_CN', 'unit': 'm' },
			{ 'id': 'RADIUS', 'name': 'RADIUS_CN', 'unit': 'm' },
			{ 'id': 'SLOPE', 'name': 'SLOPE_CN', 'unit': '' }
		]
		// RADIUS: "Infinity"    转弯半径（m）
		// SLOPE: "-0.017119"		坡度
		// WITH: "3.75",            道路宽度（m）
		
		if(properties.WIDTH_CN || properties.SLOPE_CN){
			
			$('.cesium_popup .popup_content .image_buttons').css('display', 'none');
			$('.cesium_popup .popup_content .image_texts').css('display', 'block');
			
			let _html = `
				${_cns.map(c => `
					<span>${properties[c.name]} ${properties[c.id]}${c.unit}</span>
				`).join('')}
			`;
			$('.cesium_popup .popup_content .image_texts').html(_html);
			if(properties.LINK_CODE){
				$('.cesium_popup .popup_content .image_buttons').css('display', 'block');
			}
		}else{
			$('.cesium_popup .popup_content .image_buttons').css('display', 'block');
			$('.cesium_popup .popup_content .image_texts').css('display', 'none');
		}
		
		if ( (id instanceof Cesium.Entity) || (param.picked.primitive && param.picked.primitive.datas) ) {
			function positionPopUp(c) {
				var _x = 0,
					_y = -123,
					map_width = $('#cesium_map').width(),
					left_width = $('.cesium_map_left').width(),
					map_height = $('#cesium_map').height(),
					type_width = map_width - position_popup.x,
					type_height = map_height - position_popup.y;
				if(type_width < 289){
					_x = -289;
				}
				if(position_popup.y < 115){
					_y = 8;
				}
				
				var x = position_popup.x + _x + left_width,
					y = position_popup.y + _y;
				$(".cesium_popup").css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
			}
			$(".cesium_popup").show();
//	        	if(param._id != _id){
				positionPopUp();
//	       		}
			$('.leaflet-popup-close-button').click(function () {
				$(".cesium_popup").hide();
				return false;
			});
			return id;
		}
	}
};

/*地图气泡内容变化*/
disease_cesium.cesium_popup_html = function(param){
	var param_id = param.picked.id ? param.picked.id._id : param.picked.primitive.datas.ID,
		datas = param.picked.id ? param.picked.id.datas : param.picked.primitive.datas,
		update_time = datas.update_time ? datas.update_time.split('/').join('.') : '',
		create_time = new Date(datas.create_time),
		new_create_time = $.timeConvert(create_time, true),
		class_name = 'child_body_grade_value grade_' + datas.subtype,
		info_view_type_2 = datas.mp_codes_0 + ' ' + datas.mp_codes_1 + datas.mp_codes_2 + ' ' + datas.cn_up_down,
		track_point_id = datas.T_POINT_ID,
		place_value = datas.cn_mark + ' ' + datas.cn_up_down,
		track_image_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
	
	if( param._id != param_id || datas.TYPE == '703' ){
		$('.cesium_popup .popup_content_head b').html(datas._cn_type || '');
		$('.cesium_popup .popup_content_head .child_body_grade_value').html(datas._cn_subtype || '');
		$('.cesium_popup .popup_content_head .child_body_grade_value').attr('class', class_name);
		
		$('.cesium_popup .child_body_place .child_body_place_type').html(info_view_type_2);
		$('.cesium_popup .child_body_grade .child_body_grade_time').html(datas.update_time);
		
		
		/*this.load_image && clearTimeout(this.load_image);
		this.load_image = setTimeout(function(){
			$.getImageToken(
				$('.cesium_popup .popup_img img'),
				track_image_url
			);
		}, this.time_space);*/
	}
	
	this.cesium_popup(param);
};

/*控制cesium地图的缩放限制-60~~45000000-*/
disease_cesium.cesium_zoom = function(){
	
	var _this = this;
	
	_viewer.scene.screenSpaceCameraController.minimumZoomDistance = disease_user.zoomToAltitude(_this.maxZoom);
	_viewer.scene.screenSpaceCameraController.maximumZoomDistance = disease_user.zoomToAltitude(_this.minZoom);
	_viewer.camera.percentageChanged = 0;
	
	const listener = () => {
		var camera_height = _viewer.camera.positionCartographic.height,
//			center = $.getCenterPoint(),
			zoom = disease_user.altitudeToZoom(camera_height),
			math_zoom = Math.round(zoom);
		
		/*center.push(camera_height);
		var positions = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
			_position = new Cesium.Cartesian3(positions.x, positions.y, positions.z);
		
		_viewer.camera.position = _position;
		
		console.log(_position);
		console.log(_viewer.camera.position);*/
		
		
		if(math_zoom && (math_zoom != _this.camera_zoom)){
			_this.camera_zoom = Math.round(zoom);
			_this.zoom_level();
		}
		
		
		
		/*var camHeight = _viewer.camera.positionCartographic.height,
			isOutsideZoomLimits = false,
			destHeight;
		if(camHeight < _this.minZoom){
			isOutsideZoomLimits = true;
			destHeight = _this.minZoom;
		}else if(camHeight > _this.maxZoom){
			isOutsideZoomLimits = true;
			destHeight = _this.maxZoom;
		}
		if(isOutsideZoomLimits){
			const dest = Cesium.Cartesian3.fromRadians(
				_viewer.camera.positionCartographic.longitude,
				_viewer.camera.positionCartographic.latitude,
				destHeight
			);
			_viewer.camera.position = dest;
		}*/
	};
	const removeListener = _viewer.camera.changed.addEventListener(listener);
	_this.zoom_level();
};

/*监听地图变化事件*/
disease_cesium.listen_cesium_body = function(dom, type){
	var class_obj = {
		'disease_list': true,
		'disease_info': true,
//			'disease_player': false
	};
	var width_arr = [],
		dom_width = 0;
	for(var class_name in class_obj){
		var bound_rect = $('#highway_disease .'+class_name)[0].getBoundingClientRect(),
			display_type = $('#highway_disease .'+class_name).css('display'),
			bound_rect_type = ( bound_rect && bound_rect.left < -1 ) ? false : true,
			width = $('#highway_disease .'+class_name)[0].offsetWidth - 10;
		
		if(class_name != dom && display_type == 'block' && bound_rect_type){
			if( class_name == 'screen_model' ){
				width += 344;
			}
			width_arr.push(width);
		}
	}
	if(type && class_obj[dom] ){
		dom_width = $('#highway_disease .'+dom)[0].offsetWidth - 10;
	}
	
	width_arr.push(dom_width);
	width_arr.sort(function(a,b) {
		return b - a;
	});
	
	var max_width = width_arr[0],
		map_width = 'calc(100% - ' + max_width + 'px)';
	
	$('#cesium_map_parent .cesium_map_left').width(max_width);
	$('#cesium_map_parent #cesium_map').width(map_width);
	
	disease_map.setResize();
};

/*加载3D tile服务图层*/
disease_cesium.add_3d_tile = function(){
	return;
	if(!disease_user || !disease_user.current_adcode || !disease_user.current_adcode.dataVersion){
		return false;
	}
	let dataVersion = disease_user.current_adcode.dataVersion;
	let _this = this;
	window.tileset2 = _viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
		url: config_url.datasets_adcode + dataVersion + '/tileset.json',
		skipLevelOfDetail: true,
		maximumMemoryUsage: 1024,
		// preferLeaves: true,
		// dynamicScreenSpaceError: true,
		// foveatedTimeDelay: 1,
		// baseScreenSpaceError: 500,
		// immediatelyLoadDesiredLevelOfDetail: true
	}));
	tileset2.readyPromise.then(function () {
		console.log('Loaded tileset2');
		
		/*var boundingSphere = tileset2.boundingSphere;
		var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);//获取到倾斜数据中心点的经纬度坐标（弧度）
		var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);//倾斜数据中心点的笛卡尔坐标      
		var positions = [Cesium.Cartographic.fromDegrees(cartographic.longitude,cartographic.latitude)];
		var promise = Cesium.sampleTerrainMostDetailed(_viewer.terrainProvider, positions);//其中terrainProvider是当前场景使用的高程Provider
		Cesium.when(promise, function(updatedPositions) {
			 var terrainHeight = updatedPositions[0].height;	//高程
			 var offset=Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, terrainHeight);	//带高程的新笛卡尔坐标
			 var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());	//做差得到变换矩阵
			 tileset2.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		});*/
		
		/*
		var heightOffset = -35;
		var boundingSphere = tileset2.boundingSphere;
		var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
		var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
		var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
		var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
		tileset2.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
		*/
		
	}).otherwise(function (error) {
		console.log(error)
	});
	
	
	// HTML overlay for showing feature name on mouseover
	var nameOverlay = document.createElement('div');
	_viewer.container.appendChild(nameOverlay);
	nameOverlay.className = 'backdrop';
	nameOverlay.style.display = 'none';
	nameOverlay.style.position = 'absolute';
	nameOverlay.style.bottom = '0';
	nameOverlay.style.left = '0';
	nameOverlay.style['pointer-events'] = 'none';
	nameOverlay.style.padding = '4px';
	nameOverlay.style.backgroundColor = 'black';
	nameOverlay.style.color = 'white';
	// Information about the currently selected feature
	var selected = {
		feature: undefined,
		originalColor: new Cesium.Color()
	};

	// An entity object which will hold info about the currently selected feature for infobox display
	var selectedEntity = new Cesium.Entity();

	// Get default left click handler for when a feature is not picked on left click
	var clickHandler = _viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

	// If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
	// If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
	if (Cesium.PostProcessStageLibrary.isSilhouetteSupported(_viewer.scene)) {
		// Silhouettes are supported
		var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
		silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
		silhouetteBlue.uniforms.length = 0.01;
		silhouetteBlue.selected = [];

		var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
		silhouetteGreen.uniforms.color = Cesium.Color.LIME;
		silhouetteGreen.uniforms.length = 0.01;
		silhouetteGreen.selected = [];

		_viewer.scene.postProcessStages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]));

		// Silhouette a feature blue on hover.
		_viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
			// If a feature was previously highlighted, undo the highlight
			silhouetteBlue.selected = [];

			// Pick a new feature
			var pickedFeature = _viewer.scene.pick(movement.endPosition);
			var cesium_map_left = $('.cesium_map_left').width();
			if (!Cesium.defined(pickedFeature)) {
				nameOverlay.textContent='';
				nameOverlay.style.display = 'none';
				return;
			}
			if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
				// A feature was picked, so show it's overlay content
				if (pickedFeature.hasProperty('road_name')) {
					nameOverlay.style.display = 'block';
					nameOverlay.style.bottom = _viewer.canvas.clientHeight - movement.endPosition.y + 'px';
					nameOverlay.style.left = movement.endPosition.x + cesium_map_left + 'px';
					var name = pickedFeature.getProperty('road_name');
					if (!Cesium.defined(name)) {
						name = pickedFeature.getProperty('id');
					}
					var type = pickedFeature.getProperty('type');
					var type_name = '公里桩：';
					if (type == 16) {
						type_name = '百米桩：';
					}
					var detail = '';
					if (type == 15) {
						detail = pickedFeature.getProperty('kilometre') + '公里';
					} else if (type == 16) {
						detail = pickedFeature.getProperty('kilometre') + "." + pickedFeature.getProperty('hectometre') + '公里';
					}
					nameOverlay.textContent = type_name + name + "-" + detail;

					// Highlight the feature if it's not already selected.
					if (pickedFeature !== selected.feature) {
						silhouetteBlue.selected = [pickedFeature];
					}
				}
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		// Silhouette a feature on selection and show metadata in the InfoBox.
		_viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
			// If a feature was previously selected, undo the highlight
			silhouetteGreen.selected = [];

			// Pick a new feature
			var pickedFeature = _viewer.scene.pick(movement.position);
			if (!Cesium.defined(pickedFeature)) {
				clickHandler(movement);
				return;
			}
			if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
				// A feature was picked, so show it's overlay content
				if (pickedFeature.hasProperty('road_name')) {
					// Select the feature if it's not already selected
					if (silhouetteGreen.selected[0] === pickedFeature) {
						return;
					}

					// Save the selected feature's original color
					var highlightedFeature = silhouetteBlue.selected[0];
					if (pickedFeature === highlightedFeature) {
						silhouetteBlue.selected = [];
					}

					// Highlight newly selected feature
					silhouetteGreen.selected = [pickedFeature];

					// Set feature infobox description
					var featureName = pickedFeature.getProperty('road_name');
					selectedEntity.name = featureName;
					selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
					_viewer.selectedEntity = selectedEntity;
					selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
						'<tr><th>路名</th><td>' + pickedFeature.getProperty('road_name') + '</td></tr>' +
						'<tr><th>公里数</th><td>' + pickedFeature.getProperty('kilometre') + '</td></tr>' +
						'<tr><th>百米数</th><td>' + pickedFeature.getProperty('hectometre') + '</td></tr>' +
						'</tbody></table>';
					//alert(selectedEntity.description);
				}
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		/*绑定-监听鼠标右键*/
		_viewer.screenSpaceEventHandler.setInputAction(function onRightClick(movement) {
			_this.cesium_popup_mark(movement);
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	} else {
		// Silhouettes are not supported. Instead, change the feature color.

		// Information about the currently highlighted feature
		var highlighted = {
			feature: undefined,
			originalColor: new Cesium.Color()
		};

		// Color a feature yellow on hover.
		_viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(movement) {
			// If a feature was previously highlighted, undo the highlight
			if (Cesium.defined(highlighted.feature)) {
				highlighted.feature.color = highlighted.originalColor;
				highlighted.feature = undefined;
			}
			// Pick a new feature
			var pickedFeature = _viewer.scene.pick(movement.endPosition);
			var cesium_map_left = $('.cesium_map_left').width();
			if (!Cesium.defined(pickedFeature)) {
				nameOverlay.style.display = 'none';
				return;
			}
			// A feature was picked, so show it's overlay content
			nameOverlay.style.display = 'block';
			nameOverlay.style.bottom = _viewer.canvas.clientHeight - movement.endPosition.y + 'px';
			nameOverlay.style.left = movement.endPosition.x + cesium_map_left + 'px';
			var name = pickedFeature.getProperty('name');
			if (!Cesium.defined(name)) {
				name = pickedFeature.getProperty('id');
			}
			nameOverlay.textContent = name;
			// Highlight the feature if it's not already selected.
			if (pickedFeature !== selected.feature) {
				highlighted.feature = pickedFeature;
				Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
				pickedFeature.color = Cesium.Color.YELLOW;
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		// Color a feature on selection and show metadata in the InfoBox.
		_viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
			// If a feature was previously selected, undo the highlight
			if (Cesium.defined(selected.feature)) {
				selected.feature.color = selected.originalColor;
				selected.feature = undefined;
			}
			// Pick a new feature
			var pickedFeature = _viewer.scene.pick(movement.position);
			if (!Cesium.defined(pickedFeature)) {
				clickHandler(movement);
				return;
			}
			// Select the feature if it's not already selected
			if (selected.feature === pickedFeature) {
				return;
			}
			selected.feature = pickedFeature;
			// Save the selected feature's original color
			if (pickedFeature === highlighted.feature) {
				Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
				highlighted.feature = undefined;
			} else {
				Cesium.Color.clone(pickedFeature.color, selected.originalColor);
			}
			// Highlight newly selected feature
			pickedFeature.color = Cesium.Color.LIME;
			// Set feature infobox description
			var featureName = pickedFeature.getProperty('name');
			selectedEntity.name = featureName;
			selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
			_viewer.selectedEntity = selectedEntity;
			selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
				'<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
				'<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
				'<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
				'<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
				'<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
				'<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
				'<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
				'</tbody></table>';
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		/*绑定-监听鼠标右键*/
		_viewer.screenSpaceEventHandler.setInputAction(function onRightClick(movement) {
			_this.cesium_popup_mark(movement);
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	}
//	    this.postRender();
};

/*执行postrender事件,修改点坐标*/
disease_cesium.postRender = function(){
   _viewer.scene.postRender.addEventListener(function() {
		if(disease_cesium.camera_zoom > 17){
			var entitys = disease_player.current_disease || {};
			for(var id in entitys){
				var _entity = entitys[id],
					_show = _entity.show,
					nodes = _entity._nodes,
					new_nodes = [],
					points_center = $.getPointsCenter(nodes, true);
				
				for(var i=0; i<nodes.length; i++){
					var positions = Cesium.Cartesian3.fromDegrees(nodes[i][0], nodes[i][1], nodes[i][2]);
//		    				new_positions = _viewer.scene.clampToHeight(positions, [_entity]);
					console.log(positions)
				}
				
			}
		}
   });
};

export {
    disease_cesium
};

// module.exports = disease_cesium;






