
window.resultPreview = {
	form_html: [],
	checks: {},
};

/*界面初始化执行函数*/
resultPreview.interfaceInit = function(){
	resultPreview.checks = {};
	/**切换查询条件时提示 */
	$('.searchForm select.form-control').on('change', function () {
		let _code = $(this).val();let res = '';
		let title = window.spec.filter(el => {return el.code == _code});
		if(title.length>0 && title[0].values) {
			res = Object.entries(title[0].values).map(([k,v]) => {return k + ':' + v}).join('\n')
		}
		$('.searchForm input.form-control').attr('title',res)
	})
	/*查询数据*/
	$('button.searchBtn').click(function(){
		let params = {};arr = [];
		arr = $('.searchForm .form-control');
		if(arr[0].value && arr[1].value) params[arr[0].value] = arr[1].value;
		resultPreview.checks = {};
		resultPreview.findResultData(params);
	})
	/*批量删除任务包*/
	$('button.deleteBtn').click(function(){

		var id_arr = [];
		for(var id in resultPreview.checks){
			if( resultPreview.checks[id] ){
				id_arr.push(id)
			}
		}
		if( !id_arr.length ){
			util.errorView('未选择相关任务包信息');
			return;
		}
		var text = "批量删除任务包：" + id_arr.length + "条";
		var ids = id_arr.join(",");
		resultPreview.deleteTaskPack( text, ids );
	})


	/**批量操作配置项 */
	   /*进行批量操作*/
	   $('button.operByLotBtn').click(function(){
        $('div#operByLot .operByLot').css('display','block')
    })
	let _option = {
        urlSets:{            
            'sel': '',
            'del': '',
            'cus': window.kms_v2 + 'data/web_form/info/create'
        },
        'cols':[
                {values:null,code:'id',name:'任务包ID'},
                {values:null,code:'name',name:'任务包名称'},
				{values:null,code:'createTime',name:'创建时间',type:'time'},

				// {values:{'0': '未使用','1': '失败',
				// '2': '进行中',
				// '3': '成功'},code:'status',name:'状态'},
            ],
        'selCallback': resultPreview.findResultData,
        'fn': {},
        'pageName':'taskPack'
    }
    operByLot.load(_option);	
	util.getSpecInfo(
		resultPreview.findResultData
	);
}

/*查询数据*/
resultPreview.findResultData = function(_params){
	let table_html = `
		<table id="taskPackTable" class="table table-bordered table-hover">
			
		</table>
	`;
	$('.bodyTable').html(table_html);
	var table = $("#taskPackTable").DataTable({
    	'language'    : window.lang,
        'searching'   : false,
        'paging'      : true,
        'lengthChange': false,
        'ordering'    : false,
        'info'        : true,
        'autoWidth'   : false,
//      "lengthMenu"  : [10],
        "aaSorting"	  : false,
    	'processing'  : true,
    	'serverSide'  : true,
        ajax: function (data, callback, settings) {
        	let page = (data.start / data.length)+1;
			let param1 = {
			  	"page": {
				    "pageNo": page,
				    "pageSize": 10
			  	}
			}
		
				// _url=	"http://192.168.7.22:13310/kms-v2/" + 'task/pack/queryPage?pageSize=10&pageNum=' + page;
				_url =window.kms_v2+ 'task/pack/queryPage?pageSize=10&pageNum=' + page;
			
		
			/**批量查询组合结果 */
			let _ops = [];
			if (_params && !$.isEmptyObject(_params)) {
			
				Object.keys(_params).forEach(el => {
					let _el = el;let _op = 'eq';
					let _val =  _params[el];
					if(el == 'status'){
						_val = (Number(_val) - 2).toString();					
					}
					if(el == 'start_createTime' || el == 'end_createTime'){
						_val = ( new Date(_val) ).valueOf(); // ms
						_el = el.split('_')[1];
						_op = (el.split('_')[0] == 'start'?'gt':'lt');
						
					}
					let temp = {
						"k": _el,
						"v": _val,
						"op":_op
					};
					_ops.push(temp);
				})
			}
			param1["ops"] = _ops;
			
			util.postAjax(_url,param1, function(data){
//				if(data.code != '0'){
//					util.errorView(data.message);
//					return;
//				}
let datas = data.result || {};
let returnData = {};
returnData.recordsTotal = datas.page.count || 0;
returnData.recordsFiltered = datas.page.count || 0;
returnData.data = datas.data || [];
            	callback(returnData);
			})
		},
		
		// "remarks": null,
        // "createBy": "tag_supervisor",
        // "createTime": 1615772703443,
        // "updateBy": null,
        // "updateTime": null,
        // "delFlag": "0",
        // "id": "138",
        // "name": "检测-病害-3/15",
        // "type": "0",
        // "impBatch": "d080e9f3489b4b9690e29ba06ee8a051",
        // "status": 0,
        // "total": 1,
        // "properties": {
        //   "roadType": "0",
        //   "craftId": "kd_det_v6.4",
        //   "markType": "2",
        //   "pavementType": "0",
        //   "customerId": null,
        //   "id": "138",
        //   "imageType": "2",
        //   "timeFrame": "0",
        //   "bussId": "2"
        // }
        columns: [
			{
				"data": "id" || "",
				"render": function ( data, type, row,  meta ) {
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
				"title": "任务包ID"
           	},
	        { 
            	"data": "name" || "",
				"class": "name",
				"title": "任务包名称"
           	},
			   { 
            	"data": "status",
				"class": "status",
				"render": function ( data, type, row,  meta ) {
					let types = {
						'-1': '失败',
						'0': '进行中',
						'1': '成功'
					}
					let value = types[data] || data;
				  return value;
			  },
				"title": "状态"
			},
	        { 
            	"data": "id",
				"class": "total",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'total';
					let pro = row;
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "数量"
           	},

	        { 
            	"data": "craftId",
				"class": "craftId",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'craftId';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						} else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "工艺ID"
           	},
	        { 
            	"data": "bussId" || "",
				"class": "bussId",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'bussId';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
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
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'roadType';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title":"道路类型"
           	},
			   { 
				"data": "id",
				"class": "pavementType",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'pavementType';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title":"路面类型"
           	},
			   { 
				"data": "id",
				"class": "timeFrame",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'timeFrame';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
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
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'customerId';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "客户ID"
           	},
	        // { 
            // 	"data": "customerId"  || "",
			// 	"class": "customerId",
			// 	"render": function ( data, type, row,  meta ) {
			// 		let data_text = data;
			// 		let obj = window.spec.filter(function(results){
			// 			return results.code == 'customerId';
			// 		})
			// 		if(obj.length && obj[0].values){
			// 			data_text = obj[0].values[data] || data;
			// 		}
			// 	  return data_text;
			//   },
			// 	"title": "客户ID"
			// },
		     
			{ 
            	"data": "id" ,
				"class": "imageType",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'imageType';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "图片类型"
           	},
	        { 
            	"data": "id" ,
				"class": "markType",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'markType';
					let pro = row.properties || {};
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "标注类型"
           	},
	        { 
            	"data": "id",
				"class": "createBy",
				"render": function ( data, type, row,  meta ) {
					let res = '';
					let k = 'createBy';
					let pro = row;
					if(Object.keys(pro).includes(k)){
						let v  = pro[k];
						let _Types = window.spec.filter(function(results){
							return results.code == k;
						})
						if(_Types.length && _Types[0].values){
							res = _Types[0].values[v] || v;
						}else {
							res = v;
						}
					}
					return res;
					
			  },
				"title": "创建者"
           	},
	        { 
            	"data": "createTime",
				"class": "createTime",
              	"render": function ( data, type, row,  meta ) {
              		let time = data ? util.Time(data) : '';
					return time;
				},
				"title": "创建时间"
           	},
	        { 
            	"data": "id",
				"class": "manage",
              	"render": function ( data, type, row,  meta ) {
					var btn_html = `				
					<button class="btn btn-warning packDetail" >详情</button>
							<button class="btn btn-success efficiencyStatistics" title="打开任务包效率统计">效率统计</button>
							<button class="btn btn-success createTask">创建任务</button>
							<button class="btn btn-danger deleteTaskPack">删除任务包</button>
					`;
					return btn_html;
				},
				"title": "操作"
			}
        ]
	});
	
	// 全选按钮
	$('#taskPackTable thead').on('click', 'label.delete_check_all input', function (e) {
		
		var c_check = e.target.checked;
		var delete_checks = $('#taskPackTable tbody label.delete_check input');
		for(var i=0; i<delete_checks.length; i++){
			var _id = delete_checks[i].value;
			
			delete_checks[i].checked = c_check;
			resultPreview.checks[_id] = c_check;
		}
		
	});
	// 单选按钮
	$('#taskPackTable tbody').on('click', 'label.delete_check input', function (e) {
		
		var c_check = e.target.checked;
		var _id = e.target.value;
		resultPreview.checks[_id] = c_check;
		
	});
		// 任务包详情
		$('#taskPackTable tbody').on('click', 'tr td button.packDetail', function (e) {
			var tr = $(this).closest('tr'),
				row = table.row( tr ),
				data = row.data();
				let _specLst = {};
				window.spec.forEach(el => {_specLst[el.code] = el.name;});
				// let trans_data = Object.keys(data).map(el => {
				// 	let _el = _specLst[el] || el;
				// 	let _val = _specLst[data[el]] || data[el];
				// 	let temp = {};temp[_el] = _val;
				// 	return temp;
				// })
		
				let _json = `批次:\n${data.impBatch.replace(/,/g,'\n') || ''}\n备注:${data.remarks || ''}` ;
				let _html = `<p class='rank_line'>任务包${data.id}详情</p><button class='clsbtn btn  btn-danger'>关闭</button><textarea disabled class='packdetail'>${_json}</textarea>`
				$('.packDetailDiv').html(_html).css('display','block')
				$('.packDetailDiv .clsbtn').on('click',function () {
					$('.packDetailDiv').css('display','none')
				})
			// resultPreview.findCraftData(data);
		});
	// 任务包效率统计
	$('#taskPackTable tbody').on('click', 'tr td button.efficiencyStatistics', function (e) {
		var tr = $(this).closest('tr'),
	    	row = table.row( tr ),
			data = row.data(),
			packId = data.id;
		
		var _blank = "../efficiencyStatistics/index.html?projectId=" + packId;
		window.open(_blank, "_blank");
	});
	// 指定任务包创建任务
    $('#taskPackTable tbody').on('click', 'tr td button.createTask', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data();
    	resultPreview.findCraftData(data);
    });
	// 指定删除任务包
    $('#taskPackTable tbody').on('click', 'tr td button.deleteTaskPack', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data(),
			id = data.id,
			name = data.name || "",
			text = "删除任务包：" + id + "（ "+ name +" ）";
		
		resultPreview.deleteTaskPack( text, id );
    });
	
	
}

// 删除任务包
resultPreview.deleteTaskPack = function( text, id ){
	
	util.openTips_btn([text], function(){
		var _url = window.kms_v2 + 'task/pack/delete?packIds=' + id;
		$('#loading').fadeIn();
		util.getAjax(_url, true, function(data){
			$('#loading').fadeOut();
			if(data.code != "0"){
				util.errorView('删除任务包失败');
				return;
			}
			util.errorView('删除任务包成功', true);
			$('.testmodal .modal1').modal('hide');
			resultPreview.checks = {};
			resultPreview.findResultData();
		})
	})
}

/*查询当前markType对应的工艺列表*/
resultPreview.findCraftData = function(data){
	$('#loading').fadeIn();
	let markType = '';
	if(data.properties && data.properties.markType) markType = data.properties.markType;
	let packId = data.id,
		_url = window.kms_v2 + 'base/craft/querySimpleByType';
	
	if(!markType){
		util.errorView('markType不存在，自动查询所有工艺', true);
	}else{
		_url += ('?markType='+markType);
	}
	
	util.getAjax(_url, true, function(data){
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
		
		
		util.openTips_btn([input_name, selects_html, select_types, input_remarks],function(){
			let craftId = $('.modal-body .craftId').val(),
				name = $('.modal-body .name').val(),
				remarks = $('.modal-body .remarks').val(),
				imageType = $('.modal-body .imageType').val();
			if( !craftId || !name || !imageType ){
				util.errorView('请填写相关参数', false);
				return;
			}
			$('#loading').fadeIn();
			let _url = window.kms_v2 + 'task/pack/createByHisPackId?packId=' + packId + '&craftId=' + craftId + '&name=' + name + '&remarks=' + remarks + '&createBy=' + user.username + '&imageType=' + imageType;
			util.postAjax(_url, true, function(data){
				$('#loading').fadeOut();
				if(data.code != '0'){
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

resultPreview.interfaceInit();

