/*
 * @Author: huangxin
 * @Date: 2020-09-23 17:36:18
 * @LastEditors: huangxin
 * @LastEditTime: 2020-09-23 17:36:18
 * @Description: 
 */
iD.svg.PicDraw = iD.svg.PicDraw || {};
// 图像标记
iD.svg.PicDraw.addPickMarkTag = function(context, drawTool){
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
			return constant.ADD_PICK_MARK_TAG_POINT;
		},
		renderBtn: function(selection){
            if(!iD.User.authQueryTag()){
            	return ;
            }
            selection.append('button')
                .attr('type','button')
                .text('图像标记')
                .attr('modelName',iD.data.DataType.PICK_MARK_TAG)
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
            var extent = iD.util.getBounds(nownode.loc, 10);
            var entities = context.intersects(extent);
            var repeat = false;
            for(var entity of entities){
                if(entity.modelName == iD.data.DataType.PICK_MARK_TAG
                    && nownode.tags.trackId == entity.tags.TRACKID
                    && nownode.tags.trackPointId == entity.tags.TRACKPOINTID){
                    repeat = true;
                }
            }

			player.clearFooterButton();
            if(entities.length && repeat){
                Dialog.sidebarAlert('当前图像已被标记', {
                    time: 2000,
                    type: 'error'
                });
                return ;
            }
			
			var layer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.PICK_MARK_TAG);
			var layerId = layer.id;
			var node = iD.Node({
				modelName: iD.data.DataType.PICK_MARK_TAG,
				identifier: layer.identifier,
				loc: nownode.loc,
				layerId: layerId
			});
			
			node.setTags(iD.util.getDefauteTags(node, layer));
			
			node.tags.TRACKID = nownode.tags.trackId;
			node.tags.TRACKPOINTID = nownode.tags.trackPointId;
			// node.mergeTags({
			// 	'TRACKID': ,
			// 	'TRACKPOINTID': nownode.tags.trackPointId
			// });
			
			context.perform(iD.actions.AddEntity(node), '图像标记');
			
            // player._refreshViewTextTag(nownode);
            // context.buriedStatistics().merge(0,iD.data.DataType.PICK_MARK_TAG);

			return false;
		}
	});
	
	return new drawPlus();
}
