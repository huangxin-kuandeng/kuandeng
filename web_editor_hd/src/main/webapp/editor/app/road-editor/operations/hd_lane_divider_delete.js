/*
 * @Author: tao.w
 * @Date: 2021-04-15 11:37:45
 * @LastEditors: tao.w
 * @LastEditTime: 2021-04-29 21:19:13
 * @Description: 
 */
/**
 * 删除 护栏与参考线 关联关系
 */
iD.operations.hdLaneDividerDelete = function(selectedIDs, context) {
    var relationName = iD.data.DataType.R_Lane_Divider;
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(relationName);
    var selectedRelations = [];

    var operation = function() {
        var rids = _.pluck(selectedRelations, 'id');
        context.perform(iD.actions.DeleteMultiple(rids, context), t('operations.hdLane_divider.delete_relation'));
        context.enter(iD.modes.Browse(context));
        
        selectedRelations = [];
		
		context.buriedStatistics().merge(0, iD.data.DataType.HD_LANE);
    };

    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        if (!currentLayer || !currentLayer.editable) return false;

        var graph = context.graph(),
            layer;
        for (var i = 0; i < selectedIDs.length; i++) {
            var entity = context.entity(selectedIDs[i]);
            if(![
                iD.data.DataType.HD_LANE
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
        return t('operations.hdLane_divider.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.hdLane_divider.delete_relation');

    return operation;
};
