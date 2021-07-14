/*
 * @Author: tao.w
 * @Date: 2020-02-20 17:55:10
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-07 12:01:57
 * @Description: 
 */
iD.operations.rPlLaneDelete = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_PL_LANE;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function () {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.rPlLane.delete_relation'));
        context.enter(iD.modes.Browse(context));

        selectedRelations = [];
		
		context.buriedStatistics().merge(0, relationName);
    };

    operation.available = function () {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        var entity = context.entity(selectedIDs[0]);
        if (![
            iD.data.DataType.HD_LANE,
            iD.data.DataType.OBJECT_PL
        ].includes(entity.modelName)) {
            return false;
        }
        if (entity.modelName == iD.data.DataType.OBJECT_PL && !(entity.tags.TYPE == '2' && ['1', '2', '3'].includes(entity.tags.SUBTYPE))) {
            return false;
        }

        var rels = graph.parentRelations(entity, relationName);
        selectedRelations = rels;
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
        return t('operations.rPlLane.delete_relation');
    };

    operation.id = 'rPlLaneDelete';
    operation.keys = [];
    operation.title = t('operations.rPlLane.delete_relation');

    return operation;
};