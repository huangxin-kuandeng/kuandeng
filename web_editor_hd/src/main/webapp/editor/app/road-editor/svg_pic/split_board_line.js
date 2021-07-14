iD.svg.PicDraw = iD.svg.PicDraw || {};
// 切割路牌
iD.svg.PicDraw.splitBoardLine = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {}, zrenderNodeStatus;
	var selectPolygon, selectEntity;
    var clipShapeData;
    var NEW_BOARD_IDS = [];
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1, arg2){
			drawStatus = arg1;
			zrenderNodeStatus = arg2;
		},
		// 遍历操作时匹配类型
		check: function(){
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.SPLIT_BOARD_LINE;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('切割路牌')
                .attr('modelName',iD.data.DataType.TRAFFICSIGN)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			selectPolygon = null;
            selectEntity = null;
            NEW_BOARD_IDS = [];
		},
		/*
		domClickMore: function(){},
		domDblclickMore: function(){},
		*/
		buttonClick: function(evt, active, btn){
			if(active){
		    	var polygon = getSelectedPolygon();
		    	if(!polygon){
		    		Dialog.alert('请选择一个路牌');
		    		this.reset();
            		player.clearFooterButton();
		    		return ; 
		    	}
		    	selectPolygon = polygon;
		    	selectEntity = context.entity(polygon._entityid);
		    	if(!selectEntity.tags.PLANE){
		    		Dialog.alert('选中的路牌没有PLANE属性');
		    		this.reset();
            		player.clearFooterButton();
		    		return ;
		    	}
			}else {
				this.reset();
			}
		},
		domClick: function(evt, clickOffset, opts){
            return false;
		},
		domDblclick: function(evt, clickOffset){
			return false;
		},
		domMousedown: function(evt, clickOffset){
            drawTool.zrenderDrawRectange(clickOffset, false);
            context.buriedStatistics().merge(1,iD.data.DataType.TRAFFICSIGN);
            if(selectEntity){
                iD.logger.editElement({
                    'tag': "split_trafficsign_start",
                    'entityId':selectEntity.osmId() || '',
                    'modelName': iD.data.DataType.TRAFFICSIGN
                });
            }
            
			return false;
		},
		domMouseup: function(evt, clickOffset, opts){
            var shape = drawTool.zrenderDrawRectange(clickOffset, true);
            player._zrender.remove(shape);
            player.clearFooterButton();
            context.buriedStatistics().merge(0,iD.data.DataType.TRAFFICSIGN);
            // 鼠标没有移动；
        	if(iD.picUtil.isPointEqual(opts.downOffset, clickOffset, 5)){
        		return false;
        	}
            splitPolygon(shape);
            if(selectEntity){
                iD.logger.editElement({
                    'tag': "split_trafficsign_end",
                    'entityId':selectEntity.osmId() || '',
                    'modelName': iD.data.DataType.TRAFFICSIGN
                });
            }
            if(NEW_BOARD_IDS.length){
                NEW_BOARD_IDS.forEach(function(id){drawTool.event.add(id)});
            }
        	this.reset();
        	// 重新反投
          	player.resetCanvas();
			return false;
		}
	});
	
    /**
     * 切割路牌
     */
    function splitPolygon(shape) {
    	if(!selectPolygon){
    		Dialog.alert('视频中不存在该路牌');
    		return ;
    	}
    	// B
    	var pointList = getBoundData(shape.shape.points);
    	// A
    	var nodeList = _.clone(selectPolygon._nodeList).map(function(d){
    		return [d.shape.cx, d.shape.cy];
    	});
    	nodeList.push(nodeList[0]);
    	
    	// B包含A的情况
    	var pointLocList = pointList.bounds.map(function(loc){
    		return {loc: loc};
    	});
    	var nodeLocList = nodeList.map(function(loc){
    		return {loc: loc};
    	});
    	/*
    	let innerPoints = [];
    	for(let i = 0; i<nodeLocList.length - 1; i++){
    		let nodeLoc = nodeLocList[i];
    		let inner = iD.util.isPointInPolygon(nodeLoc, {
    			nodes: pointLocList
    		});
    		if(inner){
    			innerPoints.push({
    				i: i,
    				point: nodeLoc
    			});
    		}
    	}
    	if(innerPoints.length == pointLocList.length - 1){
    		// A全部点都在B中，无法切割
    		splitBoardPolygonMore(nodeList, pointList.bounds);
    		return ;
    	}
    	*/
    	// B任意点在A中，不切割
    	var pointInPolygon = false;
    	for(let i = 0; i<pointLocList.length - 1; i++){
    		let pointLoc = pointLocList[i];
    		let inner = iD.util.isPointInPolygon(pointLoc, {
    			nodes: nodeLocList
    		});
    		if(inner){
    			pointInPolygon = true;
    			break;
    		}
    	}
    	if(pointInPolygon){
    		return ;
    	}
    	/*
    	var A = getBoundData(nodeList);
    	var B = pointList;
    	if(innerPoints.length == 0){
    		// A与B相交的情况
    		if(A.minX < B.minX && A.maxX > B.maxX &&
    			A.minY > B.minY && A.maxY < B.maxY){
    			splitBoardPolygonMore(nodeList, pointList.bounds);
    			return ;
    		}
    		if(A.minX > B.minX && A.maxX < B.maxX &&
    			A.minY < B.minY && A.maxY > B.maxY){
    			splitBoardPolygonMore(nodeList, pointList.bounds);
    			return ;
    		}
    		return ;
    	}
    	*/
    	var A = getBoundData(nodeList);
    	var B = pointList;
    	setClipShapeData(A, B);
    	splitBoardPolygonMore(nodeList, pointList.bounds);
    	
    	// A部分点在B中
//  	splitBoardPolygonOne(nodeList, pointList.bounds);
    	// iD.util.lassExtend.SegmentIntersect
    }
    
    function getSelectedPolygon(){
    	var sids = context.selectedIDs();
    	if(sids.length != 1) return ;
    	var entity = context.entity(sids[0]);
    	if(entity.modelName != iD.data.DataType.TRAFFICSIGN){
    		return ;
    	}
    	return player.ZEUtil.getShapesByEid(entity.id)[0];
    }
    
    function getBoundData(pointList){
    	var pointList = _.clone(pointList);
    	// 统一为LT、RT、RB、LB、LT顺序
    	var xlist = [], ylist = [];
    	pointList.forEach(function(loc){
    		xlist.push(loc[0]);
    		ylist.push(loc[1]);
    	});
    	var minX = _.min(xlist), maxX = _.max(xlist);
    	var minY = _.min(ylist), maxY = _.max(ylist);
    	if(pointList[0].join(',') != pointList[pointList.length - 1].join(',')){
    		//debugger ;
    	}
        return {
        	bounds: [
	        	[minX, minY],
	        	[maxX, minY],
	        	[maxX, maxY],
	        	[minX, maxY],
	        	[minX, minY]
	        ],
	        points: pointList,
	        minX,
	        maxX,
	        minY,
	        maxY
        }
    }
    
    var randomColor = iD.util.randomColorList();
    
    function splitBoardPolygonMore(polyNodes, clipEdges){
    	var result = Sutherland_Hodgman(polyNodes, clipEdges);
    	/*
    	调试用
    	console.log(polyNodes, clipEdges);
    	console.log('Sutherland_Hodgman inner: ', result.clipPoints);
    	console.log('Sutherland_Hodgman outers: ', result.outerPoints);
    	var drawTool = player.getDrawTool();
        for(let newNodes of [result.clipPoints].concat(result.outerPoints)){
        	let polygon = drawTool.createPolygon(newNodes, {
        		_entityid: selectEntity.id,
        		style: {
        			fill: randomColor.get(),
        			stroke: randomColor.get(),
        			opacity: 0.6
        		}
        	});
        	drawTool._zrender.add(polygon);
        }
        */
        if(!result || !result.outerPoints.length || !result.clipPoints.length){
       		return ;
        }
        let entity = selectEntity;
        let PLANE = entity.tags.PLANE || '';
		
		var newNodeList = [];
		result.outerPoints.forEach(function(pxList){
			var newNodes = [];
			// createUpdatePolygon 绘制时不需要首尾一致，会自动将第一个点作为两份；
			if(pxList[0].join('') == _.last(pxList).join('')){
				pxList = pxList.slice(0, pxList.length - 1);
			}
			pxList.forEach(function(px){
                let xy =  player.reductionPoint(px);
				let loc = iD.picUtil.pixelToLngLatByPlane(xy, PLANE || '');
				newNodes.push({
					loc: loc,
					xy: xy
				});
			});
			
			let state = iD.util.getNodesClockWise(player.allNodes, newNodes);
			if(state === 1 ){
				// 根据轨迹计算-反转点坐标
				newNodes.reverse();
			}
			newNodes.length && newNodeList.push(newNodes);
		});
		
		drawMapMore(entity, newNodeList);
    }
    
    function drawMapMore(entity, newNodeDatas){
        
        var allActions = [
        	[iD.actions.DeleteMultiple([entity.id], context)]
        ];
        for(let newNodes of newNodeDatas){
        	let _rst = createUpdatePolygon(newNodes, {
        		wayTags: entity.tags
        	});
            allActions.push(..._rst.allActions);
            if(_rst.boardArea){
                NEW_BOARD_IDS.push(_rst.boardArea.id);
            }
        }
        if(allActions.length){
            context.event.before_delete({
                selectedIDs: [entity.id]
            });
        	drawTool._drawActionsPerform(allActions, false);
        }
        
        return false;
    }
    
    //**************************
    // Sutherland_Hodgman裁剪算法
    // 代码参考 https://my.oschina.net/MrHou/blog/268870
    // 图解 https://blog.csdn.net/xdg_blog/article/details/52865005
    // 已存在问题：切割多边形时，边为凹凸形状时，会切割错误
    
    function Sutherland_Hodgman(polyNodes, clipEdges){
    	var cursor = [];
    	// 更新后的点
    	var result = _.clone(polyNodes);
    	result.pop();
    	/*flag = false表示在内侧，flag = true表示在外侧*/
    	var flag;
    	var outerResults = [];
    	
    	var limitClipEdge = getClipEdgeLimit(clipEdges);
    	if(!limitClipEdge) return ;
    	
    	for (var i = 0; i<limitClipEdge.length - 1; i++) {
    		var lastPoint = result[result.length - 1];
    		var clipStart = limitClipEdge[i];
    		var clipEnd = limitClipEdge[i+1];
    		
    		var outerList = [];
    		
    		if (isInside(lastPoint, clipStart, clipEnd)) flag = false;
	        else flag = true;
	        
	        for (var j = 0; j<result.length; j++) {
	        	let nowPoint = result[j];
	            // 该点在内侧
	            if (isInside(nowPoint, clipStart, clipEnd)) {
	               // 上一个点在外侧，交点加入到结果集中
	                if (flag) {
	                    flag = false;
	                    let cross = getIntersectionPoint(lastPoint, nowPoint, clipStart, clipEnd);
	                    if(!cross) continue;
	                    cursor.push(cross);
	                    
//	                    if(!_.isEqual(_.last(outerList), lastPoint)){
//	                    	outerList.push(lastPoint);
//	                    }
	                    //outerList.push(lastPoint);
	                    outerList.push(cross);
	                }
	                cursor.push(nowPoint);
	            }
	            // 该点在外侧
	            else {
	                // 上一个点在内侧，交点加入结果集
	                if (!flag) {
	                    flag = true;
	                    let cross = getIntersectionPoint(lastPoint, nowPoint, clipStart, clipEnd);
	                    if(!cross) continue;
	                    cursor.push(cross);
	                    
	                    outerList.push(cross);
	                }
                	// 上一个点与当前点都在外侧
                    outerList.push(nowPoint);
					// 可能有lastPoint被添加，然后nowPoint又被添加的情况
//                  if(!_.isEqual(_.last(outerList), nowPoint)){
//                  	outerList.push(nowPoint);
//                  }
	            }
	            /*更新首次比较的节点*/
	            lastPoint = nowPoint;
	        }
	        if(outerList.length){
	        	outerResults.push(outerList);
	        	outerList = [];
	        }
	        result = cursor;
	        cursor = [];
    	}
    	
    	return {
    		clipPoints: result,
    		outerPoints: outerResults
    	}
    }
    
    function setClipShapeData(A, B){
    	// direction：true为垂直，false为横向
    	clipShapeData = {
    		B: B,
    		A: A,
    		direction: null
    	};
    	let vertical =  B.maxX - B.minX < B.maxY - B.minY;
    	let crossCount = getClipBorderCorssInfo(A, B);
    	// console.log('cross count ...', crossCount);
    	
    	//xy的两边都在A范围内
    	if((B.minX >= A.minX && B.maxX <= A.maxX) &&
    		(B.minY >= A.minY && B.maxY <= A.maxY)){
    		/*
			if(B.maxY - B.minY >= B.maxX - B.minX){
	    		clipShapeData.direction = true;
	    	}else {
	    		clipShapeData.direction = false;
	    	}
	    	*/
	    	clipShapeData.direction = clipDirByCross();
		}else if(B.minX < A.minX && B.maxX > A.maxX){
			// x两边都在A以外
			clipShapeData.direction = false;
		}else if(B.minY < A.minY && B.maxY > A.maxY){
			// y两边都在A以外
			clipShapeData.direction = true;
		}else if(Number(_inRange(B.minX, A.minX, A.maxX)) + Number(_inRange(B.maxX, A.minX, A.maxX)) == 1){
			// x一边在A范围内，一边范围外
//			clipShapeData.direction = true;
	    	clipShapeData.direction = clipDirByCross();
		}else if(Number(_inRange(B.minY, A.minY, A.maxY)) + Number(_inRange(B.maxY, A.minY, A.maxY)) == 1){
			// y一边在A范围内，一边范围外
//			clipShapeData.direction = false;
	    	clipShapeData.direction = clipDirByCross();
		}
		else {
			clipShapeData.direction = null;
		}
		
		/**
		 * 根据边的相交次数判断
		 */
		function clipDirByCross(){
			// 只有底边/顶边有交点，横向切割
			if(crossCount.total == crossCount.top || 
				crossCount.total == crossCount.bottom){
				return false;
			}
			// 只有左边/右边有交点，竖向切割
			if(crossCount.total == crossCount.left || 
				crossCount.total == crossCount.right){
				return true;
			}
			// 两边都有交点的情况
			let LR = Number(crossCount.left>0) + Number(crossCount.right>0);
			let BT = Number(crossCount.top>0) + Number(crossCount.bottom>0);
			if(LR == 2){
				return true;
			}
			if(BT == 2){
				return false;
			}
		}
    }
    
    /**
     * 判断A与B的各边相交次数；
     * @param {Object} A
     * @param {Object} B
     */
    function getClipBorderCorssInfo(A, B){
    	var bounds = {};
    	bounds.top = [[B.minX, B.minY], [B.maxX, B.minY]];
    	bounds.bottom = [[B.minX, B.maxY], [B.maxX, B.maxY]];
    	bounds.left = [[B.minX, B.minY], [B.minX, B.maxY]];
    	bounds.right = [[B.maxX, B.minY], [B.maxX, B.maxY]];
    	
    	var result = {}, total = 0;
    	for(let dir in bounds){
    		if(result[dir] == null){
    			result[dir] = 0;
    		}
    		
    		let b1 = bounds[dir][0];
    		let b2 = bounds[dir][1];
    		for(let i = 0; i<A.points.length - 1; i++){
	    		let a1 = A.points[i];
	    		let a2 = A.points[i+1];
    			let loc = iD.util.lassExtend.SegmentIntersect([a1[0], a1[1], a2[0], a2[1]], [b1[0], b1[1], b2[0], b2[1]]);
    			if(loc && !isNaN(loc[0]) && !isNaN(loc[1])){
    				result[dir] ++;
    				total ++;
    			}
    		}
    	}
    	
    	result.total = total;
    	return result;
    }
    
    function _inRange(a, b, c){
    	return a >= b && a <= c;
    }
    
    /**
     * 配置遍历裁剪方向：左右、上下
     * 默认：上右下左方向以外的点会被筛选出四个面
     * @param {Number} index
     */
    function getClipEdgeLimit(clipEdges){
    	var list = _.clone(clipEdges);
    	var direction = clipShapeData && clipShapeData.direction;
    	if(direction == null){
    		return null;
    	}
//  	console.log('clip direction ', direction);
//  	console.log('before diff ', _.cloneDeep(list));
    	// 小数点过多时可能导致坐标错乱
		list = list.map(function(p){
			return [parseInt(p[0]), parseInt(p[1])];
		});
		
    	var A = clipShapeData.A;
    	var diff = 10;
    	var minX = A.minX - diff, 
    		minY = A.minY - diff;
//  	var maxX = player.pics.node().offsetWidth, 
//  		maxY = player.pics.node().offsetHeight;
    	var maxX = A.maxX + diff, 
    		maxY = A.maxY + diff;
    	if(direction){
    		list[0][1] = _.min([minY, list[0][1]]);
    		list[1][1] = _.min([minY, list[1][1]]);
    		list[2][1] = _.max([maxY, list[2][1]]);
    		list[3][1] = _.max([maxY, list[3][1]]);
    	}else{
    		list[0][0] = _.min([minX, list[0][0]]);
    		list[1][0] = _.max([maxX, list[1][0]]);
    		list[2][0] = _.max([maxX, list[2][0]]);
    		list[3][0] = _.min([minX, list[3][0]]);
    	}
		list[4] = list[0];
		
//  	console.log('after diff ', list);
    	return list;
    }
    
    /**
     * 判断一个点是否在边的内侧
     * @param {Object} point
     * @param {Object} p1
     * @param {Object} p2
     */
	function isInside(point , p1, p2) {
	    return Multi(point, p1, p2)>=0 ? true : false;
	}
	/**
	 * 求叉积，
	 * 小于0：P0在P1P2左侧
	 * 大于0：P0在P1P2右侧
	 * 等于0：一条直线上的共同点
	 * @param {Object} p0 点
	 * @param {Object} p1 线段起点
	 * @param {Object} p2 线段终点
	 */
	function Multi(p0, p1, p2) {
	    return (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p2[0] - p0[0]) * (p1[1] - p0[1]);
	}
	
	/**
	 * 非延长线交点，必须相交才能够裁剪，
	 * 改为延长线交点，则会将图形形状限制到矩形框内
	 * @param {Object} a1
	 * @param {Object} a2
	 * @param {Object} b1
	 * @param {Object} b2
	 */
	function getIntersectionPoint(a1, a2, b1, b2){
		// 正常
		let loc = iD.util.lassExtend.SegmentIntersect([a1[0], a1[1], a2[0], a2[1]], [b1[0], b1[1], b2[0], b2[1]]);
		// 射线相交
//		let loc = iD.util.extendIntersection([a1[0], a1[1], a2[0], a2[1]], [b1[0], b1[1], b2[0], b2[1]]);
		if(loc && !isNaN(loc[0]) && !isNaN(loc[1])){
			return loc;
		}
	}
    //***************************
    
    /**
     * 切割后原图形只剩一个的情况（提取A在B中的点）
     * @param {Array} polyNodes 原始图形的节点
     * @param {Array} clipEdges 用于切割的矩形节点
     */
    function splitBoardPolygonOne(polyNodes, clipEdges){
    	let entity = selectEntity;
    	let nodeIndex = 0;
    	let splitNewNodes = [];
    	let boardNodes = [];
    	
    	// 使用B的第一条被重复相交的线段，作为切割的线
    	var S1;
    	var S2;
    	var crossLine = [];
    	
    	for(let i = 0; i<polyNodes.length - 1; i++){
			let a1 = polyNodes[i];
			let a2 = polyNodes[i+1];
    		
    		for(let j = 0; j<clipEdges.length - 1; j++){
	    		let b1 = clipEdges[j];
	    		let b2 = clipEdges[j+1];
    			// 非延长线
    			let loc = iD.util.lassExtend.SegmentIntersect([a1[0], a1[1], a2[0], a2[1]], [b1[0], b1[1], b2[0], b2[1]]);
    			if(loc && !isNaN(loc[0]) && !isNaN(loc[1])){
    				// 第一个相交线段
    				if(crossLine.length && (crossLine.indexOf(j) == -1 || crossLine.indexOf(j+1) == -1)){
    					continue;
    				}
    				
    				if(!crossLine.length){
    					S1 = {
    						index: i,
    						loc: loc
    					};
    				}else {
    					S2 = {
    						index: i,
    						loc: loc
    					};
    				}
    				
    				crossLine = [j, j+1];
    			}
    		}
    		// 交点全部找到
    		if(S1 && S2){
    			break;
    		}
    	}
    	
    	if(!S1 || !S2){
    		return ;
    	}
    	
    	var splitList = [ [S1, S2] ];
    	
    	for(let idx = 0; idx<splitList.length; idx++){
    		let splitPoints = splitList[idx];
    		let S1 = splitPoints[0];
    		let S2 = splitPoints[1];
    		
    		let xy1 =  player.reductionPoint(S1.loc);
    		let xy2 = player.reductionPoint(S2.loc);
    		let nodeLoc1 = iD.picUtil.pixelToLngLatByPlane(xy1, entity.tags.PLANE || '');
    		let nodeLoc2 = iD.picUtil.pixelToLngLatByPlane(xy2, entity.tags.PLANE || '');
    		
    		var newNodes = [];
    		
    		boardNodes.push(...entity.nodes.slice(nodeIndex, S1.index + 1));
    		boardNodes.push({
    			loc: nodeLoc1,
    			xy: xy1
    		});
    		nodeIndex = S1.index + 1;
    		
    		// 切割后路牌
    		newNodes.push({
    			loc: nodeLoc1,
    			xy: xy1
    		});
    		newNodes.push(...entity.nodes.slice(nodeIndex, S2.index + 1));
    		newNodes.push({
    			loc: nodeLoc2,
    			xy: xy2
    		});
    		splitNewNodes.push(newNodes);
    		
    		boardNodes.push({
    			loc: nodeLoc2,
    			xy: xy2
    		});
    		nodeIndex = S2.index+1;
    		
    		// 全部切割
    		if(idx == splitList.length - 1){
//  			boardNodes.push({
//	    			loc: nodeLoc2,
//	    			xy: xy2
//	    		});
    			boardNodes.push(...entity.nodes.slice(nodeIndex, entity.nodes.length));
    			if(boardNodes[0] == _.last(boardNodes)){
    				boardNodes.pop();
    			}
    		}
    	}
        // 坐标
        // measureinfo
        /*
        actions.push(iD.picUtil.measureinfoAction(node, {
            trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
            imgOffset: {'x':xy[0], 'y':xy[1]},
            wayid: shape._entityid
        }));
        */
       
       drawMapOne(entity, boardNodes, splitNewNodes);
    }
    
    /**
     * 
     * @param {Array} dataGeoList 不需要首尾一致
     * @param {Object} opts
     */
    function createUpdatePolygon(dataGeoList, opts = {}){
		var boardArea = opts.boardArea;
		var drawTool = player.getDrawTool();
		
	    var WAY_MODEL_NAME = iD.data.DataType.TRAFFICSIGN;
	    var NODE_MODEL_NAME = iD.data.DataType.TRAFFICSIGN_NODE;
	    var wayModelEntity = iD.Layers.getCurrentModelEnableLayer(WAY_MODEL_NAME);
	    var nodeModelEntity = iD.Layers.getCurrentModelEnableLayer(NODE_MODEL_NAME);
	    if(!wayModelEntity || !nodeModelEntity){
	        return ;
	    }
	    
	    var allActions = [];
	    // 新建面
	    if(!boardArea){
		    boardArea = iD.Way({
                layerId: wayModelEntity.id,
                identifier:wayModelEntity.identifier,
		        modelName: WAY_MODEL_NAME,
		        nodes: []
		    });
		    boardArea.setTags(_.extend({}, iD.util.getDefauteTags(boardArea, wayModelEntity), opts.wayTags));
		    allActions.push([iD.actions.AddEntity(boardArea)]);
	    }else {
	    	// 旧的面重新添加节点
	    	// boardArea.nodes = [];
	    	allActions.push([function(graph){
	    		return graph.replace(boardArea.update({nodes: []}));
	    	}]);
	    }
	    
	    for(var idx in dataGeoList){
	        var data = dataGeoList[idx];
	        var isNode = typeof data == 'string';
	        var actions = [];
	        
	        var node;
	        if(isNode){
	        	node = context.entity(data);
	        }else {
		        node = iD.Node({
		            modelName: NODE_MODEL_NAME,
                    layerId: nodeModelEntity.id,
                    identifier:nodeModelEntity.identifier,
		            loc: data.loc
		        });
		        node.setTags(iD.util.getDefauteTags(node, nodeModelEntity));
	        }
	        
	        // 添加节点
	        if(idx == 0){
	            actions.push(...[
	                iD.actions.AddEntity(node),
	                iD.actions.AddVertex(boardArea.id, node.id),
	                iD.actions.AddVertex(boardArea.id, node.id)
	            ]);
	        }else {
	            actions.push(...[
	                iD.actions.AddEntity(node),
	                iD.actions.AddVertex(boardArea.id, node.id, idx)
	            ]);
	        }
	        
	        // 新增点添加测量信息
	        if(!isNode){
				var xy = data.xy;
		        actions.push(iD.picUtil.measureinfoAction(node, {
		            trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
		            imgOffset: {'x': xy[0], 'y': xy[1]},
		            wayid: boardArea.id
		        }));
	        }
	        actions.push("切割路牌");
	        
	        allActions.push(actions);
	   }
	    // 多组actions执行时，不可能为replace
	    return {
	    	allActions: allActions,
	    	boardArea: boardArea
	    };
	}
    
    function drawMapOne(entity, oldNodeDatas, newNodeDatas){
        var result = createUpdatePolygon(oldNodeDatas, {
        	boardArea: entity
        });
        drawTool._drawActionsPerform(result.allActions, false);
        
        /*
        var allActions = [];
        for(let newNodes of newNodeDatas){
        	let _rst = createUpdatePolygon(newNodes, {
        		wayTags: entity.tags
        	});
        	allActions.push(..._rst.allActions);
        }
        */
        var actions = [];
        for(let newNodes of newNodeDatas){
        	newNodes.forEach(function(id){
        		if(typeof id != 'string'){
        			return ;
        		}
        		actions.push(iD.actions.DeleteNode(id, context));
        	});
        }
        if(actions.length){
        	actions.push('切割路牌');
        	drawTool._drawActionsPerform([actions], true);
        }
        
        return false;
    }

	return new drawPlus();
}
