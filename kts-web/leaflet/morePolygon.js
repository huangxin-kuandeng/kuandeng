
//监控服务列表
var morePolygon = {
	
	kd_tag_switch: false,
	
	surveyTrackPoint: [],			//补采标-点-显示
	
	selectTaskFrame: null,
	
	count_data: [],
	
	city_layers: {},
	
	city_range: [],
	
	check_Form_layer: [],			//所定位的覆盖物进行缓存，修改颜色所需要
	
	deletePolyline: [],
	
	versionList: [],			//版本列表list
	
	thisVersion: null,			//当前以选择的版本号
	
	distanceType: null,
	
	deleteNum: [],
	
	changePath: {},
	
	cacheDataOne: {
		"data":{
			"geometry":{
				"coordinates":[
					[
						[116.22977256774904,40.164903855886365],
						[116.24513626098634,40.164903855886365],
						[116.24513626098634,40.175266452563086],
						[116.22977256774904,40.175266452563086],
						[116.22977256774904,40.164903855886365]
					]
				],
				"type":"Polygon"
			},
			"type":"Feature",
			"properties":{
				"rangeIndex":-1,
				"rangeType":-1,
				"businessType":0,
				"trackIds":"",
				"totalIndex":-1,
				"rangeName":"",
				"meshList":[""],
				"meshId":""
			}
		},
		"adcode":"",
		"_id":"manual_110000_new",
		"source":0,
		"version":2,
		"timestamp":""
	},
	
	cacheData: [],					//缓存所查询的任务数组
	
	rangeList: {},					//加载的json文件-框的参数缓存
	
	cacheRange: 0,
	
	leafletType: false,
	
	drawType: "",
	
	layersArr: {},

	selectCutPolygon: null,//用于记录裁剪源对象

    selectPolygons: [],//面裁剪选择的两个面对象

//	创建新任务功能
	Table: function(){
		morePolygon.city_range = [];
	    var test2 = ` 
	    	<div class='testmodal'></div>
	    	<div class='passwordmodal'></div>
        	<div class="rangeList">
        		<h4 style="padding:10px;">
        			<span style="margin-right:20px;">范围列表</span>
        		</h4>
				<div class="form-group" style="line-height:30px;margin-bottom:10px;height:30px;">
					<label for="rangeName" class="col-sm-5 control-label" style="white-space: nowrap;text-align-last: justify;" >名称:</label>
					<div class="col-sm-7">
						<input type="text" class="form-control" id="rangeName" placeholder="根据名称查询过滤" onfocus="this.placeholder=''" onblur="this.placeholder='根据名称查询过滤'">
					</div>
				</div>
				<button type="button" id="searchRange" class="btn btn-default" style="margin-left:15px;margin-top:10px;">
					<font><font>搜索任务</font></font>
				</button>
				<div class="tableRange" style="padding:5px;max-height:670px;border:1px solid;margin-top:20px;">
					
				</div>
        	</div>
	        <div id="checkFormOn" style="position: absolute;z-index: 1110;right: 230px;background: #fff;padding: 5px;bottom:0px;">
	        	<span class="glyphicon glyphicon-chevron-up" title="打开质检报表" href="#" style="color:gray;cursor:pointer;" onclick="morePolygon.openCheck(1)"></span>
	        </div>
	        <div id="checkForm" style="position: absolute;z-index: 1111;right: 230px;background: #fff;padding: 5px;bottom:0px;display:none;width:600px;">
	        
	        </div>
			<div id="on-off" class="sourceModal" style="position: absolute;z-index: 1111;left: 450px;background: #fff;padding: 5px;top:10px;">
				<div class="col-sm-7" style="width:105px;float:left;padding:0px;margin-left:5px;">
					<input type="text" class="form-control cityValue" name="" style="height:34px;vertical-align:middle;width:100px;float:left;margin-left:5px;" value="选择城市" readonly>
				</div>
				<div class="taskDiv" style="float:left;">
					<select class="form-control rangeTypes" title="任务框附加属性">
			            <option value="0">未知</option>
			            <option value="1">桥</option>
			            <option value="2">高速</option>
			            <option value="3">主路</option>
			            <option value="4">路口</option>
					</select>
					<select class="form-control collectionType" style="float:left;width:120px;margin:0px 5px;" disabled="disabled">
			            <option value="0">自动组网</option>
			            <option value="1">量产</option>
		            </select>
					
					<select class="form-control versionSelect" style="float:left;width:150px;margin-right:5px;">
            			<option value="">请选择版本号</option>
		            </select>
					<div class="btn-group drawLayers" data-toggle="buttons" style="float:left;">
						<label class="btn btn-primary active">
							<input type="radio" value=""> 关闭
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="rect" title="矩形默认补充桥属性"> 矩形
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="polygon"> 多边形
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="cutPolygonByLine"> 线裁剪
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="cutPolygonByArea"> 面裁剪
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="cutRectByArea"> 拉框裁剪
						</label>
						<label class="btn btn-primary">
							<input type="radio" value="rangeFind"> 测距
						</label>
						<!--<label class="btn btn-primary">
							<input type="radio" value="isBridge"> 桥属性
						</label>-->
					</div>
					<!--
					<div style="border: 1px solid #ccc;float:left;">
						<span style="float:left;">框属性</span>
						<select class="form-control taskFrameType" style="float:left;width:80px;margin:0px 5px;padding:0px;border:0px;" title="切换选项后按shift点击对应框赋予当前属性">
				            <option value="">无</option>
				            <option value="1">桥</option>
				            <option value="2">主路</option>
				            <option value="3">普通道路路口</option>
				            <option value="4">普通道路主路</option>
			            </select>
					</div>
					-->
					<!-- 
					<button type="button" class="btn btn-default dataLoading" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>数据装载</font></font>
					</button>
					<button type="button" class="btn btn-warning dataText" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>坐标导出</font></font>
					</button>
					<button type="button" class="btn btn-danger clearData" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>清除数据</font></font>
					</button>
					 -->
					<button type="button" class="btn btn-success submitData" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>保存</font></font>
					</button>
					<!-- 
					<button type="button" class="btn btn-danger deleteVersion" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>删除当前版本</font></font>
					</button>
					 -->
					<button type="button" class="btn btn-danger clearPolyline" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>清除测距</font></font>
					</button>
					<button type="button" class="btn btn-warning checkTable" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>质检报表</font></font>
					</button>
					<button type="button" class="btn btn-default city_range" style="height:34px;border:1px solid #d2d6de;margin-left:5px;float:left;">
						<font><font>城市边界</font></font>
					</button>
					<label style="max-height:40px;overflow:hidden;line-height:20px;padding:5px;">
						<input type="checkbox" class="kd_tag_switch">
						<span style="float:left;"></span>
						<b>标记开关</b>
					</label>
				</div>
			</div>
			<div id="leaflet-map" style="width: calc(100% - 630px) !important;top: 0px;height: 100% !important;left:400px;">
				
			</div>
	    `;
	
	    $('.content.container-fluid').html(test2);
		morePolygon.layersArr = {};
		morePolygon.rangeList = {};
	    morePolygon.createMap();
	    
//		修改版本--克隆，新增版本
		$(".versionSelect").on("change", function(e) {
			if(e.target.value == "copy"){
				morePolygon.cloneVersion();
			}else if(e.target.value != ""){
				morePolygon.polygonData();
			}
		});
	    
//		修改任务框属性取值
		$('select.rangeTypes').on("change", function(e) {
			morePolygon.taskFrameTypeChange();
		});
	    
//		标记的开关显示
		$(".kd_tag_switch").on("click", function(e) {
			morePolygon.kd_tag_switch = this.checked;
            if(morePolygon.kd_tag_switch){
            	morePolygon.domFindTrack();
            }else{
				for(var i=0; i<morePolygon.surveyTrackPoint.length; i++){
					var leaflet_id = morePolygon.surveyTrackPoint[i].leaflet_id,
						layerOne = leafletMap.editTools.featuresLayer._layers[leaflet_id] || leafletMap._layers[leaflet_id];
					layerOne && layerOne.remove();
				}
				morePolygon.surveyTrackPoint = [];
            }
		});
	    
//		删除当前版本
		$(".deleteVersion").click(function(e) {
			morePolygon.deleteVersion();
		});
	    
//		获取城市边界
		$(".city_range").click(function(e) {
			morePolygon.get_citys();
		});
	    
//		清除所有测距线
		$(".clearPolyline").click(function(e) {
			for(var i=0; i<morePolygon.deletePolyline.length; i++){
				var _leafletId = morePolygon.deletePolyline[i];
		  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leafletId] || leafletMap._layers[_leafletId];
		  		layersOne.remove();
			}
			morePolygon.deletePolyline = [];
		});
	    
//		查看质检报表
		$(".checkTable").click(function(e) {
        var adcode = $(".cityValue")[0].name,
        	collectionType = $(".collectionType option:selected").val(),
        	thisVersion = $(".versionSelect option:selected").val(),
            check_url = configURL.kcs_fusion_online+"check/tasks/border?env=1&output=json&queryType=1&param="+adcode+"&version="+thisVersion;
			if(!adcode || !thisVersion){
				util.errorView("缺少查询参数",false);
				return;
			}
			$("#loading").css("display","block");
			$.getAjax(check_url,true,function(data){
				$("#loading").css("display","none");
				if(data.code == 0){
					morePolygon.check_Form(data.result);
				}else{
					util.errorView(data.message,false);
				}
			})
			
		});
//		地域搜索
		$(".drawLayers label").click(function(e) {
			var type = e.target.firstElementChild.value;
			morePolygon.selectChange(type);
		});
//		地区搜索定位
		$("#inputName4").keydown(function(e) {
			var ev = document.all ? window.event : e;
			if(ev.keyCode==13) {
				morePolygon.search(false);
			}
		});
//		数据装载
		$(".collectionType").on("change", function() {
            morePolygon.domFindData();
		});
//		数据装载
		$(".dataLoading").on("click", function() {
            morePolygon.dataLoading();
		});
//		更新提交
		$(".submitData").on("click", function() {
            morePolygon.savaView();
		});
//		查询过滤根据名称
		$("#searchRange").on("click", function() {
//          if(morePolygon.cacheRange){
//          	morePolygon.savaView(morePolygon.searchData);
//          }else{
            	morePolygon.searchData();
//          }
            console.log("查询过滤")
		});
//		选择城市
	    $('.cityValue').on('click', function () {
            var rect = $(".cityValue")[0].getBoundingClientRect();
            citypicker.show({
                top: rect.top + rect.height,
                left: rect.left
            }, function(cityname, city){
//              if(morePolygon.cacheRange){
//              	morePolygon.savaView(morePolygon.polygonData,city);
//              	return;
//              }
				morePolygon.cacheRange = 0;
				morePolygon.deleteNum = [];
				morePolygon.city_range = [];
            	var adcode = city.adcode,
            		centerNode = [city.loc[1],city.loc[0]];
                $(".cityValue").val(cityname);
                $(".cityValue")[0].name = adcode;
                
                morePolygon.domFindData();
                if(morePolygon.kd_tag_switch){
                	morePolygon.domFindTrack();
                }
//             	morePolygon.polygonData(adcode);
                
                if(!city) return ;
				leafletMap.setView(centerNode);
            })
        })
	    /*
	     * 地图上拉框查询
	     */
	    $(".dataText").on("click", function() {
            morePolygon._rangeDiv();
		});
	    $(".clearData").on("click", function() {
            morePolygon.clearData();
		});
	},
	
//	获取城市边界
	get_citys: function(){
		var _type = null;
		for(var item in morePolygon.city_layers){
			_type = true;
			morePolygon.city_layers[item].remove();
		}
		morePolygon.city_layers = {};
		if(!morePolygon.city_range.length){
			util.errorView("获取城市边界失败");
			return;
		}else if(_type){
			return
		}
		if(!leafletMap.getPane('pane_0')){
			leafletMap.createPane('pane_0');
			leafletMap.getPane('pane_0').style.zIndex = 300;
		}
		for(var i=0; i<morePolygon.city_range.length; i++){
			var _range = "POLYGON(("+morePolygon.city_range[i]+"))",
				locs = $.leafletRange(_range,true),
				styleColor = {
					"color": "yellow",
					"fillOpacity": "0.6",
					"type": "polygon",
					"weight": 2,
					"index": i
				};
			var json_china = {
			  	"type": "Feature",
			  	"geometry": {
			    	"type": "Polygon",
			    	"coordinates": [locs]
			  	},
			  	"properties": {
					"color": "yellow",
					"fillOpacity": "0.6",
					"type": "polygon",
					"weight": 2
			  	}
			}
			var layer_0 = new L.geoJson(json_china, {
			    attribution: '<a href=""></a>',
			    pane: 'pane_0',
			    style: style_0
			});
			console.log(layer_0)
			layer_0.addTo(leafletMap);
			var _path_id = layer_0._leaflet_id;
			morePolygon.city_layers[_path_id] = layer_0;
		}
		function style_0() {
		    return {
		        pane: 'pane_0',
		        opacity: 0.6,
		        color: 'red',
		        dashArray: '',
		        lineCap: 'butt',
		        lineJoin: 'miter',
		        weight: 2.0,
		        fillOpacity: 0.6,
		        fillColor: 'yellow',
		    }
		}
	},
	
//	获取版本列表
	domFindData: function(){
		var adcode = $(".cityValue")[0].name,
			collectionType = $(".collectionType option:selected").val(),
			thisUrl = configURL.task_frame+"lane_line_merge/getVersions?collectionType="+collectionType+"&adcode="+adcode;
		morePolygon.versionList = [];
		if(adcode && collectionType){
			$("#loading").css("display","block");
			$.getAjax(thisUrl,true,function(data,adcode){
				if(data.code == 0){
					morePolygon.versionList = data.results[adcode] || [];
					versionHtml();
				}else{
					$("#loading").css("display","none");
					util.errorView("查询失败"+data.code);
				}
			},adcode)
		}else{
			versionHtml();
		}
		
		function versionHtml(){
			var city_url = configURL.kd_regionsearch+"region/search?adcode="+adcode;
			$.getAjax(city_url,true,function(data){
				$("#loading").css("display","none");
				if(data.code == 0){
					for(var i=0; i<data.result.region.length; i++){
						var _range = data.result.region[i],
							reg_1 = new RegExp( "," , "g" ),
							reg_2 = new RegExp( ";" , "g" );
						_range = _range.replace(reg_1," ");
						_range = _range.replace(reg_2,",");
						morePolygon.city_range.push(_range)
					}
				}
				var options = `
		            <option value="">请选择版本号</option>
		            ${morePolygon.versionList.map(d => `
		                <option value=${d}>版本 ${d}</option>
		            `).join('')}
		            <!--<option value="copy" style="color:purple">版本克隆</option>-->
				`;
				$(".versionSelect").html(options);
				$(".versionSelect").val("6");
				morePolygon.polygonData();
			})
		}
	},
	
//	装载数据
	dataLoading: function(){
		$("#loading").css("display","block");
        var adcode = $(".cityValue")[0].name,
        	collectionType = $(".collectionType option:selected").val(),
        	thisVersion = Number( $("#versionNum").val() ),
        	thisUrl1 = configURL.task_frame+"lane_line_merge/loadDataFormDisk";
        var jsonData = {
        	"adcode": adcode,
        	"collectionType": collectionType,
        	"version": thisVersion,
        	"source": 0
        }
		$.postAjax(thisUrl1,jsonData,function(data){
			$("#loading").css("display","none");
			if(data === 0){
				util.errorView("装载完成",true);
			}else{
				util.errorView("装载失败",true);
			}
		})
	},
	
//	过滤已经查询到的任务框信息
	searchData: function(){
		var rangeName = $("#rangeName").val();
		var newData = morePolygon.cacheData.filter(function(data){
			return data._id.indexOf(rangeName) > -1;
		})

		for(var item in morePolygon.layersArr){
	    	var _leaflet_id = morePolygon.layersArr[item],
	    		layerOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			layerOne.remove();
		}

		morePolygon.layersArr = {};
		var styleColor = {
				"fill": "#87CEFF",
				"stroke": "#87CEFF",
				"fillOpacity": "0.6",
				"weight": 2,
				"type": "polygon"
			};
		for(var i=0; i<newData.length; i++){
			styleColor.type = "polygon";
			var range1 = newData[i].data.geometry.coordinates[0],
				businessType = newData[i].data.properties.businessType || "0",
				thisRange = [];
			for(var l=0; l<range1.length; l++){
				thisRange.push([range1[l][1],range1[l][0]])
			}
			// if( (4<thisRange.length) && (thisRange.length<7) ){
			// 	if( util.isRectangle(thisRange) && (businessType == "1") ){
			// 		styleColor.type = "rect";
			// 		var new_node = util.rect_node(thisRange);
			// 		thisRange = [new_node[2],new_node[0]];
			// 		var polygon = L.rectangle(thisRange, styleColor).addTo(leafletMap);
			// 	}else{
			// 		var polygon = L.polygon(thisRange, styleColor).addTo(leafletMap);
			// 	}
			// }else{
				var polygon = L.polygon(thisRange, styleColor).addTo(leafletMap);
			// }
			var _path_id = polygon._path._leaflet_id;
			morePolygon.layersArr[_path_id] = polygon._leaflet_id;
			newData[i]['_path_id'] = _path_id;
			morePolygon.rangeList[_path_id] = newData[i];
		}
		morePolygon.leftTasks(newData);
		
	},
	
//	加载该城市所有的框(可修改)---存在未保存的数据先进行提示
	polygonData: function(){
        var adcode = $(".cityValue")[0].name,
        	collectionType = $(".collectionType option:selected").val(),
        	thisVersion = $(".versionSelect option:selected").val(),
			fileJson = configURL.task_frame+"lane_line_merge/query?businessType=0&collectionType="+collectionType+"&param="+adcode+"&version="+thisVersion;
			_fileJson = configURL.task_frame+"lane_line_merge/queryV2";
		if(!thisVersion || !morePolygon.city_range.length){
			return;
		}
		
		morePolygon.changePath = {};
		morePolygon.deleteNum = [];
		morePolygon.cacheRange = 0;
		morePolygon.thisVersion = thisVersion;
		$("#loading").css("display","block");
		for(var item in morePolygon.layersArr){
	    	var _leaflet_id = morePolygon.layersArr[item],
	    		layerOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
	    	if(layerOne){
				layerOne.remove();
	    	}
		}
		
		/*var _multiPolygon = '',
			_latlngs = [];
		for(var l=0; l<morePolygon.city_range.length; l++){
			_latlngs.push("(("+morePolygon.city_range[l]+"))");
		}
		_multiPolygon = "MULTIPOLYGON("+_latlngs.join(",")+")";*/
		
		promise_step();
		morePolygon.count_data = [];
		morePolygon.layersArr = {};
		morePolygon.rangeList = {};
		
		function promise_step(num=0){
        	var param = {
        		data: {
					"param": adcode,
					"queryType": 0,				//1为polygon，0为adcode
					"version": thisVersion
        		},
        		type: "post",
        		url: _fileJson
			}
			$._ajaxPromise(param).then(res => {
				file_data(res);
				morePolygon.cacheData = morePolygon.count_data;
				morePolygon.leftTasks(morePolygon.count_data);
				$("#loading").css("display","none");
				console.log("数据加载完成");
		    }).catch(err => {
				morePolygon.cacheData = morePolygon.count_data;
				morePolygon.leftTasks(morePolygon.count_data);
		        console.log("获取数据失败");
				$("#loading").css("display","none");
		    })
		    /*
			if(morePolygon.city_range[num]){
	        	var param = {
	        		data: {
						"param": morePolygon.city_range[num],
						"queryType": 1,
						"version": thisVersion
	        		},
	        		type: "post",
	        		url: _fileJson
				}
				$._ajaxPromise(param).then(res => {
					file_data(res);
			        console.log("范围"+num+"修改成功");
			        num++;
			        promise_step(num);  
			    }).catch(err => {
					morePolygon.cacheData = morePolygon.count_data;
					morePolygon.leftTasks(morePolygon.count_data);
			        console.log("部分数据获取失败");
					$("#loading").css("display","none");
			    })
			}else{
				morePolygon.cacheData = morePolygon.count_data;
				morePolygon.leftTasks(morePolygon.count_data);
				$("#loading").css("display","none");
				console.log("所有数据加载完成");
			}*/
		}
//		$.postAjax(_fileJson,post_data,function(data){
//		$.getAjax(fileJson,true,function(data){
		function file_data(data){
			/*$("#loading").css("display","none");*/
			if(!data.results){
				util.errorView("查询失败");
				return;
			}
			
			/*for(var item in morePolygon.layersArr){
		    	var _leaflet_id = morePolygon.layersArr[item],
		    		layerOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
				layerOne.remove();
			}
			morePolygon.layersArr = {};
			morePolygon.rangeList = {};*/
			var styleColor = {
					"color": "#87CEFF",
					"fillOpacity": "0.6",
					"type": "polygon",
					"weight": 2,
					"businessType": "0"
				};
//			morePolygon.cacheDataOne = data.results[0];
			for(var i=0; i<data.results.length; i++){
				styleColor.type = "polygon";
				styleColor.color = "#87CEFF";
				styleColor.fillOpacity = "0.6";
				styleColor.businessType = "0";
//				styleColor['text'] = data.results[i]._id || '';
				var range1 = data.results[i].data.geometry.coordinates[0],
					businessType = data.results[i].data.properties.businessType,
					thisRange = [];
                if(businessType == "1"){
                    styleColor.color = "rgb(51, 136, 255)";
                    styleColor.fillOpacity = "0.2";
                    styleColor.businessType = "1";
				}
      //           if(businessType == "1"){
      //               styleColor.color = "rgb(51, 136, 255)";
      //               styleColor.fillOpacity = "0.2";
      //               styleColor.businessType = "1";
      //               var max = null;
      //               var min = null;
      //               for (var l = 0; l < range1.length; l++) {
      //                   // thisRange.push([range1[l][1], range1[l][0]]);
						// max = max != null ? [Math.max(max[0], range1[l][1]), Math.max(max[1], range1[l][0])] : [range1[l][1], range1[l][0]];
						// min = min != null ? [Math.min(min[0], range1[l][1]), Math.min(min[1], range1[l][0])] : [range1[l][1], range1[l][0]];
      //               }
      //               thisRange.push(max);
      //               thisRange.push([max[0], min[1]]);
      //               thisRange.push(min);
      //               thisRange.push([min[0], max[1]]);
      //               thisRange.push(max);
      //           } else {
                    for (var l = 0; l < range1.length; l++) {
                        thisRange.push([range1[l][1], range1[l][0]]);
                    }
                // }

				// if( (4<thisRange.length) && (thisRange.length<7) ){
				// 	if( util.isRectangle(thisRange) && (businessType == "1") ){
				// 		styleColor.type = "rect";
				// 		var new_node = util.rect_node(thisRange);
				// 		thisRange = [new_node[2],new_node[0]];
				// 		var polygon = L.rectangle(thisRange, styleColor).addTo(leafletMap);
				// 	}else{
				// 		var polygon = L.polygon(thisRange, styleColor).addTo(leafletMap);
				// 	}
				// }else{
					var polygon = L.polygon(thisRange, styleColor).addTo(leafletMap);
				// }
				
				var _path_id = polygon._path._leaflet_id,
					_leaflet_id = polygon._leaflet_id;
				morePolygon.layersArr[_path_id] = _leaflet_id;
				morePolygon.rangeList[_path_id] = data.results[i];
				data.results[i]['_path_id'] = _path_id;
				morePolygon.count_data.push(data.results[i])
			}
			/*morePolygon.cacheData = data.results;
			morePolygon.leftTasks(data.results);*/
		}/*)*/
	},
	
	/*更新任务框属性取值*/
	taskFrameTypeUpdate: function(){
		let path_id = morePolygon.selectTaskFrame._path_id,
			businessType = morePolygon.selectTaskFrame.data.properties.businessType || "0";
		$('select.rangeTypes').val(businessType);
	},
	
	/*修改任务框属性取值*/
	taskFrameTypeChange: function(){
		if(morePolygon.selectTaskFrame){
			let new_value = $('select.rangeTypes').val(),
				path_id = morePolygon.selectTaskFrame._path_id,
				_leaflet_id = morePolygon.layersArr[path_id],
				layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			
			if(!morePolygon.changePath[path_id]){
				morePolygon.cacheRange++;
			}
			morePolygon.selectTaskFrame.data.properties.businessType = new_value;
			morePolygon.changePath[path_id] = morePolygon.selectTaskFrame;
			
			layersOne && layersOne.setStyle({"color":"red"});
		}
	},
	
//	框的列表展示
	leftTasks: function(data){
		let cn_range_type = {
			'0': '未知',
			'1': '桥',
			'2': '高速',
			'3': '主路',
			'4': '路口'
		};
//		列表复选任务功能
        var listModel = `
			<table id="example2" class="table table-bordered">
		        <thead>
			        <tr>
		                <!--<th style="white-space:nowrap;">优先级</th>-->
		                <th style="white-space:nowrap;">ID</th>
		                <th style="white-space:nowrap;">adcode</th>
		                <th style="white-space:nowrap;">属性</th>
		                <th style="white-space:nowrap;">定位</th>
			        </tr>
		        </thead>
		        <tbody>
	                ${data.map(m => `
			            <tr class="tooltipName">
			            	<td class="id" title="${m._path_id}">${m._id}</td>
			            	<td class="taskname" title="${m.adcode}">${m.adcode}</td>
			            	<td class="rangeTypeCn" title="${cn_range_type[m.data.properties.businessType] || m.data.properties.businessType || '类型不识别'}">${cn_range_type[m.data.properties.businessType] || m.data.properties.businessType || '*'}</td>
			            	<td class="mapCenter">
								<a class="glyphicon glyphicon-chevron-right" title="点击进行定位" name="${m._path_id}" href="#" style="color:gray"></a>
			            	</td>
			            </tr>
	                `).join('')}
		        </tbody>
		    </table>
        ` || "";
        $(".rangeList .tableRange").html(listModel);
		
        $('#example2').DataTable({
			'language'    	: window.lang,
            'paging'      	: true,
            'lengthChange'	: false,
            'searching'   	: false,
            'ordering'    	: false,
            'info'        	: true,
	        'pagingType'  	: "simple",
	        "lengthMenu"	: [10],
            'autoWidth'   	: false
        });
//		点击复选框执行
	    $('.tableRange #example2 tbody').on('click', 'tr td.mapCenter a', function () {
	    	var _path_id = this.name,
	    		_leaflet_id = morePolygon.layersArr[_path_id],
	    		layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
	    		_center = layersOne._latlngs[0][0],
	    		_centerNode = [_center.lat, _center.lng];
	    		
			leafletMap.setView(_centerNode);
	    });
	},
	
//	切换绘制方式--关闭绘制/绘制矩形/绘制多边形
	selectChange: function(type){
		leafletMap.editTools.stopDrawing();
		morePolygon.drawType = type;
		if(type === "rect"){
			leafletMap.editTools.startRectangle();
		}else if(type === "polygon"){
			leafletMap.editTools.startPolygon();
		}else if(type === "cutPolygonByLine"){
            // leafletMap.editTools.startPolyline();
            this.selectCutPolygon = null;
		}else if (type === "cutPolygonByArea"){
            this.selectPolygons = [];
            util.errorView("请在地图上选择两个面，请注意选择顺序！", true);
        }else if(type === "rangeFind"){
			leafletMap.editTools.startPolyline();
		}else if(type === "cutRectByArea"){
            this.selectPolygons = [];
			leafletMap.editTools.startRectangle();
		}
	},
	
//	增加map地图模版 
	createMap: function(){
		$.mapLeaflet('leaflet-map',"polygon",function(){
//			leafletMap.addControl(new L.NewRectangleControl());
	    	console.log("地图初始化完成");
	    	
			leafletMap.on('click', function(e) {
			  	var path_id = e.originalEvent.target._leaflet_id,
			  		ctrlKey = e.originalEvent.ctrlKey,
			  		altKey = e.originalEvent.altKey,
			  		shiftKey = e.originalEvent.shiftKey,
					_leaflet_id = morePolygon.layersArr[path_id];
			  	if(_leaflet_id && path_id && ctrlKey && altKey){
			  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			  		layersOne.remove();
	        		var adcode = $(".cityValue")[0].name,
			  			id_1 = "manual_"+adcode+"_new";
			  		if(morePolygon.changePath[path_id] && morePolygon.cacheRange && (morePolygon.rangeList[path_id]._id==id_1)){
			  			morePolygon.cacheRange--;
			  			delete morePolygon.changePath[path_id];
			  		}else{
			  			morePolygon.deleteNum.push(morePolygon.rangeList[path_id]._id);
			  			if(morePolygon.changePath[path_id]){
			  				morePolygon.cacheRange--;
			  				delete morePolygon.changePath[path_id];
			  			}
			  		}
				    delete morePolygon.layersArr[path_id];
				    delete morePolygon.rangeList[path_id];
			  	}/*else if(_leaflet_id && path_id && shiftKey){
			  		
			  		var thisInfo = {
			  			"_id": morePolygon.rangeList[path_id]._id
			  		}
			  		infoOpen.update(thisInfo);
			  		
			  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			  		var geo_json = {
			  			"polygon": morePolygon.leafletMouseup( layersOne._latlngs[0] ),
			  			"_id": morePolygon.rangeList[path_id]._id
			  		};
			  		
					if(morePolygon.drawType == "isBridge"){
						if(!morePolygon.changePath[path_id]){
							morePolygon.cacheRange++;
						}
						var isBridge = morePolygon.rangeList[path_id].data.properties.isBridge;
						if(isBridge == true){
							morePolygon.rangeList[path_id].data.properties.isBridge = false;
						}else{
							morePolygon.rangeList[path_id].data.properties.isBridge = true;
						}
						morePolygon.changePath[path_id] = morePolygon.rangeList[path_id];
						layersOne.setStyle({"color":"red"});
					}
					
			  		console.log(geo_json);
			  		if(layersOne.enableEdit){
						if(morePolygon.cacheRange > 98){
							morePolygon.savaView();
							return;
						}
//		  				layersOne.enableEdit();
//						layersOne.disableEdit();
		  				layersOne.toggleEdit();
			  		}
			  	}*/else if(_leaflet_id && path_id){
			  		
			  		/*根据点击的任务框--实时改变当前任务框属性的取值*/
			  		morePolygon.selectTaskFrame = morePolygon.rangeList[path_id];
			  		morePolygon.taskFrameTypeUpdate();
			  		
			  		var thisInfo = {
			  			"_id": morePolygon.rangeList[path_id]._id
			  		}
			  		infoOpen.update(thisInfo);
			  		
			  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			  		var geo_json = {
			  			"polygon": morePolygon.leafletMouseup( layersOne._latlngs[0] ),
			  			"_id": morePolygon.rangeList[path_id]._id
			  		};
			  		
					if(morePolygon.drawType == "isBridge"){
						if(!morePolygon.changePath[path_id]){
							morePolygon.cacheRange++;
						}
						var isBridge = morePolygon.rangeList[path_id].data.properties.isBridge;
						if(isBridge == true){
							morePolygon.rangeList[path_id].data.properties.isBridge = false;
						}else{
							morePolygon.rangeList[path_id].data.properties.isBridge = true;
						}
						morePolygon.changePath[path_id] = morePolygon.rangeList[path_id];
						layersOne.setStyle({"color":"red"});
					}
					
			  		console.log(geo_json);
			  		if(layersOne.enableEdit){
						if(morePolygon.cacheRange > 98){
							morePolygon.savaView();
							return;
						}
//		  				layersOne.enableEdit();
//						layersOne.disableEdit();
		  				layersOne.toggleEdit();
			  		}
			  	}
			  	if (morePolygon.drawType == "cutPolygonByLine" && _leaflet_id) {
	                morePolygon.selectCutPolygon = layersOne;//裁剪源对象设置
	                leafletMap.editTools.startPolyline();
	                util.errorView("多边形已选择，请开始裁剪！", true);
				} else if(morePolygon.drawType == "cutPolygonByLine" && !morePolygon.selectCutPolygon) {
	                util.errorView("请先在地图上选择要裁剪的多边形！");
				}
	
				if (morePolygon.drawType == "cutPolygonByArea") {
			  	    if (morePolygon.selectPolygons.length == 2 && !_.include(morePolygon.selectPolygons, layersOne)) {
	                    morePolygon.selectPolygons = [];
	                }
	                if (layersOne && layersOne.editEnabled()) {
	                    !_.include(morePolygon.selectPolygons, layersOne) && morePolygon.selectPolygons.push(layersOne);
	                    if (morePolygon.selectPolygons.length == 2) {
	                        morePolygon.cutPolygonByArea();
	                    }
	                } else if(layersOne) {
			  	        var index = _.indexOf(morePolygon.selectPolygons, layersOne);
	                    if (index != -1) {
	                        morePolygon.selectPolygons.splice(index);
	                    }
	                }
	
	            }
			});
		});
	},
	
	rectBounds: function(layers,type=false){
		if(morePolygon.drawType=="rangeFind"){
			var polylineId = layers.feature._leaflet_id;
			var layersOne = leafletMap.editTools.featuresLayer._layers[polylineId] || leafletMap._layers[polylineId];
//			morePolygon.distanceType = false;
			morePolygon.deletePolyline.push(polylineId);
			layersOne.disableEdit();
			layersOne.showMeasurements({imperial:true});
			leafletMap.editTools.startPolyline();
			return;
		}
		

		if(layers.feature._leaflet_id && layers.feature._path){
			var _path_id = layers.feature._path._leaflet_id;
			var _leaflet_id = layers.feature._leaflet_id;
		}
		var type = true;
		if(morePolygon.drawType == "rect"){
			var loc1 = layers.feature._latlngs[0][0],
				loc2 = layers.feature._latlngs[0][1];
			if(!loc1 && !loc2){
            	leafletMap.editTools.startRectangle();
				return;
			}
			if( (loc1.lat === loc2.lat) && (loc1.lng === loc2.lng) ){
				util.errorView("拉框绘制矩形 (点击地图绘制矩形会报错)");
			    layers.editLayer.remove();
			    layers.feature.remove();
				type = false;
			}
            leafletMap.editTools.startRectangle();
		}else if(morePolygon.drawType == "polygon"){
            leafletMap.editTools.startPolygon();
		}else if ( (morePolygon.drawType == "cutPolygonByLine") && !morePolygon.layersArr[_path_id] ){
            // leafletMap.editTools.startPolyline();
            var linePath = layers.feature.getLatLngs();
            layers.feature.remove();
            this.cutPolygonByLine(linePath);
            this.selectCutPolygon.toggleEdit();
            this.selectCutPolygon = null;
            type = false;
		}else if ( (morePolygon.drawType == "cutRectByArea") && !morePolygon.layersArr[_path_id]){
			var latlngs = layers.feature._latlngs[0],
				locs = [];
			for(var i=0; i<latlngs.length; i++){
				locs.push( [latlngs[i].lng, latlngs[i].lat] )
			}
            locs = this.addPointForRect(locs);
            layers.feature.remove();
			this.selectPolygons = [];
            this.cutRectByArea(locs);
            type = false;
			$(".drawLayers label.active").removeClass("active");
			$(".drawLayers label").eq(0).addClass("active");
			morePolygon.drawType = "";
		}
		if(type){
			var latlngs = layers.feature._latlngs[0],
				locs = [];
			for(var i=0; i<latlngs.length; i++){
				locs.push( [latlngs[i].lng, latlngs[i].lat] )
			}
            locs = this.addPointForRect(locs);
            
			if(layers.feature.options.type == 'rect'){
				locs = util.rect_node(locs);
	            /*var path = [];
	            for (var k = 0; k < locs.length-1; k++) {
	                path.push(new L.LatLng(locs[k][1], locs[k][0]));
	            }
                layers.feature.setLatLngs(path);*/
			}
            
            
			var adcode = $(".cityValue")[0].name;
			if(morePolygon.cacheDataOne && adcode){
				if(!morePolygon.rangeList[_path_id]){
					morePolygon.rangeParam(_path_id,adcode);
				}
				morePolygon.rangeList[_path_id]["_path_id"] = _path_id;
				morePolygon.rangeList[_path_id].data.geometry.coordinates[0] = locs;
				morePolygon.layersArr[_path_id] = _leaflet_id;
				if(!morePolygon.changePath[_path_id]){
					morePolygon.cacheRange++;
				}
				morePolygon.changePath[_path_id] = morePolygon.rangeList[_path_id];
			  	morePolygon.selectTaskFrame = morePolygon.rangeList[_path_id];
			  	morePolygon.taskFrameTypeUpdate();
				if(morePolygon.cacheRange > 98){
					morePolygon.savaView();
				}
			  	
			  	
			}else{
				morePolygon.layersArr[_path_id] = _leaflet_id;
			}
			layers.feature.setStyle({"color":"red"});
		}
	},
	
	//线裁剪多边形逻辑
	cutPolygonByLine: function(linePath) {
		var polygonPath = this.selectCutPolygon.getLatLngs()[0];
		var paths = [];
		var locs1 = [];
		var copy_polygonPath = polygonPath.concat();
		for (var i = 0; i < polygonPath.length; i++) {
            paths.push([polygonPath[i].lng, polygonPath[i].lat]);
		}
        paths = this.addPointForRect(paths);
		if( (polygonPath[0].lng!=polygonPath[polygonPath.length-1].lng) || (polygonPath[0].lat!=polygonPath[polygonPath.length-1].lat) ){
			copy_polygonPath.push(polygonPath[0]);
		}
		if(!linePath[0] || !linePath[0].lng || !linePath[1] || !linePath[1].lng){
			return;
		}
		
        var intersects = util.getIntersectCoordinate(paths, [[linePath[0].lng, linePath[0].lat], [linePath[1].lng, linePath[1].lat]]);

		if (intersects.length > 1) {
            var polygonA_path = [], polygonB_path = [];
            for (var i = 0; i < copy_polygonPath.length; i++) {
                if ((intersects[0].index + 1) == i) {
                    polygonA_path.push(new L.LatLng(intersects[0].loc[1], intersects[0].loc[0]));
                    polygonA_path.push(new L.LatLng(intersects[1].loc[1], intersects[1].loc[0]));
                    i = intersects[1].index + 1;
                }
                polygonA_path.push(copy_polygonPath[i]);
            }
            polygonA_path.push(copy_polygonPath[0]);
            this.selectCutPolygon.setLatLngs(polygonA_path);//修改源对象经纬度
            this.selectCutPolygon.setStyle({"color":"red"});//修改源对象颜色
            var source_path_id = this.selectCutPolygon._path._leaflet_id;
			if(!morePolygon.changePath[source_path_id]){
				morePolygon.cacheRange++;
			}
            var source_leafletId = this.selectCutPolygon._leaflet_id;
			for(var i=0; i<polygonA_path.length; i++){
				locs1.push( [polygonA_path[i].lng, polygonA_path[i].lat] );
			}
			morePolygon.rangeList[source_path_id].data.geometry.coordinates[0] = locs1;
			morePolygon.changePath[source_path_id] = morePolygon.rangeList[source_path_id];
			
            // polygonB_path.push(new L.LatLng(intersects[0].loc[1], intersects[0].loc[0]));
            for (var i = intersects[0].index + 1; i < copy_polygonPath.length; i++) {
                if ((intersects[1].index + 1) == i) {
                    polygonB_path.push(new L.LatLng(intersects[1].loc[1], intersects[1].loc[0]));
                    polygonB_path.push(new L.LatLng(intersects[0].loc[1], intersects[0].loc[0]));
                    break;
                }
                polygonB_path.push(copy_polygonPath[i]);
            }
            polygonB_path.push(copy_polygonPath[intersects[0].index+1]);

            // this.selectCutPolygon.setLatLngs(polygonB_path);//修改源对象经纬度
            var styleColor = {
                "color": "red",
                "fillOpacity": "0.2"
            };
            // this.selectCutPolygon.setLatLngs(polygonB_path);//修改源对象经纬度
            var adcode = $(".cityValue")[0].name;
            var polygon = new L.polygon(polygonB_path, styleColor).addTo(leafletMap),
                _path_id = polygon._path._leaflet_id;
			morePolygon.layersArr[_path_id] = polygon._leaflet_id;
//			增加坐标组对象处理
			locs1 = [];
			for(var i=0; i<polygonB_path.length; i++){
				locs1.push( [polygonB_path[i].lng, polygonB_path[i].lat] )
			}
            locs1 = this.addPointForRect(locs1);
			morePolygon.rangeParam(_path_id,adcode,locs1);
            
			if(!morePolygon.changePath[_path_id]){
				morePolygon.cacheRange++;
			}
			morePolygon.changePath[_path_id] = morePolygon.rangeList[_path_id];
			if(morePolygon.cacheRange > 98){
				morePolygon.savaView();
			}
        } else {
			util.errorView("裁剪面，交点必须大于1！");
		}
	},
    addPointForRect: function(arr) {
        if( (arr[0][0] != arr[arr.length-1][0]) || (arr[0][1] != arr[arr.length-1][1]) ){
            arr.push( [arr[0][0], arr[0][1]] )
        }
        return arr;
    },
    //面裁剪多边形逻辑
    cutPolygonByArea: function(data_json) {
    	var text_head = "面";
    	if(data_json){
    		text_head = "拉框";
    	}
        var receive1 =`
			<div class="modal modal2" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;width:350px;padding:0px;min-height:143px;">
				    	<div class="modal-header" style="padding: 5px;">
					        <button type="button" class="close" title="关闭" aria-label="Close" onclick="morePolygon.modalClose1()">
					          	<span aria-hidden="true">&times;</span>
					        </button>
			        		<h4 class="modal-title">${text_head}裁剪多边形</h4>
			      		</div>
			      		<div class="modal-body" style="overflow-x: auto;height: 48px;text-align: center;width:300px;left: 28px;">
				            <p style="font-size:16px;">是否执行${text_head}裁剪？</p>
			      		</div>
						<div class="form-group" style="border:none;margin-top:15px;text-align:-webkit-center;">
							<button type="button" id="button1" class="btn btn-danger" title="确认" style="width: 100px;">确认</button>
							<button type="button" id="button2" class="btn btn-danger" title="取消" style="width: 100px;">取消</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
        $('.testmodal').html(receive1);
        $('.testmodal .modal2').addClass("in");
        $('.testmodal .modal2').fadeIn(200).each(function(){
            $("#button1").click(function() {
                if (!data_json && morePolygon.selectPolygons && morePolygon.selectPolygons.length == 2) {
                    var polygonA = morePolygon.selectPolygons[0],
                    	polygonA_id = polygonA._path._leaflet_id,
                    	polygonAPath = morePolygon.rangeList[polygonA_id].data.geometry.coordinates[0],
                    	polygonB = morePolygon.selectPolygons[1],
                    	polygonB_id = polygonB._path._leaflet_id,
                    	polygonBPath = morePolygon.rangeList[polygonB_id].data.geometry.coordinates[0];
                    
                    /*for (var i = 0; i < polygonA.getLatLngs()[0].length; i++) {
                        var lnglat = polygonA.getLatLngs()[0][i];
                        polygonAPath.push([lnglat.lng, lnglat.lat]);
                    }
                    for (var i = 0; i < polygonB.getLatLngs()[0].length; i++) {
                        var lnglat = polygonB.getLatLngs()[0][i];
                        polygonBPath.push([lnglat.lng, lnglat.lat]);
                    }*/
					
            		polygonAPath = morePolygon.addPointForRect(polygonAPath);
            		polygonBPath = morePolygon.addPointForRect(polygonBPath);
                    var data = [{
                        "_id": polygonA._leaflet_id,
                        "data": {
                            "geometry": {
                                "coordinates": [polygonAPath],
                                "type": "Polygon"
                            },
                            "type": "Feature",
                            "properties": {}},
                    },{
                        "_id": polygonB._leaflet_id,
                        "data": {
                            "geometry": {
                                "coordinates": [polygonBPath],
                                "type": "Polygon"
                            },
                            "type": "Feature",
                            "properties": {}}
                    }];
                    if( (polygonB.options.businessType == "1") && (polygonA.options.businessType != "1") ){
                    	data = data.reverse();
                    }
                    $("#loading").css("display","block");
               	 	morePolygon.json_cut(data,true);
                }else{
                	morePolygon.json_cut(data_json);
                }
            });
            $("#button2").click(function() {
                morePolygon.modalClose1();
            });
        });
    },
	
	json_cut: function(data,type=false){
		var cut_url = configURL.morePolygonCut+"cut";
		if(type){
			cut_url = configURL.morePolygonCut+"simpleCut";
		}
        d3.json(cut_url)
            .post(JSON.stringify(data),function(error, _data) {
                $("#loading").css("display","none");
                var res = _data ? _data.result : null;
                if (res) {
                    for (var i = 0; i < res.length;i++) {
                        var id = res[i]._id,
                        	coords = res[i].data.geometry.coordinates[0];
                        coords = morePolygon.addPointForRect(coords);
                        for (var j = 0; j < morePolygon.selectPolygons.length; j++) {
                            if(morePolygon.selectPolygons[j]._leaflet_id == id) {
                                var path = [];
                                for (var k = 0; k < coords.length; k++) {
                                    path.push(new L.LatLng(coords[k][1], coords[k][0]));
                                }
                                morePolygon.selectPolygons[j].setLatLngs(path);
                                morePolygon.selectPolygons[j].disableEdit();
                				morePolygon.selectPolygons[j].setStyle({"color":"red"});
                                var source_path_id = morePolygon.selectPolygons[j]._path._leaflet_id;
                                if(morePolygon.rangeList[source_path_id].data.properties.businessType != "1"){
                                	var changeLoc = true;
                                	if(morePolygon.rangeList[source_path_id].data.geometry.coordinates[0].length == coords.length){
                                		changeLoc = false;
									    for (var d=0; d<coords.length; d++) {
									        var loc_x1 = coords[d][0],
												loc_y1 = coords[d][1],
												loc_x2 = morePolygon.rangeList[source_path_id].data.geometry.coordinates[0][d][0],
												loc_y2 = morePolygon.rangeList[source_path_id].data.geometry.coordinates[0][d][1];
									        if( (loc_x1!=loc_x2) || (loc_y1!=loc_y2)){
												changeLoc = true;
											}
										}
                                	}
	                            	if(changeLoc){
		                                if(!morePolygon.changePath[source_path_id]){
		                                    morePolygon.cacheRange++;
		                                }
		                                
		                                morePolygon.rangeList[source_path_id].data.geometry.coordinates[0] = coords;
		                                morePolygon.changePath[source_path_id] = morePolygon.rangeList[source_path_id];
	                            	}
                                }
                            }
                        }
                    }
                    util.errorView("裁剪成功！", true);
                } else {
                    util.errorView("裁剪失败！");
                }
                morePolygon.selectPolygons = [];
                morePolygon.modalClose1();
                if(morePolygon.cacheRange > 99){
                	morePolygon.savaView();
                }
            });
		
	},
	
//	根据拉框裁剪内部所有对应元素
	cutRectByArea: function(locs){
		var data = [];
		for(var id in morePolygon.rangeList){
			var inner_node = morePolygon.rangeList[id].data.geometry.coordinates[0],
				bbox = util.minmax_bbox(locs),
				inner_type = util.polygonclip(inner_node,bbox),
//				inner_type = util.polygonIntersectsPolygon(locs,inner_node,true),
				_path_id = morePolygon.rangeList[id]._path_id,
				_leaflet_id = morePolygon.layersArr[_path_id],
				layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
			
			var copy_inner_node = inner_node.concat();
			
			if(!_leaflet_id){
				util.errorView("请先保存数据");
				return;
			}
			if(inner_type.length){
				if(layersOne.options.type == "rect"){
					copy_inner_node = util.rect_node(copy_inner_node);
				}
				data.push({
		            "_id": _leaflet_id,
		            "data": {
		                "geometry": {
		                    "coordinates": [copy_inner_node],
		                    "type": "Polygon"
		                },
		                "type": "Feature",
		                "properties": {}
		            },
		        })
				morePolygon.selectPolygons.push(layersOne);
			}
		}
		var change_length = data.length + morePolygon.cacheRange;
		if(change_length > 99){
			if(data.length > 100){
				util.errorView("框内数据超出限制");
				return;
			}
			util.errorView("请先保存数据");
			morePolygon.savaView();
			return;
		}
		morePolygon.cutPolygonByArea(data);
	},



	rangeParam: function(_path_id,adcode,locs=[]){
		var businessType = $('select.rangeTypes').val(),
			isBridge = false;
		if(!adcode){
			adcode = $(".cityValue")[0].name;
		}
		if( (morePolygon.drawType!="rect") && (businessType=="1") ){
			businessType = "0";
		}
		if(!locs.length && (morePolygon.drawType=="rect")){
			businessType = "1";
			isBridge = true;
		}
		morePolygon.rangeList[_path_id] = {
			"data":{
				"geometry":{
					"coordinates":[
						locs
					],
					"type":"Polygon"
				},
				"type":"Feature",
				"properties":{
					"isBridge":isBridge,
					"rangeIndex":-1,
					"rangeType":-1,
					"businessType":businessType,
					"trackIds":"",
					"totalIndex":-1,
					"rangeName":"",
					"meshList":[""],
					"meshId":""
				}
			},
			"adcode":adcode,
			"_id":"manual_"+adcode+"_new",
			"source":0,
			"version":morePolygon.thisVersion,
			"timestamp":""
		};
	},
	
//	生成text文本文件
	_rangeDiv: function(){
//		从localStorage获取并导出操作记录
		var _range = [];
		for(var item in morePolygon.layersArr){
			if(morePolygon.layersArr[item]){
				var _leaflet_id = morePolygon.layersArr[item];
		  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
				var _geoJson = layersOne._latlngs[0];
				var _rangeString = morePolygon.leafletMouseup(_geoJson);
				if(!morePolygon.rangeList[item]){
					morePolygon.rangeList[item] = morePolygon.addFormat;
				}
				morePolygon.rangeList[item]['polygon'] = "POLYGON(("+_rangeString+"))";
				_range.push( morePolygon.rangeList[item] );
			}
		}
		var json_range = JSON.stringify(_range)
		var fileName = "我是导出的范围哦！！！(数量为"+_range.length+")";
//		var tableHtml = `${_range.map(d => `${d} \r\n\r\n`).join('')}`;
        var blob = new Blob([json_range], { type: "txt/plain;charset=utf-8" });
      	var a = document.createElement("a"), 				//创建a标签
          	e = document.createEvent("MouseEvents"); 		//创建鼠标事件对象
      	e.initEvent("click", false, false); 				//初始化事件对象
      	a.href = URL.createObjectURL(blob); 				//设置下载地址
      	a.download = fileName+".txt"; 						//设置下载文件名
      	a.dispatchEvent(e); 								//给指定的元素，执行事件click事件
		
		
//		var _range = [];
//		for(var item in morePolygon.layersArr){
//			var _geoJson = morePolygon.layersArr[item].feature._latlngs[0];
//			_range.push( mapTask.leafletMouseup(_geoJson) );
//		}
//		var _ranges = _range.join(";</br>");
//		$.openTips([_ranges]);
//		console.log(_range)
	},
	
//	清除地图数据
	clearData: function(){
		for(var item in morePolygon.layersArr){
			var _leaflet_id = morePolygon.layersArr[item];
		  	var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
		    layersOne.remove();
		}
		morePolygon.layersArr = {};
		morePolygon.rangeList = {};
	},
	
	savaView: function(){
		$('.testmodal .modal').modal('hide');
		if(!morePolygon.cacheRange && !morePolygon.deleteNum.length){
			var adcode = $(".cityValue")[0].name;
			if(!adcode){
				util.errorView("未选择城市", false);
			}else{
				util.errorView("未修改数据", false);
			}
			return;
		}
		var receive1 =`
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;width:350px;padding:0px;min-height:150px;">
				    	<div class="modal-header" style="padding: 5px;">
					        <!--<button type="button" class="close" title="关闭" aria-label="Close" onclick="morePolygon.modalClose1()">
					          	<span aria-hidden="true">&times;</span>
					        </button>-->
			        		<h4 class="modal-title">提示信息</h4>
			      		</div>
			      		<div class="modal-body" style="overflow-x: auto;height: 80px;text-align: center;width:300px;padding: 0px;">
				            <p style="font-size:16px;color:red;">已存在${morePolygon.cacheRange}条未保存的数据,请保存!</p>
				            <p style="font-size:16px;color:red;">已存在${morePolygon.deleteNum.length}条要删除的数据,请保存!</p>
			      		</div>
						<div class="form-group" style="border:none;margin-top:15px;text-align:-webkit-center;">
							<button type="button" id="button1" class="btn btn-danger" title="确认" style="width: 100px;">确认</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.testmodal').html(receive1);
		$('.testmodal .modal').modal('show').each(function(){
			$("#button1").click(function(){
		        morePolygon.verificationPassword(true, function(){
			        var datajson = [],
			        	thisUrl1 = configURL.task_frame+"lane_line_merge/updateData",
			        	deleteUrl = configURL.task_frame+"lane_line_merge/deleteData";
			        if(morePolygon.cacheRange){
				        for(var item in morePolygon.changePath){
				        	delete morePolygon.changePath[item]["_path_id"];
				        	datajson.push(morePolygon.changePath[item])
				        }
						morePolygon.updatePolygon(datajson);
			       	}
			        if(morePolygon.deleteNum.length){
				        var submitDelete = {
							"collectionType": $(".collectionType option:selected").val(),
							"ids": morePolygon.deleteNum
						};
						morePolygon.deletePolygon(submitDelete);
			        }
		        })
		        	
		        
			})
       	});
	},
	
	/*删除任务框执行事件提出*/
	deletePolygon: function(json){
		var adcode = $(".cityValue")[0].name,
			deleteUrl = configURL.task_frame+"lane_line_merge/deleteData";
    	console.log(json)
    	$("#loading").css("display","block");
		$.postAjax(deleteUrl,json,function(data){
			$("#loading").css("display","none");
			if(data === 0){
				morePolygon.changePath = {};
				util.errorView("删除完成",true);
				console.log("删除完成");
				morePolygon.deleteNum = [];
				if(!morePolygon.cacheRange){
					morePolygon.polygonData(adcode);
				}
			}else{
				util.errorView("删除失败",false);
				console.log("删除失败");
			}
			$('.testmodal .modal').modal('hide');
		})
	},
	
	/*更新任务框执行事件提出*/
	updatePolygon: function(datajson,errorJson={}){
		var newData = [];
		for(i=0; i<datajson.length; i++){
			var _id = datajson[i]._id;
			if(!errorJson[_id]){
				newData.push(datajson[i]);
			}
		}
        var submitData = {
			"collectionType": $(".collectionType option:selected").val(),
			"data": JSON.stringify(newData)
		};
		var adcode = $(".cityValue")[0].name,
			thisUrl1 = configURL.task_frame+"lane_line_merge/updateData";
		$("#loading").css("display","block");
		$.postAjax(thisUrl1,submitData,function(data){
			$("#loading").css("display","none");
			if(data.code == 0){
				morePolygon.changePath = {};
				util.errorView("保存完成",true);
				morePolygon.cacheRange = 0;
				if(!morePolygon.deleteNum.length){
					morePolygon.polygonData(adcode);
				}
			}else if(data.result && data.result.data){
				var this_data = data.result.data,
					taskFrameIds = this_data.join(','),
					view = "保存失败："+data.code+"："+taskFrameIds,
					json_obj = {};
				
				for(var i=0; i<this_data.length; i++){
					var _id = this_data[i];
					json_obj[_id] = true;
				}
				if(newData.length > this_data.length){
					view += "---->过滤失败的任务框去执行保存";
					morePolygon.updatePolygon(newData,json_obj);
				}
				util.errorView(
					view,false
				);
			}else{
				util.errorView("保存失败："+data.code+"："+data.message,false);
			}
			console.log(data);
			$('.testmodal .modal').modal('hide');
		})
	},
	
	verificationPassword: function(type, callback){
		$('.passwordmodal').html('');
		var _html = `
			<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			  	<div class="modal-dialog" role="document" style="margin: 0 auto;">
			    	<div class="modal-content" style="top:200px;width:350px;padding:0px;min-height:150px;">
				    	<div class="modal-header" style="padding: 5px;">
			        		<h4 class="modal-title">密码验证</h4>
			      		</div>
			      		<div class="modal-body" style="text-align: center;">
							<input type="password" class="form-control password" placeholder="请输入密码确认">
			      		</div>
						<div class="form-group" style="border:none;margin-top:15px;text-align:-webkit-center;">
							<button type="button" id="button1" class="btn btn-success" title="执行" style="width: 100px;">执行</button>
							<button type="button" id="button2" class="btn btn-default" title="取消" style="width: 100px;">取消</button>
						</div>
			    	</div>
			  	</div>
			</div>
		`;
		$('.passwordmodal').html(_html);
		$('.passwordmodal .modal #button1').click(function(){
			var _value = $('.passwordmodal .modal .modal-body input.password').val();
			if(_value == 'Kdtemp02'){
				$('.passwordmodal .modal').modal('hide');
				$('.passwordmodal .modal').remove();
				callback && callback();
			}else{
				util.errorView('密码错误，执行失败');
			}
		})
		$('.passwordmodal .modal #button2').click(function(){
			$('.testmodal .modal').modal('hide');
			$('.passwordmodal .modal').modal('hide');
		})
		$('.passwordmodal .modal').modal('show');
		
		
	},
	
//	选择流程方式窗口关闭
	modalClose1: function(){
		$('.modals1').hide();
		$('.modal1').hide();
		$('.modal2').hide();
	},
	
	leafletMouseup: function(_layers){
		var latlngs = [];
		for(var i=0; i<_layers.length; i++){
			latlngs.push(_layers[i])
		}
		if(latlngs[0] !== latlngs[latlngs.length-1]){
			latlngs.push( latlngs[0] );
		}
	    var xys =[];
	    var geo='';
        for(var i=0; i<latlngs.length; i++){
            xys.push(latlngs[i].lng+" "+latlngs[i].lat);
        }
        geo = xys.join(',');
	    return geo;
	},

//	地区定位搜索功能(创建任务时的地区搜索以及定位功能)
	search: function(judge=true){
//		对所输入的值进行定位
		var inputVal = $("#inputName4").val();
//		从全国中搜索
		morePolygon._search(inputVal, "全国", function(dataList){
			if(!dataList || !dataList.length){
				return ;
			}
			var first = dataList[0];
			if(first){
				var loc = first.location;
				if(loc){
					leafletMap.setView([loc.lat, loc.lng]);
				}else {
//					对所搜索的地区根据坐标定位
					morePolygon._search(inputVal, first.name || "全国", function(dataList2){
						var sec = dataList2 && dataList2[0];
						if(sec && sec.location){
							var loc = sec.location;
							leafletMap.setView([loc.lat, loc.lng]);
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
	},
	

//	版本克隆,选择来源版本号与生成版本号
	cloneVersion: function(){
		morePolygon.JsonForm = [1,2,3,4,5];
		var createModel =`
		<div class="modal modal1" tabindex="-1" role="dialog" aria-labelledby="gridSystemModalLabel" style="display:none;background:none;top: 1%;">
			<div class="modal-dialog" role="document" style="margin: 0 auto;top: 200px;">
				<div class="modal-content" style="padding:0px;min-height:auto;width: 400px;border: 1px solid #ddd;">
					<div class="modal-header">
						<button type="button" class="close" title="关闭" aria-label="Close" onclick="morePolygon.modalClose1()">
	    					<span aria-hidden="true">&times;</span>
	    				</button>
						<h4 class="modal-title">版本克隆</h4>
					</div>
					<div class="modal-body task-modal-body" style="width: 400px;">
					    <div class="right-content" style="margin:0 auto;width:300px;">
							<form id='taskForm2' class="form-horizontal">
		      					<div class="box-body">
									<!-- 来源版本 -->
									<div class="form-group" style="border: none;">
										<label for="source" class="col-sm-4 control-label" style="line-height:20px;">来源版本 :</label>
										<div class="col-sm-8">
											<select class="form-control source">
										        <option value="">请选择版本号</option>
										        ${morePolygon.versionList.map(d => `
										            <option value=${d}>版本 ${d}</option>
										        `).join('')}
											</select>
										</div>
									</div>
									<!-- 当前版本 -->
									<div class="form-group" style="border: none;">
										<label for="target" class="col-sm-4 control-label" style="line-height:20px;">当前版本 :</label>
										<div class="col-sm-8">
									        <input class="form-control target" type="number" />
										</div>
									</div>
		          				</div>
		      					<!-- 确定与取消按钮 -->
		      					<div class="box-footer">
					                <button type="button" class="btn btn-default pull-left" title="取消" onclick="morePolygon.modalClose1()">取消</button>
					                <button type="button" class="btn btn-info pull-right" title="提交" onclick="morePolygon.cloneSubmit()">提交</button>
		      					</div>
		    				</form>
		  				</div>
					</div>
				</div>
			</div>
		</div>
		`;
		$(".testmodal").html(createModel);
		$(".testmodal .modal1").fadeIn(200);
	},
	
//	克隆提交事件
	cloneSubmit: function(){
		$("#loading").css("display","block");
		var source = $(".source option:selected").val(),
        	adcode = $(".cityValue")[0].name,
        	collectionType = $(".collectionType option:selected").val(),
			target = $(".target").val(),
			cloneUrl = configURL.task_frame+"lane_line_merge/cloneVersion?collectionType="+collectionType+"&adcode="+adcode+"&source="+source+"&target="+target;
		
		$.postAjax(cloneUrl,{},function(data){
			$("#loading").css("display","none");
			if(data === 0){
				util.errorView("克隆完成",true);
			}else{
				util.errorView("克隆失败",false);
			}
			morePolygon.modalClose1();
			morePolygon.domFindData();
		})
	},

//	删除当前加载的版本
	deleteVersion: function(){
		var version = $(".versionSelect option:selected").val(),
        	adcode = $(".cityValue")[0].name,
        	collectionType = $(".collectionType option:selected").val(),
			deleteUrl = configURL.task_frame+"lane_line_merge/removeVersions?versions="+version+"&adcode="+adcode+"&collectionType="+collectionType;
		if(!version || !adcode){
			util.errorView("参数有问题");
			return;
		}
		$("#loading").css("display","block");
		$.postAjax(deleteUrl,{},function(data){
			$("#loading").css("display","none");
			if(data === 0){
				util.errorView("删除成功",true);
			}else{
				util.errorView("删除失败",false);
			}
			morePolygon.domFindData();
		})
		
		
	},
	
//	打开质检报表
	check_Form: function(json){
		$("#checkForm").fadeIn(300);
		var json_forms = json.checkDataResults;
//		列表复选任务功能
        var listModel = `
			<table id="example2" class="table table-bordered">
				<h4 class="infoHeader" style="height:35px;line-height:35px;">
					<span>质检报表</span>
					<a class="glyphicon glyphicon-chevron-down" title="关闭质检报表" href="#" style="color:gray;float:right;line-height:35px;padding-right:10px;"></a>	
				</h4>
		        <thead>
			        <tr>
		                <th style="white-space:nowrap;width:60px;">ID</th>
		                <th style="white-space:nowrap;">errorMsg</th>
			        </tr>
		        </thead>
		        <tbody>
	                ${json_forms.map(m => `
			            <tr class="tooltipName ${m.id}" onclick="morePolygon.center_map('${m.id}','${m.dataId}','${m.dataX}','${m.dataY}')">
			            	<td style="white-space:nowrap;width:60px;" title="${m.id}" class="_id">${m.id}</td>
			            	<td style="white-space:nowrap;" title="${m.errorMsg}" class="_errorMsg">${m.errorMsg}</td>
			            </tr>
	                `).join('')}
		        </tbody>
		    </table>
        ` || "";
        $("#checkForm").html(listModel);
        var table = $('#checkForm #example2').DataTable({
			'language'    	: window.lang,
            'paging'      	: true,
            'lengthChange'	: false,
            'searching'   	: false,
            'ordering'    	: false,
            'info'        	: true,
	        'scrollY'		: 200,
	        'scrollCollapse': true,
            "order"			: [[1, "desc"]],
	        "lengthMenu"	: [1000],
	        'pagingType'  	: "simple",
            'autoWidth'   	: false
        });
		
        $('.infoHeader a').click(function(){
        	$("#checkForm").fadeOut(300);
        })
		console.log(json)
	},
	
//	隐藏及关闭质检报表
	openCheck: function(type){
		if(type){
		    /*$("#checkForm").animate({
		      width:'500px'
		    });*/
			$("#checkForm").fadeIn(300);
		}else{
			$("#checkForm").fadeOut(300);
		}
	},
	
//	点击进行坐标定位
	center_map: function(id,dataId,x,y){
		if(morePolygon.check_Form_layer.length){
			for(var s=0; s<morePolygon.check_Form_layer.length; s++){
				var color_ = "#87CEFF";
				if(morePolygon.check_Form_layer[s].options.businessType == "1"){
					color_ = "rgb(51, 136, 255)";
				}
				morePolygon.check_Form_layer[s].setStyle({"color":color_});
			}
		}
		morePolygon.check_Form_layer = [];
		$("#checkForm tr.tooltipName").removeClass("active");
		$("#checkForm tr."+id).addClass("active");
		console.log(id)
		leafletMap.setView([y, x],15);    //定位中心点
		
		var dataIds = dataId.split(",");
		for(var i=0; i<dataIds.length; i++){
			var newData = morePolygon.cacheData.filter(function(data){
				return data._id == dataIds[i];
			})
			var path_id = newData[0]._path_id,
				leaflet_id = morePolygon.layersArr[path_id],
				layerOne = leafletMap.editTools.featuresLayer._layers[leaflet_id] || leafletMap._layers[leaflet_id];
			layerOne.setStyle({"color":"#A020F0"});
			morePolygon.check_Form_layer.push(layerOne);
		}
		
	},

//	待采轨迹功能: 获取已保存的数据
	domFindTrack: function(adcode=false,cityname=false){
		for(var i=0; i<morePolygon.surveyTrackPoint.length; i++){
			var leaflet_id = morePolygon.surveyTrackPoint[i].leaflet_id,
				layerOne = leafletMap.editTools.featuresLayer._layers[leaflet_id] || leafletMap._layers[leaflet_id];
			layerOne && layerOne.remove();
		}
		morePolygon.surveyTrackPoint = [];
		$("#loading").css("display","block");
		var _adcode = $(".cityValue")[0].name || "",
			_pointIcon = './images/point/point7.png',
			queryJson = [
				{
					"k": "ADCODE",
					"op": "eq",
					"v": _adcode
				}
			],
			newJson = JSON.stringify(queryJson),
			encodeJson = encodeURIComponent(newJson),
			_url = configURL.kd_tag+"tag/survey_point_tag/query?tagsJson="+encodeJson;
		
		$.postAjax(_url,{},function(data){
			$("#loading").css("display","none");
			if(data.code != "0"){
				util.errorView('查询失败：'+data.message);
			}
			var thisData = data.result || [];
			for(var i=0; i<thisData.length; i++){
				var node = [thisData[i].geometry.coordinates[1], thisData[i].geometry.coordinates[0]],
				infoContent = `
					<p>任务ID： ${thisData[i].properties.TASKID || ''}</p>
					<p>项目ID： ${thisData[i].properties.PROJECTID || ''}</p>
					<p>轨迹ID： ${thisData[i].properties.TRACKID || ''}</p>
					<p>ADCODE： ${thisData[i].properties.ADCODE || ''}</p>
					<p>类型： ${thisData[i].properties.TYPE || ''}</p>
					<p>描述： ${thisData[i].properties.DESC || ''}</p>
				`,
		        thisIcon = L.icon({
		            iconUrl: _pointIcon,
		            iconSize:[20, 20]
		        });
		        var marker = L.marker(node, {
		        	icon: thisIcon
		        }).bindPopup(function (layer) {
				    return infoContent;
				}).addTo(leafletMap);
            	morePolygon.surveyTrackPoint.push({
            		"leaflet_id": marker._leaflet_id,
            		"path_id": marker._icon._leaflet_id
            	});
			}
		})
	}
	
	
}
//点击服务列表
$.mapType = morePolygon;
morePolygon.Table();
