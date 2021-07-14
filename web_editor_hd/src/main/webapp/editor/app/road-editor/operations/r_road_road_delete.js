/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-09 16:46:55
 * @Description: 
 */

iD.operations.rRoadDelete = function (selectedIDs, context) {
    var relationName = iD.data.DataType.R_ROAD;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function () {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.rRoad.delete_relation'));
        context.enter(iD.modes.Browse(context));

        selectedRelations = [];
        context.buriedStatistics().merge(0, iD.data.DataType.relationName);
    };

    operation.available = function () {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        var entity = context.entity(selectedIDs[0]);
       
        if (iD.data.DataType.ROAD != entity.modelName) {
            return false;
        }

        selectedRelations = graph.parentRelations(entity, relationName);
        layer = iD.Layers.getLayer(entity.layerId, entity.modelName);

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
        return t('operations.rRoad.delete_relation');
    };

    operation.id = 'rRoadDelete';
    operation.keys = [];
    operation.title = t('operations.rRoad.delete_relation');

    return operation;
};