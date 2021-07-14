iD.svg.PicDraw = iD.svg.PicDraw || {};
// 分析标记
iD.svg.PicDraw.addAnalysisTag = function(context, drawTool){
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
			return constant.ADD_ANALYSIS_TAG_POINT;
		},
		renderBtn: function(selection){
            var uselessClass = 'footer_useless_btn';
        	selection.append('button')
            	.attr('class', uselessClass)
                .attr('type','button')
                .attr('modelName',iD.data.DataType.ANALYSIS_TAG)
                .text('分析标记点')
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
            context.buriedStatistics().merge(0,iD.data.DataType.ANALYSIS_TAG);
			var self = this;
        	// 分析标记点
            var geometry = iD.picUtil.pixelToLngLat(clickOffset);
            var batch = getPicBatch();
            var pixel = drawTool.reductionPoint(clickOffset) || [];
            drawGeometry2Map2AutoMatch({geometry}, {
                BATCH: batch,
                PIXEL: pixel.join(',')
            });
            
            player.clearFooterButton();
            return false;
		}
	});
	
	function getPicBatch(){
		if(player.getPicUrlParam().type != '0'){
			return player.picTools.select('#_sublist').value();
		}
		return '';
	}
	
	function drawGeometry2Map2AutoMatch(data, newTags){
        data.tags = {
	        MARKBY: iD.User.getInfo().username,
	        TRACKID: player.dataMgr.trackId,
	        TRACKPOINTID: player.pic_point.tags.trackPointId,
	        TRACKPOINTSEQ: player.pic_point.tags.seq || '',
	        BATCH: newTags.BATCH,
	        MARKTIME: (new Date()).getTime(),
	        PIXEL: newTags.PIXEL
	    };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, data, {
        	player: player,
        	context: context,
        	actionText: '添加分析标记点',
        	modelName: iD.data.DataType.ANALYSIS_TAG
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
