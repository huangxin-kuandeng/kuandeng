/**
 * 路段分析
 */

import {
    disease_user
} from './disease_user.js';
import {
    disease_centre
} from './disease_centre.js';

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
	if(!disease_user.current_adcode){
		return;
	}
	var dataVersion = disease_user.current_adcode.dataVersion;
	var _url = config_url.pdds + Disease.TYPE_LIST.URLS.ROAD,
	// var _url = config_url.pdds + 'data/road_maintenance/queryPage',
		_h = $('.road_analyse').height() - 192 - 56,
		_current = page || 1,
		_this = disease_centre;
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
		
		columns: disease_centre.table_columns("road_analyse"),
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


export {
    disease_road_analyse
	
	
	
};
