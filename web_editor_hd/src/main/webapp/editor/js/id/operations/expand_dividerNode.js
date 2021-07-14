/**
 * 车道线整体偏移
 * 上下，左右
 */
iD.operations.Expand_divider = function (selectedIDs, context) {
    // var layer = context.layers().getCurrentEnableLayer();
    var layer;
    var dividerExpandTip = iD.ui.DividerNodeExpandTip(context, {
    	distance: 0.0,
    	leftDistance: 0.0,
    	step: 1
    });
    //用来存储原始道路左右两边分别需要扩路的长度（单位米）
    var userInputParam = {'left': '', 'right': '', 'originalRoadTag': ''};
    var action = iD.actions.ExpandDividerNode(selectedIDs, context.projection, context);
    var annotation;
    var selectEntity;
    var operation = function () {

        annotation = t('operations.expand.offset-way');
        //弹出框：用户输入左右两边需要扩展的长度
        dividerExpandTip.perform(d3.select('body'), expandRoad);
        /*dividerExpandTip.on("close_expand_before", function(){
            context.pop();
        });*/
    };

    //执行道路扩展算法
    var expandRoad = function (userInputParam) {
        action.setUserInputParam(userInputParam);
        setAngleBaseLine();
        if(!userInputParam.originalRoadTag){
            context.enter(iD.modes.Browse(context));
        }
       /* context.replace(
            action,
            annotation);*/
        context.perform(
            action,
            annotation);
        
		context.event.entityedite({
            entitys: _.pluck(context.graph().parentWays(selectEntity), 'id')
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
    	if(entity.modelName != iD.data.DataType.DIVIDER_NODE || entity.tags.DASHTYPE != "1") return false;
    	var way = context.graph().parentWays(entity)[0];
    	var firstNodeId = way.first();
    	var firstNode = context.entity(firstNodeId);
    	var DA = context.graph().parentRelations(firstNode, iD.data.DataType.DIVIDER_ATTRIBUTE)[0];
    	if (!DA) return false;
    	else {
    	    if (DA.tags.TYPE != "5" && DA.tags.TYPE != "33") {
    	        return false;
            }
        }
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
        return t('operations.expand.offset-way');
    };

    operation.id = 'expand';
    operation.keys = [iD.ui.cmd('Z')];
    if(!layer) {
        operation.title = t('operations.expand.offset-way');
    }

    return operation;
}
