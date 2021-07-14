/**
 * 病害筛选界面
 */

import {
    disease_user
} from './disease_user.js';
import {
    disease_list
} from './disease_list.js';
import {
    disease_centre
} from './disease_centre.js';

var disease_screen = {};

disease_screen.catchParam = null;
disease_screen.screen_search_param = {};
disease_screen.screen_list = [];

disease_screen.link_code_query = function(){
	let dataVersion = disease_user.current_adcode.dataVersion,
		_url = config_url.pdds + 'data/road/query',
		map_code_param = { 'ops': [{'k': 'DATA_VERSION','v': dataVersion,'op': 'eq','type': 'string'}] };
	
	disease_centre.link_list = [];
	return new Promise((resolve, reject) => {
		$.postAjax({
			'url': _url,
			'data': map_code_param,
			'callback': function(data){
				let type_arr = (data.result && data.result.data) ? data.result.data.features : [];
				for(let i=0; i<type_arr.length; i++){
					disease_centre.link_list.push({
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
		new_link_list = disease_centre.link_list || [],
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
	
	disease_list.list_init(newParam, type);
};

export {
    disease_screen
};

// module.exports = disease_screen;
