//标注系统-质检与验收功能
var testAndCheck = {
	
	Text:{
		"MarkQC"		: "标注质检",
		"MarkAcceptance": "标注验收"
	},
	
	errorTypes: [
		{
			'value': '1',
			'name': '形状错误'
		},
		{
			'value': '2',
			'name': '类型错误'
		},
		{
			'value': '3',
			'name': '多'
		},
		{
			'value': '4',
			'name': '漏'
		}
	],
	
	repairTypes: [
		{
			'value': '1',
			'name': '数据错误，已修改'
		},
		{
			'value': '2',
			'name': '数据正确，未修改'
		},
		{
			'value': '3',
			'name': '工艺问题，待确认'
		}
	],
	
	current_types: [],
	
	current_allow: null,
	
	taskInfos: {},
	
	checked: null,
	
	arrowImg: null,
	
	imgMark: [],
	
	imgHideMark: [],
	
//	imageJunge: null,
	
	imageHeight: null,
	
	imageWidth: null,			//图片的宽
	
	trackPointId: null,			//图片的trackPointId
	
	batchId: null,				//图片的batchId
	
	booleanId: null,			//提交任务所需要的id
	
	checkedType: null,
	
//	图像识别标注功能的模版
	Table: function(results){
		testAndCheck.imgMark = [];
		testAndCheck.imgHideMark = [];
		if(results.taskDefKey == "MarkHandle"){
	        util.errorView("请在标注软件上进行此操作!");
	        return;
		}
		testAndCheck.checkedType = results.taskDefKey;		//环节key
		let taskName = results.taskName || '',
			processInstanceId = results.processDefinitionId || '';
		testAndCheck.taskInfos = {
			'activitiTaskId': null,
			'ifrePair': false,
			'taskId': results.taskId,
			'type': results.markType || 1,
			'user': user.username
		};
		testAndCheck.booleanId = results.id || '';
		
		let _url = window.kms_v2 + "task/operation/getMyMarkTasksByTaskId?taskId=" + testAndCheck.taskInfos.taskId + "&user=" + user.username;
		util.getAjax(_url, true, function(data){
			if(data.code != '0'){
				util.errorView('查询当前任务标注信息失败！');
				return;
			}
			let param = data.result.activitiTaskInfos[0] || {};
			testAndCheck.taskInfos['activitiTaskId'] = param.activitiTaskId;
           	testAndCheck.markModel(results, param);
		})
		
	    /*$.ajax( {
	        type : "get",
  			url : window.kms+"runtime/tasks?includeProcessVariables=true&processInstanceId="+processInstanceId,
	        async : false,
	        data : {},
	        success : function(data) {
				activityId1 = data.data[0].taskDefinitionKey;
				for(var l=0; l<data.data[0].variables.length; l++){
					if(data.data[0].variables[l].name == "taskName"){
						taskName = data.data[0].variables[l].value;				//任务名
					}
					if(data.data[0].variables[l].name == "BATCH"){
						testAndCheck.batchId = data.data[0].variables[l].value;			//任务的批次号
					}
					if(data.data[0].variables[l].name == "TRACKPOINTID"){
						testAndCheck.trackPointId = data.data[0].variables[l].value;	//trackPointId
						testAndCheck.trackIdShow({
							"value": value,
							"trackPointId": testAndCheck.trackPointId,
							"taskId": taskId,
							"taskName": taskName
						});
					}
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });*/
	},
	
//	监听鼠标滚轮事件,并对图片进行透明度的修改
	mousewheel: function(judge){
		var opacityImg = $(".box-body .opacity");
		if(!opacityImg.length){
			return;
		}
		var opacity = Number( opacityImg.eq(0).css("opacity") );
		if(judge && (opacity < 1 )){
			var newOpacity = (opacity*10 + 1)/10;
			for(var i=0; i<opacityImg.length; i++){
				opacityImg.eq(i).css("opacity", newOpacity);
			}
//			opacityImg.eq(0).css("opacity", newOpacity);
		}else if( !judge && (opacity > 0) ){
			var newOpacity = (opacity*10 - 1)/10;
			for(var i=0; i<opacityImg.length; i++){
				opacityImg.eq(i).css("opacity", newOpacity);
			}
//			opacityImg.eq(0).css("opacity", newOpacity);
		}
	},
	
//	质检或验收时增加放大镜效果
	enlarge: function(){
//  	获取元素
        var box = $(".box-left .box-body");
//  	获取显示小图的div
        var small = $(".box-left .box-body #myCanvas");
//  	获取小图中的遮挡的div
        var mask = $(".box-left .box-body .body-left-body #lay")[0];
//  	获取显示大图的div
        var big = $(".box-left .box-body #bigImg")[0];
//  	获取大div中的大图
        var imgObj = $(".box-left .box-body #bigImg img");
        for(var i=0; i<imgObj.length; i++){
        	imgObj[i].height = small[0].clientHeight * 4;
        	imgObj[i].width = small[0].clientWidth * 4;
        }
//      imgObj.height = small[0].height * 4;
//      imgObj.width = small[0].width * 4;
//  	鼠标进入事件
        box.on("mouseover", function() {
	        mask.style.display = "block";
	        big.style.display = "block";
		});
        box.on("mouseout", function() {
	        mask.style.display = "none";
	        big.style.display = "none";
		});
        small.on("mousemove", function(e) {
        	var leftX = e.clientX - e.offsetX;
        	var topY = e.clientY - e.offsetY;
	       	var left = e.clientX - mask.offsetWidth/2;		/*横坐标*/
	        var top = e.clientY - mask.offsetHeight/2;		/*纵坐标*/
//	   		设置遮挡层的left和top
	        var x = left - leftX;				//margin
	        var y = top - topY;				//margin
	
	        x=x<0?0:x;					//如果横坐标小于0就设置为0
	        y=y<0?0:y;					//如果纵坐标小于0就设置为0
	        x=x>small[0].offsetWidth-mask.offsetWidth?small[0].offsetWidth-mask.offsetWidth:x;
	        y=y>small[0].offsetHeight-mask.offsetHeight?small[0].offsetHeight-mask.offsetHeight:y;
	        
//	   		设置遮挡层的定位值
	        mask.style.left = x + "px";
	        mask.style.top = y + "px";
	
//	   		设置大图的移动距离
//	       	 大图的最大的移动距离
	        var imgMaxMove=imgObj[0].offsetWidth-big.offsetWidth;
//			遮挡层的最大的移动距离
	        var maskMaxMove=small[0].offsetWidth-mask.offsetWidth;
//			 大图的横向移动的距离
	        var imgMoveLeft=x*imgMaxMove/maskMaxMove;
//			大图的纵向移动的距离
	        var imgMoveTop=y*imgMaxMove/maskMaxMove;
//			设置大图的left和top---移动的是margin-left和margin-top
	        for(var i=0; i<imgObj.length; i++){
	        	imgObj[i].style.marginLeft=-imgMoveLeft+"px";
	        	imgObj[i].style.marginTop=-imgMoveTop+"px";
	        }
//	        imgObj.style.marginLeft=-imgMoveLeft+"px";
//	        imgObj.style.marginTop=-imgMoveTop+"px";
		});
	},
	
//	根据轨迹点信息查询trackId
	trackIdShow: function(param){
//		上传做过标记的图片
       	$.ajax({
		    type : "get",
           	url: window.KrsUrl+"track/point/get?trackPointId="+param.trackPointId+"&dynamicCal=false&offsetCal=false",
		    async : true,
		    data : {},
           	success: function (data) {
           		testAndCheck.trackId = data.result.trackId;
           		testAndCheck.markModel(param);
           	},
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
       	})
	},
	
	markModel: function(results, param){
		
		testAndCheck.current_types = [];
		
		let org_img = window.kms_v2 + 'org/file/getByOrgId?orgId=' + param.taskInfo.property.orgId,
			mark_img = window.kms_v2 + 'mark/file/getByMarkId?markId=' + param.taskInfo.property.ID;
		
	    var test =`
	     	<div class="modal fade task-modal" data-backdrop="static" data-show="true" id="modal-default">
	          	<div class="modal-dialog task-dialog" >
	            	<div class="modal-content task-modal-content">
	              		<div class="modal-header flowing-header">
	                		<button type="button" class="close" title="关闭" data-dismiss="modal" aria-label="Close" onclick="main.modalClose('myTask',true,true)">
	                  			<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
	                		</button>
	                		<h4 class="modal-title">${results.taskId || ''} -- (${results.taskName || ''}${results.currentLink || ''})</h4>
	              		</div>
	              		<div class="modal-body flowing-modal-body">
					        <div class="col-xs-12" style="height:100%;">
						        <!--左侧图片-->
					        	<div class="box box-left">
					    			<div class="box-body">
										<div class="image-mark-type">
											<h4>形状错误</h4>
											<ul class="error-types">
												${testAndCheck.errorTypes.map(e => `
													<li>
														<label>
															<input type="radio" title="${e.name}" value="${e.value}" name="errorType">
															<span>${e.name}</span>
														</label>
													</li>
												`).join('')}
											</ul>
											<ul class="repair-types">
												${testAndCheck.repairTypes.map(r => `
													<li>
														<label>
															<input type="radio" title="${r.name}" value="${r.value}" name="repairType">
															<span>${r.name}</span>
														</label>
													</li>
												`).join('')}
											</ul>
										</div>
										<div class="body-left-body" style="width:100%;height:100%;">
				    						<img class="original" src="${org_img}">
				    						<img class="opacity" src="${mark_img}">
											<div id="lay"></div>
										</div>
										<div style="position:absolute;z-index:9999;left:0px;top:0px;width:100%;height:100%;">
											<canvas id="myCanvas" style="width:100%;height:100%;"></canvas>
											<canvas id="canvasHide" style="display:none;" ></canvas>
										</div>
										<div id="bigImg">
				    						<img class="original" src="${org_img}">
				    						<img class="opacity" src="${mark_img}">
										</div>
									    
			              				<!-- 撤销上一步的操作 -->
								    	<div id="lastMark">
											<a class='btn btn-primary' title='撤回上一步' href='#'>
												<i class='fa fa-mail-reply'></i>
											</a>
								    	</div>
				    					
					    			</div>
					    		</div>
						        <!--右侧类型-->
					        	<div class="box box-right" style="height:100%;">
					    			<div class="box-body" style="height:100%;">
				    					<div class="body-right-header">
				        					<h4 class="img-title">${results.currentLink}</h4>
				    					</div>
				    					<div class="body-right-body list-group">
											<button type="button" id="back" class="btn btn-danger">${results.currentLink}打回</button>
											<button type="button" id="pass" class="btn btn-success">${results.currentLink}通过</button>
											  		
											<!-- 
											<button class="btn btn-danger" type="button" id="back" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
												${results.currentLink}打回
											</button>
											<button class="btn btn-success" type="button" id="pass" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
												${results.currentLink}通过
											</button>
											<div class="collapse" id="collapseExample">
											  	<div class="well">
											  		<p style="font-size:18px;"></p>
											  		<button type="button" id="button" class="btn btn-Info">确定</button>
											  	</div>
											</div>
				    						 -->
				    					</div>
				    					<div class="body-right-bottom">
											<label class="list-group-item"><input class="autoReceive" name="track" type="checkbox" />
												<span></span><b title="自动领取下一个${results.currentLink}任务">自动领取下一个${results.currentLink}任务</b>
											</label>
				    					</div>
					    			</div>
					    		</div>
					    	</div>
	              		</div>
	            	</div>
	          	</div>
	        </div>
	    `;
	    $('.testmodal').html(test);
	    $('#modal-default').modal({
	        show:true
	    });
		
	    if(testAndCheck.checked){
	    	$(".autoReceive")[0].checked = true;
	    }
//		canvas绘制的撤回上一步的绘制
	    $("#lastMark").on("click", function() {
	    	testAndCheck.lastMark();
		})
//		选择是否自动领取任务池中的质检或验收任务
	    $(".autoReceive").on("click", function() {
	    	testAndCheck.checked = $(".autoReceive")[0].checked;
		})
	    $(".image-mark-type").on('click', 'ul li input', function (e) {
			
			var name = e.target.name;
			var text = e.target.nextElementSibling.innerHTML;
			var value = e.target.value;
			var index = testAndCheck.current_allow;
			testAndCheck.current_types[index][name] = value;
			if(name == 'errorType'){
				$('.image-mark-type h4').html(text);
			}
			
		})
//		通过鼠标滚轮进行控制图片的透明度
    	$('.box-left .box-body #myCanvas').on('mousewheel', function(event) {
    		var mouseNum = event.originalEvent.deltaY;
    		if(mouseNum > 0){
    			testAndCheck.mousewheel(false);
    			//缩小
    		}else{
    			testAndCheck.mousewheel(true);
    			//扩大
    		}
		});
		$('.box-left .box-body').bind("contextmenu",function(e){
			return false;
		});
	    $("#loading").css("display","block");
		let imageURL = window.kms_v2 + 'org/file/getByOrgId?orgId=' + param.taskInfo.property.orgId;
//		原始图片展示并获取宽和高
		var repairInfos = param.taskInfo.property.repairInfos || null;
	    var img =new Image();
	    img.src = imageURL;
	    img.onload =function(){
	    	testAndCheck.imageHeight = img.height;
	    	testAndCheck.imageWidth = img.width;
		    setTimeout(function(){
		   		testAndCheck.downLoadCanvas();
		    	testAndCheck.enlarge();
	    		$("#loading").css("display","none");
				if(repairInfos){
					testAndCheck.historyCanvasMark(repairInfos);
				}
		    },500)
			
		
	    }
	},
	
	// 显示历史标注
	historyCanvasMark: function(repairInfos){
	
	    $("#loading").css("display","block");
		
	    var canvas=document.getElementById('myCanvas');
	    var width = $(".body-left-body img")[0].clientWidth;
	    var height = $(".body-left-body img")[0].clientHeight;
		var ctx=canvas.getContext('2d');
		var canvasHide = document.getElementById('canvasHide');
		var ctxHide=canvasHide.getContext('2d');
		
		setTimeout(function(){
			for(var i=0; i<repairInfos.length; i++){
				var geos = repairInfos[i].geom.replace('POLYGON((','').replace('))','');
				var geos_point_str = geos.split(',')[0];
				var geos_point = geos_point_str.split(' ');
				var image_x = geos_point[0];
				var image_y = geos_point[1];
				var errorType = repairInfos[i].errorType;
				var repairType = repairInfos[i].repairType;
				var checkType = repairInfos[i].checkType || '';
				
				var new_x = image_x / (testAndCheck.imageWidth/width);
				var new_y = image_y / (testAndCheck.imageHeight/height);
				
				testAndCheck.current_types.push({
					'image_x': image_x,
					'image_y': image_y,
					'x_1': new_x,
					'y_1': new_y,
					'x_2': new_x + 32,
					'y_2': new_y + 32,
					'errorType': errorType,
					'repairType': repairType,
					'checkType': checkType
				})
				testAndCheck.imgMark.push({
					"x": new_x,
					"y": new_y
				});
				testAndCheck.imgHideMark.push({
					"x": image_x,
					"y": image_y
				});
			}
			testAndCheck.newAllCanvas();
			testAndCheck.current_allow = testAndCheck.current_types.length - 1;
			$("#loading").css("display","none");
			
		}, 200)
		
	},
	
	// 加载历史所有标注箭头
	newAllCanvas: function(){
		var canvas = document.getElementById('myCanvas');
		var canvasHide = document.getElementById('canvasHide');
		var ctx = canvas.getContext('2d');
		var ctxHide = canvasHide.getContext('2d');
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctxHide.clearRect(0, 0, canvasHide.width, canvasHide.height);
		
				
		for(let i=0; i<testAndCheck.current_types.length; i++){
			
			let img = new Image();
			img.src = "dist/img/arrow.png";
			img.setAttribute("crossOrigin",'Anonymous');
			if(testAndCheck.current_types[i].checkType == "MarkAcceptance"){
				img.src = "dist/img/arrow1.png";
			}
			setTimeout(function(){
				ctx.drawImage(img, testAndCheck.current_types[i].x_1, testAndCheck.current_types[i].y_1);
				ctxHide.drawImage(img, testAndCheck.current_types[i].x_2, testAndCheck.current_types[i].y_2);
			},100)
		}
	},
	
	downLoadCanvas: function(){
//		canvas渲染图标(箭头指向)
	    var canvas=document.getElementById('myCanvas');
	    var width = $(".body-left-body img")[0].clientWidth;
	    var height = $(".body-left-body img")[0].clientHeight;
		canvas.width = width;
		canvas.height = height;
		var ctx=canvas.getContext('2d');
		testAndCheck.arrowImg = new Image();
//		质检打回与验收打回的标志箭头区分(质检黄色箭头-验收绿色箭头)
		testAndCheck.arrowImg.src = "dist/img/arrow.png";
		if(testAndCheck.checkedType == "MarkAcceptance"){
			testAndCheck.arrowImg.src = "dist/img/arrow1.png";
		}
		testAndCheck.arrowImg.setAttribute("crossOrigin",'Anonymous');
//		隐藏的canvas
		var canvasHide = document.getElementById('canvasHide');
		canvasHide.width  = testAndCheck.imageWidth;
		canvasHide.height = testAndCheck.imageHeight;
		var ctxHide=canvasHide.getContext('2d');
//		点击canvas生成箭头
		canvas.onmouseup = function(e) {
			var hideX = (e.offsetX)*(testAndCheck.imageWidth/width);
			var hideY = (e.offsetY)*(testAndCheck.imageHeight/height);
			
			if(e.which && e.which == 1){
				$('.image-mark-type h4').html('形状错误');
				$('.image-mark-type .error-types input').eq(0).prop("checked", true);
				$('.image-mark-type .repair-types input').eq(0).prop("checked", true);
				
				$('.image-mark-type').fadeIn(100);
				$('.image-mark-type').css({
					'left': e.offsetX + 32,
					'top': e.offsetY + 32
				});
				testAndCheck.current_types.push({
					'image_x': hideX,
					'image_y': hideY,
					'x_1': e.offsetX,
					'y_1': e.offsetY,
					'x_2': e.offsetX + 32,
					'y_2': e.offsetY + 32,
					'errorType': '1',
					'repairType': '1',
					'checkType': testAndCheck.checkedType
				})
				
				testAndCheck.current_allow = testAndCheck.current_types.length - 1;
				
//				看到的canvas(小)
				ctx.drawImage(testAndCheck.arrowImg,e.offsetX,e.offsetY);
				testAndCheck.imgMark.push({
					"x": e.offsetX,
					"y": e.offsetY
				});
//				隐藏的真正传输的canvas(大)
				ctxHide.drawImage(testAndCheck.arrowImg,hideX,hideY);
				testAndCheck.imgHideMark.push({
					"x": hideX,
					"y": hideY
				});
			}else if(e.which && e.which == 3){
				testAndCheck.dialogType(e.offsetX, e.offsetY);
			}
		}
		
//		质检或验收---打回与通过功能
		var back = document.getElementById("back");
		var pass = document.getElementById("pass");
		back.onclick = function() {
			
			let dataURL = canvasHide.toDataURL('image/png');
			let fileName = testAndCheck.taskInfos.taskId+".png";
			let fileImage = testAndCheck.dataURLtoFile(dataURL,fileName);
			let formData = new FormData();
			formData.append("file", fileImage);			 // 文件对象
			
			testAndCheck.submitTasks(formData, true);
		}
		pass.onclick = function() {
			let formData = new FormData();
			testAndCheck.submitTasks(formData, false);
		}
	},
	
	/*提交任务打回及通过*/
	submitTasks: function(file, type){
		
		var json = [];
		for(var i=0; i<testAndCheck.current_types.length; i++){
			var i_data = testAndCheck.current_types[i];
			var new_data = testAndCheck.formatGeo(i_data);
			json.push(new_data)
		}
		
		if( !type ){
			json = [];
		}
		
		testAndCheck.taskInfos['ifrePair'] = type;
		let _url = window.kms_v2 + "mark/info/getByTaskId?taskId=" + testAndCheck.taskInfos.taskId,
			cn_types = { 'true': '通过', 'false': '打回' },
			cn_type = cn_types[type] + '成功',
			checkedTypes = {
				'MarkQC': window.kms_v2 + 'task/operation/commitMarkCheckTask?',				//质检
				'MarkAcceptance': window.kms_v2 + 'task/operation/commitMarkAcceptTask?'		//验收
			},
			sub_url = checkedTypes[testAndCheck.checkedType];
		
		for(let name in testAndCheck.taskInfos){
			sub_url += (name + '=' + testAndCheck.taskInfos[name] + '&');
		}
		
		util.postAjax(sub_url, json, function(data){
			if(data.code != '0'){
				util.errorView(data.message);
				return;
			}
			util.errorView(data.message, true);
			if(testAndCheck.checked){
				testAndCheck.tableChecked();
			}else{
				main.modalClose(true,false,true);
			}
		})
		
	},
	
//	质检与验收打回操作
	searchImage: function(value){
		var id = "handleFlag";
		if(testAndCheck.checkedType == "MarkAcceptance"){
			id = "handle";
		}
		if(!value){
			var _data = {
			    "taskId": testAndCheck.booleanId,
			    "properties": [{
		            "id": id,
		            "value": "false"
			    }]
			}
		}else{
			var _data = {
			    "taskId": testAndCheck.booleanId,
			    "properties": [{
		            "id": id,
		            "value": "true"
			    }]
			}
		}
		$("#loading").css("display","block");
	    $.ajax({
	        type : "post",
	        url : window.kms+'form/form-data',			//质检或验收的通过与不通过
	        async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_data),
	        success : function(data) {
	        	$("#loading").css("display","none");
				if(data.code != '0'){
	           		util.errorView(data.message);
	           		return;
				}
				if(testAndCheck.checked){
					testAndCheck.tableChecked();
				}else{
		            main.modalClose(true,false,true);
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	自动查询是否还存在未领取的质检或验收任务
	tableChecked: function(){
		testAndCheck.claimTasks(function(data){
			let myTaskURL = window.kms + "task/taskInfo/current?pageSize=10&pageNum=1&current_operator="+user.username;
			util.getAjax(myTaskURL, true, function(data){
				if(!data.total){
		           	util.errorView("当前用户下无任务");
			        main.modalClose(true,false,true);
				}else{
					let result = data.result[0];
			        main.modalClose();
		            testAndCheck.Table( result );
				}
			})
		});
	},

	claimTasks: function(callback){
//		mark_role mark_inspect_role mark_check_role
		let markType = $('.markTypes').val();
		$("#loading").css("display","block");
		let myTaskURL = window.kms_v2 + 'task/operation/claimTasks?markType=' + markType + '&user='+user.username;
	    $.ajax( {
	        type : "get",
	        url : myTaskURL,
	        async : true,
	        success : function(data) {
				$("#loading").css("display","none");
				if(data.code != '0'){
	        		util.errorView(data.message);
	        		return;
				}
				let task_length = data.result.activitiTaskIds.length;
	        	util.errorView("此次领取了"+task_length+"个任务",true);
				callback(data);
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	自动领取下一个质检或验收任务
	receiveChecked: function(checkValue){
		if(!checkValue.Id || !user.username){
			return;
		}
		var _data = {
			"action" : "claim",
			"assignee" : user.username
		}
	    $.ajax({
	        type : "post",
	        url : window.kms+'runtime/tasks/'+checkValue.Id,			//通过id进行任务申领
	        async : false,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(_data),
	        success : function(data) {
		        main.modalClose();
	            testAndCheck.Table( checkValue,testAndCheck.checkedType );
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    });
	},
	
//	撤回上一步的操作
	lastMark: function(){
		$('.image-mark-type').fadeOut(100);
		if(testAndCheck.imgMark.length > 0){
//			数组内最后一个元素的下标
			var num = testAndCheck.imgMark.length - 1;
			var new_num = testAndCheck.current_types.length - 1;
//			删除数组内最后一个元素
			testAndCheck.imgMark.splice(num,1);
			testAndCheck.imgHideMark.splice(num,1);
			testAndCheck.current_types.splice(new_num, 1); 
		}else{
			util.errorView("无法撤销上一步");
			return;
		}
		
		var canvas=document.getElementById('myCanvas');
		var ctx=canvas.getContext('2d');
		var height = canvas.height;
		var width = canvas.width;
		ctx.clearRect(0,0,width,height);
//		隐藏的canvas
		var canvasHide = document.getElementById('canvasHide');
		var ctxHide=canvasHide.getContext('2d');
		var hideHeight = canvasHide.height;
		var hideWidth = canvasHide.width;
		ctxHide.clearRect(0,0,hideWidth,hideHeight);
		
		for(let i=0; i<testAndCheck.imgMark.length; i++){
			let _type = testAndCheck.current_types[i].checkType || 'MarkQC';
			let img = new Image();
			img.src = "dist/img/arrow.png";
			if(_type == "MarkAcceptance"){
				img.src = "dist/img/arrow1.png";
			}
			setTimeout(function(){
				testAndCheck.newCanvas( testAndCheck.imgMark[i].x, testAndCheck.imgMark[i].y, "myCanvas", img );
				testAndCheck.newCanvas( testAndCheck.imgHideMark[i].x, testAndCheck.imgHideMark[i].y, "canvasHide", img );
			},100)
		}
		
//		for(var i=0; i<testAndCheck.imgMark.length; i++){
//			ctx.drawImage(img,testAndCheck.imgMark[i].x,testAndCheck.imgMark[i].y);
//		}
/*	    var canvas=document.getElementById('myCanvas');
		var ctx=canvas.getContext('2d');
		var img = new Image();
		img.src = "dist/img/arrow.png";
		img.setAttribute("crossOrigin",'Anonymous');
//		隐藏的canvas
		var canvasHide = document.getElementById('canvasHide');
		var ctxHide=canvasHide.getContext('2d');
//		重新绘制canvas
		ctx.drawImage(img,e.offsetX - 13,e.offsetY - 13);
		ctxHide.drawImage(img,e.offsetX - 13,e.offsetY - 13);*/
	},
	
	newCanvas: function(x,y,value,img){
		var canvas=document.getElementById(value);
		var ctx=canvas.getContext('2d');
		
        ctx.drawImage(img,x,y);
	},
	
	// 获取当前右键的箭头
	getTypeIndex: function(x, y){
		
		for(var i=0; i<testAndCheck.current_types.length; i++){
			var x_1 = testAndCheck.current_types[i].x_1,
				y_1 = testAndCheck.current_types[i].y_1,
				x_2 = testAndCheck.current_types[i].x_2,
				y_2 = testAndCheck.current_types[i].y_2;
			
			if( (x_1 <= x) && (y_1 <= y) && (x_2 >= x) && (y_2 >= y)  ){
				return i;
			}
		}
		
		return null;
		
	},
	
	// 格式化坐标
	formatGeo: function(data){
		var image_x = Number(data.image_x).toFixed(2);
		var image_y = Number(data.image_y).toFixed(2);
		var image_x_t = image_x - 0 + 32;
		var image_y_t = image_y - 0 + 32;
		var points = [
			image_x + " " + image_y,
			image_x_t + " " + image_y,
			image_x_t + " " + image_y_t,
			image_x + " " + image_y_t,
		];
		var geo = points.join(',');
		var new_data = {
			'errorType': data.errorType,
			'geom': 'POLYGON((' + geo + '))',
			'repairType': data.repairType,
			'checkType': data.checkType
		}
		
		return new_data;
	},
	
	// 弹出类型选择窗口
	dialogType: function(x, y){
		
		var index = testAndCheck.getTypeIndex(x, y);
		if(index === null){
			$('.image-mark-type').fadeOut(100);
			return;
		}
		
		testAndCheck.current_allow = index;
		var info = testAndCheck.current_types[index];
		var errorType = info.errorType;
		var repairType = info.repairType;
		var text = $('.image-mark-type .error-types input[value="' + errorType + '"]')[0].nextElementSibling.innerHTML;
		$('.image-mark-type h4').html(text);
		
		$('.image-mark-type .error-types input[value="' + errorType + '"]').prop("checked", true);
		$('.image-mark-type .repair-types input[value="' + repairType + '"]').prop("checked", true);
		$('.image-mark-type').css({
			'left': x,
			'top': y
		});
		$('.image-mark-type').fadeIn(100);
		
		
		
		// testAndCheck.current_types.push({
		// 	'x_1': e.offsetX,
		// 	'y_1': e.offsetY,
		// 	'x_2': e.offsetX + 32,
		// 	'y_2': e.offsetY + 32,
		// 	'errorType': '1',
		// 	'repairType': '1'
		// })
		
		// testAndCheck.current_allow = testAndCheck.current_types.length - 1;
		
	},
	
//	将base64格式的文件转为file文件流
	dataURLtoFile: function(dataurl, filename){
	    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
	        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	    while(n--){
	        u8arr[n] = bstr.charCodeAt(n);
	    }
	    return new File([u8arr], filename, {type:mime});
	}
}
