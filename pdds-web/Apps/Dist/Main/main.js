/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Apps/Dist/Js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Apps/Dist/Js/disease_analyse.js":
/*!*****************************************!*\
  !*** ./Apps/Dist/Js/disease_analyse.js ***!
  \*****************************************/
/*! exports provided: disease_analyse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_analyse", function() { return disease_analyse; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/*
 * @Author: tao.w
 * @Date: 2020-08-13 14:07:23
 * @LastEditors: tao.w
 * @LastEditTime: 2020-08-15 14:17:11
 * @Description: 
 */
/**
 * 病害分析
 */




var disease_analyse = {};
var _datas = [];

function loadData(key) {
    let _url = config_url.pdds + Disease.TYPE_LIST.URLS.ANALYSE + key;
    // let _url = config_url.pdds + 'data/pd/analysis?linkCode=' + key;
    return new Promise((resolve, reject) => {
        $.getAjax({
            'url': _url,
            'token': true,
            'callback': function (data) {
				let result = [];
                if (data.code == 0) result = data.result;
				
				for(let i=0; i<result.length; i++){
					result[i].subtypeText = '重度总数 (例)';
					if(result[i].type == '3'){
						result[i].subtypeText = '重/中度总数 (例)';
					}
				}
				
                resolve(result);
            }
        })
    })

}

disease_analyse.findDatas = async function () {
    //需要线路ID
	
	$('.disease_analyse_body').html('');
	let road = $(".select_disease_analyse span.select_value")[0].name;
	if(!road){
		return;
	}
    _datas = await loadData(road);
	
	let _type = $('.sort_list b.active').attr('data-type');
    disease_analyse.sortDatas(_type);
}

// 初始化--分析的排序类型
disease_analyse.sortDataDom = function(){
	
	var analysis = Disease.TYPE_LIST.LEFTTABS.find(function(data){
		return data.ID == "disease_analyse";
	})
	var sort_list = analysis.SORT_LIST;
	var new_datas = `
		<span>排序</span>
		${sort_list.map(f => `
			<b class="${f.CLASS}" data-type="${f.ID}">${f.NAME}</b>
		`).join('')}
	`;
	$('.disease_analyse .disease_analyse_head .sort_list').html(new_datas);
	
}

disease_analyse.sortDatas = function(type){
	
	// type 1 路面类型排序
	// type 2 累计损坏面积排序
	// type 3 病害数量排序
	
	_datas.sort(function(data1, data2){
		let val1 = Number(data1.type) || 0;
		let val2 = Number(data2.type) || 0;
		if(type == '2'){
			val2 = Number(data1.totalArea) || 0;
			val1 = Number(data2.totalArea) || 0;
		}else if(type == '3'){
			val2 = Number(data1.totalCount) || 0;
			val1 = Number(data2.totalCount) || 0;
		}
		return val1 - val2;
	});
	console.log(_datas)
	disease_analyse.centre_list(_datas);
}

disease_analyse.centre_list = function (data) {
    // var data = [1, 3, 4, 5, 6, 7, 8, 9, 2];
	
	var analysis = Disease.TYPE_LIST.LEFTTABS.find(function(data){
		return data.ID == "disease_analyse";
	})
	
	var typeMapping = Disease.TYPE_LIST.TYPES.VALUES;
	var materialMapping = Disease.TYPE_LIST.MATERIAL;
	var new_image = './Apps/Dist/Img/' + analysis.IMAGE_URL + '/';
	var image_type = '.' + analysis.IMAGE_TYPE;
	var buss_id = ( Disease.TYPE_LIST.ID == "ASSET_INSPECTION" ) ? true : false;
	var new_data = [];
	
	for(let i=0; i<data.length; i++){
		var new_type = data[i].type;
		if(typeMapping[new_type]){
			new_data.push(
				data[i]
			)
		}
	}
	
    let new_datas = `
		${new_data.map(f => `
			<div class='data_child'>
				<div class='data_child_px'>
					<div class='disease_analyse_image'>
						<img src="${new_image}${f.type}${image_type}" />
						<!-- <div></div> -->
						<span>
						${materialMapping[f.material] || ' - '}
						</span>
						<b> ${typeMapping[f.type] ? typeMapping[f.type].NAME : ' - '}</b>
					</div>
					<ul>
						
						${analysis.VALUES.map(v => `
							<li>
								<span><span>${v.NAME_1 || f.subtypeText}${typeMapping[f.type].COMPANY || ""}</span><b title='${ (!v.ID_1 && v.ID_1!=0) ? ' - ' : f[v.ID_1]}'> ${ (!v.ID_1 && v.ID_1!=0) ? ' - ' : f[v.ID_1]}</b></span>
								<span><span>${v.NAME_2}</span><b title='${ ( !v.ID_2 && v.ID_2!=0 || buss_id ) ? ' - ' : f[v.ID_2]}'>${ (!v.ID_2 && v.ID_2!=0 || buss_id ) ? ' - ' : f[v.ID_2]}</b></span>
							</li>
						`).join('')}
						
					</ul>
				</div>
			</div>
		`).join('')}
	`;
	
    $('.disease_analyse_body').html(new_datas);
};





/***/ }),

/***/ "./Apps/Dist/Js/disease_centre.js":
/*!****************************************!*\
  !*** ./Apps/Dist/Js/disease_centre.js ***!
  \****************************************/
/*! exports provided: disease_centre */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_centre", function() { return disease_centre; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_init_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_init.js */ "./Apps/Dist/Js/disease_init.js");
/* harmony import */ var _disease_road_analyse_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_road_analyse.js */ "./Apps/Dist/Js/disease_road_analyse.js");
/* harmony import */ var _disease_data_other_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_data_other.js */ "./Apps/Dist/Js/disease_data_other.js");
/* harmony import */ var _disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./disease_analyse.js */ "./Apps/Dist/Js/disease_analyse.js");
/* harmony import */ var _disease_screen_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./disease_screen.js */ "./Apps/Dist/Js/disease_screen.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/**
 * 数据中心
 */












var disease_centre = {};
var materialMapping = window.Disease.TYPE_LIST.MATERIAL;

disease_centre.cn_data = Disease.TYPE_LIST;
disease_centre.link_list = null;
disease_centre.centre_search_change = function(){
	var _this = this;
	_disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__["disease_analyse"].sortDataDom();
	// disease_centre.link_code_query(function(){
		$('.data_center_body').html('');
		
		let _active = $('.data_center_tab ul li.active').attr('data-name');
		if(_active == 'disease_analyse'){
			_disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__["disease_analyse"].findDatas();
		}else if(_active == 'road_analyse'){
			_disease_road_analyse_js__WEBPACK_IMPORTED_MODULE_4__["disease_road_analyse"].findDatas();
		}else if(_active == 'data_other'){
			_disease_data_other_js__WEBPACK_IMPORTED_MODULE_5__["data_other"].findDatas();
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
			_disease_road_analyse_js__WEBPACK_IMPORTED_MODULE_4__["disease_road_analyse"].findDatas();
		}else if(name == 'disease_analyse'){
			_disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__["disease_analyse"].findDatas();
		}else if(name == 'data_other'){
			_disease_data_other_js__WEBPACK_IMPORTED_MODULE_5__["data_other"].findDatas();
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
			_disease_road_analyse_js__WEBPACK_IMPORTED_MODULE_4__["disease_road_analyse"].centre_list(new_page);
		}
		
	})
	/* 病害分析--排序功能点击 */
	$('#data_center .disease_analyse').on('click', '.sort_list b', function (e) {
		
		$('#data_center .disease_analyse .sort_list b').removeClass('active')
		$(e.target).addClass('active');
		let _type = $(e.target).attr('data-type');
		_disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__["disease_analyse"].sortDatas(_type);
		
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
			_disease_road_analyse_js__WEBPACK_IMPORTED_MODULE_4__["disease_road_analyse"].findDatas();
		}else if(data_name == 'disease_analyse'){
			_disease_analyse_js__WEBPACK_IMPORTED_MODULE_6__["disease_analyse"].findDatas();
		}else if(data_name == 'data_other'){
			_disease_data_other_js__WEBPACK_IMPORTED_MODULE_5__["data_other"].findDatas();
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
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode){
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
					'v': _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion,
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
	let _data = _disease_main_map_js__WEBPACK_IMPORTED_MODULE_9__["disease_map"].formatProperties(row);
	
	_disease_player_js__WEBPACK_IMPORTED_MODULE_8__["disease_player"].click_types = true;
	$('#hourlist li').removeClass('active');
	$('#hourlist li[type="1"]').addClass('active');
	this.centre_init(1);
	_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].player_mode_init(type);
	
	_disease_info_js__WEBPACK_IMPORTED_MODULE_2__["disease_info"].come_to_info(_data,true,true);
	
};

/*a标签跳转的点击事件--仅查看地图*/
disease_centre.cesium_map = function(row){
	
	let d_coords = row.properties.D_COORDS || '';
	let _display = $('.disease_info').css('display');
	if(!d_coords.length){
		$.errorView('当前路段起终点信息不存在！');
		return;
	}
	
	_disease_player_js__WEBPACK_IMPORTED_MODULE_8__["disease_player"].click_types = true;
	if(_display == 'block'){
		$('.disease_info').fadeOut(0);
		_disease_player_js__WEBPACK_IMPORTED_MODULE_8__["disease_player"].player_close();
	}
	$('#hourlist li').removeClass('active');
	$('#hourlist li[type="1"]').addClass('active');
	this.centre_init(1);
	_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].left_list_close();
	let d_coords_arr = d_coords.split(','),
		d_coords_start = d_coords_arr[0].split(' '),
		_height = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].zoomToAltitude(18),
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



// module.exports = disease_centre;


/***/ }),

/***/ "./Apps/Dist/Js/disease_cesium.js":
/*!****************************************!*\
  !*** ./Apps/Dist/Js/disease_cesium.js ***!
  \****************************************/
/*! exports provided: disease_cesium */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_cesium", function() { return disease_cesium; });
/* harmony import */ var _disease_init_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_init.js */ "./Apps/Dist/Js/disease_init.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_group.js */ "./Apps/Dist/Js/disease_group.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/**
 * 地图相关
 */








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
	_disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].click_types = true;
	$(".cesium_popup").hide();
	_disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(type);
	_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(this.last_point.datas.index,true,true);
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
		var _center = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.center,
			new_center = _center ? _center.split(',') : null,
			_zoom = config_url.nantong.zoom,
			_height = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].zoomToAltitude(_zoom);
		
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
				_disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(active.ID);
				
				_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(index,true,true);
				
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
	var height = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].zoomToAltitude(zoom);
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
		zoom = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].altitudeToZoom(height),
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
	
	_disease_group_js__WEBPACK_IMPORTED_MODULE_2__["disease_group"].point_group();
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
	
	_viewer.scene.screenSpaceCameraController.minimumZoomDistance = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].zoomToAltitude(_this.maxZoom);
	_viewer.scene.screenSpaceCameraController.maximumZoomDistance = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].zoomToAltitude(_this.minZoom);
	_viewer.camera.percentageChanged = 0;
	
	const listener = () => {
		var camera_height = _viewer.camera.positionCartographic.height,
//			center = $.getCenterPoint(),
			zoom = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].altitudeToZoom(camera_height),
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
	
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_5__["disease_map"].setResize();
};

/*加载3D tile服务图层*/
disease_cesium.add_3d_tile = function(){
	return;
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"] || !_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode || !_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion){
		return false;
	}
	let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion;
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
			var entitys = _disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].current_disease || {};
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



// module.exports = disease_cesium;








/***/ }),

/***/ "./Apps/Dist/Js/disease_data_other.js":
/*!********************************************!*\
  !*** ./Apps/Dist/Js/disease_data_other.js ***!
  \********************************************/
/*! exports provided: data_other */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "data_other", function() { return data_other; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/**
 * 其他数据
 */




var data_other = {};

data_other.findDatas = function(){
	data_other.centre_list()
}

data_other.centre_list = function(page=false){
	let road = $(".select_data_other span.select_value")[0].name;
	var _table = `
		<table id="data_other_table"></table>
	`;
	$('#data_center .data_other_body').html(_table);
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode || !road){
		return;
	}
	var dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion;
	var _url = config_url.pdds + Disease.TYPE_LIST.URLS.ROAD_WIDTH,
	// var _url = config_url.pdds + 'data/road_maintenance/queryPage',
		_h = $('.data_other').height() - 192 - 56,
		_current = page || 1,
		_this = _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"];
	var myTable = $('#data_other_table').bootstrapTable({
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
			if( field == 'cesium_map' ){
				let classNames =  $element.prevObject[0].firstElementChild.className;
				if( classNames.indexOf('button_control') > -1 ){
					return;
				}
				_disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].cesium_map(row);
			}else if(field == 'REMARK'){
				var d_coords = row.properties.D_COORDS || '';
				_disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].copy_infos(d_coords);
			}
		},
		
		queryParams : function (params) {
			var _page = (params.offset / params.limit) + 1;
			var temp = {
				"sort": [
					{
					  "k": "MP_CODE",
					  "order": "asc"
					}
				],
				"ops": [{
					"k": "LINK_CODE",
					"type": "string",
					"v": road,
					"op": "eq"
				}],
				"page": {
					"totalPages": 0,
					"count": 10000000,
					"pageNo": _page,
					"pageSize": 12
				}
			};
			
			return JSON.stringify(temp);
		},
		
		columns: _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].table_columns("data_other"),
		
		responseHandler: function (data) {
			if(data.code != '0'){
				$.errorView('数据加载失败');
				return "数据加载失败！";
			}
			
			var _data = data.result.data.features || data.result.data || [],
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
					'id': 'data_other_table',
					'type': false,
					'class': 'data_other_body',
					'value': 2
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
	
	$('#data_other_table').on('mouseover', 'a.remarks', function (e) {
		var row_index = e.target.parentElement.parentElement.sectionRowIndex;
		var row = $("#data_other_table").bootstrapTable("getData")[row_index];
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].open_remark(row, e.target);
	})
	$('#data_other_table').on('mouseout', 'a.remarks', function (e) {
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].close_remark();
	})
	
};





/***/ }),

/***/ "./Apps/Dist/Js/disease_group.js":
/*!***************************************!*\
  !*** ./Apps/Dist/Js/disease_group.js ***!
  \***************************************/
/*! exports provided: disease_group */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_group", function() { return disease_group; });
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");





var disease_group = {};
/*聚类功能根据ZOOM等级变化*/
disease_group.point_group = function(){
	var zoom = _viewer.camera.mathZoom;
	
	if(!_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_point || !_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_point.length){
		return;
	}
	var entities = _viewer.entities;
	this.entity_hide();
	if(_disease_player_js__WEBPACK_IMPORTED_MODULE_1__["disease_player"].position_icon){
		return;
	}
	if(zoom > 17){
		for(var i=0; i<_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_point.length; i++){
			_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_point[i].show = true;
		}
	}else if(15 < zoom && zoom < 18){
//		}else if(14 < zoom && zoom < 18){
		for(var mp_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.mp_code){
			var _entity = entities.getById(mp_code);
			if(_entity){
				_entity.show = true;
			}
		}
	}else if(11 < zoom && zoom < 16){
//		}else if(11 < zoom && zoom < 15){
		for(var link_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.link_code){
			var _entity = entities.getById(link_code);
			if(_entity){
				_entity.show = true;
			}
		}
	}else{
		for(var road_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.road_code){
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
	_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.road_code = _.groupBy(_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].catchList, function (n) {
		return n.properties.LINK_CODE; 
	});
	_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.link_code = _.groupBy(_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].catchList, function (n) {
		var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1;
		return new_code;
	});
	_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.mp_code = _.groupBy(_disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].catchList, function (n) {
		var new_code = n.properties.mp_codes_0 + '_' + n.properties.mp_codes_1 + '_' + n.properties.mp_codes_2;
		return new_code;
	});
//		window.data_groups = disease_list.data_groups;
	
	/*按道路聚类*/
	var _height = 1;
	for(var road_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.road_code){
		_height += 30;
		var links = _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.road_code[road_code],
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
	for(var link_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.link_code){
		
		var roadcode = link_code.split('_')[0] || '';
		if(_heights[roadcode]){
			_heights[roadcode] += 3;
		}else{
			_heights[roadcode] = 1;
		}
		
		var links = _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.link_code[link_code],
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
	for(var mp_code in _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.mp_code){
		
		var mapcode = mp_code.split('_')[1] || '',
			linkcode = mp_code.split('_')[0] || '',
			height_code = linkcode + '_' + mapcode;
		if(_heights[height_code]){
			_heights[height_code] += 3;
		}else{
			_heights[height_code] = 1;
		}
		
		var codes = _disease_list_js__WEBPACK_IMPORTED_MODULE_0__["disease_list"].data_groups.mp_code[mp_code],
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



// module.exports = disease_group;




/***/ }),

/***/ "./Apps/Dist/Js/disease_info.js":
/*!**************************************!*\
  !*** ./Apps/Dist/Js/disease_info.js ***!
  \**************************************/
/*! exports provided: disease_info */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_info", function() { return disease_info; });
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_cesium_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_cesium.js */ "./Apps/Dist/Js/disease_cesium.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_leaflet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_leaflet.js */ "./Apps/Dist/Js/disease_leaflet.js");
/**
 * 病害信息详情界面
 */






var disease_info = {};

disease_info.current_info = null;	//当前所打开病害的详情信息
disease_info.info_ways = null;		//进入详情时，地图上显示的病害
disease_info.jump_type = false;		//进入详情时，地图上显示的病害

/*进入详情页时--不限于各种方式*/
disease_info.come_to_info = function(result, type=false, junge=false, change_type=false){
	disease_info.jump_type = false;
	if(!change_type){
		_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].recog_result = '2';
	}
	this.info_init(result, type, junge, change_type);
	
	let display = $('.disease_info').css('display');
	if(display == 'none'){
		$('.disease_info').fadeIn(100, function(){
			_disease_cesium_js__WEBPACK_IMPORTED_MODULE_1__["disease_cesium"].listen_cesium_body('disease_info', true);
			_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].request_track(true);
		});
	}else{
		_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].request_track(true);
	}
};

disease_info.info_init = function(result, type=false, junge=false, change_type=false) {

//		let ratio_width = 620 / 2448,
//			ratio_height = ratio_width * 2048,
//			_height = Number(ratio_height);

//		$('.disease_info .video_image').css('height', _height);
//		$('.disease_player_body .player_image #canvas_three').css('height', _height);
	
	this.current_info = result;
	
	_disease_list_js__WEBPACK_IMPORTED_MODULE_2__["disease_list"].list_toggle(type, junge);
	_disease_leaflet_js__WEBPACK_IMPORTED_MODULE_3__["disease_leaflet"].visua_up_map_init('visua_up_map');
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
		_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].player_start_init();
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
	
	_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].remove_entity();
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



// module.exports = disease_info;




/***/ }),

/***/ "./Apps/Dist/Js/disease_init.js":
/*!**************************************!*\
  !*** ./Apps/Dist/Js/disease_init.js ***!
  \**************************************/
/*! exports provided: disease_init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_init", function() { return disease_init; });
/* harmony import */ var _disease_slide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_slide.js */ "./Apps/Dist/Js/disease_slide.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_screen_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_screen.js */ "./Apps/Dist/Js/disease_screen.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_cesium_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_cesium.js */ "./Apps/Dist/Js/disease_cesium.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./play_window/cesium_player.js */ "./Apps/Dist/Js/play_window/cesium_player.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_swiper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./disease_swiper.js */ "./Apps/Dist/Js/disease_swiper.js");
/* harmony import */ var _disease_leaflet_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./disease_leaflet.js */ "./Apps/Dist/Js/disease_leaflet.js");
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./event_emitter */ "./Apps/Dist/Js/event_emitter.js");
/**
 * 主界面初始化
 */














var disease_init = {};

disease_init.play_image_type = 'visua_up_map';		//正射图、采集图、点云图，当前播放类型

disease_init.models_init = function () {

    var _this = this;

    /*用户操作界面展开*/
    $('.button_other').mouseover(function () {
        $('.user_install').css('display', 'block');
    })
    $('.button_other').mouseout(function () {
        $('.user_install').css('display', 'none');
    })
    /*点击退出按钮退出当前用户*/
    $('.button_other .user_install .user_handle').click(function () {
        _disease_user_js__WEBPACK_IMPORTED_MODULE_1__["disease_user"].userSignOut();
    })
    /*点击设置按钮设置当前用户城市权限*/
    $('.button_other .user_install .user_config').click(function () {
        let _url = './user.html';
        window.open(_url, '_blank');
    })
    // checkbox--控制图片隐藏显示
    $('.disease_info').on('change', 'label.checkbox_label input', function () {
		var type = this.checked;
		_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_6__["cesium_player"].change_toggle(type);
    })
    // 滑块
    $('.disease_info').on('input', '.image_opacity_change', function () {
		var num_op = this.value,
			ra_op = Number( num_op ) || 0;
		
		_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_6__["cesium_player"].change_alpha(ra_op);
    })
    /*用户城市权限界面展开*/
    $('.user_citys').mouseover(function () {
        $('.user_citys .citys_list').css('display', 'block');
    })
    $('.user_citys').mouseout(function () {
        $('.user_citys .citys_list').css('display', 'none');
    })
    /*点击切换城市权限功能*/
    $('.user_citys .citys_list li').click(function (e) {
        let adcode = e.target.getAttribute('data-adcode'),
            cityname = e.target.innerText,
            newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
        $('.user_citys .citys_list li').removeClass('active');
        $('.user_citys .citys_list').css('display', 'none');
        $('.user_citys .citys_name').html(newname);
        e.target.className = 'active';
		
		window._evented.emit('click.cityChange', adcode)
    })
    /*点击筛选按钮-显示隐藏筛选界面*/
    $('.disease_list_screen a.screen_link').click(function () {
        let type = $('.screen_model').css('display');
        _this.screen_model_hide(type);
        _disease_screen_js__WEBPACK_IMPORTED_MODULE_2__["disease_screen"].screen_icon(type);
    })
    /*点击全部清空标签-将所有筛选条件清空*/
    $('.screen_model').on('click', '.screen_submit label a', function () {
        var checkboxs = $('.screen_model_param input[type="checkbox"]');
        for (var i = 0; i < checkboxs.length; i++) {
            checkboxs[i].checked = false;
        }
        _disease_screen_js__WEBPACK_IMPORTED_MODULE_2__["disease_screen"].subtype_change();
    });
    /*点击应用按钮-根据筛选条件重新查询病害列表*/
    $('.screen_model').on('click', '.screen_submit button', function () {
		
		window._evented.emit('click.screenChange');
		
    });
    /*点击病害信息中-文字按钮-显示隐藏轮播图界面*/
    $('.disease_info').on('click', '.info_view_button button', function () {
        $.errorView('功能未开发');
        return;
        $('.disease_swiper').toggle(200);
    });
    $('.disease_swiper .model_backdrop').click(function () {
        $('.disease_swiper').toggle(200);
    })
    /*点击列表文字-显示隐藏详细信息界面*/
    $('.disease_list .disease_list_body').on('click', '.disease_list_li', function () {
		/*
		disease_screen.screen_icon();
		$('.screen_model').fadeOut(100,function(){
			disease_cesium.listen_cesium_body('disease_info', true);
		});
		*/
        _disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].click_types = true;
        var index = this.getAttribute('data-index');
		var indexData =  _disease_list_js__WEBPACK_IMPORTED_MODULE_8__["disease_list"].catchList[index] || {};
        _disease_info_js__WEBPACK_IMPORTED_MODULE_3__["disease_info"].come_to_info(indexData);

        var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
            return data.ACTIVE == 'active';
        })
        disease_init.player_mode_init(active.ID);
    });
    $('.disease_info').on('click', 'ul.info_tab_list li', function (e) {
        let data_type = e.target.getAttribute('data-type');
        _this.player_mode_init(data_type);
        disease_init.image_type_go(true);
    });
    /*切换图层--:正射图,采集图,点云图切换时*/
	/*$('.disease_info').on('click', '.info_header a.info_header_close', function () {
		$('.disease_info').fadeOut(100);
		disease_list.position_group_change();
		disease_cesium.change_last_point();
		disease_info.polygon_info(true);
		disease_cesium.listen_cesium_body('disease_info', false);
		
		_this.player_mode_init('visua_up_map');
	});*/
    /*点击病害信息中-文字按钮-显示隐藏视频界面*/
	/*$('.disease_info').on('click', '.info_image', function () {
		disease_info.polygon_info(true);
		disease_player.player_start_init();
		$('.disease_player').fadeIn(100, function(){
			disease_player.request_track(true);
			disease_cesium.listen_cesium_body('disease_player', true);
		});
	});*/
    /*业务名称显示列表*/
    $('.data_header .business_name').mouseover(function () {
        var client = this.getBoundingClientRect(),
            left = client.left - 24,
            top = client.top + client.height - 14;

        $('.data_header .business_list').css({
            top: top + "px",
            left: left + "px"
        })
        $('.data_header .business_list').css('display', 'block');
        $('.data_header .business_list a span').attr('class', 'iconfont iconshangsanjiao');
    })
    $('.data_header .business_name').mouseout(function () {
        $('.data_header .business_list').css('display', 'none');
        $('.data_header .business_list a span').attr('class', 'iconfont iconxiasanjiao');
    })
    /*点击按钮-切换当前业务类型-损坏检测与资产巡检-*/
    $('.button_list ul.business_list').on('click', 'li', function () {
        var type = this.getAttribute('data-name') || '',
            current_adcode = _disease_user_js__WEBPACK_IMPORTED_MODULE_1__["disease_user"].current_adcode || {};

        if (type && current_adcode.dataVersion) {
            Disease.TYPE_LIST = Disease.business_list[type];
            $('.button_list ul.business_list li').removeClass('active');
            $('.button_list a.business_open')[0].firstChild.data = Disease.TYPE_LIST.NAME;
            this.className = 'active';
			$('.disease_list_body').html('');
			$('.business_list').fadeOut(0);
			
			window._evented.emit('click.businessChange')
			
        }
    });
    /*点击按钮-关闭病害列表*/
    $('.open_disease_list').on('click', 'a.left_arrow', function () {
		disease_init.left_list_close();
    });
    /*点击按钮-打开病害列表*/
    $('.open_disease_list').on('click', 'a.right_arrow', function () {
        $('.open_disease_list a').attr('class', 'left_arrow');
        $(".disease_list").animate({
            'left': '0px'
        }, 300, 'swing', function () {
            _disease_cesium_js__WEBPACK_IMPORTED_MODULE_4__["disease_cesium"].listen_cesium_body('disease_list', true);
        });
    });
    /*病害列表切换优先级显示初始化*/
    $('.disease_list_sort ul li a').click(function () {
        var hasClass = $(this.parentNode).hasClass('active');
        if (!hasClass) {
            $('.disease_list_sort ul li').removeClass('active');
            $(this.parentNode).addClass('active');
            _disease_screen_js__WEBPACK_IMPORTED_MODULE_2__["disease_screen"].screen_search();
        }
		/*var _type = this.parentNode.getAttribute('type');
		Disease.list_init();*/
    })
    /*切换地图模式--数据中心*/
    $('.search_param ul li').click(function () {
        $('.search_param ul li').removeClass('active');
        $(this).addClass('active');
        _disease_centre_js__WEBPACK_IMPORTED_MODULE_7__["disease_centre"].centre_init(this.type);
        _disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].player_icon_change(true);
    })

    $('.disease_list .disease_list_body').scroll(function (e) {
        var scrollHeight = $('.disease_list .disease_list_body')[0].scrollHeight,
            scrollTop = $('.disease_list .disease_list_body')[0].scrollTop,
            clientHeight = $('.disease_list .disease_list_body')[0].clientHeight,
            _height = scrollHeight - scrollTop - clientHeight;

        if (scrollTop && _height <= 5) {
            //滚动条滚到最底部
            _disease_list_js__WEBPACK_IMPORTED_MODULE_8__["disease_list"].chunk_list_change();
        }
    });
    /*用户进行反馈时,点击类型选择*/
    $(".select_value input").on("click", function () {
        $('.select_option').toggle();
        $('.select_value').toggleClass("active");
    });
    $(".select_option li").click(function (event) {
        let val = event.target.getAttribute('data-name'),
            text = event.target.innerText,
            hide_type = (val == '1') ? 'block' : 'none',
            hide_class = (val == '1') ? '' : true;

        $('.select_option').toggle();
        $('.select_value input').val(text);
        $('.select_value input').attr('name', val);
        $('.select_value').toggleClass("active");

        $('.feedback_model>div>p').css("display", hide_type);

        $('.feedback_model div textarea').removeClass('height');
        if (val != '1') {
            $('.feedback_model div textarea').addClass('height');
        }

    });
    $('.screen_model').on('click', '.screen_model_param input[type="checkbox"]', function () {
        var type = this.getAttribute('name');
        var type_list = Disease.TYPE_LIST.TYPES;
        if (type == type_list.KEY) {
            _disease_screen_js__WEBPACK_IMPORTED_MODULE_2__["disease_screen"].subtype_change();
        }else if(type == 'all'){
            var id =  this.getAttribute('data-name');
            $('.screen_model .TYPE[name="' + id + '"] input[type="checkbox"]').prop('checked', this.checked);
        }

    });
    /*点击反馈提交*/
    $(".feedback_submit").click(function (event) {
        _this.feedback_submit();
    });
    /*点击遮罩模版*/
    $("#mask_model").click(function (event) {
        _disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].menu_feedbacks();
    });
};

/* 关闭左侧列表栏 */
disease_init.left_list_close = function(){
	$('.open_disease_list a').attr('class', 'right_arrow');
	_disease_cesium_js__WEBPACK_IMPORTED_MODULE_4__["disease_cesium"].listen_cesium_body('disease_list', false);
	$(".disease_list").animate({
		'left': '-339px'
	}, 300);
}

disease_init.screen_model_hide = function (type) {
    if (type == 'none') {
        $('.screen_model').css('display', 'block');
        $(".screen_model").animate({
            'left': 344
        }, 300, 'swing', function () {
            $('.screen_model').css('z-index', '112');
            _disease_cesium_js__WEBPACK_IMPORTED_MODULE_4__["disease_cesium"].listen_cesium_body('screen_model', true);
        });
    } else {
        $('.screen_model').css('z-index', '110');
        $(".screen_model").animate({
            'left': 0
        }, 300, 'swing', function () {
            $('.screen_model').css('display', 'none');
        });
        _disease_cesium_js__WEBPACK_IMPORTED_MODULE_4__["disease_cesium"].listen_cesium_body('screen_model', false);
    }
};

/*正射图-采集图-点云图变化*/
disease_init.player_mode_init = function (type) {

    let new_class = 'player_video new_' + type;
    $('.player_video').attr('class', new_class);

    this.play_image_type = type;
    $('.disease_info ul.info_tab_list li').removeClass('active');
    $('.disease_info ul.info_tab_list li.' + type).addClass('active');
    $('.video_image').fadeOut(0);
    $('#' + type).fadeIn(0);
};

/*根据类型的不同去执行不同事件*/
disease_init.image_type_go = function (type = false) {
    // $('.result_list').hide();
    if (this.play_image_type == 'visua_up_map') {
        // $('.result_list').show();
        _disease_leaflet_js__WEBPACK_IMPORTED_MODULE_10__["disease_leaflet"].road_player(type);
		window.mbSideMap && window.mbSideMap.resize();
    } else if (this.play_image_type == 'collect_map') {
		type && _disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].update_image();
        _disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].player_projection();
    } else if (this.play_image_type == 'threed_map') {
        // cesium_player._alpha = 1.0;
        // $('.image_opacity .checkbox_label input')[0].checked = false;
		
        var _type = $('.image_opacity .checkbox_label input')[0].checked;
		if(!_type){
			_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_6__["cesium_player"].update();
		}
        _play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_6__["cesium_player"].change_toggle(_type);
    }
};

/*反馈功能提交*/
disease_init.feedback_submit = function () {
    let type = $('.select_value input').attr('name') || '',
        desc = $('textarea.desc').val() || '';
    if (desc.length > 200) {
        $.errorView('描述信息过长！');
        return;
    }
    let json = {
        'pdId': _disease_info_js__WEBPACK_IMPORTED_MODULE_3__["disease_info"].current_info.properties.ID,
        'message': desc,
        'type': type
    },
        url = config_url.pdds + 'feedback/save?pdId=' + json.pdId + '&message=' + json.message + '&type=' + json.type;
    $.postAjax({
        url: url,
        data: json,
        callback: function (data) {
            if (data.code != '0') {
                $.errorView(data.message);
                return;
            }
            $.errorView(data.message, true);
            _disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].menu_feedbacks();
        }
    })
};

/*业务类型变化时*/
disease_init.business_change = function () {
    // 地图弹窗的变化
    var type_list = Disease.TYPE_LIST;
    var _buttons = `
		${type_list.FUNBUTTON.map(f => `
			<button class="btn ${f.CLASS} ${f.CONTROL}" name="${f.ID}">${f.NAME}</button>
		`).join('')}
	`;
    $('.cesium_popup .popup_content .image_buttons').html(_buttons);

    // 数据中心左侧面板
    var center_tab = $('.data_center_tab ul li');
    for (let i = 0; i < center_tab.length; i++) {
        center_tab[i].lastChild.data = type_list.LEFTTABS[i].NAME;
    }

    // 视频界面 按钮组显示
    var _player = `
		${type_list.FUNBUTTON.map(f => `
			<li class="${f.ID} ${f.ACTIVE} ${f.CONTROL}" data-type="${f.ID}">${f.NAME}</li>
		`).join('')}
	`;
    $('.info_image .info_image_btn ul.info_tab_list').html(_player);

    // 初始化 视频界面的类型
    var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
        return data.ACTIVE == 'active';
    })
    disease_init.play_image_type = active.ID;
	
	$('#data_center').attr('class', type_list.ID);
    $('#highway_disease').attr('class', type_list.ID);
	
	var text = Disease.TYPE_LIST.TITLE;
	$('.info_header a.info_header_close').attr('title', '关闭' + text + '信息');
    $('.info_header div.menu_manage ul.menu_list_child li.menu_collect')[0].lastChild.data = '收藏' + text;
	
    // 数据中心列表筛选项变更
    // disease_centre.search_param();
};



// module.exports = disease_init;









/***/ }),

/***/ "./Apps/Dist/Js/disease_leaflet.js":
/*!*****************************************!*\
  !*** ./Apps/Dist/Js/disease_leaflet.js ***!
  \*****************************************/
/*! exports provided: disease_leaflet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_leaflet", function() { return disease_leaflet; });
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _leftOrthograph_map_init_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./leftOrthograph/map_init.js */ "./Apps/Dist/Js/leftOrthograph/map_init.js");
/* harmony import */ var _leftOrthograph_addLayers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./leftOrthograph/addLayers.js */ "./Apps/Dist/Js/leftOrthograph/addLayers.js");


/*病害-leaflet地图插件*/








var disease_leaflet = {};
var lastInfoId = null;
// var map;
var polygons = {};
var last_polygon = null;

disease_leaflet.visua_up_map_init = function(containerID , _mapOption){
	lastInfoId = null;
	return Object(_leftOrthograph_map_init_js__WEBPACK_IMPORTED_MODULE_3__["visuaUpMapInit"])(containerID, _mapOption);
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
	
	let datas = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].getTrackBufferResults(),
		features = datas.features || [],
		_index = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].current_num - 1,
		_view = _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].current_info,
		current_id = _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].current_info.properties.ID,
		track = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].track_list[_index],
		_center = [track.x, track.y];
	
	
	
	if( type && _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].current_num == _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].default_num ){
		_center = _view.center_xy;
	}
	
	if(!_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].jump_type){
		_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].jump_type = true;
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
	
	Object(_leftOrthograph_addLayers_js__WEBPACK_IMPORTED_MODULE_4__["addLayers"])(features, current_id, window.mbSideMap, resultToggle);
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



// module.exports = disease_leaflet;




/***/ }),

/***/ "./Apps/Dist/Js/disease_list.js":
/*!**************************************!*\
  !*** ./Apps/Dist/Js/disease_list.js ***!
  \**************************************/
/*! exports provided: disease_list */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_list", function() { return disease_list; });
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_group_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_group.js */ "./Apps/Dist/Js/disease_group.js");
/* harmony import */ var _disease_screen_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_screen.js */ "./Apps/Dist/Js/disease_screen.js");
/**
 * 左侧病害列表
 */







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
	_disease_screen_js__WEBPACK_IMPORTED_MODULE_5__["disease_screen"].screen_search(true);
};

/*病害数据初始化*/
disease_list.list_init = function(param=[],junge=false) {
	var _this = this;
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode){
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
		'v': _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion,
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
	
	var href = 'iconrising' || false || false,			//上-右-下
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
	var data = _disease_info_js__WEBPACK_IMPORTED_MODULE_2__["disease_info"].current_info.properties,
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



// module.exports = disease_list;









/***/ }),

/***/ "./Apps/Dist/Js/disease_main_map.js":
/*!******************************************!*\
  !*** ./Apps/Dist/Js/disease_main_map.js ***!
  \******************************************/
/*! exports provided: disease_map */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_map", function() { return disease_map; });
/* harmony import */ var _disease_init_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_init.js */ "./Apps/Dist/Js/disease_init.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_group_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_group.js */ "./Apps/Dist/Js/disease_group.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _map_init__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./map_init */ "./Apps/Dist/Js/map_init.js");
/*
 * @Author: tao.w
 * @Date: 2020-12-01 15:33:27
 * @LastEditors: tao.w
 * @LastEditTime: 2020-12-02 16:19:58
 * @Description: 主地图相关
 */









let _map = null;
let _oldSelectIconLayers = [];
let _oldSelectVectorLayers = [];
var hoveredStateId = null; //鼠标选择要素
var hoveredLayerId = null; //鼠标选择层
var _event = window.event;

var modelMapRelation = {
	1: {
		'TYPE': '702',	//防护设施
		'MODELNAME': 'BARRIER'
	},
	2: {
		'TYPE': '701',	//车道线
		'MODELNAME': 'HD_DIVIDER'
	},
	// 3: '',
	4: {				//里程桩
		'TYPE': '707',
		'MODELNAME': 'HD_POINT'
	},
	5: {				//里程桩
		'TYPE': '707',
		'MODELNAME': 'HD_POLYGON'
	},
	8: {				//路牌
		'TYPE': '704',
		'MODELNAME': 'HD_TRAFFICSIGN'
	},
}
var sourceLayerMapRalation = {
	'HD_POINT': {
		'13': {			//灯杆
			'TYPE': '705',
			'MODELNAME': 'HD_POINT'
		},
		'15': {			//公里里程桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'16': {			//百米里程桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'21': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'22': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'23': {			//视频监控
			'TYPE': '706',
			'MODELNAME': 'HD_POINT'
		},
		'115': {			//虚拟公里桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
		'116': {			//虚拟百米桩
			'TYPE': '707',
			'MODELNAME': 'HD_POINT'
		},
	},
	'ROAD': {			//桥隧
		'3': {
			'TYPE': '703',
			'MODELNAME': 'HD_POINT'
		},
		'4': {
			'TYPE': '708',
			'MODELNAME': 'HD_POINT'
		},
	},
	'HD_POLYGON': {			//地面标志
		'TYPE': '708',
		'MODELNAME': 'HD_POLYGON'
	}
}

/**
 * @description: 初始化构建添加底图层
 * @param {*}
 * @return {*}
 */
function initBackgroundStyle() {
    /*天地图URL配置*/
    //TODO  配置应该放在配置文件,暂时先放在这个
    // 在线天地图矢量地图服务(墨卡托投影)
    let TDT_VEC_W = [
        "http://t0.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图矢量中文标记服务(墨卡托投影)
    //"&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles" 
    let TDT_CVA_W = [
        "http://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图影像服务地址(墨卡托投影)

    let TDT_IMG_W = [
        "http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles&tk=bb3a11452a810044c551e46541839c84",
    ];

    //在线天地图影像中文标记服务(墨卡托投影)
    let TDT_CIA_W = [
        "http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t1.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t2.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t3.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t4.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t5.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t6.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
        "http://t7.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default.jpg&tk=bb3a11452a810044c551e46541839c84",
    ];
	
	//资产栅格瓦片
    let DATA_SETS_2D = [];
	if(_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode){
		DATA_SETS_2D = [
			config_url.vector_tile + 'x={x}&y={y}&z={z}&f=png&scale=1&s=' + _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode['2d_road_grid_tiles']
		];
	}

    //['vec-w','cva-w','img-w','cia-w']
    let style = {
        "version": 8,
        "sources": {
            "raster-vec-w": {
                "type": "raster",
                'tiles': TDT_VEC_W,
                "tileSize": 256
            },
            "raster-cva-w": {
                "type": "raster",
                'tiles': TDT_CVA_W,
                "tileSize": 256
            },
            "raster-img-w": {
                "type": "raster",
                'tiles': TDT_IMG_W,
                "tileSize": 256
            },
            "raster-cia-w": {
                "type": "raster",
                'tiles': TDT_CIA_W,
                "tileSize": 256
            },
            "data-sets-2d": {
                "type": "raster",
                'tiles': DATA_SETS_2D,
                "tileSize": 256
            },
        },
        "layers": [
            {
                "id": "vec-w",
                "type": "raster",
                "source": "raster-vec-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    // 'visibility': 'none'
                }
            },
            {
                "id": "cva-w",
                "type": "raster",
                "source": "raster-cva-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    // 'visibility': 'none'
                }
            },
            {
                "id": "img-w",
                "type": "raster",
                "source": "raster-img-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            },
            {
                "id": "cia-w",
                "type": "raster",
                "source": "raster-cia-w",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            },
            {
                "id": "data-sets-2d",
                "type": "raster",
                "source": "data-sets-2d",
                "minzoom": 9,
                "maxzoom": 24,
                'layout': {
                    'visibility': 'none'
                }
            }
        ]
    };
    return style;
}

/* 业务类型: 资产管理, 缓存加载当前所有数据信息 */
var cacheAssetDatas = [];
function loadAssetDataPromise() {
    cacheAssetDatas = [];
    return new Promise(function (resolve, reject) {
        let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion;
        let dataCode = Disease.TYPE_LIST.DATACODE;
        let url = config_url.pdds + 'data/' + dataCode + '/query';
        let body = {
            'ops': [{
                'k': 'DATA_VERSION',
                'v': dataVersion,
                'op': 'eq'
            }],
            'returnFields': [
                'TYPE', 'SUBTYPE', 'MP_CODE', 'UP_DOWN', 'UDATE', 'ID', '_OID_', 'MODEL_NAME'
            ]

        }
        $.postAjax({
            'url': url,
            'token': true,
            'data': body,
            'callback': function (data) {
                if (data.code != '0') {
                    $.errorView('浮窗信息数据获取失败：' + data.message);
                    resolve();
                } else {
                    data.result.data.features.forEach(d => {
                        cacheAssetDatas.push(d.properties)
                    })
                    resolve(1);
                }
            }
        })
    });
}


// 查询道路-线
function findLinks(dataVersion) {
	var url = config_url.pdds + 'data/road_link/query';
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

// 线路删除
function handleRoadRemove(){
	if(_map.getLayer('dash-lines')){
		_map.removeLayer('dash-lines');
		if( _map.getSource('roadLinkDash') ){
			_map.removeSource('roadLinkDash');
		}
	}
	if(_map.getLayer('default-lines')){
		_map.removeLayer('default-lines');
		if( _map.getSource('roadLinkDefault') ){
			_map.removeSource('roadLinkDefault');
		}
	}
}

// 线路删除
function handleRoadHide(zoom){
	let visibility = (zoom > 15) ? 'none' : 'visible';
	if(_map.getLayer('dash-lines')){
		_map.setLayoutProperty('dash-lines', 'visibility', visibility)
	}
	if(_map.getLayer('default-lines')){
		_map.setLayoutProperty('default-lines', 'visibility', visibility)
	}
}

var convergeGroups = [];
var convergeGroupOptions = {
    'LINK_CODE': [9, 10, 11],			//道路聚类
    'KMP_CODE': [12, 13, 14, 15],		//公里桩聚类
    'MP_CODE': [16, 17],				//百米桩聚类
};

function loadConvergeData(type = {}) {
	
    let types = (type.TYPE && type.TYPE.length) ? type.TYPE.join() : '';
	let subtype = type.SUBTYPE || '';
	let linkCode = (type.LINK_CODE && type.LINK_CODE.length) ? type.LINK_CODE.join() : '';
    let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion;
    let url = config_url.pdds + Disease.TYPE_LIST.URLS.AGGR + dataVersion + '&types=' + types+ '&subtype=' + subtype + '&linkCodes=' + linkCode;
    $.getAjax({
        'url': url,
        'token': true,
        'callback': function (data) {
            if (data.code != '0' || _.isEmpty(data.result)) {
                console.warn('聚合接口返回异常');
                return;
            }
            let result = data.result;
            let features = [];
            convergeGroups = [];
            _.forEach(result, (v, k) => {

                var zooms = convergeGroupOptions[k];
                var value = [];

                v.forEach(d => {
                    var _code = d.CODE || null;
                    var _count = d.COUNT || 0;
                    var _center = d.CENTROID ? d.CENTROID.split(',') : null;
                    if (_center && _count) {
                        var markDiv = document.createElement("div");
                        markDiv.innerHTML = _count;
                        markDiv.className = 'convergeGroup';
                        markDiv.setAttribute('data-code', _code);
                        var _m = new mapboxgl.Marker({
                            anchor: 'center',
                            element: markDiv
                        }).setLngLat([_center[0], _center[1]])
                        .addTo(_map);
                        value.push(_m)
                    }
                })

                convergeGroups.push({
                    'k': k,
                    'z': zooms,
                    'v': value
                })

            })
            convergeGroupChange();
        }
    })
}

/*地图等级*/
function zoomLevelChange(zoom) {
	
    if (zoom > 19) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = false;
        $('.layer_list li span.radio_label').removeClass('active');
        layerChange(5);
    } else if (zoom < 20) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = true;
        // var _active = $('.layer_list li span.radio_label.active');
        // if (!_active.length) {
            $('.layer_list li span.radio_label[name="' + disease_map.layer_type + '"]').addClass('active');
            layerChange(disease_map.layer_type);
        // }
    }
};

/* 地图缩放等级变化时,聚类实时变化 */
function convergeGroupChange() {
    var zoom_level = $('.cesium_control .zoom_level a').text(),
        _z = Number(zoom_level);
	
	zoomLevelChange(_z);
	
    convergeGroups.forEach(d => {

        let values = d.v;
        let _type = d.z.includes(_z);
        let _style = (_type && !playerPoint) ? 'block' : 'none';
        let value_1 = values[0];
        if (value_1) {
            let value_1_ele = value_1.getElement();
            if (value_1_ele.style.display == _style) {
                return
            }
        }

        values.forEach(v => {

            let _ele = v.getElement();
            if (_ele) {
                _ele.style.display = _style
            }

        })

    })
}


/* 清除当前缓存的聚类 */
function clearConvergeGroup() {
    convergeGroups.forEach(d => {
        let values = d.v;
        values.forEach(v => {
            v.remove && v.remove();
        })
    })
    convergeGroups = [];
}

/* 从地图进入病害界面 */
function playerToTracks(ev){
	
	// let evProp = ev.features[0].properties || {};
	// let sourceLayer = ev.features[0].sourceLayer || null;
	// let evId = evProp.ID;
	// let feaType = evProp.FEA_TYPE;
	// let subType = evProp.TYPE;
	// let evType = null;
	
	getLayerInfo(ev.features);
	return
	let evProp = {"type":"Feature","properties":{"MAX_Y":44.08610060899196,"MAX_X":87.77992381043984,"KMP_CODE":"G3003|99","_OID_":"100000577","UDATE":"1603780724000","TRACK_ID":"204443803_20201020180446920","LINK_CODE":"G3003","MIN_Y":44.08610060899196,"MP_CODE":"G3003|99","MIN_X":87.77992381043984,"_CREATE_TIME_":1604660582787,"ID":"5508365554169367796","CENTROID":"87.77992381043984,44.08610060899196,511.57149172760523","TYPE":"707","GEOM":"POINT(87.77992381043984 44.08610060899196 511.57149172760523)","DATA_TYPE":"MP","MATERIAL":"2","_UPDATE_TIME_":1604660582787,"SUBTYPE":"15","MODEL_NAME":"OBJECT_PT","adcode":"650100","DATA_VERSION":"wlmq_2020_11_06","D_COORDS":"87.77992381043984 44.08610060899196 511.57149172760523","HEIGHT":"1.3352","NAME":"G3003|99","LINK_NAME":"Ｇ３００３绕城高速","T_POINT_ID":"204443803_20201020180456577000","range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"},"geometry":{"type":"Point","coordinates":[87.77992381043984,44.08610060899196,511.57149172760523]},"range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"}
	
	
	var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
		return data.ACTIVE == 'active';
	})
	
	
	_disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(active.ID);
	_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(evProp,true,true);
				
	
}

/**
 * @description: 清除地图除底图图层外的所有图层和数据
 * @param {*}
 * @return {*}
 */
function clearMapData() {

}

/**
 * @description:  清除图层相关所有的数据
 * @param {*}
 * @return {*}
 */
function removeLayerEvent() {
    for (let i = 0; i < _oldSelectIconLayers.length; i++) {
        _map.off('mouseenter', _oldSelectIconLayers[i][0], iconMouseenter);
        _map.off('mouseleave', _oldSelectIconLayers[i][1], iconMouseleave);
        _map.off('click', _oldSelectIconLayers[i][0], iconMouseClick);
    }

    for (let i = 0; i < _oldSelectVectorLayers.length; i++) {
        _map.off('mousemove', _oldSelectVectorLayers[i], vectorMousemove);
        _map.off('mouseleave', _oldSelectVectorLayers[i], vectormouseleave);
		_map.off('click', _oldSelectVectorLayers[i], vectorMouseClick);
    }
}

/**
 * @description: 图片类渲染要素鼠标点击事件
 * @param {*}
 * @return {*}
 */
//
function iconMouseClick(e) {
    if (e.features.length > 0) {
		
		// addPopup(e);
		playerToTracks(e);
		console.log('点击')
		
    }
}
function vectorMouseClick(e) {
    if (e.features.length > 0) {
		
		// addPopup(e);
		playerToTracks(e);
		console.log('点击')
		
    }
}
/**
 * @description: 图片类渲染要素鼠标移入事件
 * @param {*}
 * @return {*}
 */
//
function iconMouseenter(e) {
    if (e.features.length > 0) {
		addPopup(e);
		
        // var filter1 = e.features.reduce(
        //     function (memo, feature) {
        //         memo.push(feature.properties.ID);
        //         return memo;
        //     },
        //     ['in', 'ID']
        // );
        let feature = e.features[0];
        let filter = ['in', 'ID', feature.properties.ID];
        let id = feature.layer.id + '-highlighted';
        hoveredStateId = id;
        _map.setFilter(id, filter);
    }
}

/**
 * @description: 图片类渲染要素鼠标移出事件
 * @param {*}
 * @return {*}
 */
function iconMouseleave(e) {
    // let id = e.target.painter.id || '';
    if (hoveredStateId != null) {
		
		closePopup();
		
        // id != '' ? _map.setFilter(id, ["in", "ID", '']) : false;
        _map.setFilter(hoveredStateId, ["in", "ID", '']);
        hoveredStateId = null;
    }
    // hoveredStateId = null;
}

function vectorMousemove(e) {
    if (e.features.length > 0) {
		
        if (hoveredStateId && hoveredLayerId) {
            let layer = _map.getLayer(hoveredLayerId);
            _map.setFeatureState(
                {
                    source: layer.source,
                    id: hoveredStateId,
                    sourceLayer: layer.sourceLayer
                },
                { hover: false }
            );
        }
        let feature = e.features[0];
		
		if(hoveredStateId != feature.id || hoveredLayerId != feature.layer.id){
			addPopup(e);
		}
		
        hoveredStateId = feature.id;
        hoveredLayerId = feature.layer.id;
		
        let layer = _map.getLayer(hoveredLayerId);
        _map.setFeatureState(
            {
                source: layer.source,
                id: hoveredStateId,
                sourceLayer: layer.sourceLayer
            },
            { hover: true }
        );
    }
}
function vectormouseleave(e) {
    if (hoveredStateId) {
		
		closePopup();
		
        let layer = _map.getLayer(hoveredLayerId);
        _map.setFeatureState(
            {
                source: layer.source,
                id: hoveredStateId,
                sourceLayer: layer.sourceLayer
            },
            { hover: false }
        );
    }
    hoveredStateId = null;
}


/**
 * @description: 图层鼠标事件初始
 * @param {*} _config
 * @return {*}
 */
function initCustomEvent(_config) {
    let _iconlayers = _config.selectIconLayerIds || [];
    let _vectorLayers = _config.selectHoverEffectLayerIds || [];
    removeLayerEvent();
    for (let i = 0; i < _iconlayers.length; i++) {
        _map.on('mouseenter', _iconlayers[i][0], iconMouseenter);
        _map.on('mouseleave', _iconlayers[i][1], iconMouseleave);
        _map.on('click', _iconlayers[i][0], iconMouseClick);
        _map.on('click', _iconlayers[i][1], iconMouseClick);
    }
    for (let i = 0; i < _vectorLayers.length; i++) {
        _map.on('mousemove', _vectorLayers[i], vectorMousemove);
        _map.on('mouseleave', _vectorLayers[i], vectormouseleave);
        _map.on('click', _vectorLayers[i], vectorMouseClick);
    }
    _oldSelectIconLayers = _iconlayers;
    _oldSelectVectorLayers = _vectorLayers;
}

/**
 * @description: 添加mvt配置数据源
 * @param {*} sources
 * @return {*}
 */
function addSources(sources) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    if (_map == null) return false;
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
		// let mvt = Disease.TYPE_LIST.MVT + '' + disease_user.current_adcode.adcode;
		let mvt = (Disease.TYPE_LIST.DATACODE == "pd") ? _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode['2d_pd_mvt_tiles'] : _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode['2d_road_mvt_tiles'];
		if( !_map.getSource(source.datasource) ){
			_map.addSource(source.datasource, {
				'type': 'vector',
				'tiles': [config_url.vector_tile + 's=' + mvt + '&get=map&cache=true&f=mvt&x={x}&y={y}&z={z}'],
				// 'tiles': [config_url.vector_tile + 'mid=' + source.datasource_mvt + '&get=map&cache=true&f=mvt&x={x}&y={y}&z={z}'],
				'minzoom': source.zoomRange[0],
				'maxzoom': source.zoomRange[1]
			});
		}
    }
}
/**
 * @description: 删除mvt配置数据源
 * @param {*} sources
 * @return {*}
 */
function removeSources(sources, callback) {
	
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    if (_map == null) return false;
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
		if( _map.getSource(source.datasource) ){
			_map.removeSource(source.datasource);
		}
    }
	callback && callback();
}
/**
 * @description: 添加配置数据图层
 * @param {*} layers
 * @return {*}
 */
function addLayers(layers, toplayerId = null) {
    if (_map == null) return false;
    for (var i in layers) {
        var layer = layers[i];
		if( !_map.getLayer(layer.id) ){
			if (layer.id != toplayerId) {
			    _map.addLayer(layer, toplayerId);
			} else {
			    _map.addLayer(layer);
			}
		}
    }
}
/**
 * @description: 删除配置数据图层
 * @param {*} layers
 * @return {*}
 */
function removeLayers(layers, callback) {
    if (_map == null) return false;
    for (var i in layers) {
        var layer = layers[i];
		if( _map.getLayer(layer.id) ){
			_map.removeLayer(layer.id);
		}
    }
	callback && callback();
}

/* 获取当前所点击要素的数据 */
function getLayerInfo(ev, name){
	
	let dataCode = Disease.TYPE_LIST.DATACODE;
	let evProp = ev[0].properties || {};
	let sourceLayer = ev[0].sourceLayer || null;
	let evId = evProp.ID;
	let feaType = evProp.FEA_TYPE;
	let subType = evProp.TYPE;
	let evType = null;
	let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion;
	
	if(dataCode == 'pd'){
		evType = evProp.TYPE;
		subType = evProp.SUBTYPE;
	}else{
		if(sourceLayer == 'firstnode'){
			evType = modelMapRelation[feaType] || null;
		}else if(sourceLayer == 'HD_POLYGON'){
			evType = sourceLayerMapRalation[sourceLayer];
		}else{
			evType = (sourceLayerMapRalation[sourceLayer] && sourceLayerMapRalation[sourceLayer][subType]) ? sourceLayerMapRalation[sourceLayer][subType] : null;
		}
	}
	
	if(!evType){
		$.errorView('无法获取当前要素类型！');
		return;
	}
	let body = {
		'ops': [
			{
				'k': '_OID_',
				'v': evId + '',
				'op': 'eq'
			},
			{
				'k': 'DATA_VERSION',
				'v': dataVersion,
				'op': 'eq'
			}
		]
	}
	if(evType.MODELNAME){
		body.ops.push({
			'k': 'MODEL_NAME',
			'v': evType.MODELNAME,
			'op': 'eq'
		})
	}else if(sourceLayer){
		body.ops.push({
			'k': 'MODEL_NAME',
			'v': sourceLayer,
			'op': 'ieq'
		})
	}
	
	if(evProp.HEIGHT){
		body.ops.push({
			'k': 'HEIGHT',
			'v': evProp.HEIGHT + '',
			'op': 'eq'
		})
	}
	
	loadLayerInfo(body).then((_t) => {
		if(_t){
			var active = Disease.TYPE_LIST.FUNBUTTON.find(function (data) {
				if(name){
					return data.ID == name;
				}
				return data.ACTIVE == 'active';
			})
			
			var info = _t.find(function (data) {
				return data.properties.TRACK_ID;
			})
			if(info){
				var currentInfo = formatProperties(info);
				_disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(active.ID);
				_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(currentInfo,true,true);
			}
		}
    })
}

/* 格式化原始数据 */
function formatProperties(prop){
	var type_list = Disease.TYPE_LIST.TYPES,
		list_info = Disease.TYPE_LIST.LISTINFO,
		create_time = prop.properties._CREATE_TIME_ || '',
		update_time = prop.properties.UDATE || '',
		type = prop.properties[type_list.KEY],
		layer_type = 'Point',
		data_type = prop.properties[type_list.KEY] || '',
		// mps_xy = prop.properties.CENTROID,
		mps_xy = prop.properties.CENTROID || '',
		center = mps_xy.split(','),
		subtype = prop.properties[list_info.ID] || '',
		geo_range = prop.properties.GEOM || '',
		geo_range_type = $.cesium_range_type(geo_range),
		geo_range_new = $.cesium_range(geo_range),
		link_name = prop.properties.LINK_NAME || '',
		mp_code = prop.properties.MP_CODE || '',
		mp_codes = mp_code.split('|'),
		mp_codes_0 = mp_codes[0] || '',
		mp_codes_1 = mp_codes[1] ? ('K' + mp_codes[1]) : '',
		mp_codes_2 = mp_codes[2] ? ('+' + mp_codes[2] + '00') : '+000',
		mp_codes_2 = mp_code ? mp_codes_2 : '',
		
		up_down = prop.properties.UP_DOWN || '',
		det_time = prop.properties.DET_TIME || '',
		
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
	var new_code = prop.properties.LINK_CODE + '_' + prop.properties.MP_CODE;
	var new_data = {
		'range_type': geo_range_type,
		'create_time': create_time ? $.timeData(create_time,0) : '无',
		'update_time': update_time ? $.timeConvert(update_time,0) : '无',
		'det_time': update_time ? $.timeData(update_time,0) : '无',
		'link_code': prop.properties.LINK_CODE + '',
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
		prop.properties[item] = new_data[item];
		prop[item] = new_data[item];
	}
	
	return prop;
}

/* 从后台接口获取数据 */
function loadLayerInfo(body){
    return new Promise(function (resolve, reject) {
        let dataCode = Disease.TYPE_LIST.DATACODE;
        let url = config_url.pdds + 'data/' + dataCode + '/query';
        $.postAjax({
            'url': url,
            'token': true,
            'data': body,
            'callback': function (data) {
                if (data.code != '0') {
                    $.errorView('获取当前要素类型失败：' + data.message);
                    resolve();
                } else {
					var result = data.result.data.features;
                    resolve(result);
                }
            }
        })
    });
}

/**
 * @description: 添加视频播放定位点
 * @param {*} event
 * @return {*}
 */
var playerPoint = null;
var lastRotation = null;
/* 新增 */
function addPlayerPoint(data){
	var coordinates = [ data.coordinates[0], data.coordinates[1] ];
	var rotation = (data.rotation === null) ? lastRotation : (0 - data.rotation);
	if(!playerPoint){
		let playerDiv = document.createElement("div");
		let playerDivImage = document.createElement("div");
		playerDivImage.className = 'playerPoint';
		playerDivImage.style.transform = 'rotate(' + rotation + 'deg)';
		
		playerDiv.appendChild(playerDivImage)
		
		playerPoint = new mapboxgl.Marker({
		    anchor: 'center',
		    element: playerDiv
		})
		.setLngLat( coordinates )
		.addTo(_map);
	}else{
		playerPoint.setLngLat( coordinates )
		playerPoint.getElement().firstChild.style.transform = 'rotate(' + rotation + 'deg)';
	}
	
	_map.setCenter(coordinates);
	lastRotation = rotation;
	
}
/* 删除 */
function removePlayerPoint(){
	playerPoint && playerPoint.remove();
	playerPoint = null;
}


/**
 * @description: 添加信息气泡窗口
 * @param {*} event
 * @return {*}
 */
var popupOffsets = {
	'top': [4, 4],
	'top-left': [-4, 4],
	'top-right': [4, 4],
	'bottom': [0, -4],
	'bottom-left': [4, -4],
	'bottom-right': [-4, -4],
	'left': [4, -50],
	'right': [-4, -50]
};
var popupMarker = null;
var popupMouseType = false;
var evBody = null;
function addPopup(ev = {}) {
	
	
	closePopupTimeOut && clearTimeout(closePopupTimeOut);
	let dataCode = Disease.TYPE_LIST.DATACODE;
	let evProp = ev.features[0].properties || {};
	let sourceLayer = ev.features[0].sourceLayer || null;
	let evId = evProp.ID;
	let feaType = evProp.FEA_TYPE;
	let subType = evProp.TYPE;
	let evType = null;
	
	let evProps = {"type":"Feature","properties":{"MAX_Y":44.08610060899196,"MAX_X":87.77992381043984,"KMP_CODE":"G3003|99","_OID_":"100000577","UDATE":"1603780724000","TRACK_ID":"204443803_20201020180446920","LINK_CODE":"G3003","MIN_Y":44.08610060899196,"MP_CODE":"G3003|99","MIN_X":87.77992381043984,"_CREATE_TIME_":1604660582787,"ID":"5508365554169367796","CENTROID":"87.77992381043984,44.08610060899196,511.57149172760523","TYPE":"707","GEOM":"POINT(87.77992381043984 44.08610060899196 511.57149172760523)","DATA_TYPE":"MP","MATERIAL":"2","_UPDATE_TIME_":1604660582787,"SUBTYPE":"15","MODEL_NAME":"OBJECT_PT","adcode":"650100","DATA_VERSION":"wlmq_2020_11_06","D_COORDS":"87.77992381043984 44.08610060899196 511.57149172760523","HEIGHT":"1.3352","NAME":"G3003|99","LINK_NAME":"Ｇ３００３绕城高速","T_POINT_ID":"204443803_20201020180456577000","range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"},"geometry":{"type":"Point","coordinates":[87.77992381043984,44.08610060899196,511.57149172760523]},"range_type":"Point","create_time":"2020/11/06","update_time":"2020/10/27","det_time":"2020/10/27","index":1,"link_code":"G3003","new_code":"G3003_G3003|99","center_xy":[87.77992381043984,44.08610060899196,511.57149172760523],"subtype":"15","_cn_type":"里程桩","_cn_subtype":"","cn_up_down":"","cn_mark":"G3003 Ｇ３００３绕城高速 K99+000","locs":[[87.77992381043984,44.08610060899196,511.57149172760523]],"layer_type":"Point","data_type":"707_15","locs_utm":[[562439.265349012,4881731.589399391,511.57149172760523]],"mp_codes_0":"G3003","mp_codes_1":"K99","mp_codes_2":"+000"}
	
	disease_map.last_point = evProps;
	
	if(dataCode == 'pd'){
		evType = evProp.TYPE;
		subType = evProp.SUBTYPE;
	}else{
		if(sourceLayer == 'firstnode'){
			evType = modelMapRelation[feaType] ? modelMapRelation[feaType].TYPE : null;
		}else{
			evType = (sourceLayerMapRalation[sourceLayer] && sourceLayerMapRalation[sourceLayer][subType]) ? sourceLayerMapRalation[sourceLayer][subType].TYPE : null;
		}
	}
	
	
	// let data = cacheAssetDatas.find(d => (d.ID == evId)) || { "SUBTYPE": "13", "MP_CODE": "G3003|101|2", "UP_DOWN": "2", "ID": "2364582265951593522", "TYPE": "705", "UDATE": "1603780724000" };
	
	let type_list = Disease.TYPE_LIST,
		subTypeMap = type_list.LISTINFO.MAPPING,
		typeMap = type_list.TYPES.VALUES,
		dataTime = evProp.UDATE ? $.timeConvert(evProp.UDATE, 0) : '无',
		
		dataType = typeMap[evType] ? typeMap[evType].NAME : '',
		dataSubtype = subTypeMap[subType] || '',
		dataSubtypeClass = 'grade_' + subType,
		
		dataMapCode = evProp.MP_CODE ? evProp.MP_CODE.split('|') : [],
		dataMapRoad = dataMapCode[0] || '',
		dataMapK = dataMapCode[1] ? ('K' + dataMapCode[1]) : '',
		dataMapM = '',
		dataUpDown = type_list.UP_DOWM[evProp.UP_DOWN] || '',
		dataStr = '';
	if (evProp.MP_CODE) {
		dataMapM = dataMapRoad[2] ? ('+' + dataMapRoad[2] + '00') : '+000';
		dataStr = dataMapRoad + ' ' + dataMapK + dataMapM + ' ' + dataUpDown;
	}
	
	if(sourceLayer == 'road_adas'){
		dataType = '道路';
	}else if(sourceLayer == 'HD_POLYGON'){
		dataType = '地面标志';
	}
	
    var _cns = [
        { 'id': 'WIDTH', 'name': '路面宽度', 'unit': 'm' },
        { 'id': 'RADIUS', 'name': '转弯半径', 'unit': 'm' },
        { 'id': 'SLOPE', 'name': '坡度', 'unit': '' }
    ]
    // RADIUS: "Infinity"    转弯半径（m）
    // SLOPE: "-0.017119"		坡度
    // WITH: "3.75",            道路宽度（m）

    var text_type = 'type_block';
    var btn_type = 'type_none';
    var _text = '';

    if ( evProp.hasOwnProperty('WIDTH') || evProp.hasOwnProperty('SLOPE') ) {
		
		let width =  Number( evProp.WIDTH) || 0,
			widthCn = '路面宽度',
			widthVal =  Number( width.toFixed(2) ),
			radius = Number( evProp.RADIUS ) || 0,
			radiusCn = '转弯半径',
			radiusVal = Number( Math.abs( radius.toFixed(2) ) ),
			slope = Number( evProp.SLOPE ) || 0,
			slopeCn = '坡度',
			slopeVal = Number( slope.toFixed(2) );
		
		if( radius > 0 ){
			radiusCn = '转弯半径 左转';
		}else if( radius < 0 ){
			radiusCn = '转弯半径 右转';
		}else{
			radiusVal = ' - ';
		}
		
        _text = `
			<span>路面宽度 ${widthVal}m</span>
			<span>${radiusCn} ${radiusVal}m</span>
			<span>坡度 ${slopeVal}m</span>
		`;
        if (evProp.LINK_CODE && evProp.TRACK_ID) {
			text_type = 'type_none';
			btn_type = 'type_block';
        }
    } else {
        text_type = 'type_none';
        btn_type = 'type_block';
    }
	
	// if(data){
		// let subTypeMap = Disease.TYPE_LIST.LISTINFO.MAPPING,
		//     typeMap = Disease.TYPE_LIST.TYPES.VALUES,
		//     dataTime = data.UDATE ? $.timeConvert(data.UDATE, 0) : '无',
		//     dataType = typeMap[data.TYPE] ? typeMap[data.TYPE].NAME : '',
		//     dataSubtype = subTypeMap[data.SUBTYPE] || '',
		//     dataSubtypeClass = 'grade_' + data.SUBTYPE,
		//     dataMapCode = data.MP_CODE ? data.MP_CODE.split('|') : [],
		//     dataMapRoad = dataMapCode[0] || '',
		//     dataMapK = dataMapRoad[1] ? ('K' + dataMapRoad[1]) : '',
		//     dataMapM = '',
		//     dataUpDown = Disease.TYPE_LIST.UP_DOWM[data.UP_DOWN] || '',
		//     dataStr = '';
		// if (data.MP_CODE) {
		// 	dataMapM = dataMapRoad[2] ? ('+' + dataMapRoad[2] + '00') : '+000';
		// 	dataStr = dataMapRoad + ' ' + dataMapK + dataMapM + ' ' + dataUpDown;
		// }
	// }
	
    var _popup = `
		<div class="mapbox_popup">
			<div class="popup_content">
				<h4 class="popup_content_head">
					<b>${dataType}</b>
					<span class="child_body_grade_value ${dataSubtypeClass}">${dataSubtype}</span>
				</h4>
				<p class="child_body_place">
					<span class="icon_image icon_position"></span>
					<span class="child_body_place_type">${dataStr}</span>
				</p>
				<p class="child_body_grade">
					<span class="icon_image icon_time"></span>
					<span class="child_body_grade_time">${dataTime}</span>
				</p>
				<div class="image_buttons image_texts ${text_type}">
					${_text}
				</div>
				<div class="image_buttons ${btn_type}">
				
					${type_list.FUNBUTTON.map(f => `
						<button class="btn ${f.CLASS} ${f.CONTROL}" name="${f.ID}">${f.NAME}</button>
					`).join('')}
					
				</div>
			</div>
		</div>
	`;
	
	if(!popupMarker){
		
		popupMarker = new mapboxgl.Popup({
			closeButton: false,
			className: 'mapbox_popup_dom',
			// anchor: 'top',
			offset: popupOffsets
		}).setLngLat([ ev.lngLat.lng, ev.lngLat.lat ])
		  .setHTML(_popup)
		  .addTo(_map);
		
	}else{
		
		let isOpen = popupMarker.isOpen();
		!isOpen && popupMarker.addTo(_map);
		
		popupMarker.setLngLat([ ev.lngLat.lng, ev.lngLat.lat ]);
		popupMarker.setHTML(_popup);
		
	}
	
	if(ev.features){
		evBody = ev.features;
	}
	
	var popupEle = popupMarker.getElement();
	
	$(popupEle).unbind();
	
	popupEle && popupEle.addEventListener('mouseenter',function(){ popupMouseType = true; });
	popupEle && popupEle.addEventListener('mouseleave',function(){ popupMouseType = false; closePopup(10) });
	
	$(popupEle).click('BUTTON', function(e){
		
		if(evBody && e.target.name){
			
			popupMouseType = false;
			closePopup(10);
			
			let name = e.target.name;
			_disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].click_types = true;
			_disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(name);
			
			// disease_info.come_to_info(disease_map.last_point,true,true);
			
			getLayerInfo(evBody, name)
		}
	})
	
}

/* 关闭信息气泡窗口 */
var closePopupTimeOut = null;
function closePopup(time = 200){
	if(!popupMarker){
		return
	}
	closePopupTimeOut && clearTimeout(closePopupTimeOut);
	closePopupTimeOut = setTimeout(function(){
		!popupMouseType && popupMarker.remove();
	}, time)
	
}

/**
 * @description: 图层控件
 * @param {*} value
 * @return {*}
 */
function layerChange(value, show) {
    // ['img-w', 'cia-w']  //一组
    // ['vec-w', 'cva-w']  //一组
	
    let layer_opt = {
        '1': { 'img-w': false, 'cia-w': false, 'vec-w': true, 'cva-w': true },
        '2': { 'img-w': false, 'cia-w': false, 'vec-w': true, 'cva-w': true },
        '3': { 'img-w': true, 'cia-w': true, 'vec-w': false, 'cva-w': false },
        '4': null,
        '5': { 'img-w': false, 'cia-w': false, 'vec-w': false, 'cva-w': false },
        '6': null
    },
    layers = layer_opt[value] || {};
	
	if (value == '4') {
		let positionMarkLabels = $('.positionMarkLabel');
		let labelDisplay = show ? 'block' : 'none';
	    for (let i = 0; i < positionMarkLabels.length; i++) {
			positionMarkLabels[i].style.display = labelDisplay;
	    }
	}else if(value == '6' || value == '7'){
		let showZoom = show ? 10 : 18;
		handleRoadHide(showZoom);
		$('.lineLayer .radio_label').removeClass('active');
		if(show){
			$('.lineLayer .radio_label[name="7"]').addClass('active');
		}
	}else{
		if (show && value == '1') {
		    $('.dituLayer .radio_label').removeClass('active');
		    $('.dituLayer .radio_label[name="2"]').addClass('active');
		    $('.dituLayer .radio_label.active').attr('name');
		} else if (value == '1') {
		    $('.radio_label').removeClass('active');
		}
		
		for (var id in layers) {
			let visibility = layers[id] ? 'visible' : 'none';
			_map.setLayoutProperty(id, 'visibility', visibility);
		}
	}
	
	
}
function dataLayerChange(z){
	var dataCode = Disease.TYPE_LIST.DATACODE;
	var visibility = 'visible';
	var status = _map.getLayoutProperty('data-sets-2d', 'visibility');
    if ( z < 16 ) {
        visibility = 'none';
    }
	if( dataCode == 'road_asset' ){
		_map.setLayoutProperty('data-sets-2d', 'visibility', 'none');
	}else if( (dataCode == 'pd') && (visibility != status) ){
		_map.setLayoutProperty('data-sets-2d', 'visibility', visibility);
	}
}

function mapClick(e) {

    $('.cesium_popup_mark').hide();
    if (e && e.originalEvent && e.originalEvent.target && (e.originalEvent.target.className.indexOf('convergeGroup') > -1)) {
        console.log('你点击了聚类')
        disease_map.setZoom(18);
        disease_map.setCenter( [e.lngLat.lng, e.lngLat.lat] );
    }

    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    // var features = _map.queryRenderedFeatures(bbox, { layers: ['counties'] });
    // Run through the selected features and set a filter
    // to match features with unique FIPS codes to activate
    // the `counties-highlighted` layer.
    // var filter = features.reduce(function(memo, feature) {
    //     memo.push(feature.properties.FIPS);
    //     return memo;
    // }, ['in', 'FIPS']);

    // console.log('features:',features);
}

function mapEventInit(map) {
    map.on('click', mapClick);
    map.on('zoom', controlZoom);
    map.on('contextmenu', mapMenu);
}

/* 地图ZOOM等级缩放 */
function controlZoom() {
    var zoom = _map.getZoom(),
        roundZoom = Math.round(zoom);
    $('.cesium_control .zoom_level a').html(roundZoom);
	handleRoadHide(roundZoom);
    convergeGroupChange();
    dataLayerChange(roundZoom);
}

/* 地图右键菜单 */
function mapMenu(e) {
    $('.cesium_popup_mark').hide();
    let map_width = $('#cesium_map').width() || 0,
        map_height = $('#cesium_map').height() || 0,
        dom_width = $('#cesium_map_parent').width() || 0,
        dom_height = $('#cesium_map_parent').height() || 0,
        left_width = dom_width - map_width,
        top_height = dom_height - map_height,
        new_left = e.point.x + left_width + 1,
        new_top = e.point.y + top_height + 50;

    $('.cesium_popup_mark').css({
        'top': new_top,
        'left': new_left
    });

    let eDom = e.originalEvent.target,
        eClassName = eDom ? eDom.className : '';
    if (eClassName && eClassName.indexOf('positionMarkLabel') > -1) {
        $('.cesium_popup_mark.remove_mark').show();
        disease_map.right_point = eDom.getAttribute('dataId');
    } else {
        $('.cesium_popup_mark.add_mark').show();
        disease_map.right_point = [e.lngLat.lng, e.lngLat.lat, 0];
    }
}

function hoverLinkCodes(){
	
}


var disease_map = {};

disease_map.right_point = null;
disease_map.last_point = null;			//---高亮的点缓存
disease_map.last_info_point = null;		//---高亮的点缓存
disease_map.load_image = null;;;
disease_map.time_spac = 300;;
disease_map.minZoom = 9;
disease_map.maxZoom = 27;
disease_map.camera_zoom = null;
disease_map.layer_type = '2';

let userinfo = $.getLocalStorage('userInfo') || '{}';
let json_userinfo = JSON.parse(userinfo);
let userName = json_userinfo.userName;

// 线路显示
disease_map.handleRoadData = async function(){
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode || !_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion){
		$.errorView('获取行政区化失败');
		return;
	}
	handleRoadRemove();
	var dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.dataVersion;
    var _datas = await findLinks(dataVersion);
    var _colorSetDefault = {'1': 'rgb(52,176,0)','2': 'rgb(52,176,0)','3': 'rgb(255,142,16)','4': 'rgb(255,142,16)','5': 'rgb(233,3,0)'};
    // 分级：1、优，2、良，3、中，4、次，5、差
    // 配色：优&良 - 绿色 rgb [52 176 0] 中&次 - 橙色 rgb [255 142 16]  差 - 红色 rgb [233 3 0]

	// disease_road_link.line_group = null;

	var roadLinkDefault = {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				
			]
		}
	}
	var roadLinkDash = {
		'type': 'geojson',
		'data': {
			'type': 'FeatureCollection',
			'features': [
				
			]
		}
	}
	var features = _datas.features || [];
	for(var i=0; i<features.length; i++){
		var geom = features[i].properties.GEOM;
		// var rType = features[i].properties.RTYPE || '1';	//作废 桥隧与普通道路处理方式相同
		var RATING = _colorSetDefault[features[i].properties.RATING] || 'rgb(180,180,180)';	
            var geoJson = $.geoJsonParam({
                'range': geom,
                'type': 'Polyline',
                'weight': 2,
				'datas': features[i].properties,
                'color': RATING
            });
            roadLinkDefault.data.features.push(geoJson);
	}
		
	_map.addSource('roadLinkDash', roadLinkDash);
	_map.addSource('roadLinkDefault', roadLinkDefault);
	_map.addLayer({
		'id': 'dash-lines',
		'type': 'line',
		'source': 'roadLinkDash',
		'paint': {
			'line-width': 6,
			"line-color":   ['get', 'color'],//"#47F9FF",
			"line-dasharray": [2, 2]
		}
	});
	_map.addLayer({
		'id': 'default-lines',
		'type': 'line',
		'source': 'roadLinkDefault',
		'paint': {
			'line-width': 6,
            'line-color': ['get', 'color']//'#FF4057'
        }
	})
}

/* 格式化数据 */
disease_map.formatProperties = function (prop) {
	return formatProperties(prop);
}
/**
 * @description: 加载当前城市全量数据
 */
disease_map.loadAssetDatas = function () {
    // (Disease.TYPE_LIST.DATACODE == 'road_asset') && loadAssetDataPromise().then((_t) => {
    //     _t && console.log('当前城市全量数据已缓存');
    // })
	if( _map && _map.getLayer('data-sets-2d') ){
		if( Disease.TYPE_LIST.DATACODE == 'road_asset' ){
			_map.setLayoutProperty('data-sets-2d', 'visibility', 'none');
		}else{
			_map.setLayoutProperty('data-sets-2d', 'visibility', 'visible');
		}
	}
}
/**
 * @description: 刷新配置数据源
 * @param {*} sources
 * @return {*}
 */
disease_map.updateSources = function (type) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    clearConvergeGroup();
    loadConvergeData(type);
	
	let lastConfig = Disease.vector_tile_config[lastId];
	let lastSources = lastConfig.source;
	let lastLayers = lastConfig.layer;
	
	let id = Disease.TYPE_LIST.ID;
	let newConfig = Disease.vector_tile_config[id];
	let newSources = newConfig.source;
	let newLayers = newConfig.layer;
	
	
	removeLayers(lastLayers);
	removeSources(lastSources);
	
	addSources(newSources);
	addLayers(newLayers);
	
	initCustomEvent(newConfig);
	
    lastId = Disease.TYPE_LIST.ID;

}

/**
 * @description: 刷新聚类--数据查询时
 * @param {*} sources
 * @return {*}
 */
disease_map.updateConverges = function (type) {
    // TODO 配置应该自由配置，类型也由配置传入，暂时先写死
    clearConvergeGroup();
    loadConvergeData(type);
}

disease_map.point_to_info = function (type) {
    if (!this.last_point) {
        $.errorView('获取病害信息失败');
        return;
    }
    _disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].click_types = true;
    $(".cesium_popup").hide();
    _disease_init_js__WEBPACK_IMPORTED_MODULE_0__["disease_init"].player_mode_init(type);
    _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(this.last_point.datas.index, true, true);
};

disease_map.setCenter = function (xy) {
    _map.setCenter(xy);
}

disease_map.setResize = function () {
    _map && _map.resize();
}

disease_map.setZoom = function (z) {
    _map.setZoom(z);
}

disease_map.addPlayerPoint = function (data) {
    addPlayerPoint(data);
}

disease_map.removePlayerPoint = function () {
    removePlayerPoint();
}



/* 地图控件事件初始化 */
disease_map.control_init = function () {

    /*地图-浮窗-点击打开正射图、采集图、点云图*/
    $('.cesium_popup .popup_content .image_buttons').on('click', 'button', function () {
        let name = this.name;
        _this.point_to_info(name);
    })
    /*地图的缩放按钮*/
    $('.cesium_control .zoom_in a').click(function () {
        var level = $('.cesium_control .zoom_level a').html(),
            new_level = Number(level) + 1;
        if (new_level > disease_map.maxZoom) {
            return;
        }
        disease_map.setZoom(new_level);
    })
    $('.cesium_control .zoom_out a').click(function () {
        var level = $('.cesium_control .zoom_level a').html() - 1;
        if (level < disease_map.minZoom) {
            return;
        }
        disease_map.setZoom(level);
    })
    /*地图的图层按钮*/
    $('.cesium_control .layer_list').mouseleave(function () {
        $('.cesium_control .cesium_layers').removeClass('active');
        $('.cesium_control .layer_list').hide();
    })
    $('.cesium_control .cesium_layers a').click(function () {
        $('.cesium_control .cesium_layers').toggleClass('active');
        $('.cesium_control .layer_list').toggle();
    })
    $('.layer_list li label input').click(function (e) {
        let value = e.target.value,
            checked = e.target.checked,
			new_v = value;
		
		if(value == '1'){
			new_v = checked ? '1' : '5';
		}
        layerChange(new_v, checked);
    })
    $('.layer_list li span.radio_label').click(function (e) {
        let _type = $('.layer_list .checkbox_label input[value="1"]')[0].checked,
			dom = (e.target.localName == 'b') ? e.target.parentNode : e.target,
			value = dom.getAttribute('name'),
		    checked = true,
			view = (value == '7') ? '请先选中检测结果！' : '请先选中底图！';
		
		if(value == '7'){
			_type = $('.layer_list .checkbox_label input[value="6"]')[0].checked;
		}
		
        if (!_type) {
            $.errorView(view);
            return;
        }
		
		if(value != '7'){
			$('.layer_list li.dituLayer span.radio_label').removeClass('active');
			$(dom).addClass('active');
			disease_map.layer_type = value;
		}
		
        layerChange(value, checked);
    })
    /*cesium地图的返回初始按钮*/
    $('.cesium_control .full_screen a').click(function () {
        var _center = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.center,
            new_center = _center ? _center.split(',') : null;
        if (!new_center) {
            $.errorView('当前城市中心点获取失败！');
            return;
        }
        disease_map.setCenter(new_center);
        disease_map.setZoom(9);
    })

}


/**
 * @description:  地图初始化
 * @param {*}
 * @return {*}
 */
var lastId = null;
disease_map.maps_init = function (containerID) {

    let  this_center = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode.center.split(',');
    let _center = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].urlCenter?_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].urlCenter:this_center;
    lastId = Disease.TYPE_LIST.ID;
    let _config = Disease.vector_tile_config[lastId];
    let topLayer = _config.topLayer;
    let images = _config.images || [];
    let sources = _config.source;
    let layers = _config.layer;
    if (_map == null) {
        let mapStyle = initBackgroundStyle();
        let opt = {
            style: mapStyle,
            center:_center,
        };
        // opt = {}
        _map = Object(_map_init__WEBPACK_IMPORTED_MODULE_5__["mapInit"])(containerID, opt, images);
        mapEventInit(_map);
        window._main_map = _map;
        console.log(_map.loaded());
		if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].current_adcode){
			return
		}
        _map.on('load', function () {
            addSources(sources);
            addLayers(layers, topLayer);
            initCustomEvent(_config);
                if(_disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].urlCenter){
                    window._main_map.setZoom(17);
                }
        });
    }
};


/*自定义标记位置的列表*/
disease_map.loadMarkLabels = function () {
    let _this = this,
        _url = config_url.pdds + Disease.TYPE_LIST.URLS.MAP_MARK,
        _json = { 'ops': [{ 'k': 'USER', 'type': 'string', 'v': userName, 'op': 'eq' }] };

    $.postAjax({
        url: _url,
        data: _json,
        callback: function (data) {
            let features = (data.result && data.result.data) ? data.result.data.features : [];
            _this.mark_points = features;
            for (let i = 0; i < features.length; i++) {
                let id = features[i].properties.ID,
                    classId = 'markLabel_' + id,
                    has_id = $('.' + classId).length,
                    coordinates = features[i].geometry.coordinates;

                if (!has_id) {

                    var markDiv = document.createElement("div");
                    markDiv.className = 'positionMarkLabel ' + classId;
                    markDiv.setAttribute('dataId', id);

                    var _m = new mapboxgl.Marker({
                        anchor: 'bottom',
                        element: markDiv
                    })
                        .setLngLat([coordinates[0], coordinates[1]])
                        .addTo(_map);

                }
            }
            _disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].mark_type_init();
        }
    })
};

var markBodys = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "USER": null
            },
            "geometry": {
                "coordinates": null,
                "type": "Point"
            }
        }
    ]
};
/*添加标记-取消标记事件*/
disease_map.menuMarks = function (id = false, callback = false) {
    let _url = config_url.pdds + 'data/position_label/create';
    if (id) {
        _url = config_url.pdds + 'data/position_label/deleteById?id=' + disease_map.right_point;
        $.getAjax({
            'url': _url,
            'token': true,
            'callback': function (data) {
                let _type = true;
                if (data.code != '0') {
                    _type = false;
                } else {

                    $('.markLabel_' + disease_map.right_point).remove();
                }
                $.errorView('取消标记' + data.message, _type);
                callback && callback();
            }
        })
    } else {
        markBodys.features[0].properties.USER = userName;
        markBodys.features[0].geometry.coordinates = [
			disease_map.right_point[0],
			disease_map.right_point[1],
			0
		];

        $.postAjax({
            url: _url,
            data: markBodys,
            callback: function (data) {
                let _type = true;
                if (data.code != '0') {
                    _type = false;
                }
                $.errorView('标记' + data.message, _type);
                disease_map.loadMarkLabels();
            }
        })
    }
    $('#cesium_map_parent .cesium_popup_mark').hide();
};

/*鼠标在地图上的右键执行事件*/
disease_map.cesium_popup_mark = function (event) {

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

    if (picked && picked.id && picked.id.mark_type == 'position_label') {
        $('.cesium_popup_mark.remove_mark').show();
        this.right_point = picked.id.id;
    } else {
        $('.cesium_popup_mark.add_mark').show();
        this.right_point = $.get_cesium_xy(event);
    }
};

/*图层列表发生改变时*/
disease_map.layers_changed = function (param) {
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

    if (show && param.value == '1') {
        $('.radio_label').removeClass('active');
        $('.radio_label[name="2"]').addClass('active');
        param_val = $('.radio_label.active').attr('name');
    } else if (param.value == '1') {
        $('.radio_label').removeClass('active');
    }

    if (param.value == '4') {
        for (let i = 0; i < values.length; i++) {
            if (values[i].mark_type == 'position_label') {
                values[i].show = show;
            }
        }
    } else {
        for (let i = 0; i < layers.length; i++) {
            let layer_name = layers[i].imageryProvider._layer,
                createid = layers[i].imageryProvider._credit;
            if (createid && createid._html == 'tile2d') {
                continue;
            }
            if (param.value == '5') {
                layers[i].show = show;
            } else if (param_l[param_val][layer_name]) {
                layers[i].show = show;
            } else {
                layers[i].show = !show;
            }
        }
    }
    $.cesium_refresh();
};

//更改最后一个点的值
disease_map.change_last_point = function (layer) {
    if (this.last_info_point) {

        this.last_info_point._billboard._image._value = this.last_info_point._default_url;
        this.last_info_point._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
        this.last_info_point = null;
    }
    if (layer && layer._billboard) {

        layer._billboard._image._valu = layer._active_url;
        layer._billboard.disableDepthTestDistance._value = Number.POSITIVE_INFINITY;
        this.last_info_point = layer;
    }
    $.cesium_refresh();
};

/*地图缩放--放大-缩放*/
disease_map.zoomInOut = function (zoom) {
    var height = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].zoomToAltitude(zoom);
    if (height) {
        var center = $.getCenterPoint();
        _viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(center[0], center[1], height)
        })
    }
};

/*地图等级*/
disease_map.zoom_level = function () {
    var height = _viewer.camera.positionCartographic.height,
        zoom = _disease_user_js__WEBPACK_IMPORTED_MODULE_3__["disease_user"].altitudeToZoom(height),
        math_zoom = Math.round(zoom);
    _viewer.camera.mathZoom = math_zoom;
    $('.cesium_control .zoom_level a').html(math_zoom);

    if ((math_zoom > 15) && !window.tile2d.show) {
        window.tile2d.show = true;
    } else if ((math_zoom < 16) && window.tile2d.show) {
        window.tile2d.show = false;
    }

    if (math_zoom > 19) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = false;
        $('.layer_list li span.radio_label').removeClass('active');
        disease_map.layers_changed({
            'value': 5,
            'checked': false
        });
    } else if (math_zoom < 20) {
        $('.layer_list .checkbox_label input[value="1"]')[0].checked = true;
        var _active = $('.layer_list li span.radio_label.active');
        if (!_active.length) {
            $('.layer_list li span.radio_label[name="' + disease_map.layer_type + '"]').addClass('active');
            disease_map.layers_changed({
                'value': disease_map.layer_type,
                'checked': true
            });
        }
    }

    _disease_group_js__WEBPACK_IMPORTED_MODULE_2__["disease_group"].point_group();
};

/*地图气泡方法样式*/
disease_map.cesium_popup = function (param = null) {
    if (param && Cesium.defined(param.picked)) {
        var center = param.picked.id ? param.picked.id._datas.center_xy : param.picked.primitive.datas.center_xy,
            _id = param.picked.id ? param.picked.id._id : param.picked.primitive.datas.ID,
            id = Cesium.defaultValue(param.picked.id, param.picked.primitive.id),
            properties = param.picked.id ? param.picked.id._datas : param.picked.primitive.datas,
            positions = Cesium.Cartesian3.fromDegrees(center[0], center[1], center[2]),
            position_popup = Cesium.SceneTransforms.wgs84ToWindowCoordinates(param.scene, positions);

        var _this = disease_map;
        var _cns = [
            { 'id': 'WIDTH', 'name': 'WIDTH_CN', 'unit': 'm' },
            { 'id': 'RADIUS', 'name': 'RADIUS_CN', 'unit': 'm' },
            { 'id': 'SLOPE', 'name': 'SLOPE_CN', 'unit': '' }
        ]
        // RADIUS: "Infinity"    转弯半径（m）
        // SLOPE: "-0.017119"		坡度
        // WITH: "3.75",            道路宽度（m）

        if (properties.WIDTH_CN || properties.SLOPE_CN) {

            $('.cesium_popup .popup_content .image_buttons').css('display', 'none');
            $('.cesium_popup .popup_content .image_texts').css('display', 'block');

            let _html = `
				${_cns.map(c => `
					<span>${properties[c.name]} ${properties[c.id]}${c.unit}</span>
				`).join('')}
			`;
            $('.cesium_popup .popup_content .image_texts').html(_html);
            if (properties.LINK_CODE) {
                $('.cesium_popup .popup_content .image_buttons').css('display', 'block');
            }
        } else {
            $('.cesium_popup .popup_content .image_buttons').css('display', 'block');
            $('.cesium_popup .popup_content .image_texts').css('display', 'none');
        }

        if ((id instanceof Cesium.Entity) || (param.picked.primitive && param.picked.primitive.datas)) {
            function positionPopUp(c) {
                var _x = 0,
                    _y = -123,
                    map_width = $('#cesium_map').width(),
                    left_width = $('.cesium_map_left').width(),
                    map_height = $('#cesium_map').height(),
                    type_width = map_width - position_popup.x,
                    type_height = map_height - position_popup.y;
                if (type_width < 289) {
                    _x = -289;
                }
                if (position_popup.y < 115) {
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
disease_map.cesium_popup_html = function (param) {
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

    if (param._id != param_id || datas.TYPE == '703') {
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


/*监听地图变化事件*/
disease_map.listen_cesium_body = function (dom, type) {
    var class_obj = {
        'disease_list': true,
        'disease_info': true,
        //			'disease_player': false
    };
    var width_arr = [],
        dom_width = 0;
    for (var class_name in class_obj) {
        var bound_rect = $('#highway_disease .' + class_name)[0].getBoundingClientRect(),
            display_type = $('#highway_disease .' + class_name).css('display'),
            bound_rect_type = (bound_rect && bound_rect.left < -1) ? false : true,
            width = $('#highway_disease .' + class_name)[0].offsetWidth - 10;

        if (class_name != dom && display_type == 'block' && bound_rect_type) {
            if (class_name == 'screen_model') {
                width += 344;
            }
            width_arr.push(width);
        }
    }
    if (type && class_obj[dom]) {
        dom_width = $('#highway_disease .' + dom)[0].offsetWidth - 10;
    }

    width_arr.push(dom_width);
    width_arr.sort(function (a, b) {
        return b - a;
    });

    var max_width = width_arr[0],
        map_width = 'calc(100% - ' + max_width + 'px)';

    $('#cesium_map_parent .cesium_map_left').width(max_width);
    $('#cesium_map_parent #cesium_map').width(map_width);

	disease_map.setResize();
};


/*执行postrender事件,修改点坐标*/
disease_map.postRender = function () {
    _viewer.scene.postRender.addEventListener(function () {
        if (disease_map.camera_zoom > 17) {
            var entitys = _disease_player_js__WEBPACK_IMPORTED_MODULE_4__["disease_player"].current_disease || {};
            for (var id in entitys) {
                var _entity = entitys[id],
                    _show = _entity.show,
                    nodes = _entity._nodes,
                    new_nodes = [],
                    points_center = $.getPointsCenter(nodes, true);

                for (var i = 0; i < nodes.length; i++) {
                    var positions = Cesium.Cartesian3.fromDegrees(nodes[i][0], nodes[i][1], nodes[i][2]);
                    //		    				new_positions = _viewer.scene.clampToHeight(positions, [_entity]);
                    console.log(positions)
                }

            }
        }
    });
};



// module.exports = disease_map;








/***/ }),

/***/ "./Apps/Dist/Js/disease_player.js":
/*!****************************************!*\
  !*** ./Apps/Dist/Js/disease_player.js ***!
  \****************************************/
/*! exports provided: disease_player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_player", function() { return disease_player; });
/* harmony import */ var _disease_slide_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_slide.js */ "./Apps/Dist/Js/disease_slide.js");
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_init_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_init.js */ "./Apps/Dist/Js/disease_init.js");
/* harmony import */ var _disease_leaflet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./disease_leaflet.js */ "./Apps/Dist/Js/disease_leaflet.js");
/* harmony import */ var _disease_group_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./disease_group.js */ "./Apps/Dist/Js/disease_group.js");
/* harmony import */ var _get_show_polygon_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./get_show_polygon.js */ "./Apps/Dist/Js/get_show_polygon.js");
/* harmony import */ var _play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./play_window/cesium_player.js */ "./Apps/Dist/Js/play_window/cesium_player.js");

/**
 * 病害巡查影像界面
 */












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
			_disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].come_to_info(info,true,true);
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
		_disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].menu_feedbacks(true);
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
		_disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].menu_collects(type);
	})
	/*用户标记操作*/
	$('.disease_info .info_header .menu_mark').click(function(e){
		if(!disease_player.track_list.length){
			$.errorView('轨迹正在加载中...');
			return;
		}
		let _name = $('.disease_info .info_header .menu_mark').attr('name');
		if(_name){
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].right_point = _name;
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].menuMarks(true, function(){
				_this.mark_type_init();
			});
		}else{
			let _track = _this.track_list[_this.current_num - 1];
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].right_point = _track.map_center;
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].menuMarks();
		}
	})
	/*用户标记操作*/
	$('.cesium_popup_mark a.mark_point').click(function(){
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].menuMarks();
	})
	/*用户删除标记操作*/
	$('.cesium_popup_mark a.remove_point').click(function(){
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].menuMarks(true, function(){
			_this.mark_type_init();
		});
	})
	/*返回首页：操作按钮,视频界面*/
	$('.disease_info').on('click', '.info_image a.full_back_index', function () {
		_disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].full_screen(true);
		
		_this.view_info_types();
		_this.timing && clearInterval(_this.timing);
		_this.player_closer();
		
		$('.disease_info').fadeOut(100);
		_disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].position_group_change();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].change_last_point();
		_disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].polygon_info(true);
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].listen_cesium_body('disease_info', false);
		
		var active_dom = Disease.TYPE_LIST.FUNBUTTON.find(function(data){
		    return data.ACTIVE == 'active';
		})
		_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].player_mode_init(active_dom.ID);
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
		_disease_leaflet_js__WEBPACK_IMPORTED_MODULE_6__["disease_leaflet"].disease_region();
		_this.disease_region();
	})
	/*复原初始帧：操作*/
	$('.disease_player').on('click', '.player_restore', function () {
		_this.current_num = _this.default_num;
		_this.update_image();
	})
	/*全屏视频界面：操作*/
	$('.info_image').on('click', '.full_screen_control', function () {
		_disease_slide_js__WEBPACK_IMPORTED_MODULE_0__["SlideList"].full_screen(true);
		
		var _type = $('.image_opacity .checkbox_label input')[0].checked;
		if(!_type){
			_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__["cesium_player"].update();
		}
		_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__["cesium_player"].change_toggle(_type);
		
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
	_disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].position_group_change();
	// disease_map.change_last_point();
	// disease_info.polygon_info(true);
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].listen_cesium_body('disease_info', false);
	
	var active_dom = Disease.TYPE_LIST.FUNBUTTON.find(function(data){
		return data.ACTIVE == 'active';
	})
	_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].player_mode_init(active_dom.ID);
	
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
	
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].removePlayerPoint();
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
	var det_time = _disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].current_info.det_time || '';
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
				
                <input class="image_opacity_change" style="width: 60px;" type="range" min="0" max="100" value="${_play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__["cesium_player"]._alpha}" />
            </div>
	`;
	$('.player_control .player_button').html(_control);
	
	var level = $('.cesium_control .zoom_level a').html(),
		new_level = Number(level);
	if(new_level < 20){
		var height = _disease_user_js__WEBPACK_IMPORTED_MODULE_2__["disease_user"].zoomToAltitude(20);
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
	
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].removePlayerPoint();
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].setZoom(18);
	
	trackBufferResults = {
		'type': 'FeatureCollection',
		'features': []
	};
	playerInterfaceStatus = true;
	
	var _this = this;
	// disease_group.entity_hide();
	
	var trackId = _disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].current_info.properties.TRACK_ID,
		trackPointId = _disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].current_info.properties.T_POINT_ID;
	
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
		let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_2__["disease_user"].current_adcode.dataVersion;
		let dataCode = Disease.TYPE_LIST.DATACODE;
		
		let newDataCode = (dataCode == 'pd') ? 'pd_show' : dataCode;
		
		let url = config_url.pdds + 'data/' + newDataCode + '/query';
		let currentInfo = _disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].current_info.properties;
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
				var new_data = _disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].dataInfoFormat(d);
				trackBufferResults.features.push( new_data );
			} )
			
			// playerCounterThrow();
			_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].image_type_go();
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
	
	_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].image_type_go();
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
	if(_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].play_image_type == 'visua_up_map'){
		_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].image_type_go(type);
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
	for(let i=0; i<_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].mark_points.length; i++){
		let coordinate = _disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].mark_points[i].geometry.coordinates,
			this_id = _disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].mark_points[i].properties.ID,
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
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].addPlayerPoint({
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
	
	for(var i=0; i<_disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].catchList.length; i++){
		var _locs = _disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].catchList[i].locs;
		var properties = _disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].catchList[i].properties;
		
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
				_disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].catchListUTM[i]
			)
		// }
	}
	this.entitys = catch_distance;
	this.entitys_utm = catch_distance_utm;
	// this.get_projection(trackpoint);
	
	_disease_init_js__WEBPACK_IMPORTED_MODULE_5__["disease_init"].image_type_go();
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
    _play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__["cesium_player"].playerInit();
    _play_window_cesium_player_js__WEBPACK_IMPORTED_MODULE_9__["cesium_player"]._alpha = 100;
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
	let infos = _disease_list_js__WEBPACK_IMPORTED_MODULE_3__["disease_list"].catchList || [],
		this_info = infos.filter(function(data){
		   return (data.properties.ID == id)
		});
	if(!this_info.length){
		$.errorView('获取信息失败');
		return;
	}
	let _index = this_info[0].index;
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].removePlayerPoint();
	_disease_info_js__WEBPACK_IMPORTED_MODULE_4__["disease_info"].come_to_info(_index, true, true);
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
	
	var K = _get_show_polygon_js__WEBPACK_IMPORTED_MODULE_8__["projection"].cameraParams();
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




/***/ }),

/***/ "./Apps/Dist/Js/disease_road_analyse.js":
/*!**********************************************!*\
  !*** ./Apps/Dist/Js/disease_road_analyse.js ***!
  \**********************************************/
/*! exports provided: disease_road_analyse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_road_analyse", function() { return disease_road_analyse; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/**
 * 路段分析
 */




var disease_road_analyse = {};

disease_road_analyse.findDatas = function(){
	disease_road_analyse.centre_list()
}

disease_road_analyse.centre_list = function(page=false){
	let road = $(".select_road_analyse span.select_value")[0].name;
	let unit = $(".select_statistical_unit span.select_value")[0].name || '1';
	var _table = `
		<table id="road_analyse_table"></table>
	`;
	$('#data_center .road_analyse_body').html(_table);
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode){
		return;
	}
	var dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion;
	var _url = config_url.pdds + Disease.TYPE_LIST.URLS.ROAD,
	// var _url = config_url.pdds + 'data/road_maintenance/queryPage',
		_h = $('.road_analyse').height() - 192 - 56,
		_current = page || 1,
		_this = _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"];
	var myTable = $('#road_analyse_table').bootstrapTable({
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
		queryParams : function (params) {
			var _page = (params.offset / params.limit) + 1;
			var temp = {
				// "sort": [
				// 	{
				// 	  "k": "properties.TASK_ID",
				// 	  "order": "desc"
				// 	}
				// ],
				"ops": [],
				"page": {
					"totalPages": 0,
					"count": 10000000,
					"pageNo": _page,
					"pageSize": 12
				}
			};
			if(road){
				temp.ops.push({
					"k": "LINK_CODE",
					"type": "string",
					"v": road,
					"op": "eq"
				})
			}
			if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
				temp.ops.push({
					"k": "RM_TYPE",
					"type": "string",
					"v": unit,
					"op": "eq"
				})
				temp.ops.push({
					"k": "DATA_VERSION",
					"type": "string",
					"v": dataVersion,
					"op": "eq"
				})
			}
			
			return JSON.stringify(temp);
		},
		
		columns: _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__["disease_centre"].table_columns("road_analyse"),
		/* columns: [
			{
				field: 'properties.LINK_CODE',
				title: '路线',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.LINK_CODE || '-';
					return new_value;
				}
			},{
				field: 'properties.MAINTENANCE_COMPANY',
				title: '管养单位',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.MAINTENANCE_COMPANY || '-',
						new_html = '<span title="' + new_value + '">' + new_value + '</span>';
					return new_html;
				}
			},{
				field: 'properties.ROAD_TYPE_NAME',
				title: '车道类型',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.ROAD_TYPE_NAME || '-',
						new_html = '<span title="' + new_value + '">' + new_value + '</span>';
					return new_html;
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
				field: 'properties.START_MP',
				title: '起点桩号',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.START_MP || '-';
					return new_value;
				}
			},{
				field: 'properties.END_MP',
				title: '终点桩号',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.END_MP || '-';
					return new_value;
				}
			},{
				field: 'properties.EVALUATE_LENG',
				title: '评定长度（m）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.EVALUATE_LENG || '-';
					return new_value;
				}
			},{
				field: 'properties.PQI',
				title: '路面评定结果（PQI）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.PQI || '-';
					return new_value;
				}
			},{
				field: 'properties.PCI',
				title: '路面状况（PCI）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.PCI || '-';
					return new_value;
				}
			},{
				field: 'properties.RQI',
				title: '行驶质量（RQI）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.RQI || '-';
					return new_value;
				}
			},{
				field: 'properties.RDI',
				title: '路面车辙（RDI）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.RDI || '-';
					return new_value;
				}
			},{
				field: 'properties.SRI',
				title: '路面抗滑（SRI）',
				align: 'center',
				valign: 'middle',
				formatter: function (value, row, index) {
					let new_value = row.properties.SRI || '-';
					return new_value;
				}
			}
		], */
		responseHandler: function (data) {
			if(data.code != '0'){
				$.errorView('数据加载失败');
				return "数据加载失败！";
			}
			
			var _data = data.result.data.features || data.result.data || [],
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
					'id': 'road_analyse_table',
					'type': false,
					'class': 'road_analyse_body',
					'value': 2
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
	
};





/***/ }),

/***/ "./Apps/Dist/Js/disease_road_link.js":
/*!*******************************************!*\
  !*** ./Apps/Dist/Js/disease_road_link.js ***!
  \*******************************************/
/*! exports provided: disease_road_link */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_road_link", function() { return disease_road_link; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");


/*地图上显示线路----16级可显示*/



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
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode || !_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion){
		$.errorView('获取行政区化失败');
		return;
	}
	
	if(_adcode && _adcode == _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion){
		// return;
	}
	
	handle_road_remove();
	
	_adcode = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion;
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










/***/ }),

/***/ "./Apps/Dist/Js/disease_screen.js":
/*!****************************************!*\
  !*** ./Apps/Dist/Js/disease_screen.js ***!
  \****************************************/
/*! exports provided: disease_screen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_screen", function() { return disease_screen; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/**
 * 病害筛选界面
 */





var disease_screen = {};

disease_screen.catchParam = null;
disease_screen.screen_search_param = {};
disease_screen.screen_list = [];

disease_screen.link_code_query = function(){
	let dataVersion = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode.dataVersion,
		_url = config_url.pdds + 'data/road/query',
		map_code_param = { 'ops': [{'k': 'DATA_VERSION','v': dataVersion,'op': 'eq','type': 'string'}] };
	
	_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_list = [];
	return new Promise((resolve, reject) => {
		$.postAjax({
			'url': _url,
			'data': map_code_param,
			'callback': function(data){
				let type_arr = (data.result && data.result.data) ? data.result.data.features : [];
				for(let i=0; i<type_arr.length; i++){
					_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_list.push({
						// 'name': type_arr[i].properties.NAME || type_arr[i].properties.LINK_NAME,
						'name': type_arr[i].properties.LINK_CODE,
						'id': type_arr[i].properties.LINK_CODE
					})
				}
				resolve(type_arr);
			}
		})
	})
}

/*筛选界面初始化*/
disease_screen.screen_init = function() {
	
	var _this = this,
		new_link_list = _disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_list || [],
		link_list = [],
		type_list = Disease.TYPE_LIST.TYPES,
		new_list = [];
	
	new_link_list.forEach( d=>{
		link_list.push({
			'name': d.id,
			'id': d.id
		})
	} )
	
	_this.screen_list = [];
	
	var _html = '';
	
	// 病害类型的样式需要特殊处理
	if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
		
		new_list = [
			{
				'name': '沥青路面病害',
				'id': 'TYPE',
				'type': '1',
				'value': []
			},
			{
				'name': '水泥路面病害',
				'id': 'TYPE',
				'type': '2',
				'value': []
			}
		]
		
		for(let item in type_list.VALUES){
			let materialIndex = (type_list.VALUES[item].MATERIAL == '1') ? 0 : 1;
			new_list[materialIndex].value.push({
				'name': type_list.VALUES[item].NAME,
				'id': item
			})
		}
		
		_this.screen_list = [
			{
				'label': '区域范围',
				'id': 'LINK_CODE',
				'list': link_list
			},
			{
				'label': type_list.NAME,
				'id': type_list.KEY,
				'list': []
			}
		];
		
		var _html = `
			<div class="screen_model_param">
				${disease_screen.screen_list.map(f => `
					<div class="${f.id}">
						<label>${f.label}</label>
						<ul>
							${f.list.map(g => `
								<li class="${f.id}_${g.id}">
									<label class="checkbox_label">
										<input type="checkbox" name="${f.id}" value="${g.id}">
										<b class="checkbox_b"></b>
										<span title="${g.name}">${g.name}</span>
									</label>
								</li>
							`).join('')}
						</ul>
					</div>
				`).join('')}
				${new_list.map(f => `
					<div class="${f.id}" name="${f.type}" style="display:block;">
						<label>${f.name}</label>
						<ul>
							${f.value.map(g => `
								<li class="${f.id}_${g.id}">
									<label class="checkbox_label">
										<input type="checkbox" name="${f.id}" value="${g.id}">
										<b class="checkbox_b"></b>
										<span title="${g.name}">${g.name}</span>
									</label>
								</li>
							`).join('')}
							<li class="allCheck">
								<label class="checkbox_label">
									<input type="checkbox" name="all" data-name="${f.type}" value="">
									<b class="checkbox_b"></b>
									<span>全选</span>
								</label>
							</li>
						</ul>
					</div>
				`).join('')}
				<div class="SUBTYPE" style="display:block;">
					<label style="float: left;width: 50%;">损坏程度</label>
					<ul>
						<li style="width: 100%;">
							<label class="checkbox_label">
								<input type="checkbox" name="" value="">
								<b class="checkbox_b"></b>
								<span>隐藏轻度</span>
							</label>
						</li>
					</ul>
				</div>
			</div>
			<div class="screen_submit">
				<label><a href="#" title="清除筛选">清除筛选</a></label>
				<button class="btn btn-primary btn_screen_submit" title="应用">应用</button>
			</div>
		`;
		
	}else{
		for(let item in type_list.VALUES){
			new_list.push({
				'name': type_list.VALUES[item].NAME,
				'id': item
			})
		}
		_this.screen_list = [
			{
				'label': '区域范围',
				'id': 'LINK_CODE',
				'list': link_list
			},
			{
				'label': type_list.NAME,
				'id': type_list.KEY,
				'list': new_list
			},
			{
				'label': '损坏程度',
				'id': 'SUBTYPE',
				'list': [
					{
						'name': '无分级',
						'id': '9'
					},
					{
						'name': '重度',
						'id': '3'
					},
					{
						'name': '中度 (仅龟裂)',
						'id': '2'
					},
					{
						'name': '轻度',
						'id': '1'
					}
				]
			}
		];
		var _html = `
			<div class="screen_model_param">
				${disease_screen.screen_list.map(f => `
					<div class="${f.id}">
						<label>${f.label}</label>
						<ul>
							${f.list.map(g => `
								<li class="${f.id}_${g.id}">
									<label class="checkbox_label">
										<input type="checkbox" name="${f.id}" value="${g.id}">
										<b class="checkbox_b"></b>
										<span title="${g.name}">${g.name}</span>
									</label>
									<!--<span class="regional_label_num">356例</span>-->
								</li>
							`).join('')}
						</ul>
					</div>
				`).join('')}
			</div>
			<div class="screen_submit">
				<label><a href="#" title="清除筛选">清除筛选</a></label>
				<button class="btn btn-primary btn_screen_submit" title="应用">应用</button>
			</div>
		`;
	}
	
	
	$('.screen_model').html(_html);
	var _top = $('.screen_model_param').height() + 58;
//		$('.screen_submit').css('top', _top)
};

/*损坏程度根据病害类型的选择变化*/
disease_screen.subtype_change = function(){
	return;
	var key = Disease.TYPE_LIST.TYPES.KEY,
		input_check = $('.screen_model_param .' + key +  ' input'),
		subtype_2 = 'none',
		subtype = 'none';
	for(var i=0; i<input_check.length; i++){
		var type = input_check[i].name,
			value = input_check[i].value,
			subtype_none = Disease.TYPE_LIST.TYPES.VALUES[value].SUBTYPE_NONE,
			checked = input_check[i].checked;
		if(checked && subtype_none){
			subtype_2 = 'block';
			subtype = 'block';
		}else if(checked){
			subtype = 'block';
		}
	}
	
	$('.screen_model_param .SUBTYPE').css('display', subtype);
	$('.screen_model_param .SUBTYPE li.SUBTYPE_2').css('display', subtype_2);
	$('.screen_model_param .SUBTYPE li.SUBTYPE_2 input')[0].checked = false;
};

/*筛选按钮icon图标--变化*/
disease_screen.screen_icon = function(type){
	$('.screen_model_param input[type="checkbox"]').prop('checked', false);
	for(var name in this.screen_search_param){
		if(name == 'SUBTYPE'){
			continue;
		}
		for(var i=0; i<this.screen_search_param[name].length; i++){
			var values = this.screen_search_param[name][i];
			$('.screen_model_param .'+name+' input[value="'+values+'"]').prop('checked', true);
		}
	}
	
	if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
		var subTypeCheck = (this.screen_search_param && this.screen_search_param.SUBTYPE == '2,3,9') ? true : false;
		$('.screen_model_param .SUBTYPE input')[0].checked = subTypeCheck;
		
		var length_1 = $('.screen_model_param .TYPE[name="1"] input').length - 1,
			length_2 = $('.screen_model_param .TYPE[name="2"] input').length - 1;
		if( $('.screen_model_param .TYPE[name="1"] input:checked').length == length_1 ){
			$('.screen_model_param .TYPE[name="1"] li.allCheck input')[0].checked = true;
		}
		if( $('.screen_model_param .TYPE[name="2"] input:checked').length == length_2 ){
			$('.screen_model_param .TYPE[name="2"] li.allCheck input')[0].checked = true;
		}
	}
	
	var checkboxs = $('.screen_model_param input[type="checkbox"]'),
		check_num = 0,
		class_name = '';
	for(var i=0; i<checkboxs.length; i++){
		if(checkboxs[i].checked){
			class_name = 'active';
			check_num ++;
		}
	}
	if(checkboxs.length == check_num){
		class_name = '';
		for(var i=0; i<checkboxs.length; i++){
			checkboxs[i].checked = false;
		}
	}
	if(type == 'none'){
		class_name = 'active';
	}
	$('.disease_list_screen a.screen_link').removeClass('active');
	$('.disease_list_screen a.screen_link').addClass(class_name);
	
	
	
};

/*根据筛选项查询病害列表*/
disease_screen.screen_search = function(type=false){
	var newParam = [],
		subtype = $('.screen_model_param .SUBTYPE').css('display');
	this.screen_search_param = {};
	for(var i=0; i<this.screen_list.length; i++){
		var className = this.screen_list[i].id,
			checkBox = '.' + className + ' input[type=checkbox]',
			doms = $(checkBox);
		if(subtype == 'none' && className == 'SUBTYPE'){
			continue;
		}
//			if( className != 'LINK_NAME' ){
			for(var s=0; s<doms.length; s++){
				var checked = doms[s].checked,
					value = doms[s].value,
					id = doms[s].name;
				if(checked && id != 'all'){
					if(!this.screen_search_param[id]){
						this.screen_search_param[id] = [];
					}
					this.screen_search_param[id].push(value);
				}
			}
//			}
	}
	for(var id in this.screen_search_param){
		var _v = this.screen_search_param[id].join(',');
		newParam.push({
			'k': id,
			'v': _v,
			'op': 'in'
		})
	}
		
	var subTypes = {k: "SUBTYPE", v: "1,2,3,9", op: "in"};
	// 病害类型的查询条件需要特殊处理
	if(Disease.TYPE_LIST.ID == 'PAVEMENT_DISTRESS'){
		let subType = $('.SUBTYPE input[type="checkbox"]').prop('checked');
		subTypes.v = subType ? '2,3,9' : '1,2,3,9';
		newParam.push(subTypes);
	}
	this.screen_search_param['SUBTYPE'] = subTypes.v;
	
	_disease_list_js__WEBPACK_IMPORTED_MODULE_1__["disease_list"].list_init(newParam, type);
};



// module.exports = disease_screen;


/***/ }),

/***/ "./Apps/Dist/Js/disease_slide.js":
/*!***************************************!*\
  !*** ./Apps/Dist/Js/disease_slide.js ***!
  \***************************************/
/*! exports provided: SlideList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlideList", function() { return SlideList; });
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/* harmony import */ var _disease_list_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_list.js */ "./Apps/Dist/Js/disease_list.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/**
 * 排序插件
 */





var SlideList = {};

SlideList.Slideicon = function(element,options) {
	this.element = element;
	this.options = {
		cover:options.cover,
		index:options.index,
		callback:options.callback
	};
	this.SlideiconInit();
};

SlideList.SlideiconInit = function() {
	var _this = this;
	this.element.on('click','li',function(){
		$(this).nextAll().removeClass('active');
		$(this).prevAll().removeClass('active');
		var width = $(this).width();
		var left = ($(this).index())*width;
		_this.options.cover.attr("style","left:"+left+"px");
		$(this).addClass("active");
		params = $(this).attr('type');
		_this.options.callback(params);
	});
};

/*显示反馈界面*/
SlideList.menu_feedbacks = function(type = false){
	if(type){
		$('#mask_model').fadeIn(100);
		$('.feedback_model').fadeIn(101);
	}else{
		$('#mask_model').fadeOut(101);
		$('.feedback_model').fadeOut(100);
	}
};

/*执行收藏-取消收藏事件*/
SlideList.menu_collects = function(type){
	let _url = config_url.pdds + 'data/pd_label/create',
		pd_id = _disease_info_js__WEBPACK_IMPORTED_MODULE_2__["disease_info"].current_info.properties.ID,
		userinfo = $.getLocalStorage('userInfo') || '{}',
		json_userinfo = JSON.parse(userinfo),
		username = json_userinfo.userName,
		_json = {
			"type":"FeatureCollection",
			"features":[
				{
					"type":"Feature",
					"properties":{
						"PD_ID": pd_id,
						"USER": username
					}
				}
			]
		},
		_body = {
			"ops": [
				{
					"k": "PD_ID",
					"type": "string",
					"v": pd_id,
					"op": "eq"
				},
				{
					"k": "USER",
					"type": "string",
					"v": username,
					"op": "eq"
				}
			]
		};
	if(type){
		_url = config_url.pdds + 'data/pd_label/delete';
		$.postAjax({
			url: _url,
			data: _body,
			callback: function(data){
				let _type = true;
				let has_class = $('.menu_manage .menu_mark').hasClass('active');
				if(data.code != '0'){
					_type = false;
				}
				$.errorView(data.message, _type);
				$('.menu_list .menu_list_child .menu_collect').removeClass('active');
				
				if(!has_class){
					$('.menu_manage a.iconshenglvehao').removeClass('active');
				}
			}
		})
	}else{
		$.postAjax({
			url: _url,
			data: _json,
			callback: function(data){
				let _type = true;
				if(data.code != '0'){
					_type = false;
				}
				$.errorView(data.message, _type);
				$('.menu_list .menu_list_child .menu_collect').addClass('active');
				$('.menu_manage a.iconshenglvehao').addClass('active');
			}
		})
	}
};


/*显示-隐藏：全屏界面*/
SlideList.full_screen = function(type = false){
	/*if(type){
		$('.info_image').toggleClass('full_screen');
	}else{
		$('.info_image').removeClass('full_screen');
	}*/
	
	$('.info_image').toggleClass('full_screen');
	let has_class = $('.info_image').hasClass('full_screen'),
		ratio_width = '100%';
	if(has_class){
		let info_height = window.innerHeight - 34,
			ratio_height = info_height / 2048;
		ratio_width = ratio_height * 2448;
	}
	$('.player_video').css('width', ratio_width);
	leafletMap.invalidateSize(true);
	
	/*var ratio_width = 608 / 2448,
		ratio_height = ratio_width * 2048,
		_height = Number(ratio_height);

	$('.disease_player_body .player_image').css('height', _height);
	$('.disease_player_body .player_image #canvas_three').css('height', _height);*/
};


// module.exports = SlideList;



/***/ }),

/***/ "./Apps/Dist/Js/disease_swiper.js":
/*!****************************************!*\
  !*** ./Apps/Dist/Js/disease_swiper.js ***!
  \****************************************/
/*! exports provided: disease_swiper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_swiper", function() { return disease_swiper; });

/**
 * 图片轮播界面
 */

var disease_swiper = {};

	
disease_swiper.swiper_init = function() {
	/*var _html = `
		<div class="slide_item_box">
			<div class="hd">
				<a href="javascript:;" class="prev_img iconfont iconup"></a>
				<a href="javascript:;" class="next_img iconfont iconleftbutton"></a>
			</div>
			<div class="bd slide_item_body">
				<ul class="clearfix">
					<li>
						<img src="./Apps/Dist/swiper/t1.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.04.12</p>
					</li>
					<li>
						<img src="./Apps/Dist/swiper/t2.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.05.12</p>
					</li>
					<li>
						<img src="./Apps/Dist/swiper/t3.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.06.12</p>
					</li>
					<li>
						<img src="./Apps/Dist/swiper/t4.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.07.12</p>
					</li>
					<li>
						<img src="./Apps/Dist/swiper/t5.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.08.12</p>
					</li>
					<li>
						<img src="./Apps/Dist/swiper/t6.png" alt="" width="402" height="402">
						<p class="new_body_title">2018.09.12</p>
					</li>
				</ul>
			</div>
		</div>
	`;
	$(".disease_swiper .slide_item").html(_html);
	$(".slide_item_box").slide({
		titCell: ".hd ul",
		mainCell: ".bd ul",
		prevCell: '.next_img',
		nextCell: '.prev_img',
		autoPage: true,
		effect: "leftLoop",
		autoPlay: false,
		scroll: 2,
		vis: 3,
		delayTime: 1000,
		trigger: "click"
	})*/
};


// module.exports = disease_swiper;







/***/ }),

/***/ "./Apps/Dist/Js/disease_user.js":
/*!**************************************!*\
  !*** ./Apps/Dist/Js/disease_user.js ***!
  \**************************************/
/*! exports provided: disease_user */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "disease_user", function() { return disease_user; });
/* harmony import */ var _disease_screen_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_screen.js */ "./Apps/Dist/Js/disease_screen.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/* harmony import */ var _disease_road_link_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_road_link.js */ "./Apps/Dist/Js/disease_road_link.js");
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/**
 * 退出当前用户
 */







var disease_user = {};

disease_user.current_adcode = null;

disease_user.adcode_param = {};

disease_user.urlCenter = '';

/*退出用户*/
disease_user.userSignOut = function(){
	$.removeCookie('token');
	$.errorView('退出成功');
	setTimeout(function(){
		let _url = './login.html';
		window.open(_url, '_self');
	}, 500)
};

/*用户城市权限界面初始化*/
disease_user.userRoleInit = function(adcodes){
	let cityname = disease_user.current_adcode.name,
		this_center = disease_user.current_adcode.center.split(','),
		newname = cityname.replace(/市|省|自治区|自治州|特別行政区/ig, '');
	
	let list = `
		${adcodes.map(a => `
			<li data-adcode="${a.adcode}" class="${a.className || ''}">${a.name}</li>
		`).join('')}
	`;
	$('.user_citys .citys_list').html(list);
	$('.user_citys .citys_name').html(newname);

	funButtonActive();
	businessListActive();
	
	// if(window._viewer){
	// 	let _center = this_center ? this_center.split(',') : config_url.nantong.center,
	// 		_zoom = config_url.nantong.zoom,
	// 		_height = disease_user.zoomToAltitude(_zoom);
		
	// 	_center = urlCenter ? urlCenter : _center;
	// 	_height = urlCenter ? 750 : _height;
	// 	let center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
		
	// 	_viewer.camera.setView({  
	// 		destination: center
	// 	})
	// }
};

disease_user.userRoleChange = function(){
	let userinfo = $.getLocalStorage('userInfo') || '{}',
		json_userinfo = JSON.parse(userinfo),
		username = json_userinfo.cnName || '佚名',
		userimage = json_userinfo.role || 'beijing',
		imageurl = './Apps/Dist/Img/chengshi@2x/' + userimage + '.png';
	
	$('.user_name').html(username);
	$('.button_list img.user_logo').attr('src', imageurl);
};

/*获取当前用户城市权限列表*/
disease_user.userfindRole = function(){
		
	let userinfo = $.getLocalStorage('userInfo') || '{}',
		json_userinfo = JSON.parse(userinfo),
		username = json_userinfo.userName,
		_url = config_url.pdds + 'user/district/permission/findCitiesByUsername?username=' + username;
	
	let urlAdcode = $.getUrlParam('adcode') || $.getUrlParam('city'),
		centerX = $.getUrlParam('x'),
		centerY = $.getUrlParam('y');
		disease_user.urlCenter =  (centerX && centerY) ? [centerX, centerY] : null;
	
	return new Promise((resolve,reject) => {
		$.getAjax({
		'url': _url,
		'token': true,
		'callback': function(data){
			let adcodes = data.result || [];
			if(data.code != '0'){
				$.errorView('获取当前用户城市权限失败');
			}else if(!adcodes.length){
				$.errorView('当前用户无城市权限');
			}else{
				
				let isDefault = '当前用户城市权限无法对应，请校验！';
				for(let s=0; s<adcodes.length; s++){
					let adcode = adcodes[s].adcode;
					if( !urlAdcode && adcodes[s].isDefault ){
						isDefault = '城市权限未传参，使用默认城市加载！';
						adcodes[s].className = 'active';
						disease_user.current_adcode = adcodes[s];
					}else if(urlAdcode && urlAdcode == adcode){
						isDefault = false;
						adcodes[s].className = 'active';
						disease_user.current_adcode = adcodes[s];
					}
					disease_user.adcode_param[adcode] = adcodes[s];
				}
				
				if(!disease_user.current_adcode){
					adcodes[0].className = 'active';
					disease_user.current_adcode = adcodes[0];
				}
				
				if(isDefault){
					$.errorView(isDefault);
				}
				
				disease_user.userRoleInit(adcodes);
				// disease_road_link.handle_road_data();
			}
			resolve();
		}
	})
	})

};

/* 修改采集图、三维图、正射图的默认显示 */
function funButtonActive(type){
	
	let rearView = disease_user.current_adcode.pdRearImageFlag,
		rearViewClass = rearView ? '' : 'rearViewNot';
	$('body').attr('class', rearViewClass);
	if(type){
		return;
	}
	for(let i=0; i<Disease.TYPE_LIST.FUNBUTTON.length; i++){
		Disease.TYPE_LIST.FUNBUTTON[i].ACTIVE = '';
		if(Disease.TYPE_LIST.FUNBUTTON[i].ID != 'collect_map'){
			Disease.TYPE_LIST.FUNBUTTON[i].ACTIVE = 'active';
		}
	}
	
}

/* 修改业务类型的默认显示 */
function businessListActive(type){
	
	let pdFlag = disease_user.current_adcode.pdFlag || true,
		roadAssetFlag = disease_user.current_adcode.roadAssetFlag || true,
		flag = 'ASSET_INSPECTION',
		flagName = '公路资产巡检和管理';
	
	$('.button_list ul.business_list li').removeClass('active');
	if(!pdFlag || !roadAssetFlag){
		$('.button_list ul.business_list li').css('display', 'none');
		$('.button_list ul.business_list li[data-name=""]').css('display', 'block');
	}
	
	if(pdFlag && !roadAssetFlag){
		flag = 'PAVEMENT_DISTRESS';
		flagName = '公路损坏检测和管理';
	}else if(!pdFlag && roadAssetFlag){
		flag = 'ASSET_INSPECTION';
		flagName = '公路资产巡检和管理';
	}else if(!pdFlag && !roadAssetFlag){
		flag = '';
		flagName = '其他业务';
	}
	
	Disease.TYPE_LIST = Disease.business_list[flag] || null;
	
	$('.button_list ul.business_list li[data-name="' + flag + '"]').css('display', 'block');
	$('.button_list ul.business_list li[data-name="' + flag + '"]').addClass('active');
	$('.button_list a.business_open')[0].firstChild.data = flagName;
	
}

/*切换当前用户城市权限操作*/
disease_user.user_city_change = function(adcode){
	disease_user.current_adcode = disease_user.adcode_param[adcode];
	$('.disease_list_screen a.screen_link').removeClass('active');
	
	funButtonActive();
	businessListActive();
	// disease_user.current_adcode = disease_user.adcode_param[adcode];
	// disease_centre.centre_search_change();
	// disease_screen.screen_search(true);
	// $('.disease_list_screen a.screen_link').removeClass('active');
	
	// let param = disease_user.adcode_param[adcode],
	// 	_center = param.center ? param.center.split(',') : null,
	// 	_zoom = config_url.nantong.zoom,
	// 	_height = disease_user.zoomToAltitude(_zoom);
	// if(!_center){
	// 	$.errorView('获取城市中心点失败');
	// 	return;
	// }
	
	// if(window.tile2d && window.tile2d.imageryProvider){
	// 	window.tile2d.imageryProvider._resource.url = config_url.datasets2d + adcode;
	// }
	
	// let center =  Cesium.Cartesian3.fromDegrees(_center[0], _center[1], _height);
	// _viewer.camera.setView({  
	// 	destination: center
	// })
	// // disease_road_link.handle_road_data();
	// disease_player.cesiumPlayer_init();
};

/*cesium3D高度转换zoom等级*/
disease_user.altitudeToZoom = function(height){
	let new_height = height;
	// if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '441400'){
	// 	new_height = height - 150;
	// }else if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '522700'){
	// 	new_height = height - 1000;
	// }
	if(new_height < 0){
		return null;
	}
	var A = 40487.57,
		B = 0.00007096758,
		C = 91610.74,
		D = -40467.74,
		zoom = D + (A - D) / (1 + Math.pow(new_height / C, B));
	
	return zoom;
};

/*cesium3D高度转换zoom等级*/
disease_user.zoomToAltitude = function(zoom){
	var zoom_level = {
			/*'1': 45000000,
			'2': 26000000,
			'3': 10311040,
			'4': 5932713,
			'5': 2966357,
			'6': 1483178,
			'7': 741589,
			'8': 250000,*/
			'9': 200000,
			'10': 90000,
			'11': 37000,
			'12': 22000,
			'13': 10000,
			'14': 6000,
			'15': 2400,
			'16': 1500,
			'17': 717,
			'18': 300,
			'19': 150,
			'20': 60,
			'21': 30,
			'22': 15,
			'23': 13,
			'24': 5,
			'25': 2,
			'26': 1,
			'27': 0.5
		},
		height = zoom_level[zoom] || 0,
		new_height = height + 150;
	// if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '441400'){
	// 	return new_height;
	// }else if(disease_user.current_adcode && disease_user.current_adcode.adcode && disease_user.current_adcode.adcode == '522700'){
	// 	return (height + 1000);
	// }
	return height;
};
	

// export { disease_user };
// module.exports = disease_user;






/***/ }),

/***/ "./Apps/Dist/Js/event_emitter.js":
/*!***************************************!*\
  !*** ./Apps/Dist/Js/event_emitter.js ***!
  \***************************************/
/*! exports provided: Evented */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Evented", function() { return Evented; });
/*
 * @Author: tao.w
 * @Date: 2020-11-17 18:25:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-24 16:04:21
 * @Description: 
 */

// 检查事件名
function eventNameCheck(eventName) {
    if (typeof eventName != 'string') {
        throw '事件名必须使用字符串类型';
    }
}
// 检查事件监听函数
function handleCheck(handle) {
    if (typeof handle != 'function') {
        throw '事件监听 handle必须是一个函数';
    }
}
let _eventNames  = {
    // "click":[],
}

let Evented = {
    // 存所有事件名字的
    

    // 监听事件
    on: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        this._addHandle(eventName, handle);
    },
    // 一次事件 事件执行一次即被删除
    once: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        let _self = this;
        let _handle = function (data) {
            handle(data);
            _self.remove(eventName, _handle);
        }
        this._addHandle(eventName, _handle);
    },
    // 派发事事件
    emit: function (eventName, data) {
        eventNameCheck(eventName);
        // 如果有eventName事件的兼听函数
        if (_eventNames[eventName]) {
            let _eventName = _eventNames[eventName];

            _eventName.forEach((handle) => {
                handle(data);
            })
        }
    },
    // 移除事件
    remove: function (eventName, handle) {
        eventNameCheck(eventName);
        handleCheck(handle);
        let _eventName = _eventNames[eventName];
        if (_eventName) {
            let index;
            _eventNames[eventName].forEach((_handle, _index) => {
                if (_handle === handle) {
                    index = _index;
                }
            })
            if (index != undefined) {
                _eventName.splice(index, 1);
                // 移除一个事件回调函数后如果此事件已没有其它回调函数，则将当前事件清空，已节省内存
                if (!_eventName.length) {
                    _eventNames[eventName] = null;
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            throw `没有监听的[${eventName}]事件`;
        }
    },
    // 移除所有事件
    removeAll: function (eventName) {
        if (eventName) {
            eventNameCheck(eventName);
            let _eventName = _eventNames[eventName];
            if (_eventName) {
                _eventNames[eventName] = null;
                return true;
            }
            else {
                return false;
            }
        }
        // 如果没有传事件名字，则清空所有事件
        else {
            _eventNames = {};
            return true;
        }
    },
    // 添加事件 私有方法
    _addHandle: function (eventName, handle) {
        if (!_eventNames[eventName]) {
            let _eventName = _eventNames[eventName] = [];
            _eventName.push(handle);
        }
        else {
            _eventNames[eventName].push(handle);
        }
    }

}




/***/ }),

/***/ "./Apps/Dist/Js/get_show_polygon.js":
/*!******************************************!*\
  !*** ./Apps/Dist/Js/get_show_polygon.js ***!
  \******************************************/
/*! exports provided: projection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "projection", function() { return projection; });
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");


/*视频反投函数*/
/*ways-面
K-相机参数
trackPoint*/



var projection = {};

projection.getShowWays = function(ways, K, trackPoint) {
	let geometrys = [],
		context = editor.context,
		R = trackPoint.tags.R,
		T = trackPoint.tags.T,
		width = trackPoint.tags.picW,
		height = trackPoint.tags.picH;
	let rect = [
		[0, 0],
		[width, height]
	];
	let lassExtend = iD.util.lassExtend,
		way, nodes, node, coordinate;
	let coordinates = [],
		pointMappingNode = {},
		nodesStroe = [];
	let _stroeNode;
	for (let i = 0, len = ways.length; i < len; i++) {
		way = ways[i];

		nodes = way.nodes;
		coordinates = [];
		pointMappingNode = {};
		nodesStroe = [];

		for (let i = 0, len = nodes.length - 1; i < len; i++) {
			node = context.entity(nodes[i]);
			let ePoint = context.entity(nodes[i + 1]);
			var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
			coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node.loc);

			if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
				ePoint = context.entity(nodes[nodes.length - 2]);
				n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
			}

			if (coordinate[2] > 0) {
				nodesStroe.push({
					'coordinate': [coordinate[0], coordinate[1], node.loc[2]],
					nodeId: node.id
				});
			} else if (n2[2] > 0) {

				if (n2[1] > height || n2[1] < 0) {
					point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[1]);
				} else {
					point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node.loc, ePoint.loc)[0]);
				}
				
				nodesStroe.push({
					'coordinate': point,
					nodeId: node.id
				});
			} else {
				nodesStroe.push({
					'coordinate': [],
					nodeId: node.id
				});
			}
		}
		let lastNode = context.entity(_.last(nodes));
		coordinate = iD.util.trackPointToPicPixe(K, trackPoint, lastNode.loc);

		if (coordinate[2] > 0) {
			nodesStroe.push({
				'coordinate': [coordinate[0], coordinate[1], lastNode.loc[2]],
				nodeId: lastNode.id
			})
		}

		let _index = 0;
		for (let j = 0; j < nodesStroe.length; j++) {
			_stroeNode = nodesStroe[j];
			if (_stroeNode.coordinate.length == 0) {
				if (coordinates.length > 1) {
					geometrys.push({
						coordinates,
						entity: way,
						pointMappingNode,
						type: 'LineString'
					})
				}
				pointMappingNode = {};
				coordinates = [];
				_index = 0;
			} else {
				coordinates.push(_stroeNode.coordinate);
			   pointMappingNode[_index] = _stroeNode.nodeId;
				_index++;
			}
		}


		if (coordinates.length > 1) {
			geometrys.push({
				coordinates,
				entity: way,
				pointMappingNode,
				type: 'LineString'
			})
		}
	}
	return geometrys;
};

projection.getShowPolygon = function(ways, K, trackPoint) {
	let geometrys = [],
		R = trackPoint.R,
		T = trackPoint.T,
		width = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.imageWidth,
		height = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.imageHeight;
	let rect = [
		[0, 0],
//      	[width, height]
	];
	let lassExtend = iD.util.lassExtend,
		way, nodes, node, coordinate, loc, point;
	let coordinates = [],
		pointMappingNode = {},
		nodesStroe = [];
	let _stroeNode;
	
	nodes = ways._nodes;
	coordinates = [];
	pointMappingNode = {};
	nodesStroe = [];
	var arr = [];

	for (let i = 0, len = nodes.length-1; i < len; i++) {
		node = nodes[i];
		let ePoint = {
				id: 'node_' + i,
				loc: nodes[(i + 1) % nodes.length]
			};
		coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
		var n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
	   
		if (i == 0 && coordinate[2] < 0 && n2[2] < 0) {
			ePoint = {
				id: 'node_' + (nodes.length - 2),
				loc: nodes[nodes.length - 2]
			};
			n2 = iD.util.trackPointToPicPixe(K, trackPoint, ePoint.loc);
		}
		if (coordinate[2] > 0) {
			arr.push({
				index: i,
				nodeId: 'node_' + i,
				loc: this.get_test([coordinate[0], coordinate[1]], K),
				lloc:node,
				coordinate: [coordinate[0], coordinate[1]]
			});
		}else if (n2[2] > 0) {
			// let loc = ePoint.loc;

			// arr.forEach(d => {
		
			//     if (d.nodeId == ePoint.id) loc = d.loc;
		
			// })
			var p = iD.util.KRt(K, R, T);
			var x1 = iD.util.UTMProjection(node);
			var x2 = iD.util.UTMProjection(ePoint.loc);
			var px1 = matrix.multiply(p, x1);
			var px2 = matrix.multiply(p, x2);
			if (n2[1] > height) {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[1]);
			} else {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, ePoint.loc)[0]);
			}
			// }
			arr.push({
				index: i,
				nodeId: 'node_' + i,
				lloc:node,
				loc: this.get_test([point[0], point[1]], K),
				coordinate: [point[0], point[1]]
			});
		} else {
			var _t = _.last(arr);
			var endPoint = ePoint;
			if (_t && _t.index != (i - 1)) {
				endPoint = {
					id: 'node_' + i,
					loc: nodes[(i - 1) % nodes.length]
				}
			}
			loc = endPoint.loc; 
			if(_t){
				var _n = nodes[_t.index];
				loc = _t.loc ? [_t.loc.lng, _t.loc.lat, _t.loc.elevation] : _n;
			}
			arr.forEach(d => {
				if (d.nodeId == endPoint.id) loc = [d.loc.lng, d.loc.lat, d.loc.elevation];
			})
			var _p = iD.util.trackPointToPicPixe(K, trackPoint, loc);
			coordinate = iD.util.trackPointToPicPixe(K, trackPoint, node);
			if (_p[1] > height) {
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[1]);
			}else{
				point = _.flatten(iD.util.getScreenPolygonSegment(K, R, T, width, height, node, loc)[0]);
			}
			if(_.isEmpty(point)) continue;
			arr.push({
				index: i,
				lloc:node,
				nodeId: 'node_' + i,
				loc: this.get_test([point[0], point[1]], K),
				coordinate: [point[0], point[1]]
			});
		}
	}
//  	if (_.isEmpty(arr)) continue;

	arr.forEach((d, i) => {
		nodesStroe.push({
			coordinate: d.coordinate,
			nodeId: d.nodeId,
		})
	})
	for (let j = 0; j < nodesStroe.length; j++) {
		_stroeNode = nodesStroe[j];
		coordinates.push(_stroeNode.coordinate);
		pointMappingNode[j] = _stroeNode.nodeId;
	}
//  	if (!pGinPic(coordinates, width, height)) continue;
	if (coordinates.length >= 2) {
		geometrys.push({
			coordinates,
			entity: ways,
			pointMappingNode,
			type: 'Polygon'
		})
	}
	return geometrys;
};

/*player.pic_point --  当前轨迹点*/
projection.get_test = function(xy, K) {
	let player = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].track_list[_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].current_num - 1],
		cameraHeight = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.cameraHeight,
		pic_point = {
			loc: [ player.x, player.y ]
		};
	// let plane = player.dataMZgr.planes && player.dataMgr.planes.get(player.wayInfo.trackId);
	let geometry = null;
	let utm = LLtoUTM(pic_point.loc[0], pic_point.loc[1]);
	let z = player.z - cameraHeight;
	var lonlat = iD.util.picPixelToLonLat(_.clone(K), player, utm.zoneNumber, utm.designator, xy, z);
	geometry = {
		lng: lonlat[0],
		lat: lonlat[1],
		elevation: z
	};
	return geometry;
};

/*相机参数--整理*/
projection.cameraParams = function(time,type=false){
	var params = [
		[_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.focusX, 0, _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.principlePointX],
		[0, _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.focusX, _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params.principlePointY],
		[0, 0, 1]
	];
	return params;
};









/***/ }),

/***/ "./Apps/Dist/Js/leftOrthograph/addLayers.js":
/*!**************************************************!*\
  !*** ./Apps/Dist/Js/leftOrthograph/addLayers.js ***!
  \**************************************************/
/*! exports provided: addLayers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLayers", function() { return addLayers; });
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../disease_info.js */ "./Apps/Dist/Js/disease_info.js");



var orthographAddlayer = {};
var _map = null;
var catchData = [];

function addLayers(datas, currentId, map, callback){
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
		info && _disease_info_js__WEBPACK_IMPORTED_MODULE_0__["disease_info"].come_to_info(info,true,true);
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

/***/ }),

/***/ "./Apps/Dist/Js/leftOrthograph/map_init.js":
/*!*************************************************!*\
  !*** ./Apps/Dist/Js/leftOrthograph/map_init.js ***!
  \*************************************************/
/*! exports provided: visuaUpMapInit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "visuaUpMapInit", function() { return visuaUpMapInit; });
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../disease_info.js */ "./Apps/Dist/Js/disease_info.js");




var lastInfoId = null;
// var map;
var polygons = {};
var last_polygon = null;
var bufferResults = null;

/**
 * @description 正射图-初始化
 * @param {*string} containerID dom的id值
 */
function visuaUpMapInit(containerID){
	bufferResults = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].getTrackBufferResults();
	
	var _view = _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].current_info;
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
		_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].click_types = false;
		_disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].come_to_info(pathData, true, true, true);
	}
}


/*mapboxgl地图--覆盖物变化*/
//#region 0112
function visua_up_map_layer() {
	let _view = _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].current_info,
		_center = _view.center_xy,
		_loc = _view.locs,
		_layers = map.getStyle()._layers || [],
		thisRange = [];
}




/***/ }),

/***/ "./Apps/Dist/Js/main.js":
/*!******************************!*\
  !*** ./Apps/Dist/Js/main.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _web_init_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./web_init.js */ "./Apps/Dist/Js/web_init.js");

/**
 * 界面文件加载完成
*/


console.log(_web_init_js__WEBPACK_IMPORTED_MODULE_0__["web_init"])
_web_init_js__WEBPACK_IMPORTED_MODULE_0__["web_init"].html_init();


/***/ }),

/***/ "./Apps/Dist/Js/map_init.js":
/*!**********************************!*\
  !*** ./Apps/Dist/Js/map_init.js ***!
  \**********************************/
/*! exports provided: mapInit */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapInit", function() { return mapInit; });
/*
 * @Author: tao.w
 * @Date: 2020-11-13 17:53:44
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-30 16:41:51
 * @Description: 
 */
// import { mapboxgl } from "mapbox-gl";

let token = 'pk.eyJ1Ijoic3BpZGVyejciLCJhIjoiY2lxYXBweWQwMDJhaWZubTFhOW1hNmJraCJ9.NUgEOOc-qxaL52ghK2ic4Q';


//let line = turf.lineString([  trackLocxs
//     [-76.091308, 18.427501],
//     [-76.695556, 18.729501],
//     [-76.552734, 19.40443],
//     [-74.61914, 19.134789],
//     [-73.652343, 20.07657],
//     [-73.157958, 20.210656]
//   ])
// var buffered = turf.buffer(line, 10, {units: 'miles'});
// "http://192.168.7.26:19010/pdds/data/pd/get?queryCriteriaJson={"bbox":"0,0,2,2","polygon":"POLYGON((0 0,0 2,2 2,2 0,0 0))","ops":[{"k":"properties.NAME","v":"中国","op":"eq"}],"sort":[{"k":"properties.TASK_ID","order":"desc"}]}"
//TODO 需要配置底图 图片的访问地址


function mapInit(containerID, mapOption = {}, images = []) {
    let map;
    let _opt = {
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 9,
        minZoom: 9,
        // center: [107.26324629629052,26.363503482566767],
        center:  [121.12826135311582, 32.30269121007785, 1051.466086090133],
        maxZoom: 22,
        pitch: 0,
        bearing: 0,
    }
    // _main_map.setCenter({lng: 121.12826135311582, lat: 32.30269121007785})
    
    function addImageItem(map,fname,i) {
        map.loadImage('./Apps/Dist/icon/' + fname, function (error, image) {
            if (error) throw error;
            //Add an image to the style
            let _imageId = fname.split('.')[0];
            if (!map.hasImage('_imageId')){
                map.addImage(_imageId, image);
            } 
        });
    }
    
    mapboxgl.accessToken = token;
    Object.assign(_opt,mapOption);
    map = new mapboxgl.Map({
        container: containerID,
        style: _opt.style,
        zoom: _opt.zoom,
        minZoom:_opt.minZoom,
        maxZoom:_opt.maxZoom,
        center: _opt.center,
        pitch: _opt.pitch,
        logoPosition:"bottom-right",   //右下角
        bearing: _opt.bearing,
        renderWorldCopies: false

    });

    for (let i = 0; i < images.length; i++) {
        addImageItem(map,images[i],i);
    }

    // map.addControl(new mapboxgl.NavigationControl());

    return map;
};

/***/ }),

/***/ "./Apps/Dist/Js/play_window/cesium_player.js":
/*!***************************************************!*\
  !*** ./Apps/Dist/Js/play_window/cesium_player.js ***!
  \***************************************************/
/*! exports provided: cesium_player */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cesium_player", function() { return cesium_player; });
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _disease_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../disease_info.js */ "./Apps/Dist/Js/disease_info.js");
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _get_show_polygon_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../get_show_polygon.js */ "./Apps/Dist/Js/get_show_polygon.js");
/*
 * @Author: tao.w
 * @Date: 2020-09-02 14:54:09
 * @LastEditors: tao.w
 * @LastEditTime: 2020-09-05 17:40:32
 * @Description: 三维视频窗口
 */









var cesium_player = {};
var viewer_copy;
var show_type = false;
cesium_player.polygons = {};
cesium_player.current_adcode = null;
cesium_player.last_polygon = null;
cesium_player.hdmap = null;
cesium_player.id = 'threed_map';
cesium_player.viewport_quad = null;
cesium_player._alpha = 100;
let _viewer;
// let _alpha = 1.0;

function initCesium() {
	
	Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns";
    
	let clock = new Cesium.Clock({
        startTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        currentTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        stopTime: Cesium.JulianDate.fromIso8601('2020-08-01T06:00+0800'),
        clockRange: Cesium.ClockRange.LOOP_STOP, // loop when we hit the end time
        clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER,
        multiplier: 1, // how much time to advance each tick
        shouldAnimate: false // Animation on by default
    });
    //
    var map_proj = new Cesium.GeographicProjection();
    var globe = new Cesium.Globe(map_proj.ellipsoid);
    //#ADADAD
    globe.baseColor = Cesium.Color.fromRgba(0x00000000);//Cesium.Color.DARKSEAGREEN;//Cesium.Color.BLACK;
    globe.enableLighting = true;
    //
	if(viewer_copy){
		viewer_copy.destroy();
		cesium_player.viewport_quad = null;
	}
	
    let viewer = new Cesium.Viewer('threed_map', {
        clockViewModel: new Cesium.ClockViewModel(clock),
        imageryProvider: null,
        terrainProvider: null,// terrainProvider,
        globe: globe,
        shadows: false,
        homeButton: false,
        sceneModePicker: false,
        useBrowserRecommendedResolution: false,
        infoBox: true,
        terrainShadows: false,
        baseLayerPicker: false,
        geocoder: false,
        timeline: false,
        selectionIndicator: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        animation: false,
        requestRenderMode: true
    });

    viewer_copy = viewer;
    let scene = viewer.scene;
    scene.fog.enabled = true;
	
	// scene.screenSpaceCameraController.enableRotate = false;
	// scene.screenSpaceCameraController.enableTranslate = false;
	// scene.screenSpaceCameraController.enableZoom = false;
	// scene.screenSpaceCameraController.enableTilt = false;
	
    //显示刷新率和帧率
    //scene.debugShowFramesPerSecond = true;
    globe.enableLighting = true;
    let tiles = _disease_user_js__WEBPACK_IMPORTED_MODULE_2__["disease_user"].current_adcode['3d_tiles'];
    cesium_player.current_adcode = _disease_user_js__WEBPACK_IMPORTED_MODULE_2__["disease_user"].current_adcode.dataVersion;
    viewer._cesiumWidget._creditContainer.style.display = "none";

    cesium_player.hdmap = new Cesium.Cesium3DTileset({
        url: config_url.datasets_adcode + tiles + '/tileset.json',
        skipLevelOfDetail: true,
        maximumMemoryUsage: 1024
    });
    viewer.scene.primitives.add(cesium_player.hdmap);
    viewer._cesiumWidget._creditContainer.style.display = "none";
	
		
    if (cesium_player.viewport_quad == null) {
        cesium_player.viewport_quad = new Cesium.ViewportQuad();
		cesium_player.viewport_quad.show = false;
        viewer.scene.primitives.add(cesium_player.viewport_quad);
    }

    //默认隐藏影像图
    {
        let imagery_nums = viewer.imageryLayers.length;
        for (let i = 0; i < imagery_nums; i++) {
            viewer.imageryLayers.get(i).show = false;
        }
    }

    return viewer;
}
function updateViewport(K, point, camera_params) {
    if (!cesium_player.viewport_quad) return;
    //
    var quad_width = _viewer.canvas.clientWidth * window.devicePixelRatio;
    var quad_height = _viewer.canvas.clientHeight * window.devicePixelRatio;
    //
    let delta = { 'roll': camera_params.rollDelta, 'azimuth': camera_params.azimuthDelta, 'pitch': camera_params.pitchDelta };

    let current_pos = iD.util.CreateBatchProp(K, point, delta, camera_params.imageWidth, camera_params.imageHeight, camera_params.principlePointX, camera_params.principlePointY);

    if (current_pos['p2'] != undefined && current_pos['p4'] != undefined) {
        let p2 = current_pos['p2'];
        let p4 = current_pos['p4'];
        let pixel2 = _viewer.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(p2[0], p2[1], p2[2]));
        let pixel4 = _viewer.scene.cartesianToCanvasCoordinates(Cesium.Cartesian3.fromDegrees(p4[0], p4[1], p4[2]));
        //
        let width = Math.abs((pixel4.x - pixel2.x) * window.devicePixelRatio);
        let height = Math.abs((pixel4.y - pixel2.y) * window.devicePixelRatio);
        let left = pixel2.x * window.devicePixelRatio;
        let bottom = quad_height - pixel2.y * window.devicePixelRatio;
        //
        cesium_player.viewport_quad.rectangle = new Cesium.BoundingRectangle(left, bottom, width, height);
    } else {
        cesium_player.viewport_quad.rectangle = new Cesium.BoundingRectangle(0, 0, quad_width, quad_height);
    }
    let img_url = config_url.krs + 'image/get?trackPointId=' + point.trackPointId + '&type=00&seq=005&imageType=jpg&token=' + window.token;
	let new_op = cesium_player._alpha / 100;
    cesium_player.viewport_quad.material = new Cesium.Material({
        fabric: {
            type: 'Image',
            uniforms: {
                color: new Cesium.Color(1.0, 1.0, 1.0, new_op),
                image: img_url
            }
        }
    });

}

// 修改图片隐藏显示
cesium_player.change_toggle = function (type) {
	cesium_player.viewport_quad.show = type;
	if(type){
		cesium_player.update();
	}
    viewer_copy.scene.requestRender();
}

// 修改图片透明度
cesium_player.change_alpha = function (op) {
	let new_op = op / 100;
    if (cesium_player.viewport_quad) {
        cesium_player.viewport_quad.material.uniforms.color.alpha = new_op;
        cesium_player._alpha = op;
        _viewer.scene.requestRender();
    }
}

function location(xyz, roll, pitch, yaw) {
    if (!_viewer) return;
    let position = Cesium.Cartesian3.fromDegrees(xyz[0], xyz[1], xyz[2]);
    _viewer.camera.setView({
        destination: position,
        orientation: {
            heading: Cesium.Math.toRadians(yaw), // east, default value is 0.0 (north)
            pitch: Cesium.Math.toRadians(pitch),    // default value (looking down)
            roll: Cesium.Math.toRadians(roll)                            // default value
        }
    });
}

cesium_player.playerInit = function () {
    window.playerCesium = _viewer = initCesium();
}
cesium_player.update = function () {
    let _current_info = _disease_info_js__WEBPACK_IMPORTED_MODULE_1__["disease_info"].current_info;
    let _tracklist = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].track_list;
    let _camera_params = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].camera_params;
    let idx = _disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].current_num;
    if (!_tracklist || !_tracklist.length) return;
    let trackPoint = _tracklist[idx - 1];
    if (!trackPoint) return;
    let _center = [trackPoint.x, trackPoint.y, trackPoint.z];

    var K = _get_show_polygon_js__WEBPACK_IMPORTED_MODULE_3__["projection"].cameraParams();

    if (window.playerCesium) {
        location(_center, trackPoint.roll, trackPoint.pitch, trackPoint.azimuth);
    } else {
        window.playerCesium = _viewer = initCesium();
        location(_center, trackPoint.roll, trackPoint.pitch, trackPoint.azimuth);
    }
    updateViewport(K, trackPoint, _camera_params);
    // cesium_player.catchPotreeImage(_tracklist);
    return;
};

/*leaflet地图--覆盖物变化*/
cesium_player.visua_up_map_layer = function () {

};

/*正射图--反投显示*/
cesium_player.road_player = function (type) {

    cesium_player.disease_region();
};

/*病害区域功能操作的相关联逻辑处理*/
cesium_player.disease_region = function () {
    $('.player_video .leaflet-marker-icon').hide();
    $('.player_video svg path').hide();
    if (_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].recog_result == '1') {
        $('.player_video .leaflet-marker-icon').show();
    }
    if (_disease_player_js__WEBPACK_IMPORTED_MODULE_0__["disease_player"].recog_result == '2') {
        $('.player_video svg path').show();
    }
};
/*缓存巡查影像后续使用的图片*/
cesium_player.catchPotreeImage = function (alldata) {
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
            _src = config_url.krs + 'image/get?trackPointId=' + track_point_id + '&type=00&seq=005&imageType=jpg&token=' + window.token;

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
            if (iserr) {
                console.warn('视频图片未加载全');
            }
        }
    }

};








/***/ }),

/***/ "./Apps/Dist/Js/web_init.js":
/*!**********************************!*\
  !*** ./Apps/Dist/Js/web_init.js ***!
  \**********************************/
/*! exports provided: web_init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "web_init", function() { return web_init; });
/* harmony import */ var _disease_user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./disease_user.js */ "./Apps/Dist/Js/disease_user.js");
/* harmony import */ var _disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./disease_main_map.js */ "./Apps/Dist/Js/disease_main_map.js");
/* harmony import */ var _disease_centre_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./disease_centre.js */ "./Apps/Dist/Js/disease_centre.js");
/* harmony import */ var _disease_init_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./disease_init.js */ "./Apps/Dist/Js/disease_init.js");
/* harmony import */ var _disease_screen_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./disease_screen.js */ "./Apps/Dist/Js/disease_screen.js");
/* harmony import */ var _disease_player_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./disease_player.js */ "./Apps/Dist/Js/disease_player.js");
/* harmony import */ var _event_emitter__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./event_emitter */ "./Apps/Dist/Js/event_emitter.js");
/* harmony import */ var _disease_leaflet_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./disease_leaflet.js */ "./Apps/Dist/Js/disease_leaflet.js");
/*
 * @Author: tao.w
 * @Date: 2020-11-06 15:01:35
 * @LastEditors: tao.w
 * @LastEditTime: 2020-11-24 16:05:13
 * @Description: 
 */

/**
 * 界面文件加载完成
*/











var web_init = {};


function mapCenter(){
	
	let param = _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode || {},
		_center = param.center ? param.center.split(',') : null;
	if(!_center){
		$.errorView('获取城市中心点失败');
		return;
	}
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].setCenter(_center);
	
}

web_init.html_init = async function () {
    
    let urlToken = $.getUrlParam('t') || $.getUrlParam('token');
    let urlName = $.getUrlParam('n') || $.getUrlParam('name') || '佚名';
    let urlUser = $.getUrlParam('loginName') || '';

    if(urlToken && urlUser){
        $.setLocalStorage('userInfo',{
            'userName': urlUser,
            'cnName': urlName,
            'passWord': window.btoa(urlUser),
            'isCatch': false
        })
        $.setCookie({
            name: 'token',
            value: urlToken
        })
    }
    
    window.token = $.getCookie('token') || '';
    window._evented = _event_emitter__WEBPACK_IMPORTED_MODULE_6__["Evented"];
    if (!token) {
        $.errorView('token不存在，请登录！');
        let _url = './login.html';
        window.open(_url, '_self');
    }
 
    Disease.getSystemTime();

    _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].userRoleChange();

    // Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NWI5MGUzNi1mYWI3LTQzY2QtOGI0Ni0xZWYyNTAxNGM4N2MiLCJpZCI6MTI1OTgsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjE0NDkyNTV9.hBH0PGSnKErc_yNhIePASUkr3QPDoo0KDX9uLpNBUns";


    /*比例尺增加宽凳logo*/
    // var nav_logo = $("<p class='nav_logo'></p>").text("宽凳地图");
    // $(".cesium-viewer-cesiumWidgetContainer .distance-legend").append(nav_logo);

    let info_height = window.innerHeight - 210,
        ratio_height = info_height / 2048, 
        ratio_width = parseInt(ratio_height * 2448);

    $('.disease_info').css('width', ratio_width);
    $(window).resize(function () {
        let new_height = $('.disease_info').height() - 161,
            new_ratio_height = new_height / 2048,
            new_ratio_width = parseInt(new_ratio_height * 2448);

        $('.disease_info').css('width', new_ratio_width);
        // disease_cesium.listen_cesium_body();
    })
    _disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].centre_search_init();
	
	
	// 'screen_init': '左侧列表筛选项变化'
	// 'user_city_change': '城市变化'
	// 'centre_search_change': '数据中心查询'
	// 'screen_search': '左侧列表查询'
	// 'business_change': '业务类型变化'
	
	/* 业务类型变化---切换业务类型 */
	_event_emitter__WEBPACK_IMPORTED_MODULE_6__["Evented"].on('click.businessChange', d=>{
		
		_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].business_change();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadAssetDatas();
		
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].link_code_query().then(function(data){
			_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_init();
			
			// disease_user.user_city_change();
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadMarkLabels();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].centre_search_change();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].search_param();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].check_value_change();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_code_init(data);
			
			_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search();
			
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].updateSources( _disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search_param );		//刷新地图图层加载
		})
	})
	
	/* 行政区划变化---切换城市 */
	_event_emitter__WEBPACK_IMPORTED_MODULE_6__["Evented"].on('click.cityChange', d=>{
		_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].user_city_change(d);
		
		if(!Disease.TYPE_LIST){
		    $.errorView('当前城市无相关业务，请检验！');
			return;
		}
		
		_disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].cesiumPlayer_init();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadAssetDatas();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].handleRoadData();
		
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].link_code_query().then(function(data){
			_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_init();
			
			// disease_user.user_city_change();
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadMarkLabels();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].centre_search_change();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].search_param();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].check_value_change();
			_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_code_init(data);
			
			_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search();
			
			_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].updateSources( _disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search_param );		//刷新地图图层加载
		})
		
		mapCenter();
	})
	
	/* 筛选条件变化时---刷新数据 */
	_event_emitter__WEBPACK_IMPORTED_MODULE_6__["Evented"].on('click.screenChange', d=>{
		_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].screen_model_hide('block');
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search();
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_icon();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].updateConverges( _disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search_param );		//加载数据聚合
	})
	
    await _disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].userfindRole();
	
	if(!Disease.TYPE_LIST){
        $.errorView('当前城市无相关业务，请检验！');
		_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].models_init();
		return;
	}
	
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].maps_init('cesium_map');
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].control_init();
	
	// mapCenter(disease_user.urlCenter);
	_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].business_change();
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadAssetDatas();
	_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].handleRoadData();
	
	if(!_disease_user_js__WEBPACK_IMPORTED_MODULE_0__["disease_user"].current_adcode){
		_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].models_init();
		return;
	}
	
	_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].link_code_query().then(function(data){
		
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].updateConverges();
		_disease_main_map_js__WEBPACK_IMPORTED_MODULE_1__["disease_map"].loadMarkLabels();
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].centre_search_change();
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].search_param();
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].check_value_change();
		_disease_centre_js__WEBPACK_IMPORTED_MODULE_2__["disease_centre"].link_code_init(data);
		
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_init();
		_disease_init_js__WEBPACK_IMPORTED_MODULE_3__["disease_init"].models_init();
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_search();
		_disease_screen_js__WEBPACK_IMPORTED_MODULE_4__["disease_screen"].screen_icon();
		_disease_player_js__WEBPACK_IMPORTED_MODULE_5__["disease_player"].player_init();
	})
	
	var _opt = {
		'disease_map.updateConverges': '加载数据聚合',
		'disease_map.loadMarkLabels': '加载自定义标记',
		'disease_centre.centre_search_change': '加载数据中心当前TAB选项窗口数据',
		'disease_centre.search_param': '加载数据中心列表筛选项',
		'disease_centre.check_value_change': '加载数据中心数据',
		'disease_centre.link_code_init': '加载数据中心路线编号数据',
		'disease_screen.screen_init': '加载筛选界面初始化',
		'disease_init.models_init': '加载界面初始化DOM-BUTTON监听',
		'disease_init.business_change': '加载业务类型DOM样式',
		'disease_screen.screen_search': '加载-根据筛选项查询病害列表',
		'disease_screen.screen_icon': '加载-筛选按钮ICON图标样式初始化',
		'disease_player.player_init': '加载-视频窗口DOM、事件初始化',
		'disease_map.loadAssetDatas': '加载-当前城市的全量数据'
	}
	
	
}




// module.exports = web_init;

// $(function(){

// })



/***/ })

/******/ });
//# sourceMappingURL=main.js.map