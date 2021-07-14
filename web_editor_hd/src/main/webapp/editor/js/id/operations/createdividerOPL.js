/**
 * Created by tildenDing on 2017/12/15.
 */
iD.operations.createdividerOPL = function(selectedIDs, context) {
    var action = iD.actions.createdividerOPL(selectedIDs,context);


    var operation = function() {
    	// 点击菜单中的此项后，会实际执行的代码
        var annotation = t('operations.createdividerOPL.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
    };
	// 判断该项是否需要出现在菜单中
    operation.available = function() {
        var ways = [];
        var modelConfig;
        var entity;
        selectedIDs.forEach(function (d, i) {
            entity = context.entity(d);
            modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(!modelConfig || !modelConfig.editable){
            	return true;
            }
            if(entity.modelName == iD.data.DataType.OBJECT_PL 
        		|| (entity.modelName == iD.data.DataType.DIVIDER && entity.tags.R_LINE == "1")){
                ways.push(entity);
            }
        });
        // 在出现的菜单项中是否显示该操作
        return selectedIDs.length > 1 && _.uniq(_.pluck(ways, 'modelName')).length == 2 && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.createdividerOPL.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
            return t('operations.createdividerOPL.description.line');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'createdividerOPL';
    operation.keys = [t('operations.createdividerOPL.key')];
    operation.title = t('operations.createdividerOPL.title');

    return operation;
};
