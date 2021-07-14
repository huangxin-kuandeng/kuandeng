/**
 * 删除交通灯组Relation
 */
iD.operations.trafficLightTREFDelete = function(selectedIDs, context) {
	//var layer = context.layers().getLayerByName(iD.data.DataType.TRAFFICLIGHT);
	var selectedRelations = [];

    var operation = function() {
        context.perform(iD.actions.DeleteRelation(selectedRelations[0].id), t('operations.trafficLightTREF.delete_relation'));
        context.enter(iD.modes.Browse(context));
    };
    
    operation.available = function() {
        return false;
    	//if(!layer.editable) return false;
        if(selectedIDs.length < 1) return false;
        var graph = context.graph(), layerids = [], layer;
        
        var isBreak = false;
        selectedIDs.forEach(function (d, i) {
        	if(isBreak){
        		return ;
        	}
            let entity = context.entity(d);
            layer = iD.Layers.getLayer(entity.layerId);
            if (layerids.length == 0 || _.indexOf(layerids, layer.id) != -1) {
                layerids.push(layer.id)
            } else {
                return false;
            }
            if(entity.modelName == iD.data.DataType.TRAFFICLIGHT){
            	let rels = graph.parentRelations(entity, iD.data.DataType.R_TRAFFICLIGHT_TREF);
            	if(rels && rels.length){
            		selectedRelations.push(rels[0]);
            	}
            }else {
            	isBreak = true;
            }
        });
        if(!layer.editable) return false;
        if(!layer.isModelEditable(iD.data.DataType.R_TRAFFICLIGHT_TREF)) {
            return false;
        }
        selectedRelations = _.uniq(selectedRelations);
        
        return !isBreak 
        	&& selectedRelations.length == 1
        	&& !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.trafficLightTREF.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.trafficLightTREF.delete_relation');

    return operation;
};
