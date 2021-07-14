iD.operations.Orthogonalize = function(selectedIDs, context) {
	// if(selectedIDs.length){
		var entityId = selectedIDs[0],
		    entity = context.entity(entityId),
		    extent = entity.extent(context.graph()),
		    geometry = context.geometry(entityId),
		    action = iD.actions.Orthogonalize(selectedIDs, context.projection);
	// }

    var operation = function() {
        var annotation = t('operations.orthogonalize.annotation.' + geometry);
        context.perform(action, annotation);
    };

    operation.available = function() { return false;
        if(selectedIDs.length !=2) {
            return false;
        }
        
        let entity1 = context.entity(selectedIDs[0]);
        let entity2 = context.entity(selectedIDs[1]);
        
        if(entity1.layerId != entity2.layerId || 
            !iD.Layers.getLayer(entity1.layerId, entity1.modelName).editable){
                return false;
            }
        let wids1 = _.pluck(context.graph().parentWays(entity1),'id');
        let wids2 = _.pluck(context.graph().parentWays(entity2),'id');
        let wayID;
        for(let i=0;i<wids1.length;i++){
            if(wids2.includes(wids1[i])){
                wayID = wids1[i];
                break;
            }
        }

        return wayID;
        // if(!entity.layerInfo().enable)return false;
        /*return selectedIDs.length === 1 &&
            entity.type === 'way' &&
            entity.isClosed() &&
            _.uniq(entity.nodes).length > 2;*/
    };

    operation.disabled = function() {
        var reason;
        if (extent.percentContainedIn(context.extent()) < 0.8) {
            reason = 'too_large';
        }
        return action.disabled(context.graph()) || reason;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.orthogonalize.' + disable) :
            t('operations.orthogonalize.description.' + geometry);
    };

    operation.id = 'orthogonalize';
    operation.keys = [t('operations.orthogonalize.key')];
    operation.title = t('operations.orthogonalize.title');

    return operation;
};
