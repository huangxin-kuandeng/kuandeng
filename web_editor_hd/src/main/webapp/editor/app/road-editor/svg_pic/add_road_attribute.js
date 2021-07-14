iD.svg.PicDraw = iD.svg.PicDraw || {};
// 道路属性变化点
iD.svg.PicDraw.addRoadAttribute = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {}, zrenderNodeStatus;
	
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
			return constant.ADD_ROAD_ATTRIBUTE;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('道路属性变化点')
                .attr('modelName',iD.data.DataType.ROAD_ATTRIBUTE)
                .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){},
		/*
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domDblclickMore: function(){},
		*/
		buttonClick: function(evt, active, node){
			if(active){
				drawTool.clearZRenderNodeStatus();
				this.reset();
			}
		},
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts){
			var self = this;
        	// 道路属性变化点
            var downEntity, downShape;
            if(zrenderNodeStatus.downEntityid){
                downEntity = context.hasEntity(zrenderNodeStatus.downEntityid);
                downShape = zrenderNodeStatus.downShape;
            }
            var geometry = {};
            if(downEntity && downEntity.modelName == iD.data.DataType.DIVIDER_NODE){
            	var downxy = iD.picUtil.shapeXY(downShape);
                clickOffset = [downxy[0], downxy[1]];
                geometry.lng = downEntity.loc[0];
                geometry.lat = downEntity.loc[1];
                geometry.elevation = downEntity.loc[2];
            }
            if(_.isEmpty(geometry)){
                geometry = iD.picUtil.pixelToLngLat(clickOffset);
            }
            geometry.xy = drawTool.reductionPoint(clickOffset);
            
            var result = drawTool.drawGeometryPoint({
                canvasOffset: clickOffset
            });
            drawGeometry2Map(result, {geometry, clickOffset});
            iD.picUtil.updateZrenderStyleByEntity(result, result._entityid);
            drawTool._zrender.add(result);
            
            drawTool.clearZRenderNodeStatus();
            player.clearFooterButton();
            context.buriedStatistics().merge(0,iD.data.DataType.ROAD_ATTRIBUTE);
            drawTool.event.add(result._entityid);
            return false;
		}
	});
	
	function drawGeometry2Map(result, data){
        var result = iD.svg.PicDrawUtil.drawPoint2Map(result, data, {
        	player: player,
        	context: context,
        	actionText: '添加道路属性变化点',
        	modelName: iD.data.DataType.ROAD_ATTRIBUTE,
        	measureType: 0
        });
        iD.logger.editElement({
            'tag': "add_road_attribute",
            'modelName': iD.data.DataType.ROAD_ATTRIBUTE
        });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], false);
        	return true;
        }
		return false;
    }
	
	return new drawPlus();
}
