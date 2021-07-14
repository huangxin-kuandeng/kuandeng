/**
 * Created by wangtao on 2017/8/31.
 */
iD.operations.cancelDividerJunction = function(selectedIDs, context) {
    var action = iD.actions.deleteDividerJunction(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.cancelDividerJunction.annotation.line');
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
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        if(!modelConfig || !modelConfig.editable){
            return isvisible;
        }
        if(entity.modelName == iD.data.DataType.JUNCTION){
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
            return t('operations.cancelDividerJunction.' + disable);
        }
        return t('operations.cancelDividerJunction.description.line');
    };

    operation.id = 'cancelDividerJunction';
    operation.keys = [t('operations.cancelDividerJunction.key')];
    operation.title = t('operations.cancelDividerJunction.title');

    return operation;
};