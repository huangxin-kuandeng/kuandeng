/**
 * Created by tildenDing on 2017/12/22.
 */
iD.operations.cancledividerOPG = function(selectedIDs, context) {
    var action = iD.actions.deleteDividerOPG(selectedIDs,context);


    var operation = function() {
        var annotation = t('operations.cancledividerOPG.annotation.line');
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
        if(entity.modelName == iD.data.DataType.OBJECT_PG){
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
            return t('operations.cancledividerOPG.' + disable);
        }
        return t('operations.cancledividerOPG.description.line');
    };

    operation.id = 'cancledividerOPG';
    operation.keys = [t('operations.cancledividerOPG.key')];
    operation.title = t('operations.cancledividerOPG.title');

    return operation;
};
