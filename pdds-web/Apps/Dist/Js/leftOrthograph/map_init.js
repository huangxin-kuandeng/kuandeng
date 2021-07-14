
import {
    disease_player
} from '../disease_player.js';
import {
    disease_info
} from '../disease_info.js';

var lastInfoId = null;
// var map;
var polygons = {};
var last_polygon = null;
var bufferResults = null;

/**
 * @description 正射图-初始化
 * @param {*string} containerID dom的id值
 */
export function visuaUpMapInit(containerID){
	bufferResults = disease_player.getTrackBufferResults();
	
	var _view = disease_info.current_info;
	// let mapboxgl.accessToken = token;
	let	mainshootUrl = config_url.mainshoot + '&key=' + _view.properties.TRACK_ID;	//   key值具体字段名待定，取值为 disease_info.current_info.properties.TRACK_ID; 

		/*图源信息 */
	let mpstyle = {
		"version": 8,
		"sources": {
			"raster-mainshoot": {
				"type": "raster",
				'tiles': [mainshootUrl],
				"tileSize": 256,
				"zoom": 23,
				"minzoom": 22,
				"maxzoom": 24,
			}
		},
		"layers": [
			{
				"id": "raster-mainshoot",
				 "type": "raster",
				"source": "raster-mainshoot"			
			}
		]
	};
	/*mapbox初始化 */
	if(!window.mbSideMap) {
		let _opt = {
			style: mpstyle,
			zoom: 23,
			minZoom: 22,
			center: _view.center_xy, 
			maxZoom: 24,
			pitch: 0,
			bearing: 0,
		}
		window.mbSideMap = new mapboxgl.Map({
			container: containerID,
			style:_opt.style,
			zoom: _opt.zoom,
			minZoom: _opt.minZoom,
			maxZoom: _opt.maxZoom,
			center: _opt.center,
			pitch: _opt.pitch,
			logoPosition: "bottom-right",   //右下角
			bearing: _opt.bearing
		});
		mbSideMap.on('load', function() {
			/**调整图像显示，调整前canvas失准（过小  400*600），正射图（zoom：23）膨胀 */				
			this.resize();
			this.setZoom(22);
			
			this.on('mouseenter', "raster-mainshoot", (e) => {
				mbSideMap_Mouseenter(e);
			});
			this.on('click', "raster-mainshoot", (e) => {
				mbSideMap_Click(e);
			});
		});


	} else {
		/*根据trackid更新正射图 */
		removeData(mbSideMap, 'raster-mainshoot', 'Layer');
		removeData(mbSideMap, 'raster-mainshoot', 'Source');
		mbSideMap.addSource('raster-mainshoot',
			mpstyle.sources['raster-mainshoot']
		);
		mbSideMap.addLayer(mpstyle.layers[0]);
	}	
};
/**
*@description   删除图层前校验 
 * @param {*} _map mapbox实例
 * @param {*} _id id名称
 * @param {*} _type Source或Layer
 */
function removeData(_map, _id, _type) {
	if( _map['get' + _type](_id) ){
		_map['remove' + _type](_id)
	}
}
/*悬浮显示病害svg信息 */
function mbSideMap_Mouseenter(e) {
	let target = e.originalEvent.target;
	if(last_polygon){
		let my_index = polygons[last_polygon._leaflet_id];
		let pathData = bufferResults.features.find(d=>{ return d.properties.ID == my_index });
		if(my_index && pathData){					
			let my_type = pathData.properties.TYPE;
			let my_color = (my_type == '11')? '#979797' :'#EC3A4E';
			last_polygon.style.stroke = my_color;
		}
	}
	if(target.tagName == 'path'){
		target.style.stroke = '#00F4BF';
		last_polygon = target;
	}
}
/*点击获取病害svg信息 */
function mbSideMap_Click(e) {
	let target = e.originalEvent.target,
	path_id = target._leaflet_id;
	if(path_id && (polygons[path_id] || polygons[path_id] === 0)){
		let path_index = polygons[path_id];
		let pathData = bufferResults.features.find(d=>{ return d.properties.ID == path_index });
		
		if(!pathData){
			$.errorView('获取病害信息失败');
			return;
		}
		disease_player.click_types = false;
		disease_info.come_to_info(pathData, true, true, true);
	}
}


/*mapboxgl地图--覆盖物变化*/
//#region 0112
function visua_up_map_layer() {
	let _view = disease_info.current_info,
		_center = _view.center_xy,
		_loc = _view.locs,
		_layers = map.getStyle()._layers || [],
		thisRange = [];
}


