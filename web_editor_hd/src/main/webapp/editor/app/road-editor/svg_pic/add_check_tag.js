/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2021-07-01 11:55:21
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 质检标记
iD.svg.PicDraw.addCheckTag = function(context, drawTool){
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
			return constant.ADD_CHECK_TAG_POINT;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('质检标记点')
                .attr('modelName',iD.data.DataType.CHECK_TAG)
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
            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            drawGeometry2Map2AutoMatch({geometry});
            context.buriedStatistics().merge(0,iD.data.DataType.CHECK_TAG);
            player.clearFooterButton();
            return false;
		}
	});
	
	function drawGeometry2Map2AutoMatch(dataOpts){
        dataOpts.tags = {
            CREATE_BY: iD.User.getInfo().username,
            TRACK_ID: player.dataMgr.trackId,
            TRACK_POINT_ID: player.pic_point.tags.trackPointId,
            PROJECT_ID: iD.Task.d.tags.projectId || '',
			CHECK_STEP: iD.Task.d.protoData.taskDefinitionKey,
			CHECK_PROCESS: iD.Task.d.tags.processDefinitionKey
        };
        if(iD.User.isCheckRole()){
            dataOpts.tags.TAG_SOURCE = '1';
        }else if(iD.User.isVerifyRole()){
            dataOpts.tags.TAG_SOURCE = '2';
        }else if(iD.User.isQualityAssessorRole()){
            dataOpts.tags.TAG_SOURCE = '3';
        }
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, dataOpts, {
        	player: player,
        	context: context,
        	actionText: '添加质检标记点',
        	modelName: iD.data.DataType.QUALITY_TAG
        });
        
        iD.logger.editElement({
            'tag': "add_check_tag",
            'modelName': iD.data.DataType.QUALITY_TAG
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
            createIds.length && iD.ui.openCheckTagDialog(context, createIds[0]);
            createIds.length && drawTool._lightMapEntities(createIds);
        	return true;
        }
        return false;
	}
	
	return new drawPlus();
}
