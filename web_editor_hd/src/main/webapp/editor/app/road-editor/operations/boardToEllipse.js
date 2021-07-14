/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:17
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-19 15:55:16
 * @Description: 
 */
/**
 * 路牌转圆形路牌
 */
iD.operations.boardToEllipse = function(selectedIDs, context) {
	//	let selectedLamp = [];
	var selectEntity, measureRel, graph = context.graph();
	var action = iD.actions.boardToEllipse(selectedIDs,context);


	var operation = function() {

		var annotation = t('operations.board_ellipse.title');

		iD.logger.editElement({
            'tag': "menu_boardToEllipse"
        });			//点击路牌转圆形路牌时增加埋点
		// action(graph)
		context.perform(action, annotation);
		context.enter(iD.modes.Browse(context));
		context.event.entityedite({
        	entitys: selectedIDs
        });
	}

	function getBounds(path){
        var bounds = [_.clone(path[0]), _.clone(path[1])];
        for(var i=1,l=path.length;i<l;++i){
            bounds[0][0]=Math.min(bounds[0][0],path[i][0]);
            bounds[0][1]=Math.min(bounds[0][1],path[i][1]);
            bounds[1][0]=Math.max(bounds[1][0],path[i][0]);
            bounds[1][1]=Math.max(bounds[1][1],path[i][1]);
        }
        return {};
    }
	
	operation.available = function(){
        return false;
		if(selectedIDs.length != 1) return false;
		if(!iD.picUtil.player || !iD.picUtil.player.wayInfo){
			return false;
		}
		var graph = context.graph();
		var entity = context.entity(selectedIDs[0]);
		var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
		if(!modelConfig || !modelConfig.editable){
			return false;
		}
		if(entity.modelName != iD.data.DataType.TRAFFICSIGN){
			return false;
		}
		var relations = graph.childNodes(entity).map(function(node){
			return graph.parentRelations(node, iD.data.DataType.MEASUREINFO)[0];
		});
		relations = _.compact(relations);
		if(!relations.length) return false;
		selectEntity = entity;
		measureRel = relations[0];
		
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		if(!selectEntity) {
			return true;
		}
		return false;
	}
	operation.tooltip = function() {
		if(!measureRel){
			return t('operations.board_ellipse.noRelation');
		}
		return t('operations.board_ellipse.description');
	}
	operation.id = 'transform';
	operation.keys = [];
	operation.title = t('operations.board_ellipse.title');
	return operation;
}