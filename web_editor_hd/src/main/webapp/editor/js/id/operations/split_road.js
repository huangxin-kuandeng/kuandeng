//道路打断
iD.operations.SplitRoad = function (selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer(),
    var layer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId),
        action = iD.actions.SplitRoad(selectedIDs, context);

    function isTerminal(entity) {
        var parents = context.graph().parentWays(entity), isTer = false;
        parents.forEach(function (d, i) {
            if (d.first() === entity.id || d.last() === entity.id) isTer = true;
            if(!iD.Layers.getLayer(d.layerId, d.modelName).editable){
                isTer = true;
            }
        })
        return isTer;
    }

    function multipleNodes() {
        var isAllNode = true;
        _.uniq(selectedIDs).forEach(function (id) {
            var node = context.entity(id), geometry = context.geometry(id);
            // if(node.modelName !== "Highway" || geometry !== "vertex" || node.layerId !== layer.id){
            var ways = context.graph().parentWays(node);
            var way = ways[0];
            // if ((ways.length == 1 && way.last() == node.id && way.first() == node.id) || geometry !== "vertex") {
            if (geometry !== "vertex" && node.modelName == iD.data.DataType.ROAD_NODE) {
                isAllNode = false;
            }
        });
        return isAllNode;
    }

    var operation = function () {
        var annotation = t('operations.split.annotation.road');
        context.perform(action, annotation);
    };

    operation.available = function () {
        var entity = context.entity(selectedIDs[0]);
        if(entity.type != 'node'){
            return false
        }
        let parentways = context.graph().parentWays(entity);
        if(!parentways.length){
        	return false;
        }
        var isout = false;
        // 编辑范围判断
      //   parentways.forEach(function(d){
      //   	if(!iD.util.entityInPlyGon(d, context)){
      //   		isout = true;
	    	// 	return ;
	    	// }
      //   });
        if(isout) return false;
        // layer = parentways[0].layerInfo();
        if (parentways[0].modelName != iD.data.DataType.ROAD) return false;
        var isTerm = false;
        selectedIDs.forEach(function (id) {
            var entity = context.entity(id);
            if (isTerminal(entity)) isTerm = true;
        });
        if (isTerm) return false;
        if (multipleNodes()) return true && !operation.disabled();
    };

    operation.disabled = function () {
//      return !this.available();
        return false;
    };

    operation.tooltip = function () {
        return t('operations.split.description.road');
    };

    operation.id = 'split-road';
    operation.keys = [t('operations.split.key')];
    operation.title = t('operations.split.title');

    return operation;
} 