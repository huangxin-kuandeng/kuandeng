iD.operations.RoadsMove = function(selectedIDs, context) {
    
    var operation = function(){
		var entities = [];
		var annotation = t('operations.roadsmove.annotation.road'),
			action = iD.actions.CloneRoadWay(context.selectedIDs(), undefined, context, entities);
		context.perform(action, annotation);
		context.enter(iD.modes.Move(context, entities));
	};

	operation.available = function() {
		return false;
		// var layer = context.layers().getCurrentEnableLayer(), graph = context.graph();
		var layer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId), graph = context.graph();
		if (layer && !layer.isRoad() || selectedIDs.length < 2) return false;
		var legal = true;
		selectedIDs.forEach(function (id) {
			!(context.entity(id).geometry(graph) === 'line') && (legal = false);
		});
		return legal && !operation.disabled();
	};

    operation.disabled = function() {
//      return !this.available();
        return false;
    };

    operation.tooltip = function() {
        return t('operations.roadsmove.description.road');
    };

    operation.id = 'roadsmove';
    operation.keys = [t('operations.roadsmove.key')];
    operation.title = t('operations.roadsmove.title');

    return operation;
} 