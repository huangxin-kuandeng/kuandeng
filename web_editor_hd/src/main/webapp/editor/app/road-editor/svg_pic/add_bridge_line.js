iD.svg.PicDraw = iD.svg.PicDraw || {};
// 桥底线
iD.svg.PicDraw.addBridgeDivider = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	var secType, markVectorLoc, markVectorPoints;
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		// 遍历操作时匹配类型
		check: function(btnType){
			if(btnType) return btnType == this.getId();
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.BRIDGE_BOTTOM_LINE;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('桥底线')
                .attr('modelName',iD.data.DataType.BRIDGE)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){
			secType = undefined;
			markVectorLoc = undefined;
			markVectorPoints = undefined;
		},
		/*
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domDblclickMore: function(){},
		*/
		buttonClick: function(evt, active, node){
			// 只保存最终的坐标，不标记到地图上，根据该坐标计算出法向量
			secType = active ? constant.MARK_VECTOR_POINT : undefined;
			drawStatus.secType = secType;
		},
        buttonCancel: function(evt, node){
            var shape = drawStatus.shape;
            if(!shape || !shape._entityid) return ;
            var entity = context.hasEntity(shape._entityid);
            if(!entity || entity.modelName != iD.data.DataType.BRIDGE) return ;
            iD.logger.editElement({
                'tag': "add_bridge_line_end",
                'entityId':entity.osmId() || '',
                'modelName': entity.modelName,
                'type': "dblClick"
            });
        },
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts = {}){
            if(secType) return ;
            
        	// iD.logger.editElement({
            //     'tag': "add_bridge_line",
            //     'modelName': iD.data.DataType.BRIDGE
            // });
            context.buriedStatistics().merge(1,iD.data.DataType.BRIDGE);
			var self = this;
            if(!markVectorLoc || !markVectorLoc.length){
                Dialog.alert('绘制桥底线之前需要获取第一个点的前方交会坐标');
                player.clearFooterButton();
                return false;
            }
            var presult = drawTool.zrenderDrawpolyline(clickOffset, false);
            iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
            self.clickAddDivider(presult, clickOffset);
            return false;
		},
		domClickMore: function(evt, clickOffset, data, point, point2, isMultPoints){
            if(!secType) return false;
            context.buriedStatistics().merge(1,iD.data.DataType.BRIDGE);
            
			var self = this;
        	var presult = drawTool.zrenderDrawpolyline(clickOffset, false);
            if(secType == constant.MARK_VECTOR_POINT && data.geometry){
                markVectorLoc = [data.geometry.lng, data.geometry.lat, data.geometry.elevation];
                // 判断坐标是否在范围内
                if(drawTool.locationOutTaskEditable(markVectorLoc)){
                    return false;
                }
                markVectorPoints = [point, point2];

                iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
                self.clickAddDivider(presult, clickOffset);

                drawStatus.secType = undefined;
                secType = undefined;
                return false;
            }
		},
		domDblclick: function(evt, clickOffset, opts = {}){
			if(secType) return false;
            var self = this;
            context.buriedStatistics().merge(0,iD.data.DataType.BRIDGE);
            if(!markVectorLoc || !markVectorLoc.length){
                Dialog('绘制桥底线之前需要标记特征点');
                player.clearFooterButton();
                return false;
            }
            var presult = drawTool.zrenderDrawpolyline(clickOffset, true);
            iD.picUtil.updateZrenderStyleByEntity(presult, presult._entityid);
            self.clickAddDivider(presult, clickOffset, true);
            // 很小几率会出现，当前位置绘制的桥底线，zrender中的pointList个数和地图上渲染的节点数量不一致
            // 重新反投
            if(presult._entityid){
                var _entity = context.hasEntity(presult._entityid);
                
        		iD.logger.editElement({
                    'tag': "add_bridge_line_end",
                    'entityId':_entity.osmId() || '',
                    'modelName': _entity.modelName,
                    'type': "dblClick"
                });
            }
            if(presult._entityid && presult._nodeList && _.compact(presult.shape.points).length != presult._nodeList.length){
                _entity && drawTool.resetPointToPicPlayer([_entity.id].concat(_entity.nodes));
            }
            player.clearFooterButton();
            self.reset();

            drawTool.event.add(presult._entityid);
        	return false;
		},
	    clickAddDivider: function (shape, clickOffset, isDbclick = false, opts = {}){
	    	var self = this;
            var fieldPlane, isFirstDraw = false;

            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var xy = drawTool.reductionPoint(clickOffset);
            geometry.xy = xy;//增加图片原始像素坐标位置，用于measureinfo
            if(shape._entityid){
                var entity = context.entity(shape._entityid);
                if(!entity.tags.PLANE){
                    fieldPlane = iD.picUtil.getEntityPlaneParam(markVectorLoc, self.selectPicIndex);
                }else {
                    fieldPlane = entity.tags.PLANE;
                }
            }else {
                isFirstDraw = true;
                fieldPlane = iD.picUtil.getEntityPlaneParam(markVectorLoc, self.selectPicIndex);
            }
            if(fieldPlane){
                var xy = drawTool.reductionPoint(clickOffset);
                var lonlats = iD.picUtil.pixelToLngLatByPlane(xy, fieldPlane);
                geometry.lng = lonlats[0];
                geometry.lat = lonlats[1];
                geometry.elevation = lonlats[2];
                geometry.xy = xy;
            }

            var marker = drawTool.drawGeometryNodes(shape, {canvasOffset:clickOffset}, {
                draggable: true
            });
            drawGeometry2Map(shape, _.extend({}, opts, {geometry}));
			iD.picUtil.updateZrenderStyleByEntity(marker, marker._entityid);

            if(isFirstDraw && shape._entityid && fieldPlane){
                var entity = context.entity(shape._entityid);
                if(fieldPlane != entity.tags.PLANE){
                    entity.tags.PLANE = fieldPlane;
                }
            }
            if(isFirstDraw){
                log_obj = {
                    'tag': 'add_bridge_line_start', 
                    'entityId':context.hasEntity(shape._entityid).osmId() || '',
                    'modelName': iD.data.DataType.BRIDGE
                }
                iD.logger.editElement(log_obj);
            } 
            var _n = context.hasEntity(marker._entityid);
            log_obj = {
                'tag': 'add_bridge_line', 
                'entityId':_n.osmId() || '',
                'parentId':context.hasEntity(shape._entityid).osmId() || '',
                'coordinate':_n.loc || [],
                'modelName': iD.data.DataType.BRIDGE_NODE
            }
            iD.logger.editElement(log_obj);
            
            var flag = iD.svg.PicDrawUtil.clickAddLineAfter(shape, drawStatus, isDbclick, {
            	isContinue: false,
            	player: player
            });
            return flag;
        }
	});
	
	function drawGeometry2Map(drawMark, geoData){
		
        var result = iD.svg.PicDrawUtil.drawLine2Map(drawMark, geoData, {
        	player: player,
        	context: context,
        	actionText: '绘制桥底线',
        	isCommonPoint: false,
        	nodeModelName: iD.data.DataType.BRIDGE_NODE,
        	lineModelName: iD.data.DataType.BRIDGE
        });
        if(!result) return false;
        var isReplaceUpdate = result.isReplaceUpdate;
        var actions = result.actions;
        var allActions = actions.length && [actions] || [];
        // 桥底线第一个点是前方交会
        if(actions.length && drawMark._entityid && drawMark._nodeList.length == 1){
        	var firstid = drawMark._nodeList[0]._entityid;
        	var tempActions = [];
        	tempActions.push(function(graph){
        		let node = graph.entity(firstid);
        		let measureinfo = iD.picUtil.measureinfoAction(node, {
	        	    type: 1,
	        	    datas: markVectorPoints || player.getIntersectionData().canvasList
	        	});
	        	return measureinfo(graph);
        	});
        	tempActions.push('绘制桥底线');
        	allActions.push(tempActions);
        }
        // 执行绘制
        if(allActions.length){
        	drawTool._drawActionsPerform(allActions, isReplaceUpdate);
        	return true;
        }
        return false;
    }
	
	return new drawPlus();
}
