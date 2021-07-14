
window.resultPreview = {
	form_html: [],
	formParam: [],
	searchParam: null
};

/*界面初始化执行函数*/
resultPreview.interfaceInit = function(){
	/*input框输入执行查询字典函数*/
	let last = null;
	$('.search_param').on('keyup', 'input.addr', function (event) {
		last = event.timeStamp;
		let code = event.keyCode,
			value = $('input.addr').val();
		if(value && (code == 13)){
			resultPreview.findDictionary(value);
		}else{
			setTimeout(function(){
				if(value && (last == event.timeStamp)){
					resultPreview.findDictionary(value);
				}
	        },500);
		}
	})
	
	/*选择字典候选项*/
	$('.input_select').on('click', 'li', function (event) {
		let value = event.target.getAttribute('data-val'),
			name = event.target.innerText;
		
		$('input.addr').val(name);
		$('.input_select').css('display', 'none');
	})
	
	/*查询数据*/
	$('.bodyInfo').on('click', 'button.search_btn', function(){
		resultPreview.findMarkResult();
	})
	
	/*导出数据*/
	$('.bodyInfo').on('click', 'button.export_btn', function(){
		resultPreview.exportMarkResult();
	})
	util.getSpecInfo( resultPreview.formCreateDom );
}

/*查询输入文字字典*/
resultPreview.findDictionary = function(value){
	let dictionary = [],
		_url = window.kms_v2 + 'base/addr/query?keyword='+value;
	util.getAjax(_url, true, function(data){
		var result = data.result || {},
			names = result.names || [];
		for(var s=0; s<names.length; s++){
			dictionary.push({
				'name': names[s],
				'value': names[s]
			})
		}
		let select_html = `
            ${dictionary.map(d => `
	            <li data-val="${d.value}" title="${d.name}">${d.name}</li>
            `).join('')}
		`;
		$('.input_select').html(select_html);
		$('.input_select').css('display', 'block');
	})
	
}

/*创建DOM-FORM表单节点*/
resultPreview.formCreateDom = function(){
	let data = window.spec;
	resultPreview.form_html = [];
	for(var i=0; i<data.length; i++){
		var _code = data[i].code,
			_values = data[i].values,
			_vals = [],
			_name = data[i].name,
			_url = data[i].url,
			_html = '';
		if(_url){
			
		}else if(_values){
			for(let _val in _values){
				_vals.push({
					'val': _val,
					'name': _values[_val]
				})
			}
			_html = `
				<div class='form_child'>
					<label title='${_name}'>${_name}：</label>
					<select class="form-control ${_code}">
			            <option value="">选择${_name}</option>
		                ${_vals.map(f => `
			            	<option value="${f.val}">${f.name}</option>
		                `).join('')}
		            </select>
				</div>
			
			`;
		}else{
			_html = `
				<div class='form_child'>
					<label title='${_name}'>${_name}：</label>
					<input type="text" class="form-control ${_code}" placeholder="${_name}" value="">
				</div>
			
			`;
		}
		
		resultPreview.form_html.push(_html);
	}
	var search_html = `
        ${resultPreview.form_html.map(f => `
        	${f}
        `).join('')}
        <div class="form_child">
        	<button class="btn btn-success search_btn">查询</button>
        	<button class="btn btn-success export_btn">导出</button>
		</div>
	`;
	$('.search_param').html(search_html);
	
	let _rect = $('input.addr')[0].getBoundingClientRect(),
		_top = _rect.height + _rect.top,
		_left = _rect.left,
		_width = _rect.width;
	$('.input_select').css({
		'top': _top,
		'left': _left,
		'width': _width
	})
}

/*查询标注成果*/
resultPreview.findMarkResult = function(value){
	resultPreview.searchParam = null;
	let table_html = `
		<table id="markResultTable" class="table table-bordered table-hover">
			
		</table>
	`;
	$('.search_body').html(table_html);
	var table = $("#markResultTable").DataTable({
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
        	let paramInfo = [];
			let param1 = {
			  	"page": {
				    "pageNo": page,
				    "pageSize": 10
			  	},
			  	"ops": []
			}
			for(let i=0; i<window.spec.length; i++){
				let _class = window.spec[i].code,
					_val = $('.search_param .'+_class).val();
				if(_val){
					paramInfo.push({
			            "code": _class,
			            "value": _val,
			            "name": window.spec[i].name,
					})
					param1.ops.push({
			            "k": _class,
			            "v": _val,
			            "op": "eq"
					})
				}
			}
			resultPreview.searchParam = param1;
			resultPreview.infoSummary(paramInfo);
			let _url = window.kms_v2 + 'mark/fruit/queryPage';
			util.postAjax(_url, param1, function(data){
				if(data.code != '0'){
					util.errorView(data.message);
					return;
				}
				console.log(data)
				let datas = data.result || {};
                let returnData = {};
                returnData.recordsTotal = datas.page.count || 0;
                returnData.recordsFiltered = datas.page.count || 0;
                returnData.data = datas.data || [];
            	callback(returnData);
			})
        },
        columns: [
	        { 
            	"data": "id" || "",
				"class": "id",
				"title": "ID"
           	},
	        { 
            	"data": "id" || "",
				"class": "markType",
              	"render": function ( data, type, row,  meta ) {
              		let data_text = '';
              		let markType = row.properties ? row.properties.markType : '';
              		let markTypes = window.spec.filter(function(results){
              			return results.code == 'markType';
              		})
              		if(markTypes.length){
              			data_text = markTypes[0].values[markType] || markType;
              		}
					return data_text;
				},
				"title": "标注类型"
           	},
	        { 
            	"data": "id" || "",
				"class": "impBatch",
              	"render": function ( data, type, row,  meta ) {
              		let impBatch = row.properties.impBatch || '';
					return impBatch;
				},
				"title": "导入批次ID"
           	},
	        { 
            	"data": "id" || "",
				"class": "craftId",
              	"render": function ( data, type, row,  meta ) {
              		let craftId = row.properties.craftId || '';
					return craftId;
				},
				"title": "工艺ID"
           	},
	        { 
            	"data": "id" || "",
				"class": "customerId",
              	"render": function ( data, type, row,  meta ) {
              		let customerId = row.properties.customerId || '';
					return customerId;
				},
				"title": "客户ID"
           	},
	        { 
            	"data": "id" || "",
				"class": "trackPointId",
              	"render": function ( data, type, row,  meta ) {
              		let trackPointId = row.properties.trackPointId || '';
					return trackPointId;
				},
				"title": "轨迹点ID"
			},
	        { 
            	"data": "id" || "",
				"class": "manage",
              	"render": function ( data, type, row,  meta ) {
					var btn_html = `
						<button class="btn btn-success openPreview">预览</button>
					`;
					return btn_html;
				},
				"title": "操作"
			}
        ]
	});
	
    $('#markResultTable tbody').on('click', 'tr td button.openPreview', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data();
    	resultPreview.openPreviews(data);
    });
	
}

/*导出数据*/
resultPreview.exportMarkResult = function(){
	if(!resultPreview.searchParam){
		util.errorView('当前列表无查询结果');
		return;
	}
	let _url = window.kms_v2 + 'mark/fruit/exp';
	util.postAjax(_url, resultPreview.searchParam, function(data){
		if(data.code != '0'){
			util.errorView(data.message);
			return;
		}
		let path = data.result.path || '',
			path_html = '导出路径：' + path;
		util.openTips_btn([path_html],function(){
			$('.testmodal .modal1').modal('hide');
		}, '获取导出路径')
	})
}

/*信息汇总*/
resultPreview.infoSummary = function(data){
	let _html = `
        ${data.map(f => `
			<p>
				<span>${f.name}： </span>
				<span>${f.value}</span>
			</p>
        `).join('')}
	`;
	$('.info_summary').html(_html);
}

/*预览成果数据*/
resultPreview.openPreviews = function(data){
	let _textarea = util.formatJson(data);
	let _img = window.kms_v2 + 'mark/file/getByMarkId?markId=' + data.id;
	let templ =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog">
				<div class="modal-content task-modal-content">
					<div class="modal-header" style="cursor: move;">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">成果预览</h4>
					</div>
					<div class="modal-body task-modal-body">
				    	<div class="image_result">
				    		<img src="${_img}" alt="成果预览">
				    	</div>
				    	<div class="info_result">
				    		<textarea class="textareaStatus">${_textarea}</textarea>
				    	</div>
	  				</div>
				</div>
			</div>
		</div>
	`;
	$('.devicemodal').html(templ);
	$('.devicemodal .modal').modal('show');
}

resultPreview.interfaceInit();

