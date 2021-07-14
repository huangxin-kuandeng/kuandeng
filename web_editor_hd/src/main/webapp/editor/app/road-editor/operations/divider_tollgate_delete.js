/**
 * 删除 收费站
 */
iD.operations.dividerTollgateDelete = function(selectedIDs, context) {
    var relationName = iD.data.DataType.TOLLGATE;
    var wayModelName = iD.data.DataType.DIVIDER;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function() {
        for (var i = 0; i < selectedRelations.length; i++) {
            var rel = selectedRelations[i];
            context.perform(iD.actions.DeleteRelation(rel.id), t('operations.divider_tollgate.delete_relation'));
            context.enter(iD.modes.Browse(context));
        }
        selectedRelations = [];
    };

    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if (entity.modelName != wayModelName) continue;

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
        return t('operations.divider_tollgate.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.divider_tollgate.delete_relation');

    return operation;
};
