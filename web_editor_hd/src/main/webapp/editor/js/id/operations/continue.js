iD.operations.Continue = function(selectedIDs, context) {
    // var graph = context.graph(),
    //     entities = selectedIDs.map(function(id) { return graph.entity(id); }),
    //     geometries = _.extend({line: [], vertex: []},
    //         _.groupBy(entities, function(entity) { return entity.geometry(graph); })),
    //     vertex = geometries.vertex[0];

    function candidateWays() {
        return graph.parentWays(vertex).filter(function(parent) {
            return parent.geometry(graph) === 'line' &&
                parent.affix(vertex.id) &&
                (geometries.line.length === 0 || geometries.line[0] === parent);
        });
    }

    var operation = function() {
        var candidate = candidateWays()[0];
        context.enter(iD.modes.DrawLine(
            context,
            candidate.id,
            context.graph(),
            candidate.affix(vertex.id)));
    };

    operation.available = function() {
        return false;
    	var entity = context.entity(selectedIDs[0]),
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName),
    		isMultiple = modelConfig.editable && geometries.vertex.length === 1 && geometries.line.length <= 1;
    	if((entity.isArea && entity.isArea()) || !modelConfig.editable || context.isRoadCross(entity)) return false;
    	var ways = context.graph().parentWays(entity);
    	if(ways && ways.length>1)return false;
    	if(ways && ways.length === 1){
    		if((ways[0].first() === selectedIDs[0] || ways[0].last() === selectedIDs[0]))
    			return true && isMultiple && !operation.disabled();
    		else
    			return false;
    	}
    	
    	

        return isMultiple && !operation.disabled();
    };

    operation.disabled = function() { 
        var candidates = candidateWays();
        if (candidates.length === 0)
            return 'not_eligible';
        if (candidates.length > 1)
            return 'multiple';
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.continue.' + disable) :
            t('operations.continue.description');
    };

    operation.id = 'continue';
    operation.keys = [t('operations.continue.key')];
    operation.title = t('operations.continue.title');

    return operation;
};
