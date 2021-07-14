//点击标注历史
$(".imgAccept").click(function(){
	$('.content-header h1').text('类型验收');
	imgAccept.createTasks = {};
	imgAccept.tagImage = [];
	imgAccept.Table();
	imgAccept.getTags();
})
//标注系统的历史列表--可以进行导出统计


var imgAccept = {
	
	imageIndex: 0,
	
//	tag类型对应的所有图片
	tagImage: [],
	
//	图片列表
	imageList: [],
	
//	质检环节提交
	taskCommit:{},
	
//	图片所存在的所有tag类型
	imageTag: {},
    
//	获取所有可选择的错误类型
    getTags: function(){
	    $.ajax( {
	        type : "get",
	        url : window.kms+'base/category/get',
	        async : true,
	        success : function(data) {
	        	imgAccept.imageTag = {};
	        	let result = data.result || [];
	        	for(var i=0; i<result.length; i++){
	        		var info = result[i].info,
	        			id = result[i].id,
	        			name = result[i].name;
	        		imgAccept.imageTag[id] = {
	        			'cn_names': {},
	        			'index': i,
	        			'name': name,
	        			'id': id
	        		}
		        	for(var s=0; s<info.length; s++){
		        		let info_list = info[s].list || null,
		        			info_list_id = info[s].id,
		        			info_list_name = info[s].name;
		        		if(info_list){
				        	for(var d=0; d<info_list.length; d++){
				        		info_list_id = info_list[d].id;
				        		info_list_name = info_list[d].tag;
				        		imgAccept.imageTag[id]['cn_names'][info_list_id] = info_list_name;
				        	}
		        		}else{
			        		imgAccept.imageTag[id]['cn_names'][info_list_id] = info_list_name;
		        		}
		        	}
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
    },
    
//	图像二次标注质检功能的模版
	Table: function(){
		
	    var test = ` 
	    	<div class="testmodal"></div>
			<img id="zoomImg" src="" style="display:none;" />
	        <div class="col-xs-12">
		        <div class="dataPath" style="width:100%;">
		            <!--<input type="text" id="input-path" class="form-control" placeholder="图片目录" onfocus="this.placeholder=''" onblur="this.placeholder='文件目录'" />-->
		            	
					<!--<button type="button" id="open-path" onclick="imgMain.openPath()" class="btn btn-info" title="打开目录">打开目录</button>-->
					
					<!--<button type="button" id="export-path" onclick="imgMain.downExport()" class="btn btn-warning" title="导出文件">导出文件</button>-->
					<button type="button" id="claimTask" class="btn btn-warning" title="领取任务" style="float:left;">领取任务</button>
					<button type="button" id="gainTask" class="btn btn-info" title="获取验收任务" style="float:left;margin-left:10px;">获取验收任务</button>
		    		
			        <div class="searchType" style="float:left;margin-left:10px;">
			        	
			        </div>
		        </div>
		        <!--左侧图片-->
	        	<div class="box box-info">
	    			<div class="box-body">
	    			
	    			</div>
	    		</div>
	    	</div>
	    `;
	    
	    $('.content.container-fluid').html(test);
	    
//      批量领取任务
        $('#claimTask').click(function () {
        	imgAccept.receiveTasks();
        });
//      获取所有任务
        $('#gainTask').click(function () {
        	imgAccept.openPath();
        });
//      切换下拉框选项
        $('.searchType').on('change', 'select', function () {
			imgAccept.searchTag();
	    });
//      提交所有质检任务
        $('.box.box-info .box-body').on('click', 'button#submitTag', function () {
        	imgAccept.submitTag();
	    });
		imgAccept.imageTable();
	},
	
//	所有图片展示,找出错误图片
	imageTable: function(arr=imgAccept.tagImage){
		var imageModel = `
			<div class="body-left-header">
				<h4 class="img-title" style="float:left;">图片名称</h4>
				<button type="button" id="submitTag" class="btn btn-success" title="提交验收" style="float:right;">提交验收</button>
			</div>
			
			<div class="body-left-body">
			    <table id="tableCheck" class="table table-bordered">
		            <thead>
		                <tr>
			                <th>类型验收图像列表</th>
		                </tr>
		            </thead>
			    </table>
			</div>
		`;
	    $('.content.container-fluid .box.box-info .box-body').html(imageModel);
	    
//		初始化当前任务列表(列表的属性与属性值)
	    var table = $("#tableCheck").DataTable({
	    	'language'		: window.lang,
	        'searching'		: false,								//原生搜索
	        'paging'		: true,
	        'lengthChange'	: false,
	        'ordering'		: false,
	        'info'			: true,
	        'autoWidth'		: false,
	        'scrollY'		: 600,
	        'scrollCollapse': true,
	        'aaSorting'		: false,
	        "lengthMenu"	: [50],
//	        'processing'	: true,  								//隐藏加载提示,自行处理
	        'serverSide'	: false,  								//启用服务器端分页
//	        'order'			: [0,'desc'],  						//取消默认排序查询,否则复选框一列会出现小箭头
	        ajax: function (data, callback, settings) {
	            param1.limit = 9;								//页面显示记录条数，在页面显示每页显示多少项的时候
	            param1.start = data.start;						//开始的记录序号
	            param1.page = (data.start / data.length)+1;		//当前页码
				
                var returnData = {};
                returnData.recordsTotal = arr.length;				//返回数据全部记录
                returnData.recordsFiltered = arr.length;				//后台不实现过滤功能，每次查询均视作全部结果
                returnData.data = arr;							//返回的数据列表
                callback(returnData);
	       	},
//			当前任务列表显示数据处理
	        columns: [
//      		第一列----任务的taskId---显示
	            { 
	            	"data": "id",
	              	"render": function ( data, type, row,  meta ) {
		    			let activitiTaskId = row.activitiTaskId,
		    				id = row.taskInfo.id || row.activitiTaskId,
		    				property = row.taskInfo.property || {},
		    				ifRepair = property.ifRepair || 'false',			//true-打回；false-通过
		    				selectTrue = (ifRepair == 'false') ? 'selected' : '',
		    				selectFalse = (ifRepair == 'false') ? '' : 'selected',
		    				image_url = window.kms_v2 + 'org/file/getByOrgId?orgId=' + row.taskInfo.orgId,
		    				title_name = '';
		    			
						var centerModel = `
							<div class="${activitiTaskId}">
								<h3>
									<span class="task_header" title="${id}">${id}</span>
									<select class="form-control passFlagSelect">
							            <option value="false" ${selectTrue}>通过</option>
							            <option value="true" ${selectFalse}>打回</option>
						            </select>
								</h3>
								<img src="${image_url}" alt="${id}(${title_name})" title="鼠标悬浮超过2s可预览大图">
							</div>
							
						`;
						
						return centerModel;
					},
					"class":"center"
	            }
	        ]
	    });
	    $('#tableCheck tbody').on('change', 'select.passFlagSelect', function (e) {
			var tr = $(this).closest('tr'),
	        	row = table.row( tr ),
    			data = row.data(),
    			activitiTaskId = data.activitiTaskId,
    			checked = e.target.value;
    		
    		for(let i=0; i<imgAccept.tagImage.length; i++){
    			if(imgAccept.tagImage[i].activitiTaskId == activitiTaskId){
    				imgAccept.tagImage[i].taskInfo.property['ifRepair'] = checked;
    			}
    		}
	    });
//		鼠标滑上放大类型质检图像
		$(".center img").hover(function(e){
			var dom = {
				"title": this.src
			};
			hoverTimer = setTimeout(function(){
				Zooms.zoomIn(dom);
			},2000)
		},function(){
			clearTimeout(hoverTimer);
		});
//		点击关闭类型质检图像
		$("#zoomImg").click(function(){
			$("#zoomImg").fadeOut(100);
		});
	},

//	批量领取任务
	receiveTasks: function(){
		$("#loading").css("display","block");
//		获取对应图片路径的所有图片列表
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/operation/claimTasks?markType=3&user='+user.username,
	        async : true,
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(data.result){
	        		var length = data.result.activitiTaskIds.length;
	        		util.errorView("此次领取了"+length+"个任务",true);
	        	}else{
	        		util.errorView(data.message);
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	获取任务时,获取目录之中的所有图片
	openPath: function(){
	    $(".searchType").html('');
		$("#loading").css("display","block");
//		获取对应图片路径的所有图片列表
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/operation/getMyMarkTasks?user=' +user.username,
	        async : true,
	        success : function(data) {
				$("#loading").css("display","none");
	        	if(data.code != '0'){
					util.errorView(data.message);
					return;
	        	}
	        	if(!data.result.activitiTaskInfos.length){
					util.errorView('当前用户下无任务');
					return;
	        	}
				
	        	imgAccept.tagImage = (data.result && data.result.activitiTaskInfos) ? data.result.activitiTaskInfos : [];
	        	
				imgAccept.imageTable();
				
	        	let imgArr = [],
	        		imgObj = {};
	        	for(let i=0; i<imgAccept.tagImage.length; i++){
	        		let activitiTaskId = imgAccept.tagImage[i].activitiTaskId,
	        			property = imgAccept.tagImage[i].taskInfo.property || {};
	        		
	        		for(let property_id in property){
	        			if(imgAccept.imageTag[property_id]){
			        		let property_val = property[property_id],
			        			cn_names = imgAccept.imageTag[property_id].cn_names,
			        			property_name = cn_names[property_val] || '不识别',
			        			name = imgAccept.imageTag[property_id].name,
			        			index = imgAccept.imageTag[property_id].index;
		        			if(!imgArr[index]){
		        				imgObj[index] = {};
				        		imgArr[index] = {
				        			'id': property_id,
				        			'name': name,
				        			'list': []
				        		}
		        			}
		        			if(!imgObj[index][property_val]){
		        				imgObj[index][property_val] = true;
			        			imgArr[index].list.push({
				        			"id" : property_val,
				        			"tag" : property_name
			        			})
		        			}
		        		}
	        		}
	        	}
	        	
	        	var searchTag = `
	                ${imgArr.map(d => `
						<select class="form-control ${d.id}" data-id="${d.id}" style="width:200px;float:left;margin-right:10px;">
				            <option class="change" value="">过滤${d.name}类型任务</option>
			                ${d.list.map(f => `
						        <option class="change" value="${f.id}">${f.tag}</option>
			                `).join('')}
			            </select>
	                `).join('')}
	        	`;
	        	$(".searchType").html(searchTag);
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	提交质检环节的任务
	submitTag: function(){
		$("#loading").css("display","block");
		let _json = {
			'activitiTaskIdList': [],
			'taskInfoList': []
		}
		for(let i=0; i<imgAccept.tagImage.length; i++){
			let info = imgAccept.tagImage[i].taskInfo,
				id = imgAccept.tagImage[i].activitiTaskId;
			if(!info.property.ifRepair){
				imgAccept.tagImage[i].taskInfo.property.ifRepair = 'false';
			}
			_json.activitiTaskIdList.push(id);
			_json.taskInfoList.push(info);
		}
//		获取对应图片路径的所有图片列表
	    $.ajax( {
	        type : "post",
	        url : window.kms+'task/operation/commitCheckOrAcceptTasks?user='+user.username,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_json),
	        success : function(data) {
				$("#loading").css("display","none");
				if( (data.code==0) || (data.code=="0") ){
					util.errorView("提交成功",true);
					imgAccept.imageTable([]);
	    			$(".searchType").html('');
				}else{
					util.errorView(data.message);
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	图片是否通过的切换选择
	passFlag: function(taskId){
		var value = $("."+taskId+" select option:selected").val();
		if( (value=="false") || !value ){
			imgAccept.taskCommit[taskId].passFlag = false;
		}else{
			imgAccept.taskCommit[taskId].passFlag = true;
		}
	},
	
//	更换错标注类型时,更改图片数据
	searchTag: function(){
		let data = [],
			ids = {},
			select_dom = $(".searchType select"),
			select_val = {};
		for(let d=0; d<imgAccept.tagImage.length; d++){
			let property = imgAccept.tagImage[d].taskInfo.property,
				activitiTaskId = imgAccept.tagImage[d].activitiTaskId,
				type = true;
			
			for(let i=0; i<select_dom.length; i++){
				let data_id = select_dom[i].getAttribute('data-id'),
					property_val = property[data_id],
					data_val = select_dom[i].value;
				
				if(data_val && (data_val != property_val)){
					type = false;
				}
			}
			if(type && !ids[activitiTaskId]){
				ids[activitiTaskId] = true;
				data.push(
					imgAccept.tagImage[d]
				)
			}
		}
		
		imgAccept.imageTable(data);
	}
}
