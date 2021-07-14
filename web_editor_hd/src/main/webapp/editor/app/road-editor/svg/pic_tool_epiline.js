iD.svg.PicToolEpiline = function(context){
	
	function EpilineTool(){
		// canvas绘制数据
		this._canvasGeometrys = [];
		this.$surface;
		this.$tools;
		this.player;
		this.trackObj;
		this.isMutiTracks = false;
		this.viewOptions = {
			scale: [1, 1],
			minZoom: 1,
			maxZoom: 10,
			position: [0, 0]
		}
    }
    
    // nodeid - dx\dy\dz
    // var trackNodeOffsetChanged = {};
	
	/**
	 * 初始化，生成参数列表、图片、canvas
	 * @param {Object} player
	 * @param {Object} surface
	 */
	EpilineTool.prototype.init = function(player, surface){
		this.player = player;
		this.$surface = surface.node ? surface : d3.select(surface);
		var self = this;
		var isMutiTracks = self.hasMultiTracks();
		
        var $tools = self.$surface.selectAll('.rightbody-tools').data([0]);
        $tools.enter().append('div').attr('class', 'rightbody-tools');
        this.$tools = $tools;
        
        var $div = $tools.append('span').attr('class', 'item-group');
        $div.append('label').text('跨帧:');
        $div.append('input').attr({
        	'type': 'number',
        	'step': 1,
        	'value': 6,
        	'name': 'stepnum'
        }).attr('class', 'right-param right-stepnum')
        .on('change', function(){
        	self.updateImageUrl();
        	self.updateEpilineParam();
        });
        
    	// 201811113 所有用户都可以查看标定面板，_systemType为7时，可以调整/保存参数，除车高
        // 20181217 标定面板 _systemType为8时，可以调整/保存车高参数；
        // 20190517 控制点标定，可以调整参数
        if(iD.User.isTrackStandardRole() || iD.User.isTrackControlPointRole()) {
        	var cameraHeight = player.getCameraHeight() || 0;
        	if(window._systemType == 8){
        		var $div = $tools.append('span').attr('class', 'item-group no-tracks sys8');
        		$div.append('label').text('车高:');
        		$div.append('input').attr({
        			'type': 'number',
        			'step': 0.1,
        			'value': cameraHeight,
        			'name': 'height'
        		}).attr('class', 'right-param right-height')
        		.on('change', function(){
        			// self.updateEpilineParam();
        		});
        	}else {
		        var $div = $tools.append('span').attr('class', 'item-group no-tracks sys7');
		        $div.append('label').text('翻滚角:');
		        $div.append('input').attr({
		        	'type': 'number',
		        	'step': 0.05,
		        	'value': 0,
		        	'name': 'roll'
		        }).attr('class', 'right-param right-roll')
		        .on('input', function(){
		        	self.updateEpilineParam();
		        });
		        
		        var $div = $tools.append('span').attr('class', 'item-group no-tracks sys7');
		        $div.append('label').text('俯仰角:');
		        $div.append('input').attr({
		        	'type': 'number',
		        	'step': 0.01,
		        	'value': 0,
		        	'name': 'pitch'
		        }).attr('class', 'right-param right-pitch')
		        .on('input', function(){
		        	self.updateEpilineParam();
		        });
		        
		        var $div = $tools.append('span').attr('class', 'item-group no-tracks sys7');
		        $div.append('label').text('方位角:');
		        $div.append('input').attr({
		        	'type': 'number',
		        	'step': 0.01,
		        	'value': 0,
		        	'name': 'azimuth'
		        }).attr('class', 'right-param right-azimuth')
		        .on('input', function(){
		        	self.updateEpilineParam();
                });
                
                var $offset = $tools.append('div').attr('class', 'item-offset');
                var $div = $offset.append('span').attr('class', 'item-group no-tracks sys7');
                $div.append('label').text('dx(UTM):');
                $div.append('input').attr({
                    'type': 'number',
                    'step': 0.01,
                    'value': 0,
                    'name': 'x'
                }).attr('class', 'right-param right-x')
                .on('input', function(){
                    // changeNodeOffset(this);
                    self.updateEpilineParam();
                });
                var $div = $offset.append('span').attr('class', 'item-group no-tracks sys7');
                $div.append('label').text('dy(UTM):');
                $div.append('input').attr({
                    'type': 'number',
                    'step': 0.01,
                    'value': 0,
                    'name': 'y'
                }).attr('class', 'right-param right-y')
                .on('input', function(){
                    // changeNodeOffset(this);
                    self.updateEpilineParam();
                });
                var $div = $offset.append('span').attr('class', 'item-group no-tracks sys7');
                $div.append('label').text('dz:');
                $div.append('input').attr({
                    'type': 'number',
                    'step': 0.01,
                    'value': 0,
                    'name': 'z'
                }).attr('class', 'right-param right-z')
                .on('input', function(){
                    // changeNodeOffset(this);
                    self.updateEpilineParam();
                });
        	}
	        
	        
	        var $div = $tools.append('span').attr('class', 'item-group no-tracks');
	        $div.append('button').text('保存参数')
	        	.attr('type', 'button')
	        	.attr('class', 'right-button right-btn-save')
	        	.on('click', function(){
	        		self.saveParamsRequest(true);
	        	});
	        $div.append('button').text('核线不通过')
	        	.attr('type', 'button')
	        	.attr('class', 'right-button right-btn-saveNo')
	        	.on('click', function(){
	        		self.saveParamsRequest();
	        	});
        }
        
        var $div = $tools.append('span').attr('class', 'item-group more-tracks');
        $div.append('label').text('轨迹:');
        $div.append('select').attr({
        	'name': 'trackId'
        }).attr('class', 'right-param right-trackId')
        .on('change', function(){
        	var option = this.selectedOptions[0];
        	if(option){
        		self.trackObj = d3.select(option).datum();
        	}
        	self.updateImageUrl();
        	self.updateEpilineParam();
        });
        // image
        var imgUrl = self.player.getNewPicUrl(self.player.pic_point, '0') || '';
        var $rightDiv = self.$surface.selectAll('.rightbody-item').data([0]);
        $rightDiv.enter().append('div').attr('class', 'rightbody-item');
        $rightDiv.selectAll(".picplayerimg.main").data([imgUrl]).enter().append('img').classed("picplayerimg main", true);
        $rightDiv.selectAll("img").attr("src", imgUrl);
        // 初始化轨迹相关样式
        self.refreshTrackInit();
        // cavnas
        if(self.$surface.select('#rightbody-canvas-content').empty()){
        	self.$surface.append('div').attr('id', 'rightbody-canvas-content')
        		.attr('class', 'rightbody-canvas-content')
        		.append('canvas').attr('id', 'rightbody-canvas')
        		.attr('class', 'rightbody-canvas');
        }

        // offset change
        // function changeNodeOffset(input){
        //     if(!player || !player.wayInfo) return ;
        //     var node = player.allNodes[self.getStepsPicIndex()];
        //     var offset = trackNodeOffsetChanged[node.id];
        //     if(!offset){
        //         offset = trackNodeOffsetChanged[node.id] = {
        //             x: 0,
        //             y: 0,
        //             z: 0
        //         };
        //     }
        //     if(offset.hasOwnProperty(input.name)){
        //         let v = input.value;
        //         if(isNaN(v)){
        //             v = 0;
        //             input.value = 0;
        //         }
        //         offset[input.name] = Number(v);
        //     }
        // }
        
        this.initEvent();
	}
	
	/**
	 * 初始化图片url
	 * @param {String} url
	 */
	EpilineTool.prototype.initImageUrl = function(url){
		var self = this;
		if(!url) return ;
		self.$surface.select('img.picplayerimg.main').attr('src', url);
	}
	
	/**
	 * 初始化事件
	 */
	EpilineTool.prototype.initEvent = function(){
		var self = this;
		var $view = self.$surface.select('#rightbody-canvas-content');
		var layer = self.viewOptions;
		
		$view.on('mousewheel.pic_tool_epiline', function(){
        	var event = window.event;
            var delta = event.wheelDelta // Webkit
                || -event.detail; // Firefox
            var scale = delta > 0 ? 1.1 : 0.9;
            var mouseX = event.offsetX;
            var mouseY = event.offsetY;
            var pos = layer.position;
            layer.__zoom = layer.__zoom || 1;
            var newZoom = layer.__zoom;
            newZoom *= scale;
            newZoom = Math.max(
                Math.min(layer.maxZoom, newZoom),
                layer.minZoom
            );
            scale = newZoom / layer.__zoom;
            layer.__zoom = newZoom;
            // Keep the mouse center when scaling
            pos[0] -= (mouseX - pos[0]) * (scale - 1);
            pos[1] -= (mouseY - pos[1]) * (scale - 1);
            // 可能会出现 9.xxxxxxxxe-14的情况
            if((pos[0] + '').indexOf('e') > -1){
            	
            }
            if(scale <= layer.minZoom && newZoom <= layer.minZoom){
            	pos = [0, 0];
            }
			pos[0] = parseInt(pos[0]);
			pos[1] = parseInt(pos[1]);
            if(pos[0] == 0 && pos[1] == 0){
            	scale = layer._zoom = layer.minZoom;
            	layer.scale = [layer.minZoom, layer.minZoom]
            }else {
				layer.scale = [newZoom, newZoom];
            }
            if(layer.scale[0] < layer.minZoom){
            	layer.scale[0] = layer.minZoom;
            }
            if(layer.scale[1] < layer.minZoom){
            	layer.scale[1] = layer.minZoom;
            }
            layer.position = pos;
            
            self.updateViewDomStyle(layer);
        });
	}
	
	EpilineTool.prototype.resetViewDomStyle = function(){
		var self = this;
		
		self.viewOptions = {
			scale: [1, 1],
			minZoom: 1,
			maxZoom: 10,
			position: [0, 0]
		};
		self.updateViewDomStyle(self.viewOptions);
	}
	
	EpilineTool.prototype.updateViewDomStyle = function (layer){
    	var self = this;
    	var $canvasView = self.$surface.select('#rightbody-canvas-content');
		var $view = self.$surface.select('.rightbody-item'),
            width = $view.attr("d-width"),
            height = $view.attr("d-height");
    	var pos = [layer.position[0], layer.position[1]];
    	var x = parseInt(pos[0])/layer.scale[0];
        var y = parseInt(pos[1])/layer.scale[0];
        var x2 = pos[0] + (width*layer.scale[0]);
        var y2 = pos[1] + height*layer.scale[0];
        if (x > 0 || y > 0) {
            if (x > 0) {
                pos[0] = 0;
            }
            if (y > 0) {
                pos[1] = 0;
            }
        }
        if (x2 < width || y2 < height) {
            if (x2 < width) {
                pos[0] = pos[0] + (width - x2);
            }

            if (y2 < height) {
                pos[1] = pos[1] + (height - y2);
            }
        }
        pos[0] = parseInt(pos[0]);
        pos[1] = parseInt(pos[1]);
        
        // 添加动画效果后，缩放到10级，慢慢回到9级时
        // 图片会消失，动画结束后会显示，未发现原因
        var style = 'transform-origin: 0px 0px 0px; transition: all 0s ease-out; transform: translate3d(' +
            pos[0] + 'px, ' + pos[1] + 'px, 0px) scale3d(' + layer.scale[0] + ', ' + layer.scale[1] + ', 1)';
        
        $view.attr('style', style);
        $canvasView.attr('style', style);
    }
	
	function intersects(extent,nodes) {
        let restArr = [];
        for(var i=0,len = nodes.length;i<len;i++){
            let node = nodes[i]
            if(iD.util.isInsideRect(extent,node.loc)){
                restArr.push(node);
            }
        }
        return restArr;
    }
	
	_.assign(EpilineTool.prototype, {
		// ======================
        show: function(){
        	var self = this;
        	if(!self.$surface || !self.$surface.size()){
        		return ;
        	}
        	self._canvasGeometrys = [];
        	self.$surface.classed('active', true);
        	self.resizeDomStyle();
        	self.resetViewDomStyle();
        	/*
        	var val = parseInt(self.inputStepNum());
        	if(isNaN(val)){
        		self.inputStepNum(1);
        	}
        	*/
        	self.refreshTrackInit();
//      	self.updateImageUrl();
        	self.updateEpilineParam();
        },
        inputStepNum: function(newVal){
        	var self = this;
        	var $input = self.$surface.select('div.rightbody-tools input.right-stepnum');
        	if(newVal != null && !isNaN(newVal)){
        		$input.value(newVal);
        		return ;
        	}
        	var val = $input.value();
        	val = parseInt(val);
        	if(isNaN(val)){
        		val = 0;
        	}
        	return val;
        },
        getBodyParam: function(){
        	var self = this;
        	var $inputs = self.$surface.selectAll('div.rightbody-tools input.right-param');
        	var result = {};
        	$inputs.each(function(){
        		if(this.name && !this.disabled){
        			result[this.name] = isNaN(this.value) ? $.trim(this.value) : +this.value;
        		}
        	});
        	return result;
        },
        setBodyParam: function(data, toChange = true){
        	var self = this;
        	var $inputs = self.$surface.selectAll('div.rightbody-tools input.right-param');
        	var changed = false;
        	$inputs.each(function(){
        		if(this.name && data[this.name] != null){
        			this.value = data[this.name];
        			changed = true;
        		}
        	});
        	toChange && changed && self.updateEpilineParam();
        },
        checkBodyShown: function(){
        	var self = this;
        	if(!self.$surface || !self.$surface.size()){
        		return false;
        	}
        	return self.$surface.classed('active');
        },
        // getStepNodeOffset: function(){
        //     if(!this.player) return ;
        //     var node = this.player.allNodes[this.getStepsPicIndex()];
        //     return {
        //         id: node.id,
        //         // 偏移量默认0
        //         offset: trackNodeOffsetChanged[node.id] || {
        //             x: 0,
        //             y: 0,
        //             z: 0
        //         }
        //     };
        // },
        /**
         * 获取轨迹点索引范围内的经过跨帧的索引
         */
        getStepsPicIndex: function(){
        	var self = this;
        	var player = this.player;
        	var stepNum = 6;
        	var val = parseInt(self.inputStepNum());
        	if(!isNaN(val)){
        		stepNum = val;
        	}else {
        		// 非数字改默认值
        		self.inputStepNum(stepNum);
        	}
        	var rightBodyIndex = player.selectPicIndex + stepNum;
        	var node = player.allNodes[rightBodyIndex];
        	if(!node){
        		if(stepNum < 0){
        			rightBodyIndex = 0;
        		}else {
        			rightBodyIndex = player.allNodes.length - 1;
        		}
        	}
        	
        	return rightBodyIndex;
        },
        /**
         * 获取多轨迹时，右侧轨迹多少米位置的轨迹点
         */
        getMeterStepsNode: function(){
        	var self = this;
        	var player = this.player;
        	var stepNum = 0;
        	var val = parseInt(self.inputStepNum());
        	if(!isNaN(val)){
        		stepNum = val;
        	}else {
        		// 非数字改默认值
        		self.inputStepNum(stepNum);
        	}
        	var result = self.getTrackBaseNode();
        	var rightBodyIndex = result.index;
        	// 范围内所有轨迹点
        	var bounds =iD.util.getBounds(result.node.loc, Math.abs(stepNum));
            var allNodes = intersects(bounds, self.trackObj.nodes).map(function(d){
            	return {
            		index: self.trackObj.nodes.indexOf(d)
            	};
            });
        	
    		if(stepNum < 0){
    			rightBodyIndex = _.min(_.pluck(allNodes, 'index'));
    		}else if(stepNum > 0) {
    			rightBodyIndex = _.max(_.pluck(allNodes, 'index'));
    		}
        	
        	return {
        		node: self.trackObj.nodes[rightBodyIndex],
        		index: rightBodyIndex
        	};
        },
        /**
         * 多轨迹情况下， 获取离视频轨迹点最近的轨迹点
         */
        getTrackBaseNode: function(){
        	var self = this;
        	var player = this.player;
        	
        	var point = player.pic_point;
        	var index = 0;
        	var result = iD.util.pt2LineDist2(_.pluck(self.trackObj.nodes, 'loc'), point.loc);
        	var node;
        	if(result){
        		index = result.i;
        	}
        	node = self.trackObj.nodes[index];
        	
        	return {
        		node: node,
        		index: index
        	};
        },
        /**
         * 更新轨迹点图片，视频跳帧时，会执行该函数
         */
        updateImageUrl: function(){
        	if(!this.checkBodyShown()){
        		return ;
        	}
        	var self = this;
        	var player = this.player;
        	var node, index = -1;
        	if(self.isMutiTracks){
        		var obj = self.getMeterStepsNode();
        		node = obj.node;
        		index = obj.index;
        	}else {
        		index = self.getStepsPicIndex();
        		node = player.allNodes[index];
        	}
        	if(context.variable){
        		context.variable.epilineParam = {
        			trackId: node.tags.trackId,
        			trackPointId: node.tags.trackPointId,
        			node: node,
        			index: index
        		};
        	}
            self.$surface.select('img.picplayerimg.main').attr('src', self.player.getNewPicUrl(node, '0'));

            // let offset = self.getStepNodeOffset();
            // if(offset.offset){
            //     self.setBodyParam(offset.offset, false);
            // }
        },
        hide: function(){
        	var self = this;
        	if(!self.$surface || !self.$surface.size()){
        		return ;
        	}
        	self.$surface.classed('active', false);
        	self.clearCanvas();
        },
        /**
         * 绘制Polyline十字
         * @param {Array<Array>} clickOffset 一个像素坐标，视频坐标经过leftZoomOffset转换
         * @param {Object} opts
         */
        createCanvasPolylineCross: function(clickOffset, opts = {}){
        	var self = this;
        	var player = this.player;
        	if(!self.checkBodyShown()) return ;
        	var style = {
	            strokeColor: iD.picUtil.colorRGBA(0, 187, 255, 0.7),
	            lineWidth: 2,
	            lineType: 'dashed&solid'
	        };
	        _.assign(style, opts);
	        
	        var viewDom = self.$surface.select('.rightbody-item').node();
	        /*
//	        var leftViewDom = player.pics.select(".item.active");
//      	var point = player.reductionPoint(clickOffset, leftViewDom);
//      	var imgOffset = _.clone(point);
			// 坐标已经是减去了车高
        	var geometry = iD.picUtil.pixelToLngLat(player, clickOffset);
        	var trackIndex = self.getStepsPicIndex();
        	var shape = iD.AutoMatch.locsToPicPlayer([
        		[geometry.lng, geometry.lat, geometry.elevation]
        	], player, null, trackIndex)[0];
        	if(!shape){
        		// 没有像素坐标
				shape = {
					coordinates: [[0, 0]]
				}
        	}
        	var point = shape.coordinates[0];
        	point = player.transformPoint(point, viewDom);
        	
//      	console.log('点击位置 ' + clickOffset.join(','), '地图坐标 ' + [geometry.lng, geometry.lat, geometry.elevation].join(','), '转换位置 ' + point.join(','));
	        var width = self.$surface.node().offsetWidth;
       		var height = self.$surface.node().offsetHeight;
       		var pointList = [
       			[0, point[1], 'start'],
       			[width, point[1], 'end'],
       			[point[0], 0, 'start'],
       			[point[0], height, 'end']
       		];
       		*/
       		
       		var trackNode;
       		if(self.isMutiTracks){
        		// 多轨迹情况
        		trackNode = self.getMeterStepsNode().node;
        	}else {
        		trackNode = player.allNodes[self.getStepsPicIndex()];
        	}
        	
       		var pointList = iD.picUtil.getCrossLinePointsByTrack(player, clickOffset, self.$surface.node(), trackNode);
       		if(!pointList){
       			pointList = [[0, 0], [0, 0]];
       		}
       		/*
       		for(var i = 0; i<pointList.length; i++){
       			pointList[i] = player.transformPoint(pointList[i], viewDom);
       		}
       		console.log('horizontal pointList: ', pointList);
       		*/
	        
	        return self.canvasDrawGeometry(_.extend({
	            type: "line",
	            pointList: pointList,
	            _param: {
	            	point: clickOffset,
	            	type: 'polyline-cross'
	            }
	        }, style));
        },
        /**
         * 绘制Polyline
         * @param {Array<Array>} points 一组像素坐标，视频坐标经过leftZoomOffset转换
         * @param {Object} opts
         */
        createCanvasPolyline: function(points, opts = {}){
        	var self = this;
        	var player = this.player;
        	if(!self.checkBodyShown()) return ;
        	
        	var style = {
	            strokeColor: iD.picUtil.colorRGBA(0, 187, 255, 0.7),
	            lineWidth: 2
	        };
	        _.assign(style, opts);
	        
	        var viewDom = self.$surface.select('.rightbody-item').node();
	        var leftViewDom = player.pics.select(".item.active");
	        
	        var pointList = [];
	        points.forEach((protoPoint, idx)=>{
	        	var point = player.reductionPoint(protoPoint, leftViewDom);
	        	point = player.transformPoint(point, viewDom);
	        	if(protoPoint[2]){
	        		point[2] = protoPoint[2];
	        	}
	        	pointList.push(point);
	        });
	        self.canvasDrawGeometry(_.extend({
	            type: "line",
	            pointList: pointList,
	            _param: {
	            	points: points,
	            	type: 'polyline'
	            }
	        }, style));
        },
        /**
         * 绘制核线
         * @param {Array|Array<Array>} points 一个或一组像素坐标，经过leftZoomOffset转换
         */
        createCanvasEpiline: function(points){
        	var self = this;
        	var player = this.player;
        	if(!self.checkBodyShown()) return ;
        	
        	var style = {
	            strokeColor: iD.picUtil.colorRGBA(255, 0, 0, 0.8),
	            lineWidth: 2
	        };
	        var firstPoints = [];
        	if(_.isArray(points[0])) {
        		firstPoints = points;
	        }else {
	        	firstPoints = [ points ];
	        }
	        var viewDom = self.$surface.select('.rightbody-item').node();
	        var leftViewDom = player.pics.select(".item.active");
	        var node2, node1 = player.allNodes[player.selectPicIndex];
        	if(self.isMutiTracks){
        		// 多轨迹情况
        		node2 = self.getMeterStepsNode().node;
        	}else {
        		node2 = player.allNodes[self.getStepsPicIndex()];
        	}
        	
//			var K = iD.AutoMatch.getParamK(player);
	        for(var idx in firstPoints){
	            var protoPoint = firstPoints[idx];
	            // 以左侧为准转换为原图坐标
	            var point = player.reductionPoint(protoPoint, leftViewDom);
	            // 返回原图坐标
	            var results = iD.picUtil.getComputeEpilines(point, {
	            	node1: node1,
                    node2: node2,
                    player: player
	            });
	            var pointList = _.cloneDeep(results[0]);
	            pointList.forEach((pt, i)=>{
	            	// 以右侧为准转为像素坐标
	            	pointList[i] = player.transformPoint(pt, viewDom)
	            });
	            
	            self.canvasDrawGeometry(_.extend({
	                type: "line",
	                pointList: pointList,
	                _param: {
	                	point: protoPoint,
	                	type: 'epiline'
	                }
	            }, style));
	        }
        },
        canvasDrawGeometry: function(style){
        	var self = this;
        	var player = this.player;
        	var canvasDom = self.$surface.select('#rightbody-canvas').node(); 
			var ctx  = canvasDom.getContext("2d");
			// 不需要缩放
			// var vp = viewZoomParam;
			if(style){
			    self._canvasGeometrys.push(style);
			}
			var drawGeoDataList = self._canvasGeometrys;
			var canvasWidth = canvasDom.width
			var canvasHeight = canvasDom.height;
			ctx.clearRect(-Infinity, -Infinity, Infinity, Infinity);
			canvasDom.width = canvasWidth;
			canvasDom.height = canvasHeight;
			ctx.clearRect(0, 0, canvasWidth,  canvasHeight);
			
			for(var idx in drawGeoDataList){
			    var style = _.clone(drawGeoDataList[idx], true);
			    var styleType = style.type;
			    delete style.type;
			
			    if(styleType == "star" || styleType == "point"){
			        style.x = scaleNum(style.x);
			        style.y = scaleNum(style.y);
			        player.createStarOnCtx(ctx, style);
			    }else if(styleType == "line" || styleType == "polygon"){
			        ctx.beginPath();
			        if(style.lineJoin){
			            ctx.lineJoin = style.lineJoin;
			        }
			        if(style.lineWidth){
			            ctx.lineWidth = style.lineWidth;
			        }
			        if(style.color){
			            ctx.fillStyle = style.color;
			        }
			        if(style.strokeColor){
			            ctx.strokeStyle = style.strokeColor;
			        }
			        var pointList = style.pointList;
			        
			        // s-e  s-e
			        if (style.lineType == "dashed&solid") {
                        for (var i = 0; i < pointList.length; i++) {
                            var point = pointList[i];
                            if (i == 0) {
                                if (point[2] != "end") {
                                    ctx.moveTo(point[0], point[1]);
                                }
                            } else {
                                var lastStep = pointList[i-1];
                                if (lastStep[2]) {
                                    if (lastStep[2] == "start") {
                                        ctx.lineTo(point[0], point[1]);
                                    } else if (lastStep[2] == "end"){
                                        ctx.moveTo(point[0], point[1]);
                                    }
                                } else {
                                    ctx.lineTo(point[0], point[1]);
                                }
                            }
                        }
                    }else {
                    	ctx.moveTo( scaleNum(pointList[0][0]), scaleNum(pointList[0][1]) );
                    	for(var i = 1; i<pointList.length; i++){
                    	    ctx.lineTo( scaleNum(pointList[i][0]), scaleNum(pointList[i][1]) );
                    	}
                    }
			
			        ctx.fill();
			        ctx.stroke();
			        ctx.closePath();
			    }
			}
			
			function scaleNum(num){
			    return num;
			}
			if(style){
			    return {
			        index: drawGeoDataList.length - 1,
			        style: style,
			        type: style.type
			    }
			}
       	},
       	clearCanvas: function(){
       		var self = this;
       		self._canvasGeometrys.length = 0;
       		self._canvasGeometrys = [];
       		self.canvasDrawGeometry();
       	},
       	/**
       	 * 更新车高、roll、pitch、azimuth参数，更新绘制
       	 */
       	updateEpilineParam: function(){
       		var self = this;
       		var player = this.player;
       		var param = self.getBodyParam();
//     		console.log('更新轨迹点参数：', param);
       		// 重绘核线
       		/*
       		var clickPoints = _.pluck(self._canvasGeometrys, '_param').map(function(d){
       			return d.type == 'epiline' && d.point || false;
       		});
       		*/
       		var oldParam = {
       			epiline: [],
       			polylineCross: []
       		};
       		self._canvasGeometrys.forEach(function(shape){
       			var d = shape._param || {};
       			if(d.type == 'epiline' && d.point){
       				oldParam.epiline.push(d.point);
       			}else if(d.type == 'polyline-cross'){
       				oldParam.polylineCross.push({
       					point: d.point,
       					style: {
       						lineType: shape.lineType,
       						strokeColor: shape.strokeColor,
       						lineWidth: shape.lineWidth
       					}
       				});
       			}
       		});
       		clickPoints = _.compact(oldParam.epiline);
//     		console.log(oldParam.epiline.length  + '条核线执行重绘操作，坐标：', oldParam.epiline);
       		// self.updateAllNodesParam(param.roll, param.pitch, param.azimuth);
       		self.updateAllNodesParam(param.roll, param.pitch, param.azimuth, {
                x: param.x || 0,
                y: param.y || 0,
                z: param.z || 0
            });
       		self.clearCanvas();
       		
       		oldParam.epiline.length && self.createCanvasEpiline(oldParam.epiline);
       		if(oldParam.polylineCross.length){
       			oldParam.polylineCross.forEach((d)=>{
       				self.createCanvasPolylineCross(d.point, d.style);
       			});
       		}
       		player.resetCanvas();
       	},
       	/**
       	 * 更新当前轨迹中所有轨迹点的R\C\T参数
       	 * @param {Number} roll 偏移量
       	 * @param {Number} pitch 偏移量
       	 * @param {Number} azimuth 偏移量
       	 * @param {Object} offset xyz偏移量，UTM
       	 */
       	updateAllNodesParam: function(roll = 0, pitch = 0, azimuth = 0, offset){
       		if(window._systemType == 8){
       			// 车高标定不刷新RPA
       			return ;
            }
            // xyz偏移量
            // var stepInfo = this.getStepNodeOffset();
            // var offsetId = stepInfo && stepInfo.id;
            // var offset = stepInfo && stepInfo.offset || {};
            offset = offset || {
                x: 0,
                y: 0,
                z: 0
            };

       		var player = this.player;
		    var allNode = player.allNodes;
		    var firstNode;
            var node, obj, param;
            var useUTM = true;
            var delta = {roll,pitch,azimuth}
		    for(var i=0;i<allNode.length;i++){
		        node = allNode[i];
		        param = {
		        	x: node.tags.x,
                    y: node.tags.y,
                    z: node.tags.z,
		        	// roll: node.tags.roll + roll,
		        	// pitch: node.tags.pitch + pitch,
		        	// azimuth: node.tags.azimuth + azimuth
		        	roll: node.tags.roll ,
		        	pitch: node.tags.pitch ,
		        	azimuth: node.tags.azimuth 
                }
                // if(offsetId == node.id){
                param.z += (offset.z || 0);
                if(offset.x || offset.y){
                    if(useUTM){
                        let utm = iD.util.LLtoUTM_(node.tags.x, node.tags.y);
                        let xy = iD.util.UTMtoLL_(utm.x + offset.x, utm.y + offset.y, utm.zoneNumber);
                        param.x = xy[0];
                        param.y = xy[1];

                    }else {
                        param.x += (offset.x || 0);
                        param.y += (offset.y || 0);
                    }
                }
                // }
//		        height = node.tags.z;
		        if(i==0){
		            firstNode = allNode[i];
		            obj = iD.util.pos2CameraRTC(param, firstNode.tags, param.z,delta);
		            /*
		            console.log("R", checkMultArrVal(node.tags.R, obj.R));
		            console.log(_.cloneDeep(node.tags.R), obj.R);
		            console.log("C", checkMultArrVal(node.tags.C, obj.C));
		            console.log(_.cloneDeep(node.tags.C), obj.C);
		            console.log("T", checkMultArrVal(node.tags.T, obj.T));
		            console.log(_.cloneDeep(node.tags.T), obj.T);
		            */
		            node.tags.R = obj.R;
		            node.tags.C = obj.C;
		            node.tags.T = obj.T;
		        }else {
		        	obj = iD.util.pos2CameraRTC(param, firstNode.tags, param.z,delta);
		            node.tags.R = obj.R;
		            node.tags.C = obj.C;
		            node.tags.T = obj.T;
		        }
		    }
		},
		// 右侧图片对比resize
        resizeDomStyle: function(){
        	var self = this;
        	if(!self.checkBodyShown()) return ;
            var $rightBodyList = self.$surface.selectAll('div.rightbody-item,div.rightbody-canvas-content');
            var viewDom = self.$surface.node();
//          var viewDom = $rightBodyList.node();
            var newHeight = viewDom.offsetHeight;
            var newWidth = viewDom.offsetWidth;
            resizeDoms($rightBodyList);
            
            function resizeDoms($list){
                // 尺寸改变之前
                $list.style({
                    left: 0,
                    top: 0
                });
                $list.attr({
                    "d-height": newHeight,
                    "d-width": newWidth
                }).style({
                    height: newHeight + "px",
                    width: newWidth + "px"
                });
                $list.selectAll("canvas").style({
                    width: newWidth + "px",
                    height: newHeight + "px"
                }).each(function(){
                    this.width = $list.attr("d-width") || newWidth + 'px';
                    this.height = $list.attr("d-height") || newHeight + 'px';
                });
            }
        },
		/**
		 * 保存右侧参数，刷新页面
		 */
		saveParamsRequest: function(type){
			var doIt = type ? 'true' : 'false';            //兼容旧流程
			var checkState = type ? '1' : '0';            //新流程-核线检查不通过
			var self = this;
			var player = this.player;
			if(!self.checkBodyShown()){
        		return ;
        	}
       		var param = self.getBodyParam();
       		// param.height, param.roll, param.pitch, param.azimuth
       		var bodyParam = {
			    "taskId": iD.Task.d.protoData.id,
			    "properties": []
			};
			// 只有_systemType为8时，才能设置车高
       		if(window._systemType == 8){
       			var height = player.getCameraHeight();
       			height = isNaN(param.height) ? height : param.height;
       			bodyParam.properties.push({
		            "id": "cameraHeight",
		            "value": "" +height
		        });
       		}else if(window._systemType == 7){
       			bodyParam.properties.push(...[{
		            "id": "rollDelta",
		            "value": "" + (param.roll || 0)
		        }, {
		            "id": "pitchDelta",
		            "value": "" + (param.pitch || 0)
		        }, {
		            "id": "azimuthDelta",
		            "value": "" + (param.azimuth || 0)
		        }]);
       		}
       		if(!bodyParam.properties.length){
       			return ;
       		}
       		bodyParam.properties.push({
	            "id": "doIt",
	            "value": doIt
	        });
       		bodyParam.properties.push({
	            "id": "checkState",
	            "value": checkState
	        });
	        // console.log('saveParamsRequest ... ', bodyParam);
       		
			d3.json(iD.config.URL.kts + 'form/form-data')
				.header("Content-Type", "application/json;charset=UTF-8")
				.post(JSON.stringify(bodyParam), function(error, data) {
					/*
		            if (error || data && data.code != "0") {
		                Dialog.alert(data && data.message || '参数保存失败');
		                return;
		            }
		            */
		            var url = window.location.href;
					var param = "taskID=" + iD.Task.d.task_id;
					if(iD.url.getUrlParam("taskID")){
						url = url.replace(/taskID=\d+/, param);
					}else {
						url = url + (url.indexOf("?") > -1 ? "&" : "?") + param;
					}
					window.location.href = url;
				});
		},
		/**
		 * 根据轨迹查询扩展参数
		 * @param {String} trackid
		 * @param {Function} callback 回调函数
		 */
		loadTrackParams: function(trackid, callback){
			var self = this;
			callback = callback || _.noop;
			if(!trackid){
				callback();
				return ;
            }
            var task = iD.Task.d;
            let url = iD.config.URL.krs + 'track/extend/' + trackid;
            if(task && task.tags.projectId){
                url += '?projectId=' + task.tags.projectId;
            }
			d3.json(url)
				.get(function(error, data){
					if (error || data && data.code != "0") {
						callback();
		                return;
		            }
					var result = data.result;
					if(!result || _.isEmpty(result)){
						callback();
						return ;
					}
					
					var param;
					// 车高标定不加载RPA偏移量
					if(window._systemType == 8){
						param = {
							height: result.cameraHeight
						};
                    }
                    else {
						param = {
							height: result.cameraHeight,
							roll: result.rollDelta,
							pitch: result.pitchDelta,
							azimuth: result.azimuthDelta
						};
					}
					self.setBodyParam(param);
					callback(param);
				});
		},
		hasMultiTracks: function(){
			// 设置轨迹参数环节
			// url参数中若有reset=true参数，那么允许显示多轨迹对比，否则不显示
			var isReset = iD.url.getUrlParam('reset') === 'true';
			if(!isReset){
				return false;
			}
			var player = this.player;
			return player.dataMgr.tracks.length > 1;
		},
		getTracks: function(){
			var player = this.player;
			if(!player.wayInfo){
				return [];
			}
			return player.dataMgr.tracks.filter(d => d.trackId != player.wayInfo.trackId);
		},
		refreshTrackInit: function(targetTrackId){
			var player = this.player;
			var $tools = this.$tools;
			var self = this;
			var isMutiTracks = self.hasMultiTracks();
			this.isMutiTracks = isMutiTracks;
			
			// 跨帧
			var $step = $tools.select('input.right-stepnum');
			var $div = d3.select($step.node().parentNode);
			$div.selectAll('label.meter').remove();
	        if(isMutiTracks){
	        	$step.value(0);
	        	$div.append('label').text('米').attr('class', 'meter');
	        }
	        
	        // 轨迹
	        var $select = $tools.select('select.right-trackId');
	        if(isMutiTracks){
	        	var tracks = self.getTracks();
	        	var $options = $select.html('').selectAll('option').data(tracks);
	        	$options.enter()
	        		.append('option')
	        		.attr('value', d => d.trackId)
	        		.text(d => d.trackId);
	        	$options.exit().remove();
	        	
	        	var d = tracks[0];
	        	// 使用指定id
	        	if(targetTrackId){
	        		d = tracks.filter(t => t.trackId === targetTrackId)[0] || d;
	        	}
	        	$select.value(d.trackId);
	        	self.trackObj = d;
	        	
	        	$tools.selectAll('.item-group.no-tracks').classed('hidden', true)
	        		.selectAll('input,button,select').property('disabled', true);
	        	$tools.selectAll('.item-group.more-tracks').classed('hidden', false)
	        		.selectAll('input,button,select').property('disabled', false);
	        }else {
	        	self.trackObj = player.wayInfo;
	        	
	        	$tools.selectAll('.item-group.no-tracks').classed('hidden', false)
	        		.selectAll('input,button,select').property('disabled', false);
	        	$tools.selectAll('.item-group.more-tracks').classed('hidden', true)
	        		.selectAll('input,button,select').property('disabled', true);
	        	
        		// 不为7时，隐藏roll、pitch、azimuth
                // 由于初始化时需要调整默认偏移量，所以不能删除input
                // 7标定、9控制点标定，显示全部调整框
        		if(window._systemType != 7 && window._systemType != 9){
        			$tools.selectAll('.item-group.sys7').classed('hidden', true);
        		}else if(window._systemType != 8){
        			$tools.selectAll('.item-group.sys8').classed('hidden', true);
        		}
	        }
	        
        	self.updateImageUrl();
		}
        // =======******==========
	});
	
	return new EpilineTool();
}
