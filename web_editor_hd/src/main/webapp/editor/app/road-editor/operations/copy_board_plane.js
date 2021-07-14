/**
 * 复制路牌测量信息
 */
iD.operations.copyBoardPlane = function(selectedIDs, context) {
	var COPY_PASTE_KEY = 'map_editor_copy_board_plane';
	//	let selectedLamp = [];
	var selectEntity, measureRel;

	var operation = function() {
		var datainfo = iD.picUtil.parseMeasureNodes(measureRel)[0] || {};
		var trackPointId = datainfo.trackPointId;
		var trackId = datainfo.trackId || '';
		if(!trackPointId){
			Dialog.alert('量测信息中没有轨迹点ID');
			return ;
		}
		
		var result = {
			PLANE: selectEntity.tags.PLANE,
			trackPointId: trackPointId,
			trackId: trackId,
			entityid: selectEntity.id
		};
		iD.logger.editElement({
            tag: 'board_plane_copy',
            entityid: selectEntity.id,
            modelName: selectEntity.modelName
        });				//量测信息复制时增加埋点操作
		localStorage.setItem(COPY_PASTE_KEY, JSON.stringify(result));

		context.enter(iD.modes.Browse(context));
	}
	
	operation.available = function(){
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
		if(entity.modelName != iD.data.DataType.TRAFFICSIGN || !entity.tags.PLANE){
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
			return t('operations.copy_board_plane.noRelation');
		}
		return t('operations.copy_board_plane.description');
	}
	operation.id = 'copy';
	operation.keys = [iD.ui.cmd('⌘C')];
	operation.title = t('operations.copy_board_plane.title');
	return operation;
}