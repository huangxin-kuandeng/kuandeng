/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 14:32:15
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 问题记录标记
iD.svg.PicDraw.addQuestionTag = function(context, drawTool){
	const constant = drawTool.getConstant();
	var player = drawTool.getPlayer();
	var drawStatus = {};
	
	function drawPlus(){}
	_.assign(drawPlus.prototype, {
		init: function(arg1, arg2){
			drawStatus = arg1;
		},
		// 遍历操作时匹配类型
		check: function(){
			if(!drawStatus) return false;
			return drawStatus.type == this.getId();
		},
		getId: function(){
			return constant.ADD_QUESTION_TAG_POINT;
		},
		renderBtn: function(selection){
        	selection.append('button')
                .attr('type','button')
                .text('问题记录标记点')
                .attr('modelName',iD.data.DataType.QUESTION_TAG)
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
		/**
		 * 
		 * @param {Event} evt d3.event
		 * @param {Array} clickOffset 缩放1级的xy坐标
		 * @param {Object} opts 
		 */
		domClick: function(evt, clickOffset, opts){
			var self = this;
        	// 分析标记点
            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var pixel = drawTool.reductionPoint(clickOffset) || [];
            drawGeometry2Map2AutoMatch({geometry});
            context.buriedStatistics().merge(0,iD.data.DataType.QUESTION_TAG);
            player.clearFooterButton();
            return false;
		}
	});
	
	function drawGeometry2Map2AutoMatch(data, newTags){
        data.tags = {
	        CREATEBY: iD.User.getInfo().username,
	        TRACKID: player.dataMgr.trackId,
	        TRACKPOINTID: player.pic_point.tags.trackPointId
	    };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, data, {
        	player: player,
        	context: context,
        	actionText: '添加问题记录标记点',
        	modelName: iD.data.DataType.QUESTION_TAG
        });
        iD.logger.editElement({
            'tag': "add_question_tag",
            'modelName': iD.data.DataType.QUESTION_TAG
        });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], false);
        	// 局部的反投
        	drawTool.resetPointToPicPlayer(createIds);
        	// 高亮
        	createIds.length && drawTool._lightMapEntities(createIds);
        	drawTool.clearZRenderHover();
        	return true;
        }
        return false;
	}
	
	return new drawPlus();
}
