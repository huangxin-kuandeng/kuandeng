/**
 * 复制线到导航图层
 * @param {[type]} selectedIDs [description]
 * @param {[type]} context     [description]
 */
iD.operations.Copy = function(selectedIDs, context) {
	var action = iD.actions.CloneMultiple(selectedIDs, context.projection, context, 'copy');
	var operation = function(){
		var annotation = t('operations.copy.annotation');
		context.perform(
            action,
            annotation);
		        //若新导航线跨图幅，按照图幅边线分隔
        var newWayIds = context._newCopyLinedIds;
        _.uniq(newWayIds).forEach(function(id){
        	var entity = context.graph().entity(id);
        	context.replace(
        			iD.actions.MoveLineSplitTuFu(context, entity),
        			annotation);
        });
	};
	operation.available = function(){
		//目前只针对普通线
		//且当前entity所属图层可编辑
		return false;
		// var layer = context.layers().getCurrentEnableLayer();
		var layer = context.layers().getLayer();
		//  || layer && layer.isArea() || layer && layer.isPoint()
		if(selectedIDs.length === 0 || !layer) return false;
		for(let sid of selectedIDs){
			let entity = context.hasEntity(sid);
			if(entity && entity instanceof iD.Way){
				if(entity.isArea()){
					return false;
				}
			}else {
				return false;
			}
		}

		var firstEntity = context.entity(selectedIDs[0]);
		
		if(firstEntity.type == "node")return false;
		var lay = iD.Layers.getLayer(firstEntity.layerId);
		var modelConfig = iD.Layers.getLayer(firstEntity.layerId, firstEntity.modelName);
		if(lay.isLine()&&
			!modelConfig.editable){
			return true && !operation.disabled();
		}
		return false && !operation.disabled();
	};
	operation.disabled = function(){
		return false;
	};
	operation.tooltip = function(){
		return t('operations.copy.description');
	};

	operation.id = 'copy';
	operation.keys = [iD.ui.cmd('C')];
	operation.title = t('operations.copy.title');

	return operation;
}