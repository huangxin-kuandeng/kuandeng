iD.svg.PicDraw = iD.svg.PicDraw || {};
// 人行道（临时）
iD.svg.PicDraw.addSideWalk = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
    var trackPointChanged = false;
    var isStop = false;
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
			
			var self = this;
			player.on('picUpdate.add-object-pl', function(){
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
			return constant.ADD_SIDE_WALK;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('添加人行道')
                .attr('modelName',iD.data.DataType.OBJECT_PL)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			drawStatus.__lastDrawIndex = undefined;
            trackPointChanged = false;
            isStop = false;
		},
		/*
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domClickMore: function(){},
		domDblclickMore: function(){},
		*/
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
            if(!entity || entity.modelName != iD.data.DataType.OBJECT_PL) return ;
            iD.logger.editElement({
                'tag': "add_object_pl_end",
                'entityId':entity.osmId() || '',
                'modelName': entity.modelName,
                'type': "dblClick",
                'filter': iD.logger.getFilter(entity, context)
            });
        },
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts = {}){
			var self = this;
            var presult = drawStatus.shape;
            context.buriedStatistics().merge(1,iD.data.DataType.OBJECT_PL);
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
            context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PL);
			if(!presult) {
				self.reset();
				return false;
			}
            // 双击结束绘制时，需要提前检查最后坐标与上一个点距离是否小于20cm
            var shape = drawStatus.shape;
            var way = context.hasEntity(shape._entityid);
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
                    'tag': "add_object_pl_end",
                    'entityId':way.osmId() || '',
                    'modelName': way.modelName,
                    'type': "dblClick",
                    'filter': iD.logger.getFilter(way, context)
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
            var _way = context.hasEntity(shape._entityid),
            	modelName = "",
            	_type = "";
            if(shape && _way && _.last(shape.shape.points).join(',') != clickOffset.join(',')){
        		shape.shape.points.push(clickOffset);
          		drawTool._zrender.refresh();
            }
            if(_way && _way.modelName){
            	modelName = _way.modelName;
            }
            if(isDbclick){
            	_type = "dblClick";
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
            drawGeometry2Map(shape, {geometry}, opts,this);
			iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);

            let _n = context.hasEntity(marker._entityid);
            let _w = context.hasEntity(shape._entityid);
            var log_obj;
            if(isNew){
                log_obj = {
                    'tag': 'add_object_pl_start', 
                    'entityId':_w.osmId() || '',
                    'modelName': _w.modelName,
                    'filter': iD.logger.getFilter(_w, context)
                }
                iD.logger.editElement(log_obj);
            } 
            log_obj = {
                'tag': 'add_object_pl', 
                'entityId':_n.osmId() || '',
                'parentId':_w.osmId() || '',
                'coordinate':_n.loc || [],
                'modelName': _n.modelName,
                'filter': iD.logger.getFilter(_w, context)
            }

            iD.logger.editElement(log_obj);

            var flag = iD.svg.PicDrawUtil.clickAddLineAfter(shape, drawStatus, isDbclick, {
            	isContinue: true,
            	player: player,
                // 第一个点绘制后，到下一帧再回来，继续绘制第二个点，没有渲染线段的问题；
                redraw: trackPointChanged && shape._nodeList.length == 2
            });
            trackPointChanged = false;
            if(isDbclick || isStop){
                // add change
                drawTool.event.add(shape._entityid);
            }
            return flag;
        }
	});
	    /**
     * 停止鼠标绘制功能
     * @param {*} self 
     */
    function stopDraw(self){
        drawTool.clearZRenderNodeStatus();
        drawStatus.shape = null;
        drawTool.resetCanvas();
        context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PL);
        self.reset();
        isStop = true;
    }

	function drawGeometry2Map(drawMark, geoData, opts,self){
        var result = iD.svg.PicDrawUtil.drawLine2Map(drawMark, geoData, {
        	player: player,
        	context: context,
        	actionText: '绘制人行道',
        	downNodeid: opts.downNodeid,
        	isCommonPoint: true,
        	nodeModelName: iD.data.DataType.OBJECT_PL_NODE,
            lineModelName: iD.data.DataType.OBJECT_PL,
            wayTags: {
                TYPE: '1',
                SUBTYPE: '4'
            }
        });
        if(!result) return false;
        var isReplaceUpdate = result.isReplaceUpdate;
        var actions = result.actions;
        
        // 执行绘制
        if(actions.length){
            if(!context.transactionEditor()){

                if(iD.util.pointNotInPlyGonx([geoData.geometry.lng,geoData.geometry.lat],context)){
                    var way = context.hasEntity(drawMark._entityid);
                    if(!way) {
                        stopDraw(self);
                        // context.pop();
                        Dialog.alert("新增节点不属于该任务范围");
                        player.resetCanvas();
                        return ;
                    }else {
                        var node = context.hasEntity(way.first());
                        if(!iD.util.justNodeInPlyGonx(node,context)){
                            stopDraw(self);
                            Dialog.alert("新增节点不属于该任务范围");
                            context.pop();
                            return ;
                        }
                    }
                    // var loc = getLoc([geoData.geometry.lng,geoData.geometry.lat]);
                    // inner = false;
                    // var xy  = iD.util.trackPointToPicPixe(player.wayInfo.K, player.pic_point, loc);
                    // actions.splice(actions.length-1, 0, iD.actions.MoveNode(result.node.id, loc));
                    // actions.splice(actions.length-1, 0, iD.picUtil.measureinfoAction(result.node, {
		            //     trackPointId: player.allNodes[player.selectPicIndex].tags.trackPointId,
		            //     imgOffset: {'x':xy[0], 'y':xy[1]}
		            // }));
                }
            }
        	drawTool._drawActionsPerform([actions], isReplaceUpdate);
        	return true;
        }
        return false;
    }
	
	return new drawPlus();
}
