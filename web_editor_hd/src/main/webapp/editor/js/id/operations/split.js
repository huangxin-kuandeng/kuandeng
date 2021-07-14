//线打断
iD.operations.Split = function(selectedIDs, context) {
	// var layer = context.layers().getCurrentEnableLayer(),
    var aType ='line'; //layer.isArea() ? 'area' : (layer.isRoad() ? 'road' : (layer.isLine() ? 'line' : 'multiple'));
    var vertices = _.filter(selectedIDs, function vertex(entityId) {
        return context.geometry(entityId) === 'vertex';
    });

    var entityId = vertices[0],
        action = iD.actions.Split(entityId);

    if (selectedIDs.length > 1) {
        action.limitWays(_.without(selectedIDs, entityId));
    }

    var operation = function() {
        var annotation;
        var ways = action.ways(context.graph());
        ways.forEach(function(d){
            if(d.modelName != iD.data.DataType.OBJECT_PL) return ;
            iD.logger.editElement({
                'tag': "split_divider",
                'modelName': d.modelName,
                'entityId': d.osmId()
            });
        });
        if (ways.length === 1) {
            annotation = t('operations.split.annotation.' + aType);
        } else {
            annotation = t('operations.split.annotation.multiple', {n: ways.length});
        }

        var difference = context.perform(action, annotation);
        context.event.entityedite({
        	entitys: []
        });
        context.enter(iD.modes.Select(context, difference.extantIDs()));
    };

    operation.available = function() {

    	var entity = context.entity(selectedIDs[0]),
    			modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
    	if (context.isRoadCross(entity)) return false;
    	if(!(entity instanceof iD.Node)){
    	    return false;
        }
    	
    	var parents = context.graph().parentWays(entity);
    	if(!parents.length){
    		return false;
    	}
    	var isPlay = true, parentWay=parents[0];
        parents.forEach(function (d, i) {
        	// 编辑范围判断
        	if(!iD.util.entityInPlyGon(d, context)){
        		isPlay = false;
        		return ;
        	}
            if (iD.Layers.getLayer(d.layerId, d.modelName).editable &&
                (d.first() === entity.id || d.last() === entity.id)) {
                isPlay = false;
            }
        })
        if([
            iD.data.DataType.DIVIDER_NODE,
            iD.data.DataType.ROAD_NODE,
            iD.data.DataType.HD_LANE_NODE
        ].includes(entity.modelName)){
            return false;
        }

    	// // (layer.isRoad() || layer.isLine()) && parents.forEach(function (d, i) {
        // parentWay.modelName == iD.data.DataType.ROAD  && parents.forEach(function (d, i) {
    	// 	if (!(d.first() === entity.id || d.last() === entity.id)) isPlay = false;
    	// })
    	// if (!isPlay) return false;
    	
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
            return t('operations.split.description.' + aType);
        } else {
            return t('operations.split.description.multiple');
        }
    };

    operation.id = 'split';
    operation.keys = [t('operations.split.key')];
    operation.title = t('operations.split.title');

    return operation;
};
