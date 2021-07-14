/**
 * Created by wt on 2015/8/13.
 */
iD.operations.roadCrossModify = function(selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer();
    var layer = context.layers().getLayer(context.graph().entity(selectedIDs[0]).layerId);
    var annotation;

    var operation = function(){
        context.enter(
            iD.modes.RoadCrossModify(context,selectedIDs));
       /* context.enter(
            iD.modes.Select(context, [node.id])
                .suppressMenu(true)
                .newFeature(true));

        // add way envent
        context.event.add({'type' : 'roadcross', 'entity' : node});

        if (layer.continues) context.enter(iD.modes.AddRoadCross(context));*/


    //执行道路扩展算法


    };

    operation.available = function(){
        //目前只针对普通线
        //且当前entity所属图层可编辑
        if (!layer || (layer && !layer.isRoad())){
            return false;
        }
        if(selectedIDs.length!= 1) return false;//单选线
        var entity=context.graph().entity(selectedIDs[0]);
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        return iD.data.Constant.C_NODE==entity.modelName && modelConfig.editable && !operation.disabled();
        // return iD.data.Constant.C_NODE==entity.modelName && iD.Static.layersInfo.isEditable(iD.data.Constant.C_NODE) && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        if (layer.isRoad())
        {
            return t('operations.road_cross_edit.description');
        }
    };
    operation.id = 'RoadCrossEdit';
    operation.keys = [iD.ui.cmd('F')];
    operation.title = t('operations.road_cross_edit.title');
    return operation;
}