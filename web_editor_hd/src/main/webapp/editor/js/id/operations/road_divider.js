/**
 * Created by wangtao on 2017/8/25.
 */
iD.operations.roadDivider = function(selectedIDs, context) {
    var action = iD.actions.roadDivider(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.road_divider.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
    };

    operation.available = function() {
        var ways = [];
        var modelConfig;
        var entity;
        selectedIDs.forEach(function (d, i) {
            entity = context.entity(d);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(modelConfig && modelConfig.editable && entity.modelName == iD.data.DataType.DIVIDER){
                ways.push(d);
            }
        })
        //modify by Tilden
        return ways.length>0 && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.road_divider.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
        return t('operations.road_divider.description.line');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'road_divider';
    operation.keys = [t('operations.road_divider.key')];
    operation.title = t('operations.road_divider.title');

    return operation;
};
