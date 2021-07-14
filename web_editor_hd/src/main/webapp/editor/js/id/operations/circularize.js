iD.operations.Circularize = function(selectedIDs, context) {
	if(selectedIDs.length){
		var entityId = selectedIDs[0],
		    entity = context.entity(entityId),
		    extent = entity.extent(context.graph()),
		    geometry = context.geometry(entityId),
		    action = iD.actions.Circularize(entityId, context.projection);
	}
    var isEditable = function(_){
        var editable = true;
        for (var i = 0; i < _.length; i++) {
            var entity = context.graph().entity(_[i]),
                modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            editable = modelConfig && modelConfig.editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
            if(!editable) return false;
        }
        return editable;
    }

    var operation = function() {
        var annotation = t('operations.circularize.annotation.' + geometry);
        context.perform(action, annotation);
    };

    operation.available = function() {
        return false;
        var entity = context.entity(selectedIDs[0]);
        // var editable = iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
        var editable = isEditable(selectedIDs);
    	var layer = iD.Layers.getLayer(entity.layerId);
    	var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
    	// var layer = iD.Layers.getCurrentEnableLayer();
    	if (layer.isRoad() || layer.isLine()) return false;
        return editable&&selectedIDs.length === 1 &&
        	modelConfig.editable &&
            entity.type === 'way' &&
            _.uniq(entity.nodes).length > 1 && 
            !context.isOneRoadCrossWay(entity) &&
            !operation.disabled();
    };

    operation.disabled = function() {
    	// var layer = iD.Layers.getCurrentEnableLayer();
    	var layer = iD.Layers.getLayer();
    	if (layer.isRoad()) return false;
        var reason;
        if (extent.percentContainedIn(context.extent()) < 0.8) {
            reason = 'too_large';
        }
        return action.disabled(context.graph()) || reason;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.circularize.' + disable) :
            t('operations.circularize.description.' + geometry);
    };

    operation.id = 'circularize';
    operation.keys = [t('operations.circularize.key')];
    operation.title = t('operations.circularize.title');

    return operation;
};
