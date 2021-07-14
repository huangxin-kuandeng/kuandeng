/**
 * 删除 道路上放结构
 */
iD.operations.roadFacilitiesDelete = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_ROAD_FACILITIES;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function() {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.r_road_facilities.delete_relation'));
        context.enter(iD.modes.Browse(context));
        
        selectedRelations = [];
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_ROAD_FACILITIES);
    };

    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if(![
                iD.data.DataType.ROAD_FACILITIES,
                iD.data.DataType.DIVIDER
            ].includes(entity.modelName)){
                continue;
            }

            var rels = graph.parentRelations(entity, relationName);
            selectedRelations = rels;
            layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
        }
        if (!selectedRelations || !selectedRelations.length) return false;
        if (!layer || !layer.editable) {
            return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.r_road_facilities.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.r_road_facilities.delete_relation');

    return operation;
};
