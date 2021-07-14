

import {
    disease_list
} from './disease_list.js';
import {
    disease_player
} from './disease_player.js';

var disease_group = {};
/*聚类功能根据ZOOM等级变化*/
disease_group.point_group = function(){
	var zoom = _viewer.camera.mathZoom;
	
	if(!disease_list.data_point || !disease_list.data_point.length){
		return;
	}
	var entities = _viewer.entities;
	this.entity_hide();
	if(disease_player.position_icon){
		return;
	}
	if(zoom > 17){
		for(var i=0; i<disease_list.data_point.length; i++){
			disease_list.data_point[i].show = true;
		}
	}else if(15 < zoom && zoom < 18){
//		}else if(14 < zoom && zoom < 18){
		for(var mp_code in disease_list.data_groups.mp_code){
			var _entity = entities.getById(mp_code);
			if(_entity){
				_entity.show = true;
			}
		}
	}else if(11 < zoom && zoom < 16){
//		}else if(11 < zoom && zoom < 15){
		for(var link_code in disease_list.data_groups.link_code){
			var _entity = entities.getById(link_code);
			if(_entity){
				_entity.show = true;
			}
		}
	}else{
		for(var road_code in disease_list.data_groups.road_code){
			var _entity = entities.getById(road_code);
			if(_entity){
				_entity.show = true;
			}
		}
	}
	$.cesium_refresh();
};

/*隐藏entity覆盖物*/
disease_group.entity_hide = function(type = false){
	var entities = _viewer.entities;
	for(var i=0; i<entities.values.length; i++){
		if(!entities.values[i]._position_type && !entities.values[i]._mark_type && !entities.values[i]._data_type){
			entities.values[i].show = type;
		}
	}
	$.cesium_refresh();
};

/*聚类功能初始化*/
disease_group.list_group = function(){
	disease_list.data_groups.road_code = _.groupBy(disease_list.catchList, function (n) {
		return n.properties.LINK_CODE; 
	});
	disease_list.data_groups.link_code = _.groupBy(disease_list.catchList, function (n) {
		var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1;
		return new_code;
	});
	disease_list.data_groups.mp_code = _.groupBy(disease_list.catchList, function (n) {
		var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1 + '_' + n.properties.mp_codes_2;
		return new_code;
	});
//		window.data_groups = disease_list.data_groups;
	
	/*按道路聚类*/
	var _height = 1;
	for(var road_code in disease_list.data_groups.road_code){
		_height += 30;
		var links = disease_list.data_groups.road_code[road_code],
			length = links.length.toString().length,
			icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
			width = 36 + (length - 1) * 9;
		
		var center = $.getNearPoint(links);
		$.add_group_billboard({
			'positions': center,
			'mp_code': road_code,
			'properties': links,
			'icon_url': icon_url,
			'icon_length': length,
			'height': _height,
			'width': width,
			'links': links
		})
	}
	
	/*按公里桩聚类*/
	var _heights = {};
	for(var link_code in disease_list.data_groups.link_code){
		
		var roadcode = link_code.split('_')[0] || '';
		if(_heights[roadcode]){
			_heights[roadcode] += 3;
		}else{
			_heights[roadcode] = 1;
		}
		
		var links = disease_list.data_groups.link_code[link_code],
			length = links.length.toString().length,
			icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
			width = 36 + (length - 1) * 9;
		
		var center = $.getNearPoint(links);
		$.add_group_billboard({
			'positions': center,
			'mp_code': link_code,
			'properties': links,
			'icon_url': icon_url,
			'icon_length': length,
			'height': _heights[roadcode],
			'width': width,
			'links': links
		})
	}
	
	/*按百米桩聚类*/
	_heights = {};
	for(var mp_code in disease_list.data_groups.mp_code){
		
		var mapcode = mp_code.split('_')[1] || '',
			linkcode = mp_code.split('_')[0] || '',
			height_code = linkcode + '_' + mapcode;
		if(_heights[height_code]){
			_heights[height_code] += 3;
		}else{
			_heights[height_code] = 1;
		}
		
		var codes = disease_list.data_groups.mp_code[mp_code],
			length = codes.length.toString().length,
			icon_url = './Apps/Dist/Img/label_background_'+ length +'.png',
			width = 36 + (length - 1) * 9;
		
		var center = $.getNearPoint(codes);
		$.add_group_billboard({
			'positions': center,
			'mp_code': mp_code,
			'properties': codes,
			'icon_url': icon_url,
			'icon_length': length,
			'height': _heights[height_code],
			'width': width,
			'links': codes
		})
	}
	this.point_group();
};

export {
    disease_group
};

// module.exports = disease_group;


