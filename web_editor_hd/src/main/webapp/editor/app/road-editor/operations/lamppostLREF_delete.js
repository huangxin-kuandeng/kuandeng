/**
 * 灯杆/灯头关系，删除
 */
iD.operations.LamppostLREFDelete = function(selectedIDs, context, isReplace) {
    
    var operation = function(){
        var graph = context.graph();
    	var entity = graph.entity(selectedIDs[0]);
		var relation = context.graph().parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF)[0];
		
		context.perform(
            iD.actions.DeleteRelation(relation.id),
			t('operations.opt_opt_delete.title')
		);
        context.enter(iD.modes.Browse(context));
    }
    operation.available = function(){
        var layer = context.layers().getLayersByModelName(iD.data.DataType.R_LAMPPOST_LREF) || [];
        var modelConfig = (layer[0] && layer[0].models) ? layer[0].models[iD.data.DataType.R_LAMPPOST_LREF] : null;
    	if(!modelConfig || !modelConfig.editable) return false;
        if(selectedIDs.length != 1) return false;
        var entity=context.graph().entity(selectedIDs[0]);
        var rels = context.graph().parentRelations(entity, iD.data.DataType.R_LAMPPOST_LREF);
        
        if(!rels.length){
        	return false;
        }
        
        return layer.editable && !operation.disabled();
    }
    operation.disabled = function(){
        return false;
    }
    operation.tooltip = function(){
        return t('operations.lamppost_lref_delete.description');
    }
    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.lamppost_lref_delete.title');
    return operation;
}