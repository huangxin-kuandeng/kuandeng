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

import {
    disease_user
} from './disease_user.js';
import {
    disease_centre
} from './disease_centre.js';

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


export {
    disease_analyse
};
