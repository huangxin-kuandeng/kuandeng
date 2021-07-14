iD.svg.PicDraw = iD.svg.PicDraw || {};
// 灯杆
iD.svg.PicDraw.addLamppost = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1){
			drawStatus = arg1;
		},
		// 遍历操作时匹配类型
		check: function(){
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.TELEGRAPH_POLE;
		},
		renderBtn: function(selection){
            // selection.append('button')
            //     .attr('type','button')
            //     .text('灯杆')
            //     .attr('modelName',iD.data.DataType.LAMPPOST)
            //     .data([this.getId()]);
		},
		// 绘制结束后重置变量
		reset: function(){},
		/*
		domClick: function(){},
		domMousedown: function(){},
		domMouseup: function(){},
		zrenderMove: function(){},
		domDblclickMore: function(){},
		*/
		domClickMore: function(evt, clickOffset, data, point, point2, isMultPoints){
	        // 杆状物
	        point = point[0];
	        data = data[0];
	        // 控制点
	        var result = drawTool.drawGeometryPoint(point);
	        drawGeometry2Map(result, data);
	        iD.picUtil.updateZrenderStyleByEntity(result, result._entityid);
	        drawTool._zrender.add(result);
	        context.buriedStatistics().merge(0,iD.data.DataType.LAMPPOST);
            player.clearFooterButton();
            
            if(!context.transactionEditor()){
                var node = context.entity(result._entityid);
                if(!iD.util.justNodeInPlyGonx(node,context)){
                    Dialog.alert('新增杆顶点不属于该任务范围内');
                    context.pop();
                    // player.resetCanvas();
                    return ;
                }
            }
            drawTool.event.add(result._entityid);
	        return false;
		}
	});
	
	function drawGeometry2Map(result, data){
        data.tags = { TYPE: 1 };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(result, data, {
        	player: player,
        	context: context,
        	actionText: '添加灯杆',
        	modelName: iD.data.DataType.LAMPPOST,
        	measureType: 1
        });
        // iD.logger.editElement({
        //     'tag': "add_lamppost",
        //     'entityId': context.entity(entityid).osmId() || '',
        //     'modelName': iD.data.DataType.LAMPPOST
        // });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], false);
            // 选中
            let _n = context.hasEntity(createIds[0]);
            iD.logger.editElement({
                'tag': "add_lamppost",
                'entityId':_n.osmId() || '',
                'coordinate':_n.loc || [],
                'modelName': iD.data.DataType.LAMPPOST,
                'filter': iD.logger.getFilter(_n, context)
            });
            createIds.length && drawTool._lightMapEntities(createIds);
        	return true;
        }
		return false;
    }
	
	return new drawPlus();
}
