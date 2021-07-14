/**
 * Created by TildenDing on 2018/1/17.
 * 路口虚拟车道线半自动生成
 */
iD.operations.createdividerVirtualLane = function(selectedIDs, context) {
    var action = iD.actions.createdividerVirtualLane(selectedIDs,context);


    var operation = function() {
    	// 点击菜单中的此项后，会实际执行的代码
        var annotation = t('operations.createdividerVirtualLane.annotation.line');
        context.perform(action, annotation);
        context.enter(iD.modes.Browse(context));
        context.event.entityedite();
    };
	// 判断该项是否需要出现在菜单中
    operation.available = function() {
        if(selectedIDs.length != 2) return false;
        // if(iD.Task.d.tags.dbCode != 'fusion') return false;
        return false;
        /*var ways = [];
        var lay;
        var entity;
        selectedIDs.forEach(function (d, i) {
            entity = context.entity(d);
            lay = entity.layerInfo();
            if(!lay || !lay.editable){
            	return true;
            }
            if(entity.modelName == iD.data.DataType.OBJECT_PL 
        		|| (entity.modelName == iD.data.DataType.DIVIDER && entity.tags.R_LINE == "1")){
                ways.push(entity);
            }
        });*/
        // 在出现的菜单项中是否显示该操作
        return !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.createdividerVirtualLane.' + disable);
        }

        // var ways = action.ways(context.graph());
        // if (ways.length === 1) {
            return t('operations.createdividerVirtualLane.description.line');
        // } else {
        //     return t('operations.split.description.multiple');
        // }
    };

    operation.id = 'createdividerVirtualLane';
    operation.keys = [t('operations.createdividerVirtualLane.key')];
    operation.title = t('operations.createdividerVirtualLane.title');

    return operation;
};
