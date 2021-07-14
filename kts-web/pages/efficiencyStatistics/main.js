
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
		let pacId = $('.packId').val();
		if(!pacId){
			util.errorView('任务包ID不能为空');
			return;
		}
		resultPreview.findMarkResult(pacId);
	})
	
	/*导出数据*/
	$('.bodyInfo').on('click', 'button.export_btn', function(){
		resultPreview.exportMarkResult();
	})
	
	var packId = window.location.search.split('=')[1];
	if(packId){
		$('.packId').val(packId);
		resultPreview.findMarkResult(packId);
	}
	
	
//	util.getSpecInfo( resultPreview.formCreateDom );
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
resultPreview.findMarkResult = function(pacId){
	resultPreview.searchParam = null;
	let table_html = `
		<div id='main_ooo'>
			
		</div>
	`;
	$('.search_body').html(table_html);
	let myChart = echarts.init(document.getElementById('main_ooo'));
	let _url = window.kms_v2 + 'stat?pacId='+pacId;
	util.getAjax(_url, true, function(data){
		if(data.code != '0'){
			util.errorView(data.message);
			return;
		}
		let datas = data.result;
		let elementsTotal = datas.elementsTotal || 0,
			markUseTimesTotal = datas.markUseTimesTotal || 0,
			timeTotal = Math.floor( markUseTimesTotal / 1000 ),
			newnp = (timeTotal / elementsTotal) || 0 ,
			np = newnp.toFixed(2);
		
		let title = `
			要素总量为 ${elementsTotal} 个<br/>
			要素总耗时为 ${timeTotal} 秒<br/>
			要素平均耗时为 ${np} 秒/个
		`;
		$('.info_summary').html(title);
		
	    // 基于准备好的dom，初始化echarts实例
	
	    // 指定图表的配置项和数据
	    var options = {
		    title: {
		        text: '效率统计',
		        subtext: ''
		    },
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'shadow'
		        }
		    },
		    legend: {
		        data: ['要素数量']
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: {
		        type: 'value',
		        boundaryGap: [0, 0.01]
		    },
		    yAxis: {
		        type: 'category',
		        data: []
		    },
		    series: [
		        {
		            name: '要素数量',
		            type: 'bar',
		            barMaxWidth: 50,
		            data: []
		        }
		    ]
		};
		
		for(let i=0; i<datas.detail.length; i++){
			options.yAxis.data.push(
				datas.detail[i].name
			)
			options.series[0].data.push(
				datas.detail[i].sum
			)
		}
	
	    // 使用刚指定的配置项和数据显示图表。
	    myChart.setOption(options);
	})
	
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

