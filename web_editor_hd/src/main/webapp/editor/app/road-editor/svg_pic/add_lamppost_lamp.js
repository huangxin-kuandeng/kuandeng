iD.svg.PicDraw = iD.svg.PicDraw || {};
// 灯头
iD.svg.PicDraw.addLamppostLampHolder = function(context, drawTool){
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
			return constant.TELEGRAPH_LAMP_HOLDER;
		},
		renderBtn: function(selection){
            // selection.append('button')
            //     .attr('type','button')
            //     .text('灯头')
            //     .attr('modelName',iD.data.DataType.LAMPPOST)
            //     .call(bootstrap.tooltip()
            //         .placement('top')
            //         .html(false)
            //         .title(function(d) {
            //             return '先选中一个杆顶点，再点击对应灯头位置';
            //         })
            //     )
            //     .data([this.getId()]);
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
			// 灯头，基于灯杆PLANE添加
            var result = iD.picUtil.getLampHolderLonlat(clickOffset);
            if(!result.loc){
                return false;
            }
            context.buriedStatistics().merge(0,iD.data.DataType.LAMPPOST);
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
        dataOpts.tags.TYPE = 2;
        dataOpts.location = data;
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, dataOpts, {
        	player: player,
        	context: context,
        	actionText: '添加灯头',
        	modelName: iD.data.DataType.LAMPPOST,
        	measureType: 2
        });
        // iD.logger.editElement({
        //     'tag': "add_lamppost_lamp",
        //     'modelName': iD.data.DataType.LAMPPOST
        // });
        if(!result) return false;
        var actions = result.actions;
        var createIds = result.createIds;
        
        // 执行绘制
        if(actions.length){
            if(!context.transactionEditor()){
                if(iD.util.pointNotInPlyGonx(data,context)){
                    Dialog.alert('新增灯头不属于该任务范围内');
                    player.resetCanvas();
                    return false;
                }
            }  
            
        	drawTool._drawActionsPerform([actions], false);
        	// 局部的反投
            drawTool.resetPointToPicPlayer(createIds);
            let _n = context.hasEntity(createIds[0]);
            iD.logger.editElement({
                'tag': "add_lamppost_lamp",
                'entityId':context.hasEntity(createIds[0]).osmId() || '',
                'coordinate':_n.loc || [],
                'modelName': iD.data.DataType.LAMPPOST,
                'filter': iD.logger.getFilter(_n, context)
            });
            
            drawTool.event.add(createIds[0]);
        	return true;
        }
        return false;
	}
	
	return new drawPlus();
}
