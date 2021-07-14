
window.resultPreview = {
	form_html: []
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
	
	$('.devicemodal').on('click', '.modal button', function (event) {
		$('.devicemodal .craftLists').modal('hide');
	})
	
//	$('.createBtn').click(function(){
//		resultPreview.createCraft();
//	})
	
	/*选择字典候选项*/
	$('.input_select').on('click', 'li', function (event) {
		let value = event.target.getAttribute('data-val'),
			name = event.target.innerText;
		
		$('input.addr').val(name);
		$('.input_select').css('display', 'none');
	})
	util.getSpecInfo(
		resultPreview.findResultData
	);
}

/*查询数据*/
resultPreview.findResultData = function(){
	let _table = `
		<table id="baseCraftList" class="table table-bordered table-hover">
			
		</table>
	`;
	$('.bodyTable').html(_table);
	
	var table = $("#baseCraftList").DataTable({
    	'language'    : window.lang,
        'searching'   : false,								//原生搜索
        'paging'      : true,
        'lengthChange': false,
        'ordering'    : false,
        'info'        : true,
        'autoWidth'   : false,
//      "lengthMenu"  : [10],
        "aaSorting"	  : false,
    	'processing'  : true,  								//隐藏加载提示,自行处理
    	'serverSide'  : true,  								//启用服务器端分页
        ajax: function (data, callback, settings) {
            let pageNo = (data.start / data.length)+1;
			let param1 = {
			  	"page": {
				    "pageNo": pageNo,
				    "pageSize": 10
			  	}
			}
			let _url = window.kms_v2 + 'base/craft/queryPage';
			util.postAjax(_url, param1, function(data){
				if(data.code != '0'){
					util.errorView(data.message);
					return;
				}
                var returnData = {};
                returnData.recordsTotal = data.result.page.count;
                returnData.recordsFiltered = data.result.page.count;
                returnData.data = data.result.data || [];
            	callback(returnData);
			})
        },
        columns: [
	        { 
            	"data": "craftId",
				"class": "craftId",
				"title": "工艺ID"
           	},
	        { 
            	"data": "markType",
				"class": "markType",
              	"render": function ( data, type, row,  meta ) {
              		let data_text = data;
              		let markTypes = window.spec.filter(function(results){
              			return results.code == 'markType';
              		})
              		if(markTypes.length){
              			data_text = markTypes[0].values[data] || data;
              		}
					return data_text;
				},
				"title": "标注类型"
           	},
	        { 
            	"data": "markSubType",
				"class": "markSubType",
				"title": "标注子类型"
           	},
	        { 
            	"data": "desc",
				"class": "desc",
				"title": "描述"
           	},
	        { 
            	"data": "craftId",
				"class": "operation",
              	"render": function ( data, type, row,  meta ) {
					var btn_html = `
						<button class="btn btn-warning craft_info">详情</button>
					`;
					return btn_html;
				},
				"title": "颜色"
			}
	        /*{ 
            	"data": "id",
				"class": "ids",
				"title": "ID"
           	},
	        { 
            	"data": "name",
				"class": "names",
				"title": "NAME"
           	},
	        { 
            	"data": "color",
				"class": "colors",
				"title": "COLOR"
			},
	        { 
            	"data": "color",
				"class": "bgs",
              	"render": function ( data, type, row,  meta ) {
              		let bgs = data.split('x'),
              			bg = bgs[1] ? ('#' + bgs[1]) : '#FFFFFF';
					var bg_html = `
						<span class="bgs_child" style="background-color:${bg}"></span>
					`;
					return bg_html;
				},
				"title": "颜色"
			}*/
        ]
	});
    $('#baseCraftList tbody').on('click', 'tr td button.craft_info', function (e) {
		var tr = $(this).closest('tr'),
        	row = table.row( tr ),
			data = row.data();
    	
    	resultPreview.findFormsData(data);
    });
}

/*工艺详情获取*/
resultPreview.findFormsData = function(data){
	let _url = window.kms_v2 + 'base/craft/get?craftId=' + data.craftId;
	util.getAjax(_url, true, function(data){
		if(data.code != '0'){
			util.errorView('工艺详情获取失败');
			return;
		}
		let datas = (data.result.craft && data.result.craft.labels) ? data.result.craft.labels : [],
			crafts = data.result.craft;
		if(!datas.length && !crafts.length){
			util.errorView('当前工艺详情查询结果为空');
			return;
		}
		if(!datas.length && crafts.length){
			resultPreview.getCraftListsMark(crafts);
		}else{
			resultPreview.getCraftLists(datas);
		}
	})
}

/*工艺详情-二次分类类别展示*/
resultPreview.getCraftListsMark = function(result){
	let meshString = util.formatJson(result);
	let _html = `
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="height:730px;width:650px;top:100px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header" style="height:50px;">
						<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" >
							<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
						</button>
						<h4 class="modal-title" style="overflow: hidden;white-space: nowrap;max-width: 650px;">工艺详情</h4>
					</div>
		    		<div id="trackChange" style="overflow:inherit;"></div>
					<div class="modal-body task-modal-body" style="padding:0px;width:100%;">
					    <textarea class="copyText" style="width:100%; height:100%;resize:none;float:left;">${meshString}</textarea>
					</div>
				</div>
			</div>
		</div>
	`;
	
	$('.devicemodal').html(_html);
	$('.devicemodal .modal').modal('show');
}

/*工艺详情展示*/
resultPreview.getCraftLists = function(result){
	let _html = `
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog" style="height:730px;width:650px;top:100px;">
				<div class="modal-content task-modal-content">
					<div class="modal-header" style="height:50px;">
						<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" >
							<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
						</button>
						<h4 class="modal-title" style="overflow: hidden;white-space: nowrap;max-width: 650px;">工艺详情</h4>
					</div>
		    		<div id="trackChange" style="overflow:inherit;"></div>
					<div class="modal-body task-modal-body" style="padding:0px;width:100%;">
					    <table id="craftListsTable" class="table table-bordered table-hover">
				            
					    </table>
					</div>
				</div>
			</div>
		</div>
	`;
	
	$('.devicemodal').html(_html);
	$('.devicemodal .modal').modal('show');
	setTimeout(function(){
		var table = $("#craftListsTable").DataTable({
	    	'language'		: window.lang,
	        'searching'		: false,								//原生搜索
	        'paging'		: true,
	        'lengthChange'	: false,
	        'ordering'		: false,
	        'info'			: true,
	        'autoWidth'		: false,
	        'scrollY'		: 550,
	        'scrollCollapse': true,
	        "lengthMenu"	: [500],
	        'aaSorting'		: false,
	        'bRetrieve'		: true,									//如果表格已经被初始化，该参数会直接返回已经被创建的对象
	        'serverSide'	: false,  								//启用服务器端分页
	        ajax: function (data, callback, settings) {
	            var returnData = {};
	            returnData.recordsTotal = result.length;
	            returnData.recordsFiltered = result.length;
	            returnData.data = result;
	        	callback(returnData);
	        },
	        columns: [
		        { 
	            	"data": "id",
					"class": "ids",
					"title": "ID"
	           	},
		        { 
	            	"data": "name",
					"class": "names",
					"title": "NAME"
	           	},
		        { 
	            	"data": "color",
					"class": "colors",
					"title": "COLOR"
				},
		        { 
	            	"data": "color",
					"class": "bgs",
	              	"render": function ( data, type, row,  meta ) {
	              		let bgs = data.split('x'),
	              			bg = bgs[1] ? ('#' + bgs[1]) : '#FFFFFF';
						var bg_html = `
							<span class="bgs_child" style="background-color:${bg}"></span>
						`;
						return bg_html;
					},
					"title": "颜色"
				}
	        ]
		});
	}, 300)
}

/*获取标注规格*/
resultPreview.getSpecInfo = function(){
	let _url = window.kms_v2 + 'base/craft/get?craftId=' + data.craftId;
	util.getAjax(_url, true, function(data){
		if(data.code != '0'){
			util.errorView('工艺详情获取失败');
			return;
		}
		let datas = (data.result.craft && data.result.craft.labels) ? data.result.craft.labels : [];
		if(!datas.length){
			util.errorView('当前工艺详情查询结果为空');
			return;
		}
		resultPreview.getCraftLists(datas);
	})
}


resultPreview.interfaceInit();

