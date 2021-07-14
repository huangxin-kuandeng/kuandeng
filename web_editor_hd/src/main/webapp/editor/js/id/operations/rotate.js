iD.operations.Rotate = function(selectedIDs, context) {
	if(selectedIDs.length){
	    var entityId = selectedIDs[0],
	        entity = context.entity(entityId),
	        extent = entity.extent(context.graph()),
	        geometry = context.geometry(entityId);
   	}

    var operation = function() {
        context.enter(iD.modes.RotateWay(context, entityId));
    };

    operation.available = function() {
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        if(!modelConfig || !modelConfig.editable)return false;
        
        if (selectedIDs.length !== 1 || entity.type !== 'way')
            return false;
        if (geometry === 'area'){
        	if(entity.modelName != iD.data.DataType.OBJECT_PG) return false;
            return true && !operation.disabled();
        }
        if (entity.isClosed() &&
            context.graph().parentRelations(entity).some(function(r) { return r.isMultipolygon(); }))
            return true && !operation.disabled();
        return false;
    };

    operation.disabled = function() {
    	var layer = iD.Layers.getLayer(entity.layerId);
        if(!layer.isModelEditable(entity.modelName)){
        	return true;
        }
        if (extent.percentContainedIn(context.extent()) < 0.8) {
            return 'too_large';
        } else {
            return false;
        }
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.rotate.' + disable) :
            t('operations.rotate.description');
    };

    operation.id = 'rotate';
    operation.keys = [t('operations.rotate.key')];
    operation.title = t('operations.rotate.title');

    return operation;
};
