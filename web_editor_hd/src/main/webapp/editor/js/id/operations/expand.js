/**
 * Created by wt on 2015/7/30.
 */
iD.operations.Expand = function (selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer();
    var layer;
    var roadExpandTip = iD.ui.RoadExpandTip(context, {
    	distance: 3.8,
    	leftDistance: 0.0,
    	step: 1.0
    });
    //用来存储原始道路左右两边分别需要扩路的长度（单位米）
    var userInputParam = {'left': '', 'right': '', 'originalRoadTag': ''};
    var action = iD.actions.ExpandRoad(selectedIDs, context.projection, context);
    var annotation;
    var selectEntity;
    var operation = function () {

        if (layer.isRoad()) {
            annotation = t('operations.expand.annotation-road');
        } else if (layer.isLine()) {
            annotation = t('operations.expand.annotation-way'); 
        } else if (layer.isArea()){
            annotation = t('operations.expand.annotation-area');
        }
        //弹出框：用户输入左右两边需要扩展的长度
        roadExpandTip.perform(d3.select('body'), expandRoad);

    };

    //执行道路扩展算法
    var expandRoad = function (userInputParam) {
        action.setUserInputParam(userInputParam);
        setAngleBaseLine();
        if(!userInputParam.originalRoadTag){
            context.enter(iD.modes.Browse(context));
        }
        var entity = context.entity(selectedIDs[0]);
        if(entity instanceof iD.Way){
            action.setModelName(entity.modelName, entity.modelName+"_NODE");
        }
        context.perform(
            action,
            annotation);
        
        var result = action.getResult();
        var created = result && result.all && result.all[0];
		context.event.entityedite({
            entitys: created && [created.id] || []
        });
    };
    
    /**
     * 地面要素扩路
     * 非地面要素时不执行
     */
    function setAngleBaseLine(){
    	var areaRect = iD.picUtil.getRectangleBounding(selectEntity);
    	if(!areaRect){
    		return ;
    	}
        // 视频后方
        var locA = iD.geo.Extent(areaRect.bottom[0].loc, areaRect.bottom[1].loc).center();
        // 视频前方
        var locB = iD.geo.Extent(areaRect.top[0].loc, areaRect.top[1].loc).center();
        
        action.setAngleBaseLine([locA, locB]);
    }
    
    var isEditable = function(_){
        var editable = true;
        for (var i = 0; i < _.length; i++) {
            var entity = context.graph().entity(_[i]),
                modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            editable = modelConfig && modelConfig.editable; //iD.Static.layersInfo.isEditable(entity.tags?entity.modelName:false);
            if(!editable) return false;
        }
        return editable;
    }

    operation.available = function () {
    	if(selectedIDs.length != 1) return false;
        var entity = context.entity(selectedIDs[0]);
        // 面类型复制；
        if(!entity.isArea || !entity.isArea()){
            return false;
        }
        var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
        if(!modelConfig || !modelConfig.editable) return false;
        if(!iD.picUtil.checkNodeIsGroundArea(entity.id)) return false;
        
        layer = iD.Layers.getLayer(entity.layerId);
        selectEntity = entity;
        
    	return !operation.disabled();
//  	return false;
    	// 由于没有测量信息，去掉扩路功能；
    	/*
        if(!(iD.Task.working&&iD.Task.working.task_id ==iD.Task.d.task_id)) return false;
        var entity = context.entity(selectedIDs[0]);
        if(entity.modelName!=iD.data.DataType.DIVIDER && entity.modelName != iD.data.DataType.ROAD) return false;
        // var editable = iD.Static.layersInfo.isEditable(entity.modelName?entity.modelName:false);
        var editable = isEditable(selectedIDs);
        if (selectedIDs.length < 1) {
            return false;
        }
        var count = 0;
        for (var i = 0; i < selectedIDs.length; i++) {
            var selectedID = selectedIDs[i];
            var firstEntity = context.graph().entity(selectedID),
                lay = iD.Layers.getLayer(firstEntity.layerId),
                modelConfig = iD.Layers.getLayer(firstEntity.layerId, firstEntity.modelName);
            if (firstEntity.type == "node" || context.isOneRoadCrossWay(firstEntity)) return false;
            if (lay.isLine() &&
                modelConfig.editable) {
                count++;
            }
        }
        return editable&&count >= 1 && !operation.disabled();
        */
    };
    operation.disabled = function () {
        return false;
    };
    operation.tooltip = function () {
        if (layer.isRoad())
            return t('operations.expand.description-road');
        else if (layer.isLine())
            return t('operations.expand.description-way');
        else if (layer.isArea())
            return t('operations.expand.description-area');
    };

    operation.id = 'expand';
    operation.keys = [iD.ui.cmd('Z')];
    if(!layer){
        operation.title = t('operations.expand.title-road');
    }else if (layer.isRoad())
        operation.title = t('operations.expand.title-road');
    else if (layer.isLine())
        operation.title = t('operations.expand.title-way');

    return operation;
}
