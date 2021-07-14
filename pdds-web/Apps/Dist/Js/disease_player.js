
/**
 * 病害巡查影像界面
 */

import {
    SlideList
} from './disease_slide.js';
import {
    disease_map
} from './disease_main_map.js';
import {
    disease_user
} from './disease_user.js';
import {
    disease_list
} from './disease_list.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_init
} from './disease_init.js';
import {
    disease_leaflet
} from './disease_leaflet.js';
import {
    disease_group
} from './disease_group.js';
import {
    projection
} from './get_show_polygon.js';
import { cesium_player } from './play_window/cesium_player.js'

var disease_player = {};

/* 视频界面的当前开启状态 */
var playerInterfaceStatus = false;

disease_player.catch_count = 10;
disease_player.recog_result = '2';		//病害识别结果的是否显示状态
disease_player.current_num = null;		//当前轨迹点
disease_player.default_num = null;		//默认初始显示的轨迹点
disease_player.track_list = null;		//轨迹点列表
disease_player.camera_params = null;	//相机参数
disease_player.position_icon = null;	//当前定位点的layer
disease_player.current_disease = {};	//当前病害信息
disease_player.context = null;			//canvas-绘制初始化
disease_player.max_distance = 20;		//当前轨迹点为中心点，半径20M以内的病害数据显示地图、反投
disease_player.timing = null;			//计时器
disease_player.time_space = 750;		//计时器的执行间隔
disease_player.entitys = null;
disease_player.entitys_utm = null;
disease_player.click_types = false;

disease_player.player_init = function(type=false) {
	
	if(Disease.TYPE_LIST.ID == "ASSET_INSPECTION"){
		disease_player.max_distance = 100;
	}else{
		disease_player.max_distance = 20;
	}
	
	var _this = this;
	window.three_viewer = null;			//threeJS场景初始化
	
	_this.current_num = 1;
	_this.track_list = {};
	/*var ratio_width = 608 / 2448,
		ratio_height = ratio_width * 2048,
		_height = Number(ratio_height);

	$('.disease_player_body .player_image').css('height', _height);
	$('.disease_player_body .player_image #canvas_three').css('height', _height);*/
	_this.three_init();
	_this.cesiumPlayer_init();
	// animate();
	
	/*跳帧功能*/
	/*$('.disease_player').on('keydown', '.player_speed input.player_speed_current', function (e) {
		if(e.keyCode == 13){
			var _value = e.target.value;
			_this.current_num = parseInt(_value);
			
			if(current_num < 1){
				_this.current_num = 1;
			}else if(current_num > _this.track_list.length){
				_this.current_num = _this.track_list.length;
			}
			_this.player_skip();
		}
	});*/
	
	$('.disease_info').on('click', '.geometriesLabel', function () {
		let id = this.getAttribute('dataid') || null;
		let info = trackBufferResults.features.find( d => { return d.properties.ID == id } );
		if(id && info){
			disease_info.come_to_info(info,true,true);
		}
	})
	/*取消选中--病害识别结果*/
	$('.disease_player').on('click', '.player_recog .label input', function (e) {
		_this.recog_result = !_this.recog_result;
		this.checked = _this.recog_result;
		_this.player_recog();
	});
	/*下一帧*/
	$('.disease_info').on('click', '.player_video button.next_image', function (e) {
		_this.view_info_types(true);
		_this.next_image();
	});
	/*上一帧*/
	$('.disease_info').on('click', '.player_video button.pre_image', function (e) {
		_this.view_info_types(true);
		_this.pre_image();
	});
	/*播放-暂停：操作*/
	$('.disease_info').on('click', '.player_video button.play_image', function () {
		_this.view_info_types(true);
		_this.player_icon_change();
	})
	/*返回病害操作--即返回初始帧*/
	$('.disease_info').on('click', '.player_video button.player_to_info', function () {
		_this.view_info_types();
		disease_player.player_icon_change(true);
		_this.timing && clearInterval(_this.timing);
		_this.current_num = _this.default_num;
		_this.player_skip();
	})
	/*下载图片操作*/
	$('.disease_info').on('click', '.player_video button.download_image', function () {
		$.errorView('功能未完善');
	})
	/*用户反馈操作*/
	$('.disease_info .info_header .menu_feedback').click(function(){
		$('textarea.desc').val('');
		SlideList.menu_feedbacks(true);
	})
	/*病害操作列表功能*/
	$('.disease_info .info_header .menu_manage').mouseover(function(){
		$('.disease_info .menu_list').css('display', 'block');
	})
	$('.disease_info .info_header .menu_manage').mouseout(function(){
		$('.disease_info .menu_list').css('display', 'none');
	})
	/*用户收藏操作*/
	$('.disease_info .info_header .menu_collect').click(function(){
		let type = $('.menu_collect').hasClass('active');
		SlideList.menu_collects(type);
	})
	/*用户标记操作*/
	$('.disease_info .info_header .menu_mark').click(function(e){
		if(!disease_player.track_list.length){
			$.errorView('轨迹正在加载中...');
			return;
		}
		let _name = $('.disease_info .info_header .menu_mark').attr('name');
		if(_name){
			disease_map.right_point = _name;
			disease_map.menuMarks(true, function(){
				_this.mark_type_init();
			});
		}else{
			let _track = _this.track_list[_this.current_num - 1];
			disease_map.right_point = _track.map_center;
			disease_map.menuMarks();
		}
	})
	/*用户标记操作*/
	$('.cesium_popup_mark a.mark_point').click(function(){
		disease_map.menuMarks();
	})
	/*用户删除标记操作*/
	$('.cesium_popup_mark a.remove_point').click(function(){
		disease_map.menuMarks(true, function(){
			_this.mark_type_init();
		});
	})
	/*返回首页：操作按钮,视频界面*/
	$('.disease_info').on('click', '.info_image a.full_back_index', function () {
		SlideList.full_screen(true);
		
		_this.view_info_types();
		_this.timing && clearInterval(_this.timing);
		_this.player_closer();
		
		$('.disease_info').fadeOut(100);
		disease_list.position_group_change();
		disease_map.change_last_point();
		disease_info.polygon_info(true);
		disease_map.listen_cesium_body('disease_info', false);
		
		var active_dom = Disease.TYPE_LIST.FUNBUTTON.find(function(data){
		    return data.ACTIVE == 'active';
		})
		disease_init.player_mode_init(active_dom.ID);
	});
	/*关闭:详情,视频界面*/
	$('.disease_info').on('click', '.info_header a.info_header_close', function () {
		_this.player_close();
	});
	/*倍速列表：操作*/
	$('.disease_info').on('mouseover', 'button.search_image', function () {
		$(".disease_info .speed_list_group").css('display', 'block');
	})
	$('.disease_info').on('mouseleave', 'div.speed_list', function () {
		$(".disease_info .speed_list_group").css('display', 'none');
	})
	/*倍速列表：操作*/
	$('.disease_info').on('mouseover', 'button.pdds_result', function () {
		$(".disease_info .result_list_group").css('display', 'block');
	})
	$('.disease_info').on('mouseleave', 'div.result_list', function () {
		$(".disease_info .result_list_group").css('display', 'none');
	})
	/*$('button.player_speed').click(function(){
		$(".player_toggle_button .speed_list").toggle();
	})*/
	/*倍速播放：操作*/
	$('.disease_info').on('click', '.speed_list_group li', function () {
		_this.view_info_types(true);
		let _time = this.getAttribute('type'),
			_text = this.innerText;
		
		$(".disease_info .speed_list_group").css('display', 'none');
		$(".speed_list_group li").removeClass('active');
		this.setAttribute('class', 'active');
		_this.time_space = Number(_time);
		$(".play_image span").attr('class', 'iconfont iconzanting');
		$(".search_image").text(_text);
		
		_this.timing && clearInterval(_this.timing);
		_this.timing = setInterval(function(){
			_this.next_image();
		}, _this.time_space);
	})
	/*病害区域切换：操作*/
	$('.disease_info').on('click', '.result_list_group li', function () {
		let _text = this.innerText;
		_this.recog_result = this.getAttribute('type');
		
		$(".disease_info .result_list_group").css('display', 'none');
		$(".result_list_group li").removeClass('active');
		this.setAttribute('class', 'active');
		$(".pdds_result").text(_text);
		disease_leaflet.disease_region();
		_this.disease_region();
	})
	/*复原初始帧：操作*/
	$('.disease_player').on('click', '.player_restore', function () {
		_this.current_num = _this.default_num;
		_this.update_image();
	})
	/*全屏视频界面：操作*/
	$('.info_image').on('click', '.full_screen_control', function () {
		SlideList.full_screen(true);
		
		var _type = $('.image_opacity .checkbox_label input')[0].checked;
		if(!_type){
			cesium_player.update();
		}
		cesium_player.change_toggle(_type);
		
	})
	/*历史对比：操作*/
	$('.info_image').on('click', '.history_control', function () {
		$.errorView('功能开发中···');
	})
	
//		_this.request_track();
};

/* 关闭视频界面窗口 */
disease_player.player_close = function(){
	
	playerInterfaceStatus = false;
	
	let _this = disease_player;
	
	_this.view_info_types();
	_this.timing && clearInterval(_this.timing);
	_this.player_closer();
	
	$('.disease_info').fadeOut(100);
	disease_list.position_group_change();
	// disease_map.change_last_point();
	// disease_info.polygon_info(true);
	disease_map.listen_cesium_body('disease_info', false);
	
	var active_dom = Disease.TYPE_LIST.FUNBUTTON.find(function(data){
		return data.ACTIVE == 'active';
	})
	disease_init.player_mode_init(active_dom.ID);
	
}

/*切换信息展示类型*/
disease_player.view_info_types = function(type=false){
	if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION'){
		return;
	}
	
	let class_none = type ? 'info_view' : 'info_view_statistics',
		class_block = type ? 'info_view_statistics' : 'info_view',
		btn_display = type ? 'block' : 'none';
	$('.disease_info .'+class_none).css('display', 'none');
	$('.disease_info .'+class_block).css('display', 'block');
	
	$('.disease_info .player_to_info').css('display', btn_display);
};

/*视频界面关闭时执行*/
disease_player.player_closer = function(){
	
	disease_map.removePlayerPoint();
	removeLineLayer();
	
	// disease_player.remove_entity();
	// disease_group.point_group();
};

/*视频界面图标等变化*/
disease_player.player_icon_change = function(parent=false){
	var _this = this;
	var type = $(".play_image span").hasClass("iconbofang"),
		className = (type && !parent) ? 'iconfont iconzanting' : 'iconfont iconbofang';
	
	$(".play_image span").attr('class', className);
	
	if(type && !parent){
		_this.timing = setInterval(function(){
			_this.next_image();
		}, _this.time_space);
	}else{
		_this.timing && clearInterval(_this.timing);
	}
};

/*每次载入视频界面--都为初始化的模版*/
disease_player.player_start_init = function(){
	
	if(window.three_viewer && window.three_viewer.scene){
		window.three_viewer.scene.removeAllMeasurements();
		window.three_viewer.scene.sceneBG.fg_texture_1.image.src = '';
		window.three_viewer.scene.sceneBG.fg_texture_1.needsUpdate = true;
	}
	
	var title = Disease.TYPE_LIST.TITLE;
	var det_time = disease_info.current_info.det_time || '';
	var _control = `
			<button class="btn btn-default player_to_info" title="返回${title}">
				<span></span>返回${title}
			</button>
			<div class="player_toggle_2">
				<button class="btn btn-default pre_image" title="上一张"></button>
				<button class="btn btn-default play_image" title="播放">
					<span class="iconfont iconbofang"></span>
				</button>
				<button class="btn btn-default next_image" title="下一张"></button>
			</div>
			<button class="btn btn-default download_image" title="下载图片"></button>
			<div class="speed_list">
				<ul class="speed_list_group">
					<li class="" type="1000">0.5x</li>
					<li class="active" type="750">1.0x</li>
					<li class="" type="500">2.0x</li>
				</ul>
				<button class="btn btn-default search_image" title="倍速">倍速</button>
			</div>
			<div class="result_list">
				<ul class="result_list_group">
					<li class="" type="1">${title}标签</li>
					<li class="active" type="2">${title}区域</li>
					<li class="" type="3">隐藏检测结果</li>
				</ul>
				<button class="btn btn-default pdds_result">${title}区域</button>
			</div>
            <div class="image_opacity" style="float: right;padding-top: 18px;margin-top: -10px;display: none;">
                
				<label class="checkbox_label" style="float: left;margin-right: 10px;">
					<input type="checkbox" value="">
					<b class="checkbox_b"></b>
					<span style="float: left;line-height: 18px;">原图</span>
				</label>
				
                <input class="image_opacity_change" style="width: 60px;" type="range" min="0" max="100" value="${cesium_player._alpha}" />
            </div>
	`;
	$('.player_control .player_button').html(_control);
	
	var level = $('.cesium_control .zoom_level a').html(),
		new_level = Number(level);
	if(new_level < 20){
		var height = disease_user.zoomToAltitude(20);
			// center = $.getCenterPoint();
		// _viewer.camera.setView({
		// 	destination: Cesium.Cartesian3.fromDegrees(disease_info.current_info.properties.center_xy[0], disease_info.current_info.properties.center_xy[1], height)
		// })
	}
};

/*进度条初始化插件*/
disease_player.RangeSlider = function(obj){
	var _this = this;
	_this.sliderCfg = {
		min: obj && !isNaN(parseFloat(obj.min)) ? Number(obj.min) : null, 
		max: obj && !isNaN(parseFloat(obj.max)) ? Number(obj.max) : null,
		step: obj && Number(obj.step) ? obj.step : 1,
		value: obj && Number(obj.value) ? obj.value : 1
	};
	
	var $input = $('input.player_speed_range'),
		min = _this.sliderCfg.min,
		max = _this.sliderCfg.max,
		step = _this.sliderCfg.step;
	
	$(".player_speed_current").attr('max',max);
	$(".player_speed_current").attr('min',min);
	$input.attr('max',max);
	$input.attr('min',min);
	
	_this.player_skip();
	
	$input.bind("input", function(e){
		_this.current_num = parseInt(this.value);
		_this.player_skip();
	});
};

/*获取当前病害轨迹点-图像事件*/
var trackBufferResults = {
	'type': 'FeatureCollection',
	'features': []
};
disease_player.request_track = function(type=false){
	
	disease_map.removePlayerPoint();
	disease_map.setZoom(18);
	
	trackBufferResults = {
		'type': 'FeatureCollection',
		'features': []
	};
	playerInterfaceStatus = true;
	
	var _this = this;
	// disease_group.entity_hide();
	
	var trackId = disease_info.current_info.properties.TRACK_ID,
		trackPointId = disease_info.current_info.properties.T_POINT_ID;
	
	if(!trackId){
		$.errorView('未找到对应的图片影像');
		return;
	}
	
	removeLineLayer();
	var _url = config_url.krs + 'v3/track/get/tracks/byTrackIds?dynamicCal=true&trackIds=' + trackId;
	// var _url = 'http://krs.kuandeng.com/krs/v3/track/get/tracks/byTrackIds?dynamicCal=true&trackIds=204427434_20200815093817824';
	
	$.getAjax({
		'url': _url,
		'callback': function(data){
			if(data.code != '0'){
				$.errorView(data.message);
				return;
			}
			let pointList = data.result[0] ? data.result[0].pointList : [];
			if(!pointList.length){
				$.errorView('轨迹点列表获取为空');
				return;
			}
			trackBufferDatas(pointList);
			_this.track_list = newPointList(pointList);
			// _this.track_list = pointList;
			_this.camera_params = data.result[0].cameraParams;
			_this.camera_params.azimuthDelta = data.result[0].azimuthDelta;
			_this.camera_params.pitchDelta = data.result[0].pitchDelta;
			_this.camera_params.rollDelta = data.result[0].rollDelta;
			_this.camera_params.cameraHeight = data.result[0].cameraHeight;
			var index = _this.track_list.findIndex(data => data.trackPointId === trackPointId);
			_this.current_num = (index > -1) ? (index+1) : 1;
			_this.default_num = (index > -1) ? (index+1) : 1;
			_this.RangeSlider({
				min: 1,
				max: _this.track_list.length,
				step: 0.1
			});
			
			var track_data = _this.track_list[_this.current_num - 1];
			// _this.position_point_center(track_data);
		}
	})
	
};

/* 获取轨迹的buffer */
var bufferWidth = 100;
function getBufferPromise(list) {
	return new Promise(function (resolve, reject) {
		var lineArr = [];
		list.forEach((point) => {
			lineArr.push([
				point.x, point.y
			])
		})
		if(!lineArr.length){
			resolve(null);
		}
		
		var gsonline = turf.lineString(lineArr);
		// var buffered = turf.buffer(line, bufferWidth, {units: 'miles'});
		var buffered = turf.buffer(gsonline, bufferWidth, {units: 'meters'});
		
 //        const endindex = gsonline.geometry.coordinates.length - 1;
 //        // 线的起点的左边
 //        var lsl = turf.transformRotate(gsonline, -90, {
 //            pivot: gsonline.geometry.coordinates[0]
 //        });
 //        // 线的起点的右边
 //        var lsr = turf.transformRotate(gsonline, 90, {
 //            pivot: gsonline.geometry.coordinates[0]
 //        });
 //        // 线的终点的左边
 //        var lel = turf.transformRotate(gsonline, 90, {
 //            pivot: gsonline.geometry.coordinates[endindex]
 //        });
 //        // 线的终点的右边
 //        var ler = turf.transformRotate(gsonline, -90, {
 //            pivot: gsonline.geometry.coordinates[endindex]
 //        });
 //        var buffered = turf.buffer(gsonline, 100, {
 //            units: 'meters'
 //        });
 //        // 构建buffer为点featureCollection
 //        var bufferedtoline = turf.polygonToLine({
	// 		"type":"Feature",
	// 		"properties":{},
	// 		"geometry":{
	// 			"type":"Polygon",
	// 			"coordinates":[ buffered.geometry.coordinates[0] ],
	// 		},
	// 	});
 //        let pointsarr = [];
 //        bufferedtoline.geometry.coordinates.forEach((coord) => {
 //            const point = turf.point(coord);
 //            pointsarr.push(point)
 //        })
 //        var points = turf.featureCollection(pointsarr);
 
 //        // 遍历找出4个点(垂线与buffer相交的点)
 //        const four_gline = [lel, lsl, lsr, ler]
 //        let intersectpointarr = [];
 //        four_gline.forEach((i) => {
 //            var intersects = turf.lineIntersect(i, buffered);
 //            const intersectpoint = intersects.features[0];
 //            intersectpointarr.push(intersectpoint);
 //        })
 
 //        let four_index = [];
 //        intersectpointarr.forEach((i) => {
 //            var nearest = turf.nearestPoint(i, points);
 //            four_index.push(nearest.properties.featureIndex);
 //            // console.log(nearest.geometry.coordinates)
 //        })
 
 //        console.log(four_index);
 //        const splicetop = four_index[3] - four_index[0];
 //        const splicebtm = four_index[1] - four_index[2];
 //        const coordinates = buffered.geometry.coordinates[0];
 //        coordinates.splice(four_index[0] + 1, splicetop - 1);
 //        coordinates.splice(four_index[2] + 2 - splicetop, splicebtm - 1);
		
	// 	coordinates.push(
	// 		coordinates[0]
	// 	)
		
 //        console.log(coordinates);
		
		
		
		
		var coordinates = buffered.geometry.coordinates[0];
		var polygonOpt = [];
		
		coordinates.forEach( d => {
			polygonOpt.push( d[0] + ' ' + d[1] );
		})
		
		var polygonStr = 'POLYGON((' + polygonOpt.join(',') + '))';
		resolve(polygonStr);
	});
}

/* 获取轨迹buffer内的数据 */
function getBoundsDataPromise(buffer) {
	return new Promise(function (resolve, reject) {
		let dataVersion = disease_user.current_adcode.dataVersion;
		let dataCode = Disease.TYPE_LIST.DATACODE;
		
		let newDataCode = (dataCode == 'pd') ? 'pd_show' : dataCode;
		
		let url = config_url.pdds + 'data/' + newDataCode + '/query';
		let currentInfo = disease_info.current_info.properties;
		let linkCode = currentInfo.LINK_CODE;
		let trackId = currentInfo.TRACK_ID;
		let body = {
			'ops': [{
				'k': 'DATA_VERSION',
				'v': dataVersion,
				'op': 'eq'
			},{
				'k': 'LINK_CODE',
				'v': linkCode,
				'op': 'eq'
			}],
			'returnFields': [
				// 'CENTROID', 'GEOM', 'ID', 'TYPE', 'SUBTYPE', 'TRACK_ID', 'adcode', '_OID_',  'T_POINT_ID'
			],
			'polygon': buffer
		}

        $.postAjax({
            'url': url,
            'token': true,
            'data': body,
            'callback': function (data) {
                if (data.code != '0') {
                    $.errorView('轨迹相关联数据获取失败：' + data.message);
                    resolve( {} );
                } else {
                    resolve( data.result.data );
                }
            }
        })
	});
}

/* 获取当前轨迹buffer内的数据--外扩10米 */
function  trackBufferDatas(list){
	playerInterfaceStatus && getBufferPromise(list).then((buffer) => {
		
		playerInterfaceStatus && getBoundsDataPromise(buffer).then((data) => {
			
			var features = data.features || [];
			features.forEach( d => {
				var new_data = disease_list.dataInfoFormat(d);
				trackBufferResults.features.push( new_data );
			} )
			
			// playerCounterThrow();
			disease_init.image_type_go();
		})
		
	})
}


/*获取当前轨迹buffer内的数据，并进行反投显示*/
function playerCounterThrow(){
	
	console.log(trackBufferResults)
	
	var catch_distance = {};
	for(var i=0; i<trackBufferResults.length; i++){
		var properties = trackBufferResults[i].properties,
			id = properties.ID,
			new_id = properties.layer_type + '_' + properties.ID,
			ways = {'_nodes': properties.locs};
		
		catch_distance[new_id] = {
			'ways': ways,
			'properties': properties
		};
	}
	
	this.entitys = catch_distance;
	this.entitys_utm = trackBufferResults;
	// this.get_projection(trackpoint);
	
	disease_init.image_type_go();
};


disease_player.getTrackBufferResults = function(){
	return trackBufferResults;
}

/* 获取当前视频界面的开启状态 */
disease_player.isPlayerInterfaceStatus = function(){
	return playerInterfaceStatus;
}

/*跳帧事件*/
disease_player.player_skip = function(){
	if( 0<this.current_num && this.current_num<=this.track_list.length ){
		var $input = $('input.player_speed_range'),
			_max = $('.player_speed_range').attr('max'),
			_ratio = (this.current_num / _max) * 100;
		
		$input.attr('value', this.current_num);
		$input.css( 'background-size', _ratio + '% 100%' );
		this.update_image();
	}
};

/*下一帧事件*/
disease_player.next_image = function(){
	if(this.current_num < this.track_list.length){
		this.current_num ++;
		this.player_skip();
	}else{
		$.errorView('当前为最后一帧');
		this.player_icon_change(true);
		return
	}
};

/*上一帧事件*/
disease_player.pre_image = function(){
	if(this.current_num > 1){
		this.current_num --;
		this.player_skip();
	}else{
		$.errorView('当前为第一帧');
		return
	}
};

/*更新图片事件*/
disease_player.update_image = function(type){
	var token = $.getCookie('token') || '';
	if(!token){
		$.errorView('token不存在，请登录！');
		let _url = './login.html';
		window.open(_url, '_self');
	}
	
//		this.catchPotreeImage(this.track_list);
	
	$(".player_speed_current").val(this.current_num);
	var _index = this.current_num - 1,
		track_data = this.track_list[_index];
//		$('.player_image svg image')[0].setAttribute('xlink:href', point_url);
//		$('.player_image img')[0].setAttribute('src', point_url);
	/*$.getImageToken(
		$('.player_image img'),
		point_url
	);*/
	
	
	var data_type = $('.player_toggle').attr('data-type');
	if(data_type == '1' && this.current_num != this.default_num){
		$('.player_restore').css('display', 'block');
	}else{
		$('.player_restore').css('display', 'none');
	}
	this.position_icon_change(track_data,type);
	this.mark_type_init();
	if(disease_init.play_image_type == 'visua_up_map'){
		disease_init.image_type_go(type);
		return;
	}
	this.setImageUrlPotree();
};

/*播放视频时--标记位置的按钮状态发生改变*/
disease_player.mark_type_init = function(){
	$('.menu_manage .menu_list_child .menu_mark').removeClass('active');
	let _track = this.track_list[this.current_num - 1] || {},
		has_class = $('.menu_manage .menu_collect').hasClass('active'),
		map_center = _track.map_center || [],
		id = '';
	
	if(!map_center.length){
		return;
	}
	for(let i=0; i<disease_map.mark_points.length; i++){
		let coordinate = disease_map.mark_points[i].geometry.coordinates,
			this_id = disease_map.mark_points[i].properties.ID,
			point = $('.markLabel_' + this_id);
		
		if( point.length && (coordinate[0] == map_center[0]) && (coordinate[1] == map_center[1]) ){
			id = this_id;
		}
	}
	if(!has_class){
		$('.menu_manage a.iconshenglvehao').removeClass('active');
	}
	if(id){
		$('.menu_manage a.iconshenglvehao').addClass('active');
		$('.menu_manage .menu_list_child .menu_mark').addClass('active');
	}
	$('.menu_manage .menu_list_child .menu_mark').attr('name', id);
};

/*新增定位点--跟随图片移动*/
disease_player.position_icon_change = function(data){
	var rotation = null,
		center = [data.x, data.y, data.z],
		azimuth = data.azimuth - 90,
		_index = this.current_num - 1,
		this_point = [data.x, data.y, data.z],
		
		last_index = this.current_num - 2,
		last_data = this.track_list[last_index] || null,
		last_point = last_data ? [last_data.x, last_data.y, last_data.z] : null,
		
		next_data = this.track_list[this.current_num] || null,
		next_point = next_data ? [next_data.x, next_data.y, next_data.z] : null,
		
		point_1 = next_point ? this_point : last_point,
		point_2 = next_point ? next_point : this_point,
		icon_url = './Apps/Dist/Img/position.png';

	/*根据当前病害中心点,计算出往前6米的坐标最近的trackpoint点*/
		// if(_index > 0){
		var point = iD.util.getLocationPoint(point_2, point_1, 0.3),
			new_data = [];
		center = [point[0], point[1], point[2]];
		for(var i=0; i<this.track_list.length; i++){
			if(i < _index){
				new_data.push( this.track_list[i] );
			}
		}
		var distance_data = $.getNearPointList(point, new_data);
		if(distance_data){
			center = [distance_data.x, distance_data.y, distance_data.z];
		}
		// }

	if(next_data){
		rotation = $.courseAngle(point_1[0], point_1[1], point_2[0], point_2[1]);
	}
	disease_map.addPlayerPoint({
		'properties': data,
		'coordinates': center,
		'rotation': rotation
	})
	
	data['map_center'] = center;
	// this.position_point_center(data);
//		this.get_projection(data);
	// this.get_distance(data);
};

disease_player.getNorthPointByDistance = function(position, distance) {
	//以点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
	var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
	return Cesium.Matrix4.multiplyByPoint(localToWorld_Matrix, Cesium.Cartesian3.fromElements(0, distance, 0), new Cesium.Cartesian3())
};

/*病害识别结果: 隐藏显示*/
disease_player.player_recog = function(){
	var _index = this.current_num - 1,
		track_data = this.track_list[_index];
	
	this.get_distance(track_data);
};

// 获取最近的距离
function new_point_distance(trackpoint, locs, type){
	var distance = 1000,
		point_distance = 0,
		_position = {
			'lat1': trackpoint.map_center[0],
			'lng1': trackpoint.map_center[1],
			'lat2': null,
			'lng2': null
		},
		new_locs = locs;
	for(var s=0; s<new_locs.length; s++){
		_position.lat2 =  new_locs[s][0];
		_position.lng2 =  new_locs[s][1];
		point_distance = $.disTance(_position);
		
		if(point_distance < distance){
			distance = point_distance;
		}
	}
	
	return distance;
	
}

/*判断当前帧十米以内的病害,并执行反投到视频界面*/
disease_player.get_distance = function(trackpoint){
	
	console.log(trackBufferResults)
	
  	var trackPointId = trackpoint.trackPointId,
		catch_distance = {},
		catch_distance_utm = {
			'features': [],
			'type': 'FeatureCollection'
		};
	window.lines = [];
	
	for(var i=0; i<disease_list.catchList.length; i++){
		var _locs = disease_list.catchList[i].locs;
		var properties = disease_list.catchList[i].properties;
		
		// var distance = new_point_distance(trackpoint, _locs, properties.layer_type);
		
		var id = properties.ID,
			new_id = properties.layer_type + '_' + properties.ID,
			locs = $.cesium_range(properties.GEOM),
			ways = {'_nodes': locs};
		
		// if(distance < this.max_distance){
			// if(properties.layer_type != 'Point'){
			// 	var new_z = iD.util.pt2LineDist2(locs, trackpoint.map_center),
			// 		new_loc = [new_z.x, new_z.y, new_z.dis],
			// 		floc = locs[new_z.i],
			// 		tloc = locs[new_z.i + 1],
			// 		new_result = iD.util.getBetweenPointLoc(floc, tloc, new_loc);
				
			// 	var height_dis = Math.abs( new_result[2] - trackpoint.map_center[2] );
			// 	if(height_dis > 2){
			// 		continue
			// 	}
			// }
			catch_distance[new_id] = {
				'ways': ways,
				'properties': properties
			};
			catch_distance_utm.features.push(
				disease_list.catchListUTM[i]
			)
		// }
	}
	this.entitys = catch_distance;
	this.entitys_utm = catch_distance_utm;
	// this.get_projection(trackpoint);
	
	disease_init.image_type_go();
};

// 删除地图病害面
disease_player.remove_entity = function(){
	// if(disease_info.info_ways){
	// 	_viewer.entities.remove(disease_info.info_ways);
	// 	disease_info.info_ways = null;
	// }
	if(!this.current_disease){
		return;
	}
	for(var id in this.current_disease){
		// _viewer.entities.removeById(id);
		// _viewer.entities.remove(this.current_disease[id]);
		_viewer.entities.removeById(this.current_disease[id].id);
		delete this.current_disease[id];
	}
}

/*实时更新反投*/
disease_player.get_projection = function(trackpoint, datas){
	
	disease_player.remove_entity();
	
	for(var id in this.entitys){
		/*地图反投*/
		var ways = this.entitys[id].ways;
		if(ways._nodes && (ways._nodes.length > 0)){
			var map_ways = null;
			var layer_type = this.entitys[id].layer_type;
			var properties = this.entitys[id].properties;
			var measurements = [];
			properties['new_ID'] = properties.layer_type + '_' + properties.ID;
			/*地图显示*/
			if(!this.current_disease[id]){
				
				if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
					layer_type = this.entitys[id].properties.range_type || this.entitys[id].properties.layer_type;
				}
				
				map_ways = $.add_layer({
					// 'type': 'position',
					'data_type': 'position',
					'layer_type': layer_type,
					'result': {
						'properties': this.entitys[id].properties
					}
				})
				// map_ways = $.add_polygon({
				// 	'type': 'position',
				// 	'result': {
				// 		'properties': {
				// 			'ID': ('polygon_'+id),
				// 			'GEOM': this.entitys[id].properties.locs
				// 		}
				// 	}
				// })
				this.current_disease[id] = map_ways;
			}
		}
	}
	
	$.cesium_refresh();
};

/*采集图视频--反投显示*/
disease_player.player_projection = function(){
	let datas = this.entitys || {};
	
	// window.three_viewer.scene.removeAllMeasurements();
	let measurements = [];
	
	if (!task_line_layers_json['layer_way'] && !task_line_layers_json["layer_label"]) {
		showLineLayer(
			trackBufferResults
		)
	}
	
	
	playerRender();
	
	// disease_player.disease_region();
};

/*实时定位点在当前视野范围内*/
disease_player.position_point_center = function(data){
	// var bbox = $.getBounds(),
	// 	point = {
	// 		lng: data.x,
	// 		lat: data.y
	// 	};
	
	// if(!bbox){
	// 	return;
	// }
	
	if(data.map_center){
		point = {
			lng: data.map_center[0],
			lat: data.map_center[1]
		};
	}
	
	var isPointInBbox = $.isPointInRect(point, bbox),
		z_height = _viewer.camera.positionCartographic.height,
		center = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z_height);
	
	if(!junge){
		_viewer.camera.setView({  
			destination: center
		})
	}
	/*if(type){
		_viewer.camera.setView({  
			destination: center
		})
	}else if(!isPointInBbox){
		_viewer.camera.setView({  
			destination: center
		})
	}*/
};





disease_player.cesiumPlayer_init = function(){
    cesium_player.playerInit();
    cesium_player._alpha = 100;
}
disease_player.three_init = function(){
	
	var canvas_w = $('#canvas_three').width,
		canvas_h = $('#canvas_three').height,
		aspect = canvas_w / canvas_h;
	window.camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);
	window.scene = new THREE.Scene();
    var backgoundImage = new Image();
	//scene.background = new THREE.Color(0xFFFFFFFF);
	//
	var light = new THREE.AmbientLight(0xffffff, 1);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);
	//
	// window.axis = new THREE.AxisHelper();
	// scene.add(axis);
	//
	var manager = new THREE.LoadingManager();
	manager.onLoad = animate;
	//
	disease_player.backgroundTexture = new THREE.Texture();
	// backgoundImage.src = 'http://krs-dev.kuandeng.com/krs/image/get?trackPointId=204393125_20191202092511346284&type=00&seq=005&imageType=jpg&token=Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwZGRzIiwiZXhwIjoxNTk4MjY4NzU5fQ.-U0-f52NZRgsXECxmfENMa7nOmvPjF6Hp51QcrtXvOQqLcOG1m8nl103G_jgT94zakGiCkTYtFxCz2GjJYx9fw';

	backgoundImage.src = '';
	
	disease_player.backgroundTexture.image = backgoundImage;
	disease_player.backgroundTexture.minFilter = THREE.LinearFilter;
	backgoundImage.onload = function () {
		//backgroundTexture=new THREE.Texture();
		//backgroundTexture.image = backgoundImage.src;
		disease_player.backgroundTexture.needsUpdate = true;

	};
	var backgroundMaterial = new THREE.MeshBasicMaterial({
		map: disease_player.backgroundTexture,
		transparent: true,
		opacity: 1

	});
	var backgroundMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(2, 2, 0),
		backgroundMaterial
	);
	backgroundMesh.needsUpdate = true;
	backgroundMesh.material.depthTest = false;
	backgroundMesh.material.depthWrite = false;

	window.backgroundScene = new THREE.Scene();
	//
	window.backgroundCamera = new THREE.Camera();
	//
	window.backgroundScene.add(window.backgroundCamera);
	window.backgroundScene.add(backgroundMesh);
	//光线跟踪
	var raycaster = new THREE.Raycaster();
	raycaster.linePrecision = 3;
	//渲染器
	window.renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setPixelRatio(2);
	// renderer.setSize(canvas_w, canvas_h);
	renderer.autoClear = false;
	renderer.precision = "highp";
	
	var container = document.getElementById("canvas_three");
	container.appendChild(renderer.domElement);
	
	// var viewer = new Potree.Viewer(document.getElementById("canvas_three"));
	// viewer.setBackground(null);
	
	// window.three_viewer = viewer;
	// window.three_viewer.background = 'gradient';
	// viewer.setEDLEnabled(false);
	// viewer.setFOV(60);
	// viewer.setPointBudget(1 * 1000 * 1000);
	// viewer.loadSettingsFromURL();
	// viewer.setDescription("");
	// viewer.loadGUI(() => {
	// 	viewer.setLanguage('en');
	// });
};

/*添加面*/
disease_player.addPotreePolygon = function(way) {
	let areaType = (disease_player.recog_result == '2') ? true : false,
		textType = (disease_player.recog_result == '1') ? true : false;
	
	let datas = way.datas,
		cn_type = datas.properties._cn_type,
		nodes = datas.ways._nodes;
	
	let measure = new Potree.Measure({
		color: 'rgb(255, 0, 0)',
//			lineType:1,
		showText: textType,
		labelColor: {
			borderColor: { r: 0, g: 0, b: 0, a: 0 },
			backgroundColor:{ r: 0, g: 0, b: 0, a: 0 },
			textColor:{ r: 236, g: 58, b: 78, a: 1.0 }
		},
		pointColor: 'rgb(255, 0, 0)'
	});
	measure._render = true;
	measure.closed = false;
	measure.showDistances = false;
	measure.showHeight = false;
	measure.showAngles = false;
	measure.name = way.id;
	measure.showArea = true;
	measure.show = areaType;
	measure.text = cn_type;
	
//		var _height = way.datas.ways._nodes.nodes[0][2];
	let pos = null,
		node = null,
		node_id = null;
	for (let i = 0; i < nodes.length; i++) {
		node = nodes[i];
		node_id = 'node_' + i;
		pos = lonlatToUTM(node[0], node[1]);
		measure.addMarker(new THREE.Vector3(pos.x, pos.y, node[2]), { id: node_id, update: false });
	}
	measure._entityId = way.id;
	// scene.addMeasurement(measure);
	
	return measure;
};


/* 采集图点击信息--病害跳转 */
disease_player.disease_come_info = function(id){
	let infos = disease_list.catchList || [],
		this_info = infos.filter(function(data){
		   return (data.properties.ID == id)
		});
	if(!this_info.length){
		$.errorView('获取信息失败');
		return;
	}
	let _index = this_info[0].index;
	disease_map.removePlayerPoint();
	disease_info.come_to_info(_index, true, true);
};

/*病害区域功能操作的相关联逻辑处理*/
disease_player.disease_region = function(){
	if(!window.scene){
	// if(!window.three_viewer || !window.three_viewer.scene){
		return;
	}
	let types = {
		'1': 'layer_label',
		'2': 'layer_way',
		'3': null
	}
	let layer_id = types[disease_player.recog_result];
	toggleLineLayer(layer_id);
	playerRender();
};

disease_player.setImageUrlPotree = function() {
	
	var new_width =  $('#canvas_three').width();
	var new_height =  $('#canvas_three').height();
	window.renderer.setSize(new_width, new_height);
	
	let _index = this.current_num - 1,
		trackpoint = this.track_list[_index],
		track_point_id = trackpoint.trackPointId,
		point_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
		// point_url = config_url.krs + 'image/get?token=' + window.token + '&trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
	
	var K = projection.cameraParams();
	iD.util.locationPotree(trackpoint, K);
	// window.three_viewer.image_url = point_url;
//		window.three_viewer.setBGImageUrl(point_url);
	
	// let obj = window.three_viewer;
	
	console.log(trackpoint)
	console.log(this.entitys_utm)
	
	$.getImageToken(null, point_url, function(image){
		if ( disease_player.backgroundTexture && disease_player.backgroundTexture.image ) {
		// if (obj.scene.sceneBG != null && obj.scene.sceneBG.fg_material_1 != null) {
			var _src = image;
			if(image.response){
				_src = URL.createObjectURL(image.response);
			}
            // disease_player.backgroundTexture.image.crossOrigin = "";
			// disease_player.backgroundTexture.image.src = point_url;
			disease_player.backgroundTexture.image.src = _src;
			playerRender();
			// obj.scene.sceneBG.fg_texture_1.image.src = _src;
			// obj.scene.sceneBG.fg_texture_1.needsUpdate = true;
			
		}
	})
};

var playerRenderTime = null;
function playerRender(){
	
	playerRenderTime && clearTimeout(playerRenderTime);
	
	playerRenderTime = setTimeout(function(){
		renderer.clear();
		renderer.render(window.backgroundScene, window.backgroundCamera);
		renderer.render(window.scene, window.camera);
	}, 50)
	
}

/*缓存巡查影像后续使用的图片*/
disease_player.catchPotreeImage = function(alldata){
	var _this = this,
		total_length = alldata.length - 1,
		loadedimages = 0,
		iserr = false,
		init_index = _this.current_num - 1,
		start_index = ((_this.current_num - _this.catch_count) > -1) ? (_this.current_num - _this.catch_count) : 0,
		end_index = ((_this.current_num + _this.catch_count) < total_length) ? (_this.current_num + _this.catch_count) : total_length,
		length = end_index - start_index + 1;
	
	for (var i = start_index; i <= end_index; i++) {
		var img = new Image(),
			_data = alldata[i],
			track_point_id = _data.trackPointId,
			_src = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg&token='+window.token;
		
		img.src = _src;
		if (img.complete) {  		// 如果图片已经存在于浏览器缓存，直接调用回调函数
			imageloadpost();
			continue; 				// 直接返回，不用再处理onload事件
		}
		img.onload = function () {
			imageloadpost();
		}
		img.onerror = function () {
			iserr = true;
			imageloadpost();
		}
	}
	
	function imageloadpost() {
		loadedimages++;
		if (loadedimages == length) {
			if(iserr){
				console.warn('视频图片未加载全');
			}
		}
	}
	
};

export {
    disease_player
};
