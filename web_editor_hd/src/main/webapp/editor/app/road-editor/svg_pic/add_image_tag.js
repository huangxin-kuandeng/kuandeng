/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-18 18:03:19
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 图像标记
iD.svg.PicDraw.addImageTag = function(context, drawTool){
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
			return constant.ADD_IMAGE_TAG_POINT;
		},
		renderBtn: function(selection){
            if(!iD.User.authQueryTag()){
            	return ;
            }
            selection.append('button')
                .attr('type','button')
                .text('图像标记点')
                .attr('modelName',iD.data.DataType.IMAGE_TAG)
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
		// 选中按钮
		buttonClick: function(evt, isActive, button){
			// 图像标记
            var nownode = player.pic_point;
            var batch = getPicBatch();
            var extent = iD.util.getBounds(nownode.loc, 10);
            var entities = context.intersects(extent);
            var repeat = false;
            for(var entity of entities){
                if(entity.modelName == iD.data.DataType.IMAGE_TAG
                    && nownode.tags.trackId == entity.tags.TRACKID
                    && nownode.tags.trackPointId == entity.tags.TRACKPOINTID
                    && (entity.tags.BATCH || '') == batch){
                    repeat = true;
                }
            }

            if(entities.length && repeat){
                Dialog.sidebarAlert('当前' + (batch ? '批次' + batch : '图像') + '已被标记', {
                    time: 4000,
                    type: 'error'
                });
                return ;
            }

            drawGeometry2Map2AutoMatch({
            	location: nownode.loc
            }, {
                BATCH: batch
            });
            player.clearFooterButton();
            player._refreshViewTextTag(nownode);
            context.buriedStatistics().merge(0,iD.data.DataType.IMAGE_TAG);
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
            MARKTIME: (new Date()).getTime()
        };
        var result = iD.svg.PicDrawUtil.drawPoint2Map(null, data, {
        	player: player,
        	context: context,
        	actionText: '添加图像标记点',
        	modelName: iD.data.DataType.IMAGE_TAG
        });
        iD.logger.editElement({
            'tag': "add_image_tag",
            'modelName': iD.data.DataType.IMAGE_TAG
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
