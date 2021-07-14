//点击标注历史
$(".imgMain").click(function(){
	$('.content-header h1').text('类型标注');
	imgMain.createTasks = {};
	imgMain.imageList = [];
	imgMain.getTags();
})
//标注系统的历史列表--可以进行导出统计


var imgMain = {
	
	imageView: {},
	
	historySign: {},
	
	historyIndex: null,
	
	imageIndex: 0,
	
	imageTaskId: null,
	
	taskCommit:{},
	
	imageSign: {},
	
//	图片列表
	imageList: [],
	
//	输入的图片所在路径
	imagePath: [],
    
//	获取所有可选择的错误类型
    getTags: function(){
	    imageList.imageName = [];
	    $.ajax( {
	        type : "get",
	        url : window.kms+'base/category/get',
	        async : true,
	        success : function(data) {
	        	imageList.imageName = data.result || [];
				imgMain.Table();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
				imgMain.Table();
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
    },
    
//	图像识别标注功能的模版
	Table: function(){
		imgMain.taskCommit = {};
		
	    var test = ` 
	    	<div class="testmodal"></div>
	        <div class="col-xs-12">
		        <div class="dataPath" style="width:100%;">
		            <!--<input type="text" id="input-path" class="form-control" placeholder="图片目录" onfocus="this.placeholder=''" onblur="this.placeholder='文件目录'" />-->
		            	
					<!--<button type="button" id="open-path" onclick="imgMain.openPath()" class="btn btn-info" title="打开目录">打开目录</button>-->
					
					<!--<button type="button" id="export-path" onclick="imgMain.downExport()" class="btn btn-warning" title="导出文件">导出文件</button>-->
					<button type="button" id="claimTask" class="btn btn-warning" title="领取任务">领取任务</button>
					<button type="button" id="gainTask" class="btn btn-info" title="获取标注任务">获取标注任务</button>
					<!--<button type="button" id="backTask" class="btn btn-warning" title="返回上次操作">返回上次操作</button>-->
					<!--<button type="button" id="handleLog" class="btn btn-danger" title="导出操作记录" style="float:right;">导出操作记录</button>-->
		        </div>
		        <!--左侧图片-->
	        	<div class="box box-info box-left">
	    			<div class="box-body">
	    			
    					<div class="body-left-header" style="height:5%;">
        					<h4 class="img-title">图片名称</h4>
    					</div>
    					
    					<div class="body-left-body">
    						
    					</div>
    					
    					<div class="body-left-footer">
					      	<a href="#" class="left-bar" title="上一张" onclick="imgMain.preImage()">
					        	<span class="glyphicon glyphicon-backward"></span>
					      	</a>
					      	<a href="#" class="right-bar" title="下一张" onclick="imgMain.nextImage()">
					        	<span class="glyphicon glyphicon-forward"></span>
					      	</a>
					      	<div class="allNumber">
					      		<input type="number" class="form-control beforeIndex" value="0" onkeydown="imgMain.jumpImage(event)" onblur="imgMain.jumpImage(event)">
					      		<span class="allIndex"> / 0</span>
					      	</div>
    					</div>
    					
	    			</div>
	    		</div>
		        <!--右侧类型-->
	        	<div class="box box-warning box-right">
	    			<div class="box-body" style="height:100%;">
	    			
	    			</div>
	    		</div>
	    	</div>
	    `;
	    
	    $('.content.container-fluid').html(test);
	    
	    /*一级类型切换*/
	    $('.box-right .box-body').on('click', '.category_list li a', function (e) {
        	let id = e.target.getAttribute('data-id');
        	/*对应样式修改*/
        	$('.category_list li a').removeClass('active');
        	$(this).addClass('active');
        	/*对应可选项变化*/
        	$('.tab-content').fadeOut(0);
        	$('.tab-content.tab-content-'+id).fadeIn(0);
		})
	    /*二级类型切换*/
	    $('.box-right .box-body').on('click', '.tab-content ul li a', function (e) {
        	let id = e.target.getAttribute('data-id');
        	/*对应样式修改*/
        	$('.tab-content ul li a').removeClass('active');
        	$(this).addClass('active');
        	/*对应可选项变化*/
        	$('.tab-content-list').fadeOut(0);
        	$('.tab-content-list.tab-content-list-'+id).fadeIn(0);
		})
	    /*三级类型选择*/
	    $('.box-right .box-body').on('click', '.tab-content .tab_child', function (e) {
        	let id = e.target.getAttribute('data-id'),
        		tag = e.target.getAttribute('name');
        	
        	/*对应样式修改*/
        	$('.tab-content-'+id+' .tab_child').removeClass('active');
        	$(this).addClass('active');
        	/*对应可选项变化*/
        	if(!imgMain.imageTaskId || !imgMain.taskCommit[imgMain.imageTaskId]){
				util.errorView("获取当前任务ID失败");
				return;
        	}
        	if(!imgMain.taskCommit[imgMain.imageTaskId]['property']){
        		imgMain.taskCommit[imgMain.imageTaskId]['property'] = {};
        	}
        	imgMain.taskCommit[imgMain.imageTaskId]['property'][id] = tag;
		})
//      提交所有标注任务
	    $('.box-right .box-body').on('click', '#submitTag', function (e) {
        	imgMain.submitTag();
		})
//      批量领取任务
        $('#claimTask').click(function () {
        	imgMain.receiveTasks();
        });
//      获取所有任务
        $('#gainTask').click(function () {
//      	imgMain.openPath();
        	imgMain.getMyMarkTasks();
        });
//      返回上次执行到的标注操作
        $('#backTask').click(function () {
        	imgMain.openPath(true);
        });
//      返回上次执行到的标注操作
        $('#handleLog').click(function () {
        	imgMain.handleLog();
        });
// 		左侧选项卡切换
		$(".body-right-body").click(function(e) {
			if ($(".body-right-body.list-group a.active").length > 0) {
				$(".body-right-body.list-group a.active").removeClass("active");
			}
			if(e.target.localName != "a"){
				$(e.target.parentNode).addClass("active");
			}else{
				$(e.target).addClass("active");
			}
			imgMain.submitMark();
		});
	},
	
	/*右侧类别初始化*/
	craftListInit: function(id=false){
		if(!id){
			imgMain.craftDomInit(imageList.imageName);
			return;
		}
		let _url = window.kms_v2 + 'base/craft/get?craftId=' + id;
		util.getAjax(_url, true, function(data){
			let result = [];
			if(data.code != '0'){
				util.errorView('工艺详情获取失败');
			}
			result = data.result.craft || [];
			if(!result.length){
				result = [];
			}
			imgMain.craftDomInit(result);
		})
	},
	
	/*右侧类别DOM初始化*/
	craftDomInit: function(data){
		let content_html = [];
		for(let i=0; i<data.length; i++){
			let tab_id = data[i].id,
				tab_info = data[i].info || [],
				tab_type = (tab_info[0] && tab_info[0].list) ? true : false;
			
			if(tab_type){
				content_html.push(`
		        	<div class="tab-content tab-content-${tab_id}">
						<ul> 
			                ${tab_info.map(f => `
				      			<li><a class="content_tabs" data-id="${f.firstClassTagId}">${f.name}</a></li> 
			                `).join('')}
					    </ul>
						
			            ${tab_info.map(f => `
						    <div class="tab-content-list tab-content-list-${f.firstClassTagId}"> 
				                ${f.list.map(d => `
								  	<a href="#" name="${d.id}" class="tab_child tab_child_${tab_id}" data-id="${tab_id}">${d.tag}</a>
				                `).join('')}
						    </div>
			            `).join('')}
		        	</div>
				`)
			}else{
				content_html.push(`
		        	<div class="tab-content tab-content-${tab_id}">
			            ${tab_info.map(f => `
						  	<a href="#" name="${f.id}" class="tab_child tab_child_${tab_id}" data-id="${tab_id}">${f.name}</a>
			            `).join('')}
		        	</div>
				`)
			}
		}
		
		let _html = `
			<div class="body-right-header">
				<ul class="category_list"> 
	                ${data.map(t => `
		      			<li><a class="title_tabs" data-id="${t.id}">${t.name}</a></li>
	                `).join('')}
			    </ul>
			</div>
            ${content_html.map(t => `
      			${t}
            `).join('')}
			
			<div class="body-right-footer">
				<button type="button" id="submitTag" class="btn btn-success" title="提交标注" style="margin-top:0px;float:right;">提交标注</button>
			</div>
		`;
	    $('.content.container-fluid .box-right .box-body').html(_html);
	    
	    $('.box-right .box-body .body-right-header .category_list li a').eq(0).addClass('active');
	    $('.box-right .box-body .tab-content').eq(0).css('display', 'block');
	    $('.box-right .box-body .tab-content>ul>li>a').eq(0).addClass('active');
	    $('.box-right .box-body .tab-content>div.tab-content-list').eq(0).css('display', 'block');
	    
		imgMain.markImage(imgMain.imageTaskId);					//获取是否已被标注
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
	openPath: function(junge=false){
		imgMain.taskCommit = {};
		$("#loading").css("display","block");
//		获取对应图片路径的所有图片列表
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/operation/claimTasks?markType=3&user=' +user.username,
//	        url : window.kms+'task/getTasksPics?user='+user.username,
	        async : true,
	        success : function(data) {
	        	imgMain.imageSign = {};
				$("#loading").css("display","none");
	        	if(data.code != '0'){
					util.errorView('申领任务失败：'+data.message);
	        		return;
	        	}
	        	imgMain.getMyMarkTasks();
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
	/*获取当前用户所有已申领的任务*/
	getMyMarkTasks: function(junge=false){
		$("#loading").css("display","block");
	    $.ajax( {
	        type : "get",
	        url : window.kms+'task/operation/getMyMarkTasks?user=' +user.username,
	        async : true,
	        success : function(data) {
	        	imgMain.imageSign = {};
	        	imgMain.historySign = {};
				$("#loading").css("display","none");
	        	if(data.code != '0'){
					util.errorView(data.message);
					return;
	        	}
	        	if(!data.result.activitiTaskInfos.length){
					util.errorView('当前用户下无任务');
					return;
	        	}
	        	let _data = data.result.activitiTaskInfos || [],
	        		new_data = [];
	        	imgMain.historySign = _data;
	        	for(let i=0; i<_data.length; i++){
	        		let taskId = _data[i].activitiTaskId,
	        			_json = _data[i].taskInfo,
	        			img_id = window.kms + 'org/file/getByOrgId?orgId=' + _json.orgId;
	        		_json['activitiTaskId'] = _data[i].activitiTaskId;
	        		_json['img_id'] = img_id;
	        		new_data.push(_json);
	        	}
	        	
	        	imgMain.imageList = new_data || [];
	        	imgMain.imageView = {};
	        	for(var i=0; i<new_data.length; i++){
	        		let taskInfo = new_data[i];
	        		let task_id = new_data[i].activitiTaskId;
	        		let img_tag = new_data[i].img_tag;
	        		imgMain.imageView[task_id] = (i+1);
	        		imgMain.taskCommit[task_id] = taskInfo;
	        	}
	        	var imgHtml = `
	        		<img src="" class="markImage" alt="标注图片" title="标注图片">
	        	`;
	        	$(".box-left .box-body .body-left-body").html(imgHtml);
	        	imgMain.defaultImage(junge);				//执行默认显示图片
	        	$('.markImage').on('mousewheel', function(event) {
	        		var mouseNum = event.originalEvent.deltaY;
	        		if(mouseNum > 0){
	        			imgMain.mousewheel(false);
	        			//缩小
	        		}else{
	        			imgMain.mousewheel(true);
	        			//扩大
	        		}
				});
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	        	
	},
	
//	标注图片的放大与缩小
	mousewheel: function(junge){
		var mouseImg = $(".markImageMax");
		if(!mouseImg.length){
			return;
		}
		var imageHeight = mouseImg[0].height;
		var imageWidth = mouseImg[0].width;
		if(junge){
			var width = imageWidth+10;
			mouseImg.css("width",(width+"px"));
		}else if(imageHeight>50){
			var width = imageWidth-10;
			mouseImg.css("width",(width+"px"));
		}
	},
	
//	默认显示第一张图片
	defaultImage: function(junge=false){
//		获取第一张图片
		imgMain.imageIndex = 0;
		if(junge && imgMain.historyIndex){
			imgMain.imageIndex = imgMain.historyIndex;
		}
//		执行修改图片src地址的事件
		imgMain.changeImage(imgMain.imageIndex,true);
	},
	
//	上一帧图片
	preImage: function(){
		if( (imgMain.imageIndex == 0) || (imgMain.imageList.length == 0) ){
			return;
		};
		$(".box-left>.box-body>.body-left-body>img").attr("style","");
		var thisIndex = imgMain.imageIndex - 1;					//得到上一帧图片的index
//		执行修改图片src地址的事件
		imgMain.changeImage(thisIndex,false);
	},
	
//	下一帧图片
	nextImage: function(){
		if( (imgMain.imageIndex == (imgMain.imageList.length - 1)) || (imgMain.imageList.length == 0) ){
			return;
		}
		$(".box-left>.box-body>.body-left-body>img").attr("style","");
		var thisIndex = imgMain.imageIndex + 1;					//得到下一帧图片的index
		imgMain.changeImage(thisIndex,false);			//执行修改图片src地址的事件
	},
	
//	跳转第几张图片
	jumpImage: function(e){
//		判断是否为数字
		var beforeNumber = Number( $(".beforeIndex").val() );
    	var patrn = /^[0-9]*$/;
	    if (patrn.exec(beforeNumber) == null || beforeNumber == "") {
	        return;
	    } else {
	        beforeNumber = beforeNumber - 1;
	    }
		$(".box-left>.box-body>.body-left-body>img").attr("style","");
//		执行跳转
		var ev = document.all ? window.event : e;
		if( (ev.keyCode == 13) || (ev.type == "blur") ) {
//			执行修改图片src地址的事件
			imgMain.changeImage(beforeNumber,false);
		}
	},
	
//	修改图片的src地址
	changeImage: function(index,junge = false){
		
		var ImageName = imgMain.imageList[index];		//根据index获取图片名称
		if(!ImageName){
			util.errorView("查询结果不存在");
			return;
		}
	    var ImageUrl = ImageName.img_id;
	    let craftId = ImageName.property.craftId;
	    
		imgMain.imageTaskId = ImageName.activitiTaskId;
//		判断图片的宽高
		var img = new Image();
		var taskName = ImageName.id+"("+ImageName.activitiTaskId+")";
		img.src = ImageUrl;
		if(junge){
			img.onload = function(){
				if(img.height > 600){
//					显示第一张图片
				   	$(".body-left-body img").attr("class","markImage");
				}else{
				   	$(".body-left-body img").attr("class","markImageMax");
				}
			};
			$(".allIndex").html(" / "+imgMain.imageList.length);	//显示当前所有图片数量
		}else{
//			上一张与下一张
			$(".markImage").attr('src','');			//根据获取到的图片地址修改当前图片src地址
			$(".markImageMax").attr('src','');			//根据获取到的图片地址修改当前图片src地址
			img.onload = function(){
				if(img.height > 600){
				   	$(".body-left-body img").attr("class","markImage");
				}else{
				   	$(".body-left-body img").attr("class","markImageMax");
				}
			};
			imgMain.imageIndex = index;							//更新当前图片的index
		};
		$(".markImage").attr('src',ImageUrl);					//根据获取到的图片地址修改当前图片src地址
		$(".markImageMax").attr('src',ImageUrl);				//根据获取到的图片地址修改当前图片src地址
//		显示数据
		$(".beforeIndex").val(index + 1);						//显示当前第几张图片
		$(".body-left-header .img-title").html(taskName);		//显示当前图片的名称
	    imgMain.craftListInit(craftId);
	},
	
//	csv文件下载
	downExport: function(){
//		不存在相对应路径则不向下执行
		if( !imgMain.imagePath || (imgMain.imagePath == "") ){
			if( $("#input-path").val() != "" ){
				imgMain.imagePath = $("#input-path").val();
			}else{
				return;
			}
		}
		
//		获取与路径相对应的csv文件并下载
	    $.ajax( {
	        type : "get",
	        url : window.tools_sys+'image/export?dirName='+imgMain.imagePath,
	        async : false,
	        success : function(data) {
	        	if( !data.code || (data.code == "0") ){
	        		window.open(window.tools_sys+'image/export?dirName='+imgMain.imagePath);
	        	}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	已经被标注过的图片进行回显
	markImage: function(taskId){
		$('.tab_child').removeClass('active');
		for(let i=0; i<imageList.imageName.length; i++){
			let id = imageList.imageName[i].id,
				property = imgMain.taskCommit[taskId]['property'] || {},
				value = property[id] || null;
			if(value){
				$('.tab_child_'+id+'[name="'+value+'"]').addClass('active');
			}
		}
	},
	
//	修改标注类型
	submitMark: function(){
		if( ($(".body-right-body.list-group a.active").length == 0) || (imgMain.imageList.length == 0) ){
			return;
		}
		var taskId = imgMain.imageTaskId;
		var submitImage = imgMain.imageList[imgMain.imageIndex];
		var markType = $(".body-right-body.list-group a.active")[0].name;
		var innerText = $(".body-right-body.list-group a.active")[0].innerText;
		imgMain.saveStorage(taskId, innerText);
		imgMain.taskCommit[taskId].img_tag = Number(markType);
	    imgMain.imageSign[taskId] = true;
	    imgMain.historySign[taskId] = Number(markType);
	    imgMain.historyIndex = imgMain.imageIndex;
//	    util.errorView("标记成功",true);
	},
	
//	提交标注类型
	submitTag: function(){
		if(!imgMain.imageList.length){
			return;
		}
		let jsondata = {
			'activitiTaskIdList': [],
			'taskInfoList': []
		}
		for(let activitiTaskId in imgMain.taskCommit){
			let index = imgMain.imageView[activitiTaskId],
				img_index = index - 1;
			for(let i=0; i<imageList.imageName.length; i++){
				let id = imageList.imageName[i].id,
					name = imageList.imageName[i].name,
					property = imgMain.taskCommit[activitiTaskId]['property'],
					value = property[id] || null;
				if(!value){
					let view = 'ID：' + activitiTaskId + ' 缺少' + name + '------>>自动跳转';
					util.errorView(view);
					$(".beforeIndex").val(img_index);
					imgMain.changeImage(img_index, false);
					return;
				}
			}
			delete imgMain.taskCommit[activitiTaskId]['activitiTaskId'];
			delete imgMain.taskCommit[activitiTaskId]['img_id'];
			jsondata.activitiTaskIdList.push(activitiTaskId);
			jsondata.taskInfoList.push(imgMain.taskCommit[activitiTaskId]);
		}
		$("#loading").css("display","block");
//		获取对应图片路径的所有图片列表
	    $.ajax( {
	        type : "post",
	        url : window.kms+'task/operation/commitClassifyTasks?user='+user.username,
        	async : true,
			contentType: "application/json; charset=utf-8",
	        data : JSON.stringify(jsondata),
	        success : function(data) {
				$("#loading").css("display","none");
				if( (data.code==0) || (data.code=="0") ){
					imgMain.historySign = {};
					imgMain.historyIndex = null;
					util.errorView("提交成功",true);
					imgMain.Table();
				}else{
//					util.errorView("该任务已被提交",false);
//					imgMain.Table();
					imgMain.errorSign(data.message);
//					util.errorView(data.message);
				}
	        },
		   	error: function(XMLHttpRequest, textStatus, errorThrown) {
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus)
		   	},
	    })
	},
	
//	未进行标注分类的任务提示
	errorSign: function(message){
		var arr = [];
		for(var item in imgMain.imageSign){
			if(!imgMain.imageSign[item]){
				var taskIndex = imgMain.imageView[item];
				arr.push( taskIndex+"," );
			}
		}
		var thisHtml = message;
		if(arr.length){
			var thisStr = "";
			for(var i=0; i<arr.length; i++){
				thisStr += arr[i];
			}
			thisHtml = message+" -- "+thisStr;
		}
		util.errorView(thisHtml);
	},
	
//	储存本地localStorage
	saveStorage: function(taskId, value){
		var dataTag = {},
	    	storage = window.localStorage;
	    if(storage.imgTags){
	    	dataTag = JSON.parse(storage.imgTags);
//	    	storage.removeItem("shpDatas");
	    }
	    if(dataTag[taskId]){
	    	dataTag[taskId] += (', '+value);
	    }else{
	    	dataTag[taskId] = value;
	    }
	    var d = JSON.stringify(dataTag);
	    storage.setItem("imgTags",d);
	},
	
//	从localStorage获取并导出操作记录
	handleLog: function(){
		var fileName = "我是操作记录！！！(微笑)",
			dataTag = JSON.parse(window.localStorage.imgTags),
			dataArr = [];
		for(var item in dataTag){
			dataArr.push({
				"taskId": item,
				"taskLog": dataTag[item]
			})
		}
		var tableHtml = `${dataArr.map(d => `${d.taskId}: ${d.taskLog} \r\n`).join('')}`;
		
        var blob = new Blob([tableHtml], { type: "txt/plain;charset=utf-8" });
      	var a = document.createElement("a"), 				//创建a标签
          	e = document.createEvent("MouseEvents"); 		//创建鼠标事件对象
      	e.initEvent("click", false, false); 				//初始化事件对象
      	a.href = URL.createObjectURL(blob); 				//设置下载地址
      	a.download = fileName+".txt"; 						//设置下载文件名
      	a.dispatchEvent(e); 								//给指定的元素，执行事件click事件
	}
	
}
