/**
 * 其他数据
 */

import {
    disease_user
} from './disease_user.js';
import {
    disease_centre
} from './disease_centre.js';

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
	if(!disease_user.current_adcode || !road){
		return;
	}
	var dataVersion = disease_user.current_adcode.dataVersion;
	var _url = config_url.pdds + Disease.TYPE_LIST.URLS.ROAD_WIDTH,
	// var _url = config_url.pdds + 'data/road_maintenance/queryPage',
		_h = $('.data_other').height() - 192 - 56,
		_current = page || 1,
		_this = disease_centre;
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
				disease_centre.cesium_map(row);
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
		
		columns: disease_centre.table_columns("data_other"),
		
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
		disease_centre.open_remark(row, e.target);
	})
	$('#data_other_table').on('mouseout', 'a.remarks', function (e) {
		disease_centre.close_remark();
	})
	
};


export {
    data_other
};
