/*
 * @Author: tao.w
 * @Date: 2019-08-29 22:43:12
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 18:04:05
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 车道线
iD.svg.PicDraw.addDivider = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
    var trackPointChanged = false;
    var self;
    var isStop = false;
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
			
			self = this;
			player.on('picUpdate.add-divider', function(){
				if(!self.check()) return ;
				trackPointChanged = true;
			});
		},
		// 遍历操作时匹配类型
		check: function(){
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.ADD_DIVIDER;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .attr('modelName',iD.data.DataType.DIVIDER)
                .text('添加车道线')
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			drawStatus.__lastDrawIndex = undefined;
            trackPointChanged = false;
            isStop = false;
		},
		buttonClick: function(evt, active, node){
			if(active){
				drawTool.clearZRenderNodeStatus();
                this.reset();
			}
        },
        buttonCancel: function(evt, node){
            var shape = drawStatus.shape;
            if(!shape || !shape._entityid) return ;
            var entity = context.hasEntity(shape._entityid);
            if(!entity || entity.modelName != iD.data.DataType.DIVIDER) return ;
            iD.logger.editElement({
                'tag': "add_divider_end",
                'entityId':entity.osmId() || '',
                'modelName': entity.modelName,
                'type': "dblClick"
            });
        },
		/*
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domClickMore: function(){},
		domDblclickMore: function(){},
		*/
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts = {}){
			var self = this;
            var presult = drawStatus.shape;
            context.buriedStatistics().merge(1,iD.data.DataType.DIVIDER);
            // 点击在首尾节点上
            var downInfo = drawTool.drawClickBreakNode(drawStatus.type, presult && [presult._entityid]);
            if(downInfo){
            	var downShape = downInfo.shape;
            	if(downShape){
            		var shapeXY = iD.picUtil.shapeXY(downShape);
            		clickOffset = shapeXY && shapeXY || clickOffset;
            	}
            	// 第一个点
            	var isEnd = false;
            	if(!presult){
            		isEnd = false;
            	}else if(!presult._entityid || !presult._nodeList || !presult._nodeList.length){
            		isEnd = false;
            	}else {
            		isEnd = true;
            	}
            	presult = drawTool.zrenderDrawpolyline(clickOffset, isEnd);
            	iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
            	self.clickAddDivider(presult, clickOffset, isEnd, {
            		downNodeid: downInfo.entityid
                });

            }else {
            	presult = drawTool.zrenderDrawpolyline(clickOffset, false);
            	iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
            	self.clickAddDivider(presult, clickOffset, false);
            }
            drawTool.clearZRenderNodeStatus();
            return false;
		},
		domDblclick: function(evt, clickOffset, opts = {}){
			var self = this;
            var presult = drawStatus.shape;
            context.buriedStatistics().merge(0,iD.data.DataType.DIVIDER);
			if(!presult) {
				self.reset();
				return false;
            }
            var shape = drawStatus.shape;
            var way = context.hasEntity(shape._entityid);
            // 双击结束绘制时，需要提前检查最后坐标与上一个点距离是否小于20cm
            if(presult._entityid){
                var geometry = iD.picUtil.pixelToLngLat(clickOffset);
                if(way && drawTool.checkLineNodeDistanceLTE(context.entity(_.last(way.nodes)).loc, [geometry.lng, geometry.lat])){
                    return ;
                }
            }
        	var downInfo = drawTool.drawClickBreakNode(drawStatus.type, presult && [presult._entityid]);
        	var downShape = downInfo && downInfo.shape;
        	if(downShape){
        		var shapeXY = iD.picUtil.shapeXY(downShape);
        		clickOffset = shapeXY && shapeXY || clickOffset;
        	}
            presult = drawTool.zrenderDrawpolyline(clickOffset, true);
            iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
        	self.clickAddDivider(presult, clickOffset, true, downInfo && {
        		downNodeid: downInfo.entityid
            });
            
            if(way){
                iD.logger.editElement({
                    'tag': "add_divider_end",
                    'entityId':way.osmId() || '',
                    'modelName': way.modelName,
                    'type': "dblClick"
                });
            }
        	drawTool.clearZRenderNodeStatus();
        	drawStatus.shape = null;
			self.reset();
        	return false;
		},
	    clickAddDivider: function (shape, clickOffset, isDbclick = false, opts = {}){
            isStop = false;

            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var xy = drawTool.reductionPoint(clickOffset);
            geometry.xy = xy;//增加图片原始像素坐标位置，用于measureinfo
            // 绘制线类型时，线节点之间的距离不能小于20cm
            var isNew = shape._entityid ? false : true;
            if(shape._entityid && context.hasEntity(shape._entityid)){
                var way = context.entity(shape._entityid);
                var lastid = _.last(way.nodes);
                var node = context.entity(lastid);
                if(drawTool.checkLineNodeDistanceLTE(node.loc, [geometry.lng, geometry.lat])){
                    shape.shape.points.length > (shape._nodeList || []).length && shape.shape.points.pop();
                    return ;
                }
            }
            // 绘制时，可能会出现polyline的节点少于way节点的情况（偶现）
            // marker正常绘制，drawTool.zrenderDrawpolyline没有正常执行添加clickOffset的操作；
            var _way = context.hasEntity(shape._entityid);
            if(shape && _way && _.last(shape.shape.points).join(',') != clickOffset.join(',')){
        		shape.shape.points.push(clickOffset);
          		drawTool._zrender.refresh();
            }
            // 个别情况时，polyline没有创建或没有节点；
            if(!shape || !shape.shape.points.length){
            	if(shape){
            		drawTool._zrender.remove(shape);
            		drawTool.shape = null;
            	}
        		let _shape = drawTool.zrenderDrawpolyline(clickOffset, isDbclick);
        		drawStatus.shape = shape = _shape;
            }

            var marker = drawTool.drawGeometryNodes(shape, {canvasOffset:clickOffset}, {
                draggable: true
            });
            var added = drawGeometry2Map(shape, {geometry}, opts,isDbclick,this);
			iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);
            
            if(added){
                let _n = context.hasEntity(marker._entityid);
                var log_obj;
                if(isNew){
                    log_obj = {
                        'tag': 'add_divider_start', 
                        'entityId':context.hasEntity(shape._entityid).osmId() || '',
                        'modelName': iD.data.DataType.DIVIDER
                    }
                    iD.logger.editElement(log_obj);
                } 
                log_obj = {
                    'tag': 'add_divider', 
                    'entityId':_n.osmId() || '',
                    'parentId':context.hasEntity(shape._entityid).osmId() || '',
                    'coordinate':_n.loc || [],
                    'modelName': iD.data.DataType.DIVIDER_NODE
                }
 
                iD.logger.editElement(log_obj);
            }
            var flag = iD.svg.PicDrawUtil.clickAddLineAfter(shape, drawStatus, isDbclick, {
            	isContinue: true,
            	player: player,
            	// 第一个点绘制后，到下一帧再回来，继续绘制第二个点，没有渲染线段的问题；
            	redraw: trackPointChanged && shape._nodeList.length == 2
            });
            // var legitimate = true;
            // if(!isDbclick && !context.transactionEditor()){
            //     legitimate = dividerCheck(way);
            // }
            // if(legitimate){
            //     stopDraw(this);
            //     context.pop();
            //     Dialog.alert("新增节点不属于该任务范围");
            // }

            trackPointChanged = false;
            
            if(isDbclick || isStop){
                // add change
                drawTool.event.add(shape._entityid);
            }
            return flag;
        },
        nodeDragEnd: function(shape, dragResult, data, point){
            // 拖拽失败/没有更新坐标
            if(!dragResult){
                return ;
            }
            var node = context.hasEntity(shape._entityid);
            if(!node || node.modelName != iD.data.DataType.DIVIDER_NODE) return ;
            var way = shape._shape && context.hasEntity(shape._shape._entityid);
            if(!way) return false;
            var isFirstNode = way.nodes[0] == node.id;
			var index = way.nodes.indexOf(node.id);
            
            var geometry = data.geometry;
            var geoLoc = geometry && [geometry.lng, geometry.lat, geometry.elevation];
            if(!geoLoc){
                return false;
            }
            // 首尾节点拖拽超出范围后，实线节点裁剪
            if(context.transactionEditor() 
                || !iD.util.pointNotInPlyGonx(geoLoc, context)){
                return false;
            }
            var prevNode;
            if(isFirstNode){
                prevNode = context.entity(way.nodes[1]);
            }else {
                prevNode = context.entity(way.nodes[index - 1]);
            }
            var loc = getLoc([
                prevNode.loc,
                geoLoc
            ]);
            var actions = updateBreakNodeActions(node, loc);
            actions.push('拖拽节点');
            drawTool._drawActionsPerform([actions], true);
            // 刷新
            player.resetPointToPicPlayer([way.id].concat(way.nodes));
            var trackPoint = player.pic_point;
            var K = player.wayInfo.K;
            iD.util.checkErrors(context.graph(), K, trackPoint, context.entity(node.id));
            return false;
        }
    });
    /**
     * 停止鼠标绘制功能
     */
    function stopDraw(){
        drawTool.clearZRenderNodeStatus();
        drawStatus.shape = null;
        drawTool.resetCanvas();
        self && self.reset();
        context.buriedStatistics().merge(0,iD.data.DataType.DIVIDER);
        isStop = true;
    }

    function updateBreakNodeActions(node, loc){
        var trackPoint = player.pic_point;
        var K = player.wayInfo.K;
        var xy  = iD.util.trackPointToPicPixe(K, trackPoint, loc);
        var actions = [];
        actions.push(iD.actions.MoveNode(node.id, loc));
        // 绘制超出范围后中断，需要将最后一点设置为边界点
        actions.push(iD.actions.ChangeTags(node.id, {
            ISSPLIT: '1'
        }));
        actions.push(iD.picUtil.measureinfoAction(node, {
            trackPointId: trackPoint.tags.trackPointId,
            imgOffset: {'x':xy[0], 'y':xy[1]}
        }));

        return actions;
    }

    /**
     * 新增加车道线，判断新增车道线节点是否可绘制
     * @param {*} way 
     */
	function getLoc(locs){
        var flag = false;
        if (!context.editArea()) {
            return flag;
        }
        var holes = context.editArea().coordinates;
        for (var j = 0; j < holes.length; j++) {
            var holes_nodes = [];
            for (var k = 0; k < holes[j].length - 1; k++) {
                if(flag && !isNaN(flag[0])){
                    break;
                }
                holes_nodes = [
                    holes[j][k],
                    holes[j][k + 1]
                ];
                // console.log(holes_nodes, locs);
                // flag = iD.util.getSegmentIntersectLoc(holes_nodes, locs)[0];
                // console.log('1交点：', flag);
                // flag = iD.util.getSegmentIntersectLoc2(holes_nodes, locs)[0];
                let zone_ = null;
                let utmLocs1 = holes_nodes.map(function(v){
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    zone_ = utm.zoneNumber;
                    return [utm.x, utm.y]
                });
                let utmLocs2 = locs.map(function(v){
                    let utm = iD.util.LLtoUTM_(v[0], v[1]);
                    return [utm.x, utm.y]
                });
                let newLoc = iD.geo.lineIntersection(utmLocs1, utmLocs2);
                flag = newLoc && iD.util.UTMtoLL_(newLoc[0], newLoc[1], zone_);
            }
        }
        if(!flag || !flag.length) return locs[0];
        let piex = iD.util.trackPointToPicPixe(player.wayInfo.K, player.pic_point, flag);
        let ll = iD.picUtil.pixelToLngLat(piex);
        return [flag[0], flag[1],ll.elevation];
        // var z = iD.util.getHeight(flag);
        // return [flag[0], flag[1], z];
    }
	function drawGeometry2Map(drawMark, geoData, opts,isDbclick,self){
        var result = iD.svg.PicDrawUtil.drawLine2Map(drawMark, geoData, {
        	player: player,
        	context: context,
        	actionText: '绘制车道线',
        	downNodeid: opts.downNodeid,
        	isCommonPoint: true,
        	nodeModelName: iD.data.DataType.DIVIDER_NODE,
        	lineModelName: iD.data.DataType.DIVIDER
        });
        if(!result) return false;
        var isReplaceUpdate = result.isReplaceUpdate;
        var actions = result.actions;
        var inner = true;
        
        // 执行绘制
        if(actions && actions.length){
            if(!context.transactionEditor()){
                if(iD.util.pointNotInPlyGonx([geoData.geometry.lng,geoData.geometry.lat],context)){
                    var way = context.hasEntity(drawMark._entityid);
                    if(!way) {
                        stopDraw(self);
                        // context.pop();
                        Dialog.alert("新增节点不属于该任务范围");
                        player.resetCanvas();
                        return ;
                    }
                    var prevNode = context.entity(_.last(way.nodes));
                    var loc = getLoc([
                        prevNode.loc,
                        [geoData.geometry.lng, geoData.geometry.lat, geoData.geometry.elevation]
                    ]);
                    inner = false;
                    actions.splice(actions.length-1, 0, ...updateBreakNodeActions(result.node, loc));
                    /* 
                    var xy  = iD.util.trackPointToPicPixe(player.wayInfo.K, player.pic_point, loc);
                    actions.splice(actions.length-1, 0, iD.actions.MoveNode(result.node.id, loc));
		            // 绘制超出范围后中断，需要将最后一点设置为边界点
//		            if(iD.util.pointNotInPlyGonx(loc, context)){
	            	actions.splice(actions.length-1, 0, iD.actions.ChangeTags(result.node.id, {
	                	ISSPLIT: '1'
	                }));
//		            }
                    actions.splice(actions.length-1, 0, iD.picUtil.measureinfoAction(result.node, {
		                trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
		                imgOffset: {'x':xy[0], 'y':xy[1]}
                    }));
                     */
                }
            }
            drawTool._drawActionsPerform([actions], isReplaceUpdate);
            if(result.node && result.node.modelName == iD.data.DataType.DIVIDER_NODE){
                iD.util.checkErrors(context.graph(),player.wayInfo.K,player.pic_point, context.entity(result.node.id));
            }
            if(!inner){
                stopDraw();
                // context.pop();
            }
        	return true;
        }
        return false;
    }
	
	return new drawPlus();
}
