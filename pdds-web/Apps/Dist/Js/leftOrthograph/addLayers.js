
import {
    disease_info
} from '../disease_info.js';

var orthographAddlayer = {};
var _map = null;
var catchData = [];

export function addLayers(datas, currentId, map, callback){
	if(!datas.length){
		return;
	}
	_map = map;
	catchData = datas;
	var geometries = {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				
			],
		}
	}
	catchData.forEach( (data, index) => {
		let range = data.properties.GEOM,
			class_name = data.properties.ID,
			center = data.properties.center_xy,
			layer_type = data.properties.range_type || data.properties.layer_type || 'Polygon',
			data_type = data.properties.TYPE,
			color = (data_type == '11' || data_type == '41') ? '#979797' : '#EC3A4E',
			weight = (currentId == class_name) ? 4 : 2,
			opacity = (currentId == class_name) ? 0.5 : 0.3,
			boldClass = (currentId == class_name) ? ' fontBold' : '';
		
		var geoJson = $.geoJsonParam({
			'range': range,
			'id': index,
			'properties': data.properties,
			'type': layer_type,
			'color': color,
			'weight': weight,
			'opacity': opacity
		});
		
		let markDiv = document.createElement("div");
		markDiv.className = 'geometriesLabel' + boldClass;
		markDiv.innerHTML = data.properties._cn_type;
		markDiv.setAttribute('dataId', class_name);

		var _m = new mapboxgl.Marker({
			anchor: 'bottom',
			element: markDiv
		})
		.setLngLat([center[0], center[1]])
		.addTo(_map);
		
		geometries.data.features.push(geoJson);
	} )
	
	removeLayers();
	removeSources();
	// removeLayers(function(){
		// removeSources(function(){
			map.addSource('features', geometries);
			map.addLayer({
				'id': 'polygons',
				'type': 'fill',
				'source': 'features',
				'paint': {
					"fill-opacity": ['get', 'opacity'],
					// "fill-opacity": 0.4,
					// "fill-color": ['get', 'color']
					"fill-color": [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#00F4BF',
						['get', 'color']
					]
				},
				'filter': ['==', '$type', 'Polygon']
			});
			map.addLayer({
				'id': 'polylines',
				// 'type': 'LineString',
				'type': 'line',
				'source': 'features',
				'paint': {
					'line-width': ['get', 'weight'],
					// "line-color": ['get', 'color']
					"line-color": [
						'case',
						['boolean', ['feature-state', 'hover'], false],
						'#00F4BF',
						['get', 'color']
					]
				},
				'filter': ['==', '$type', 'LineString']
			});
			callback && callback();
			initCustomEvent();
		// });
	// });
}

var hoveredStateId = null; //鼠标选择要素
var hoveredLayerId = null; //鼠标选择层
var hoveredLayerColor = null; //鼠标选择层的颜色
let sources = ['features'];
let layers = ['polylines', 'polygons'];

/**
 * @description: 图层鼠标事件初始
 * @param {*} _config
 * @return {*}
 */
function initCustomEvent(){
    removeLayerEvent();
    for (let i = 0; i < layers.length; i++) {
        _map.on('mousemove', layers[i], vectorMousemove);
        _map.on('mouseleave', layers[i], vectormouseleave);
        _map.on('click', layers[i], vectorMouseClick);
    }
}

/**
 * @description:  清除图层相关所有的数据
 * @param {*}
 * @return {*}
 */
function removeLayerEvent() {
    for (let i = 0; i < layers.length; i++) {
        _map.off('mousemove', layers[i], vectorMousemove);
        _map.off('mouseleave', layers[i], vectormouseleave);
		_map.off('click', layers[i], vectorMouseClick);
    }
}

function vectorMousemove(e) {
    if (e.features.length > 0) {
		
        if (hoveredStateId && hoveredLayerId) {
            let layer = _map.getLayer(hoveredLayerId);
            _map.setFeatureState(
                {
                    source: layer.source,
                    id: hoveredStateId
                },
                { hover: false }
            );
        }
        let feature = e.features[0];
		
        hoveredStateId = feature.id;
        hoveredLayerId = feature.layer.id;
		hoveredLayerColor = feature.properties.color;
		
        let layer = _map.getLayer(hoveredLayerId);
		_map.setFeatureState(
			{
				source: layer.source,
				id: hoveredStateId
			},
			{ hover: true }
		);
    }
}

function vectormouseleave(e) {
    if (hoveredStateId) {
        let layer = _map.getLayer(hoveredLayerId);
        _map.setFeatureState(
            {
                source: layer.source,
                id: hoveredStateId
            },
            { hover: false }
        );
    }
    hoveredStateId = null;
}

/**
 * @description: 图片类渲染要素鼠标点击事件
 * @param {*}
 * @return {*}
 */
//
function vectorMouseClick(e) {
    let feature = e.features[0];
	if(feature){
		var properties = feature.properties,
			info = catchData.find( d=> { return d.properties.ID == properties.ID } );
		info && disease_info.come_to_info(info,true,true);
	}
}

/**
 * @description: 删除mvt配置数据源
 * @param {*} sources
 * @return {*}
 */
function removeSources(callback) {
	
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    if (_map == null) return false;
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
		if( _map.getSource(source) ){
			_map.removeSource(source);
		}
    }
	callback && callback();
}
/**
 * @description: 删除配置数据图层
 * @param {*} layers
 * @return {*}
 */
function removeLayers(callback) {
    if (_map == null) return false;
    for (var i in layers) {
        var layer = layers[i];
		if( _map.getLayer(layer) ){
			_map.removeLayer(layer);
		}
    }
	callback && callback();
}