iD.svg.PicDraw = iD.svg.PicDraw || {};
// 组网标记
iD.svg.PicDraw.addNetworkTag = function(context, drawTool){
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
			return constant.ADD_NETWORK_TAG_POINT;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('组网标记点')
                .attr('modelName',iD.data.DataType.AUTO_NETWORK_TAG)
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
            iD.util.loadNetworkTagAdcode([geometry.lng, geometry.lat], function(newTags){
            	// load adcode
            	drawGeometry2Map2AutoMatch({geometry}, {
            		ADCODE: newTags.ADCODE
            	});
            });
            context.buriedStatistics().merge(0,iD.data.DataType.AUTO_NETWORK_TAG);
            player.clearFooterButton();
            return false;
		}
	});
	
	function drawGeometry2Map2AutoMatch(dataOpts, newTags){
        dataOpts.tags = Object.assign({
            CREATEBY: iD.User.getInfo().username,
            CREATETIME: (new Date()).getTime() + '',
            TRACKPOINTID: player.pic_point.tags.trackPointId || '',
            TRACKID: player.pic_point.tags.trackId || ''
        }, newTags);
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, dataOpts, {
        	player: player,
        	context: context,
        	actionText: '添加组网标记点',
        	modelName: iD.data.DataType.AUTO_NETWORK_TAG
        });
        iD.logger.editElement({
            'tag': "add_network_tag",
            'modelName': iD.data.DataType.AUTO_NETWORK_TAG
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
        	return true;
        }
        return false;
	}
	
	return new drawPlus();
}
