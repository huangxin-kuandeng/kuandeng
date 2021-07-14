iD.svg.PicToolIntersection = function(context, _opts){
	const constant = _opts.constant;
	const markDrawStatus = _opts.markDrawStatus;
	
	var postCount = 0;
	var intersectionArr = [];
	var intersectionCanvasPoints = [];
	var player, drawTool, modelNameList;
	var dispatch = d3.dispatch('start', 'intersection_callback', 'end', 'request_failed');
	function Tool(){
		this.$element;
		this.ignoreList; // 前方交会前图形；
		this.shapes; // 前方交会用图形，点、核线等
		this.shown = false;
	}
	
	Tool.prototype.init = function(arg1, arg2){
		player = arg1;
		drawTool = arg2;
		this.shapes = [];
		this.shown = false;
		var _playerFooter = drawTool.player.getPlayerFooter();
		modelNameList = _playerFooter.getPlayconstantDatatype();
	}
	
	_.assign(Tool.prototype, {
		postCall: null,
		_initDom: function(){
			if(!this.$element){
				this.$element = player.pics && player.pics.select(".item.active");
			}
		},
		show: function(){
			this._initDom();
			if(!drawTool._zrender) return ;
			this.clearCanvas();
			
			// getDisplayList 只会获取显示状态的列表；
			this.ignoreList = _.clone(drawTool._zrender.storage._roots);
			for(var shape of this.ignoreList){
				shape.ignore = true;
			}
			drawTool._zrender.refresh();
			this.shown = true;
			if(window.requestAnimationFrame){
				window.requestAnimationFrame(function(){
					drawTool.clearZRenderHover();
				});
			}
		},
		hide: function(){
			this._initDom();
			if(!drawTool._zrender) return ;
			this.clearCanvas();
			
			var nr = false;
			for(var shape of this.ignoreList || []){
				shape.ignore = false;
				nr = true;
			}
			nr && drawTool._zrender.refresh();
			this.ignoreList = null;
			this.shown = false;
		},
        clearCanvas: function(){
			if(!drawTool._zrender) return ;
			for(var shape of this.shapes){
				shape.ignore = true;
				drawTool._zrender.remove(shape);
			}
			this.shapes.length = 0;
        },
        addShape: function(shape){
			if(!drawTool._zrender) return ;
        	if(shape.__storage != drawTool._zrender.storage){
        		// 排重
        		this.shapes.push(shape);
        	}
        	// 自带排重
        	drawTool._zrender.add(shape);
        },
        removeShape: function(shape){
			if(!drawTool._zrender) return ;
        	var index = this.shapes.indexOf(shape);
        	if(index > -1) this.shapes.splice(index, 1);
        	drawTool._zrender.remove(shape);
        },
		/**
		 * @param {Array} clickOffset 经过leftZoom转换，1级别时点击位置
		 * @param {Number} index 0表示左侧点击，1表示右侧点击
		 */
		getPointData: function(clickOffset, index){
			var self = this;
			var node, xy;
			if(index == 0){
				node = player.pic_point;
				xy = drawTool.reductionPoint(clickOffset);
			}else if(index == 1){
				node = player.allNodes[player.rightPointIndex];
				xy = drawTool.reductionPoint(clickOffset, self.$element);
			}
			return {
                trackPointId: node.tags.trackPointId,
                point: node,
                x: xy[0].toString(),
                y: xy[1].toString()
			}
		},
        leftClickCoord: function(firstOffset, callback){
            var self = this;
            if(_.include([
                    constant.ADD_BOARD,
                ], markDrawStatus.type)){
                // 多边形、矩形
                var pointList = firstOffset;
                for(var poffset of pointList){
                    self.intersectionAdd(poffset, 0, false);
                }
                dispatch.start(false);
            }else if(_.include([
                    constant.INTERSECTION,
					constant.ADD_CONTROL_POINT,
					constant.ADD_OBJECT_PT,
					constant.ADD_TRAFFICLIGHT,
                    ''
                ], markDrawStatus.type) || _.include([constant.MARK_VECTOR_POINT], markDrawStatus.secType)){
                // type参数为""时，当作普通的前方交会，一般用于拖拽
                var xy =  drawTool.reductionPoint(firstOffset);
                self.intersectionAdd(firstOffset, 0);
                dispatch.start();
            }else if(_.include([constant.TELEGRAPH_POLE], markDrawStatus.type)){
                // 杆状物当前帧与下一帧都点击1次
                self.intersectionAdd(firstOffset, 0);
                // 杆状物
                var typeNumber = 1;
                if(intersectionArr[0] && intersectionArr[0].length == typeNumber){
                	dispatch.start();
                }
            }
            
            self.postCall = function(data, points = []){
				var _modelName = modelNameList[markDrawStatus.type];
                _modelName = _modelName && _modelName[0] || '';
                //前方交会回执时执行-结束埋点
	        	iD.logger.editElement({
                    'tag': 'intersection_end',
                    'modelName': _modelName
                });
	        	
            	self.postCall = undefined;
                drawTool.clearLeftZrenderMarker();

                callback = callback || _.noop;
                var isMultPoints = false;
                if(_.isArray(data)){
                    if(data.length == 1){
                        data = data[0]
                    }else if(data.length > 1){
                        isMultPoints = true;
                    }
                }

                if(_.isArray(points[0]) && !_.isArray(data)){
                    data = [data];
                    isMultPoints = true;
                }

                callback(data, points[0], points[1], isMultPoints)

                intersectionArr.length = 0;
                intersectionCanvasPoints.length = 0;
            }
        },
        rightClickCoord: function(evt, clickOffset){
//      	this.$element = player.$rightPic.select('#right-canvas');
			var self = this;
            // 绘制杆状物标点的时候，不清空图形
//          if(!_.include([constant.TELEGRAPH_POLE, constant.ADD_BOARD, constant.ADD_BOARD_POLYGON], markDrawStatus.type)){
//              self.clearCanvas();
//          }
        	self.addShape(drawTool.createStar(clickOffset));
            self.intersectionAdd(clickOffset, 1);
        },
        /*
        rightMouseupCoord: function(evt, clickOffset){
//			this.$element = player.$rightPic.select('#right-canvas');
			
        	if(markDrawStatus.type != constant.ADD_BOARD){
        		return ;
        	}
        	var self = this;
        	var pointList = clickOffset;
            for(var poffset of pointList){
                self.intersectionAdd(poffset, 1, false);
            }
            dispatch.end();
            // 矩形数据发送请求
            intersectionDrawRectangePost(self);
        },
        */
	    /**
	     * 前方交会两侧视图中标点
	     * @param {Array} canvasOffset 在canvas上的offset
	     * @param {Number} index  0左侧，1右侧
	     * @param {Boolean} autoSendRequest
	     * 		是否在前后两帧的标点数量一致的情况下，自动发送相关请求
	     * 		绘制多边形时不确定两边各有多少点，所以是false
	     */
	    intersectionAdd: function (canvasOffset, index, autoSendRequest = true){
	    	var self = this;
	    	var pointData = self.getPointData(canvasOffset, index);
	        if($.inArray(index, [0, 1]) == -1){
	            return ;
	        }
	        // [ [L1, L2, L3], [R1, R2, R3]]
	        // else
	        // [ p1, p2 ]
	        // 该次前方交会是否需要多次点击
	        var isMorePoint = _.include([
	                constant.TELEGRAPH_POLE,
	                constant.ADD_BOARD
	            ], markDrawStatus.type)
	            && !_.include([constant.MARK_VECTOR_POINT], markDrawStatus.secType);
	
	        // 普通的前方交会
	        var isNomalIntersection = markDrawStatus.type == constant.INTERSECTION;
	        // 后台计算点、线、面接口用单独请求；
	        // type参数为""时，一般用于拖拽
	        var isDrawIntersection = _.include([
	                constant.TELEGRAPH_POLE,
	                constant.ADD_CONTROL_POINT,
	                constant.ADD_OBJECT_PT,
					constant.ADD_TRAFFICLIGHT
	            ], markDrawStatus.type) ||
	            _.include([constant.MARK_VECTOR_POINT], markDrawStatus.secType) ||
	            !markDrawStatus.type;
			
//			前方交会进行时执行--埋点操作
			var _tag = index ? 'intersection_click' : 'intersection_start',
                _modelName = modelNameList[markDrawStatus.type];
            _modelName = _modelName && _modelName[0] || '';
            iD.logger.editElement({
                'tag': _tag,
                'modelName': _modelName
            });
        	
	        if(!isMorePoint){
	            if(intersectionArr[0] && intersectionArr[1]){
	                var arr = [1, 0];
	                var target = arr[index];
	                intersectionArr[target] = undefined;
	                intersectionCanvasPoints[target] = undefined;
	                // 清空左侧内容
	                if(!target){
	                    drawTool.clearLeftZrenderMarker();
	                }
	            }
	
	            var point = _.clone(pointData);
	            intersectionCanvasPoints[index] = {
	                point: point.point,
	                canvasOffset: canvasOffset,
	                imgOffset: {
	                    x: Number(point.x),
	                    y: Number(point.y)
	                },
	                trackPointId: point.trackPointId
	            };
	            intersectionArr[index] = point;
	            var obj;
	            if(intersectionArr[0] && intersectionArr[1]){
                    dispatch.end();
            		if(!autoSendRequest) return ;
            		
	                postCount++;
	                var pointArr = _.cloneDeep(intersectionArr);
	                for(var i in pointArr){
	                    delete pointArr[i].point;
	                }
	
	                obj = {
	                    id: postCount.toString(),
	                    points: pointArr
	                }
	                // var dataMgr = iD.svg.Pic.dataMgr;
	                var _deviceId = player.wayInfo && player.wayInfo.deviceId || "";
                    var paramJson = {
                        deviceId: _deviceId,
                        pointList:[obj]
                    };
                    // dispatch.end();
                    
                    if(isNomalIntersection){
                        intersectionPost(self, paramJson);
                    }else if(isDrawIntersection){
                        // 点线面
                        intersectionDrawPost(self, paramJson);
                    }
	            }
	        }else {
	            // 先后两帧多个点的情况
	            var point = _.clone(pointData);
	            var cvsPoint = intersectionCanvasPoints[index];
	            if(!cvsPoint){
	                cvsPoint = intersectionCanvasPoints[index] = [];
	            }
	            cvsPoint.push({
	                point: point.point,
	                canvasOffset: canvasOffset,
	                imgOffset: {
	                    x: Number(point.x),
	                    y: Number(point.y)
	                },
	                trackPointId: point.trackPointId
	            });
	            var itsPoint = intersectionArr[index];
	            if(!itsPoint){
	                itsPoint = intersectionArr[index] = [];
	            }
	            itsPoint.push(point);
	
	            var typeNumber = 1;
	            // 杆状物
	            if(markDrawStatus.type == constant.TELEGRAPH_POLE){
	                typeNumber = 1;
	            }
	            if(markDrawStatus.type == constant.ADD_BOARD){
	                typeNumber = 4;
	            }
	
	            // 杆状物的话需要当前帧和下一帧都点击三次
	            if(intersectionArr[0] && 
	            	intersectionArr[0].length == typeNumber && 
	            	intersectionArr[1] && intersectionArr[1].length == typeNumber){
	            	
            		if(!autoSendRequest) {
            			dispatch.end();
            			return ;
            		}
	            	
	                var pointArr = _.cloneDeep(intersectionArr);
	                for(var i in pointArr){
	                    for(var j in pointArr[i]){
	                        delete pointArr[i][j].point;
	                    }
	                }
	                var list = [];
	                for(var i in pointArr[0]){
	                    var p0= pointArr[0][i];
	                    var p1= pointArr[1][i];
	                    if(!p0 || !p1){
	                        continue ;
	                    }
	                    postCount++;
	                    list.push({
	                        id: postCount.toString(),
	                        points: [p0, p1]
	                    });
	                }
	                // var dataMgr = iD.svg.Pic.dataMgr;
	                var _deviceId = player.wayInfo && player.wayInfo.deviceId || "";
	                
                    var paramJson = {
                        deviceId: _deviceId,
                        pointList: list
                    };
                    
        			dispatch.end();
                    intersectionDrawPost(self, paramJson);
	            }
	        }
	    },
		createCanvasEpiline: function (){
			var self = this;
	        var pt1 = intersectionArr[0];
	        var style = {
	            strokeColor: 'rgba(255, 0, 0, 0.4)',
	            lineWidth: 2
	        };
	        var firstPoints = [];
	        if(pt1.length && _.include([constant.TELEGRAPH_POLE], markDrawStatus.type)){
	            // 灯杆
	            var pt1arr = pt1;
	            for(var i in pt1arr){
	                var p = pt1arr[i];
	                firstPoints.push( [Number(p.x), Number(p.y)] );
	            }
	            style.strokeColor = 'rgba(0, 229, 255, 0.4)';
	        }else if(!_.isArray(pt1)) {
	            pt1 = [Number(pt1.x), Number(pt1.y)];
	            firstPoints = [ pt1 ];
	        }
	        for(var idx in firstPoints){
	            var point = firstPoints[idx];
	            // 原图坐标
	            var results = iD.picUtil.getComputeEpilines(point);
	            var pointList = results[0];
	            for(var i in pointList){
	                pointList[i] = drawTool.transformPoint(pointList[i]);
	            }
	            
	            var line = drawTool.createPolyline(pointList, {
	            	hoverable: false,
	            	style: style
	            });
	            self.addShape(line);
	        }
	    },
        getIntersectionData: function(){
        	return {
        		requestList: intersectionArr,
        		canvasList: intersectionCanvasPoints
        	}
        },
        clearData: function(){
        	intersectionArr.length = 0;
        	intersectionCanvasPoints.length = 0;
        	this.postCall = undefined;
        }
	});
	
	function updateIntersectionData(data){
        if(!data) return ;
        var result = iD.Task.getPosParam();
        if(iD.Task.d){
            data.projectId = iD.Task.d.tags.projectId || '';
        }else{
            data.projectId = -1; 
        }
        
        data.dynamicCal = result.dynamicCal;
        data.offsetCal = result.offsetCal;
    }
    
    function intersectionResult(data, callback){
        let K = iD.AutoMatch.getParamK(player);
        let interResult = [];
        for(let d of data.pointList){
            let did = d.id
            let pointList = d.points;
            let p1 = pointList[0];
            let p2 = pointList[1];
            let node1 = _.find(player.wayInfo.nodes, {id: p1.trackPointId});
            let node2 = _.find(player.wayInfo.nodes, {id: p2.trackPointId});
            let px1 = [Number(p1.x), Number(p1.y)];
            let px2 = [Number(p2.x), Number(p2.y)];
            let loc = iD.util.FrontIntersection(K, node1, node2, px1, px2);
            if(!loc || loc.length < 3){
                continue ;
            }
            interResult.push({
                id: did,
                geometry: {
                    lng: loc[0],
                    lat: loc[1],
                    elevation: loc[2]
                }
            });
        }
        // console.log('interResult ... ', interResult);
        if(!interResult.length){
            dispatch.request_failed();
            Dialog.alert('前方交会失败');
            return;
        }
        callback && callback(interResult);
        
        /* 
        // var url= 'http://192.168.5.34:9020/fi';
        var url= iD.config.URL.forward_intersection;
        d3.json(url)
            .post(JSON.stringify(data),function(error, _data) {
                if(error || !_data || _data.code != '0'){
                	dispatch.request_failed();
                    Dialog.alert('前方交会失败');
                    return;
                }
                var results = _data.resultList || _data.result || [];
                if(!results.length) {
                	dispatch.request_failed();
                    Dialog.alert('前方交会失败');
                    return;
                }
                callback && callback(results);
            });
         */
    }
	
    /**
     * 普通前方交会功能
     * @param {Object} data
     */
    function intersectionPost(self, data){
        updateIntersectionData(data);

        intersectionResult(data, function(results){
            var geometry = results[0].geometry;
            if(drawTool.locationOutTaskEditable([geometry.lng, geometry.lat, geometry.elevation])){
                return false;
            }
            dispatch.intersection_callback(geometry, intersectionArr, intersectionCanvasPoints);
        });
        
    }

    /**
     * 依赖前方交会进行回调函数的调用
     * @param {Object} data
     */
    function intersectionDrawPost(self, data){
        updateIntersectionData(data);

        intersectionResult(data, function(results){
            self.postCall && self.postCall(results, intersectionCanvasPoints);
        });
    }

    /**
     * 依赖前方交会进行回调函数的调用
     * 参数为矩形格式
     */
    function intersectionDrawRectangePost(self){
        var url = '', alertText = '';
        if(markDrawStatus.type == constant.TELEGRAPH_LAMP_HOLDER){
            url= iD.config.URL.measure + 'pole';
            alertText = '灯头';
        }else if(markDrawStatus.type == constant.ADD_BOARD){
            url= iD.config.URL.measure + 'trafficsign';
            alertText = '路牌';
        }

        var pointArr = _.cloneDeep(intersectionArr);
        var leftXs = [], leftYs = [], rightXs = [], rightYs = [];
        var countMax = 4;
        pointArr[0].forEach(function(n, idx){
            if(idx >= countMax){
                return;
            }
            leftXs.push(Number(n.x));
            leftYs.push(Number(n.y));
        });
        pointArr[1].forEach(function(n, idx){
            if(idx >= countMax){
                return;
            }
            rightXs.push(Number(n.x));
            rightYs.push(Number(n.y));
        });

        function getRectParam(xList, yList){
            var minX = _.min(xList), maxX = _.max(xList);
            var minY = _.min(yList), maxY = _.max(yList);

            return [minX, minY, maxX - minX, maxY - minY];
        }

        var data = {
            taskId: iD.Task.d.task_id,
            trackId: iD.svg.Pic.dataMgr.trackId,
            startTrackPoint: pointArr[0][0].trackPointId,
            startRegion: getRectParam(leftXs, leftYs).join(","),
            endTrackPoint: pointArr[1][0].trackPointId,
            endRegion: getRectParam(rightXs, rightYs).join(",")
        };

        d3.json(url)
            .post(JSON.stringify(data),function(error, _data) {
                if(error || !_data || _data.code != '0'){
                	dispatch.request_failed();
                    Dialog.alert(alertText + '测量失败');
                    return;
                }

                var result = _data.result;

                if(!result) {
                	dispatch.request_failed();
                    Dialog.alert(alertText + '测量失败');
                    return;
                }

                self.postCall && self.postCall(result, intersectionCanvasPoints);
            });
    }
	
	return d3.rebind(new Tool(), dispatch, 'on');
}
