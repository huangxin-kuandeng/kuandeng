

/*病害-leaflet地图插件*/

import {
    disease_player
} from './disease_player.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_list
} from './disease_list.js';

import { visuaUpMapInit as mapboxMapInit } from './leftOrthograph/map_init.js';
import { addLayers as mapboxAddLayers } from './leftOrthograph/addLayers.js';

var disease_leaflet = {};
var lastInfoId = null;
// var map;
var polygons = {};
var last_polygon = null;

disease_leaflet.visua_up_map_init = function(containerID , _mapOption){
	lastInfoId = null;
	return mapboxMapInit(containerID, _mapOption);
}

/*正射图--反投显示*/
disease_leaflet.road_player = function(type){
	let _this = this;
	if(!window.mbSideMap){
		setTimeout(function(){
			_this.road_player();
		}, 300)
		return;
	}
	
	last_polygon = null;
	
	let datas = disease_player.getTrackBufferResults(),
		features = datas.features || [],
		_index = disease_player.current_num - 1,
		_view = disease_info.current_info,
		current_id = disease_info.current_info.properties.ID,
		track = disease_player.track_list[_index],
		_center = [track.x, track.y];
	
	
	
	if( type && disease_player.current_num == disease_player.default_num ){
		_center = _view.center_xy;
	}
	
	if(!disease_info.jump_type){
		disease_info.jump_type = true;
	}else{
		window.mbSideMap.setCenter( [_center[0], _center[1]] );
	}
	
	if(lastInfoId == current_id){
		return;
	}
	polygons = {};
	if(features.length){
		lastInfoId = current_id;
	}
	
	mapboxAddLayers(features, current_id, window.mbSideMap, resultToggle);
};

/*病害区域功能操作的相关联逻辑处理*/
disease_leaflet.disease_region = function(){
	resultToggle();
};

function toggleLayerVisible(type){
	let polygons = window.mbSideMap.getLayer('polygons'),
		polylines = window.mbSideMap.getLayer('polylines');
	polygons && window.mbSideMap.setLayoutProperty('polygons', 'visibility', type);
	polylines && window.mbSideMap.setLayoutProperty('polylines', 'visibility', type);
}

/* 切换显示检测结果 */
function resultToggle(){
	let resultType = $('.result_list_group li.active').attr('type'),
		visible = (resultType == '2') ? 'visible' : 'none',
		display = (resultType == '1') ? 'block' : 'none';
	
	toggleLayerVisible(visible);
	$('.geometriesLabel').css('display', display);
}

export {
    disease_leaflet
};

// module.exports = disease_leaflet;


