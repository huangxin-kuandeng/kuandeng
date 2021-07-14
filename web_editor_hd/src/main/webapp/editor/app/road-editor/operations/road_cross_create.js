/**
 * Created by wt on 2015/8/13.
 */
iD.operations.roadCrossCreate = function(selectedIDs, context) {
    var graph = context.graph();
    var layer = context.layers().getLayer(graph.entity(selectedIDs[0]).layerId);
    var annotation;

    var operation = function(){

    	var roadCrossNodes = [], roadNodeIds = [], roadNodes = [];
    	selectedIDs.forEach(function(nid){
    		let entity = graph.entity(nid);
    		if(entity.modelName == iD.data.DataType.C_NODE){
    			roadCrossNodes.push(entity);
    		}else{
    			roadNodeIds.push(entity.id);
    			roadNodes.push(entity);
    		}
    	});
    	
    	if(roadCrossNodes.length > 1){
    		Dialog.alert('只能为一个综合交叉点追加点');
    		return ;
    	}
    	let checkUnicomIds = [];
    	if(!roadCrossNodes[0]){
    		// 只框选了共用点，新增综合交叉点的情况
    		checkUnicomIds = roadNodeIds;
    	}else {
    		// 有C_NODE的情况
    		// C_NODE已经有了relation
    		var relation = graph.parentRelations(roadCrossNodes[0], iD.data.DataType.R_C_NODE_ROAD_NODE)[0];
    		if(relation){
    			checkUnicomIds = _.uniq( roadNodeIds.concat( _.pluck(relation.members, 'id') ) );
    		}else {
    			// C_NODE没有relation，是手动添加的C_NODE
    			checkUnicomIds = roadNodeIds;
    		}
    	}
		// 联通：十十，两个共用点有至少一条同一条线，算是联通
        if(!iD.util.roadCrossExtend.isUnicomOfArr(checkUnicomIds, context)){
            Dialog.alert('被综合的结点间道路不连通，不能创建该综合交叉点');
            return;
        }

        for(var i=0;i<roadNodes.length;i++)
        {
            var ways=[];
//          var node= graph.entity(roadNodeIds[i])
            var node= roadNodes[i];
            graph.parentWays(node).forEach(function(d){

                if(!d.isOneRoadCrossWay()){
                    return ways.push(d);
                }
            });
            if(ways.length<2)
            {
                Dialog.alert('悬挂点不能综合成综合交叉点');
                return;
            }
            var flag =false;
            graph.parentRelations(node).forEach(function(rel)
            {
                if(rel.tags&&rel.modelName==iD.data.DataType.R_C_NODE_ROAD_NODE)
                {
                    flag=true;
                }
            });
            if(flag)
            {
                Dialog.alert('选择的节点中已经被综合,请选择其它节点');
                context.enter(iD.modes.Browse(context));
                return;
            }
        }
        
        var action=iD.actions.RoadCrossAdd(context, roadNodeIds, roadCrossNodes[0]);
        
        if(!action.available())
        {
            context.enter(iD.modes.Browse(context));
            return;
        }
        context.perform(
            action,
            t('operations.add.annotation.point'));
        context.enter(iD.modes.Browse(context));
/*        if(action.crossRoadId())
        {
            context.enter(
                iD.modes.Select(context, [action.crossRoadId()])
                    .suppressMenu(true)
                    .newFeature(true));
        }else{
            context.enter(iD.modes.Browse(context));
        }*/

       /*

        // add way envent
        context.event.add({'type' : 'roadcross', 'entity' : node});

        if (layer.continues) context.enter(iD.modes.AddRoadCross(context));*/


    //执行道路扩展算法


    };

    operation.available = function(){
        //目前只针对普通线
        //且当前entity所属图层可编辑
        if (!layer || !layer.isRoad()){
            return false;
        }
        if(selectedIDs.length == 1) return false;//单选线
        for(var i=0;i<selectedIDs.length;i++)
        {
            var entity=context.graph().entity(selectedIDs[i]);
//          if(iD.data.DataType.ROAD_NODE!=entity.modelName)
            var modelConfig = iD.Layers.getLayer(entity.layerId, entity.modelName);
            if(!modelConfig.editable ||  !_.include([iD.data.DataType.ROAD_NODE ,iD.data.Constant.C_NODE], entity.modelName))
            {
                return false;
            }
        }
        return  !operation.disabled();
        // return iD.Static.layersInfo.isEditable(iD.data.Constant.C_NODE) && !operation.disabled();
    };
    operation.disabled = function(){
        return false;
    };
    operation.tooltip = function(){
        if (layer && layer.isRoad())
        {
            return t('operations.road_cross_create.description');
        }
    };
    operation.id = 'RoadCrossCreate';
    operation.keys = [iD.ui.cmd('R')];
    operation.title = t('operations.road_cross_create.title');
    return operation;
}