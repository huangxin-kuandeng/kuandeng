/**
 * 病害信息详情界面
 */

import {
    disease_player
} from './disease_player.js';
import {
    disease_cesium
} from './disease_cesium.js';
import {
    disease_list
} from './disease_list.js';
import {
    disease_leaflet
} from './disease_leaflet.js';

var disease_info = {};

disease_info.current_info = null;	//当前所打开病害的详情信息
disease_info.info_ways = null;		//进入详情时，地图上显示的病害
disease_info.jump_type = false;		//进入详情时，地图上显示的病害

/*进入详情页时--不限于各种方式*/
disease_info.come_to_info = function(result, type=false, junge=false, change_type=false){
	disease_info.jump_type = false;
	if(!change_type){
		disease_player.recog_result = '2';
	}
	this.info_init(result, type, junge, change_type);
	
	let display = $('.disease_info').css('display');
	if(display == 'none'){
		$('.disease_info').fadeIn(100, function(){
			disease_cesium.listen_cesium_body('disease_info', true);
			disease_player.request_track(true);
		});
	}else{
		disease_player.request_track(true);
	}
};

disease_info.info_init = function(result, type=false, junge=false, change_type=false) {

//		let ratio_width = 620 / 2448,
//			ratio_height = ratio_width * 2048,
//			_height = Number(ratio_height);

//		$('.disease_info .video_image').css('height', _height);
//		$('.disease_player_body .player_image #canvas_three').css('height', _height);
	
	this.current_info = result;
	
	disease_list.list_toggle(type, junge);
	disease_leaflet.visua_up_map_init('visua_up_map');
	/*this.polygon_info();
	disease_list.list_toggle(type, junge);*/
	var token = $.getCookie('token') || '';
	if(!token){
		$.errorView('token不存在，请登录！');
		let _url = './login.html';
		window.open(_url, '_self');
	}
	
	let type_list = window.Disease.TYPE_LIST.TYPES;
	let properties = this.current_info.properties || {},
		info_view_type_2 = properties.mp_codes_0 + ' ' + properties.mp_codes_1 + properties.mp_codes_2 + ' ' + properties.cn_up_down,
		lane_no = properties.LANE_NO || '',
		track_point_id = properties.T_POINT_ID,
		list_key = properties[type_list.KEY],
		this_info = Disease.TYPE_LIST.TYPES.VALUES[list_key] || {'INFO': []},
		
		_area = properties.AREA || '0.0',
		switch_area = Number(_area),
		info_view_result = [],
		track_image_url = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg';
	
	console.log(properties);
	this.info_statistics(properties);
	
	if(!change_type){
		disease_player.player_start_init();
	}
	
	/*进入详情页时,初始化展示信息*/
	$('.pdds_id').html(properties.ID);
	$('.pdds_types').html(properties._cn_type);
	$('.view_level').html(properties._cn_subtype);
	$('.info_view_type_2').html(info_view_type_2);
	$('.info_view_type_3').html(properties.update_time);
	
	if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
		switch_area = '损坏面积: ' + Number(switch_area.toFixed(2)) + '平方米';
		info_view_result.push(switch_area);
	}else if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION'){
		var type_value = type_list.VALUES[properties.TYPE].SUBTYPE[properties.SUBTYPE];
		switch_area = '子类: ' + type_value;
		info_view_result.push(switch_area);
		
		if(properties.TYPE == '701' || properties.TYPE == '702'){
			let length_v = Number(properties.LENGTH) || '';
			let length_n = length_v ? Number( length_v.toFixed(2) ) : '-';
			let length_t = '长度: ' + length_n + 'm';
			info_view_result.push(
				length_t
			);
		}
	}
	
    /*整合不同病害所需要展示的详情信息*/
    for(var i=0; i<this_info.INFO.length; i++){
        var _id = this_info.INFO[i].ID,
            _val = this_info.INFO[i].VAL,
            _type = this_info.INFO[i].TYPE,
            _length = this_info.INFO[i].LENGTH,
            ext_info = this_info.INFO[i].EXT_INFO,
            valInfo = {};
        if(ext_info){
            valInfo = properties[ext_info] || {};
        }else{
            valInfo = properties || {};
        }
        var _name = this_info.INFO[i].NAME,
            _newval = valInfo[_id] || '-',
            newVal = _val ? (valInfo[_id] || '0.0') : _newval,
            switch_val = _val ? Number(newVal) : newVal;
        
        if(_type){
            switch_val = switch_val * 1000;
        }
        if(_length){
            switch_val = switch_val.toFixed(_length);
            switch_val = Number(switch_val);
        }
        
        var _text = _name + ': ' + switch_val + _val;
        info_view_result.push(_text)
    }
	
	
	
//		$.getImageToken(
//			$('.disease_info .info_image img'),
//			track_image_url
//		);
	
	let param_html = `
		${info_view_result.map(f => `
			<span>${f}</span>
		`).join('')}
	`;
	$('.info_view .info_view_param').html(param_html);
	
	$('.menu_list ul li').removeClass('active');
	this.pd_label_types();
};

/*当前病害百米桩统计*/
disease_info.info_statistics = function(properties){
	if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION'){
		return;
	}
	$('.info_view_statistics .statistics_list').html('');
	let _url = config_url.pdds + 'data/stat/pd/countGroup',
		map_code_param = {'groupKeys': ['TYPE'],'ops': [{'k': 'MP_CODE','v': properties.MP_CODE,'op': 'eq'}]};
	
	$.postAjax({
		url: _url,
		data: map_code_param,
		callback: function(data){
			let type_arr = data.result || [],
				_texts = [];
			for(let i=0; i<type_arr.length; i++){
				let _type = type_arr[i].TYPE,
					_count = type_arr[i].count,
					_info = Disease.TYPE_LIST.TYPES.VALUES[_type] || {},
					_text = (_info.NAME || _type) + ' ' + _count + '例';
				
				_texts.push(_text);
			}
			let code_html = `
				${_texts.map(f => `
					<p>${f}</p>
				`).join('')}
			`;
			$('.info_view_statistics .statistics_list').html(code_html);
		}
	})
};

/*详情打开时,显示当前病害的范围在地图上*/
disease_info.polygon_info = function(type=false){
	var geom = this.current_info.properties.locs,
		id = this.current_info.properties.T_POINT_ID;
	if(this.info_ways){
		_viewer.entities.remove(this.info_ways);
	}
	
	disease_player.remove_entity();
	/*地图显示*/
	if(!type){
		this.info_ways = $.add_polygon({
			'type': 'position',
			'result': {
				'properties': {
					'ID': ('polygon_'+id),
					'locs': geom
				}
			}
		})
	}
	$.cesium_refresh();
};

/*获取当前病害是否被收藏*/
disease_info.pd_label_types = function(){
	$('.menu_manage a.iconshenglvehao').removeClass('active');
	var pd_id = this.current_info.properties.ID,
		pd_url = config_url.pdds + "data/pd_label/query",
		pd_body = {
			"ops": [
				{
					"k": "PD_ID",
					"type": "string",
					"v": pd_id,
					"op": "eq"
				}
			]
		};
	$.postAjax({
		url: pd_url,
		data: pd_body,
		callback: function(data){
			let features = (data.result && data.result.data) ? data.result.data.features.length : 0
			if(features){
				$('.menu_list .menu_list_child .menu_collect').addClass('active');
				$('.menu_manage a.iconshenglvehao').addClass('active');
			}
		}
	})
};

export {
    disease_info
};

// module.exports = disease_info;


