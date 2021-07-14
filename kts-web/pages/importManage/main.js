
window.resultPreview = {
	form_html: [],
	checks: {},
	queryConditions: {},
	_lotId: null,
	_taskCache: { "taskId": "", "pageLst": [] },//缓存页面

	_impTotalNum: 0,//全部图片数量
	_impMarkableNum: 0,//可标注数量


	markableSpec:{}


};

/*界面初始化执行函数*/
resultPreview.interfaceInit = function () {
	resultPreview.checks = {};
	util.getSpecInfo(
		resultPreview.findResultData
	);
	/*导入数据*/
	$('button.searchBtn').click(function () {
		let import_name = $('.searchForm input.import_name').val();
		let import_url = $('.searchForm input.import_url').val();
		let _url = window.kms_v2 + 'mark/data/imp?path=' + import_url + '&name=' + import_name;
		if (!import_url && import_name) {
			util.errorView('导入管理参数不能为空');
			return;
		}
		resultPreview.checks = {};
		util.postAjax(_url, {}, function (data) {
			if (data.code != '0') {
				util.errorView(data.message);
				return;
			}
			util.errorView(data.message, true);
			resultPreview.findResultData();
		})
	})
	/*批量删除导入数据*/
	$('button.deleteBtn').click(function () {
		var id_arr = [];
		for (var id in resultPreview.checks) {
			if (resultPreview.checks[id]) {
				id_arr.push(id)
			}
		}
		if (!id_arr.length) {
			util.errorView('未选择相关导入批次信息');
			return;
		}
		var text = "批量删除导入批次：" + id_arr.length + "条";
		var ids = id_arr.join(",");
		resultPreview.deleteTaskImp(text, ids);
	})
	/**批量操作配置项 */
	/*进行批量操作*/
	$('button.operByLotBtn').click(function () {
		$('div#operByLot .operByLot').css('display', 'block')
	})
	let _option = {
		urlSets: {
			'sel': '',
			'del': '',
			'cus': window.kms_v2 + 'data/web_form/info/create'
		},
		'cols': [
			{ values: null, code: 'id', name: '导入批次ID' },
			// {value:null,code:'name',name:'导入批次名称'},
			{
				values: {
					'0': '未使用', '1': '失败',
					'2': '进行中',
					'3': '成功'
				}, code: 'status', name: '状态'
			},
			{ value: null, code: 'createTime', name: '导入时间', type: 'time' },
		],
		'selCallback': resultPreview.findResultData,
		'insByLotCallback': resultPreview.createByLot,
		'insAlotCallback': resultPreview.createByLot,
		'fn': {
			insByLot: { inUse: true, desc: '查询结果批量创建' },
			insAlot: { inUse: true, desc: '勾选多行批量创建' },
		},
		'pageName': 'importManage'
	}
	operByLot.load(_option);
}

/*查询数据*/
resultPreview.findResultData = function (_params, isSelByLot = false) {
	let table_html = `
		<table id="importManageTable" class="table table-bordered table-hover">
			
		</table>
	`;
	$('.bodyTable').html(table_html);
	// let isSelByLot_ = isSelByLot;
	var table = $("#importManageTable").DataTable({
		'language': window.lang,
		'searching': false,
		'paging': true,
		'lengthChange': false,
		'ordering': false,
		'info': true,
		'autoWidth': false,
		//      "lengthMenu"  : [10],
		"aaSorting": false,
		'processing': true,
		'serverSide': true,
		ajax: function (data, callback, settings) {
			let page = (data.start / data.length) + 1;
			let param1 = {
				"page": {
					"pageNo": page,
					"pageSize": 10
				}
			}
			/**条件查询参数 */
			let _ops = [];
			if (_params && !$.isEmptyObject(_params)) {

				Object.keys(_params).forEach(el => {
					let _val = _params[el]; let _op = 'eq'; let _el = el;
					if (el == 'status') {
						_val = (Number(_val) - 2).toString();
					}
					if (el == 'start_createTime' || el == 'end_createTime') {
						_val = (new Date(_val)).valueOf(); // ms
						_el = el.split('_')[1];
						_op = (el.split('_')[0] == 'start' ? 'gt' : 'lt');

					}
					let temp = {
						"k": _el,
						"v": _val,
						"op": _op
					};
					_ops.push(temp);
				})
			}
			param1["ops"] = _ops;
			resultPreview.queryConditions = param1;

			let _url = window.kms_v2 + 'mark/data/imp/queryPage';
			util.postAjax(_url, param1, function (data) {
				if (data.code != '0') {
					util.errorView(data.message);
					return;
				}
				console.log(data)
				let datas = data.result || {};
				let returnData = {};
				returnData.recordsTotal = datas.page.count || 0;
				returnData.recordsFiltered = datas.page.count || 0;
				returnData.data = datas.data || [];
				// isSelByLot_ = isSelByLot;
				callback(returnData);
	
			})
		},
		columns: [
			{
				"data": "id" || "",
				"render": function (data, type, row, meta) {
					var checked = resultPreview.checks[data],
						checked_s = checked ? "checked" : "";
					var model = `
						<label class="delete_check" style="padding:0px 5px;">
							<input type="checkbox" value="${data}" ${checked_s}/>
							<span></span>
						</label>
					`;
					return model;
				},
				"class": "checkTask",
				"title": `
					<label class="delete_check_all" style="padding:0px 5px;">
						<input type="checkbox" />
						<span></span>
					</label>
				`
			},
			{
				"data": "id",
				"class": "id",
				"title": "导入批次ID"
			},
			{
				"data": "name",
				"class": "name",
				"title": "导入批次名称"
			},
			{
				"data": "path",
				"class": "path",
				"title": "导入数据路径"
			},

			{
				"data": "status",
				"class": "status",
				"render": function (data, type, row, meta) {
					let types = {
						'-1': '失败',
						'0': '进行中',
						'1': '成功'
					}
					let value = types[data] || '';
					return value;
				},
				"title": "导入状态"
			},
			{
				"data": "message" || "",
				"class": "message",
				"title": "导入信息"
			},
			{
				"data": "total",
				"class": "total",
				"title": "总数"
			},
			{
				"data": "impTotal",
				"class": "impTotal",
				"title": "导入总数据"
			},
			{
				"data": "id",
				"class": "markableNum",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'markableNum';
					// let pro = row.properties || {};
					if (Object.keys(row).includes(k)) {
						let v = row[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "可标注数量"
			},
			{
				"data": "id",
				"class": "createTaskPack",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'createTaskPack';
					if (Object.keys(row).includes(k)) {
						let v = row[k];
						let types = {
							'true': '是',
							'false': '否',
						}
						res = types[v] || '';
					}
					return res;

				},
				"title": "是否已创建"
			},
			{
				"data": "id",
				"class": "bussId",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'bussId';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "业务ID"
			},
			{
				"data": "id",
				"class": "roadType",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'roadType';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "道路类型"
			},
			{
				"data": "id",
				"class": "pavementType",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'pavementType';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "路面类型"
			},
			{
				"data": "id",
				"class": "timeFrame",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'timeFrame';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "时段"
			},
			{
				"data": "id",
				"class": "customerId",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'customerId';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "客户ID"
			},
			{
				"data": "id",
				"class": "imageType",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'imageType';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "图片类型"
			},
			{
				"data": "id",
				"class": "markType",
				"render": function (data, type, row, meta) {
					let res = '';
					let k = 'markType';
					let pro = row.properties || {};
					if (Object.keys(pro).includes(k)) {
						let v = pro[k];
						let _Types = window.spec.filter(function (results) {
							return results.code == k;
						})
						if (_Types.length && _Types[0].values) {
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;

				},
				"title": "标注类型"
			},
			{
				"data": "createTime",
				"class": "createTime",
				"render": function (data, type, row, meta) {
					let time = util.Time(data);
					return time;
				},
				"title": "导入时间"
			},
			{
				"data": "id",
				"class": "manage",
				"render": function (data, type, row, meta) {
					let btn_html = '';
					if (row.status == '1') {
						btn_html = `
							<button class="btn btn-success createTask">创建任务</button>
						`;
					}
					let pre_btn = `<button class="btn btn-warning preTag">预览</button>`;
					let new_btn_html = `
					${pre_btn} ${btn_html}
						<button class="btn btn-danger deleteTaskPack">删除</button>
					`;
					return new_btn_html;
				},
				"title": "操作"
			}
		]

	});
	// 批量删除后默认全选 isSelByLot
	// if (isSelByLot_) {
	// 	setTimeout(()=>{
	// 		$('#importManageTable thead label.delete_check_all input,#importManageTable tbody  label.delete_check input').each(function () {
	// 			this.checked = 'checked';
	// 			var _id = this.value;
	// 			if(_id && _id!='on'){
	// 				resultPreview.checks[_id] = true;
	// 			}			
	// 		})
	// 	}, 1000)

	// }

	// 全选按钮
	$('#importManageTable thead').on('click', 'label.delete_check_all input', function (e) {

		var c_check = e.target.checked;
		var delete_checks = $('#importManageTable tbody label.delete_check input');
		for (var i = 0; i < delete_checks.length; i++) {
			var _id = delete_checks[i].value;

			delete_checks[i].checked = c_check;
			resultPreview.checks[_id] = c_check;
		}

	});
	// 单选按钮
	$('#importManageTable tbody').on('click', 'label.delete_check input', function (e) {

		var c_check = e.target.checked;
		var _id = e.target.value;
		resultPreview.checks[_id] = c_check;

	});

	$('#importManageTable tbody').on('click', 'tr td button.createTask', function (e) {
		if (!window.spec) {
			util.errorView('标注规格未获取完成，请重试');
			return;
		}
		var tr = $(this).closest('tr'),
			row = table.row(tr),
			data = row.data();
		resultPreview.findCraftData(data);
	});
	// 指定删除导入批次
	$('#importManageTable tbody').on('click', 'tr td button.deleteTaskPack', function (e) {
		var tr = $(this).closest('tr'),
			row = table.row(tr),
			data = row.data(),
			id = data.id,
			name = data.name || "",
			text = "删除导入批次：（ " + name + " ）";

		resultPreview.deleteTaskImp(text, id);
	});

	/**clone 410评估结果展示 */
	$('#importManageTable tbody').on('click', 'tr td button.preTag', function () {
		//
		let tr = $(this).closest('tr');
		let row = table.row(tr);
		let _json = {};
		resultPreview._impTotalNum = row.data().impTotal || 0;
		resultPreview._impMarkableNum = row.data().markableNum  || 0;
		resultPreview._lotId = row.data().id || '';
		// trainProject._projectId = row.data().projectId || '';
		/**是否清除本地缓存页码 */
		let cachePg = JSON.parse(localStorage.getItem('_taskCache'));
		if (cachePg) {
			if (resultPreview._lotId != cachePg.taskId) {
				localStorage.removeItem('_taskCache');
				resultPreview._taskCache.taskId = resultPreview._lotId;
				resultPreview._taskCache.pageLst = [];
			} else {
				resultPreview._taskCache = cachePg;
			}
		}
			if (!resultPreview._lotId) {
				util.errorView('批次ID为空');
				return;
			}


			_json = {
				"ops": [
					{
						"k": "impBatch",
						"type": "string",
						"v": resultPreview._lotId.toString(),
						"op": "eq"
					}
				],
				"page": {
					"totalPages": 0,
					"count": 1000,
					"pageNo": 1,
					"pageSize": 10
				}
			};
		// resultPreview.getEvalLegend('2024957');
		// http://muses.gzproduction.com/muses/project/param/download/2024957/map_label  识别图例 用项目id查询
	
		/**评估结果 */
		evalGallery.resetGallery(_json, false, 1, null);
		// resultPreview.setPickMark();
	})
}

// 删除导入批次
resultPreview.deleteTaskImp = function (text, id) {
	util.openTips_btn([text], function () {
		var _url = window.kms_v2 + 'mark/data/imp/delete?impBatches=' + id;
		$('#loading').fadeIn();
		util.getAjax(_url, true, function (data) {
			$('#loading').fadeOut();
			if (data.code != "0") {
				util.errorView('删除导入批次失败');
				return;
			}
			util.errorView('删除导入批次成功', true);
			$('.testmodal .modal1').modal('hide');
			resultPreview.checks = {};
			resultPreview.findResultData();
		})
	})
}

/*查询当前markType对应的工艺列表*/
resultPreview.findCraftData = function (data) {
	$('#loading').fadeIn();
	let markType = (data.properties || data.properties.markType) ? data.properties.markType : '',
		id = data.id,
		_url = window.kms_v2 + 'base/craft/querySimpleByType';

	if (!markType) {
		util.errorView('markType不存在，自动查询所有工艺', true);
	} else {
		_url += ('?markType=' + markType);
	}

	util.getAjax(_url, true, function (data) {
		$('#loading').fadeOut();
		let selects = data.result || [],
			selects_html = `
				<select class="craftId" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择工艺</option>
		            ${selects.map(f => `
					  	<option value="${f.craftId}">${f.craftId}</option>
		            `).join('')}
				</select>
			`;
		let input_name = `<input type="text" class="form-control name" placeholder="请输入名称" value="">`,
			input_remarks = `<input type="text" class="form-control remarks" placeholder="请输入备注" value="">`,
			input_num = `<input type="text" class="form-control num" placeholder="请输入数量" value="">`,
			select_types = `
				<select class="imageType" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择图片类型</option>
				  	<option value="1">半图</option>
				  	<option value="2" selected>全图</option>
				</select>
			`;


		util.openTips_btn([input_name, selects_html, select_types, input_num, input_remarks], function () {
			let craftId = $('.modal-body .craftId').val(),
				name = $('.modal-body .name').val(),
				remarks = $('.modal-body .remarks').val(),
				num = $('.modal-body .num').val(),
				imageType = $('.modal-body .imageType').val();
			if (!craftId || !name || !imageType) {
				util.errorView('请填写相关参数', false);
				return;
			}
			$('#loading').fadeIn();
			let _url = window.kms_v2 + 'task/pack/createByImpBatch?impBatch=' + id + '&craftId=' + craftId + '&name=' + name + '&remarks=' + remarks + '&createBy=' + user.username + '&imageType=' + imageType + '&num=' + num;

			util.postAjax(_url, true, function (data) {
				$('#loading').fadeOut();
				if (data.code != '0') {
					util.errorView(data.message);
					return;
				}
				util.errorView(data.message, true);
				$('.testmodal .modal1').modal('hide');
				resultPreview.findResultData();
			})
		}, '创建任务')
	})

}

/**由导入管理批量创建任务包 */
resultPreview.createByLot = function (type, _params) {
	let param1 = {};
	let _createUrl = '';
	/**查询结果直接创建 */
	if (type == 'ByLot') {
		param1 = {
			"page": {
				"pageNo": 1,
				"pageSize": 1000 // 上限暂写1000
			}
		}
		/**1.条件查询参数 */
		let _ops = [];

		if (_params && !$.isEmptyObject(_params)) {
			Object.keys(_params).forEach(el => {

				let _val = _params[el]; let _op = 'eq'; let _el = el;
				if (el == 'status') {
					_val = (Number(_val) - 2).toString();
				}
				if (el == 'start_createTime' || el == 'end_createTime') {
					_val = (new Date(_val)).valueOf(); // ms
					_el = el.split('_')[1];
					_op = (el.split('_')[0] == 'start' ? 'gt' : 'lt');

				}
				let temp = {
					"k": _el,
					"v": _val,
					"op": _op
				};
				_ops.push(temp);

			})
		}
		param1["ops"] = _ops;
		_createUrl = window.kms_v2 + 'task/pack/createByQuery?createBy=' + user.username; // "http://192.168.7.22:13310/kms-v2/"
	}
	/**2.勾选创建 */
	else if (type == 'Alot') {
		_createUrl = window.kms_v2 + 'task/pack/createByImpBatches'; //"http://192.168.7.22:13310/kms-v2/"
		let ids = [];
		Object.entries(resultPreview.checks).forEach(([k, v]) => { if (v) ids.push(k) })
		param1.impBatches = ids.join(',');
	}

	// Object.entries(resultPreview.checks).filter(([k,v]) => v==true)
	$('#loading').fadeIn();
	let markType = '';
	if (type == 'ByLot' || _params || _params.markType) {
		markType = _params.markType
	}
	_url = window.kms_v2 + 'base/craft/querySimpleByType';

	if (!markType) {
		util.errorView('markType不存在，自动查询所有工艺', true);
	} else {
		_url += ('?markType=' + markType);
	}

	util.getAjax(_url, true, function (data) {
		$('#loading').fadeOut();
		let selects = data.result || [],
			selects_html = `
				<select class="craftId" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择工艺</option>
		            ${selects.map(f => `
					  	<option value="${f.craftId}">${f.craftId}</option>
		            `).join('')}
				</select>
			`;
		let input_name = `<input type="text" class="form-control name" placeholder="请输入名称" value="">`,
			input_remarks = `<input type="text" class="form-control remarks" placeholder="请输入备注" value="">`,
			select_types = `
				<select class="imageType" style="width: 100%;color: #000;height: 30px;">
					<option value="">请选择图片类型</option>
				  	<option value="1">半图</option>
				  	<option value="2" selected>全图</option>
				</select>
			`;


		util.openTips_btn([input_name, selects_html, select_types, input_remarks], function () {
			let craftId = $('.modal-body .craftId').val(),
				name = $('.modal-body .name').val(),
				remarks = $('.modal-body .remarks').val(),
				imageType = $('.modal-body .imageType').val();
			if (!craftId || !name || !imageType) {
				util.errorView('请填写相关参数', false);
				return;
			}
			$('#loading').fadeIn();
			if (type == 'ByLot') {
				let urlParams = {
					imageType: imageType,
					craftId: craftId,
					name: name,
				}
				Object.entries(urlParams).forEach(([k, v]) => {
					_createUrl += ('&' + k + '=' + v);
				})
			} else {
				param1.craftId = craftId
				param1.name = name
				param1.remarks = remarks
				param1.imageType = imageType
				param1.createBy = user.username
			}
			util.postAjax(_createUrl, param1, function (data) {
				$('#loading').fadeOut();
				if (data.code != '0') {
					util.errorView(data.message);
					return;
				}
				util.errorView('创建成功', true)
				$('.testmodal .modal1').modal('hide');
				console.log(data)
			})
		}, '创建任务')
	})
}
resultPreview.closeGallery = function (mark) {
	if (confirm('是否保存标注数据')) {
		resultPreview.saveMarkableId('evalGallery');
	} else {
		resultPreview._lotId = '';
		resultPreview.markableSpec = {};
		$('.' + mark).css('display', 'none');
	}

},
	/**获取评估项目的图例参数 */
	resultPreview.getEvalLegend = function (projId) {
		evalGallery.colorSet = [];
		let urlLegend = configURL.muses + 'project/param/download/' + projId.toString() + '/map_label';
		util.getAjax(urlLegend, true, function (data) {
			if (!data || data.length == 0) {
				util.errorView('查询评估项目图例失败：' + data.message);
				return;
			}
			let datas = data || [];//evalGallery.colorSet
			try {
				datas = JSON.parse(datas);
			} catch (e) {
				util.errorView('图例类型不符：' + data.message);
				datas = [];
			}
			if (datas.length > 0) {
				datas.map(el => { if (el.color) { el.color = el.color.join(',') } })
			}
			evalGallery.colorSet = datas;
		})

	}
//暂存标注原始物id 翻页暂存 关闭提示提交
resultPreview.saveMarkableId = function (mark) {
	let _url = configURL.kms_v2;  //configURL.kms_v2 
	let markableIds = [],unmarkableIds=[];
	Object.entries(resultPreview.markableSpec).forEach(([k,v]) => {
		if(v){
			markableIds.push(k);
		}else{
			unmarkableIds.push(k);
		}
	});
	_url += '/org/info/setMarkable?impBatch=' + resultPreview._lotId + '&markableIds=' + markableIds.join(',') + '&unmarkableIds=' + unmarkableIds.join(',');
	util.getAjax(_url, true, function (data) {
		if (!data || data.length == 0) {
			util.errorView('提交失败：' + data.message);
			return;
		} else {
			resultPreview.findResultData();
			util.errorView(data.message,1);
		}

	})
}

//markable数据是否要通过标注接口取  不要吧= =
resultPreview.setPickMark= function (params) {
	
	let queryPolygonJson_ = '{"ops":[{"op":"in","k":"ORGID","v":"' + _tags + '"},{"op":"eq","k":"BUSSSENCE","v":"2"},{"op":"eq","k":"TASKID","v":"' + trainProject._taskId + '"}]}';
	let encode_tags = encodeURIComponent(queryPolygonJson_);
	let _urlMark = configURL.kd_tag + 'tag/PICK_MARK_TAG/polygon?batchVersion=0&queryPolygonJson=' + encode_tags;
	$.getAjax(_urlMark, true, function (data) {

	})
}
resultPreview.interfaceInit();

