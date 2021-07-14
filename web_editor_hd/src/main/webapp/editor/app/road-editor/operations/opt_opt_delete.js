/**
 * 灯杆、灯头选中时，显示“删除灯杆关系”
 */
iD.operations.optOptDelete = function(selectedIDs, context) {
	var layer;
	/*if(window._isInstance){
		layer = context.layers().getLayerByName(iD.data.DataType.FUSION_OBJECT_PT);
	}else {*/
		layer = context.layers().getLayerByName(iD.data.DataType.OBJECT_PT);
	// }
	
    var operation = function(){
    	var graph = context.graph();
    	var entity = graph.entity(selectedIDs[0]);
		var relation = context.graph().parentRelations(entity, iD.data.DataType.R_OPT_OPT)[0];
		
		context.perform(
			iD.actions.DeleteRelation(relation.id),
			t('operations.opt_opt_delete.title')
		);
        context.enter(iD.modes.Browse(context));
    };

    operation.available = function(){
    	return false;
    	if(!layer.editable) return false;
        if(selectedIDs.length != 1) return false;
        var entity=context.graph().entity(selectedIDs[0]);
        var rels = context.graph().parentRelations(entity, iD.data.DataType.R_OPT_OPT);
        
        if(!rels.length){
        	return false;
        }
        
        return layer.editable && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        return t('operations.opt_opt_delete.description');
    };
    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('P')];
    operation.title = t('operations.opt_opt_delete.title');
    return operation;
}