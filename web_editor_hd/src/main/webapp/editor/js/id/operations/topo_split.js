/**
 * Created by  on 2015/8/10.
 */
iD.operations.TopoSplit = function(selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer();
    var operation = function() {
        context.enter(iD.modes.TopoSplit(context,selectedIDs));
    };

    var layer = iD.Layers.getLayer(context.entity(selectedIDs[0]).layerId);

    operation.available = function() {
       if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        //目前只针对普通线
        //且当前entity所属图层可编辑
        var graph = context.graph();
        var entity = context.entity(selectedIDs[0]);
        if(entity.tags.FORM_WAY=="2"||entity.modelName != iD.data.DataType.HIGHWAY) return false;         //内部道路禁止拓扑分离
        var editable =iD.Layers.getLayer(entity.layerId, entity.modelName).editable;  //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
        if(selectedIDs.length !== 1) return false;//单选线

        var firstEntity = context.entity(selectedIDs[0]),
            lay = iD.Layers.getLayer(firstEntity.layerId),
            modelConfig = iD.Layers.getLayer(firstEntity.layerId, firstEntity.modelName);

        if(firstEntity.type == "node" || context.isOneRoadCrossWay(firstEntity))return false;

        if((lay.isLine() || lay.isRoad())&&
            modelConfig.editable){
            var fNodeEntity = graph.entity(entity.nodes[0]);
            var tNodeEntity = graph.entity(entity.nodes[entity.nodes.length-1]);
            var parentWaysA = graph.parentWays(fNodeEntity);
            var parentWaysB = graph.parentWays(tNodeEntity);
            return editable&&(parentWaysA.length>1||parentWaysB.length>1) && true && !operation.disabled();
        }
        return false && !operation.disabled();
    };

    operation.disabled = function() {
        return false;
    };

    operation.tooltip = function(){
        if (layer && layer.isRoad())
            return t('operations.topo_split.description-road');
        else if (layer && layer.isLine())
            return t('operations.topo_split.description-way');
    };

    operation.id = 'topo_split';
    operation.keys = [iD.ui.cmd('T')];
    if (layer && layer.isRoad())
        operation.title = t('operations.topo_split.title-road');
    else if (layer && layer.isLine())
        operation.title = t('operations.topo_split.title-way');

    return operation;
};