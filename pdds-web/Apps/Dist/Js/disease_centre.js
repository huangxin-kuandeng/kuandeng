/**
 * 数据中心
 */

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
    disease_road_analyse
} from './disease_road_analyse.js';
import {
    data_other
} from './disease_data_other.js';
import {
    disease_analyse
} from './disease_analyse.js';
import {
    disease_screen
} from './disease_screen.js';
import {
    disease_player
} from './disease_player.js';
import {
    disease_map
} from './disease_main_map.js';

var disease_centre = {};
var materialMapping = window.Disease.TYPE_LIST.MATERIAL;

disease_centre.cn_data = Disease.TYPE_LIST;
disease_centre.link_list = null;
disease_centre.centre_search_change = function(){
	var _this = this;
	disease_analyse.sortDataDom();
	// disease_centre.link_code_query(function(){
		$('.data_center_body').html('');
		
		let _active = $('.data_center_tab ul li.active').attr('data-name');
		if(_active == 'disease_analyse'){
			disease_analyse.findDatas();
		}else if(_active == 'road_analyse'){
			disease_road_analyse.findDatas();
		}else if(_active == 'data_other'){
			data_other.findDatas();
		}
	// });
};

/* 查询道路列表 */
/* disease_centre.link_code_query = function(_callback){
	let dataVersion = disease_user.current_adcode.dataVersion,
		_url = config_url.pdds + 'data/road/query',
		map_code_param = { 'ops': [{'k': 'dataVersion','v': dataVersion,'op': 'eq','type': 'string'}] };
	
	disease_centre.link_list = [];
	$.postAjax({
		url: _url,
		data: map_code_param,
		callback: function(data){
			let type_arr = (data.result && data.result.data) ? data.result.data.features : [];
			for(let i=0; i<type_arr.length; i++){
				disease_centre.link_list.push({
					'name': type_arr[i].properties.NAME || type_arr[i].properties.LINK_NAME,
					'id': type_arr[i].properties.LINK_CODE
				})
			}
			disease_centre.link_code_init(type_arr);
			disease_screen.screen_init();
			_callback && _callback();
		}
	})
} */

// 数据中心--列表筛选项
disease_centre.search_param = function(){
	var type_list = Disease.TYPE_LIST,
		search_param = type_list.SEARCHPARAM;
	
	var _html = `
		<h3>${search_param.NAME}</h3>
		<div class="search_param_1">
			${search_param.VALUES.map(f => `
				<div class="_param select_param select_${f.ID}">
					<p data-name="${f.ID}">
						<span class="select_value" title="${f.NAME}">${f.NAME}</span>
						<b class="allow_select"></b>
					</p>
					<span class="mouse_span"></span>
					<ul>
						${f.VALUES.map(v => `
							<li>
								<label class="checkbox_label ${v.CLASS}">
									<input type="checkbox" value="${v.VALUE}" name="${f.ID}" data-name="${v.ID}" data-text="${v.TITLE}" checked="">
									<b class="checkbox_b"></b>
									<span>${v.NAME}</span>
								</label>
							</li>
						`).join('')}
					</ul>
				</div>
				<div class="_param input_param" style="display: none;">
					<input type="input" class="map_code_1" placeholder="桩端">
					<span>-</span>
					<input type="input" class="map_code_2" placeholder="桩端">
				</div>
			`).join('')}
		</div>
	`;
	
	$('.data_panel .data_center_head').html(_html);
	
	let pdd_s = [];
	let pdd_s_html = '';
	
	// 病害类型的样式需要特殊处理
	if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
		
		pdd_s = [
			{
				'name': '沥青全选',
				'id': 'TYPE',
				'type': '1',
				'value': []
			},
			{
				'name': '水泥全选',
				'id': 'TYPE',
				'type': '2',
				'value': []
			}
		]
		
		for(let type in type_list.TYPES.VALUES){
			let materialIndex = (type_list.TYPES.VALUES[type].MATERIAL == '1') ? 0 : 1;
			pdd_s[materialIndex].value.push({
				'name': type_list.TYPES.VALUES[type].NAME,
				'value': type
			})
		}
		
		pdd_s_html = `
			${pdd_s.map(g => `
				<div name="${g.type}">
					<li>
						<label class="checkbox_label checkbox_label_all checkbox_label_all_${g.type}">
							<input type="checkbox" value="" name="TYPE" data-name="${g.type}" checked="">
							<b class="checkbox_b"></b>
							<span>${g.name}</span>
						</label>
					</li>
					${g.value.map(f => `
						<li>
							<label class="checkbox_label">
								<input type="checkbox" value="${f.value}" data-text="${f.name}" checked="">
								<b class="checkbox_b"></b>
								<span>${f.name}</span>
							</label>
						</li>
					`).join('')}
				</div>
			`).join('')}
		`;
		
	}else{
		for(let type in type_list.TYPES.VALUES){
			pdd_s.push({
				'name': type_list.TYPES.VALUES[type].NAME,
				'value': type
			})
		}
		pdd_s_html = `
			<div name="all">
				<li>
					<label class="checkbox_label checkbox_label_all checkbox_label_all_all">
						<input type="checkbox" value="" name="TYPE" data-name="all" checked="">
						<b class="checkbox_b"></b>
						<span>全选</span>
					</label>
				</li>
				${pdd_s.map(f => `
					<li>
						<label class="checkbox_label">
							<input type="checkbox" value="${f.value}" data-text="${f.name}" checked="">
							<b class="checkbox_b"></b>
							<span>${f.name}</span>
						</label>
					</li>
				`).join('')}
			<div>
		`;
	}
	
	var new_key = this.cn_data.TYPES.KEY;
	$('.data_center_head .search_param_1 .select_' + new_key + ' ul').html(pdd_s_html);
	
}


/*数据中心--路线请求--根据adcode变化*/
disease_centre.link_code_init = function(type_arr){
	let new_link_html = `
		<li>
			<label class="checkbox_label checkbox_label_all">
				<input type="checkbox" value="" name="LINK_CODE" data-name="all" checked="">
				<b class="checkbox_b"></b>
				<span>全选</span>
			</label>
		</li>
		${type_arr.map(f => `
			<li>
				<label class="checkbox_label">
					<input type="checkbox" value="${f.properties.LINK_CODE}" checked="">
					<b class="checkbox_b"></b>
					<span>${f.properties.LINK_CODE}</span>
				</label>
			</li>
		`).join('')}
	`;
	
	$('.data_center_head .search_param_1 .select_LINK_CODE ul').html(new_link_html);
	$('.data_center_head .search_param_1 .select_LINK_CODE p span').html('路线编号');
	
	$('#data_center .link_code_param p span').html('路线编号');
	
	var ul_list = ['road_analyse','disease_analyse','data_other'];
	for(var i=0; i<ul_list.length; i++){
		var ul_class = ul_list[i];
		var li_all = '';
		if( ul_class == 'road_analyse' && Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS' ){
			li_all = `
				<li>
					<label class="checkbox_label">
						<input type="radio" name="${ul_class}" value="">
						<b class="checkbox_b"></b>
						<span>全部路线</span>
					</label>
				</li>
			`;
		}
		
		var road_analyse_html = `
			${li_all}
			${type_arr.map(f => `
				<li>
					<label class="checkbox_label">
						<input type="radio" name="${ul_class}" value="${f.properties.LINK_CODE}">
						<b class="checkbox_b"></b>
						<span>${f.properties.LINK_CODE}</span>
					</label>
				</li>
			`).join('')}
		`;
		$('#data_center .' + ul_class + ' .link_code_param ul').html(road_analyse_html);
		var ul_class_check = $('#data_center .' + ul_class + ' .link_code_param ul li .checkbox_label input');
		if( ul_class_check.length ){
			ul_class_check[0].checked = true;
		}
	}
	
	let link_ul = $('#data_center .link_code_param'),
		_text = type_arr.length ? type_arr[0].properties.LINK_CODE : '';
	for(let i=0; i<link_ul.length; i++){
		let _span = link_ul[i].getElementsByClassName('select_value'),
			_input = link_ul[i].getElementsByTagName('input');
		
		if(_text && _input.length){
			_input[0].checked = true;
			_span[0].innerText = _text;
			_span[0].name = _text;
			_span[0].title = _text;
		}
	}
	if( Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS' ){
		$('#data_center .link_code_param.select_road_analyse p span')[0].innerText = '全部路线';
		$('#data_center .link_code_param.select_road_analyse p span')[0].name = '';
		$('#data_center .link_code_param.select_road_analyse p span')[0].title = '全部路线';
		
		$('#data_center .select_statistical_unit p span')[0].name = '1';
		$('#data_center .select_statistical_unit p span')[0].innerText = '整公里桩';
		$('#data_center .select_statistical_unit p span')[0].title = '整公里桩';
		$('#data_center .select_statistical_unit ul label input')[0].checked = true;
	}
}

/*数据中心--界面初始化*/
disease_centre.centre_search_init = function(){
	let _this = this;
	
	/*数据中心--点击左侧tab切换窗口*/
	$('.data_center_tab ul li').click(function(e){
		let tag_dom = e.target;
		if(tag_dom.tagName == 'SPAN'){
			tag_dom = tag_dom.parentElement;
		}
		
		$('.data_center_tab ul li').removeClass('active');
		tag_dom.className = 'active';
		
		let name = tag_dom.getAttribute('data-name');
		$('#data_center .data_center_child').hide();
		$('#data_center .data_center_child.'+name).show();
		
		if(name == 'road_analyse'){
			disease_road_analyse.findDatas();
		}else if(name == 'disease_analyse'){
			disease_analyse.findDatas();
		}else if(name == 'data_other'){
			data_other.findDatas();
		}
	})
	/*数据中心--点击确认按钮进行查询数据列表*/
	$('.search_param button').click(function(){
		$('.select_param p b').removeClass('active');
		$('.select_param ul').hide();
		disease_centre.centre_list();
	})
	$('#data_center .data_center_child').on('click', '.page_jump button.page_submit', function (e) {
		let data_value = e.target.getAttribute('data-value'),
			data_class = e.target.getAttribute('data-class'),
			totalPages = $('.' + data_class + ' table').bootstrapTable("getOptions").totalPages || 0,
			page = $('.' + data_class + ' .page_jump input.data_page').val(),
			new_page = Number(page) || 1;
		
		if( (new_page < 1) || (new_page > totalPages) ){
			new_page = 1;
		}
		
		if(data_value == '1'){
			disease_centre.centre_list(new_page);
		}else if(data_value == '2'){
			disease_road_analyse.centre_list(new_page);
		}
		
	})
	/* 病害分析--排序功能点击 */
	$('#data_center .disease_analyse').on('click', '.sort_list b', function (e) {
		
		$('#data_center .disease_analyse .sort_list b').removeClass('active')
		$(e.target).addClass('active');
		let _type = $(e.target).attr('data-type');
		disease_analyse.sortDatas(_type);
		
	})
	
	
	/*桩端*/
	$('.data_center_head').on('blur', '.input_param input.map_code_1', function (e) {
		let max_num = $('.input_param input.map_code_2').val(),
			new_num = parseInt(e.target.value) || '',
			old_num = parseInt(e.target.name) || '',
			value = !new_num ? '' : new_num;
		if(max_num && new_num >= max_num){
			value = old_num;
		}
		e.target.value = value;
		e.target.name = value;
	});
	$('.data_center_head').on('blur', '.input_param input.map_code_2', function (e) {
		let min_num = $('.input_param input.map_code_1').val(),
			new_num = parseInt(e.target.value) || '',
			old_num = parseInt(e.target.name) || '',
			value = !new_num ? '' : new_num;
		if(min_num && new_num <= min_num){
			value = old_num;
		}
		e.target.value = value;
		e.target.name = value;
	});
	/*下拉框-显示隐藏*/
	$('.data_center_child').on('mouseenter', '.select_param', function (e) {
		let currentTarget = e.currentTarget,
			currentP = currentTarget.getElementsByTagName('p')[0],
			_name = currentP.getAttribute('data-name') || '',
			b_class = '.data_center_child .select_param.select_' + _name + ' p b',
			ul_class = '.data_center_child .select_param.select_' + _name + ' ul';
		
		$(b_class).addClass('active');
		$(ul_class).show();
	})
	$('.data_center_child').on('mouseleave', '.select_param', function (e) {
		let currentTarget = e.currentTarget,
			currentP = currentTarget.getElementsByTagName('p')[0],
			_name = currentP.getAttribute('data-name') || '',
			b_class = '.data_center_child .select_param.select_' + _name + ' p b',
			ul_class = '.data_center_child .select_param.select_' + _name + ' ul';
		
		$(b_class).removeClass('active');
		$(ul_class).hide();
	})
	/*下拉框-全选*/
	$('.data_center_head').on('click', '.select_param ul label input', function (e) {
		let _name = e.target.name,
			_value = e.target.value,
			_check = e.target.checked,
			checkType = e.target.getAttribute('data-name');
		
		if(!_value){
			let _input = $('.select_param.select_'+_name+' ul label input');
			if(_name == 'TYPE'){
				_input = $('.select_param.select_'+_name+' ul div[name="' + checkType + '"] label input');
			}
			for(let i=0; i<_input.length; i++){
				_input[i].checked = _check;
			}
		}
		
		_this.check_value_change(checkType);
		
	})
	/*下拉框-选择*/
	$('.data_center_child').on('click', '.select_param ul.disease_type label input', function (e) {
		let _parent = e.target.parentNode.parentNode.parentNode,
			data_name = _parent.getAttribute('data-name'),
			ul_class = '.data_center_child .select_param.select_' + data_name,
			input_s = _parent.getElementsByTagName('input'),
			select_title = '统计线路',
			select_values = [],
			select_names = [];
		
		for(let s=0; s<input_s.length; s++){
			let _checked = input_s[s].checked,
				_value = input_s[s].value,
				_text = input_s[s].getAttribute('data-text') || _value;
			if(_value && _checked){
				select_values.push(
					_value
				)
				select_names.push(
					_text
				)
			}
		}
		if(!select_values.length){
			$(ul_class + ' span.select_value')[0].innerText = select_title;
		}else{
			$(ul_class + ' span.select_value')[0].innerText = select_names.join(',');
		}
		$(ul_class + ' span.select_value')[0].name = select_values.join(',');
		
		if(data_name == 'road_analyse' || data_name == 'statistical_unit'){
			disease_road_analyse.findDatas();
		}else if(data_name == 'disease_analyse'){
			disease_analyse.findDatas();
		}else if(data_name == 'data_other'){
			data_other.findDatas();
		}
		
	})
	/*路段分析列表下载*/
	$('.data_center_child').on('click', 'a.download_list', function (e) {
		
		let road = $(".select_road_analyse span.select_value")[0].name;
		
		if(!road){
			$.errorView('未选择统计线路！');
			return;
		}else if(!window.token){
			$.errorView('token不存在，请登录！');
			let _url = './login.html';
			window.open(_url, '_self');
		}
		let new_time = new Date().getTime();
		let _url = config_url.pdds + Disease.TYPE_LIST.URLS.DOWNLOAD + road + '&token=' + window.token + '&t=' + new_time;
		window.open(_url, '_blank');
	})
	
};

// 初始化表格的显示文本类型
disease_centre.table_columns = function(type){
	
	var road_analyse = Disease.TYPE_LIST.LEFTTABS.find(function(data){
		return data.ID == type;
	})
	var columns_list = [];
	for(var i=0; i<road_analyse.LIST.length; i++){
		let mapping = road_analyse.LIST[i].MAPPING || null,
			cn_mapping = mapping ? Disease.TYPE_LIST[mapping] : null,
			name = road_analyse.LIST[i].NAME,
			title = road_analyse.LIST[i].TITLE,
			tofixed = road_analyse.LIST[i].TOFIXED,
			formatter = road_analyse.LIST[i].FORMATTER,
			total_type = road_analyse.LIST[i].TOTAL_TYPE,
			click = road_analyse.LIST[i].CLICK,
			tail = road_analyse.LIST[i].TAIL || '',
			id = road_analyse.LIST[i].ID,
			new_field = click ? id : 'properties.LINK_CODE',
			child = {
				field: new_field,
				title: title,
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let _value = row.properties[id] || '-',
						new_html = '';
					if(id == 'TYPE'){
						
						_value = Disease.TYPE_LIST.TYPES.VALUES[_value] ? (Disease.TYPE_LIST.TYPES.VALUES[_value].NAME || '-') : '-';
					}else if(cn_mapping){
						_value = cn_mapping[_value] || '-';
					}
					new_html = '<span title="' + _value + tail + '">' + _value + tail + '</span>';
					return new_html;
				}
			};
		
		if(id == 'MP_CODE'){
			child['formatter'] = function (value, row, index) {
				let new_value = row.properties[id] || '',
					map_codes = new_value.split('|') || [],
					map_code_2 = map_codes[1] ? ('K'+map_codes[1]) : '-',
					map_code_3 = map_codes[2] ? ('+'+map_codes[2] + '00') : '+000',
					code_val = map_code_2 + map_code_3;
				return code_val;
			}
		}else if(id == 'SUBTYPE'){
			child['formatter'] = function (value, row, index) {
				let new_value = Disease.TYPE_LIST.TYPES.VALUES[row.properties.TYPE] || {},
					new_text = new_value.SUBTYPE ? new_value.SUBTYPE[row.properties.SUBTYPE] : ' - ';
				return new_text;
			}
		}else if(tofixed){
			child['formatter'] = function (value, row, index) {
				var cn_name = row.properties[id] ? Number(row.properties[id]) : 0,
					new_cn_name = Number( cn_name.toFixed(2) );
				return (new_cn_name + tail);
			}
		}else if(total_type){
			child['formatter'] = function (value, row, index) {
				let new_value = row.properties[total_type] || {},
					new_text = Number(new_value.total) || '-';
				return new_text;
			}
		}else if(click){
			child['formatter'] = function (value, row, index) {
				let cn_name = `
					<a href="#" class="${formatter}"></a>
				`;
				return cn_name;
			}
		}
		
		columns_list.push(child)
	}
	return columns_list;
	
}


/*选项变化时--修改*/
disease_centre.check_value_change = function(checkType){
	
	let select_param = $('.data_center_head .select_param');
	for(let i=0; i<select_param.length; i++){
		let span_s = select_param[i].getElementsByClassName('select_value');
        let p_s = select_param[i].getElementsByTagName('p')[0] || null;
        let p_name = p_s ? p_s.getAttribute('data-name') : null;
		let input_s = select_param[i].getElementsByTagName('input');
		let select_type = true;
		let check_type = true;
		let select_title = span_s[0].title;
		let select_values = [];
		let select_names = [];
		let check_all = null;
		
		if(input_s.length){
			// check_all = select_param[i].getElementsByClassName('checkbox_label_all')[0].getElementsByTagName('input') ;
			let check_all_dom = select_param[i].getElementsByClassName('checkbox_label_all_' + checkType)[0] || select_param[i].getElementsByClassName('checkbox_label_all')[0];
			check_all = check_all_dom.getElementsByTagName('input') ;
		}
		
		for(let s=0; s<input_s.length; s++){
			let _checked = input_s[s].checked,
				_value = input_s[s].value,
				_all = input_s[s].getAttribute('data-name'),
				_text = input_s[s].getAttribute('data-text') || _value;
			
			if(!_checked){
				check_type = !_all ? false : true;
				if(_value){
					select_type = false;
				}
			}
			
			if(_value && _checked){
				select_values.push(
					_value
				)
				select_names.push(
					_text
				)
			}
		}
		
		if(select_type || !select_values.length){
			span_s[0].innerText = select_title;
		}else{
			span_s[0].innerText = select_names.join(',');
		}
		span_s[0].name = select_values.join(',');
		if(input_s.length){
			// check_all[0].checked = check_type;
		}
	}
	
	disease_centre.centre_list();
};
	
disease_centre.centre_init = function(type) {
	var display = (type == '1') ? 'none' : 'block';
	$('#data_center').css('display', display);
};

disease_centre.centre_list = function(page=false){
	var _table = `
		<table id="center_table"></table>
	`;
	$('#data_center .data_center_body').html(_table);
	if(!disease_user.current_adcode){
		return;
	}
	var _url = config_url.pdds + Disease.TYPE_LIST.URLS.LIST,
	// var _url = config_url.pdds + 'data/pd/queryPage',
		_h = $('.data_panel').height() - 192 - 56,
		_current = page || 1,
		_this = disease_centre;
	var myTable = $('#center_table').bootstrapTable({
		url: _url,
		method: 'POST',
//	        height: _h,
		uniqueId: 'id',                        // 绑定ID，不显示
		striped: false,                        //是否显示行间隔色
		cache: false,                          //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		sidePagination: 'server',              //分页方式：client客户端分页，server服务端分页（*）
		ajaxOptions: {
			headers: {
				'Authorization': token
			}
		},
		dataField: 'rows',
		undefinedText: "-",
		pagination: true,                      //是否显示分页
		pageNumber: _current,
		pageSize: 12,
		data_local: "zh-CN",
		showPaginationSwitch: false,
		paginationLoop: false,
		
		onClickRow:function (row,$element,field) {
			if( field != 'properties.LINK_CODE' && field != 'point_cloud_map' && field != 'REMARK' ){
				let classNames =  $element.prevObject[0].firstElementChild.className;
				if( classNames.indexOf('button_control') > -1 ){
					return;
				}
				disease_centre.open_map(row, field);
			}else if(field == 'REMARK'){
				var d_coords = row.properties.D_COORDS || '';
				disease_centre.copy_infos(d_coords);
			}
		},
		queryParams : function (params) {
			var _page = (params.offset / params.limit) + 1;
			var temp = {
				"sort": [
					{
					  "k": "properties.TASK_ID",
					  "order": "desc"
					}
				],
				"ops": [{
					'k': 'DATA_VERSION',
					'v': disease_user.current_adcode.dataVersion,
					'op': 'eq'
				}],
				"page": {
					"totalPages": 0,
					"count": 10000000,
					"pageNo": _page,
					"pageSize": 12
				}
			};
			
			let dom_p = $('.search_param_1 .select_param p'),
				dom_span = $('.search_param_1 .select_param .select_value'),
				map_code_1 = $('.search_param_1 .input_param .map_code_1'),
				map_code_2 = $('.search_param_1 .input_param .map_code_2');
			
//				if(map_code_1){
//					temp.ops.push({
//				    	'k': type,
//				    	'v': value,
//				    	'op': 'in'
//					})
//				}
//				if(map_code_2){
//					temp.ops.push({
//				    	'k': type,
//				    	'v': value,
//				    	'op': 'in'
//					})
//				}
			
			
			for(let i=0; i<dom_p.length; i++){
				let type = dom_p[i].getAttribute('data-name'),
					display = $('.search_param_1 .select_param').eq(i).css('display'),
					value = dom_span[i].name;
				if(display == 'none'){
					continue;
				}
				if(type == 'LINK_CODE' && value){
					temp.ops.push({
						'k': type,
						'v': value,
						'op': 'in'
					})
				}else if(value && type){
					temp.ops.push({
						'k': type,
						'v': value,
						'op': 'in'
					})
				}
			}
			
			return JSON.stringify(temp);
		},
		columns: disease_centre.table_columns('data_panel'),
		/* columns: [
			{
				field: 'properties.MP_CODE',
				title: '路线',
				align: 'center',
				valign: 'middle',
				formatter: function (value='', row, index) {
					let map_codes = value.split('|') || [];
					return (map_codes[0] || '-');
				}
			},{
				field: 'properties.MP_CODE',
				title: '公里桩段',
				align: 'center',
				valign: 'middle',
				formatter: function (value='', row, index) {
					let map_codes = value.split('|') || [],
						code_val = map_codes[1] ? ('K'+map_codes[1]) : '-';
					return code_val;
				}
			},{
				field: 'properties.UP_DOWN',
				title: '方向',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					var cn_name = _this.cn_data.UP_DOWM[value] || '-';
					return cn_name;
				}
			},{
                field: 'properties.MATERIAL',
				title: '路面类型',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = value ? materialMapping[value] : '-';
					return (new_value || '-');
				}
			},{
				field: 'properties.TYPE',
				title: '病害类型',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					var new_key = _this.cn_data.TYPES.KEY,
						new_value = row[new_key],
						cn_name = _this.cn_data.TYPES.VALUES[new_value] ? _this.cn_data.TYPES.VALUES[new_value].NAME : '-';
					return cn_name;
				}
			},{
				field: 'properties.SUBTYPE',
				title: '损坏程度',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					var type = row.properties.TYPE || '',
						subtype = _this.cn_data.TYPES.VALUES[type] ? _this.cn_data.TYPES.VALUES[type].SUBTYPE : {},
						cn_name = subtype[value] || '-';
					return cn_name;
				}
			},{
				field: 'properties.AREA',
				title: '计量面积（平方米）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					var cn_name = value ? Number(value) : 0;
					return cn_name.toFixed(2);
				}
			},{
				field: 'properties.MPS_CODE',
				title: '测量结果',
				align: 'center',
				valign: 'middle',
				events: {
					'click .measurements' : function(e,value,row,index){
						_this.open_map(row, 'visua_up_map');
					}
				},
				formatter: function (value, row, index) {
					let cn_name = `
						<a href="#" class="measurements"></a>
					`;
					return cn_name;
				}
			},{
				field: 'properties.ID',
				title: '备注',
				align: 'center',
				valign: 'middle',
				events: {
					'click .remarks' : function(e,value,row,index){
						let remark = row.properties.REMARK || '无备注';
						$.errorView(remark, true);
					}
				},
				formatter: function (value, row, index) {
					let cn_name = '-';
					if(row.properties.REMARK){
						cn_name = `
							<a href="#" class="remarks"></a>
						`;
					}
					return cn_name;
				}
			},{
				field: 'properties.T_POINT_ID',
				title: '正射图',
				align: 'center',
				valign: 'middle',
				events: {
					'click .open_map_up' : function(e,value,row,index){
						_this.open_map(row, 'visua_up_map');
					}
				},
				formatter: function (value, row, index) {
					let cn_name = `
						<a href="#" class="open_map_up"></a>
					`;
					return cn_name;
				}
			},{
				field: 'properties.TRACK_ID',
				title: '采集图',
				align: 'center',
				valign: 'middle',
				events: {
					'click .open_map_survey' : function(e,value,row,index){
						_this.open_map(row, 'collect_map');
					}
				},
				formatter: function (value, row, index) {
					let cn_name = `
						<a href="#" class="open_map_survey"></a>
					`;
					return cn_name;
				}
			},{
				field: 'properties.S_TASK_ID',
				title: '3D点云',
				align: 'center',
				valign: 'middle',
				events: {
					'click .open_map_3D' : function(e,value,row,index){
						$.errorView('功能未开发');
						return;
						_this.open_map(row, 'point_cloud_map');
					}
				},
				formatter: function (value, row, index) {
					let cn_name = `
						<a href="#" class="open_map_3D read_only"></a>
					`;
					return cn_name;
				}
			}
		], */
		responseHandler: function (data) {
			if(data.code != '0'){
				$.errorView('数据加载失败');
				return "数据加载失败！";
			}
			var _data = data.result.data.features || [],
				res = {
					rows: _data,
					total: data.result.page.count
				};
			return res;
		},
		formatLoadingMessage: function(data){
			return "请稍等，正在加载中...";
		},
		formatNoMatches: function(data){
			return "无符合条件的数据";
		},
		onLoadError: function (data) {
			return "数据加载失败！";
		},
		onLoadSuccess: function (data) {
			if(data.total){
				_this.table_pagination_init({
					'data': data,
					'page': page,
					'id': 'center_table',
					'type': true,
					'class': 'data_center_body',
					'value': 1
				});
				console.log(data)
			}
		}
	})
	myTable.bootstrapTable('hideLoading');
	/*$.postAjax({
		url: _url,
		data: data,
		callback: function(data){
			if(data.code != '0'){
				$.errorView(data.message);
				return;
			}
			var _data = data.result.data.features || [];
			console.log(_data);
		}
	})*/
	
	$('#center_table').on('mouseover', 'a.remarks', function (e) {
		var row_index = e.target.parentElement.parentElement.sectionRowIndex;
		var row = $("#center_table").bootstrapTable("getData")[row_index];
		disease_centre.open_remark(row, e.target);
	})
	$('#center_table').on('mouseout', 'a.remarks', function (e) {
		disease_centre.close_remark();
	})
	
};

/*自定义分页功能信息*/
disease_centre.table_pagination_init = function( param ){
	if( !$('.fixed-table-pagination').length ){
		$.errorView('获取分页信息失败');
		return;
	}
	let totalPages = $('#' + param.id).bootstrapTable("getOptions").totalPages || 0;
	let html = `
		<div class="page_jump">
			<span>共</span>
			<span class="data_count">${totalPages}</span>
			<span>页，到第</span>
			<input type="number" class="data_page" value="${param.page}" />
			<span>页</span>
			<button class="btn page_submit" data-value="${param.value}" data-class="${param.class}">确定</button>
		</div>
	`;
	$('.' + param.class + '.page_jump').remove();
	$('.' + param.class + ' .fixed-table-pagination').append(html);
	
	if(param.type){
		let row_length = param.data.rows ? param.data.rows.length : 0,
			new_height = row_length * 40 + 340,
			heights = [731, new_height];
		heights.sort(function(a,b) {
			return b - a;
		});
		let data_height = heights[0] + 'px';
		$('#data_center').css('min-height', '627px');
		document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
	
};

/*a标签跳转的点击事件*/
disease_centre.open_map = function(row, type){
	
	let _id = row.properties.ID;
	let _data = disease_map.formatProperties(row);
	
	disease_player.click_types = true;
	$('#hourlist li').removeClass('active');
	$('#hourlist li[type="1"]').addClass('active');
	this.centre_init(1);
	disease_init.player_mode_init(type);
	
	disease_info.come_to_info(_data,true,true);
	
};

/*a标签跳转的点击事件--仅查看地图*/
disease_centre.cesium_map = function(row){
	
	let d_coords = row.properties.D_COORDS || '';
	let _display = $('.disease_info').css('display');
	if(!d_coords.length){
		$.errorView('当前路段起终点信息不存在！');
		return;
	}
	
	disease_player.click_types = true;
	if(_display == 'block'){
		$('.disease_info').fadeOut(0);
		disease_player.player_close();
	}
	$('#hourlist li').removeClass('active');
	$('#hourlist li[type="1"]').addClass('active');
	this.centre_init(1);
	disease_init.left_list_close();
	let d_coords_arr = d_coords.split(','),
		d_coords_start = d_coords_arr[0].split(' '),
		_height = disease_user.zoomToAltitude(18),
		center =  Cesium.Cartesian3.fromDegrees(d_coords_start[0], d_coords_start[1], _height);
	
	_viewer.camera.setView({  
		destination: center
	})
	
};

/*a标签查看备注的鼠标事件*/
disease_centre.open_remark = function(row, dom){
	var datas = [],
		client_rect = dom.getBoundingClientRect(),
		coords = row.properties.D_COORDS || '',
		new_coords = coords.split(','),
		p_top = client_rect.top - 49 + 14 + 5,
		p_right = $(window).width() - client_rect.left - 60,
		coords_cn = ['起点坐标', '终点坐标'];
	if(new_coords.length == 1){
		coords_cn = ['坐标'];
	}
	for(var i=0; i<new_coords.length; i++){
		let point = new_coords[i].split(' '),
			point_cn = coords_cn[i];
		if(point_cn){
			datas.push({
				'x': point[0],
				'y': point[1],
				'z': point[2],
				't': point_cn
			})
		}
	}
	var htmls = `
		${datas.map(d => `
			<p>
				<span>${d.t}：</span>
				<b>经度 ${d.x}， 纬度 ${d.y}</b>
			</p>
		`).join('')}
	`;
	if(!coords){
		htmls = `<p>无</p>`;
	}
	$('#data_center .coordinate_info').css({
		'right': (p_right + 'px'),
		'top': (p_top + 'px')
	})
	$('#data_center .coordinate_info').html(htmls);
	$('#data_center .coordinate_info').show();
}

/* 复制当前选取内容 */
disease_centre.copy_infos = function(text){
	var copyInput = document.createElement('input');
	copyInput.value = text;
	document.body.appendChild(copyInput);
	copyInput.select();
	document.execCommand("Copy");
	copyInput.className = 'copyInput';
	copyInput.style.display='none';
	copyInput.remove();
}

disease_centre.close_remark = function(){
	$('#data_center .coordinate_info').hide();
}

export {
    disease_centre
};

// module.exports = disease_centre;
