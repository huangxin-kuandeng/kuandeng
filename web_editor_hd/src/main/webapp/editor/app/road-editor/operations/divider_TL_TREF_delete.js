/**
 * 删除 交通灯/参考线 关联关系
 */
iD.operations.dividerTrafficLightTREFDelete = function(selectedIDs, context) {
    /*var layer = context.layers().getLayerByName(iD.data.DataType.TRAFFICLIGHT);
     var layer2 = context.layers().getLayerByName(iD.data.DataType.DIVIDER);*/
    var selectedRelations = [];
    var currentLayer = iD.Layers.getCurrentModelEnableLayer(iD.data.DataType.R_DIVIDER_TL);

    var operation = function() {
        for (var i = 0; i < selectedRelations.length; i++) {
            var rel = selectedRelations[i];
            context.perform(iD.actions.DeleteRelation(rel.id), t('operations.dividerTrafficLightTREF.delete_relation'));
            context.enter(iD.modes.Browse(context));
        }
        selectedRelations = [];
		context.buriedStatistics().merge(0, iD.data.DataType.R_DIVIDER_TL);
    };

    operation.available = function() {
        // if(!layer.editable || !layer2.editable) return false;
        if (!currentLayer) return false;
        if(selectedIDs.length != 1) return false;
        var graph = context.graph(), layer;

        var isBreak = false;
        selectedIDs.forEach(function (d, i) {
            if(isBreak){
                return ;
            }
            let entity = context.entity(d);
            /*if (entity.modelName == iD.data.DataType.DIVIDER) {
             layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
             } else */if (entity.modelName == iD.data.DataType.TRAFFICLIGHT) {
                layer = iD.Layers.getLayer(entity.layerId, entity.modelName);
            }
            if(_.include([iD.data.DataType.TRAFFICLIGHT, iD.data.DataType.DIVIDER], entity.modelName)){
                let rels = graph.parentRelations(entity, iD.data.DataType.R_DIVIDER_TL);
                if(rels && rels.length){
                    // selectedRelations.push(rels[0]);
                    selectedRelations = rels;
                }
            }else {
                isBreak = true;
            }
        });

        if (selectedRelations.length == 0) {
            return false;
        }

        var layer3 = iD.Layers.getLayer(currentLayer.id, iD.data.DataType.R_DIVIDER_TL);
        if (!layer || !layer3) {
            return false;
        }
        if (!layer.editable || !layer3.editable) {
            return false;
        }

        selectedRelations = _.uniq(selectedRelations);

        return !isBreak
            // && selectedRelations.length == 1
            && !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function() {
        return t('operations.dividerTrafficLightTREF.delete_relation');
    };

    operation.id = 'delete';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.dividerTrafficLightTREF.delete_relation');

    return operation;
};
