/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 14:24:20
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 控制点
iD.svg.PicDraw.addControlPoint = function(context, drawTool){
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
			return constant.ADD_CONTROL_POINT;
		},
		renderBtn: function(selection){
            var uselessClass = 'footer_useless_btn';
            selection.append('button')
            	.attr('class', uselessClass)
                .attr('type','button')
                .attr('modelName',iD.data.DataType.OBJECT_PT)
                .text('控制点')
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
	        return false;
		}
	});
	
	function drawGeometry2Map(result, data){
        data.tags = {
            TYPE: 2,
            SUBTYPE: 14
        };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(result, data, {
        	player: player,
        	context: context,
        	actionText: '添加控制点',
        	modelName: iD.data.DataType.OBJECT_PT,
        	measureType: 1
        });
        
        iD.logger.editElement({
            'tag': "add_control_point",
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
