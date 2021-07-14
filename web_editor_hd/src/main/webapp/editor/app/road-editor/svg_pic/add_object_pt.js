/*
 * @Author: tao.w
 * @Date: 2020-04-17 16:51:52
 * @LastEditors: tao.w
 * @LastEditTime: 2020-05-06 17:52:56
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};

iD.svg.PicDraw.addObjectPT = function(context, drawTool){
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
			return constant.ADD_OBJECT_PT;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('OBT')
                .attr('modelName',iD.data.DataType.OBJECT_PT)
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
		domClickMore: function(evt, clickOffset, data, point, point2, isMultPoints){
	        // 控制点
	        var result = drawTool.drawGeometryPoint(point);
	        drawGeometry2Map(result, data);
	        iD.picUtil.updateZrenderStyleByEntity(result, result._entityid);
	        drawTool._zrender.add(result);
	        context.buriedStatistics().merge(0,iD.data.DataType.OBJECT_PT);
            player.clearFooterButton();
            drawTool.event.add(result._entityid);
	        return false;
		}
	});
	
	function drawGeometry2Map(result, data){
        // data.tags = {
        //     TYPE: 2,
        //     SUBTYPE: 14
        // };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(result, data, {
        	player: player,
        	context: context,
        	actionText: '添加ObjectPT',
        	modelName: iD.data.DataType.OBJECT_PT,
        	measureType: 1
        });
        
        iD.logger.editElement({
            'tag': "add_object_pt",
            'modelName': iD.data.DataType.OBJECT_PT
        });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], false);
        	// 选中
            createIds.length && drawTool._lightMapEntities(createIds);
        	return true;
        }
        return false;
    }
	
	return new drawPlus();
}
