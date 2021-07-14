/**
 * Created by wangtao on 2017/8/25.
 */
iD.operations.cancelRelations = function(selectedIDs, context) {
    var action = iD.actions.cancelRelations(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.cancelRelations.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
    };
    function relation(){

    }
    operation.available = function() {
        var isvisible = false;

        if(selectedIDs.length>1){
            return isvisible;
        }
        var entity = context.entity(selectedIDs[0]);
        var modelConfig = iD.Layers.getLayer(entity.layerId);
        if(!modelConfig || !modelConfig.editable){
            return isvisible;
        }
        if(entity.modelName == iD.data.DataType.DIVIDER || entity.modelName == iD.data.DataType.ROAD){
            isvisible = true;
        }
        return isvisible && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.cancelRelations.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
        return t('operations.cancelRelations.description.line');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'cancelRelations';
    operation.keys = [t('operations.cancelRelations.key')];
    operation.title = t('operations.cancelRelations.title');

    return operation;
};