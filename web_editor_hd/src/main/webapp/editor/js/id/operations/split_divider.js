//车道线打断
iD.operations.SplitDivider = function(selectedIDs, context) {

    var vertices = _.filter(selectedIDs, function vertex(entityId) {
        return context.geometry(entityId) === 'vertex';
    });

    var entityId = vertices[0],
        action = iD.actions.SplitDivider(entityId,context);

    var operation = function() {
        var annotation;

		iD.logger.editElement({
            'tag': "menu_splitDivider"
        });			//点击打断操作时增加埋点
        var ways = action.ways(context.graph());
        if (ways.length === 1) {
            annotation = t('operations.split.annotation.line');
        } else {
            annotation = t('operations.split.annotation.multiple', {n: ways.length});
        }

        var difference = context.perform(action, annotation);
        // context.enter(iD.modes.Select(context, difference.extantIDs()));
        context.enter(iD.modes.Browse(context));
        context.event.entityedite({entitys: []});
        
    };

    operation.available = function() {
        
        if(selectedIDs.length >1) return false;
    	var entity = context.entity(selectedIDs[0]),
    			modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
    	if (context.isRoadCross(entity)) return false;
    	if(!(entity instanceof iD.Node)){
    	    return false;
        }
    	if(entity.modelName !== iD.data.DataType.DIVIDER_NODE){
            return false
        }
    	var parents = context.graph().parentWays(entity);
    	if(!parents.length){
    		return false;
    	}
    	var isPlay = true, parentWay=parents[0];
        parents.forEach(function (d, i) {
            // 编辑范围判断
            if(d.modelName == iD.data.DataType.DIVIDER && iD.util.dividerIsDashedOut(context, d)){
                // 虚线
                let allOut = true;
                for(let node of context.childNodes(d)){
                    if(iD.util.nodeInPlyGonx(node, context)){
                        allOut = false;
                        break;
                    }
                }
                if(allOut){
                    isPlay = false;
                    return false;
                }
            }else {
                if(!iD.util.entityInPlyGon(d, context)){
                    isPlay = false;
                    return false;
                }
            }
            if (iD.Layers.getLayer(d.layerId, d.modelName).editable &&
                (d.first() === entity.id || d.last() === entity.id)) {
                isPlay = false;
            }
        })
    	if (!isPlay) return false;
    	
        return !parentWay.isArea() && modelConfig.editable && vertices.length === 1 && !operation.disabled();
    };

    operation.disabled = function() {
        return action.disabled(context.graph());
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        if (disable) {
            return t('operations.split.' + disable);
        }

        var ways = action.ways(context.graph());
        if (ways.length === 1) {
            return t('operations.split.description.line');
        } else {
            return t('operations.split.description.multiple');
        }
    };

    operation.id = 'split';
    operation.keys = [t('operations.split.key')];
    operation.title = t('operations.split.title');

    return operation;
};
