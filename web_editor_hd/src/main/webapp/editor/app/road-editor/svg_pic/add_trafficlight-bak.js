iD.svg.PicDraw = iD.svg.PicDraw || {};
// 交通灯
iD.svg.PicDraw.addTrafficlight = function(context, drawTool){
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
			return constant.ADD_TRAFFICLIGHT;
		},
		renderBtn: function(selection){
            selection.append('button')
                .attr('type','button')
                .text('交通灯')
                .attr('modelName',iD.data.DataType.TRAFFICLIGHT)
                .call(bootstrap.tooltip()
                    .placement('top')
                    .html(false)
                    .title(function(d) {
                        return '先选中一个杆顶点，再点击对应交通灯位置';
                    })
                )
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
			// 交通灯，基于灯杆PLANE添加
            var result = iD.picUtil.getLampHolderLonlat(clickOffset);
            if(!result.loc){
                return false;
            }
            drawGeometry2Map2AutoMatch(result.loc, {
                tags: {
                    PLANE: result.PLANE
                },
                clickOffset: clickOffset
            });
            return false;
		}
	});
	
	function drawGeometry2Map2AutoMatch(data, dataOpts){
        dataOpts.location = data;
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, dataOpts, {
        	player: player,
        	context: context,
        	actionText: '添加交通灯',
        	modelName: iD.data.DataType.TRAFFICLIGHT,
        	measureType: 2
        });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
        	drawTool._drawActionsPerform([actions], false);
        	// 局部的反投
        	drawTool.resetPointToPicPlayer(createIds);
        	return true;
        }
        return false;
	}
	
	return new drawPlus();
}
