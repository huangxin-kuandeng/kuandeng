
//监控服务列表
var controlPoint = {
	
	_range: null,
	
	catchFeatureType: null,
	
	featureTypes: [
		{
			name: '无',
			value: '99'
		},
		{
			name: '虚线',
			value: '0'
		},
		{
			name: '实线',
			value: '1'
		},
		{
			name: '三角形牌',
			value: '2'
		},
		{
			name: '矩形牌',
			value: '3'
		},
		{
			name: '灯杆',
			value: '4'
		}
	],
	
	groupList: [],
	
	pointList: [],
	
//	创建新任务功能
	Table: function(){
	    controlPoint.createMap();
//		确认导入文件
		$(".submitImport").click(function(e) {
			var files = $('.fileData')[0].files[0];
			if(files){
				controlPoint.submitImport(files)
			}else{
				$.spopView({
					text: '未选择任何文件'
				})
			}
		});
//		打开控制点分组列表
		$(".rightBtn").click(function(e) {
			$(".leftTasks").toggle();
			controlPoint.groupNameList();
		});
//		关闭控制点分组列表
		$(".leftTasks span").click(function(e) {
			$(".leftTasks").toggle();
		});
//		关闭图片展示
		$(".pointImage h5 span.glyphicon").click(function(e) {
			$(".pointImage").toggle();
		});
//		打开图片
		$(".pointImage img").click(function(e) {
			var _url = $(".pointImage img")[0].src;
			window.open(_url)
		});
//		点击分组查看控制点
	    $('.groupNames').on('click', '.groupNameOpen a.queryPoint', function (e) {
		    var groupName = e.target.getAttribute('data-name');
		    controlPoint.queryPoint(groupName);
	    });
//		点击分组删除控制点
	    $('.groupNames').on('click', '.groupNameOpen a.deletePoint', function (e) {
		    var groupName = e.target.getAttribute('data-name');
		    controlPoint.deletePoint(groupName);
	    });
//		选择城市
	    $('.cityValue').on('click', function () {
            var rect = $(".cityValue")[0].getBoundingClientRect();
            citypicker.show({
                top: rect.top + rect.height,
                left: rect.left
            }, function(cityname, city){
            	var adcode = city.adcode,
            		centerNode = [city.loc[1],city.loc[0]];
                $(".cityValue").val(cityname);
                $(".cityValue")[0].name = adcode;
                if(!city) return ;
				leafletMap.setView(centerNode);
            })
        })
	},
	
//	查询控制点分组列表--查询
	groupNameList: function(){
		$("#loading").css("display","block");
		var _url = configURL.krs+"controlPoint/groupNames?kieVersion=empty";
		$.getAjax(_url, {}, function(data){
			$("#loading").css("display","none");
			var _list = [];
			if(!data.result && data.message){
				$.spopView({
					text: data.message
				})
			}else{
				_list = data.result;
			}
			var groupHtml = `
	    		<table id="pointLists" class="table table-bordered">
			        <thead>
				        <tr>
			                <th style="white-space:nowrap;">名称</th>
			                <th style="white-space:nowrap;">查看</th>
				        </tr>
			        </thead>
			        <tbody>
			        	
			        </tbody>
	    		</table>
			`;
	    	$('.groupNames').html(groupHtml);
	        var listModel = `
	            ${_list.map(m => `
		            <tr class="tooltipName">
		            	<td title="${m}">${m}</td>
		            	<td class="groupNameOpen">
		            		<a class="queryPoint" data-name="${m}" style="cursor:pointer;">控制点</a>
		            		<a class="deletePoint" data-name="${m}" style="cursor:pointer;">删除</a>
		            	</td>
		            </tr>
	            `).join('')}
	        ` || "";
	        $('#pointLists tbody').html(listModel);
	    	$('#pointLists').DataTable({
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
		})
		
	},
	
//	导入本地文件
	submitImport: function(file){
		$("#loading").css("display","block");
        var formData = new FormData();
        formData.append("data", file);
		var _url = configURL.krs+"controlPoint/import?kieVersion=empty";
	    $.ajax( {
	        type : "POST",
	        url : _url,
        	async : true,
			contentType: false,
			processData: false,
	        data : formData,
	        success : function(data) {
				$("#loading").css("display","none");
				var _text = '导入成功',
					_type = true;
				if(data.code != '0'){
					_text = '导入失败：'+data.message;
					_type = false;
				}else{
					$('.fileData').val('');
				}
				$.spopView({
					text: _text,
					type: _type
				})
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown){
				$("#loading").css("display","none");
		   		console.log(XMLHttpRequest.status+"---"+XMLHttpRequest.readyState+"---"+textStatus);
				$.spopView({
					text: '系统异常'
				})
	        }
	    });
	},
	
//	清除所有控制点
	clearPoint: function(){
		for(var i=0; i<controlPoint.pointList.length; i++){
			var leafletId = controlPoint.pointList[i],
				_layer1 = leafletMap.editTools.featuresLayer._layers[leafletId] || leafletMap._layers[leafletId];
			_layer1 && _layer1.remove();
		}
	},
	
//	删除控制点
	deletePoint: function(group){
		var html_1 = [
			"是否删除"+group+"分组控制点"
		];
		$.openTips_btn(html_1, function(){
			$(".modal1").hide();
			$("#loading").css("display","block");
			var _url = configURL.krs+"controlPoint/delete?kieVersion=empty&groupName="+group;
			$.getAjax(_url,true,function(data){
				$("#loading").css("display","none");
				var _text = '删除失败：'+data.message,
					_type = false;
				if(data.code == '0'){
					_text = '删除成功';
					_type = true;
					controlPoint.groupNameList();
				}
				$.spopView({
					text: _text,
					type: _type
				})
				
			})
		});
	},
	
//	查询控制点
	queryPoint: function(group){
		controlPoint.clearPoint();
		var thisBbox = $.getBounds();
		var _url = configURL.krs+"controlPoint/query/bbox?kieVersion=empty&bbox="+thisBbox;
		if(group){
			_url = configURL.krs+"controlPoint/query/bbox?kieVersion=empty&groupName="+group;
		}
		$("#loading").css("display","block");
		$.getAjax(_url,true,function(data,group){
			$("#loading").css("display","none");
			if(data.code != '0'){
				$.spopView({
					text: data.message
				})
				return;
			}
			var noImageIcon = L.divIcon({
	            html: '',
	            className: 'noImageIcon',
	            iconSize: 8,
				iconAnchor: [0, 0],
	        });
	        var bounds = [],
	        	node = null;
	        for(var i=0; i<data.result.length; i++){
	        	var imgId = data.result[i].properties.imgId,
	        		pointId = data.result[i].id || '',
	        		_featureType = data.result[i].properties.featureType,
	        		featureType = (_featureType || _featureType==0) ? _featureType : '99';
	        	noImageIcon.options.className = imgId ? 'ImageIcon' : 'noImageIcon';
	        	var properties = [];
	        	var imgaeBtn = imgId ? `<p class="openImage"><a href="#" onclick="controlPoint.openImage('${imgId}')">查看图片</a></p>` : '';
	        		
			  	for(var item in data.result[i].properties){
			  		properties.push({
			  			'name': item,
			  			'value': data.result[i].properties[item]
			  		})
			  	}
				var _typeContent = controlPoint.createTypeContent(featureType, pointId),
				infoContent = `
	        ${properties.map(f => `
						<p>${f.name}： ${f.value}</p>
	        `).join('')}
	        ${imgaeBtn}
				`;
				node = [data.result[i].geometry.coordinates[1], data.result[i].geometry.coordinates[0]];
	      bounds.push(node);
			  var point = L.marker(node, {
			    icon: noImageIcon,
			    _html: infoContent,
			    html_type: _typeContent
			  }).bindPopup(function (layer) {
			    controlPoint.catchFeatureType = layer;
			    var _html = layer.options.html_type + layer.options._html;
					return _html;
				}).addTo(leafletMap);
				
				var leafletId = point._leaflet_id
				controlPoint.pointList.push(leafletId);
	    	}
			bounds.length && group && leafletMap.fitBounds(bounds);
		},group)
	},
	
	createTypeContent: function(featureType, pointId){
  	for(var s=0; s<controlPoint.featureTypes.length; s++){
  		controlPoint.featureTypes[s]['selected'] = '';
  		if(controlPoint.featureTypes[s].value == featureType){
  			controlPoint.featureTypes[s]['selected'] = 'selected';
  		}
  	}
  	var _html = `
			<p>
				检查点类型： 
				<select class="feature_type" name="${pointId}">
	        ${controlPoint.featureTypes.map(d => `
						<option value="${d.value}" ${d.selected}>${d.name}</option>
	        `).join('')}
				</select>
			</p>
		`;
		return _html;
	},
	
	openImage: function(id){
		var _url = configURL.krs+"controlPoint/image/get?kieVersion=empty&imgId="+id;
		$(".pointImage h5 span.head").html(id);
		$(".pointImage img")[0].src = _url;
		$(".pointImage").css('display', 'block');
	},
	
//	增加map地图模版 
	createMap: function(){
		$.mapLeaflet('leaflet-map',"survey",function(){
	    	console.log("地图初始化完成");
	    	leafletMap.setZoom(6);
		});
		leafletMap.on('dragend', function(e) {
			if(e.distance > 400){
        		controlPoint.queryPoint();
			}
		});
		
    $('#leaflet-map').on('change', 'select.feature_type', function (event) {
			controlPoint.setFeatureType(this.value, this.name);
    });
		
		/*leafletMap.on('click', function(e) {
		  	var path_id = e.originalEvent.target._leaflet_id,
		  		ctrlKey = e.originalEvent.ctrlKey,
		  		altKey = e.originalEvent.altKey,
				_leaflet_id = morePolygon.layersArr[path_id];
		  	if(_leaflet_id && path_id && ctrlKey && altKey){
		  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
		  		layersOne.remove();
			    delete morePolygon.layersArr[path_id];
			    delete morePolygon.rangeList[path_id];
		  	}else if(_leaflet_id && path_id){
		  		var layersOne = leafletMap.editTools.featuresLayer._layers[_leaflet_id] || leafletMap._layers[_leaflet_id];
		  		if(layersOne.enableEdit){
					if(morePolygon.cacheRange === 10){
						morePolygon.savaView();
						return;
					}
		  			layersOne.enableEdit();
		  		}
		  	}
		});*/
	},
	
//设置点的类型
	setFeatureType: function(featureType, id){
		if(!id){
			$.spopView({
				text: '控制点ID获取失败'
			})
			return;
		}
		var param = {
			'id': id,
	    "properties": {
	      "featureType": featureType || '99'
	    }
		}
		$("#loading").css("display","block");
		var _url = configURL.krs+"controlPoint/update?kieVersion=empty";
		$.postAjax(_url, [param], function(data){
			$("#loading").css("display","none");
			var _message = data.message,
				_type = false;
			if(data.code == '0'){
				_type = true;
			}
			if(!controlPoint.catchFeatureType){
				_message = '修改出现一个未知问题,请重新加载数据';
			}else{
				let _html = controlPoint.createTypeContent(featureType, id);
				controlPoint.catchFeatureType.options.html_type = _html;
			}
			$.spopView({
				text: _message,
				type: _type
			})
		})
	},
	
//	地图初始化--即显示所有已绘制过的范围
	initMap: function(){
		if(controlPoint.groupList.length){
			controlPoint.groupNameModal();
		}else{
			$("#loading").css("display","block");
			var _url = configURL.krs+"controlPoint/groupNames?kieVersion=empty";
			$.getAjax(_url, {}, function(data){
				$("#loading").css("display","none");
				var _list = [];
				if(!data.result && data.message){
					$.spopView({
						text: data.message
					})
				}else{
					_list = data.result;
				}
				for(var i=0; i<_list.length; i++){
					controlPoint.groupList.push({
						'id': _list[i],
						'name': _list[i]
					})
				}
				controlPoint.groupNameModal();
			})
		}
	},
	
//	绘制完成根据类型回调当前函数
	rectBounds: function(layers){
		controlPoint._range = layers.feature;
	}
	
}
$.mapType = controlPoint;
//点击服务列表
controlPoint.Table();
