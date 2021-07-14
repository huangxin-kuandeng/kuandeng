/**
 * 根据控制点偏移要素和轨迹点
 * Tilden
 */
iD.operations.rectifyDeviationFeature = function(selectedIDs, context, isReplace) {
    var action = iD.actions.rectifyDeviationFeature(selectedIDs,context);

    var operation = function(){
        var annotation = t('operations.rectifyDeviationFeature.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
        context.event.entityedite();
    };

    operation.available = function(){
        return !operation.disabled()
    };
    operation.disabled = function(){
        return action.disabled(context.graph());
    };
    operation.tooltip = function(){
        return t('operations.rectifyDeviationFeature.description');
    };
    operation.id = 'rdf';
    operation.keys = [iD.ui.cmd('D')];
    operation.title = t('operations.rectifyDeviationFeature.title');
    return operation;
}