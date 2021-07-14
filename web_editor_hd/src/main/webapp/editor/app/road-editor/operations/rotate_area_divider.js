/**
 * 根据选中车道选，调整选中路面要素的角度
 */
iD.operations.rotateAreaDivider = function(selectedIDs, context) {
	//	let selectedLamp = [];
	var selectEntity, selectDivider;

	var operation = function() {
		iD.util.rotateFeature(context, selectEntity, selectDivider);
	}
	
	operation.available = function(){
		if(selectedIDs.length != 2) return false;
		if(!iD.picUtil.player || !iD.picUtil.player.wayInfo){
			return false;
		}
		var graph = context.graph();
        for(var i=0;i<selectedIDs.length;i++)
        {
            var entity=graph.entity(selectedIDs[i]);
            if(entity.modelName == iD.data.DataType.DIVIDER){
            	selectDivider = entity;
            }else if(entity.modelName == iD.data.DataType.OBJECT_PG){
            	if(!iD.picUtil.checkNodeIsGroundArea(entity.id)){
            		// 非地面要素
            		return false;
            	}
            	selectEntity = entity;
            }else {
            	return false;
            }
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(!modelConfig) return false;
            if(!modelConfig.editable) return false;
        }
		
		return !operation.disabled();
	}
	
	operation.disabled = function() {
		if(!selectEntity || !selectDivider) {
			return true;
		}
		return false;
	}
	operation.tooltip = function() {
		return t('operations.rotate_area_divider.description');
	}
	operation.id = 'rotate';
	operation.keys = [iD.ui.cmd('T')];
	operation.title = t('operations.rotate_area_divider.title');
	return operation;
}