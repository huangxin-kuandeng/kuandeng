/**
 * 拖拽BARRIER_GEOMETRY_NODE，使整条线的所有节点按照拖拽点距离移动
 */
iD.operations.ExpandBarrierGeometryNode = function(selectedIDs, context) {
    var selectEntity;

    var action = iD.actions.ExpandBarrierGeometryNode(selectedIDs,context);
    var operation = function() {
        annotation = t('operations.expand.offset-kerb');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
        context.event.entityedite({
            entitys: [selectedIDs[0]]
        });
    };
    
    operation.available = function() {
        if (selectedIDs.length != 1) return false;
        var entity = context.entity(selectedIDs[0]);
        // if (entity.modelName != wayModelName) {
        if (iD.data.DataType.BARRIER_GEOMETRY !== entity.modelName) {
            return false;
        }
        if(!context.variable.dragBarrierNode.nodeId) {
            return false;
        } else {
            if (!context.hasEntity(context.variable.dragBarrierNode.nodeId)) {
                context.variable.dragBarrierNode = {
                    nodeId: '',
                    oldLoc: [],
                    newLoc: []
                }
                return false;
            }
            var node = context.entity(context.variable.dragBarrierNode.nodeId),
                parentBarrier = context.graph().parentWays(node);
            if (parentBarrier[0] && parentBarrier[0].id !== entity.id) {
                return false;
            }
        }
        // if(entity.modelName == iD.data.DataType.DIVIDER){
        //     wayModelName = iD.data.DataType.DIVIDER;
        //     nodeModelName = iD.data.DataType.DIVIDER_NODE;
        // }

        // var layer = iD.Layers.getLayer(entity.layerId);
        selectEntity = entity;

        return !operation.disabled();
    };
    operation.disabled = function() {
        return false;
    };
    operation.tooltip = function() {
        return t('operations.expand.node-offset-barrier');
    };

    operation.id = 'straighten';
    operation.keys = [iD.ui.cmd('P')];
    operation.title =t('operations.expand.node-offset-barrier');

    return operation;
}