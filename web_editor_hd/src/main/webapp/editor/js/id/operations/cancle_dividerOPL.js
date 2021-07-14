/**
 * Created by tildenDing on 2017/12/16.
 */
iD.operations.cancledividerOPL = function(selectedIDs, context) {
    var action = iD.actions.deleteDividerOPL(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.cancledividerOPL.annotation.line');
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
        if(entity.modelName == iD.data.DataType.OBJECT_PL){
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
            return t('operations.cancledividerOPL.' + disable);
        }
        return t('operations.cancledividerOPL.description.line');
    };

    operation.id = 'cancledividerOPL';
    operation.keys = [t('operations.cancledividerOPL.key')];
    operation.title = t('operations.cancledividerOPL.title');

    return operation;
};
