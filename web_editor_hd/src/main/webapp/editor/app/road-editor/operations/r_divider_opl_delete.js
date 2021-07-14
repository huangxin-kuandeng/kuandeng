/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-06 13:58:09
 * @Description: 
 */
 
/**
 * @description: 
 * @param {type} 
 * @return: 
 */ 
iD.operations.rDividerOplDelete = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_DIVIDER_OPL;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function () {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.rDividerOpl.delete_relation'));
        context.enter(iD.modes.Browse(context));

        let index = _.findIndex(context.variable.heilights, function (entityId) {
            return context.hasEntity(entityId.split('.')[1]).id === selectedIDs[0];
        });
        if (index) {
            context.variable.heilights.splice(index, 1);
        }

        selectedRelations = [];
		
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_OPL);
    };

    operation.available = function () {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        // for (var i = 0; i < selectedIDs.length; i++) {
        var entity = context.entity(selectedIDs[0]);
        if (![
            iD.data.DataType.OBJECT_PL,
            iD.data.DataType.DIVIDER
        ].includes(entity.modelName)) {
            return false;
        }

        var rels = graph.parentRelations(entity, relationName);
        selectedRelations = rels;
        layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
        // }
        if (!selectedRelations || !selectedRelations.length) return false;
        if (!layer || !layer.editable) {
            return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rDividerOpl.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.rDividerOpl.delete_relation');

    return operation;
};