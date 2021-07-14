/**
 * 左侧病害列表
 */
import {
    disease_map
} from './disease_main_map.js';
import {
    disease_player
} from './disease_player.js';
import {
    disease_info
} from './disease_info.js';
import {
    disease_user
} from './disease_user.js';
import {
    disease_group
} from './disease_group.js';
import {
    disease_screen
} from './disease_screen.js';

var disease_list = {};

disease_list.mark_points = null;
disease_list.catchList = null;
disease_list.catchListUTM = null;
disease_list.data_point = null;
disease_list.position_group = null;
disease_list.chunk_list = [];
disease_list.chunk_list_index = 0;
disease_list.page_type = true;
disease_list.page_param = {
	"pageNo": 1,
	"pageSize": 10
};
disease_list.data_groups = {
	'link_code': null,
	'mp_code': null
};

/*左侧病害列表分页*/
disease_list.page_init = function(pages){
	var obj = {
		wrapid: 'page_lists',			//页面显示分页器容器id
		btnCount: 6,
		total: pages.count,				//总条数
		pagesize: pages.pageSize,		//每页显示10条
		currentPage: pages.pageNo,		//当前页
		onPagechange: this.page_change,
	}
	pagination.init(obj);
};

/*页码发生变化时*/
disease_list.page_change = function(page){
	console.log(page)
	disease_list.page_param.pageNo = page;
	disease_screen.screen_search(true);
};

/*病害数据初始化*/
disease_list.list_init = function(param=[],junge=false) {
	var _this = this;
	if(!disease_user.current_adcode){
		return;
	}
	if(!junge){
		_this.page_param = {
			"pageNo": 1,
			"pageSize": 10
		};
	}
	param.push({
		'k': 'DATA_VERSION',
		'v': disease_user.current_adcode.dataVersion,
		'op': 'eq'
	})
	var sorts = {
		'1': 'UDATE',
		'2': 'SUBTYPE',
		'3': 'UP_DOWN',
		'4': 'UP_DOWN'
	};
	var orders = {
		'1': 'desc',
		'2': 'desc',
		'3': 'desc',
		'4': 'asc',
	}
	$('.disease_list_body').html('');
	// var _url = config_url.pdds + Disease.TYPE_LIST.URLS.MAP_LIST,
	let urlList = Disease.TYPE_LIST.URLS.PD_SHOW_LIST || Disease.TYPE_LIST.URLS.LIST;
	var _url = config_url.pdds + urlList,
		_type = $('.disease_list_sort ul li.active').attr('type'),
		sort = sorts[_type],
		order = orders[_type],
		data = {
			'sort': [
				{
				  'k': sort,
				  'order': order
				}
			],
			'ops': param,
			'page': this.page_param,
		};
	
	// $.cesium_removeEntities();
	// _this.mark_label_list();
	
	_this.chunk_list_index = 0;
	$.postAjax({
		url: _url,
		data: data,
		callback: function(data){
			if(data.code != '0'){
				$.errorView(data.message);
				return;
			}
			var _data = data.result.data.features || [],
				_page = data.result.page || {},
				this_data = [];
			
				if(_this.page_type){
					_this.page_init(_page);
				}
			_this.data_point = [];
			for(var i=0; i<_data.length; i++){
				
				// if(_data[i].properties.ID != "fe7d7b0d28db61c61445ad1526ec8471"){
				// 	continue;
				// }
				
				
				var link_code = _data[i].properties.LINK_CODE || '';
				
				if(!link_code){
					// continue;
				}
				var new_data = disease_list.dataInfoFormat(_data[i], this_data.length);
				
				this_data.push( new_data );
				
				var _entity = $.add_layer({
					'result': {
						'properties': new_data.properties
					}
				})
				// var _entity = $.add_billboard({
				// 	'result': {
				// 		'properties': _data[i].properties,
				// 		'geometry': {
				// 			'coordinates': [_coordinates]
				// 		}
				// 	}
				// })
				_this.data_point.push(_entity);
				
			}
			_this.catchList = this_data;
			
			disease_list.catchListUTM = addGeometry(this_data);
			
			// disease_group.list_group();
			_this.dataList(this_data);
			/*公路病害列表--总数赋值*/
			$('.disease_list_num span').html(_page.count);
			if(junge){
				// disease_cesium.add_3d_tile();
			}
		}
	})
};

/* 格式化数据 */
disease_list.dataInfoFormat = function(_data, index){
	
	var type_list = Disease.TYPE_LIST.TYPES;
	var list_info = Disease.TYPE_LIST.LISTINFO;
	var create_time = _data.properties._CREATE_TIME_ || '',
		update_time = _data.properties.UDATE || '',
		type = _data.properties[type_list.KEY],
		layer_type = 'Point',
		data_type = _data.properties[type_list.KEY] || '',
		// mps_xy = _data.properties.CENTROID,
		mps_xy = _data.properties.CENTROID || '',
		center = mps_xy.split(','),
		subtype = _data.properties[list_info.ID] || '',
		geo_range = _data.properties.GEOM || '',
		geo_range_type = $.cesium_range_type(geo_range),
		geo_range_new = $.cesium_range(geo_range),
		link_name = _data.properties.LINK_NAME || '',
		mp_code = _data.properties.MP_CODE || '',
		mp_codes = mp_code.split('|'),
		mp_codes_0 = mp_codes[0] || '',
		mp_codes_1 = mp_codes[1] ? ('K' + mp_codes[1]) : '',
		mp_codes_2 = mp_codes[2] ? ('+' + mp_codes[2] + '00') : '+000',
		mp_codes_2 = mp_code ? mp_codes_2 : '',
		
		up_down = _data.properties.UP_DOWN || '',
		det_time = _data.properties.DET_TIME || '',
		
		_coordinates = [ Number(center[0]), Number(center[1]), (Number(center[2] || 0)) ],
		cn_up_down = Disease.TYPE_LIST.UP_DOWM[up_down] || '',
		cn_type = Disease.TYPE_LIST.TYPES.VALUES[type] || {'INFO':[], 'NAME': '', 'SUBTYPE': {}},
		_cn_type = cn_type.NAME || '',										/*病害类型*/
		cn_subtype = list_info.MAPPING || {},
		_cn_subtype = cn_subtype[subtype] || '',							/*病害等级*/
		cn_mark = mp_codes_0 +' ' + link_name + ' ' + mp_codes_1 + mp_codes_2,		/*地点*/
		cn_mark = mp_code ? cn_mark : '';
	
	if(Disease.TYPE_LIST.ID == 'ASSET_INSPECTION'){
		if(data_type == '703'){
			layer_type = 'Polygon';
		}else if(data_type == '707'){
			data_type = (data_type + '_' + subtype)
		}
	}
	
	var utm_arr = [];
	for(let d=0; d<geo_range_new.length; d++){
		var utm_xy = LLtoUTM(geo_range_new[d][0], geo_range_new[d][1]);
		utm_arr.push([
			utm_xy.x, utm_xy.y, geo_range_new[d][2]
		])
	}
	var new_code = _data.properties.LINK_CODE + '_' + _data.properties.MP_CODE;
	var new_data = {
		'range_type': geo_range_type,
		'create_time': create_time ? $.timeData(create_time,0) : '无',
		'update_time': update_time ? $.timeConvert(update_time,0) : '无',
		'det_time': update_time ? $.timeData(update_time,0) : '无',
		'index': index,
		'link_code': _data.properties.LINK_CODE + '',
		'new_code': new_code,
		'center_xy': _coordinates,
		'subtype': subtype,
		'_cn_type': _cn_type,
		'_cn_subtype': _cn_subtype,
		'cn_up_down': cn_up_down,
		'cn_mark': cn_mark,
		'locs': geo_range_new,
		'layer_type': layer_type,
		'data_type': data_type,
		'locs_utm': utm_arr,
		'mp_codes_0': mp_codes_0,
		'mp_codes_1': mp_codes_1,
		'mp_codes_2': mp_codes_2
	}
	
	for(var item in new_data){
		_data.properties[item] = new_data[item];
		_data[item] = new_data[item];
	}
	
	return _data;
}

/*公路病害列表初始化*/
disease_list.dataList = function(data){
	$('.disease_list .disease_list_body')[0].scrollTop = 0;
	var new_html = data.length ? '' : `
			<div class="no_list_child">
				<span>暂无相关数据</span>
			</div>
		`;
	
	$('.disease_list_body').html(new_html);
	
	if(data.length){
//			this.chunk_list = _.chunk(data, 100);
		this.chunk_list = _.chunk(data, 30);
		this.chunk_list_change();
	}
};

/*左侧列表加载--100条数据*/
disease_list.chunk_list_change = function(){
	var li_length = $('.disease_list_li').length,
//			index_length = this.chunk_list_index * 100;
		index_length = this.chunk_list_index * 30;
	if(li_length != index_length){
		return;
	}
	if(this.chunk_list_index >= this.chunk_list.length){
		return;
	}
	$('.disease_list_foot').css('display', 'block');
	
	var href = 'iconrising' || 'iconRightarrow' || 'iconfalling',			//上-右-下
		_name = Disease.TYPE_LIST.LISTINFO.NAME,
		_values = Disease.TYPE_LIST.TYPES.VALUES,
		_class = 'up',
		true_data = this.chunk_list[this.chunk_list_index] || [],
		_html = `
		${true_data.map(f => `
			<div class="disease_list_li" data-index="${f.properties.index}">
				<div class="child_head">
					<!--<span class="child_head_id">${f.properties.ID || 0}</span>-->
					<span class="child_head_name">${f._cn_type}</span>
					<span class="child_head_time">${f.update_time}</span>
				</div>
				<div class="child_body">
					<p class="child_body_place">
						<span class="child_body_name">位置</span>
						<span class="child_body_place_value">${f.cn_mark} ${f.cn_up_down}</span>
					</p>
					<p class="child_body_grade">
						<span class="child_body_name">${_name}</span>
						<span class="child_body_grade_value grade_${f.subtype}">${_values[f.properties.TYPE] ? (_values[f.properties.TYPE].SUBTYPE[f.subtype] || '-') : '-'}</span>
						<!--<span class="iconfont ${_class} ${href}"></span>
						<span class="child_body_grade_time">检测时间：${f.update_time}</span>-->
					</p>
				</div>
			</div>
		`).join('')}
	`;
	$('.disease_list_body').append(_html);
	
	var doms = $('.child_head_time'),
//			l = this.chunk_list_index * 100;
		l = this.chunk_list_index * 30;
//		for(var i=l; i<100; i++){
	for(var i=l; i<30; i++){
		var width = doms.eq(i).css('width'),
			parse_width = parseInt(width) + 13,
			new_width = 'calc(100% - '+parse_width+'px)';
		
		$('.child_head_name').eq(i).css('max-width',new_width);
	}
	this.chunk_list_index ++;
	$('.disease_list_foot').css('display', 'none');
	
};

/*病害列表--病害进行点击时,执行的事件*/
disease_list.list_toggle = function(type, junge){
	
	return
	var data = disease_info.current_info.properties,
		road_code = data.mp_codes_0,
		link_code = data.mp_codes_0 + '_' + data.mp_codes_1,
		mp_code = link_code + '_' + data.mp_codes_2;
		// level_one = _viewer.entities.getById(data.ID),
		// level_two = _viewer.entities.getById(mp_code),
		// level_three = _viewer.entities.getById(link_code),
		// level_four = _viewer.entities.getById(road_code),
		// z_height = _viewer.camera.positionCartographic.height,
		// _entity = level_four;
	
	// if(level_one && level_one.show){
	// 	_entity = level_one;
	// 	disease_cesium.change_last_point(_entity);
		
	// }else if(level_two && level_two.show){
	// 	_entity = level_two;
	// }else if(level_three && level_three.show){
	// 	_entity = level_three;
	// }
	
	this.position_group_change(_entity);
	
	var center = _entity ? _entity._center : null,
		// bounds = $.getBounds(),
		// _x = (bounds.east+bounds.west)/2,
		// _y = (bounds.north+bounds.south)/2,
		lng_lat = Cesium.Cartesian3.fromDegrees(center[0], center[1], z_height),
		isPointInBbox = false;
		/*isPointInBbox = $.isPointInRect({
			lng: center[0],
			lat: center[1]
		}, {
			east: bounds.east,
			north: bounds.north,
			south: bounds.south,
			west: _x
		});*/
	
	if((!isPointInBbox && !type) || junge){
		_viewer.camera.setView({
			destination: lng_lat
		})
	}
};

/*聚类组的样式变化*/
disease_list.position_group_change = function(layer){
	if(this.position_group){
		this.position_group.billboard.image._value = './Apps/Dist/Img/label_background_'+ this.position_group.icon_length +'.png';
		this.position_group = null;
	}
	if(layer && layer.point_length){
		layer.billboard.image._value = './Apps/Dist/Img/label_background_'+ layer.icon_length +'_active.png';
		this.position_group = layer;
	}
};

export {
    disease_list
};

// module.exports = disease_list;







