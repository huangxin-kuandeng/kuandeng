/**
 * Created by wangtao on 2017/8/31.
 */
iD.operations.jnuction = function(selectedIDs, context) {
    var action = iD.actions.junction(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.junction.annotation');
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
        return ways.length>1 && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.junction.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
        return t('operations.junction.description');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'junction';
    operation.keys = [t('operations.junction.key')];
    operation.title = t('operations.junction.title');

    return operation;
};
