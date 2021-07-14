/**
 * 平行方向复制
 * @param {[type]} selectedIDs [description]
 * @param {[type]} context     [description]
 */
iD.operations.Clone = function(selectedIDs, context) {
    var action = iD.actions.CloneMultiple(selectedIDs,context.projection,context);
    var layer = iD.Layers.getLayer(context.entity(selectedIDs[0]).layerId);

    var operation = function(){
        var annotation;
        if (layer.isRoad()) {
            annotation = t('operations.clone.annotation-road');
        } else if (layer.isLine()) {
            annotation = t('operations.clone.annotation-way');
        }
        context.perform(
            action,
            annotation);
    };

	operation.available = function(){
		//目前只针对普通线
		//且当前entity所属图层可编辑
        return false ;  //屏蔽该功能，没有该功能的需求

		if(selectedIDs.length !== 1) return false;//单选线

		var firstEntity = context.entity(selectedIDs[0]);
		
		if(firstEntity.type == "node" || context.isOneRoadCrossWay(firstEntity))return false;
		
		// if((firstEntity.layerInfo().isLine() || firstEntity.layerInfo().isRoad())&&
		// 	firstEntity.layerInfo().enable){
		// 	return true && !operation.disabled();
		// }
		return false;
	};
	operation.disabled = function(){
		return false;
	};
	operation.tooltip = function(){
		if (layer.isRoad()) 
			return t('operations.clone.description-road');
		else if (layer.isLine())
			return t('operations.clone.description-way');
	};

	operation.id = 'clone';
	operation.keys = [iD.ui.cmd('L')];
	if (layer && layer.isRoad())
		operation.title = t('operations.clone.title-road');
	else if (layer && layer.isLine())
		operation.title = t('operations.clone.title-way');

	return operation;
}