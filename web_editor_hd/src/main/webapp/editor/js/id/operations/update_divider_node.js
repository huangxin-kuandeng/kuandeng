/*
 * @Author: tao.w
 * @Date: 2020-02-23 18:42:18
 * @LastEditors: tao.w
 * @LastEditTime: 2020-03-20 16:48:40
 * @Description: 
 */
iD.operations.UpdateDividerNode = function(selectedIDs, context) {
    var annotation;
    var action = iD.actions.UpdateDividerNode(selectedIDs,context);

    var operation = function() {

        annotation = t('operations.update_divider_node.annotation' );

        var difference = context.perform(action, annotation);
        
        var survivor = context.entity(selectedIDs[0]);
		iD.logger.editElement({
			'tag':'update_divider_node',
			'entityId':survivor.osmId() || '',
			'modelName': survivor.modelName
		});			//点击更新车道分割线首尾点
		
        // context.enter(iD.modes.Select(context, difference.extantIDs()));
        context.event.entityedite({ entitys: selectedIDs });
        context.enter(iD.modes.Browse(context));
        context.buriedStatistics().merge(1,survivor.modelName,1000);
    };

    operation.available = function() {
        let isPlay = true,entity;
        selectedIDs.forEach(d=>{
            entity= context.entity(d);
            var modelConfig = iD.Layers.getLayer(entity.layerId);
            if(!modelConfig || !modelConfig.editable || entity.modelName != iD.data.DataType.DIVIDER){
                isPlay = false
            }
        })
        return  isPlay && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.update_divider_node.' + disable);
        }
        return t('operations.update_divider_node.description');
    };

    operation.id = 'update_divider_node';
    operation.keys = [t('operations.update_divider_node.key')];
    operation.title = t('operations.update_divider_node.title');

    return operation;
};
