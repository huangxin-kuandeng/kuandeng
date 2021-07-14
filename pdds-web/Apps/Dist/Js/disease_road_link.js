

/*地图上显示线路----16级可显示*/

import {
    disease_user
} from './disease_user.js';

var disease_road_link = {
	line_group: [],
	point_group: []
};

var _adcode = null;
var _datas = null;

// data--合并的坐标组   |||||    type--点或者是线
function addPrimitives(data){
	
	var line_style = {
		'1': { 'line_color': '#FF4057' },							//道路
		'3': { 'line_color': '#47F9FF', 'line_dash': true },		//桥
		'4': { 'line_color': '#47F9FF', 'line_dash': true }			//隧道
	};
	var features = data.features;
	var _primitive = null;
	
	if(data.type == 'point'){
		_primitive = _viewer.scene.primitives.add(new Cesium.BillboardCollection());
	}else if(data.type == 'polyline'){
		_primitive = [];
	}
	
	for(let i=0; i<features.length; i++){
		let new_properties = features[i].new_properties || features[i].properties;
		let positions = null;
		
		if(data.type == 'point'){
			positions = Cesium.Cartesian3.fromDegrees( new_properties.center_xy[0], new_properties.center_xy[1], 0 );
			var p = _primitive.add({
				datas: new_properties,
				default_url: data.icon_url,
				active_url: data.icon_active_url,
				center: new_properties.center_xy,
				show: data.show_type,
				position : positions,
				
				image : data.icon_url,
				width: 18,
				height: 18,
				zIndex: 1000,
				verticalOrigin : Cesium.VerticalOrigin.CENTER,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,		//0
				pixelOffset: Cesium.Cartesian2.ZERO,
				scaleByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5)
			});
			p['datas'] = new_properties;
			p['default_url'] = data.icon_url;
			p['active_url'] = data.icon_active_url;
			p['center'] = new_properties.center_xy;
			
		}else if(data.type == 'polyline'){
			var rtype = new_properties.RTYPE;
			var line_color = line_style[rtype].line_color;
			var line_dash = line_style[rtype].line_dash;
			var new_line = features[i].new_line;
			var color = Cesium.Color.fromCssColorString(line_color);
			
			var new_geometry = [];
			for(var s=0; s<new_line.length; s++){
				var _x = new_line[s][0] || 0,
					_y = new_line[s][1] || 0,
					_z = new_line[s][2] || 0;
				new_geometry.push( _x, _y );
			}
			positions = Cesium.Cartesian3.fromDegreesArray( new_geometry );
			var primitive1 = null;
			
			if(line_dash){
				primitive1 = new Cesium.Primitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: new Cesium.PolylineGeometry({
							datas: new_properties,
							positions: positions,
							width: 6,
							vertexFormat:Cesium.PolylineColorAppearance.VERTEX_FORMAT
						})
					}),
					appearance: new Cesium.PolylineMaterialAppearance({
						material: Cesium.Material.fromType(Cesium.Material.PolylineDashType, {
							color: color,  								//线条颜色
							gapColor: Cesium.Color.TRANSPARENT, 		//间隔颜色
							dashLength: 10 							 	//短划线长度
						})
					})
				 });
			}else{
				primitive1 = new Cesium.Primitive({
					geometryInstances: new Cesium.GeometryInstance({
						geometry: new Cesium.PolylineGeometry({
							datas: new_properties,
							positions: positions,
							width: 6,
							vertexFormat:Cesium.PolylineColorAppearance.VERTEX_FORMAT
						}),
						attributes: {
							color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
						}
					}),
					appearance: new Cesium.PolylineColorAppearance({
						translucent: false,  //是否透明
					})
				});
			}
			
			_viewer.scene.primitives.add(primitive1);
			
			_primitive.push( primitive1 );
			
		}
		
	}
	
	return _primitive;
	
}

// 查询道路-点
function findNodes(dataVersion) {
	// var url = config_url.pdds + 'data/road_link/query';
	var url = config_url.pdds + 'data/adas_node/query';
	var param = {
		'ops': [
			{
				'k': 'DATA_VERSION',
				'type': 'string',
				'v': dataVersion,
				'op': 'eq'
			}
		]
	}
	
    return new Promise((resolve, reject) => {
        $.postAjax({
            'url': url,
			'data': param,
            'token': true,
            'callback': function (data) {
				var datas = data.result.data || {};
                resolve(datas);
            }
        })
    })

}

// 查询道路-线
function findLinks(dataVersion) {
	var url = config_url.pdds + 'data/road_link/query';
	// var url = config_url.pdds + 'data/adas_node/query';
	var param = {
		'ops': [
			{
				'k': 'DATA_VERSION',
				'type': 'string',
				'v': dataVersion,
				'op': 'eq'
			}
		]
	}
	
    return new Promise((resolve, reject) => {
        $.postAjax({
            'url': url,
			'data': param,
            'token': true,
            'callback': function (data) {
				var datas = data.result.data || {};
                resolve(datas);
            }
        })
    })

}

// 线路显示
disease_road_link.handle_road_data = async function(){
	if(!disease_user.current_adcode || !disease_user.current_adcode.dataVersion){
		$.errorView('获取行政区化失败');
		return;
	}
	
	if(_adcode && _adcode == disease_user.current_adcode.dataVersion){
		// return;
	}
	
	handle_road_remove();
	
	_adcode = disease_user.current_adcode.dataVersion;
	disease_road_link.handle_node_data(_adcode);
	
    _datas = await findLinks(_adcode);
	
	disease_road_link.line_group = null;
	var features = _datas.features || [];
	for(var i=0; i<features.length; i++){
		var geom = features[i].properties.GEOM;
		var line = $.cesium_range(geom);
		features[i]['new_line'] = line;
	}
	
	disease_road_link.line_group =  addPrimitives({
		'features': features,
		'type': 'polyline',
		'show_type': true
	})
	
}
// 道路点显示
disease_road_link.handle_node_data = async function(_adcode){
    var nodes = await findNodes(_adcode);
	disease_road_link.point_group = null;
	var features = nodes.features || [];
	
	var _cns = [
		{ 'id': 'WIDTH', 'name': '路面宽度', 'unit': 'm' },
		{ 'id': 'CURVATURE', 'name': '转弯半径', 'unit': 'm' },
		{ 'id': 'SLOPE', 'name': '坡度', 'unit': '' }
	]
	
	for(var i=0; i<features.length; i++){
		var new_properties = {};
		var properties = features[i].properties;
		var UDATE = properties.UDATE;
		var CREATE_TIME = properties._CREATE_TIME_ || '';
		var update_time = properties.UDATE ?  $.timeConvert(properties.UDATE,0) : ' - ';
		var create_time = CREATE_TIME || '';
		var up_down = properties.UP_DOWN || '';
		
		var link_name = properties.LINK_NAME || '';
		var mp_code = properties.MP_CODE || '';
		var mp_codes = mp_code.split('|');
		var mp_codes_0 = mp_codes[0] || '';
		var mp_codes_1 = mp_codes[1] ? ('K' + mp_codes[1]) : '';
		var mp_codes_2 = mp_codes[2] ? ('+' + mp_codes[2] + '00') : '+000';
		var cn_mark = mp_codes_0 +' ' + link_name + ' ' + mp_codes_1 + mp_codes_2;
		var cn_up_down = Disease.TYPE_LIST.UP_DOWM[up_down] || '';
		
		var width = Number( properties['WIDTH'] ) || 0;
		var width_cn = _cns[0].name;
		var width_unit = _cns[0].unit;
		
		var radius = Number( properties['RADIUS'] ) || 0;
		var radius_cn = _cns[1].name;
		var radius_unit = _cns[1].unit;
		
		var slope = Number( properties['SLOPE'] ) || 0;
		var slope_cn = _cns[2].name;
		var slope_unit = _cns[2].unit;
		
		if(radius > 0){
			radius_cn = '转弯半径 左转';
			radius = Math.abs(radius);
			new_properties['RADIUS'] = Number( radius.toFixed(2) );
		}else if(radius < 0){
			radius_cn = '转弯半径 右转';
			radius = Math.abs(radius);
			new_properties['RADIUS'] = Number( radius.toFixed(2) );
		}else{
			new_properties['RADIUS'] = ' - ';
		}
		
		new_properties['WIDTH'] = Number( width.toFixed(2) );
		new_properties['SLOPE'] = Number( slope.toFixed(3) );
		
		new_properties['WIDTH_CN'] = width_cn;
		new_properties['RADIUS_CN'] = radius_cn;
		new_properties['SLOPE_CN'] = slope_cn;
		
		var locs = $.cesium_range(properties.GEOM);
		new_properties['ID'] = 'line_point_' + i;
		new_properties['cn_mark'] = cn_mark;
		new_properties['update_time'] = update_time;
		new_properties['create_time'] = create_time;
		
		new_properties['mp_codes_0'] = mp_codes_0;
		new_properties['mp_codes_1'] = mp_codes_1;
		new_properties['mp_codes_2'] = mp_codes_2;
		new_properties['cn_up_down'] = cn_up_down;
		new_properties['center_xy'] = locs[0];
		new_properties['_cn_type'] = '道路';
		
		features[i]['new_properties'] = new_properties;
		
		// var point = $.add_billboard({
		// 	'show_type': true,
		// 	'icon_url': './Apps/Dist/Img/asset_icon/road.png',
		// 	'icon_active_url': './Apps/Dist/Img/asset_icon/road_active.png',
		// 	'properties': new_properties,
		// 	'geometry': locs
		// })
		// disease_road_link.point_group.push(
		// 	point
		// )
		
	}
	
	disease_road_link.point_group =  addPrimitives({
		'features': features,
		'type': 'point',
		'icon_url': './Apps/Dist/Img/asset_icon/road.png',
		'icon_active_url': './Apps/Dist/Img/asset_icon/road_active.png',
		'show_type': false
	})
}

// 线路的隐藏与显示
disease_road_link.handle_road_toggle = function(zoom){
	var _type = false,
		point_type = false;
	if( zoom < 16 ){
		_type = true;
	}
	if(zoom > 19){
		point_type = true;
	}
	
	for(var i=0; i<disease_road_link.line_group.length; i++){
		var line = disease_road_link.line_group[i];
		line.show = _type;
	}
	
	var bills = disease_road_link.point_group._billboards || [];
	for(var i=0; i<bills.length; i++){
		var line = bills[i];
		line.show = point_type;
	}
	
}

// 线路的删除重置
function handle_road_remove(){
	
	// _viewer.scene.primitives.remove( disease_road_link.point_group );
	// for(var i=0; i<disease_road_link.line_group.length; i++){
	// 	var line = disease_road_link.line_group[i];
	// 	_viewer.scene.primitives.remove( line );
	// }
	
	// $.cesium_refresh();
	
}


export {
    disease_road_link
};





