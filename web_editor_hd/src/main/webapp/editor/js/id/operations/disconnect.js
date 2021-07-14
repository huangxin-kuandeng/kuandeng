iD.operations.Disconnect = function(selectedIDs, context) {
    var layer = context.layers().getLayer(context.entity(selectedIDs[0]).layerId);
    var dataType = selectedIDs.length && context.entity(selectedIDs[0]).modelName || '';
    if(!(dataType==iD.data.DataType.HIGHWAY||dataType==iD.data.DataType.WALKLINK)){
        dataType = "Others";
    }
    var  annotation = selectedIDs.length === 1 && dataType ?
        t('operations.disconnect.annotation.' + dataType) :
        t('operations.disconnect.description');

    var operation = function() {
        context.enter(iD.modes.DisconnectRoad(context));
    };

    operation.available = function() {
        //目前只针对普通线
        //且当前entity所属图层可编辑
        // var entity = context.entity(selectedIDs[0]);
        // var editable = iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
        if(selectedIDs.length !== 1) return false;//单选线

        var firstEntity = context.entity(selectedIDs[0]);

        var isWalkArea = firstEntity.modelName == iD.data.DataType.WALKAREA;
        if(firstEntity.type == "node" || context.isOneRoadCrossWay(firstEntity) || isWalkArea)return false;

        // if((firstEntity.layerInfo().isLine() || firstEntity.layerInfo().isRoad())&&
        //     firstEntity.layerInfo().enable){
        //     return editable&&true;
        // }
        return false && !operation.disabled();

    };

    operation.disabled = function() {

        return false;
    };

    operation.tooltip = function() {
        var disable = operation.disabled();
        return disable ?
            t('operations.disconnect.' + disable) :
            annotation;
    };

    operation.id = 'disconnect';
    operation.keys = [t('operations.disconnect.key')];
    operation.title = t('operations.disconnect.title');

    return operation;
};
