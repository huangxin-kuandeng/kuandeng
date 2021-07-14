/*
 * 创建任务
 */

var sourceTrackLength,			//所有选中的多选轨迹段
	dataArr,					//获取到的所有流程选项
	processDefinitionId1,		//选中的流程对应id
	selectVal,					//流程所对应的value值(创建任务需要的)
	selectName,					//流程的名称
	sourceVal,					//来源任务的taskid
	sourceName,					//来源任务的名称
	_tempGeo,					//区域绘制的范围
	polygonId,					//绘制范围的id(删除面需要)
	//流程类型选择确认
	formProperties = [],		//流程数据来源为string值时，input表单
	formPropertiesSelect = [],	//流程数据来源为boolean值时，下拉列表
	formProperties1 = [],
	sourceTrackArr = {},		//流程的数据内存在选择轨迹段的类
	sourceTrackArr1 = [],		//获取所有的轨迹段
	formBtn = [],				//流程的数据内存在button类型的数据
	SceneData = [],				//场景
	TaskIdStr = "",				//选择过的来源任务
	batchVal = "",				//选择过的来源任务批次号
	TaskLength = null,			//选择过的来源任务数量
	taskIds = [],
	mapElementArr = [],			//地图要素
	mapElementData = [],
	mapElementForm = [],
	mapElementModel = "",			//地图要素模板
	sourceTrackId = '',				//提交任务时所提交的轨迹段字符串
	sourceTrackSegmentId,			//切割后的轨迹段
	ftpData = [],				//ftp的参数
	tagType = [],				//标注类型是否存在
	priority = [],				//任务优先级是否存在
	param1 = {},				//创建一个新的集合来储存数据
	ftpJunge = false,			//判断是否可以选择ftp
	ftpJson = {
		"ftpIp" : "192.168.5.34",
		"ftpPort" : "21",
		"ftpPath" : "/",
		"ftpUsername" : "kduser",
		"ftpPassword" : "kd123",
		"dataPath" : "/data/leipeng/ftptest/data/kduser"
	};	
	
	
var createTasks = {
	
	requiredForm:{},
	
	addForm:[
		{
			"name": "色板信息",
			"id" : "ROADELEMENT",
			"required" : true,
			"value" : "",
			"type": "string"
		},
		{
			"name": "数据来源",
			"id" : "SOURCE",
			"required" : true,
			"value" : "",
			"type": "select",
			"data":[
				{
					"name": "在线导入",
					"value": "0"
				},
				{
					"name": "离线导入",
					"value": "1"
				},
				{
					"name": "人工挑图",
					"value": "2"
				}
			]
		},
		{
			"name": "作者信息",
			"id" : "AUTHOR",
			"required" : true,
			"value" : "",
			"type": "string"
		},
		{
			"name": "标注种类",
			"id" : "ANNOTYPE",
			"required" : true,
			"value" : "",
			"type": "select",
			"data":[
				{
					"name": "数据标注",
					"value": "0"
				},
				{
					"name": "返工标注",
					"value": "1"
				},
				{
					"name": "二次返工",
					"value": "2"
				}
			]
		},
		{
			"name": "数据种类",
			"id" : "DATAKIND",
			"required" : true,
			"value" : "",
			"type": "select",
			"data":[
				{
					"name": "正式数据",
					"value": "0"
				},
				{
					"name": "测试数据",
					"value": "1"
				}
			]
		},
		{
			"name": "城市",
			"id" : "CITY",
			"required" : true,
			"value" : "",
			"type": "string"
		}
	],
	
	category: null,					//判断流程类型
	
	sourceTasks: null,
	
	mouseTime: null,
	
	taskBatchList: {},						//融合任务的批次
	
	taskRecogList: {},						//标注最终选择的识别任务的批次
	
	compareBatchList: {},					//对比任务的批次
	
//	标注类型
	tagTypes: [
		{
			"name" : "车道线",
			"value" : "lane"
		},
//		{
//			"name" : "路牌",
//			"value" : "trafficSign"
//		},
//		{
//			"name" : "灯杆",
//			"value" : "pole"
//		}
	],
	
//	优先级
	prioritys: [
		{
			"name" : "高",
			"value" : "3"
		},
		{
			"name" : "中",
			"value" : "2"
		},
		{
			"name" : "低",
			"value" : "1"
		}
	],
	
//	创建新任务功能
	createTask: function(){
		sourceTrackLength = '';					//清空之前的数据
	    createTasks.createTaskModale();				//触发增加dom节点模版
	    createTasks.createMap();					//触发增加map地图模版    
//	    createTasks.onChange();						//已绘制的区域显示
	},

	
//	创建任务时的dom节点模版
	createTaskModale: function(){
//		创建任务的模版选型
		_tempGeo='';
		let templ =`
		<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
			<div class="modal-dialog task-dialog">
				<div class="modal-content task-modal-content">
					<div class="modal-header" style="cursor: move;">
	    				<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose()">
	    					<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	    				</button>
						<h4 class="modal-title">创建任务</h4>
					</div>
					<div class="modal-body task-modal-body">
				    <div id="id-container" class="map-content"></div>
				    <div class="right-content">
						<form id='taskForm2' class="form-horizontal">
	      					<div class="box-body">
	      					
	      						<!--请输入名称-->
	        					<div class="form-group" style="margin-bottom:10px;">
	          						<label for="inputName3" class="col-sm-5 control-label">名称:</label>
	          						<div class="col-sm-7">
	            						<input type="text" class="form-control" id="inputName3" placeholder="请输入名称" onfocus="this.placeholder=''" onblur="this.placeholder='请输入名称'">
	          						</div>
	        					</div>
	        					
	        					<!--选择流程-->
								<div class="form-group" style="margin-bottom:10px;">
				                  	<label for="inputName3" class="col-sm-5 control-label">流程:</label>
				                  	<div class="col-sm-7">
				                  		<button type="button" class="btn btn-default" id="inputRange4" onclick="createTasks.createTaskModale1()">选择流程</button>
	          						</div>
	        					</div>
	        					
	          				</div>
	      					<!-- /.box-body -->
	      					<div class="box-footer">
				                <button type="button" class="btn btn-default" title="取消" onclick="main.modalClose()">取消</button>
				                <button type="button" class="btn btn-info pull-right" title="提交" onclick="createTasks.submitFun()">提交</button>
	      					</div>
	      					
	      				<!-- /.box-footer -->
	    				</form>
	  				</div>
				</div>
				<div class="ModalChange"></div>
				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>
		<!-- /.modal -->`
		$('.testmodal').html(templ);
	
//		鼠标拖拽效果(创建任务的窗口拖动效果)
		var moveHere=$("#modal-default .task-dialog .modal-content .modal-header")[0];  
		var wrap=$("#modal-default .task-dialog .modal-content")[0];
//		鼠标拖拽----按下
		moveHere.onmousedown = function(event){  
		    event=event||window.event;  
		    var disx = event.clientX-wrap.offsetLeft;  
		    var disy = event.clientY-wrap.offsetTop;  
//			鼠标拖拽----移动
		    document.onmousemove = function(event){  
		        event=event||window.event;  
		        move(event,disx,disy);  
		    }     
		}  
//		鼠标拖拽----移动
		function move(event,disx,disy){  
		    var x = event.clientX-disx;  
		    var y = event.clientY-disy;
		    
		    wrap.style.marginLeft=x+"px";  
		    wrap.style.marginTop=y+"px";  
		    
		}  
//		鼠标拖拽----抬起
		moveHere.onmouseup = function(){  
		    document.onmousemove=null;  
		    document.onmouseup=null;  
		}
//		输入框--回车键触发地域搜索功能
		$("#inputName4").eq(0).keydown(function(e) {
			var ev = document.all ? window.event : e;
			if(ev.keyCode==13) {
				createTasks.search();
			}
		});
	},
	
//	增加map地图模版 
	createMap: function(){
	    var opt = {
	        ui: {panel: false, bar: false, zoom: true, titlelayer: false},			//对应UI显示或隐藏
	        center: [116.374145, 39.907218],
	        zoom: 16,
	        wkt:true,
//	        maxZoom: 19,
//	        minZoom: 25,
//	        editableLevel: 16,
	        loadPanorama: true,
	        cache: true,
//	        serverUrl : 'http://10.17.131.231:25001/api-server/gds/simple',
	        serverUrl : 'http://192.168.120.24:18016/gds-web',
	        searchUrl : 'http://apis.mapabc.com/gss/simple?key=d111175e022c19f447895ad6b72ff259552d1b38ec6f097469186c976bc1937d11c918cbad3b0a18'
	    }
	    window.editor = new MapEditor('id-container', opt);				//面板实例化初始化操作
		
//		地图底图使用街道
	    var Map = new TileLayer({
	        "name": "google",
	        "type": "tms",
//	      	"type": "tMap",
	        "description": "google map",
//	      	"url": "https://khms0.googleapis.com/kh?v=744&hl=zh-CN&x={x}&y={y}&z={z}",
	        "url": "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//	        "url": "http://192.168.5.34:4007/{z}/{x}/{y}.png",
	        "zooms": [0, 22],
	        "id": "Map",
	        "order": 3,
	        "visible": true,
	        "isOverlay": false
	    });
	    editor.addTileLayer(Map);
	    
	    /*
	     * 临时解决，使用地图移入事件，因为地图初始化完成事件无法触发
	     * 解决地图初始化后，鼠标工具绘制处不正确问题。
	     */
	    window.editor.addListener("hover", function() {
	   		window.editor.context.map().dimensions(window.editor.context.map().dimensions());
	    })
	},

//	已绘制的区域显示
	onChange: function(){
	    var urlChange = window.kms+'runtime/tasks?includeProcessVariables=true&size=100000&start=0&taskDefinitionKey=ManualEdit';
	    var Coordinate = [];
		var style = {"fill": "white",'opacity':'0.5',"stroke": 'black',"stroke-width" : 3};
		var dataTaskName;
		
//		处理后获得的经纬度
	    $.ajax( {
	        type : "get",
	        url : urlChange,
	        async : false,
	        success : function(data) {
	        	dataTaskName = data.data;
	        	for(var i=0; i<data.data.length; i++){
	        		for(var l=0; l<data.data[i].variables.length; l++){
	        			if(data.data[i].variables[l].name == "range"){
							var replaces = data.data[i].variables[l].value.replace("POLYGON ((","").replace("))","");
							replaces.split(", ")
			        		Coordinate.push(replaces);
	        			}
	        		}
	        	}
	        }
	    })
		var locs = [];
	    for(var s=0; s<Coordinate.length; s++){
			var strs = Coordinate[s].split(", "); 			//字符分割 
			var strs1 = [];
			for(var i=0; i<strs.length; i++){
				var strs2 = strs[i].split(" ");
				var loc = []; 								//定义一数组 
				for(var l=0; l<strs2.length; l++){
					loc.push( Number(strs2[l]) );
				}
				strs1.push(loc);
			}
			locs.push(strs1);
	    }
		
//		已绘制的区域显示
		for(var l=0; l<locs.length; l++){
			var locs1 = locs[l];
			var nodes = [];
			var dataTaskName1;
			for(var i=0; i<locs1.length; i++){
				nodes.push( new Point({ loc : locs1[i] }) );
			}
			
			for(var i=0; i<dataTaskName[l].variables.length; i++){
				if(dataTaskName[l].variables[i].name == "taskName"){
//					console.log(dataTaskName[l].variables[i].value);
					dataTaskName1 = dataTaskName[l];
				}
			}
//			绘制面
			var polygon = new Polygon({
				nodes : nodes ,
				mode: 'polygon',
	            onDraw : function (element){
	               	element.style(style);
	            },
	            tags: {dataTaskName1},
			});
			editor.context.map().addOverlays(polygon);
		}
	},
	
//	流程选择功能
	createTaskModale1: function(){
		var hoverTimer = null;
		createTasks.taskBatchList = {};
		createTasks.taskRecogList = {};
		var url = window.kms+"repository/process-definitions?latest=true&startableByUser="+user.username+"&size=1000&suspended=false";
//		var url = "http://192.168.5.34:33320/kms/repository/process-definitions?latest=true&startableByUser="+user.username+"&size=1000&suspended=false";
		
//		将获取到的流程展示出来
	    $.ajax( {
	        type : "get",
	        url : url,
	        async : true,
	        success : function(data) {
	            dataArr = data.data;
	            if(!dataArr){
	            	util.errorView(data.message);
	            	return;
	            }
//				将图片数据增加上
	            for(var i=0; i<dataArr.length; i++){
	            	dataArr[i].url = dataArr[i].url+"/image";
	            }
//          	可以选择的流程列表-----以及流程效果图预览
				var temps2 = `
					<div class="modals1">
						<div class="modal-header">
				        	<button type="button" class="close" title="关闭" onclick="main.modalClose1()">
				        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
				        	</button>
				   	 		 <h4 class="modal-title">选择流程</h4>
						</div>
						<div class="modal-body task-modal-body">
							<div class="top-body">
								<div class="row">
									${dataArr.map(s => `
										<div class="selectImage col-md-4">
											<image class="${s.key}" title="${s.name}" src="${s.url}" alt="${s.name}" />
											<p class="${s.id}" title="${s.category}">${s.name}</p>
										</div>
						            `).join('')}
								</div>
							</div>
						</div>
					</div>
				`;
			    $(".ModalChange").html(temps2);
			
//				假如已经选择过流程,记住所选择过的流程  并展示出来
	            for(var i=0; i<dataArr.length; i++){
			    	if($(".right-content #inputRange4").text() == dataArr[i].name){
		            	$(".selectImage")[i].style.borderColor = "blue";
				    }
		    	}
//          	选择相对应的流程图
	            $(".selectImage").click(function(){
	            	selectVal = this.children[0].className;
	            	selectName = this.children[1].innerHTML;
	            	processDefinitionId1 = this.children[1].className;
	            	createTasks.category = this.children[1].title;
	            	createTasks.selectSubmit();
				})
				
				var xOffset = 10;
				var yOffset = 200;
				
//				创建任务时,选择流程---流程图片划上会触发图片预览的功能
				$(".selectImage img").hover(function(e){
//					debugger
					this.t = this.title;
					this.title = "";
					var c = (this.t != "") ? "<br/>" + this.t : "";
					var src = this.src;
					hoverTimer = setTimeout(function(){
						$(".modals1").append("<div id='selectImage'><img src='"+ src +"' alt='"+ this.t +"' />"+ c +"</div>");								 
						if(e.pageY > 520){
							e.pageY = 200;
						}
						$("#selectImage")
							.css("top",(e.pageY - xOffset) + "px")
							.css("left","125px")
//							.css("left",yOffset + "px")
							.fadeIn("fast");
					},1000)
			    },
				function(){
					clearTimeout(hoverTimer);
					this.title = this.t;
					$("#selectImage").remove();
			    });	
			    
//				鼠标移动时,修改预览图片的位置效果
				$(".selectImage img").mousemove(function(e){
					if(e.pageY > 500){
						e.pageY = 200;
					}
					$("#selectImage")
						.css("top",(e.pageY - xOffset) + "px")
						.css("left","125px");
//						.css("left",yOffset + "px");
				});
	    	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
		});
	},

//	选择对应来源任务taskId  事件
	taskchoise: function(idName){
//		自动处理任务的选择项
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/sourceTasks?processDefinitionKey='+selectVal,
	        async : false,
	        data : {},
	        success : function(data) {
	        	sourceTrackArr1 = data.result.result;
	        	createTasks.sourceTasks = {};
	        	for(var i=0; i<sourceTrackArr1.length; i++){
	        		var taskId = sourceTrackArr1[i].taskId;
	        		var taskName = sourceTrackArr1[i].taskName || '';
	        		sourceTrackArr1[i]["taskId"] = taskId;
	        		sourceTrackArr1[i]["taskName"] = taskName;
	        		createTasks.sourceTasks[taskId] = sourceTrackArr1[i];
	        	}
	        	var h4 = "选择对应任务";
	        	var TaskTempList = `
	                ${sourceTrackArr1.map(s => `
						<label class="list-group-item col-md-4 taskLabel" title="${s.taskId}" style="padding:5px;">
							<input class="${s.taskId}" name="track" type="checkbox" value="${s.taskId}" />
							<span></span><b>${s.taskId} (${s.taskName})</b>
						</label>
	                `).join('')}
	        	`;
//				默认来源任务只需要进行一次选择
				var nextButton = `
					<button type="button" class="btn btn-info" onclick="createTasks.taskchoiseTrue('${idName}')">确定</button>
				`;
				var closeButton = `
		        	<button type="button" class="close" title="关闭" onclick="createTasks.taskchoiseTrue('${idName}')">
		        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
		        	</button>
				`;
//				标注任务可以进行二次选择识别任务
				if( (user.userType) && (createTasks.category == "mark") ){
					h4 = "选择对应外业任务";
					nextButton = `
						<button type="button" class="btn btn-info" onclick="createTasks.taskchoiseNext('${idName}')">下一步</button>
					`;
					closeButton = `
			        	<button type="button" class="close" title="关闭" onclick="createTasks.taskchoiseNext('${idName}',true)">
			        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
			        	</button>
					`;
				}
//				选择处于人工编辑阶段的任务---可以选择多个任务
	        	var TaskTemp = `
					<div class="modals1">
						<div class="modal-header">
				        	${closeButton}
				   	 		 <h4 class="modal-title">${h4}</h4>
						</div>
						<div class="modal-body task-modal-body">
							<div class="list-group row sourceModal" style="position:relative;">
								${TaskTempList}
							</div>
						</div>
						<div class="modal-footer" style="bottom:55px;">
							${nextButton}
						</div>
						
					</div>
					<div id="sourceInfo">
						
					</div>
	        	`;
    			$(".ModalChange").html(TaskTemp);
    			
//  			存在已选中的来源任务,则默认显示选中
    			if( $('#'+idName).length ){
					for(var item in createTasks.taskBatchList){
						if( $(".sourceModal ."+item)[0] ){
							$(".sourceModal ."+item)[0].checked = true;
						}
					}
    			};
    			var junge = false;
    			$(".sourceModal").click(function(event){
    				if(event.target.type == "checkbox"){
	    				var divId = event.target.className;
    					for(var l=0; l<taskIds.length; l++){
							if( (taskIds[l].id.indexOf("SourceBatchs") >= 0) ){
								junge = true;
							}
    					}
    					if(junge){
	    					if(event.target.checked){
	    						createTasks.taskBatchList[divId] = "";
	    						var lableList = createTasks.sourceTasks[divId].batch;
	    						createTasks.taskBatch(event.target,lableList);
	    					}else{
	    						$("#"+divId).remove();
	    						delete createTasks.taskBatchList[divId];
	    					}
    					}else{
	    					if(event.target.checked){
	    						createTasks.taskBatchList[divId] = "";
	    					}else{
	    						delete createTasks.taskBatchList[divId];
	    					}
    					}
    				}
    			})
    			
//  			鼠标移出时,触发事件
		        $(".sourceModal label").on("mouseout", function () {
		        	if( $("#"+this.title).length != 0 ){
		        		var taskId = this.title;
		        		createTasks.mouseTime = setTimeout(function(){
		        			$("#"+taskId).remove();
		        		},1000);
		        	}
		        });
				
//  			鼠标移入时,触发事件
		        $(".sourceModal label").on("mouseover", function () {
		        	createTasks.sourceModel(this);
		        });
				
//  			鼠标移入时,触发事件
		        $(".sourceModal label").on("mouseout", function () {
					var idName = "track_"+this.title;
					if( $("#"+idName).length != 0 ){
						$("#"+idName).remove();
					}
		        });
    			
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},

/*
 * 根据多个采集任务的taskId查询内业识别任务
 */
	taskchoiseNext: function(idName,junge=false){
		if(junge){
			$('.modals1').hide();
			return
		}
		/*createTasks.surveyTasks = "";
		for(var item in createTasks.taskBatchList){
			if(createTasks.taskBatchList[item] != ""){
				createTasks.surveyTasks = createTasks.surveyTasks + createTasks.taskBatchList[item] + ",";
			}else{
				createTasks.surveyTasks = createTasks.surveyTasks + item + ",";
			}
		}
		if(createTasks.surveyTasks == ""){
			util.errorView("请先选择至少一个外业任务！");
			return;
		}*/

		createTasks.surveyTasks = "";
		var surveyTasksArr = [];
		for(var item in createTasks.taskBatchList){
			if(createTasks.taskBatchList[item] != ""){
				surveyTasksArr.push(createTasks.taskBatchList[item]);
			}else{
				surveyTasksArr.push(item);
			}
		}
		for(var i=0; i<surveyTasksArr.length; i++){
			createTasks.surveyTasks = createTasks.surveyTasks + surveyTasksArr[i];
			if(i != surveyTasksArr.length-1){
				createTasks.surveyTasks = createTasks.surveyTasks + ",";
			}
		}
		if(createTasks.surveyTasks == ""){
			util.errorView("请先选择至少一个外业任务！");
			return;
		}
//		自动处理任务的选择项
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/getRecogTaskNew?tasks='+createTasks.surveyTasks,
//	        url : window.kms+'task/getRecogTask?tasks='+selectVal,
	        async : false,
	        data : {},
	        success : function(data) {
	        	sourceTrackArr = {};
	        	var lists = data.result.result;
	        	var TaskTempList = `
	                ${lists.map(s => `
						<label class="list-group-item col-md-4 taskLabel" title="${s.taskId}" style="padding:5px;">
							<input class="${s.taskId}" name="track" type="checkbox" value="${s.taskId}" />
							<span></span><b>${s.taskId} (${s.taskName})</b>
						</label>
	                `).join('')}
	        	`;
				for(var i=0; i<lists.length; i++){
					var taskId = lists[i].taskId;
		        	sourceTrackArr1[taskId] = lists[i];
		        	createTasks.sourceTasks[taskId] = lists[i];
				}
				if(!TaskTempList){
					util.errorView("查询不到对应识别任务");
					return;
				}
//				选择处于人工编辑阶段的任务---可以选择多个任务
	        	var TaskTemp = `
					<div class="modals1">
						<div class="modal-header">
				        	<button type="button" class="close" title="关闭" onclick="createTasks.taskchoiseTrue('${idName}')">
				        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
				        	</button>
				   	 		 <h4 class="modal-title">选择对应识别任务</h4>
						</div>
						<div class="modal-body task-modal-body">
							<div class="list-group row sourceModal" style="position:relative;">
								${TaskTempList}
							</div>
						</div>
						<div class="modal-footer" style="bottom:55px;">
							<button type="button" class="btn btn-info" onclick="createTasks.taskchoiseTrue('${idName}')">确定</button>
						</div>
					</div>
					<div id="sourceInfo">
						
					</div>
	        	`;
    			$(".ModalChange").html(TaskTemp);
    			
//  			存在已选中的来源任务,则默认显示选中
    			if( $('#'+idName).length ){
					for(var item in createTasks.taskRecogList){
						if( $(".sourceModal ."+item)[0] ){
							$(".sourceModal ."+item)[0].checked = true;
							var trackIds = createTasks.sourceTasks[item].trackIds
							sourceTrackArr[item] = trackIds;
						}
					}
    			};
    			var junge = false;
    			$(".sourceModal").click(function(event){
    				if(event.target.type == "checkbox"){
	    				var divId = event.target.className;
    					for(var l=0; l<taskIds.length; l++){
							if( (taskIds[l].id.indexOf("SourceBatchs") >= 0) ){
								junge = true;
							}
    					}
    					if(junge){
	    					if(event.target.checked){
	    						createTasks.taskRecogList[divId] = "";
	    						var lableList = sourceTrackArr1[divId].batchs;
	    						createTasks.taskBatch(event.target,lableList,true);
	    						var trackIds = createTasks.sourceTasks[divId].trackIds;
	    						sourceTrackArr[divId] = trackIds;
	    					}else{
	    						$("#"+divId).remove();
	    						delete createTasks.taskRecogList[divId];
	    						delete sourceTrackArr[divId];
	    					}
    					}else{
	    					if(event.target.checked){
	    						createTasks.taskRecogList[divId] = "";
	    						var trackIds = createTasks.sourceTasks[divId].trackIds;
	    						sourceTrackArr[divId] = trackIds;
	    					}else{
	    						delete createTasks.taskRecogList[divId];
	    						delete sourceTrackArr[divId];
	    					}
    					}
    				}
    			})
    			
//  			鼠标移出时,触发事件
		        $(".sourceModal label").on("mouseout", function () {
		        	if( $("#"+this.title).length != 0 ){
		        		var taskId = this.title;
		        		createTasks.mouseTime = setTimeout(function(){
		        			$("#"+taskId).remove();
		        		},1000);
		        	}
		        });
				
//  			鼠标移入时,触发事件
		        $(".sourceModal label").on("mouseover", function () {
		        	createTasks.sourceModel(this,true);
		        });
				
//  			鼠标移入时,触发事件
		        $(".sourceModal label").on("mouseout", function () {
					var idName = "track_"+this.title;
					if( $("#"+idName).length != 0 ){
						$("#"+idName).remove();
					}
		        });
    			
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	鼠标移入触发事件,显示轨迹
	sourceModel: function(dom,judge=false){
		if( (dom.localName != "label") || judge ){
			return
		}
		var idName = "track_"+dom.title;
		var sourceList = createTasks.sourceTasks[dom.title].tracks || createTasks.sourceTasks[dom.title].dataTracks;
		var divModel = "";
		if(judge){
			divModel = `
				<div id="${idName}" class="sourceDiv">
					${sourceList.map(s => `
						<p>${s}</p>
					`).join('')}
				</div>
			`;
		}else{
			divModel = `
				<div id="${idName}" class="sourceDiv">
					${sourceList.map(s => `
						<p>${s.trackId}(${s.name})</p>
					`).join('')}
				</div>
			`;
		}
		$("#sourceInfo").html(divModel);
	},
	
//	选择对应融合任务的批次  事件
	taskBatch: function(target,lableList,junge=false){
    	var divId = target.className;
		var divLeft = target.parentNode.offsetLeft;
		var divWidth = target.parentNode.offsetWidth;
		var divTop = target.parentNode.offsetTop + target.parentNode.scrollHeight;
		
		var preferBatchId = null;
//  	查询最佳的批次
		$.ajax( {
	        type : "get",
	        url : window.kms+"task/preferBatch?taskId="+divId+"&processDefinitionKey="+selectVal,
	        async : false,
	        success : function(data) {
				preferBatchId = data.result;				//获取最佳的批次
	        },
	        error: function(msg){
	            console.log('异常');
	        }
		});
		var divModel = `
			<div id='${divId}' style='left:${divLeft}px;top:${divTop}px;width:${divWidth}px;' class="batchDiv">
				<h4>
		        	<button type="button" class="close" title="关闭" onclick="createTasks.batchClose('${divId}')">
		        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
		        	</button>
		        </h4>
				<div>
					${lableList.map(s => `
						<label class="list-group-item col-md-4">
							<input class="${s}" name="track_${divId}" type="radio" value="${s}" />
							<span style="float:left;"></span>
							<b>${s}</b>
						</label>
					`).join('')}
				</div>
			</div>
		`;
		$(event.target.parentNode).after(divModel);
//		最佳批次高亮显示并默认选择
		if(preferBatchId){
			if($("."+preferBatchId).length != 0){
				$("."+preferBatchId)[0].parentNode.children[2].innerHTML = preferBatchId+"(最佳批次)";
				$("."+preferBatchId)[0].parentNode.id = "preferInput";
				$("."+preferBatchId)[0].checked = true;
				if(junge){
					createTasks.taskRecogList[divId] = preferBatchId;
				}else{
					createTasks.taskBatchList[divId] = preferBatchId;
				}
			}
		}
//		选择批次时执行事件
		$(".batchDiv").click(function(event){
			if(event.target.type == "radio"){
    			var data_id  = event.currentTarget.id;
				if(junge){
					createTasks.taskRecogList[data_id] = event.target.value;
				}else{
					createTasks.taskBatchList[data_id] = event.target.value;
				}
				
			}
		})
    			
        $(".batchDiv").on("mouseout", function () {
        	if( $("#"+this.id).length != 0 ){
        		var taskId = this.id;
        		createTasks.mouseTime = setTimeout(function(){
        			$("#"+taskId).remove();
        		},1000);
        	}
        });
    			
        $(".batchDiv").on("mouseover", function () {
        	if( $("#"+this.id).length != 0 ){
        		clearTimeout(createTasks.mouseTime);
        	}
        });
	},
	
//	选择需要对比的批次  事件
	compareBatch: function(target,lableList){
		
    	var divId = target.className;						//任务ID
		var divLeft = target.parentNode.offsetLeft;			//position--left
		var divWidth = target.parentNode.offsetWidth;		//width
		var divTop = target.parentNode.offsetTop + target.parentNode.scrollHeight;		//position--top
		
//		判断dom节点是否存在
		if( $("#"+divId).length > 0 ){
			$("#"+divId).remove();
		}
		
//		新增选择批次项的dom选项
		var divModel = `
			<div id='${divId}' style='left:${divLeft}px;top:${divTop}px;width:${divWidth}px;' class="batchDiv">
				<h4>
		        	<button type="button" class="close" title="关闭" onclick="createTasks.batchClose('${divId}')">
		        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
		        	</button>
		        </h4>
				<div>
					${lableList.map(s => `
						<label class="list-group-item col-md-4"><input class="${s}" name="track_${divId}" type="radio" value="${s}" />
							<span style="float:left;"></span><b style="line-height:20px;padding-left:5px;">${s}</b>
						</label>
					`).join('')}
				</div>
			</div>
		`;
		$(event.target.parentNode).after(divModel);
		
//		选择来源任务时,点击选择批次
		$(".batchDiv").click(function(event){
			if(event.target.type == "radio"){
				createTasks.compareBatchList = {};
    			var data_id  = event.currentTarget.id;
				createTasks.compareBatchList[data_id] = event.target.value;
			}
		})
	},
	
//	关闭选择批次模版
	batchClose: function(taskId){
		$("#"+taskId).remove();
	},
	
//  查询可对比任务的列表
	taskcontrast: function (idName){
		$.ajax( {
	        type : "get",
        	url : window.kms+'task/compareTasks?processDefinitionKey='+selectVal,
	        async : false,
	        success : function(data) {
	        	sourceTrackArr1 = data.result;
//				选择处于人工编辑阶段的任务---可以选择多个任务
	        	var TaskTempList = "";
				for(var item in sourceTrackArr1){
					TaskTempList += `
						<label class="list-group-item col-md-4 trackLabel"><input class="${item}" name="fatherRadio" type="radio" value="${item}" />
							<span></span><b title="${item} (${sourceTrackArr1[item].taskName})">${item} (${sourceTrackArr1[item].taskName})</b>
						</label>
					`;
				}
				
//				选择处于人工编辑阶段的任务---可以选择多个任务
	        	var TaskTemp = `
					<div class="modals1">
						<div class="modal-header">
				        	<button type="button" class="close" title="关闭" onclick="createTasks.taskcontrastTrue('${idName}')">
				        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
				        	</button>
				   	 		 <h4 class="modal-title">选择对应任务</h4>
						</div>
						<div class="modal-body task-modal-body">
							<div class="list-group row taskcontrastModal" style="position:relative">
								${TaskTempList}
							</div>
						</div>
						<div class="modal-footer" style="bottom:55px;">
							<button type="button" class="btn btn-info" onclick="createTasks.taskcontrastTrue('${idName}')">确定</button>
						</div>
					</div>
	        	`;
    			$(".ModalChange").html(TaskTemp);
    			
//  			存在已选中的来源任务,则默认显示选中
    			if( $('#'+idName).length ){
    				if( $('#'+idName).val() != "" ){
    					var idNameVal = $('#'+idName).val();
    					$(".taskcontrastModal ."+idNameVal)[0].checked = true;
    				}
    			};
    			
    			$(".taskcontrastModal").click(function(event){
    				if(event.target.type == "radio"){
    					if(event.target.name == "fatherRadio"){
	    					if(event.target.checked){
	    						var divId = event.target.className;
	    						createTasks.compareBatchList[divId] = "";
	    						var lableList = sourceTrackArr1[divId].batchs;
	    						createTasks.compareBatch(event.target,lableList);
	    					}else{
	    						$("#"+event.target.className).remove();
	    						delete createTasks.compareBatchList[event.target.className];
	    					}
    					}
    				}
    			})
    			
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	   	})
	},
	
	
//	任务确定选择完成(逗号分割)
	taskchoiseTrue: function(idName){
		if( $("#sourceTrackIds").length != 0 ){
        	$("#sourceTrackIds").html("选择来源轨迹");
        	sourceTrackId = "";
		}
		var junge = false;
		
		if( (user.userType) && (createTasks.category == "mark") ){
			var sourceIds = createTasks.taskRecogList;
		}else{
			var sourceIds = createTasks.taskBatchList;
		}
		TaskIdStr = "";
		batchVal = "";
        TaskLength = $(".sourceModal input:checkbox:checked");
		var batchVals = [];
		var TaskIdStrs = [];
		
        for(var i=0; i<TaskLength.length; i++){
			if( sourceIds[TaskLength[i].value] && (sourceIds[TaskLength[i].value] != "") ){
//				批次号
				batchVals.push(sourceIds[TaskLength[i].value]);
			}else if( sourceIds[TaskLength[i].value] == "" ){
//				任务号
				TaskIdStrs.push(TaskLength[i].value);
			}
		}
        
//      任务号处理
        for(var s=0; s<TaskIdStrs.length; s++){
        	TaskIdStr += TaskIdStrs[s];
            if( s!=TaskIdStrs.length-1 ){
                TaskIdStr += ',';
            }
        }
		
        $('#'+idName).val(TaskIdStr);
		$('.modals1').hide();
		
	},
	
//	需要对比的任务确定选择完成(仅支持选择一个)
	taskcontrastTrue: function(idName){
//		选择所需要对比的任务
		for(var i=0; i<$(".taskcontrastModal input:radio:checked").length; i++){
			if($(".taskcontrastModal input:radio:checked")[i].name == "fatherRadio"){
				var TaskValue = $(".taskcontrastModal input:radio:checked")[i].value;
			}
		}
        
//      判断是否选择了对比任务的批次
    	if(!createTasks.compareBatchList[TaskValue]){
			for(var l=0; l<taskIds.length; l++){
				if( (taskIds[l].id.indexOf("compareBatch") >= 0) ){
					$("#"+taskIds[l].id).val("");
				}
			}
    		$('#'+idName).val(TaskValue);
    	}else{
    		$('#'+idName).val("");
			for(var l=0; l<taskIds.length; l++){
				if( (taskIds[l].id.indexOf("compareBatch") >= 0) ){
					$("#"+taskIds[l].id).val(createTasks.compareBatchList[TaskValue]);
				}
			}
    	}
		$('.modals1').hide();
	},

//	查询处理任务所对应的所有的轨迹段
	sourceTrack: function (){
		if( (!TaskIdStr && !batchVal) || (!!TaskIdStr && !!batchVal) ){
			util.errorView("请选择“1”条来源任务");
			return;
		}else{
//			查询该历史任务的所有轨迹段并显示出来--轨迹段可能存在多个
			var searchVal = "";
			if( (TaskIdStr != "") && (TaskIdStr.indexOf(",") < 0) ){
				searchVal = TaskIdStr;
			}
			if( (batchVal != "") && (batchVal.indexOf(",") < 0) ){
				searchVal = batchVal.split("_")[0];
			}
			if(searchVal == ""){
				util.errorView("请选择“1”条来源任务");
				return;
			}
		    $.ajax( {
		        type : "get",
		        url : window.kms+'task/sourceTrackIds?taskId='+searchVal,
		        async : false,
		        data : {},
		        success : function(data) {
		        	sourceTrackArr1 = data.result;
		        	if(!sourceTrackArr1){
		        		return;
		        	}
//		        	轨迹段只支持单选，即只可以选择一条轨迹
		        	var sourceTrackTemp = `
						<div class="modals1">
							<div class="modal-header">
					        	<button type="button" class="close" title="关闭" onclick="createTasks.checkSourceTrack()">
					        		<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
					        	</button>
					   	 		 <h4 class="modal-title">选择对应轨迹 <span style="font-size:16px;"> (不选择则默认选中所有轨迹)</span></h4>
							</div>
							<div class="modal-body task-modal-body">
								<div class="list-group row sourceModal" style="width:100%;height:95%;overflow:auto;">
									${sourceTrackArr1.map(s => `
										<label class="list-group-item col-md-4"><input class="${s.trackId}" name="track" type="checkbox" value="${s.trackId}" />
											<span style="float:left;"></span><b style="line-height:20px;padding-left:5px;">${s.trackId}(${s.surveyTrackName || ''})</b>
										</label>
									`).join('')}
								</div>
							</div>
							<div class="modal-footer" style="bottom:55px;">
								<button type="button" class="btn btn-info" onclick="createTasks.checkSourceTrack()">完成</button>
							</div>
						</div>
		        	`;
	    			$(".ModalChange").html(sourceTrackTemp);
		        },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
			   	},
		    });
		}
	},
	
//	选中的轨迹段
	checkSourceTrack: function(){
//		选中轨迹段之后修改显示的样式即变化
		sourceTrackId = "";
		sourceTrackLength = $(".sourceModal input:checkbox:checked");
		
        for(var i=0; i<sourceTrackLength.length; i++){
            sourceTrackId += sourceTrackLength[i].value;
            if( i!=sourceTrackLength.length-1 ){
                sourceTrackId += ',';
            }
		}
        if(sourceTrackLength.length != 0){
        	$("#sourceTrackIds").html("选中了"+sourceTrackLength.length+"条轨迹");
        }else{
        	$("#sourceTrackIds").html("选择来源轨迹");
        }
		
		$('.modals1').hide();
	},

	
//	通过选定的流程进行判断--并展示相对应的输入框
	selectSubmit: function(){
//		---相机类型列表查询---

		ftpJunge = false;	//判断是否存在ftp
		var camera = [],
			locDevice = [],
			type3;				//处理任务
		createscenefn();			//查询处理任务及相关数据

//		查询处理任务及相关数据
		function createscenefn(){
		    $.ajax( {
		        type : "get",
		        url : window.kms+'form/form-data?processDefinitionId='+processDefinitionId1,	//通过ip端口等信息进行---定位设备类型列表查询---
		        async : false,
		        data : {},
		        success : function(data) {
					createTasks.requiredForm = {};
					if(selectVal == "M-Survey_Select_New-S"){
						for(var s=0; s<createTasks.addForm.length; s++){
							data.formProperties.push( createTasks.addForm[s] );
						}
					}
		        	ftpData = [];
//      			该流程的具体数据中,使用相关的数据,map遍历循环生成dom节点
					formPropertiesSelect = [];
					formProperties = [];
					formProperties1 = [];
					sourceTrackArr = {};
					mapElementArr = [];
					mapElementData = [];
					taskIds = [];
					formBtn = [];
					mapElementArr = [];
					tagType = [];
					priority = [];
		        	mapElementModel = "";
		        	createTasks.surveyTasks = "";
					for(var i=0; i<data.formProperties.length; i++){
						var requiredType = data.formProperties[i].required;
						var id = data.formProperties[i].id;
						var name = data.formProperties[i].name;
						createTasks.requiredForm[id] = {
							"requiredType" : requiredType,
							"name" : name
						};
						if( id == 'range' ){
//							判断是否存在--范围
							formBtn.push(data.formProperties[i]);
						}else if( id == 'sceneCode' ){
//							判断是否存在--场景
							formProperties1.push(data.formProperties[i]);
    						scenefn();
						}else if( id == 'surveyTasks' ){
//							判断标注任务需要默认传输父级采集任务
							createTasks.surveyTasks = "";
						}else if( id == 'trackIds' ){
//							判断是否存在--根据来源任务选择轨迹
//							sourceTrackArr.push(data.formProperties[i]);
						}else if( id == 'ftpId' ){
//							判断是否存在--ftp
							ftpJunge = true;
							ftpfn();
						}else if( (id.indexOf("TaskId") >= 0) ){
							createTasks.requiredForm[id] = {
								"requiredType" : false,
								"name" : name
							};
//							判断是否存在--来源任务
							var clickHtml = `<a class="glyphicon glyphicon-chevron-right" title="选择任务" href="#" style="color:gray" data-toggle="modal" data-target="#modal-default1" onclick="createTasks.taskcontrast('${id}')"></a>`;
							
							if(id.indexOf("TaskIds") >= 0){
								clickHtml = `<a class="glyphicon glyphicon-chevron-right" title="选择任务" href="#" style="color:gray" data-toggle="modal" data-target="#modal-default1" onclick="createTasks.taskchoise('${id}')"></a>`;
							}
							data.formProperties[i]["domHtml"] = `
								<div class="form-group taskIds">
									<label for="${id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${name}:</label>
									<div class="col-sm-6" style="padding-right:0px;">
										<input type="text" title="多个任务需要使用逗号 , 隔开taskId" class="form-control" name="${id}" id="${id}" value="${data.formProperties[i].value || ''}" placeholder="逗号 , 隔开" onfocus="this.placeholder=''" onblur="this.placeholder='逗号 , 隔开'">
									</div>
									<div class="col-sm-1" style="padding:0;height:34px;line-height:34px;">
										${clickHtml}
									</div>
								</div>
							`;
							taskIds.push(data.formProperties[i]);
						}else if( id == 'mapElement' ){
//							判断是否存在--地图要素
							mapElementArr.push(data.formProperties[i]);
							mapElementfn();
						}else if( id == 'IMGOPRANGE' ){
//							判断是否存在--图片类型区分---半图/全图
							data.formProperties[i]["domHtml"] = `
								<div class="form-group">
									<label for="${id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${name}:</label>
									<div class="col-sm-7">
										<select class="form-control" id="${id}" name="${id}">
								            <option value="">请选择${name}</option>
								            <option value="1">全图</option>
								            <option value="0">半图</option>
							            </select>
									</div>
								</div>
							`;
							taskIds.push(data.formProperties[i]);
						}else if( id == 'tagType' ){
//							判断是否存在--需要进行对比的任务
							tagType.push(data.formProperties[i]);
						}else if( id == 'priority' ){
//							判断是否存在--需要进行对比的任务
							priority.push(data.formProperties[i]);
						}else if(data.formProperties[i].type == "select"){
							var thisData = data.formProperties[i].data;
							
//							判断是否存在--图片类型区分---半图/全图
							data.formProperties[i]["domHtml"] = `
								<div class="form-group">
									<label for="${id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${name}:</label>
									<div class="col-sm-7">
										<select class="form-control" id="${id}" name="${id}">
								            <option value="">请选择${name}</option>
								            ${thisData.map(d => `
								            	<option value="${d.value}">${d.name}</option>
								            `).join('')}
							            </select>
									</div>
								</div>
							`;
							taskIds.push(data.formProperties[i]);
						}else{
							if(data.formProperties[i].type == "boolean"){
								formPropertiesSelect.push(data.formProperties[i])
							}else{
								if( (id == 'multiSourceBatchs') || (id == 'compareBatch') || (id == 'sigleSourceBatchs') ){
									createTasks.requiredForm[id] = {
										"requiredType" : false,
										"name" : name
									};
									data.formProperties[i]["readonly"] = "readonly";
									data.formProperties[i]["Remarks"] = "在选择任务中进行";
									data.formProperties[i]["domHtml"] = `
										<div class="form-group">
											<label for="${id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${name}:</label>
											<div class="col-sm-7 sourceTask">
												<input type="text" class="form-control" name="${id}" id="${id}" value="${data.formProperties[i].value || ''}" title="${data.formProperties[i].Remarks || ''}" placeholder="${data.formProperties[i].Remarks || name}" onfocus="this.placeholder=''" onblur="this.placeholder='${data.formProperties[i].Remarks || data.formProperties[i].name}'" ${data.formProperties[i].readonly || ""}>
											</div>
										</div>
									`;
									taskIds.push(data.formProperties[i]);
								}else{
									formProperties.push(data.formProperties[i]);
								}
							}
						}
					}
		        },
			   	error: function(XMLHttpRequest, textStatus, errorThrown) {
			   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
			   	},
		    });
		};

//  	查询ftp列表
		function ftpfn(){
			$.ajax( {
		        type : "get",
		        url : window.Ftp+"ftp",
		        async : false,
		        success : function(msg) {
				    ftpData = msg.result;				//要修改的ftp的参数
		        },
		        error: function(msg){
		            console.log('异常');
		        }
		   	})
		};
		
//  	查询场景列表
		function scenefn(){
			$.ajax( {
		        type : "get",
		        url : window.kms+'task/scene',
		        async : false,
		        success : function(msg) {
		        	SceneData = msg.result;
		        },
		        error: function(msg){
		            console.log('异常');
		        }
		   	});
		};
		
//  	查询场景列表
		function mapElementfn(){
			$.ajax( {
		        type : "get",
		        url : window.kms+'task/mapElements',
		        async : false,
		        success : function(msg) {
		        	var resultModel = "";
		        	if(mapElementArr.length == 0){
		        		mapElementData = [];
		        		mapElementForm = [];
		        	}else{
//		        		地图要素选择的数据模板
		        		mapElementForm = msg.result;
						for (var Key in mapElementForm){
							resultModel += `
								<option value=${Key}>${mapElementForm[Key]}</option>
							`;
						}
		        		mapElementModel = `
				            <!--地图要素选择-->
				            ${mapElementArr.map(f => `
								<div class="form-group">
									<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
									<div class="col-sm-7 scene">
										<select class="form-control" id="${f.id}">
								            <option class="change" value="change">请选择${f.name}</option>
								            ${resultModel}
							            </select>
									</div>
								</div>
				            `).join('')}
		        		`;
		        	}
		        },
		        error: function(msg){
		            console.log('异常');
		        }
		   	});
		};
		
//		流程选择完成时所需要展示的参数
		var type2 = `
			<div class="type2">

	            <!--输入任务-->
	            ${taskIds.map(f => `
	            	${f.domHtml}
	            `).join('')}
	            
	            <!--场景选择-->
	            ${formProperties1.map(f => `
					<div class="form-group">
						<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
						<div class="col-sm-7 scene">
							<select class="form-control" id="${f.id}">
					            <option class="change" value="change">请选择${f.name}</option>
				                ${SceneData.map(s => `
					                <option value=${s.sceneCode}>${s.sceneName}</option>
				                `).join('')}
				            </select>
						</div>
					</div>
	            `).join('')}
				
				<!--地图要素选择-->
				${mapElementModel}
				
	            <!--其他input输入数据(普通)-->
	            ${formProperties.map(f => `
					<div class="form-group">
						<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
						<div class="col-sm-7 sourceTask">
							<input type="text" class="form-control" name="${f.id}" id="${f.id}" value="${f.value || ''}" placeholder="${f.name}" onfocus="this.placeholder=''" onblur="this.placeholder='${f.name}'">
						</div>
					</div>
	            `).join('')}
	            
	            <!--其他select下拉框(普通)-->
	            ${formPropertiesSelect.map(f => `
					<div class="form-group">
						<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
						<div class="col-sm-7 sourceTask">
							<select class="form-control" id="${f.id}" name="${f.id}">
					            <option class="true" value="true">是</option>
					            <option class="false" value="false">否</option>
				            </select>
						</div>
					</div>
	            `).join('')}
				
	            <!--标注类型-->
	            ${tagType.map(f => `
					<div class="form-group">
						<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
						<div class="col-sm-7 scene">
							<select class="form-control" id="${f.id}">
					            <option class="change" value="change">请选择${f.name}</option>
				                ${createTasks.tagTypes.map(s => `
					                <option value=${s.value}>${s.name}</option>
				                `).join('')}
				            </select>
						</div>
					</div>
	            `).join('')}
				
	            <!--任务优先级-->
	            ${priority.map(f => `
					<div class="form-group">
						<label for="${f.id}" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >${f.name}:</label>
						<div class="col-sm-7 scene">
							<select class="form-control" id="${f.id}">
					            <option class="change" value="change">请选择${f.name}</option>
				                ${createTasks.prioritys.map(s => `
					                <option value=${s.value}>${s.name}</option>
				                `).join('')}
				            </select>
						</div>
					</div>
	            `).join('')}
	            
			</div>
		`;
		$('.modals1').hide();
		$("#inputRange4").html(selectName);
		
		
//		对应数据的输入框模版的隐藏与显示-----不同的流程所展示的ui也不相同
		$(".type2").remove();
		$("#taskForm2 .box-body").append(type2);

//		修改默认下拉框select的默认显示
		for(var i in formPropertiesSelect){
			var selectId = formPropertiesSelect[i].id;
			var optionClass = formPropertiesSelect[i].value;
			$("#"+selectId+" ."+optionClass)[0].selected = "selected";
		}
	},
/*
//	处理任务选择项
	sourcebutton: function(e){
//		选择来源任务后的内容变化以及calssName修改
		sourceTrackId = '';
		$("#sourceTrackIds").html("选择来源轨迹ID");
		sourceVal  = e.currentTarget.getAttribute('data-value');
		sourceName  = e.currentTarget.innerHTML;
		if(e.currentTarget.className){
			$(".sourceModal button").attr("class", "list-group-item col-md-4");
			e.currentTarget.className = "list-group-item col-md-4 active";
			$('.modals1').hide();
		}else{
			
		};
//		createTasks.historyPolygon(sourceVal);
		$("#sourceTask").html(sourceName);
	},
*/
/*
//	选择来源任务后,会绘制该任务的范围,并在地图进行定位
	historyPolygon: function(sourceVal){
//		editor.context.map().addOverlays(polygon);
		var range1,
//			polygonId,
			Coordinate = [],
			style = {"fill": "red",'opacity':'0.5',"stroke": 'white',"stroke-width" : 3};

		editor.context.map().removeOverlays(polygonId);
//		获取选择的来源任务的rang--范围
    	$.ajax( {
        	type : "get",
      		url : window.kms+'history/historic-process-instances?includeProcessVariables=true&businessKey='+sourceVal,
	        async : false,
	        data : {},
	        success : function(data) {
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "range"){
						if(!data.data[0].variables[l].value){
							return;
						}else{
							var replaces = data.data[0].variables[l].value.replace("POLYGON ((","").replace("))","");
							replaces.split(", ");
							Coordinate.push(replaces);
						}
					}
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
//		对rang范围进行处理
		var locs = [];
	    for(var s=0; s<Coordinate.length; s++){
			var strs = Coordinate[s].split(", "); 			//字符分割 
			var strs1 = [];
			for(var i=0; i<strs.length; i++){
				var strs2 = strs[i].split(" ");
				var loc = []; 								//定义一数组 
				for(var l=0; l<strs2.length; l++){
					loc.push( Number(strs2[l]) );
				}
				strs1.push(loc);
			}
			locs.push(strs1);
	    }
//		已绘制的区域显示
		for(var l=0; l<locs.length; l++){
			var locs1 = locs[l];
			var nodes = [];
			var dataTaskName1;
			for(var i=0; i<locs1.length; i++){
				nodes.push( new Point({ loc : locs1[i] }) );
			}
			
			var polygon = new Polygon({
				nodes : nodes ,
				mode: 'polygon',
	            onDraw : function (element){
	               	element.style(style);
	            },
			});
			polygonId = polygon;
			editor.context.map().addOverlays(polygon);
			editor.context.map().center(locs1[0]);
		}
	},
*/

//	区域绘制功能
	drawPolygon: function(e){
	    _tempGeo='';
	    editor.context.map().dimensions(editor.context.map().dimensions());
//	  	if(editor.setMouseTool('polygon')){
//	  		editor.setMouseTool('');
//	  	}else{
//	  		editor.setMouseTool('polygon');
//	  	}
	    editor.setMouseTool('polygon');
	    e.stopPropagation()
	    editor.addListener('polygonend',function(e){
	        console.log('polygonend',e)
	    })
	    editor.addListener('drawend',function(e){
	        _tempGeo = createTasks.overlayerTtoGeo(e.overlay);
	    })
	},

//	绘制面
	overlayerTtoGeo: function(overlay){
	    let xys =[];
	    let geo='';
	    if(overlay.graphType == 'polygon'){
	        for(let i=0,len=overlay.nodes.length;i<len;i++){
	            xys.push(overlay.nodes[i].loc[0]+" "+overlay.nodes[i].loc[1]);
	        }
//	        geo = 'POLYGON((' + xys.join(' ') + '))';
	        geo = xys.join(',');
	    }
	    return geo;
	},
	
//	当选择的生产流程时,根据下拉框获取数据
	ftpChange: function(){
		var FTPValue = $('#FTP option:selected').val();
//  	查询ftp列表
		$.ajax( {
	        type : "get",
	        url : window.Ftp+"ftp/"+FTPValue,
	        async : false,
	        success : function(msg) {
			    if(!msg.result){
			    	ftpJson = {};
			    }else{
			    	ftpData = msg.result;				//要修改的ftp的参数
//					将参数储存起来
					ftpJson.ftpIp = ftpData.ip;
					ftpJson.ftpPort = ftpData.port;
					ftpJson.ftpPath = ftpData.path;
					ftpJson.ftpUsername = ftpData.username;
					ftpJson.ftpPassword = ftpData.password;
					ftpJson.dataPath = ftpData.dataPath;
			    }
	        },
	        error: function(msg){
	            console.log('异常');
	        }
	   });
	},
	

//	创建任务的提交功能
	submitFun: function(){
		var jsondata = {};
		var tags = {};										//数据集合
	    var processDefinitionKey = selectVal;				//获取Key值  即选择的流程类型
	    var name = $('#inputName3').val();					//任务名称
//  	绘制的范围
	    var range = _tempGeo;
	    
//  	任务创建者
	    var createBy = user.userId;
	    var username = user.username;
	  
//		 切割后的轨迹段id
/*
	    if(sourceTrackSegmentId != ""){
	    	tags.sourceTrackSegmentId = sourceTrackSegmentId;
	    }else{
	    	//...
	    }
*/
	   	
//  	任务名称为必填项
	    if(name == ""){
    		util.errorView("请输入任务名称",false);
			return;
	    }else{
//	    	需要ftp参数的流程
	    	if(ftpJunge){
				tags = ftpJson;
	    	}else{
				for(var i in taskIds){
					tags[taskIds[i].id] = $('#'+(taskIds[i].id)).val() || $('#'+taskIds[i].id+' option:selected').val() || "";
				}
	    	}
			
			var priority = "";
//  		标注任务优先级
			if( $("#priority").length>0 ){
//				地图要素为必填项(未选择地图要素则不执行新建任务)
    			var priority = $('#priority option:selected').val();
			    if( (priority == "") || (priority == "change") ){
		        	util.errorView("请选择任务优先级",false);
	    			return;
			    }
			}
//			提交任务确认传输数据
	    
			var $inputList1 = $([]);
			var $selectList1 = $([]);
		
//			增添其他input表单的内容
			for(var i in formProperties){
				var item = formProperties[i].id;
				$inputList1 = $inputList1.add('#' + item);
			}
//			增添其他select表单的内容
			for(var i in formPropertiesSelect){
				var item = formPropertiesSelect[i].id;
				$inputList1 = $inputList1.add('#' + item);
			}
//			向后台传输数据--将input/select数据写入tags内
			$inputList1.each(function(){
				if(this.type == "text"){
					tags[this.name] = this.value;
				}else if(this.type == "select-one"){
					tags[this.name] = this.value;
				}
			});
			
//			标注流程需要默认传输采集任务的taskId
			if(createTasks.surveyTasks != ""){
				tags["surveyTasks"] = createTasks.surveyTasks;
			}
			var trackArr = [],
				trackIds = "";
			for(var item in sourceTrackArr){
				var thisTracks = sourceTrackArr[item].split(",");
				for(var i=0; i<thisTracks.length; i++){
					var trackId = thisTracks[i];
					trackArr.push(trackId);
				}
			}
			for(var i=0; i<trackArr.length; i++){
	        	trackIds += trackArr[i];
	            if( i!=trackArr.length-1 ){
	                trackIds += ',';
	            }				
			}
			if(trackIds){
				tags["trackIds"] = trackIds;
			}
			
			for(var itemName in createTasks.requiredForm){
				var thisName = createTasks.requiredForm[itemName].name;
				var requiredType = createTasks.requiredForm[itemName].requiredType;
				if(!tags[itemName] && requiredType){
		        	util.errorView(thisName,false);
	    			return;
				}
			}
			
//  		当没有绘制区域或者忘记绘制区域时，会进行判断绘制范围是否为必填项
	    	if(priority==''){
	    		jsondata = {processDefinitionKey,createBy,username,name,tags};
		    }else{
		    	jsondata = {processDefinitionKey,createBy,username,name,priority,tags};
		    }

			$("#loading").css("display","block");
//			提交创建任务数据
		    $.ajax( {
		        type : "POST",
		        url : window.kms+"task",
	        	async : true,
				contentType: "application/json; charset=utf-8",
		        data : JSON.stringify(jsondata),
		        success : function(msg) {
					$("#loading").css("display","none");
		            if( !msg.code || (Number(msg.code) == 0) ){
		            	main.modalClose();
		            	main.Table();
		            }else{
		        		util.errorView(msg.message,false);
		                console.log('新增任务错误');
		        		return;
		            }
		        },
		        error: function(msg){
					$("#loading").css("display","none");
		            console.log('异常');
		        }
		    });
		}
	},

//	地区定位搜索功能(创建任务时的地区搜索以及定位功能)
	search: function(){
//		对所输入的值进行定位
		var inputVal = $("#inputName4").val();
//		从全国中搜索
		createTasks._search(inputVal, "全国", function(dataList){
			if(!dataList || !dataList.length){
				return ;
			}
			var first = dataList[0];
			if(first){
				var loc = first.location;
				if(loc){
					editor.setCenter([loc.lng, loc.lat]);
				}else {
//					对所搜索的地区根据坐标定位
					createTasks._search(inputVal, first.name || "全国", function(dataList2){
						var sec = dataList2 && dataList2[0];
						if(sec && sec.location){
							var loc = sec.location;
							editor.setCenter([loc.lng, loc.lat]);
						}
					});
				}
			}else {
				// ..
			}
		});
	},
	
//	二次搜索(第一次模糊搜索结果太多时，自动进行详细搜索)
	_search: function(inputVal, cityName, callback){
		var key = "cSZ9edWaAejkwW8L8L7Lqz2uxtjG294c";
	    $.ajax( {
	        type : "GET",
	        dataType:"jsonp",
	        async : false,
	        url : "http://api.map.baidu.com/place/v2/search?query="+(inputVal || "")+"&region="+cityName+"&ret_coordtype=gcj02ll&output=json&ak="+key,
	        success : function(data) {
	        	if(data.status == 0){
	        		callback && callback(data.results);
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
// 		modalClose();
	}
}
