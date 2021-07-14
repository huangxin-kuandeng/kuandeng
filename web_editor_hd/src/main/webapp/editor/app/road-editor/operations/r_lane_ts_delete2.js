/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-12 18:10:55
 * @Description: 
 */

iD.operations.rPgLaneDelete2 = function (selectedIDs, context) {
    var relationName = iD.data.DataType.R_SIGN_LANE;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function () {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.rTsLane2.delete_relation'));
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
        if (![
            iD.data.DataType.TRAFFICSIGN,
            iD.data.DataType.HD_LANE
        ].includes(entity.modelName)) {
            return false;
        }

        var rels = graph.parentRelations(entity, relationName);
        selectedRelations = rels;
        layer = iD.Layers.getLayer(entity.layerId, entity.modelName);

        if (!selectedRelations || !selectedRelations.length) return false;
        selectedRelations = selectedRelations.filter(d=>{
            return d.tags.TYPE == '2'
        })
        if(selectedRelations.length ==0) return false;

        if (!layer || !layer.editable) {
            return false;
        }

        return !operation.disabled();
    };

    operation.disabled = function () {
        return false;
    };

    operation.tooltip = function () {
        return t('operations.rTsLane2.delete_relation');
    };

    operation.id = 'rPgLaneDelete2';
    operation.keys = [];
    operation.title = t('operations.rTsLane2.delete_relation');

    return operation;
};